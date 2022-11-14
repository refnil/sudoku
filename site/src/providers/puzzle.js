import { createSignal, createMemo, createContext, useContext, createSelector, onMount, onCleanup } from 'solid-js'
import { createStore } from 'solid-js/store'

const PuzzleContext = createContext()

export function usePuzzle () {
  return useContext(PuzzleContext)
}
export function PuzzleProvider (props) {
  const [state, setState] = createStore({
    name: '',
    author: '',
    extraRules: '',
    grid: {
      rules: {
      },
      cells: Array(81).fill(null)
    }
  })
  const counter =
  {
    puzzle: state,
    setName (name) {
      setState({ name })
    },
    setAuthor (author) {
      setState({ author })
    },
    setExtraRules (rules) {
      setState({ extraRules: rules })
    },
    setCell (cell_id, value) {
      setState('grid', 'cells', cell_id, value)
    }
  }

  return (
    <PuzzleContext.Provider value={counter}>
      {props.children}
    </PuzzleContext.Provider>
  )
}
