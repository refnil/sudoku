import { usePuzzle } from '../providers/puzzle.js'

export function SetterTab () {
  const { puzzle, setName, setAuthor, setExtraRules } = usePuzzle()
  function generateNewSudoku () {
    console.log('generateNewSudoku')
  }
  function clearComputer () {
    console.log('clearComputer')
  }
  function resetGrid () {
    console.log('resetGrid')
  }
  const toggleSimpleVariant = (variantName) => () => {
    console.log('toggle', variantName)
  }
  function thermoEdit () {
    console.log('thermo edit')
  }
  function thermoDelete () {
    console.log('thermo delete')
  }
  function difference () {
    console.log('difference')
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
        <button id='solve'>Solve</button>
        <button onClick={clearComputer}>Clear computer hint</button>
        </p>
        <p>Solution count: <span id='count' /></p>
        <p id="solve_result_message" class="hidden">Solve result message: <span id='solve_result_message_text' /></p>
        <h3>Constraints</h3>
        <p>
        <button onClick={toggleSimpleVariant('diag_pos')}>Diagonal +</button>
        <button onClick={toggleSimpleVariant('diag_neg')}>Diagonal -</button>
        <button onClick={toggleSimpleVariant('king')}>King move</button>
        <span class="merge_button">
          <button onClick={thermoEdit}>Thermo</button><button onClick={thermoDelete} class="toggle-no-addon">&#x1F5D1;</button>
        </span>
        <button onClick={difference}>Difference</button>
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
          <textarea id="save" />
        </details>
      </div>
  )
}
