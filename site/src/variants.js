import { For } from 'solid-js'
import { DiagPos, DiagNeg } from './variants/diag.js'
import { King } from './variants/chess.js'

export const variants = [
  DiagPos,
  DiagNeg,
  King
]

export const variantsMap = new Map(variants.map((variant) => [variant.key, variant]))

function Settings (props) {
  function thermoEdit () {
    console.log('thermo edit')
  }
  function thermoDelete () {
    console.log('thermo delete')
  }
  function difference () {
    console.log('difference')
  }
  return (
    <>
      <For each={variants}>
        {(Item) => <Item.Settings/>}
      </For>
        <span class="merge_button">
          <button onClick={thermoEdit}>Thermo</button><button onClick={thermoDelete} class="toggle-no-addon">&#x1F5D1;</button>
        </span>
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
