import { createSignal, createMemo, createContext, useContext, createSelector, onMount, onCleanup } from 'solid-js'
import { SelectionMode } from '../modes/mouse.js'

const MouseModeContext = createContext()

export function useMouseMode () {
  return useContext(MouseModeContext)
}
export function MouseModeProvider (props) {
  const [mouseDownSignal, setMouseDown] = createSignal(false)
  const MouseMode = {
    Selection: new SelectionMode(mouseDownSignal)
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
