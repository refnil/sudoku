let limit = false
function notify (notification, count) {
  let message = ''
  if (count === 0) {
    message = 'No solution'
  } else {
    switch (notification) {
      case 0:
        // Ongoing
        limit = false
        if (count >= 5 && count % 5 !== 0) {
          return
        }
        message = `${count} or more`
        break
      case 1:
        // Limit
        message = `Hit limit at ${count}`
        limit = true
        break
      case 2:
        // Final
        if (limit) {
          return
        }
        message = count
        break
      case 3:
        message = 'Error when parsing sudoku'
        break
      default:
        console.error('Unknown notification', notification, count)
        return
    }
  }
  postMessage(['solve_count', message])
}
console.notify = notify

import('sudoku/sudoku.js').then((sudoku) => {
  function receiveMessage (message) {
    switch (message.data[0]) {
      case 'solve_count':
        solveCount(message.data[1], message.data[2])
        break
      case 'solve_common':
        solveCommon(message.data[1], message.data[2])
        break
      case 'generate':
        generate()
        break
      default:
        console.error('Could not handle message: ', message)
    }
  }

  function solveCount (data, limit) {
    const t0 = performance.now()
    const r = sudoku.solution_count_notify(data, limit)
    const t1 = performance.now()
    console.log('solution count timing: ', t1 - t0, r)
  }

  function solveCommon (data, limit) {
    sendResult('solve_common', sudoku.solve_common_extra(data, limit))
  }

  function generate () {
    sendResult('generate', sudoku.generate())
  }

  function sendResult (name, returnData) {
    postMessage([name, returnData])
    postMessage('finish')
  }

  sudoku.init()
  for (const i in messageDuringInit) {
    receiveMessage(messageDuringInit[i])
  }
  self.onmessage = receiveMessage
})

const messageDuringInit = []
function saveForLater (message) {
  messageDuringInit.push(message)
}
self.onmessage = saveForLater
