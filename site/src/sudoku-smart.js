
var workers = new Map();
var finished = new Set();
var requests = new Map();
var responses = new Map();

function get_worker(key) {
  var worker = workers.get(key);
  var is_finished = finished.has(key);
  if (!is_finished) {
    if (worker != undefined) {
      worker.terminate();
    }
    worker = new Worker(new URL('./sudoku-caller.js', import.meta.url));
  }
  return worker;
}

self.onmessage = (m) => {
  var key = m.data[0];
  var arg = m.data[1];
  if (requests.get(key) == arg) {
    var resp = responses.get(key);
    if (resp != undefined) {
      postMessage(resp);
    }
    return;
  }

  var worker = get_worker(key);
  worker.onmessage = (r) => {
    if (r.data == "finish") {
      finished.add(key);
    }
    else {
      postMessage(r.data);
      responses.set(key, r.data);
    }
  }
  worker.postMessage(m.data);
  workers.set(key, worker);
  requests.set(key, arg);
  finished.delete(key);
  responses.delete(key);
}
