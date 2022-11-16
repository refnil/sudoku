import { BaseMode } from './base.js'

class BaseKeyboardMode extends BaseMode {
  render () {
    const classes = this.keyboardClasses
    const click = (key) => (e) => this.handle_event(key)
    return () => (
      <div class={classes}>
        <button onClick={click(1)}>1</button>
        <button onClick={click(2)}>2</button>
        <button onClick={click(3)}>3</button>
        <button onClick={click(4)}>4</button>
        <button onClick={click(5)}>5</button>
        <button onClick={click(6)}>6</button>
        <button onClick={click(7)}>7</button>
        <button onClick={click(8)}>8</button>
        <button onClick={click(9)}>9</button>
        <button class="delete" onClick={click('Delete')}>Delete</button>
      </div>
    )
  }

  get keyboardClasses () {
    return 'keyboard'
  }

  handle_event (key) {
    if (key === 'Delete' || key === 'Backspace') {
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

export class ToggleCellKeyboard extends BaseKeyboardMode {
  constructor (mouseMode, toggle, clear) {
    super()
    this.mouseMode = mouseMode
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

export class MiddleCellKeyboard extends ToggleCellKeyboard {
  get keyboardClasses () {
    return super.keyboardClasses + ' middle-cell'
  }
}

export class CornerCellKeyboard extends ToggleCellKeyboard {
  get keyboardClasses () {
    return super.keyboardClasses + ' corner-keyboard'
  }

  render () {
    const classes = this.keyboardClasses
    const click = (key) => (e) => this.handle_event(key)
    return () => (
      <div class={classes}>
        <button onClick={click(1)}><span class="top-left">1</span></button>
        <button onClick={click(2)}><span class="top-middle">2</span></button>
        <button onClick={click(3)}><span class="top-right">3</span></button>
        <button onClick={click(4)}><span class="middle-left">4</span></button>
        <button onClick={click(5)}>5</button>
        <button onClick={click(6)}><span class="middle-right">6</span></button>
        <button onClick={click(7)}><span class="bottom-left">7</span></button>
        <button onClick={click(8)}><span class="bottom-middle">8</span></button>
        <button onClick={click(9)}><span class="bottom-right">9</span></button>
        <button onClick={click('Delete')} class="delete">Delete</button>
      </div>
    )
  }
}

export class ColorCellKeyboard extends ToggleCellKeyboard {
  get keyboardClasses () {
    return super.keyboardClasses + ' color-keyboard'
  }
}

export class SingleExtraKeyboard extends BaseKeyboardMode {
  constructor (setRule, ruleName, baseLength) {
    super()
    this.setRule = setRule
    this.rulename = ruleName
    this.baseLength = baseLength
  }

  set (...val) {
    this.setRule(this.rulename, ...val)
  }

  handle_delete () {
    this.set(0, rule => {
      if (rule && rule.length > this.baseLength) {
        return rule.slice(0, this.baseLength)
      }
      return rule
    })
  }

  handle_number (key) {
    console.log('single', key)
    this.set(0, rule => {
      if (!rule || rule[this.baseLength] === key) {
        return rule
      }
      return [...rule.slice(0, this.baseLength), key]
    })
  }
}
