import { For, createMemo } from 'solid-js'
import { usePuzzle } from './providers/puzzle.js'
import { useMouseMode } from './providers/mouse-mode.js'

const CellComponent = (props) => {
  const mouseMode = useMouseMode()[0]
  const mouseDown = createMemo(() => mouseMode().click(props.index()))
  const mouseOver = createMemo(() => mouseMode().over(props.index()))
  const isSelected = createMemo(() => mouseMode().isSelected(props.index()))

  return (
        <li classList={{ selected: isSelected() }}
            onMouseDown={mouseDown()}
            onMouseOver={mouseOver()}
        >
        <span class="middle-cell" />
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
