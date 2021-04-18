use crate::*;
use crate::solver::*;
use crate::solver::variant::*;
use crate::parse_errors::{InvalidEntry, LineParseError};

pub struct Variant {
    pub base: Sudoku,
    pub diag_pos: bool,
    pub diag_neg: bool,
}

impl Variant {
    pub fn from_sudoku(sudoku: Sudoku) -> Self {
        Self {
            base: sudoku,
            diag_pos: false,
            diag_neg: false,
        }
    }

    pub fn from_str_line(s: &str) -> Result<Self, LineParseError> {
        let sudoku = Sudoku::from_str_line(&s[0..81])?;
        let mut variant = Self::from_sudoku(sudoku);
        for sub in s.split(';') {
            variant.try_parse_variant(sub);
        }
        Ok(variant)
    }

    fn try_parse_variant(&mut self, s: &str) {
        if s.starts_with("diag_pos") {
            self.diag_pos = true
        }
        else if s.starts_with("diag_neg") {
            self.diag_neg = true
        }
    }

    pub fn solutions_up_to(self, limit: usize) -> Vec<Sudoku> {
        VariantSolver::from_variant(self)
            .ok()
            .map_or(vec![], |solver| solver.solutions_up_to(limit))
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
}
