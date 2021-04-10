
import("./node_modules/sudoku/sudoku.js").then((js) => {
  var cells = getElementsByXPath('//li/span')
  var solution_count = document.getElementById('count')
  var app_mode = 'setter'
  var app_mode_text = document.getElementById('app_mode')
  var selected = new Set()
  var line = '..3.2.6..9..3.5..1..18.64....81.29..7.......8..67.82....26.95..8..2.3..9..5.1.3..';

  function getElementsByXPath(xpath)
  {
      let results = [];
      let query = document.evaluate(xpath, document,
          null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (let i = 0, length = query.snapshotLength; i < length; ++i) {
          results.push(query.snapshotItem(i));
      }
      return results;
  }

  function render_selected(){
    for(i = 0; i < cells.length; i++){
      full_cell = cells[i].parentElement
      if (selected.has(i)){
        full_cell.classList.add('selected')
      }
      else {
        full_cell.classList.remove('selected')
      }
    }
  }

  function init_cells(){
    var is_mouse_down = false;
    function cell_click(i) {
      return (event) => {
        if (!event.shiftKey){
          selected.clear()
        }
        selected.add(i)
        render_selected()
      }
    }
    function cell_over(i) {
      return (event) => {
        if(is_mouse_down){
          selected.add(i)
          render_selected()
        }
      }
    }
    for(i = 0; i < cells.length; i++){
      full_cell = cells[i].parentElement
      full_cell.addEventListener('mousedown', cell_click(i));
      full_cell.addEventListener('mouseover', cell_over(i));
    }
    document.addEventListener('mousedown', () => is_mouse_down = true)
    document.addEventListener('mouseup', () => is_mouse_down = false)
  }

  function init_button() {
    solve = getElementsByXPath('//button[@id="solve"]')[0];
    solve.onclick = solve_current;
    new_sudoku = getElementsByXPath('//button[@id="new"]')[0];
    new_sudoku.onclick = generate_new;
    clear_button = document.getElementById("clear");
    clear_button.onclick = clear;
    reset_button = document.getElementById("reset");
    reset_button.onclick = reset;
    app_mode_button = document.getElementById("app_mode_button");
    app_mode_button.onclick = change_mode;
  }

  function init_keyboard() {
    document.addEventListener('keydown', (event) => {
      var key = parseInt(event.key)
      if (Number.isInteger(key) && key >= 1 && key <= 9){
        for (let cell_id of selected) {
          if (can_change(cell_id)) {
            cells[cell_id].innerHTML = key
            cells[cell_id].className = app_mode == 'setter' ? 'clue' : 'other'
          }
        }
        update_solution_count()
      }
      else if (event.key == "Delete" || event.key == "Backspace"){
        for (let cell_id of selected) {
          if (can_change(cell_id)) {
            cells[cell_id].innerHTML = ""
            cells[cell_id].className = ""
          }
        }
        update_solution_count()
      }
      else {
        console.log("unhandled event", event.key)
      }
    })
  }

  function can_change(id) {
    if (app_mode == 'setter') {
      return true;
    }
    else if (app_mode == 'solver') {
      return !cells[id].classList.contains('clue')
    }
    else {
      throw "unknown app_mode"
    }
  }

  function change_mode() {
    app_mode = app_mode == 'setter' ? 'solver' : 'setter'
    app_mode_text.innerHTML = app_mode
  }

  function clear() {
    for(i = 0; i < cells.length; i++){
      if(cells[i].classList.contains('other')){
        cells[i].innerHTML = ""
      }
    }
    update_solution_count()
  }

  function reset() {
    for(i = 0; i < cells.length; i++){
      cells[i].innerHTML = ""
      cells[i].className = ""
    }
    update_solution_count()
  }

  function get_current_line() {
    line = ""
    for(i = 0; i < 81; i++){
      var c = cells[i].innerHTML;
      if(c == ''){
        line += '.';
      }
      else{
        line += cells[i].innerHTML;
      }
    }
    return line
  }

  function update_solution_count() {
    var t0 = performance.now()
    solution_count.innerHTML = js.solution_count(get_current_line())
    var t1 = performance.now()
    console.log("solution count timing: ", t1-t0)
  }

  function solve_current(){
    var res = js.solve(get_current_line())
    for(i = 0; i < 81; i++){
      cells[i].innerHTML = res[i];
    }
  }

  function generate_new() {
    set_line(js.generate())
  }

  function set_line(line){
    for(i = 0; i < 81; i++){
      cells[i].classList.remove('clue')
      cells[i].classList.remove('other')

      if(line[i] != '.'){
        cells[i].innerHTML = line[i]
        cells[i].classList.add('clue')
      }
      else {
        cells[i].innerHTML = ""
        cells[i].classList.add('other')
      }
    }
    update_solution_count()
  }

  js.init()
  init_cells()
  init_button()
  init_keyboard()
  set_line(line)
});
