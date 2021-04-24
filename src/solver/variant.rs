use crate::board::{Sudoku, Variant};
use crate::helper::Unsolvable;
use crate::solver::{mask_iter, Solutions, Solver, SudokuSolver, Guess};

#[derive(Clone,Copy)]
pub(crate) struct VariantSolver {
    base: SudokuSolver,
    // direction: bool,
    diag_pos: bool,
    diag_neg: bool,
}

impl Solver for VariantSolver {
    fn ensure_constraints(&mut self) -> Result<(), Unsolvable> {
        self.base.ensure_constraints()?;
        self.ensure_constraints_variants()
    }

    fn find_naked_singles(&mut self) -> Result<bool, Unsolvable> {
        self.base.find_naked_singles()
    }

    fn is_solved(&self) -> bool {
        let res = self.base.is_solved() && self.is_ok_variants();
        res
    }
    fn guess_bivalue_in_cell(&self) -> Option<Vec<Guess>> {
        self.base.guess_bivalue_in_cell()
    }

    fn guess_some_cell(&self) -> Vec<Guess> {
        self.base.guess_some_cell()
    }

    fn extract_solution(&self) -> Sudoku {
        let res = self.base.extract_solution();
        println!("Extracting solution: {}", res);
        res
    }

    fn insert_candidate_by_mask(&mut self, guess: &Guess){
        self.base.insert_candidate_by_mask(guess)
    }

    fn remove_candidate_by_mask(&mut self, guess: &Guess){
        self.base.remove_candidate_by_mask(guess)
    }
}

impl VariantSolver {
    pub fn from_variant(variant: Variant) -> Result<Self, Unsolvable> {
        let solver = Self {
            base: SudokuSolver::from_sudoku(variant.base)?,
            diag_pos: variant.diag_pos,
            diag_neg: variant.diag_neg,
        };
        if !solver.is_ok_variants() {
            println!("Invalid from parse");
            Err(Unsolvable)
        } else {
            Ok(solver)
        }
    }

    fn ensure_constraints_variants(&mut self) -> Result<(), Unsolvable> {
        if self.diag_pos {
            self.check_diag_pos()?
        }
        if self.diag_neg {
            self.check_diag_neg()?
        }
        Ok(())
    }

    fn is_ok_variants(&self) -> bool {
        (!self.diag_pos || self.is_ok_diag_pos()) && (!self.diag_neg || self.is_ok_diag_neg())
    }

    fn is_ok_diag_pos(&self) -> bool {
        let mut mask = 0;
        for i in 0..9 {
            let pos = (8 - i) + i * 9;
            let band = pos / 27;
            let subband = pos % 27;

            let is_number = (self.base.unsolved_cells[band] & 1 << subband) == 0;

            if is_number {
                // for each number in cases
                for n in 0..9 {
                    if (self.base.poss_cells[band + n * 3] & 1 << subband) != 0 {
                        let new_mask = mask | 1 << n;
                        // println!("Found a {}, {} {}", (n + 1), new_mask, mask);
                        if new_mask == mask {
                            return false;
                        }
                        mask = new_mask;
                        break;
                    }
                }
            }
        }
        true
    }

    fn is_ok_diag_neg(&self) -> bool {
        let mut mask = 0;
        for i in 0..9 {
            let pos = i + i * 9;
            let band = pos / 27;
            let subband = pos % 27;

            let is_number = (self.base.unsolved_cells[band] & 1 << subband) == 0;

            if is_number {
                // for each number in cases
                for n in 0..9 {
                    if (self.base.poss_cells[band + n * 3] & (1 << subband)) != 0 {
                        let new_mask = mask | 1 << n;
                        // println!("Found a {}, {} {}", (n + 1), new_mask, mask);
                        if new_mask == mask {
                            return false;
                        }
                        mask = new_mask;
                        break;
                    }
                }
            }
        }
        true
    }

    fn check_diag_neg(&mut self) -> Result<(), Unsolvable> {
        let mut mask = 0;
        // for each case in diag
        let mut band_mask: [u32; 3] = [0; 3];
        for i in 0..9 {
            let pos = i + i * 9;
            let band = pos / 27;
            let subband = pos % 27;

            let is_number = (self.base.unsolved_cells[band] & 1 << subband) == 0;

            if is_number {
                // for each number in cases
                for n in 0..9 {
                    if (self.base.poss_cells[band + n * 3] & 1 << subband) != 0 {
                        mask |= 1 << n;
                        break;
                    }
                }
            } else {
                band_mask[band] |= 1 << subband;
            }
        }
        for number in 0..9 {
            if (mask & 1 << number) != 0 {
                for mband in 0..3 {
                    if band_mask[mband] == 0 {
                        continue;
                    }
                    let band = mband + number * 3;
                    let mask = !band_mask[mband];
                    self.base.poss_cells[band] &= mask;
                }
            }
        }

        Ok(())
    }

    fn check_diag_pos(&mut self) -> Result<(), Unsolvable> {
        let mut mask = 0;
        // for each case in diag
        let mut band_mask: [u32; 3] = [0; 3];
        for i in 0..9 {
            let pos = (8 - i) + i * 9;
            let band = pos / 27;
            let subband = pos % 27;

            let is_number = (self.base.unsolved_cells[band] & 1 << subband) == 0;

            if is_number {
                // for each number in cases
                for n in 0..9 {
                    if (self.base.poss_cells[band + n * 3] & 1 << subband) != 0 {
                        mask |= 1 << n;
                        break;
                    }
                }
            } else {
                band_mask[band] |= 1 << subband;
            }
        }
        for number in 0..9 {
            if (mask & 1 << number) != 0 {
                for mband in 0..3 {
                    if band_mask[mband] == 0 {
                        continue;
                    }
                    let band = mband + number * 3;
                    let mask = !band_mask[mband];
                    self.base.poss_cells[band] &= mask;
                }
            }
        }

        Ok(())
    }
}
