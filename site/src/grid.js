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

  const middle = createMemo(() => {
    if (props.cell) {
      return ['', true]
    }
    const index = props.index()
    const middle = useSolverInfo().info[index].middle
    if (middle) {
      return [middle, true]
    }
    return [useComputerInfo().info[index].middle, false]
  })

  const corner = createMemo(() => {
    if (props.cell) {
      return ['', true]
    }
    const index = props.index()
    const corner = useSolverInfo().info[index].corner
    if (corner) {
      return [corner, true]
    }
    return [useComputerInfo().info[index].corner, false]
  })

  return (
        <li classList={{ selected: isSelected() }}
            onMouseDown={mouseDown()}
            onMouseOver={mouseOver()}
        >
        <For each={corner()[0]}>{(digit, index) =>
            <span class="corner-cell" classList={{
              human: corner()[1],
              computer: !corner()[1],
              [cornerNames[index()]]: true
            }}>{digit}</span>
        }</For>
        <span class="middle-cell" classList={{
          human: corner()[1],
          computer: !corner()[1]
        }} >{middle()[0]}</span>
        {props.cell}
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
