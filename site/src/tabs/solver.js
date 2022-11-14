import { createMemo } from 'solid-js'
import { usePuzzle } from '../providers/puzzle.js'
import { useKeyboardMode } from '../providers/keyboard-mode.js'

export const SolverTab = () => {
  const { puzzle } = usePuzzle()
  const [keyboardMode, setKeyboardMode, KeyboardModes] = useKeyboardMode()
  const Keyboard = createMemo(() => keyboardMode().render)

  const switchTo = (mode) => () => {
    setKeyboardMode(mode)
  }

  return (
    <div class="sudoku-side column">
      <div class="row">
      <div class="keyboard-container">
        {() => {
          const Base = Keyboard()
          return <Base/>
        }}
      </div>
      <div class="column">
        <button id='app_mode_button'>Mode: <span id='app_mode'>setter</span></button>
        <button onClick={switchTo(KeyboardModes.FullCell)}>Number</button>
        <button onClick={switchTo(KeyboardModes.CornerCell)}>Corner</button>
        <button onClick={switchTo(KeyboardModes.MiddleCell)}>Center</button>
        <button onClick={switchTo(KeyboardModes.ColorCell)}>Color</button>
        <button id='clear'>Clear progress</button>
      </div>
      </div>
      <p>{puzzle.extraRules}</p>
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
