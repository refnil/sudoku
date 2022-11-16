import { createSignal, createMemo, createContext, useContext, createSelector, onMount, onCleanup } from 'solid-js'
import { usePuzzle } from './puzzle.js'
import { useSolverInfo } from './grid-info.js'
import { useMouseMode } from './mouse-mode.js'
import { ToggleCellKeyboard, MiddleCellKeyboard, CornerCellKeyboard, ColorCellKeyboard, SingleExtraKeyboard } from '../modes/keyboard.js'

const KeyboardModeContext = createContext()

export function useKeyboardMode () {
  return useContext(KeyboardModeContext)
}
export function KeyboardModeProvider (props) {
  const { toggleCell, clearCell, setRule } = usePuzzle()
  const mouseMode = useMouseMode()[0]
  const { toggleMiddle, clearMiddle, toggleCorner, clearCorner } = useSolverInfo()
  const KeyboardMode = {
    FullCell: new ToggleCellKeyboard(mouseMode, toggleCell, clearCell),
    MiddleCell: new MiddleCellKeyboard(mouseMode, toggleMiddle, clearMiddle),
    CornerCell: new CornerCellKeyboard(mouseMode, toggleCorner, clearCorner),
    ColorCell: new ColorCellKeyboard(mouseMode),
    Difference: new SingleExtraKeyboard(setRule, 'diff', 2)
  }
  const [state, setState] = createSignal(KeyboardMode.FullCell)
  const value = [state, setState, KeyboardMode]

  function onKeyDown (event) {
    state().handle_event(event.key)
  }

  onMount(() => {
    document.addEventListener('keydown', onKeyDown)
  })

  onCleanup(() => {
    document.removeEventListener('keydown', onKeyDown)
  })

  return (
    <KeyboardModeContext.Provider value={value}>
      {props.children}
    </KeyboardModeContext.Provider>
  )
}
