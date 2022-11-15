import { createContext, useContext, batch } from 'solid-js'
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
    setCell (cellId, value) {
      setState('grid', 'cells', cellId, value)
    },
    toggleCell (cellId, value) {
      setState('grid', 'cells', cellId, (o) => o === value ? null : value)
    },
    clearCell (cellId, value) {
      setState('grid', 'cells', cellId, null)
    },
    loadSudokuLine (line) {
      batch(() => {
        for (let i = 0; i < 81; i++) {
          let value = line[i]
          if (value === undefined || value === '.') {
            value = null
          }
          counter.setCell(i, value)
        }
      })
    },
    exportSudokuLine () {
      return state.grid.cells.map(v => v === null ? '.' : v).join('')
    }
  }

  return (
    <PuzzleContext.Provider value={counter}>
      {props.children}
    </PuzzleContext.Provider>
  )
}
