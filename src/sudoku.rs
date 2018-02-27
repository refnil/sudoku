use rand::Rng;

use consts::*;
use types::{Entry, PubEntry, BlockFormatParseError, LineFormatParseError, NotEnoughRows};
use solver::{SudokuSolver, SudokuSolver2};

use std::{fmt, slice, iter, hash, cmp};
#[cfg(feature="serde")] use ::serde::{de, Serialize, Serializer, Deserialize, Deserializer};

/// The main structure exposing all the functionality of the library
/// Sudokus can be parsed in either the line format or the block format
///
/// line format:
///
/// `..3.2.6..9..3.5..1..18.64....81.29..7.......8..67.82....26.95..8..2.3..9..5.1.3.. optional comment`
///
/// block format:
///
/// ```text
/// __3_2_6__ optional comment
/// 9__3_5__1 another comment
/// __18_64__
/// __81_29__
/// 7_______8
/// __67_82__
/// __26_95__
/// 8__2_3__9
/// __5_1_3__
/// ```
///
/// alternatively also with field delimiters
///
/// ```text
/// __3|_2_|6__ optional comment
/// 9__|3_5|__1 another comment
/// __1|8_6|4__
/// ---+---+--- comment: "-----------", i.e. '-' 11 times is also allowed
/// __8|1_2|9__          but has to be consistent
/// 7__|___|__8
/// __6|7_8|2__
/// ---+---+---
/// __2|6_9|5__
/// 8__|2_3|__9
/// __5|_1_|3__
/// ```
///
/// `'_'`, `'.'` and `'0'` are accepted interchangeably as unfilled cells
#[derive(Copy, Clone)]
pub struct Sudoku(pub(crate) [u8; 81]);

#[cfg(feature="serde")]
impl Serialize for Sudoku {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer
	{
		if serializer.is_human_readable() {
			serializer.serialize_str(&self.to_str_line())
		} else {
			serializer.serialize_bytes(&self.0)
		}
	}
}

// Visitors for serde
#[cfg(feature="serde")] struct ByteSudoku; // 81 byte format
#[cfg(feature="serde")] struct StrSudoku;  // 81 char format (line sudoku)

#[cfg(feature="serde")]
impl<'de> de::Visitor<'de> for ByteSudoku {
	type Value = Sudoku;
	fn expecting(&self, formatter: &mut ::core::fmt::Formatter) -> ::core::fmt::Result {
		write!(formatter, "81 numbers from 0 to 9 inclusive")
	}

	fn visit_bytes<E>(self, v: &[u8]) -> Result<Self::Value, E>
	where
    	E: de::Error,
	{
		// FIXME: return proper error
		Sudoku::from_bytes_slice(v).map_err(|_| {
			E::custom("byte array has incorrect length or contains numbers not from 0 to 9")
		})
	}
}

#[cfg(feature="serde")]
impl<'de> de::Visitor<'de> for StrSudoku {
	type Value = Sudoku;
	fn expecting(&self, formatter: &mut ::core::fmt::Formatter) -> ::core::fmt::Result {
		write!(formatter, "81 numbers from 0 to 9 inclusive")
	}

	fn visit_str<E>(self, v: &str) -> Result<Self::Value, E>
	where
    	E: de::Error,
	{
		Sudoku::from_str_line(v).map_err(E::custom)
	}
}

#[cfg(feature="serde")]
impl<'de> Deserialize<'de> for Sudoku {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>
	{
		if deserializer.is_human_readable() {
			deserializer.deserialize_str(StrSudoku)
		} else {
			deserializer.deserialize_bytes(ByteSudoku)
		}
	}
}

impl PartialEq for Sudoku {
	fn eq(&self, other: &Sudoku) -> bool {
		self.0[..] == other.0[..]
	}
}

/// The ordering is lexicographical in the cells of the sudoku
/// going from left to right, top to bottom
impl PartialOrd for Sudoku {
	fn partial_cmp(&self, other: &Self) -> Option<cmp::Ordering> {
		// deref into &str and cmp
		self.0.partial_cmp(&other.0)
	}
}

impl Ord for Sudoku {
	fn cmp(&self, other: &Self) -> cmp::Ordering {
		// deref into &str and cmp
		self.0.cmp(&other.0)
	}
}

impl hash::Hash for Sudoku {
    fn hash<H>(&self, state: &mut H)
    where
        H: hash::Hasher
	{
		self.0.hash(state)
	}
}

impl Eq for Sudoku {}

impl fmt::Debug for Sudoku {
	fn fmt(&self, fmt: &mut fmt::Formatter) -> Result<(), fmt::Error> {
		self.0.fmt(fmt)
	}
}

pub type Iter<'a> = iter::Map<slice::Iter<'a, u8>, fn(&u8)->Option<u8>>; // Iter over Sudoku cells

impl Sudoku {
	/// Generate a random, solved sudoku
	pub fn generate_filled() -> Self {
		// fill first row with a permutation of 1...9
		// not necessary, but ~15% faster
		let mut stack = Vec::with_capacity(81);
		let mut perm = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		::rand::thread_rng().shuffle(&mut perm);

		stack.extend(
			(0..9).zip(perm.iter())
				.map(|(cell, &num)| Entry { cell, num })
		);

		SudokuSolver::new()
			.randomized_solve_one(&mut stack)
			.unwrap()
	}

	/// Generate a random, uniquely solvable sudoku
	/// The puzzles are minimal in that no cell can be removed without losing uniquess of solution
	/// Most puzzles generated by this are easy
	pub fn generate_unique() -> Self {
		Sudoku::generate_unique_from( Sudoku::generate_filled() )
	}

	/// Generate a random, uniqely solvable sudoku
	/// that has the same solution as the given `sudoku` by removing the contents of some of its cells.
	/// The puzzles are minimal in that no cell can be removed without losing uniquess of solution.
	/// Most puzzles generated by this are easy.
	///
	/// If the source `sudoku` is invalid or has multiple solutions, it will be returned as is.
	pub fn generate_unique_from(mut sudoku: Sudoku) -> Self {
		// this function is following
		// the approach outlined here: https://stackoverflow.com/a/7280517
		//
		// delete numbers from a filled sudoku cells in random order
		// after each deletion check for unique solvability
		// and backtrack on error

		// generate random order
		let mut cell_order = [0; 81];
		cell_order.iter_mut()
			.enumerate()
			.for_each(|(cell, place)| *place = cell);
		::rand::thread_rng().shuffle(&mut cell_order);

		// remove cell content if possible without destroying uniqueness of solution
		const CUTOFF: usize = 20;
		let mut sudoku_tmp = sudoku;
		for &cell in &cell_order[..CUTOFF] {
			sudoku_tmp.0[cell] = 0;
		}
		if sudoku_tmp.is_uniquely_solvable() {
			sudoku = sudoku_tmp;
		} else {
			for &cell in &cell_order[..CUTOFF] {
				let mut sudoku_tmp = sudoku;
				sudoku_tmp.0[cell] = 0;
				if sudoku_tmp.is_uniquely_solvable() {
					sudoku = sudoku_tmp;
				}
			}
		}

		let mut n_cell = CUTOFF;
		while n_cell < 50 {
			let mut sudoku_tmp = sudoku;
			let cell1 = cell_order[n_cell];
			let cell2 = cell_order[n_cell+1];
			sudoku_tmp.0[cell1] = 0;
			sudoku_tmp.0[cell2] = 0;
			if sudoku_tmp.is_uniquely_solvable() {
				// both numbers can be left out
				sudoku = sudoku_tmp;
				n_cell += 2;
				continue
			}

			sudoku_tmp.0[cell2] = sudoku.0[cell2];
			if sudoku_tmp.is_uniquely_solvable() {
				// first number can be left out
				sudoku = sudoku_tmp;
				n_cell += 2;
				continue
			}

			sudoku_tmp.0[cell1] = sudoku.0[cell1];
			sudoku_tmp.0[cell2] = 0;
			if sudoku_tmp.is_uniquely_solvable() {
				// second number can be left out
				sudoku = sudoku_tmp;
			}

			// no number can be left out;
			n_cell += 2;
		}

		for &cell in &cell_order[50..] {
			let mut sudoku_tmp = sudoku;
			sudoku_tmp.0[cell] = 0;
			if sudoku_tmp.is_uniquely_solvable() {
				sudoku = sudoku_tmp;
			}
		}

		sudoku
	}

	/// Creates a sudoku from a byte slice.
	/// All numbers must be below 10. Empty cells are denoted by 0, clues by the numbers 1-9.
	/// The slice must be of length 81.
	pub fn from_bytes_slice(bytes: &[u8]) -> Result<Sudoku, ()> {
			if bytes.len() != 81 { return Err(()) }
			let mut sudoku = Sudoku([0; 81]);

			match bytes.iter().all(|&byte| byte <= 9) {
				true => {
					sudoku.0.copy_from_slice(bytes);
					Ok(sudoku)
				},
				false => Err(())
			}
	}

	/// Creates a sudoku from a byte array.
	/// All numbers must be below 10. Empty cells are denoted by 0, clues by the numbers 1-9.
	pub fn from_bytes(bytes: [u8; 81]) -> Result<Sudoku, ()> {
			match bytes.iter().all(|&byte| byte <= 9) {
				true => Ok(Sudoku(bytes)),
				false => Err(()),
			}
	}

	/// Reads a sudoku in the line format
	/// Stops parsing after the first sudoku
	pub fn from_str_line(s: &str) -> Result<Sudoku, LineFormatParseError> {
		let chars = s.as_bytes();
		let mut grid = [0; N_CELLS];
		let mut i = 0;
		for (cell, &ch) in grid.iter_mut().zip(chars) {
			match ch {
				b'_' | b'.' => *cell = 0,
				b'0' ... b'9' => *cell = ch - b'0',
				// space ends sudoku before grid is filled
				b' ' | b'\t' => return Err(LineFormatParseError::NotEnoughCells(i)),
				_ => return Err(
					LineFormatParseError::InvalidEntry(
						PubEntry {
							cell: i,
							ch: s[i as usize..].chars().next().unwrap(),
						}
					)
				),
			}
			i += 1;
		}

		if i != 81 {
			return Err(LineFormatParseError::NotEnoughCells(i))
		}

		// if more than 81 elements, sudoku must be delimited
		if let Some(&ch) = chars.get(81) {
			match ch {
				// delimiters, end of sudoku
				b'\t' | b' ' | b'\r' | b'\n' => (),
				// valid cell entry => too long
				b'_' | b'.' | b'0'...b'9' => {
					return Err(LineFormatParseError::TooManyCells)
				},
				// any other char can not be part of sudoku
				// without having both length and character wrong
				// treat like comment, but with missing delimiter
				_ => return Err(LineFormatParseError::MissingCommentDelimiter),
			}
		}

		Ok(Sudoku(grid))
	}

	/// Reads a sudoku in the block format with or without field delimiters
	/// Stops parsing after the first sudoku
	pub fn from_str_block(s: &str) -> Result<Sudoku, BlockFormatParseError> {
		let mut grid = [0; N_CELLS];
		#[derive(PartialEq)]
		enum Format {
			Unknown,
			Delimited,
			DelimitedPlus,
			Bare,
		}
		let mut format = Format::Unknown;

		// Read a row per line
		let mut n_line_sud = 0;
		for (n_line_str, line) in s.lines().enumerate() {
			// if sudoku complete
			// enforce empty line (whitespace ignored)
			// Maybe allow comment lines in the future
			if n_line_sud == 9 {
				match line.trim().is_empty() {
					true => break,
					false => return Err(BlockFormatParseError::TooManyRows),
				}
			}

			// if delimited, check horizontal field delimiters and skip over line
			if (format == Format::Delimited || format == Format::DelimitedPlus)
			&& (n_line_str == 3 || n_line_str == 7)
			{
				if n_line_str == 3 && (line.starts_with("---+---+---") || line.starts_with("---+---+--- ")) {
					format = Format::DelimitedPlus;
				}
				if format == Format::Delimited {
					match !(line.starts_with("-----------") || line.starts_with("----------- ")) {
						true  => return Err(BlockFormatParseError::IncorrectFieldDelimiter),
						false => continue,
					}
				}
				if format == Format::DelimitedPlus {
					match !(line.starts_with("---+---+---") || line.starts_with("---+---+--- ")) {
						true  => return Err(BlockFormatParseError::IncorrectFieldDelimiter),
						false => continue,
					}
				}
			}

			let mut n_col_sud = 0;
			for (str_col, ch) in line.chars().enumerate() {
				// if line complete
				if n_col_sud == 9 {
					match ch {
						// comment separator
						' ' | '\t' => break,
						// valid entry, line too long
						'1'...'9' | '_' | '.' | '0'   => return Err(BlockFormatParseError::InvalidLineLength(n_line_sud)),
						// invalid entry, interpret as comment but enforce separation
						_ => return Err(BlockFormatParseError::MissingCommentDelimiter(n_line_sud))
					}
				}

				// if in place of vertical field delimiters
				if str_col == 3 || str_col == 7 {
					// Set parse mode on 4th char in 1st line
					if format == Format::Unknown {
						format = if ch == '|' { Format::Delimited } else { Format::Bare };
					}
					// check and skip over delimiters
					if format == Format::Delimited || format == Format::DelimitedPlus {
						match ch {
							'|'  => continue,
							_    => return Err(BlockFormatParseError::IncorrectFieldDelimiter),
						}
					}
				}

				let cell = n_line_sud * 9 + n_col_sud;
				match ch {
					'_' | '.' => grid[cell as usize] = 0,
					'0'...'9' => grid[cell as usize] = ch as u8 - b'0',
					_ => return Err(BlockFormatParseError::InvalidEntry(PubEntry{cell: cell as u8, ch })),
				}
				n_col_sud += 1;
			}
			if n_col_sud != 9 {
				return Err(BlockFormatParseError::InvalidLineLength(n_line_sud))
			}

			n_line_sud += 1;
		}
		if n_line_sud != 9 {
			return Err(BlockFormatParseError::NotEnoughRows(n_line_sud+1)) // number of rows = index of last + 1
		}
		Ok(Sudoku(grid))
	}

	/// Reads a sudoku in a variety of block formats, applying few constraints.
	/// '_', '.' and '0' are treated as empty cells. '1' to '9' as clues. Each line needs to have 9 valid cells.
	/// Lines that don't contain 9 valid entries are ignored.
	/// Stops parsing after the first sudoku. Due to the lax format rules, the only failure that can occur
	/// is that there are not enough rows.
	//pub fn from_str_block_permissive<CP>(s: &str, mut matches_empty_cell: CP) -> Result<Sudoku, BlockFormatParseError>
	//	where CP: CharPattern,
	pub fn from_str_block_permissive(s: &str) -> Result<Sudoku, NotEnoughRows>
	{
		let mut grid = [0; N_CELLS];

		let mut valid_rows = 0;
		for line in s.lines() {
			let mut row_vals = [0; 9];
			let mut nums_in_row = 0;
			for ch in line.chars() {
				if ['.', '_'].contains(&ch) {
					row_vals[nums_in_row] = 0;
					nums_in_row += 1;
				} else if '0' <= ch && ch <= '9' {
					row_vals[nums_in_row] = ch as u8 - b'0';
					nums_in_row += 1;
				}
				// full sudoko row, write to grid
				// ignore anything after in same row
				if nums_in_row == 9 {
					grid[valid_rows*9..valid_rows*9 + 9].copy_from_slice(&row_vals);
					valid_rows += 1;
					break
				}
			}
			if valid_rows == 9 {
				return Ok(Sudoku(grid))
			}
		}
		Err(NotEnoughRows(valid_rows as u8))
	}

	/// Try to find a solution to the sudoku and fill it in. Return true if a solution was found.
	/// This is a convenience interface. Use one of the other solver methods for better error handling
	pub fn solve(&mut self) -> bool {
		match self.clone().solve_one() {
			Some(solution) => {
				*self = solution;
				true
			},
			None => false,
		}
	}

	/// Find a solution to the sudoku. If multiple solutions exist, it will not find them and just stop at the first.
	/// Return `None` if no solution exists.
    pub fn solve_one(self) -> Option<Sudoku> {
		self.solve_at_most(1)
			.into_iter()
			.next()
    }

    /// Solve sudoku and return solution if solution is unique.
	pub fn solve_unique(self) -> Option<Sudoku> {
		// without at least 8 digits present, sudoku has multiple solutions
		// bitmask
		let mut nums_contained: u16 = 0;
		// same with less than 17 clues
		let mut n_clues = 0;
		self.iter()
			.filter_map(|id| id)
			.for_each(|num| {
				nums_contained |= 1 << num;
				n_clues += 1;
			});
		if n_clues < 17 || nums_contained.count_ones() < 8 {
			return None
		};

		let solutions = self.solve_at_most(2);
		match solutions.len() == 1 {
			true => solutions.into_iter().next(),
			false => None,
		}
	}

	/// Counts number of solutions to sudoku up to `limit`
	/// This solves the sudoku but does not return the solutions which allows for slightly faster execution.
	pub fn count_at_most(self, limit: usize) -> usize {
		SudokuSolver2::from_sudoku(self)
			.ok()
			.map_or(0, |solver| solver.count_at_most(limit))
	}

	/// Checks whether sudoku has one and only one solution.
	/// This solves the sudoku but does not return the solution which allows for slightly faster execution.
	pub fn is_uniquely_solvable(self) -> bool {
		self.count_at_most(2) == 1
	}

	/// Solve sudoku and return the first `limit` solutions it finds. If less solutions exist, return only those. Return `None` if no solution exists.
	/// No specific ordering of solutions is promised. It can change across versions.
    pub fn solve_at_most(self, limit: usize) -> Vec<Sudoku> {
		/*
		let solver = SudokuSolver::new();
		let stack = SudokuSolver::stack_from_sudoku(self);
		solver.solve_at_most(stack, limit)
		*/
		SudokuSolver2::from_sudoku(self)
			.ok()
			.map_or(vec![], |solver| solver.solve_at_most(limit))
			//.map_or_else(|| panic!("valid sudoku marked invalid"), |solver| solver.solve_at_most(limit))
			// FIXME: remove ^^
	}

	/// Check whether the sudoku is solved.
	pub fn is_solved(&self) -> bool {
		let mut solver = SudokuSolver::new();
		let mut entries = self.iter()
			.enumerate()
			.flat_map(|(i, num)| num.map(|n| Entry { cell: i as u8, num: n }))
			.collect();
		// if sudoku contains an error, batch_insert_entries returns Err(Unsolvable) and
		// will not insert all 81 entries. Consequently solver.is_solved() will
		// return false
		let _ = solver.batch_insert_entries(&mut entries);
		solver.is_solved()
	}

    /// Returns an Iterator over sudoku, going from left to right, top to bottom
    pub fn iter(&self) -> Iter {
        self.0.iter().map(num_to_opt)
    }

	/// Returns a byte array for the sudoku.
	/// Empty cells are denoted by 0, clues by the numbers 1-9.
	pub fn to_bytes(self) -> [u8; 81] {
		self.0
	}

	/// Returns a representation of the sudoku in line format that can be printed
	/// and which derefs into a &str
	///
	/// ```
	/// use sudoku::Sudoku;
	///
	/// let mut grid = [0; 81];
	/// grid[3] = 5;
	/// let sudoku = Sudoku::from_bytes(grid).unwrap();
	/// let line = sudoku.to_str_line(); // :SudokuLine
	/// println!("{}", line);
	///
	/// let line_str: &str = &line;
	/// assert_eq!(
	///		"...5.............................................................................",
	///     line_str
	///	);
	/// ```
	pub fn to_str_line(&self) -> SudokuLine {
		let mut chars = [0; 81];
		for (char_, entry) in chars.iter_mut().zip(self.iter()) {
			*char_ = match entry {
				Some(num) => num + b'0',
				None => b'.',
			};
		}
		SudokuLine(chars)
	}
}

fn num_to_opt(num: &u8) -> Option<u8> {
	if *num == 0 { None } else { Some(*num) }
}

impl fmt::Display for Sudoku {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		for entry in self.0.iter().enumerate().map(|(cell, &num)| Entry { cell: cell as u8, num: num } ) {
			try!( match (entry.row(), entry.col()) {
				(_, 3) | (_, 6) => write!(f, " "),    // seperate fields in columns
				(3, 0) | (6, 0) => write!(f, "\n\n"), // separate fields in rows
				(_, 0)          => write!(f, "\n"),   // separate lines not between fields
				_ => Ok(()),
			});
			//try!(
            try!( match entry.num() {
                0 => write!(f, "_"),
                1...9 => write!(f, "{}", entry.num()),
                _ => unreachable!(),
            });
                //uwrite!(f, "{}", entry.num())
            //);
		}
		Ok(())
	}
}


/// Container for the &str representation of a sudoku
// MUST ALWAYS contain valid utf8
#[derive(Copy, Clone)]
pub struct SudokuLine([u8; 81]);

/// The ordering is lexicographical in the cells of the sudoku
/// going from left to right, top to bottom
impl PartialOrd for SudokuLine {
	fn partial_cmp(&self, other: &Self) -> Option<cmp::Ordering> {
		// deref into &str and cmp
		(**self).partial_cmp(other)
	}
}

impl Ord for SudokuLine {
	fn cmp(&self, other: &Self) -> cmp::Ordering {
		// deref into &str and cmp
		(**self).cmp(other)
	}
}

impl hash::Hash for SudokuLine {
    fn hash<H>(&self, state: &mut H)
    where
        H: hash::Hasher
	{
		(**self).hash(state)
	}
}

impl PartialEq for SudokuLine {
	fn eq(&self, other: &SudokuLine) -> bool {
		self.0[..] == other.0[..]
	}
}

impl Eq for SudokuLine {}

impl fmt::Debug for SudokuLine {
	fn fmt(&self, fmt: &mut fmt::Formatter) -> Result<(), fmt::Error> {
		self.0.fmt(fmt)
	}
}

impl ::core::ops::Deref for SudokuLine {
	type Target = str;
	fn deref(&self) -> &Self::Target {
		unsafe { ::core::str::from_utf8_unchecked(&self.0) }
	}
}

use ::core::ops::Deref;
impl ::core::fmt::Display for SudokuLine {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		write!(f, "{}", self.deref())
	}
}
