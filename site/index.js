
import("./node_modules/sudoku/sudoku.js").then((js) => {
  var cells = getElementsByXPath('//li/span')
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
  }

  function init_keyboard() {
    document.addEventListener('keydown', (event) => {
      var key = parseInt(event.key)
      if (Number.isInteger(key) && key >= 1 && key <= 9){
        for (let cell_id of selected) {
          if (cells[cell_id].classList.contains('other')) {
            cells[cell_id].innerHTML = key
          }
        }
      }
      else if (event.key == "Delete" || event.key == "Backspace"){
        for (let cell_id of selected) {
          if (cells[cell_id].classList.contains('other')) {
            cells[cell_id].innerHTML = ""
          }
        }
      }
      else {
        console.log("unhandled event", event.key)
      }
    })
  }

  function clear() {
    for(i = 0; i < cells.length; i++){
      if(cells[i].classList.contains('other')){
        cells[i].innerHTML = ""
      }
    }
  }

  function solve_current(){
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
    var res = js.solve(line)
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
  }

  js.init()
  init_cells()
  init_button()
  init_keyboard()
  set_line(line)
});
