import { createContext, createSignal, useContext, onCleanup, createEffect, batch } from 'solid-js'
import { usePuzzle } from './puzzle.js'
import { useComputerInfo } from './grid-info.js'

const ComputerContext = createContext()

export function useComputer () {
  return useContext(ComputerContext)
}
export function ComputerProvider (props) {
  const { puzzle, loadSudokuLine, sudokuLine } = usePuzzle()
  const { setCell, setMiddle, resetCell, setShow } = useComputerInfo()
  const [solveCount, setSolveCount] = createSignal('No result yet')
  const [solveResultMessage, setSolveResultMessage] = createSignal()

  function handleSudokuMessage (message) {
    const messageParams = message.data
    const messageType = messageParams.shift()
    if (messageType === 'solve_count') {
      setSolveCount(messageParams[0])
    } else if (messageType === 'generate') {
      loadSudokuLine(messageParams[0])
    } else if (messageType === 'solve_common') {
      const cells = messageParams[0].split(';')
      if (cells.length === 1) {
        setSolveResultMessage(cells[0])
        return
      }
      setSolveResultMessage(null)
      for (let i = 0; i < 81; i++) {
        const cell = cells[i].split('')
        resetCell(i)
        if (cell.length === 1) {
          if (puzzle.grid.cells[i] !== cell[0]) {
            setCell(i, cell[0])
          }
        } else {
          setMiddle(i, cell)
        }
      }
      setShow(true)
    } else {
      console.error('Unknown message', messageType, messageParams)
    }
  }

  function batchHandleSudokuMessage (message) {
    return batch(() => handleSudokuMessage(message))
  }

  const sudokuWorker = new Worker(new URL('../sudoku-smart.js', import.meta.url))
  sudokuWorker.addEventListener('message', batchHandleSudokuMessage)
  onCleanup(() => sudokuWorker.removeEventListener('message', batchHandleSudokuMessage))

  // Update solve count
  createEffect(() => {
    sudokuWorker.postMessage(['solve_count', sudokuLine(), 10000])
    setSolveCount('No result yet')
  })

  const value = {
    solveCount,
    solveResultMessage,
    generateNewSudoku () {
      sudokuWorker.postMessage(['generate'])
    },
    solve () {
      sudokuWorker.postMessage(['solve_common', sudokuLine(), 1000])
    }
  }
  return (
    <ComputerContext.Provider value={value}>
      {props.children}
    </ComputerContext.Provider>
  )
}
