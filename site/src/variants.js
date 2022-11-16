import { For } from 'solid-js'
import { usePuzzle } from './providers/puzzle.js'
import { DiagPos, DiagNeg } from './variants/diag.js'
import { King } from './variants/chess.js'
import * as Thermo from './variants/thermo.js'
import * as Difference from './variants/difference.js'

export const variants = [
  DiagPos,
  DiagNeg,
  King,
  Thermo,
  Difference
]

export const variantsMap = new Map(variants.map((variant) => [variant.key, variant]))

function Settings (props) {
  return (
    <>
      <For each={variants}>
        {(Item) => <Item.Settings/>}
      </For>
    </>
  )
}

function Render (props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" class="svg" viewbox="0 0 900 900">
      <For each={variants}>
        {(Item) => <Item.Render/>}
      </For>
    </svg>
  )
}

function Rules(props)
{
    const { isRule } = usePuzzle()
    return <>{[...new Set(variants.filter(v=>isRule(v.key)).map(v=>v.rule))].join(" ")}</>
}

export default { Render, Settings, Rules }
