Sudoku app
========== 

This repo contains a solver for sudoku and many variants based on [Emerentius/sudoku](https://github.com/Emerentius/sudoku) and a web frontend for this library that allow creating and solving sudokus.
The goal of the project is to make it easier to create new puzzle by being helped by a fast solver. As such, I don't intend to add variants in the frontend that would not be in the backend. It is also expected that this app will offer less customization options than other sudoku app.


Rust sudoku librarie
---------------------

Supported variants:
- X sudoku
- King move
- Thermo sudoku
- difference between two cells

Web app frontend
----------------

Features:
- setter and solver mode
- allow using every variants supported by the backend
- compute the number of possibilities on every change when setting
- show all the possibilities of every cell in the sudoku
- all sudoku computation are done asynchronously for a better setting experience

Inspiration
-----------

Mainly [F-puzzles](https://f-puzzles.com/) but I wanted a faster solver that would not block when clicking solve.

Sources
-------

- HTML grid for the sudoku: https://codepen.io/sdobson/pen/aEWBQw

The favicon was generated using the following font:
- Font Title: Lakki Reddy
- Font Author: Copyright (c) 2011 Silicon Andhra (fonts.siliconandhra.org). Copy
right (c) 2010 by Font Diner, Inc DBA Sideshow.
- Font Source: http://fonts.gstatic.com/s/lakkireddy/v9/S6u5w49MUSzD9jlCPmvLZQfo
x9k97-xZ.ttf
- Font License: SIL Open Font License, 1.1 (http://scripts.sil.org/OFL)
