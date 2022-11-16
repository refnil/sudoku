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

export class TwoLineRuleMode extends BaseMouseMode {
  constructor (mouseDown, setRule, rulename) {
    super(mouseDown)
    this.setRule = setRule
    this.rulename = rulename
  }

  set (...val) {
    this.setRule(this.rulename, ...val)
  }

  add (index) {
    this.set(0, arr => {
      if (arr.indexOf(index) >= 0) {
        return arr
      } else {
        return [...arr, index]
      }
    })
  }

  clear (index, shift) {
    this.set((c) => {
      const n = c ? [...c] : []
      n.unshift([])
      return n
    })
  }

  finish_click () {
    this.set((rule) => {
      rule = rule || []
      const next = rule.filter(line => line.length > 1)
      if (next.length === 0) {
        return undefined
      }
      if (next.length === rule.length) {
        return rule
      }
      return next
    })
  }
}

export class RemoveFromTwoLine extends BaseMouseMode {
  constructor (mouseDown, setRule, rulename, onEmpty) {
    super(mouseDown)
    this.setRule = setRule
    this.rulename = rulename
    this.onEmpty = onEmpty
  }

  set (...val) {
    this.setRule(this.rulename, ...val)
  }

  clear (index, shift) {
    this.set((arr) => {
      let changed = false
      let next = [...arr]
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i].indexOf(index) >= 0) {
          next.splice(i, 1)
          changed = true
        }
      }
      next = changed ? next : arr
      next = next.length !== 0 ? next : undefined
      if (!next) {
        this.onEmpty()
      }
      return next
    })
  }
}
