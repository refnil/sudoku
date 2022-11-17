import { createSelector, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { usePuzzle } from '../providers/puzzle.js'
import { useKeyboardMode } from '../providers/keyboard-mode.js'
import { useSolverInfo } from '../providers/grid-info.js'
import Variants from '../variants.js'

function ModeButton (props) {
  const [keyboardMode, setKeyboardMode, KeyboardModes] = useKeyboardMode()
  const isCurrent = createSelector(keyboardMode)
  return (
    <button
      onClick={() => setKeyboardMode((p) => props.mode === p && props.fallback ? KeyboardModes.FullCell : props.mode)}
      classList={{ 'toggle-on': isCurrent(props.mode), 'toggle-off': !isCurrent(props.mode) }}
      >
      {props.children}
    </button>
  )
}

export const SolverTab = (props) => {
  const { puzzle } = usePuzzle()
  const keyboardMode = useKeyboardMode()[0]
  const KeyboardModes = useKeyboardMode()[2]
  const { resetAllCell } = useSolverInfo()
  function clear () {
    if (confirm('Do you want to delete all progress?')) {
      resetAllCell()
    }
  }

  return (
    <div class="sudoku-side column">
      <div class="row">
      <div class="keyboard-container">
        <Dynamic component={keyboardMode().render()}/>
      </div>
      <div class="column">
        <Show when={!props.solveOnly}>
          <ModeButton mode={KeyboardModes.FullCell}>Number setter</ModeButton>
        </Show>
        <ModeButton mode={KeyboardModes.SolverFullCell}>Number{!props.solveOnly && ' solver'}</ModeButton>
        <ModeButton mode={KeyboardModes.CornerCell} fallback>Corner</ModeButton>
        <ModeButton mode={KeyboardModes.MiddleCell} fallback>Center</ModeButton>
        <ModeButton mode={KeyboardModes.ColorCell} fallback>Color</ModeButton>
        <button onClick={clear}>Clear progress</button>
      </div>
      </div>
      <p>{puzzle.extraRules}</p>
      <p><Variants.Rules/></p>
      <p id="puzzle_variant_rule" />
      <details>
        <summary>App info</summary>
        <a href="https://github.com/refnil/sudoku/">Source on github</a>
        <a href="https://github.com/refnil/sudoku/issues/new/choose">Open an issue</a>
        Thanks for trying my sudoku app.
      </details>
    </div>
  )
}
