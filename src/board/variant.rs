//! A sudoku board supporting many variants
use crate::board::sudoku::SudokuBlock;
use crate::parse_errors::LineParseError;
use crate::solver::variant::*;
use crate::solver::*;
use crate::*;

/// A sudoku with all the supported variant
pub struct Variant {
    /// The 9x9 grid of the Variant 
    pub base: Sudoku,
    /// The diag_pos variant ( / )
    pub diag_pos: bool,
    /// The diag_neg variant ( \ )
    pub diag_neg: bool,
    /// The king variant
    pub king: bool,
    /// A list of thermo for the thermo variant
    pub thermo: Vec<Vec<u32>>,
    /// A list of difference for the difference variant
    pub difference: Vec<Diff>,
}

/// All the information needed for a Difference clue
pub struct Diff {
    /// one the cell from the difference
    pub cell1: u8,
    /// the other cell from the difference
    pub cell2: u8,
    /// difference wanted between the two cell
    pub val: u8,
}

impl Diff {
    fn build(data: Vec<u8>) -> Result<Self, LineParseError>{
        if data.len() < 3 {
            return Err(LineParseError::MissingCommentDelimiter);
        }

        let cell1 = data[0];
        let cell2 = data[1];
        let val = data[2];

        if !is_cell_neighbour(cell1.into(), cell2.into()) {
            println!("wrong cell: {} {}", cell1, cell2);
            return Err(LineParseError::MissingCommentDelimiter);
        }

        if val > 8 {
            println!("wrong val: {} {}", val, data.iter().map(|u|u.to_string()).collect::<Vec<_>>().join(" "));
            return Err(LineParseError::MissingCommentDelimiter);
        }

        Ok(Diff { cell1, cell2, val})
    }
}

fn is_cell_neighbour(c1: u32, c2: u32) -> bool {
    (c1 == c2 + 1 && c1 % 9 != 0) ||
    // going to the left
    (c1 + 1 == c2 && c1 % 9 != 8) ||
    // going to the right
    (c1 == c2 + 9) ||
    // going up
    (c1 + 9 == c2)
    // going down
}

fn is_cell_diag(c1: u32, c2: u32) -> bool {
    (c1 == c2 + 10 && c1 % 9 != 0) ||
    // going to the top left
    (c1 + 8 == c2 && c1 % 9 != 0) ||
    // going to the bottom left
    (c1 == c2 + 8 && c1 % 9 != 8) ||
    // going to the top right
    (c1 + 10 == c2 && c1 % 9 != 8)
    // going to the bottom right
}

fn is_cell_near(c1: u32, c2: u32) -> bool {
    is_cell_neighbour(c1, c2) || is_cell_diag(c1, c2)
}

fn is_thermo_valid(thermo: &Vec<u32>) -> bool {
    if thermo.len() < 2 {
        println!("thermo is too short");
        return false;
    }

    if thermo.len() > 9 {
        println!("thermo is too long");
        return false;
    }

    if !thermo.iter().all(|n| n < &81) {
        println!("Not all number are smaller than 81");
        return false;
    }

    let mut copy = thermo.clone();
    copy.sort();
    copy.dedup();

    if copy.len() != thermo.len() {
        println!("Thermo crossed itself");
        return false;
    }

    let zipped = thermo.iter().zip(thermo.iter().skip(1));
    for (&c1, &c2) in zipped {
        if !is_cell_near(c1, c2) {
            return false;
        }
    }

    return true;
}

impl Variant {

    /// Build a Variant from a basic sudoku.
    /// No variants will be activated.
    pub fn from_sudoku(sudoku: Sudoku) -> Self {
        Self {
            base: sudoku,
            diag_pos: false,
            diag_neg: false,
            king: false,
            thermo: Vec::new(),
            difference: Vec::new(),
        }
    }

    /// Parse a variant sudoku from a line string
    pub fn from_str_line(s: &str) -> Result<Self, LineParseError> {
        let sudoku = Sudoku::from_str_line(&s[0..81])?;
        let mut variant = Self::from_sudoku(sudoku);
        for sub in s.split(';') {
            variant.try_parse_variant(sub)?;
        }
        Ok(variant)
    }

    fn try_parse_variant(&mut self, s: &str) -> Result<(), LineParseError> {
        if s.starts_with("diag_pos") {
            self.diag_pos = true
        } else if s.starts_with("diag_neg") {
            self.diag_neg = true
        } else if s.starts_with("king") {
            self.king = true
        } else if s.starts_with("thermo") {
            let thermo: Vec<u32> = s.split('|').skip(1).map(|s| s.parse().unwrap()).collect();
            if !is_thermo_valid(&thermo) {
                return Err(LineParseError::MissingCommentDelimiter);
            }
            self.thermo.push(thermo);
        } else if s.starts_with("diff") {
            let diff = s.split('|').skip(1).map(|s| s.parse().unwrap()).take(3).collect::<Vec<_>>();
            self.difference.push(Diff::build(diff)?);
        }
        Ok(())
    }

    /// Solve sudoku and return solution if solution is unique.
    pub fn solution(self) -> Option<Sudoku> {
        let solutions = self.solutions_up_to(2);
        match solutions.len() == 1 {
            true => Some(solutions[0]),
            false => None,
        }
    }

    /// Return a beautiful CLI grid
    pub fn display_block(&self) -> SudokuBlock {
        self.base.display_block()
    }
}

impl OutsideSolver for Variant {
    fn solutions_count_up_to(self, limit: usize) -> usize {
        VariantSolver::from_variant(self)
            .ok()
            .map_or(0, |solver| solver.solutions_count_up_to(limit))
    }

    fn solutions_up_to(self, limit: usize) -> Vec<Sudoku> {
        VariantSolver::from_variant(self)
            .ok()
            .map_or(vec![], |solver| solver.solutions_up_to(limit))
    }
    fn solutions_up_to_buffer(self, buffer: &mut [[u8; 81]], limit: usize) -> usize {
        VariantSolver::from_variant(self)
            .ok()
            .map_or(0, |solver| solver.solutions_up_to_buffer(buffer, limit))
    }
    fn solutions_notifier_up_to<'a>(self, limit: usize, function: &'a fn(Notification)) -> usize {
        VariantSolver::from_variant(self)
            .ok()
            .map_or_else(|| {function(Notification::Final(0)); 0}, |solver| solver.solutions_notifier_up_to(limit, function))
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_diag_neg() {
        let line =
            "1.7...5.3.2..4197...3.......594...3..3.95...4.....6...9.5.1.7...7.5.9.8.3..2.4...;diag_neg";
        let s = Variant::from_str_line(line).unwrap();
        assert_eq!(s.diag_neg, true);
        assert_eq!(s.solutions_up_to(4).len(), 1);
    }

    #[test]
    fn test_diag_pos() {
        let line =
            "..5.2...8..9..6.73.3.7..6..1....5..972.94.3.5...38..2...2.5.9...1.6.95.2....7..36;diag_pos";
        let s = Variant::from_str_line(line).unwrap();
        assert_eq!(s.diag_pos, true);
        assert_eq!(s.solutions_up_to(4).len(), 1);
    }

    #[test]
    fn test_both_diag() {
        let line = "......9....36...8..9.2...3..7.....2...249.....5.........7.3.5.25.9..68...4...2..7;diag_pos;diag_neg";
        let s = Variant::from_str_line(line).unwrap();
        assert_eq!(s.diag_pos, true);
        assert_eq!(s.diag_neg, true);
        assert_eq!(s.solutions_up_to(4).len(), 1);
    }

    #[test]
    fn test_king() {
        fn not_ok(line: &str) {
            let init = &(String::from(line) + ";king");
            let v = Variant::from_str_line(init).unwrap();
            // println!("{}", v.display_block());
            assert_eq!(v.solutions_count_up_to(1), 0);
        }
        fn ok(line: &str) {
            let init = &(String::from(line) + ";king");
            let v = Variant::from_str_line(init).unwrap();
            // println!("{}", v.display_block());
            assert_eq!(v.solutions_count_up_to(2), 1);
        }

        ok("438612579972458316615379428524183697196247835387596241769834152841725963253961784");
        ok("4..6.2.7....45...6.....9......183......2......87...2..76.8.....8...25...25..6....");
        not_ok("..1.........1....................................................................");
        not_ok("......7.....1.7..................................................................");
        not_ok("......................3.........3................................................");
    }

    #[test]
    fn test_empty_is_possible() {
        fn ok_with_variant(variant: &str) {
            println!("Variant: {}", variant);
            let line = String::from(
                ".................................................................................",
            );
            let s = Variant::from_str_line(&(line + ";" + variant));
            assert!(s.is_ok());
            assert_eq!(s.unwrap().solutions_count_up_to(4), 4);
        }
        ok_with_variant("diag_neg");
        ok_with_variant("diag_pos");
        ok_with_variant("diag_pos;diag_neg");
        ok_with_variant("king");
        ok_with_variant("thermo|1|2");
    }

    #[test]
    fn thermo_validation() {
        assert!(!is_thermo_valid(&vec![]));
        assert!(!is_thermo_valid(&vec![3]));
        assert!(!is_thermo_valid(&vec![1, 4, 5, 100]));
        assert!(!is_thermo_valid(&vec![1, 2, 3, 4, 5, 4]));
        assert!(!is_thermo_valid(&vec![7, 8, 9]));
        assert!(!is_thermo_valid(&vec![9, 8, 7]));
        assert!(is_thermo_valid(&vec![9, 0]));
        assert!(!is_thermo_valid(&vec![80, 89]));
        assert!(is_thermo_valid(&vec![9, 18, 19, 10]));
        assert!(is_thermo_valid(&vec![0, 10, 20, 30]));
        assert!(!is_thermo_valid(&vec![0, 1, 2, 3, 4, 5, 6, 7, 8, 16, 17]));
    }

    #[test]
    fn test_thermo() {
        fn ok(line: &str, thermos: &str) {
            let init = &(String::from(line) + ";thermo" + thermos);
            let v = Variant::from_str_line(init).unwrap();
            //println!("{}", v.display_block());
            assert_eq!(v.solutions_count_up_to(2), 1);
        }
        ok(
            "..........59..7..14........9.28...1......52...1..4....7.136.82..9.7.............3",
            "|0|1|2|3|4|5|6|7|8",
        );
        ok(
            ".9.6.4.5.....7....6.......7.3.....2...1...9...8.....7.5.......4....4.....4.1.5.3.",
            "|0|10|20|30|40|50|60|70|80;thermo|64|56|48|40|32|24|16",
        );
        ok(
            ".9.6.4.5.....7....6.......7.3.....2...1...9...8.....7.5.......4....4.....4.1.5.3.",
            "|64|56|48|40|32|24|16;diag_neg",
        );
        ok(
            "1......5...........2.8........274.....3...9.....193........6.4...........6......3",
            "|4|3|2|1;thermo|16|15|14|13|12|11|10;thermo|76|77|78|79;thermo|64|65|66|67|68|69|70",
        );
    }

    #[test]
    fn test_difference() {
        fn ok(line: &str) {
            let v = Variant::from_str_line(line).unwrap();
            println!("{}", line);
            println!("{}", v.display_block());
            assert_eq!(v.solutions_count_up_to(200), 1);
        }
        fn not_ok(line: &str) {
            let v = Variant::from_str_line(line).unwrap();
            //println!("{}", v.display_block());
            assert_eq!(v.solutions_count_up_to(2), 0);
        }
        not_ok("12.....5...........2.8........274.....3...9.....193........6.4...........6......3
                diff|0|1|2");
        ok("549...17.....194..21...5........8.2.95.....487.1...6596...2.........6.97.2.5.48..;diff|80|71|4");
        ok("549...17.....194..21...5........8.2.95.....487.1...6596...2.........6.97.2.5.48..;diff|80|71|1");
        ok("...................8.............................................................;diag_pos;diag_neg;thermo|0|9|18|27|36;thermo|20|29|38|47|56;thermo|40|49|58|67|76;thermo|33|42|51|60|69;thermo|17|26|35|44|53;diff|18|27|1;diff|38|47|2;diff|58|67|3;diff|51|60|4;diff|35|44|5;diff|45|46|1");

    }
}
