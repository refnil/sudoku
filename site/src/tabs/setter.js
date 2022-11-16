import { createSignal, createEffect, createMemo, Show } from 'solid-js'
import { usePuzzle } from '../providers/puzzle.js'
import { useComputerInfo } from '../providers/grid-info.js'
import { useComputer } from '../providers/computer.js'
import Variants from '../variants.js'

function SudokuLineEdit () {
  const { loadSudokuLine, sudokuLine } = usePuzzle()
  const [content, setContent] = createSignal()
  const [isFocus, setIsFocus] = createSignal(false)
  createEffect(() => {
    if (!isFocus()) {
      setContent(sudokuLine())
    }
  })

  return (
    <textarea value={content()} onInput={(e) => {
      loadSudokuLine(e.target.value)
      setContent(e.target.value)
    }}
    onFocus={() => setIsFocus(true) }
    onBlur={() => setIsFocus(false) }
    />
  )
}

export function SetterTab () {
  const { puzzle, setName, setAuthor, setExtraRules, loadSudokuLine, url, sudokuLine } = usePuzzle()
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
        <h2 style={{ 'margin-top': '0px' }}>Setter menu</h2>
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
        <Show when={url().indexOf('?') >= 0} fallback={<p>No link when grid is empty</p>}>
        <p><a href={url()}>Setting url</a></p>
        <p><a href={url() + '&solve'}>Solving url</a></p>
        <Show when={sudokuLine().indexOf(';') < 0}>
        <p><a href={`https://www.sudokuwiki.org/sudoku.htm?db=${sudokuLine()}`}>Export to sudokuwiki</a></p>
        </Show>
        </Show>
        <h3>Other</h3>
        <details>
          <summary>Manual edit</summary>
          <SudokuLineEdit/>
        </details>
      </div>
  )
}
