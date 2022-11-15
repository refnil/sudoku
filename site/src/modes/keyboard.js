import { BaseMode } from './base.js'

class BaseKeyboardMode extends BaseMode {
  constructor (mouseMode) {
    super()
    this.mouseMode = mouseMode
  }

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
    key = parseInt(key) || key
    if (Number.isInteger(key) && key >= 1 && key <= 9) {
      this.handle_number(key)
    }
  }

  handle_number (key) {
    this.log('hanlde_number', key)
  }
}

class ToggleCellKeyboard extends BaseKeyboardMode {
  constructor (mouseMode, toggle, clear) {
    super(mouseMode)
    this.toggle = toggle
    this.clear = clear
  }

  handle_delete () {
    for (const cellId of this.mouseMode().selected()) {
      this.clear(cellId)
    }
  }

  handle_number (key) {
    for (const cellId of this.mouseMode().selected()) {
      this.toggle(cellId, key)
    }
  }
}

export class FullCellKeyboard extends ToggleCellKeyboard {
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
}

export class MiddleCellKeyboard extends ToggleCellKeyboard {
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

export class CornerCellKeyboard extends ToggleCellKeyboard {
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
