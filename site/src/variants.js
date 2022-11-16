import { For } from 'solid-js'
import { DiagPos, DiagNeg } from './variants/diag.js'
import { King } from './variants/chess.js'
import * as Thermo from './variants/thermo.js'

export const variants = [
  DiagPos,
  DiagNeg,
  King,
  Thermo
]

export const variantsMap = new Map(variants.map((variant) => [variant.key, variant]))

function Settings (props) {
  function difference () {
    console.log('difference')
  }
  return (
    <>
      <For each={variants}>
        {(Item) => <Item.Settings/>}
      </For>
       <button onClick={difference}>Difference</button>
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

export default { Render, Settings }
