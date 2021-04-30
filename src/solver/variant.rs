use std::fmt;
use crate::board::{Sudoku, Variant};
use crate::helper::Unsolvable;
use crate::solver::{mask_iter, Solutions, Solver, SudokuSolver, Guess, OutsideSolver};

#[derive(Clone, Copy)]
struct Thermo {
    mask_in_thermo: [u32; 3],
}

struct ThermoShared {
    thermo_info: Vec<u32>,
}

impl Thermo {
    fn from_vec(vec: &Vec<Vec<u32>>) -> Option<Thermo>  {
        None
    }
}

pub(crate) struct VariantSolver {
   constant: VariantSolverConstant,
   copy : VariantSolverCopy,
}

/*
impl fmt::Display for VariantSolver {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> Result<(), fmt::Error> {
        //writeln!(f, "{} {} {}", self.diag_pos, self.diag_neg, self.king);
        Ok(())
    }
}
*/

struct VariantSolverConstant {
    diag_pos: bool,
    diag_neg: bool,
    king: bool,
    //thermo: Option<ThermoShared>,
}

#[derive(Clone,Copy)]
struct VariantSolverCopy{
    base: SudokuSolver,
    //thermo: Option<Thermo>,
}

#[derive(Clone,Copy)]
struct VariantSolverCopyPlus<'a> {
    constant: &'a VariantSolverConstant,
    base: VariantSolverCopy,
}

impl OutsideSolver for VariantSolver {
    fn solutions_up_to(self, limit: usize) -> Vec<Sudoku> {
        let solver = VariantSolverCopyPlus {
            constant: &self.constant,
            base: self.copy,
        };
        solver.solutions_up_to(limit)
    }
    fn solutions_up_to_buffer(self, buffer: &mut [[u8; 81]], limit: usize) -> usize {
        let solver = VariantSolverCopyPlus {
            constant: &self.constant,
            base: self.copy,
        };
        solver.solutions_up_to_buffer(buffer, limit)
    }
    fn solutions_count_up_to(self, limit: usize) -> usize {
        let solver = VariantSolverCopyPlus {
            constant: &self.constant,
            base: self.copy,
        };
        solver.solutions_count_up_to(limit)
    }
}

impl<'a> Solver for VariantSolverCopyPlus<'a> {
    fn ensure_constraints(&mut self) -> Result<(), Unsolvable> {
        self.base.base.ensure_constraints()?;
        self.ensure_constraints_variants()
    }

    fn find_naked_singles(&mut self) -> Result<bool, Unsolvable> {
        self.base.base.find_naked_singles()
    }

    fn is_solved(&self) -> bool {
        self.base.base.is_solved() && self.is_ok_variants()
    }
    fn guess_bivalue_in_cell(&self) -> Option<Vec<Guess>> {
        self.base.base.guess_bivalue_in_cell()
    }

    fn guess_some_cell(&self) -> Vec<Guess> {
        self.base.base.guess_some_cell()
    }

    fn extract_solution(&self) -> Sudoku {
        self.base.base.extract_solution()
    }

    fn insert_candidate_by_mask(&mut self, guess: &Guess){
        self.base.base.insert_candidate_by_mask(guess)
    }

    fn remove_candidate_by_mask(&mut self, guess: &Guess){
        self.base.base.remove_candidate_by_mask(guess)
    }
}

impl VariantSolver {
    pub fn from_variant(variant: Variant) -> Result<Self, Unsolvable> {
        let constant = VariantSolverConstant {
            diag_pos: variant.diag_pos,
            diag_neg: variant.diag_neg,
            king: variant.king,
            //thermo: None,
        };
        let copy = VariantSolverCopy {
            base: SudokuSolver::from_sudoku(variant.base)?,
            //thermo: None
        };
        let plus = VariantSolverCopyPlus {
            constant : &constant,
            base: copy.clone(),
        };
        if !plus.is_ok_variants() {
            println!("Invalid from parse");
            Err(Unsolvable)
        } else {
            Ok(Self {
                constant,
                copy
            })
        }
    }
}

impl<'a> VariantSolverCopyPlus<'a> {
    fn has_diag_pos(&self) -> bool {
        self.constant.diag_pos
    }

    fn has_diag_neg(&self) -> bool {
        self.constant.diag_neg
    }

    fn has_king(&self) -> bool {
        self.constant.king
    }

    fn ensure_constraints_variants(&mut self) -> Result<(), Unsolvable> {
        if self.has_diag_pos() {
            self.check_diag_pos()?
        }
        if self.has_diag_neg() {
            self.check_diag_neg()?;
        }
        if self.has_king() {
            self.check_king()?
        }
        Ok(())
    }

    fn is_ok_variants(&self) -> bool {
        (!self.has_diag_pos() || self.is_ok_diag_pos()) && (!self.has_diag_neg() || self.is_ok_diag_neg()) && (!self.has_king() || self.is_ok_king())
    }

    fn is_ok_diag_pos(&self) -> bool {
        let mut mask = 0;
        let base = &self.base.base;
        for i in 0..9 {
            let pos = (8 - i) + i * 9;
            let band = pos / 27;
            let subband = pos % 27;

            let is_number = (base.unsolved_cells[band] & 1 << subband) == 0;

            if is_number {
                // for each number in cases
                for n in 0..9 {
                    if (base.poss_cells[band + n * 3] & 1 << subband) != 0 {
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
        let base = &self.base.base;
        for i in 0..9 {
            let pos = i + i * 9;
            let band = pos / 27;
            let subband = pos % 27;

            let is_number = (base.unsolved_cells[band] & 1 << subband) == 0;

            if is_number {
                // for each number in cases
                for n in 0..9 {
                    if (base.poss_cells[band + n * 3] & (1 << subband)) != 0 {
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
        let base = &mut self.base.base;
        let mut mask = 0;
        // for each case in diag
        let mut band_mask: [u32; 3] = [0; 3];
        for i in 0..9 {
            let pos = i + i * 9;
            let band = pos / 27;
            let subband = pos % 27;

            let is_number = (base.unsolved_cells[band] & 1 << subband) == 0;

            if is_number {
                // for each number in cases
                for n in 0..9 {
                    if (base.poss_cells[band + n * 3] & 1 << subband) != 0 {
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
                    base.poss_cells[band] &= mask;
                }
            }
        }

        Ok(())
    }

    fn check_diag_pos(&mut self) -> Result<(), Unsolvable> {
        let base = &mut self.base.base;
        let mut mask = 0;
        // for each case in diag
        let mut band_mask: [u32; 3] = [0; 3];
        for i in 0..9 {
            let pos = (8 - i) + i * 9;
            let band = pos / 27;
            let subband = pos % 27;

            let is_number = (base.unsolved_cells[band] & 1 << subband) == 0;

            if is_number {
                // for each number in cases
                for n in 0..9 {
                    if (base.poss_cells[band + n * 3] & 1 << subband) != 0 {
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
                    base.poss_cells[band] &= mask;
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
        let base = &self.base.base;
        for number in 0..9 {
            let band1 = base.poss_cells[3 * number] & !base.unsolved_cells[0];
            let band2 = base.poss_cells[1 + 3 * number] & !base.unsolved_cells[1];
            let band3 = base.poss_cells[2 + 3 * number] & !base.unsolved_cells[2];


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

        let base = &mut self.base.base;
        for number in 0..9 {
            let band1 = base.poss_cells[3 * number] & !base.unsolved_cells[0];
            let band2 = base.poss_cells[1 + 3 * number] & !base.unsolved_cells[1];
            let band3 = base.poss_cells[2 + 3 * number] & !base.unsolved_cells[2];

            // Change line 1
            base.poss_cells[3 * number] &= get_mask(0, band1 >> 9);

            // Change line 2
            base.poss_cells[3 * number] &= get_mask(9, band1);
            base.poss_cells[3 * number] &= get_mask(9, band1 >> 18);

            // Change line 3
            base.poss_cells[3 * number] &= get_mask(18, band1 >> 9);
            base.poss_cells[3 * number] &= get_mask(18, band2);

            // Change line 4
            base.poss_cells[1 + 3 * number] &= get_mask(0, band1 >> 18);
            base.poss_cells[1 + 3 * number] &= get_mask(0, band2 >> 9);

            // Change line 5
            base.poss_cells[1 + 3 * number] &= get_mask(9, band2);
            base.poss_cells[1 + 3 * number] &= get_mask(9, band2 >> 18);

            // Change line 6
            base.poss_cells[1 + 3 * number] &= get_mask(18, band2 >> 9);
            base.poss_cells[1 + 3 * number] &= get_mask(18, band3);

            // Change line 7
            base.poss_cells[2 + 3 * number] &= get_mask(0, band2 >> 18);
            base.poss_cells[2 + 3 * number] &= get_mask(0, band3 >> 9);

            // Change line 8
            base.poss_cells[2 + 3 * number] &= get_mask(9, band3);
            base.poss_cells[2 + 3 * number] &= get_mask(9, band3 >> 18);

            // Change line 9
            base.poss_cells[2 + 3 * number] &= get_mask(18, band3 >> 9);
        }
        Ok(())
    }
}
