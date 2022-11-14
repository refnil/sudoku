import { createSignal, createSelector } from 'solid-js'
import { BaseMode } from './base.js'

class BaseMouseMode extends BaseMode {
  add (...args) {
    this.log('add', args)
  }

  clear (...args) {
    this.log('clear', args)
  }

  finish_click (...args) {
    this.log('finish_click', args)
  }
}

const [lastCellOver, setLastCellOver] = createSignal(null)
const [isMouseDown, setIsMouseDown] = createSignal(false)
const [selectedSet, setSelectedSet] = createSignal(new Set())
const isCellSelected = createSelector(selectedSet, (index, s) => s.has(index))

export class SelectionMode extends BaseMouseMode {
  add (index) {
    setSelectedSet((s) => {
      if (s.has(index)) {
        return s
      }
      const n = new Set(s)
      n.add(index)
      return n
    })
  }

  clear (index, shift) {
    if (!shift) {
      setSelectedSet(new Set())
    }
  }
}

const MouseMode = {
  Selection: new SelectionMode()
}
const [mouseMode, setMouseMode] = createSignal(MouseMode.Selection)
