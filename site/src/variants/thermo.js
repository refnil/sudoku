import { Show, createMemo, createEffect, For } from 'solid-js'
import { usePuzzle } from '../providers/puzzle.js'
import { cellIDToSVGPos } from './svg.js'
import { useMouseMode } from '../providers/mouse-mode.js'

export const key = 'thermo'
export const rule = 'The number are growing along a thermometer from the bubble to the tip.'
export function load (string) {
  const value = string.replace(key, '').split('|').filter(p => p)
  return (old) => {
    const next = old ? [...old] : []
    next.push(value)
    return next
  }
}

export function extract (rule) {
  return rule.map(thermo => ['thermo', ...thermo].join('|')).join(';')
}

export function Settings (props) {
  const { isRule } = usePuzzle()
  const [mouseMode, setMouseMode, MouseMode] = useMouseMode()
  const isEditing = createMemo(() => mouseMode() === MouseMode.Thermo)
  const isDeleting = createMemo(() => mouseMode() === MouseMode.ThermoDelete)
  function thermoEdit () {
    setMouseMode(isEditing() ? MouseMode.Selection : MouseMode.Thermo)
  }

  function thermoDelete () {
    setMouseMode(isDeleting() ? MouseMode.Selection : MouseMode.ThermoDelete)
  }
  return (
    <span class="merge_button">
      <button
      classList={{
        'toggle-edit': isEditing(),
        'toggle-on': !isEditing() && isRule(key),
        'toggle-off': !isEditing() && !isRule(key)
      }}
      onClick={thermoEdit}>Thermo</button>

      <button
      disabled={!isRule(key)}
      classList={{
        'toggle-edit': isDeleting(),
        'toggle-on': !isDeleting() && isRule(key),
        'toggle-off': !isDeleting() && !isRule(key)
      }}
      onClick={thermoDelete} class="toggle-no-addon">&#x1F5D1;</button>
    </span>
  )
}

function ThermoBulb (props) {
  const circleProps = createMemo(() => {
    const [line, col] = cellIDToSVGPos(props.cell)
    return { cx: line, cy: col }
  })
  return (
    <circle {...circleProps} r="35" stroke="FireBrick" stroke-width="4" fill="white"/>
  )
}

function ThermoPath (props) {
  const pathProps = createMemo(() => {
    return {
      d: props.cells.map((cell, index) => {
        const [line, col] = cellIDToSVGPos(cell)
        return `${index === 0 ? 'M' : 'L'} ${line}, ${col}`
      }).join('')
    }
  })
  return (
        <path {...pathProps()} fill="none" stroke="FireBrick" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/>
  )
}

function Thermo (props) {
  return (
      <>
        <ThermoPath cells={props.thermo}/>
        <ThermoBulb cell={props.thermo[0]}/>
      </>
  )
}
export function Render (props) {
  const { getRule } = usePuzzle()
  return (
    <For each={getRule(key)}>{(item) => <Thermo thermo={item}/>}</For>
  )
}
