import { createSignal, createSelector } from 'solid-js'
import { BaseMode } from './base.js'

class BaseMouseMode extends BaseMode {
  constructor (mouseDown) {
    super()
    this.lastCellHoverSignal = createSignal(null)
    this.isMouseDown = mouseDown
  }

  click (index) {
    return (event) => {
      this.clear(index, event.shiftKey)
      this.add(index)
    }
  }

  over (index) {
    return (event) => {
      this.lastCellHoverSignal[1](index)
      if (this.isMouseDown()) {
        setTimeout(() => {
          if (index === this.lastCellHoverSignal[0]() && this.isMouseDown()) {
            this.add(index)
            this.lastCellHoverSignal[1](null)
          }
        }, 20)
      }
    }
  }

  add (...args) {
    this.log('add', args)
  }

  clear (...args) {
    this.log('clear', args)
  }

  finish_click (...args) {
    this.log('finish_click', args)
  }

  isSelected (...args) {
    this.log('isSelected', args)
    return false
  }

  selected () {
    this.log('selected')
    return new Set()
  }
}

export class SelectionMode extends BaseMouseMode {
  constructor (mouseDown) {
    super(mouseDown)
    this.selectedSetSignal = createSignal(new Set())
    this.isCellSelected = createSelector(this.selectedSetSignal[0], (index, s) => s.has(index))
  }

  add (index) {
    this.selectedSetSignal[1]((s) => {
      if (s.has(index)) {
        return s
      }
      const n = new Set(s)
      n.add(index)
      console.log(n)
      return n
    })
  }

  clear (index, shift) {
    if (!shift) {
      this.selectedSetSignal[1](new Set())
    }
  }

  isSelected (index) {
    return this.isCellSelected(index)
  }

  selected () {
    return this.selectedSetSignal[0]()
  }
}
