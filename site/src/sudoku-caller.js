import("../node_modules/sudoku/sudoku.js").then((sudoku) => {
  function receive_message(message) {
    console.log("receiving message");
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
    console.log("solution count timing: ", t1-t0)
  }

  function solve_common(data) {
    send_result('solve_common', sudoku.solve_common(data));
  }

  function send_result(name, return_data) {
    postMessage([name, return_data]);
  }

  sudoku.init()
  self.onmessage = receive_message;
});
