use crate::*;
use crate::solver::*;
use crate::board::sudoku::{SudokuBlock};
use crate::solver::variant::*;
use crate::parse_errors::{InvalidEntry, LineParseError};

pub struct Variant {
    pub base: Sudoku,
    pub diag_pos: bool,
    pub diag_neg: bool,
    pub king: bool,
    pub thermo: Vec<Vec<u32>>,
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

        if c1 == c2 + 1 && c1 % 9 != 0{
            // going to the left
        }
        else if c1 == c2 + 10 && c1 % 9 != 0{
            // going to the top left
        }
        else if c1 + 8 == c2 && c1 % 9 != 0{
            // going to the bottom left
        }
        else if c1 + 1 == c2 && c1 % 9 != 8{
            // going to the right
        }
        else if c1 == c2 + 8 && c1 % 9 != 8{
            // going to the top right
        }
        else if c1 + 10 == c2 && c1 % 9 != 8{
            // going to the bottom right
        }
        else if c1 == c2 + 9 {
            // going up
        }
        else if c1 + 9 == c2 {
            // going down
        }
        else {
            return false;
        }
    }

    return true;
}

impl Variant {
    pub fn from_sudoku(sudoku: Sudoku) -> Self {
        Self {
            base: sudoku,
            diag_pos: false,
            diag_neg: false,
            king: false,
            thermo: Vec::new(),
        }
    }

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
        }
        else if s.starts_with("diag_neg") {
            self.diag_neg = true
        }
        else if s.starts_with("king") {
            self.king = true
        }
        else if s.starts_with("thermo") {
            let thermo: Vec<u32> = s.split('|').skip(1).map(|s| s.parse().unwrap()).collect();
            if !is_thermo_valid(&thermo) {
                return Err(LineParseError::MissingCommentDelimiter);
            }
            self.thermo.push(thermo);
        }
        Ok(())
    }

    pub fn solutions_up_to(self, limit: usize) -> Vec<Sudoku> {
        VariantSolver::from_variant(self)
            .ok()
            .map_or(vec![], |solver| solver.solutions_up_to(limit))
    }

    pub fn solutions_count_up_to(self, limit: usize) -> usize {
        VariantSolver::from_variant(self)
            .ok()
            .map_or(0, |solver| solver.solutions_count_up_to(limit))
    }

    /// Solve sudoku and return solution if solution is unique.
    pub fn solution(self) -> Option<Sudoku> {
        let solutions = self.solutions_up_to(2);
        match solutions.len() == 1 {
            true => Some(solutions[0]),
            false => None,
        }
    }

    pub fn display_block(&self) -> SudokuBlock {
        self.base.display_block()
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_diag_neg() {
        let line = "1.7...5.3.2..4197...3.......594...3..3.95...4.....6...9.5.1.7...7.5.9.8.3..2.4...;diag_neg";
        let s = Variant::from_str_line(line).unwrap();
        assert_eq!(s.diag_neg, true);
        assert_eq!(s.solutions_up_to(4).len(), 1);
    }

    #[test]
    fn test_diag_pos() {
        let line = "..5.2...8..9..6.73.3.7..6..1....5..972.94.3.5...38..2...2.5.9...1.6.95.2....7..36;diag_pos";
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
            let line = String::from(".................................................................................");
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
        assert!(!is_thermo_valid(&vec![1,2,3,4,5,4]));
        assert!(!is_thermo_valid(&vec![7,8,9]));
        assert!(!is_thermo_valid(&vec![9,8,7]));
        assert!(is_thermo_valid(&vec![9,0]));
        assert!(!is_thermo_valid(&vec![80,89]));
        assert!(is_thermo_valid(&vec![9,18,19,10]));
        assert!(is_thermo_valid(&vec![0,10,20,30]));
        assert!(!is_thermo_valid(&vec![0,1,2,3,4,5,6,7,8,16,17]));
    }

    #[test]
    fn test_thermo() {
        fn cok(l: &str, t: &str) {}
        fn ok(line: &str, thermos: &str) {
            let init = &(String::from(line) + ";thermo" + thermos);
            let v = Variant::from_str_line(init).unwrap();
            //println!("{}", v.display_block());
            assert_eq!(v.solutions_count_up_to(2), 1);
        }
        ok("..........59..7..14........9.28...1......52...1..4....7.136.82..9.7.............3",
            "|0|1|2|3|4|5|6|7|8"
        );
        ok(
            ".9.6.4.5.....7....6.......7.3.....2...1...9...8.....7.5.......4....4.....4.1.5.3.",
            "|0|10|20|30|40|50|60|70|80;thermo|64|56|48|40|32|24|16"
        );
        ok(
            "1......5...........2.8........274.....3...9.....193........6.4...........6......3",
            "|4|3|2|1;thermo|16|15|14|13|12|11|10;thermo|76|77|78|79;thermo|64|65|66|67|68|69|70"
        );
    }
}
