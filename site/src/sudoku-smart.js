var worker = new Worker(new URL('./sudoku-caller.js', import.meta.url));

self.onmessage = (m) => {
  worker.postMessage(m.data);
}

worker.onmessage = (m) => {
  postMessage(m.data);
}
