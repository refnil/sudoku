import './index.css'

import { render } from 'solid-js/web'

import { KeyboardModeProvider } from './providers/keyboard-mode.js'
import { MouseModeProvider } from './providers/mouse-mode.js'
import { PuzzleProvider, usePuzzle } from './providers/puzzle.js'
import { InfoProvider } from './providers/grid-info.js'
import { ComputerProvider } from './providers/computer.js'

import { SetterTab } from './tabs/setter.js'
import { SolverTab } from './tabs/solver.js'

import { GridComponent } from './grid.js'

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
    <InfoProvider>
    <ComputerProvider>
    <MouseModeProvider>
    <KeyboardModeProvider>
    <Header/>
    <div class="sudoku-container">
      <SetterTab />
      <GridComponent/>
      <SolverTab/>
    </div>
    </KeyboardModeProvider>
    </MouseModeProvider>
    </ComputerProvider>
    </InfoProvider>
    </PuzzleProvider>
  )
}

const root = document.getElementById('root')
root.textContent = ''
render(() => <App />, root)
