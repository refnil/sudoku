import { createSignal, createContext, useContext, onMount, onCleanup } from 'solid-js'
import { SelectionMode, TwoLineRuleMode, RemoveFromTwoLine, ToggleSide } from '../modes/mouse.js'
import { usePuzzle } from '../providers/puzzle.js'

const MouseModeContext = createContext()

export function useMouseMode () {
  return useContext(MouseModeContext)
}
export function MouseModeProvider (props) {
  const [mouseDownSignal, setMouseDown] = createSignal(false)
  const { setRule } = usePuzzle()
  function setToSelection () {
    setState(MouseMode.Selection)
  }
  const MouseMode = {
    Selection: new SelectionMode(mouseDownSignal),
    Thermo: new TwoLineRuleMode(mouseDownSignal, setRule, 'thermo'),
    ThermoDelete: new RemoveFromTwoLine(mouseDownSignal, setRule, 'thermo', setToSelection),
    Difference: new ToggleSide(mouseDownSignal, setRule, 'diff', 3)
  }
  const [state, setState] = createSignal(MouseMode.Selection)
  const value = [state, setState, MouseMode]

  function mouseDown () {
    setMouseDown(true)
  }

  function mouseUp () {
    setMouseDown(false)
    state().finish_click()
  }

  onMount(() => {
    document.addEventListener('mousedown', mouseDown)
    document.addEventListener('mouseup', mouseUp)
  })

  onCleanup(() => {
    document.removeEventListener('mousedown', mouseDown)
    document.removeEventListener('mouseup', mouseUp)
  })

  return (
    <MouseModeContext.Provider value={value}>
      {props.children}
    </MouseModeContext.Provider>
  )
}
