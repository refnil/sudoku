
import("./node_modules/sudoku/sudoku.js").then((js) => {
  var cells = getElementsByXPath('//li/span')
  var solution_count = document.getElementById('count')
  var app_mode = 'setter'
  var app_mode_text = document.getElementById('app_mode')
  var selected = new Set()
  var input = document.getElementById('save');
  var line = '..3.2.6..9..3.5..1..18.64....81.29..7.......8..67.82....26.95..8..2.3..9..5.1.3..';
  var diag_pos = false;
  var diag_pos_text = document.getElementById('diag_pos');
  var diag_pos_vis = document.getElementById('diag_pos_vis')
  var diag_neg = false;
  var diag_neg_text = document.getElementById('diag_neg');
  var diag_neg_vis = document.getElementById('diag_neg_vis')
  var king = false;
  var king_text = document.getElementById('king');

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

  function init_ui() {
    init_button();
    init_cells();

    input.addEventListener('input', (event) => {
      if (input.value != get_current_line()) {
        set_line(input.value, "clue");
      }
    })
  }

  function init_button() {
    solve = getElementsByXPath('//button[@id="solve"]')[0];
    solve.onclick = solve_current;
    new_sudoku = getElementsByXPath('//button[@id="new"]')[0];
    new_sudoku.onclick = generate_new;
    cc_button = document.getElementById("clear_computer");
    cc_button.onclick = clear_computer;
    clear_button = document.getElementById("clear");
    clear_button.onclick = clear;
    reset_button = document.getElementById("reset");
    reset_button.onclick = reset;
    app_mode_button = document.getElementById("app_mode_button");
    app_mode_button.onclick = change_mode;

    diag_pos_button = document.getElementById("diag_pos_button");
    diag_pos_button.onclick = (event) => {
      diag_pos = !diag_pos;
      update_text_on_off(diag_pos, diag_pos_text);
      if (diag_pos) {
        diag_pos_vis.classList.add('diag', 'diag-pos');
      }
      else {
        diag_pos_vis.classList.remove('diag-pos');
      }
      update_solution_count();
    }

    diag_neg_button = document.getElementById("diag_neg_button");
    diag_neg_button.onclick = (event) => {
      diag_neg = !diag_neg;
      update_text_on_off(diag_neg, diag_neg_text);
      if (diag_neg) {
        diag_neg_vis.classList.add('diag', 'diag-neg');
      }
      else {
        diag_neg_vis.classList.remove('diag-neg');
      }
      update_solution_count();
    }

    king_button = document.getElementById("king_button");
    king_button.onclick = (event) => {
      king = !king;
      update_text_on_off(king, king_text);
      update_solution_count();
    };

  }

  function update_text_on_off(value, text_ref) {
    if (value) {
      text_ref.innerHTML = "On";
    }
    else {
      text_ref.innerHTML = "Off";
    }
  }

  function init_keyboard() {
    document.addEventListener('keydown', (event) => {
      var key = parseInt(event.key)
      var current_kind = app_mode == 'setter' ? 'clue' : 'human';
      if (Number.isInteger(key) && key >= 1 && key <= 9){
        for (let cell_id of selected) {
          if (can_change(cell_id)) {
            set_cell(cell_id, key, current_kind);
          }
        }
        update_solution_count()
      }
      else if (event.key == "Delete" || event.key == "Backspace"){
        for (let cell_id of selected) {
          if (can_change(cell_id)) {
            set_cell(cell_id, '', current_kind);
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

  function clear_computer(){
    for(i = 0; i < cells.length; i++){
      set_cell(i, '', "computer");
    }
    update_solution_count()
  }

  function clear() {
    for(i = 0; i < cells.length; i++){
      set_cell(i, '', "human");
    }
    update_solution_count()
  }

  function reset() {
    for(i = 0; i < cells.length; i++){
      set_cell(i, '', "clue");
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
    if (diag_pos) {
      line += ";diag_pos";
    }
    if (diag_neg) {
      line += ";diag_neg";
    }
    if (king) {
      line += ";king";
    }
    return line
  }

  function update_solution_count() {
    var t0 = performance.now()
    solution_count.innerHTML = js.solution_count(get_current_line())
    var t1 = performance.now()
    console.log("solution count timing: ", t1-t0)
    if (input !== document.activeElement) {
      input.value = get_current_line();
    }
  }

  function solve_current(){
    var res = js.solve_common(get_current_line())
    if (res.length != 81){
      return
    }
    set_line(res, "computer");
    update_solution_count();
  }

  function generate_new() {
    set_line(js.generate(), "clue")
  }

  function set_line(line, kind = "human"){
    for(i = 0; i < 81; i++){
      var value = line[i];
      if(value === undefined || value === '.') {
        value = '';
      }
      set_cell(i, value, kind);
    }
    update_solution_count()
  }

  function set_cell(id, value = '', kind = "human") {
    // kind can be "clue", "human", "computer"
    cell = cells[id];
    cl = cell.classList;
    switch(kind){
      case "clue":
        cl.remove("human", "computer");
        break;
      case "human":
        if (!cl.contains("clue")) {
          cl.remove("computer");
          break;
        }
        else {
          return;
        }
      case "computer":
        if (!cl.contains("clue") && !cl.contains("human")) {
          break;
        }
        else {
          return;
        }
      default:
        console.error("UNKNOWN KIND: ", kind);
    }
    cell.innerHTML = value;
    if (value == '') {
      cl.remove("clue", "human", "computer");
    }
    else {
      cl.add(kind);
    }
  }

  js.init()
  init_ui()
  init_keyboard()
  set_line(line, "clue");
});
