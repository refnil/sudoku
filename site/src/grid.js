import { For, createMemo } from 'solid-js'
import { usePuzzle } from './providers/puzzle.js'
import { useSolverInfo, useComputerInfo } from './providers/grid-info.js'
import { useMouseMode } from './providers/mouse-mode.js'

const cornerNames = [
  'top-left',
  'top-middle',
  'top-right',
  'middle-left',
  'middle-right',
  'bottom-left',
  'bottom-middle-1',
  'bottom-middle-2',
  'bottom-right'
]

const CellComponent = (props) => {
  const mouseMode = useMouseMode()[0]
  const mouseDown = createMemo(() => mouseMode().click(props.index()))
  const mouseOver = createMemo(() => mouseMode().over(props.index()))
  const isSelected = createMemo(() => mouseMode().isSelected(props.index()))

  const puzzleCell = createMemo(() => usePuzzle().puzzle.grid.cells[props.index()])
  const solverCell = createMemo(() => useSolverInfo().info[props.index()])
  const computerCell = createMemo(() => useComputerInfo().info[props.index()])
  const { show: showComputer } = useComputerInfo()

  const main = createMemo(() => {
    const p = puzzleCell()
    if (p) {
      return [p, null]
    }
    const s = solverCell().main
    if (s) {
      return [s, 'human']
    }
    const c = computerCell().main
    if (showComputer() && c) {
      return [c, 'computer']
    }
    return null
  })
  const mainText = createMemo(() => main() && main()[0])
  const mainClass = createMemo(() => main() && main()[1])

  const middle = createMemo(() => {
    if (mainText()) {
      return null
    }
    const s = solverCell().middle
    if (s.length > 0) {
      return [s, 'human']
    }
    const c = computerCell().middle
    if (showComputer() && c.length > 0) {
      return [c, 'computer']
    }
    return null
  })
  const middleArray = createMemo(() => middle() && middle()[0])
  const middleClass = createMemo(() => middle() && middle()[1])

  const corner = createMemo(() => {
    if (mainText()) {
      return null
    }
    const s = solverCell().corner
    if (s.length > 0) {
      return [s, 'human']
    }
    const c = computerCell().corner
    if (showComputer() && c.length > 0) {
      return [c, 'computer']
    }
    return null
  })
  const cornerArray = createMemo(() => corner() && corner()[0])
  const cornerClass = createMemo(() => corner() && corner()[1])

  return (
        <li class={mainClass()} classList={{ selected: isSelected() }}
            onMouseDown={(e) => mouseDown()(e)}
            onMouseOver={(e) => mouseOver()(e)}
        >
        <For each={cornerArray()}>{(digit, index) =>
            <span class="corner-cell" classList={{ [cornerNames[index()]]: true, [cornerClass()]: true }}>{digit}</span>
        }</For>
        <span class="middle-cell" classList={{ [middleClass()]: true }} >{middleArray()}</span>
        {mainText()}
        </li>
  )
}

export const GridComponent = () => {
  const { puzzle } = usePuzzle()

  return (
        <div><div id="sudoku" class="sudoku">
        <ul>
        <For each={puzzle.grid.cells}>
          {(cell, index) => <CellComponent cell={cell} index={index}/>}
        </For>
        </ul>
        </div></div>
  )
}
