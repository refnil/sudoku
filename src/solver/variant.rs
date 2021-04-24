use crate::board::{Sudoku, Variant};
use crate::helper::Unsolvable;
use crate::solver::{mask_iter, Solutions, Solver, SudokuSolver, Guess};

#[derive(Clone,Copy)]
pub(crate) struct VariantSolver {
    base: SudokuSolver,
    diag_pos: bool,
    diag_neg: bool,
    king: bool,
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
        self.base.is_solved() && self.is_ok_variants()
    }
    fn guess_bivalue_in_cell(&self) -> Option<Vec<Guess>> {
        self.base.guess_bivalue_in_cell()
    }

    fn guess_some_cell(&self) -> Vec<Guess> {
        self.base.guess_some_cell()
    }

    fn extract_solution(&self) -> Sudoku {
        self.base.extract_solution()
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
            king: variant.king,
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
        if self.king {
            self.check_king()?
        }
        Ok(())
    }

    fn is_ok_variants(&self) -> bool {
        (!self.diag_pos || self.is_ok_diag_pos()) && (!self.diag_neg || self.is_ok_diag_neg()) && (!self.king || self.is_ok_king())
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

    fn is_ok_king(&self) -> bool {
        fn compare_line(mut line1: u32, mut line2: u32) -> bool {
            line1 &= 511;
            line2 &= 511;
            return ((line1 & (line2 << 1)) | (line1 & (line2 >> 1))) != 0;
        }
        for number in 0..9 {
            let band1 = self.base.poss_cells[3 * number] & !self.base.unsolved_cells[0];
            let band2 = self.base.poss_cells[1 + 3 * number] & !self.base.unsolved_cells[1];
            let band3 = self.base.poss_cells[2 + 3 * number] & !self.base.unsolved_cells[2];


            if compare_line(band1, band1 >> 9) {
                return false;
            }

            if compare_line(band1 >> 9, band1 >> 18) {
                return false;
            }

            if compare_line(band1 >> 18, band2) {
                return false;
            }

            if compare_line(band2, band2 >> 9) {
                return false;
            }

            if compare_line(band2 >> 9, band2 >> 18) {
                return false;
            }

            if compare_line(band2 >> 18, band3) {
                return false;
            }

            if compare_line(band3, band3 >> 9) {
                return false;
            }

            if compare_line(band3 >> 9, band3 >> 18) {
                return false;
            }
        }
        true
    }

    fn check_king(&mut self) -> Result<(), Unsolvable> {
        fn get_mask(mask_offset: u32, mut other_line: u32) -> u32{
            other_line &= 511;

            let invalid_value = ((other_line >> 1) | (other_line << 1)) & 511;
            return (!0) ^ ((invalid_value) << mask_offset);
        }

        for number in 0..9 {
            let band1 = self.base.poss_cells[3 * number] & !self.base.unsolved_cells[0];
            let band2 = self.base.poss_cells[1 + 3 * number] & !self.base.unsolved_cells[1];
            let band3 = self.base.poss_cells[2 + 3 * number] & !self.base.unsolved_cells[2];

            // Change line 1
            self.base.poss_cells[3 * number] &= get_mask(0, band1 >> 9);

            // Change line 2
            self.base.poss_cells[3 * number] &= get_mask(9, band1);
            self.base.poss_cells[3 * number] &= get_mask(9, band1 >> 18);

            // Change line 3
            self.base.poss_cells[3 * number] &= get_mask(18, band1 >> 9);
            self.base.poss_cells[3 * number] &= get_mask(18, band2);

            // Change line 4
            self.base.poss_cells[1 + 3 * number] &= get_mask(0, band1 >> 18);
            self.base.poss_cells[1 + 3 * number] &= get_mask(0, band2 >> 9);

            // Change line 5
            self.base.poss_cells[1 + 3 * number] &= get_mask(9, band2);
            self.base.poss_cells[1 + 3 * number] &= get_mask(9, band2 >> 18);

            // Change line 6
            self.base.poss_cells[1 + 3 * number] &= get_mask(18, band2 >> 9);
            self.base.poss_cells[1 + 3 * number] &= get_mask(18, band3);

            // Change line 7
            self.base.poss_cells[2 + 3 * number] &= get_mask(0, band2 >> 18);
            self.base.poss_cells[2 + 3 * number] &= get_mask(0, band3 >> 9);

            // Change line 8
            self.base.poss_cells[2 + 3 * number] &= get_mask(9, band3);
            self.base.poss_cells[2 + 3 * number] &= get_mask(9, band3 >> 18);

            // Change line 9
            self.base.poss_cells[2 + 3 * number] &= get_mask(18, band3 >> 9);
        }
        Ok(())
    }
}
