import { batch, createSignal, createContext, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'

const SolverContext = createContext()
const ComputerContext = createContext()

export function useSolverInfo () {
  return useContext(SolverContext)
}

export function useComputerInfo () {
  return useContext(ComputerContext)
}

function emptyCell () {
  return ({
    middle: [],
    corner: [],
    main: null,
    color: []
  })
}

function makeValue () {
  const cells = []
  for (let i = 0; i < 81; i++) {
    cells.push(emptyCell())
  }
  const [state, setState] = createStore(cells)
  const [show, setShow] = createSignal(true)
  const counter =
  {
    info: state,
    setInfo: setState,
    show,
    setShow,
    resetAllCell () {
      batch(() => {
        for (let i = 0; i < 81; i++) {
          counter.resetCell(i)
        }
      })
    },
    resetCell (index) {
      setState(index, emptyCell)
    },
    setCell (index, value) {
      setState(index, 'main', value)
    },
    clearCell (index) {
      counter.setCell(index, null)
    },
    toggleCell (index, value) {
      counter.setCell(index, (p) => p === value ? null : value)
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
    },
    toggleColor (index, value) {
      setState(index, (p) => {
        const s = new Set(p.color)
        if (s.has(value)) {
          s.delete(value)
        } else {
          s.add(value)
        }
        return { color: [...s].sort() }
      })
    },
    clearColor (index, value) {
      setState(index, { color: [] })
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
