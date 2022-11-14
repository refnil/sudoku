import './index.css'

import { render } from 'solid-js/web'

import { KeyboardModeProvider } from './providers/keyboard-mode.js'
import { PuzzleProvider, usePuzzle } from './providers/puzzle.js'

import { SetterTab } from './tabs/setter.js'
import { SolverTab } from './tabs/solver.js'

import { GridComponent } from './grid.js'

/*
const corner_names = [
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
*/

function Header () {
  const { puzzle } = usePuzzle()
  return (
        <center>
          <h1>{puzzle.name || 'Sudoku'}</h1>
          <h2 class={!puzzle.author ? 'hidden' : ''}>{puzzle.author}</h2>
        </center>
  )
}

const App = () => {
  return (
    <PuzzleProvider>
    <KeyboardModeProvider>
    <Header/>
    <div class="sudoku-container">
      <SetterTab />
      <GridComponent/>
      <SolverTab/>
    </div>
    </KeyboardModeProvider>
    </PuzzleProvider>
  )
}

const root = document.getElementById('root')
root.textContent = ''
render(() => <App />, root)
