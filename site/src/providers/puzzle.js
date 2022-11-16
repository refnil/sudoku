import { createContext, useContext, batch, createEffect } from 'solid-js'
import { createStore } from 'solid-js/store'
import { variantsMap } from '../variants.js'

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
      let sudokuLine = state.grid.cells.map(v => v === null ? '.' : v).join('')
      for (const [key, rule] of Object.entries(state.grid.rules)) {
        sudokuLine += ';' + variantsMap.get(key).extract(rule)
      }
      return sudokuLine
    },
    isRule (name) {
      return !!counter.getRule(name)
    },
    getRule (name) {
      return state.grid.rules[name]
    },
    setRule (name, value) {
      setState('grid', 'rules', name, value)
    }
  }

  return (
    <PuzzleContext.Provider value={counter}>
      {props.children}
    </PuzzleContext.Provider>
  )
}
