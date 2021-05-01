import("../node_modules/sudoku/sudoku.js").then((sudoku) => {
  function receive_message(message) {
    switch (message.data[0]) {
      case 'solve_count':
        solve_count(message.data[1]);
        break;
      case 'solve_common':
        solve_common(message.data[1]);
        break;
      default:
        console.error("Could not handle message: ", message);
    }
  }

  function solve_count(data) {
    var t0 = performance.now();
    send_result('solve_count', sudoku.solution_count(data));
    var t1 = performance.now();
    console.log("solution count timing: ", t1-t0);
  }

  function solve_common(data) {
    send_result('solve_common', sudoku.solve_common(data));
  }

  function send_result(name, return_data) {
    postMessage([name, return_data]);
    postMessage("finish");
  }

  sudoku.init()
  for (var i in message_during_init) {
    receive_message(message_during_init[i]);
  }
  self.onmessage = receive_message;
});

var message_during_init = new Array();
function save_for_later(message) {
  message_during_init.push(message);
}
self.onmessage = save_for_later;
