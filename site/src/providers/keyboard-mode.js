import { createSignal, createMemo, createContext, useContext, createSelector, onMount, onCleanup } from 'solid-js'
import { usePuzzle } from './puzzle.js'
import { FullCellKeyboard, MiddleCellKeyboard, CornerCellKeyboard, ColorCellKeyboard } from '../modes/keyboard.js'

const KeyboardModeContext = createContext()

export function useKeyboardMode () {
  return useContext(KeyboardModeContext)
}
export function KeyboardModeProvider (props) {
  const { setCell } = usePuzzle()
  const KeyboardMode = {
    FullCell: new FullCellKeyboard(setCell),
    MiddleCell: new MiddleCellKeyboard(),
    CornerCell: new CornerCellKeyboard(),
    ColorCell: new ColorCellKeyboard()
  }
  const [state, setState] = createSignal(KeyboardMode.FullCell)
  const value = [state, setState, KeyboardMode]

  return (
    <KeyboardModeContext.Provider value={value}>
      {props.children}
    </KeyboardModeContext.Provider>
  )
}
