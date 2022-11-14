import { createMemo, For, onMount, onCleanup } from 'solid-js'
import { usePuzzle } from './providers/puzzle.js'
import { useKeyboardMode } from './providers/keyboard-mode.js'

const CellComponent = (props) => {
  return (
        <li classList={{ selected: props.isCellSelected(props.index()) }}
            onMouseDown={props.mouseDown()(props.index())}
            onMouseOver={props.mouseOver()(props.index())}
        >
        <span class="middle-cell" />
        {props.cell}
        </li>
  )
}

export const GridComponent = () => {
  const { puzzle } = usePuzzle()


  function mouseDown () {
    setIsMouseDown(true)
  }

  function mouseUp () {
    setIsMouseDown(false)
    mouseMode().finish_click()
  }

  const keyboardMode = useKeyboardMode()[0]
  function onKeyDown (event) {
    keyboardMode().handle_event(event.key)
  }

  onMount(() => {
    document.addEventListener('mousedown', mouseDown)
    document.addEventListener('mouseup', mouseUp)
    document.addEventListener('keydown', onKeyDown)
  })

  onCleanup(() => {
    document.removeEventListener('mousedown', mouseDown)
    document.removeEventListener('mouseup', mouseUp)
    document.removeEventListener('keydown', onKeyDown)
  })

  return (
        <div><div id="sudoku" class="sudoku">
        <ul>
        <For each={puzzle.grid.cells}>
          {(cell, index) => <CellComponent cell={cell} index={index} mouseDown={cellMouseDown} mouseOver={cellMouseOver} isCellSelected={isCellSelected}/>}
        </For>
        </ul>
        </div></div>
  )
}
