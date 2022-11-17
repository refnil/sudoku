import { Show, createMemo, createEffect, For, batch } from 'solid-js'
import { cellIDToSVGPos } from './svg.js'
import { usePuzzle } from '../providers/puzzle.js'
import { useMouseMode } from '../providers/mouse-mode.js'
import { useKeyboardMode } from '../providers/keyboard-mode.js'

export const key = 'diff'
export const rule = 'A number in a green circle between two cells is the difference of these two cells.'
export function load (string) {
  const value = string.replace(key, '').split('|').filter(p => p)
  return (old) => {
    const next = old ? [...old] : []
    next.push(value)
    return next
  }
}

export function extract (rule) {
  return rule.map(diff => ['diff', ...diff].join('|')).join(';')
}

function Diff (props) {
  const pos = createMemo(() => {
    const [line1, col1] = cellIDToSVGPos(props.diff[0])
    const [line2, col2] = cellIDToSVGPos(props.diff[1])
    return [(line1 + line2) / 2, (col1 + col2) / 2]
  })
  const circleProps = createMemo(() => {
    const [cx, cy] = pos()
    return { cx, cy }
  })
  const textProps = createMemo(() => {
    const [x, y] = pos()
    return { x, y }
  })

  return (
        <>
        <circle {...circleProps()} r="20" stroke="DarkSeaGreen" stroke-width="4" fill="white" style={{ 'z-index': '1' }}/>
        <Show when={props.diff[2]}>
        <text {...textProps()} text-anchor="middle" dominant-baseline="middle" font-size="1.8em">{props.diff[2]}</text>
        </Show>
        </>
  )
}

export function Render (props) {
  const { getRule } = usePuzzle()
  return (
      <For each={getRule(key)} >
      {(diff) => <Diff diff={diff}/>}
      </For>
  )
}

export function Settings (props) {
  const { isRule, setRule } = usePuzzle()
  const [mouseMode, setMouseMode, MouseMode] = useMouseMode()
  const [keyboardMode, setKeyboardMode, KeyboardMode] = useKeyboardMode()
  const isEditing = createMemo(() => mouseMode() === MouseMode.Difference && keyboardMode() === KeyboardMode.Difference)
  createEffect(() => {
    if (!isEditing()) {
      setRule(key, (arr) => {
        let changed = false
        let next = arr ? [...arr] : []
        for (let i = next.length - 1; i >= 0; i--) {
          if (next[i].length !== 3) {
            next.splice(i, 1)
            changed = true
          }
        }
        next = next.length !== 0 ? next : undefined
        next = changed ? next : arr
        return next
      })
      if (keyboardMode() === KeyboardMode.Difference) {
          setKeyboardMode(KeyboardMode.FullCell)
      }
      if (mouseMode() === MouseMode.Difference) {
          setMouseMode(MouseMode.Selection)
      }
    }
  })

  function toggleEdit () {
    batch(() => {
      setKeyboardMode(isEditing() ? KeyboardMode.FullCell : KeyboardMode.Difference)
      setMouseMode(isEditing() ? MouseMode.Selection : MouseMode.Difference)
    })
  }
  return (
        <button
          classList={{
            'toggle-edit': isEditing(),
            'toggle-on': !isEditing() && isRule(key),
            'toggle-off': !isEditing() && !isRule(key)
          }}
           onClick={toggleEdit}
        >Difference</button>
  )
}
