let limit = false
function notify (notification, count) {
  let message = ''
  if (count == 0) {
    message = 'No solution'
  } else {
    switch (notification) {
      case 0:
        // Ongoing
        limit = false
        if (count >= 5 && count % 5 != 0) {
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

import('../node_modules/sudoku/sudoku.js').then((sudoku) => {
  function receive_message (message) {
    switch (message.data[0]) {
      case 'solve_count':
        solve_count(message.data[1], message.data[2])
        break
      case 'solve_common':
        solve_common(message.data[1], message.data[2])
        break
      case 'generate':
        generate()
        break
      default:
        console.error('Could not handle message: ', message)
    }
  }

  function solve_count (data, limit) {
    const t0 = performance.now()
    const r = sudoku.solution_count_notify(data, limit)
    const t1 = performance.now()
    console.log('solution count timing: ', t1 - t0, r)
  }

  function solve_common (data, limit) {
    send_result('solve_common', sudoku.solve_common_extra(data, limit))
  }

  function generate () {
    send_result('generate', sudoku.generate())
  }

  function send_result (name, return_data) {
    postMessage([name, return_data])
    postMessage('finish')
  }

  sudoku.init()
  for (const i in message_during_init) {
    receive_message(message_during_init[i])
  }
  self.onmessage = receive_message
})

var message_during_init = new Array()
function save_for_later (message) {
  message_during_init.push(message)
}
self.onmessage = save_for_later
