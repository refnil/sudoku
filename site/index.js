
import("./node_modules/sudoku/sudoku.js").then((js) => {
  var cells = getElementsByXPath('//li/span');
  var solution_count = document.getElementById('count');
  var app_mode = 'setter';
  var app_mode_text = document.getElementById('app_mode');
  var setter_side = document.getElementById('setter-side');
  var selected = new Set();
  var input = document.getElementById('save');
  var diag_pos = false;
  var diag_pos_vis = document.getElementById('diag_pos_vis');
  var diag_neg = false;
  var diag_neg_vis = document.getElementById('diag_neg_vis');
  var king = false;

  var diag_pos_button = document.getElementById("diag_pos_button");
  var diag_neg_button = document.getElementById("diag_neg_button");
  var king_button = document.getElementById("king_button");

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
        load_data(input.value);
      }
      update_url();
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

    diag_pos_button.onclick = (event) => {
      diag_pos = !diag_pos;
      update_variant_visual();
      update_solution_count();
    }

    diag_neg_button.onclick = (event) => {
      diag_neg = !diag_neg;
      update_variant_visual();
      update_solution_count();
    }

    king_button.onclick = (event) => {
      king = !king;
      update_variant_visual();
      update_solution_count();
    };

    var numbers = document.getElementById("number").children
    for(let i = 0; i < numbers.length; i++) {
      let button = numbers[i];
      console.log(button);
      button.onclick = (event) => {
        handle_key_event(button.innerHTML);
      };
    }
  }

  function update_variant_visual(){
      update_text_on_off(diag_pos, diag_pos_button);
      if (diag_pos) {
        diag_pos_vis.classList.add('diag', 'diag-pos');
      }
      else {
        diag_pos_vis.classList.remove('diag-pos');
      }
      update_text_on_off(diag_neg, diag_neg_button);
      if (diag_neg) {
        diag_neg_vis.classList.add('diag', 'diag-neg');
      }
      else {
        diag_neg_vis.classList.remove('diag-neg');
      }
      update_text_on_off(king, king_button);
  }

  function update_text_on_off(value, button) {
    if (value) {
      button.classList.add("toggle-on");
      button.classList.remove("toggle-off");
    }
    else {
      button.classList.remove("toggle-on");
      button.classList.add("toggle-off");
    }
  }

  function init_keyboard() {
    document.addEventListener('keydown', (event) => {
      handle_key_event(event.key);
    });
  }

  function handle_key_event(key) {
    key = parseInt(key) || key;
    var current_kind = app_mode == 'setter' ? 'clue' : 'human';
    if (Number.isInteger(key) && key >= 1 && key <= 9){
      for (let cell_id of selected) {
        if (can_change(cell_id)) {
          set_cell(cell_id, key, current_kind);
        }
      }
      update_solution_count()
    }
    else if (key == "Delete" || key == "Backspace"){
      for (let cell_id of selected) {
        if (can_change(cell_id)) {
          set_cell(cell_id, '', current_kind);
        }
      }
      update_solution_count()
    }
    else {
      console.log("unhandled event", key)
    }
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
    if (app_mode == 'setter') {
      setter_side.classList.remove("hidden");
    }
    else {
      setter_side.classList.add("hidden");
    }
    update_solution_count();
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

  function get_line_with(selector){
    line = ""
    for(i = 0; i < 81; i++){
      var cell = cells[i];
      var content = cells[i].innerHTML;
      if(selector(cell, content)){
        line += cells[i].innerHTML;
      }
      else{
        line += '.';
      }
    }
    return line;
  }

  function get_variant() {
    line = ""
    if (diag_pos) {
      line += ";diag_pos";
    }
    if (diag_neg) {
      line += ";diag_neg";
    }
    if (king) {
      line += ";king";
    }
    return line;
  }

  function get_current_line() {
    return get_line_with((cell, content) => content != '') + get_variant()
  }

  function get_save_data() {
    var clue = "clue" + get_line_with((cell) => cell.classList.contains("clue"));
    var human = ";human" + get_line_with((cell) => cell.classList.contains("human"));

    return clue + human + get_variant()
  }

  function load_data(data) {
    diag_pos = false;
    diag_neg = false;
    king = false;
    data.split(';').forEach((field) => {
      if (field.startsWith('clue')){
        set_line(field.slice(4), "clue");
      }
      else if(field.startsWith('human')){
        set_line(field.slice(5), "human");
      }
      else if(field.startsWith('diag_pos')){
        diag_pos = true;
      }
      else if(field.startsWith('diag_neg')){
        diag_neg = true;
      }
      else if(field.startsWith('king')){
        king = true;
      }
    });
    update_variant_visual();
    update_solution_count();
  }

  function update_solution_count() {
    save_data = get_save_data()
    if (input !== document.activeElement) {
      input.value = save_data;
    }
    update_url();

    if (app_mode != 'setter') {
      return;
    }

    var t0 = performance.now();
    var sc = js.solution_count(get_current_line());
    if (sc == 0){
      solution_count.innerHTML = "No solution";
    }
    else if(sc == 1000) {
      solution_count.innerHTML = "1000 or more solutions";
    }
    else {
      solution_count.innerHTML = sc;
    }
    var t1 = performance.now();
    console.log("solution count timing: ", t1-t0)
  }

  function get_url(){
    full_url = window.location.href;
    return full_url.split('?')[0];
  }

  function update_url(){
    new_url = get_url() + '?save=' + save_data
    window.history.replaceState({}, '', new_url);
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
  var save = new URLSearchParams(window.location.search).get('save');
  if (save != null){
    load_data(save);
  }
});
