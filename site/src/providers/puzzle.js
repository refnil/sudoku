import { createContext, useContext, batch, createEffect, createMemo } from 'solid-js'
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
  const searchParams = new URLSearchParams(window.location.search)
  const initialData = searchParams.get('data')

  const sudokuLine = createMemo(() => {
    let sudokuLine = state.grid.cells.map(v => v === null ? '.' : v).join('')
    for (const [key, rule] of Object.entries(state.grid.rules)) {
      sudokuLine += ';' + variantsMap.get(key).extract(rule)
    }
    return sudokuLine
  })
  const url = createMemo(() => {
    const url = window.location.href.split('?')[0]
    const line = sudokuLine()
    for (const letter of line) {
      if (letter !== '.') {
        return `${url}?data=${line}`
      }
    }
    return url
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
        counter.clearAllRules()
        for (const part of line.split(';')) {
          let found = false
          for (const [key, variant] of variantsMap) {
            if (part.startsWith(key)) {
              counter.setRule(key, variant.load(part.replace(key, "")))
              found = true
              break
            }
          }
          if (!found) {
            // if no variant found, assume we have cells
            // strip clue prefix for compatibility with v1
            line = line.replace('clue', '')
            for (let i = 0; i < 81; i++) {
              let value = part[i]
              if (value === undefined || value === '.') {
                value = null
              }
              counter.setCell(i, value)
            }
          }
        }
      })
    },
    sudokuLine,
    url,
    isRule (name) {
      return !!counter.getRule(name)
    },
    getRule (name) {
      return state.grid.rules[name]
    },
    setRule (name, ...value) {
      setState('grid', 'rules', name, ...value)
    },
    clearAllRules () {
      setState('grid', { rules: {} })
    }
  }

  if (initialData) {
    console.log('Loading from data in url', initialData)
    counter.loadSudokuLine(initialData)
  }

  return (
    <PuzzleContext.Provider value={counter}>
      {props.children}
    </PuzzleContext.Provider>
  )
}
