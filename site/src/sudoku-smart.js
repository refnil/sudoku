
const workers = new Map()
const finished = new Set()
const requests = new Map()
const responses = new Map()

function get_worker (key) {
  let worker = workers.get(key)
  const is_finished = finished.has(key)
  if (!is_finished) {
    if (worker != undefined) {
      worker.terminate()
    }
    worker = new Worker(new URL('./sudoku-caller.js', import.meta.url))
  }
  return worker
}

self.onmessage = (m) => {
  const key = m.data[0]
  const arg = m.data[1] + m.data[2]
  if (requests.get(key) == arg) {
    const resp = responses.get(key)
    if (resp != undefined) {
      postMessage(resp)
    }
    return
  }

  const worker = get_worker(key)
  worker.onmessage = (r) => {
    if (r.data == 'finish') {
      finished.add(key)
    } else {
      postMessage(r.data)
      responses.set(key, r.data)
    }
  }
  worker.postMessage(m.data)
  workers.set(key, worker)
  requests.set(key, arg)
  finished.delete(key)
  responses.delete(key)
}
