#![warn(missing_docs)]
#![allow(
    clippy::cognitive_complexity,
    clippy::precedence,
    clippy::match_bool,
    clippy::unreadable_literal,
    clippy::wrong_self_convention,
    clippy::inconsistent_digit_grouping,
    clippy::too_many_arguments
)]
//! Utilities for classical 9x9 sudokus.
//!
//! This library currently offers extremely fast sudoku solving and a basic sudoku
//! generator. The solver is based on [jczsolve](http://forum.enjoysudoku.com/3-77us-solver-2-8g-cpu-testcase-17sodoku-t30470-210.html#p249309)
//! which is currently and to the best knowledge of the author the world's fastest sudoku
//! solver algorithm. A few modifications were made to improve the speed further.
//!
//! A future goal is the addition of a fast solver applying human style strategies
//! so that sudokus can be graded, hinted and the solution path explained. With the ability to
//! grade sudokus, puzzles of any desired desired difficulty can be generated.
//!
//! ## Example
//!
//! ```
//! use sudoku::Sudoku;
//!
//! // Sudokus can be created from &str's in both block or line formats or directly from bytes.
//! // here, an example in line format
//! let sudoku_line = "...2...633....54.1..1..398........9....538....3........263..5..5.37....847...1...";
//!
//! let sudoku = Sudoku::from_str_line(sudoku_line).unwrap();
//!
//! // Solve, print or convert the sudoku to another format
//! if let Some(solution) = sudoku.solution() {
//!     // print the solution in line format
//!     println!("{}", solution);
//!
//!     // or return it as a byte array
//!     let cell_contents: [u8; 81] = solution.to_bytes();
//! }
//! ```

pub mod bitset;
pub mod board;
mod consts;
// TODO: unify with parse_errors
pub mod errors;
mod generator;
mod helper;
pub mod parse_errors;
mod solver;
pub mod strategy;

use wasm_bindgen::prelude::*;
use web_sys::console;
use console_error_panic_hook;

pub use crate::board::Sudoku;
pub use crate::board::Symmetry;
use crate::board::variant::Variant;

#[wasm_bindgen]
pub fn init(){
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
pub fn greet(name: &str){
    console::log_1(&name.into());
}

#[wasm_bindgen]
pub fn solve(sudoku: &str) -> String {
    let s = Variant::from_str_line(sudoku).unwrap();
    if let Some(solved) = s.solution() {
        let line: &str = &solved.to_str_line();
        return String::from(line);
    }
    else{
        return String::new()
    }
}

#[wasm_bindgen]
pub fn solve_common(sudoku: &str) -> String {
    // greet(&format!("solve_common: {}", sudoku));
    let s = Variant::from_str_line(sudoku).unwrap();
    let vec = s.solutions_up_to(1000);
    if vec.len() == 1000 {
       println!("Too many solution");
       String::new() 
    }
    else if let Some((Sudoku(f), vs)) = vec.split_first() {
        let mut res: [u8; 81] = f.clone();
        for Sudoku(v) in vs {
            for i in 0..81 {
                if res[i] != v[i] {
                    res[i] = 0;
                }
            }
        }

        let line: &str = &Sudoku::from_bytes(res).unwrap().to_str_line();
        String::from(line)
    }
    else {
        println!("No solution");
        String::new()
    }
}

#[wasm_bindgen]
pub fn generate() -> String {
    let s = Sudoku::generate_with_symmetry(Symmetry::None);
    let line: &str = &s.to_str_line();
    String::from(line)
}

#[wasm_bindgen]
pub fn solution_count(sudoku: &str) -> usize {
    let s = Variant::from_str_line(sudoku).unwrap();
    s.solutions_count_up_to(1000)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn solve_common_does_not_remove_solution() {
        fn check_diag(line: &str) {
            let init = &(String::from(line) + ";diag_pos;diag_neg");
            let res = solve_common(init);
            println!("{}", line);
            println!("{}", res);
            assert_ne!(res, String::new());
            let res_full = &(res + ";diag_pos;diag_neg");
            let count_init = solution_count(init);
            let count_res = solution_count(res_full);
            assert!(count_init < 1000);
            assert!(count_res < 1000);
            assert_eq!(count_init, count_res, "solve_common remove solution on line\n{}", line);
        }
        check_diag("........3..2..65..9.........................8....4.7.2.8.36...5.....14...9...8...");
        check_diag(".1.4....33...8.5.9.......1......1..........8..........5...1........2.9...4.5.7...");
        check_diag("......7..7.2.1.......26..9...4.........9...2483.............8............6...4.79");
        check_diag("9..83.45....4..2.9.54........9..4.3.43.9....2..1...94...2....9..9......4.......2.");

    }
}
