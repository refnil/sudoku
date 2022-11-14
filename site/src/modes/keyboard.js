import { BaseMode } from './base.js'

class BaseKeyboardMode extends BaseMode {
  render () {
    this.log('render')
  }

  handle_event (key) {
    if (key == 'Delete' || key == 'Backspace') {
      this.handle_delete()
    } else {
      this.handle_key(key)
    }
  }

  handle_delete () {
    this.log('handle_delete')
  }

  handle_key (key) {
    this.log('handle_key', key)
  }
}

export class FullCellKeyboard extends BaseKeyboardMode {
  constructor (setCell) {
    super()
    this.setCell = setCell
  }

  render () {
    return (
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
    )
  }

  handle_delete () {
    this.setAll(null)
  }

  handle_key (key) {
    key = parseInt(key) || key
    if (Number.isInteger(key) && key >= 1 && key <= 9) {
      this.setAll(key)
    }
  }

  setAll (value) {
    for (const cell_id of selectedSet()) {
      this.setCell(cell_id, value)
    }
  }
}

export class MiddleCellKeyboard extends BaseKeyboardMode {
  render () {
    return (
      <div id="middle-number" class="keyboard middle-cell">
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
    )
  }
}

export class CornerCellKeyboard extends BaseKeyboardMode {
  render () {
    return (
      <div id="corner-number" class="keyboard">
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
    )
  }
}

export class ColorCellKeyboard extends BaseKeyboardMode {
  render () {
    return (
      <div id="color" class="keyboard">
        <button />
        <button />
        <button />
        <button />
        <button />
        <button />
        <button />
        <button />
        <button />
        <button class="delete">Delete</button>
      </div>
    )
  }
}
