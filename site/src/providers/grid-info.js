import { createSignal, createMemo, createContext, useContext, createSelector, onMount, onCleanup } from 'solid-js'
import { createStore } from 'solid-js/store'

const SolverContext = createContext()
const ComputerContext = createContext()

export function useSolverInfo () {
  return useContext(SolverContext)
}

export function useComputerInfo () {
  return useContext(ComputerContext)
}

function makeValue () {
  const cells = []
  for (let i = 0; i < 81; i++) {
    cells.push({
      middle: [],
      corner: [],
      main: null
    })
  }
  const [state, setState] = createStore(cells)
  const [show, setShow] = createSignal(true)
  const counter =
  {
    info: state,
    setInfo: setState,
    show,
    setShow,
    resetCell (index) {
      setState(index, { middle: [], corner: [], main: null })
    },
    setCell (index, value) {
      setState(index, { main: value })
    },
    toggleMiddle (index, value) {
      setState(index, (p) => {
        const s = new Set(p.middle)
        if (s.has(value)) {
          s.delete(value)
        } else {
          s.add(value)
        }
        return { middle: [...s].sort() }
      })
    },
    clearMiddle (index, value) {
      setState(index, { middle: [] })
    },
    setMiddle (index, value) {
      setState(index, { middle: value.sort() })
    },
    toggleCorner (index, value) {
      setState(index, (p) => {
        const s = new Set(p.corner)
        if (s.has(value)) {
          s.delete(value)
        } else {
          s.add(value)
        }
        return { corner: [...s].sort() }
      })
    },
    clearCorner (index, value) {
      setState(index, { corner: [] })
    }
  }
  return counter
}

export function InfoProvider (props) {
  return (
    <SolverContext.Provider value={makeValue()}>
      <ComputerContext.Provider value={makeValue()}>
        {props.children}
      </ComputerContext.Provider>
    </SolverContext.Provider>
  )
}
