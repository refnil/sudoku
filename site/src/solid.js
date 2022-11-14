import "./index.css";

import { createSignal, createMemo, createContext, useContext, createSelector, onMount, onCleanup } from 'solid-js';
import { createStore } from "solid-js/store";
import { render } from 'solid-js/web';

class BaseMode {
    log(method, args) {
        console.debug(this.constructor.name, method, args);
    }
}

export const PuzzleContext = createContext();
function usePuzzle() {
    return useContext(PuzzleContext);
}
export function PuzzleProvider(props) {
  const [state, setState] = createStore({
      name: '',
      author: '',
      extraRules: '',
      grid: {
          rules: {
          },
          cells: Array(81).fill(null)
      }
  });
  const counter = 
  {
    puzzle: state,
    setName(name) {
        setState({name: name});
    },
    setAuthor(author) {
        setState({author: author});
    },
    setExtraRules(rules) {
        setState({extraRules: rules});
    },
    setCell(cell_id, value) {
        setState("grid", "cells", cell_id, value);
    }
  };

  return (
    <PuzzleContext.Provider value={counter}>
      {props.children}
    </PuzzleContext.Provider>
  );
}

export const KeyboardModeContext = createContext();
function useKeyboardMode() {
    return useContext(KeyboardModeContext);
}
export function KeyboardModeProvider(props) {
  const { setCell } = usePuzzle()
  const KeyboardMode = {
      FullCell: new FullCellKeyboard(setCell)
  }
  const [state, setState] = createStore(KeyboardMode.FullCell);
  const value = [state, setState, KeyboardMode];

  return (
    <KeyboardModeContext.Provider value={value}>
      {props.children}
    </KeyboardModeContext.Provider>
  );
}

const SetterTab = () => {
    const { puzzle, setName, setAuthor, setExtraRules } = usePuzzle();
    return (
      <div class="sudoku-side">
        <h2>Setter menu</h2>
        <button id='reset'>New grid</button>
        <details>
          <summary>Puzzle informations editor</summary>
          <label>Name</label><input value={puzzle.name} onInput={(e) => setName(e.target.value)}/>
          <label>Author</label><input value={puzzle.author} onInput={(e) => setAuthor(e.target.value)}/>
          <label>Rules:</label>
          <textarea value={puzzle.extraRules} onInput={(e) => setExtraRules(e.target.value)}></textarea>
        </details>
        <h3>Computational operation</h3>
        <p>
        <button id='new'>Generate random sudoku</button>
        <button id='solve'>Solve</button>
        <button id='clear_computer'>Clear computer hint</button>
        </p>
        <p>Solution count: <span id='count'></span></p>
        <p id="solve_result_message" class="hidden">Solve result message: <span id='solve_result_message_text'></span></p>
        <h3>Constraints</h3>
        <p>
        <button id='diag_pos_button'>Diagonal +</button>
        <button id='diag_neg_button'>Diagonal -</button>
        <button id='king_button'>King move</button>
        <span id="thermo" class="merge_button">
          <button>Thermo</button><button class="toggle-no-addon">&#x1F5D1;</button>
        </span>
        <button id="difference">Difference</button>
        </p>
        <h3>Sharing</h3>
        <p><a id="setting_url">Setting url</a></p>
        <p><a id="solving_url">Solving url</a></p>
        <p><a id="sudokuwiki">Export to sudokuwiki</a></p>
        <h3>Other</h3>
        <details>
          <summary>Setter settings</summary>
          <button id="hide_setter">Hide setter side in solving mode</button>
          <label>Solution count limit:</label><input id="solution_count_limit" type="number" step="100"/>
          <label>Solve limit:</label><input id="solve_limit" type="number" step="100"/>
          <label>Solve max middle number: </label><input id="solve_max_middle_number" type="number"/>
          <h4>Debug options</h4>
          <button id="count_after_solve">Update solution count after solve</button>
        </details>
        <details>
          <summary>Manual edit</summary>
          <textarea id="save"></textarea>
        </details>
      </div>
    );
}

class BaseKeyboardMode extends BaseMode {
    key() {
        this.log("key");
    }
    handle_event(key) {
        if (key == "Delete" || key == "Backspace") {
            this.handle_delete();
        }
        else {
            this.handle_key(key);
        }
    }
    handle_delete() {
        this.log("handle_delete");
    }
    handle_key(key) {
        this.log("handle_key", key);
    }
}

class FullCellKeyboard extends BaseKeyboardMode {
    constructor(setCell) {
        super();
        this.setCell = setCell;
    }
    key() {
        return [1,2,3,4,5,6,7,8,9];
    }
    handle_delete() {
        this.setAll(null);
    }
    handle_key(key) {
        key = parseInt(key) || key;
        if (Number.isInteger(key) && key >= 1 && key <= 9) {
            this.setAll(key);
        }
    }
    setAll(value) {
        for (let cell_id of selectedSet()) {
            this.setCell(cell_id, value);
        }
    }
}

const SolverTab = () => {
    const { puzzle } = usePuzzle();
    return (
    <div class="sudoku-side column">
      <div class="row">
      <div class="keyboard-container">
      <div id="number" class="keyboard">
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>5</button>
        <button>6</button>
        <button>7</button>
        <button>8</button>
        <button>9</button>
        <button class="delete">Delete</button>
      </div>
      <div id="corner-number" class="keyboard hidden">
        <button><span class="top-left">1</span></button>
        <button><span class="top-middle">2</span></button>
        <button><span class="top-right">3</span></button>
        <button><span class="middle-left">4</span></button>
        <button>5</button>
        <button><span class="middle-right">6</span></button>
        <button><span class="bottom-left">7</span></button>
        <button><span class="bottom-middle">8</span></button>
        <button><span class="bottom-right">9</span></button>
        <button class="delete">Delete</button>
      </div>
      <div id="middle-number" class="keyboard hidden middle-cell">
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>5</button>
        <button>6</button>
        <button>7</button>
        <button>8</button>
        <button>9</button>
        <button class="delete">Delete</button>
      </div>
      <div id="color" class="keyboard hidden">
        <button></button>
        <button></button>
        <button></button>
        <button></button>
        <button></button>
        <button></button>
        <button></button>
        <button></button>
        <button></button>
        <button class="delete">Delete</button>
      </div>
      </div>
      <div class="column">
        <button id='app_mode_button'>Mode: <span id='app_mode'>setter</span></button>
        <button id="key_number">Number</button>
        <button id="key_corner">Corner</button>
        <button id="key_middle">Center</button>
        <button id="key_color">Color</button>
        <button id='clear'>Clear progress</button>
      </div>
      </div>
      <p>{puzzle.extraRules}</p>
      <p id="puzzle_variant_rule"></p>
      <details>
        <summary>App info</summary>
        <a href="https://github.com/refnil/sudoku/">Source on github</a>
        <a href="https://github.com/refnil/sudoku/issues/new/choose">Open an issue</a>
        Thanks for trying my sudoku app.
      </details>
    </div>
    );
}

var corner_names = [
    "top-left",
    "top-middle",
    "top-right",
    "middle-left",
    "middle-right",
    "bottom-left",
    "bottom-middle-1",
    "bottom-middle-2",
    "bottom-right",
];

const CellComponent = ({cell, index, mouseDown, mouseOver, isCellSelected}) => {
    // li events
    // mousedown cell_click 
    // mouseover cell_over
    return (
        <li classList={{selected: isCellSelected(index())}} 
            onMouseDown={mouseDown()(index())}
            onMouseOver={mouseOver()(index())}
        >
        <span class="middle-cell"></span>
        {cell}
        </li>
    );
}

class BaseMouseMode extends BaseMode {
    add(...args) {
        this.log("add", args);
    }
    clear(...args) {
        this.log("clear", args);
    }
    finish_click(...args) {
        this.log("finish_click", args);
    }
}

const [lastCellOver, setLastCellOver] = createSignal(null);
const [isMouseDown, setIsMouseDown] = createSignal(false);
const [selectedSet, setSelectedSet] = createSignal(new Set());
const isCellSelected = createSelector(selectedSet, (index, s) => s.has(index));

class SelectionMode extends BaseMouseMode{
    add(index) {
        setSelectedSet((s) => {
            if (s.has(index)) {
                return s;
            }
            const n = new Set(s);
            n.add(index);
            return n;
        });
    }
    clear(index, shift) {
        if (!shift) {
            setSelectedSet(new Set());
        }
    }
}

const MouseMode = {
    Selection: new SelectionMode()
}
const [mouseMode, setMouseMode] = createSignal(MouseMode.Selection);

const GridComponent = () => {
    const { puzzle } = usePuzzle();

    const cellMouseDown = createMemo(() => (index) => (event) => {
        const mode = mouseMode();
        mode.clear(index, event.shiftKey);
        mode.add(index);
    });

    const cellMouseOver = createMemo(() => (index) => (event) => {
        setLastCellOver(index);
        if (isMouseDown()) {
            setTimeout(() => {
                if (index == lastCellOver() && isMouseDown()) {
                    mouseMode().add(index);
                    setLastCellOver(null);
                }
            }, 20);
        }
    });

    function mouseDown() {
        setIsMouseDown(true);
    }

    function mouseUp() {
        setIsMouseDown(false);
        mouseMode().finish_click();
    }

    const [keyboardMode,_s, _a] = useKeyboardMode();
    function onKeyDown(event) {
        keyboardMode.handle_event(event.key);
    }

    onMount(() => {
        document.addEventListener("mousedown", mouseDown);
        document.addEventListener("mouseup", mouseUp);
        document.addEventListener("keydown", onKeyDown);
    })

    onCleanup(() => {
        document.removeEventListener("mousedown", mouseDown);
        document.removeEventListener("mouseup", mouseUp);
        document.removeEventListener("keydown", onKeyDown);
    })

    return (
        <div><div id="sudoku" class="sudoku">
        <ul>
        <For each={puzzle.grid.cells}>
          {(cell, index) => <CellComponent cell={cell} index={index} mouseDown={cellMouseDown} mouseOver={cellMouseOver} isCellSelected={isCellSelected}/>}
        </For>
        </ul>
        </div></div>
    );
}



function Header() {
    const { puzzle } = usePuzzle();
    return (
        <center>
          <h1>{puzzle.name||"Sudoku"}</h1>
          <h2 class={!puzzle.author?"hidden":""}>{puzzle.author}</h2>
        </center>
    );
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
  );
};


let root = document.getElementById('root');
root.textContent = '';
render(() => <App />, root);
