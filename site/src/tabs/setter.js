import { createSignal, createEffect } from 'solid-js'
import { usePuzzle } from '../providers/puzzle.js'
import { useComputerInfo } from '../providers/grid-info.js'
import { useComputer } from '../providers/computer.js'
import Variants from '../variants.js'

function SudokuLineEdit () {
  const { loadSudokuLine, exportSudokuLine } = usePuzzle()
  const [sudokuLine, setSudokuLine] = createSignal()
  const [isFocus, setIsFocus] = createSignal(false)
  createEffect(() => {
    if (!isFocus()) {
      setSudokuLine(exportSudokuLine())
    }
  })

  return (
    <textarea value={sudokuLine()} onInput={(e) => {
      loadSudokuLine(e.target.value)
      setSudokuLine(e.target.value)
    }}
    onFocus={() => setIsFocus(true) }
    onBlur={() => setIsFocus(false) }
    />
  )
}

export function SetterTab () {
  const { puzzle, setName, setAuthor, setExtraRules, loadSudokuLine } = usePuzzle()
  const { solveCount, generateNewSudoku, solve, solveResultMessage } = useComputer()
  const { setShow, show } = useComputerInfo()

  function toggleComputerSolve () {
    setShow(p => !p)
  }
  function resetGrid () {
    loadSudokuLine('')
  }
  return (
      <div class="sudoku-side">
        <h2>Setter menu</h2>
        <button onClick={resetGrid}>New grid</button>
        <details>
          <summary>Puzzle informations editor</summary>
          <label>Name</label><input value={puzzle.name} onInput={(e) => setName(e.target.value)}/>
          <label>Author</label><input value={puzzle.author} onInput={(e) => setAuthor(e.target.value)}/>
          <label>Rules:</label>
          <textarea value={puzzle.extraRules} onInput={(e) => setExtraRules(e.target.value)} />
        </details>
        <h3>Computational operation</h3>
        <p>
        <button onClick={generateNewSudoku}>Generate random sudoku</button>
        <button onClick={solve}>Solve</button>
        <button onClick={toggleComputerSolve}>{show() ? 'Hide' : 'Show'} computer hint</button>
        </p>
        <p>Solution count: {solveCount()}</p>
        <p classList={{ hidden: !solveResultMessage() }}>Solve result message: {solveResultMessage()}</p>
        <h3>Constraints</h3>
        <p>
            <Variants.Settings/>
        </p>
        <h3>Sharing</h3>
        <p><a>Setting url</a></p>
        <p><a>Solving url</a></p>
        <p><a>Export to sudokuwiki</a></p>
        <h3>Other</h3>
        <details>
          <summary>Setter settings</summary>
          <button id="hide_setter">Hide setter side in solving mode</button>
          <label>Solution count limit:</label><input id="solution_count_limit" type="number" step="100"/>
          <label>Solve limit:</label><input id="solve_limit" type="number" step="100"/>
          <label>Solve max middle number: </label><input id="solve_max_middle_number" type="number"/>
          <h4>Debug options</h4>
          <button id="count_after_solve">Update solution count after solve</button>
        </details>
        <details>
          <summary>Manual edit</summary>
          <SudokuLineEdit/>
        </details>
      </div>
  )
}
