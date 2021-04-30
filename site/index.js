'use strict';
import "./index.css"

import("./node_modules/sudoku/sudoku.js").then((js) => {
  var solve_only = false;
  var cells = new Array();
  var middle_cells = new Array();
  var corner_cells = new Array();
  var background_cells = new Array();
  var solution_count = document.getElementById('count');
  var app_mode = 'setter';
  var app_mode_text = document.getElementById('app_mode');

  var keyboard_mode = "normal";
  var key_number_button = document.getElementById("key_number");
  var key_middle_button = document.getElementById("key_middle");
  var key_corner_button = document.getElementById("key_corner");
  var key_color_button = document.getElementById("key_color");

  var key_number = document.getElementById("number");
  var key_middle = document.getElementById("middle-number");
  var key_corner = document.getElementById("corner-number");
  var key_color = document.getElementById("color");

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

  var solving_a = document.getElementById("solving_url");
  var setting_a = document.getElementById("setting_url");
  var sudokuwiki = document.getElementById("sudokuwiki");

  var hide_setter = false;
  var hide_setter_button = document.getElementById("hide_setter");

  var puzzle_name = document.getElementById("puzzle_name");
  var puzzle_name_edit = document.getElementById("puzzle_name_edit");
  var puzzle_author = document.getElementById("puzzle_author");
  var puzzle_author_edit = document.getElementById("puzzle_author_edit");
  var puzzle_message = document.getElementById("puzzle_message");
  var puzzle_message_edit = document.getElementById("puzzle_message_edit");
  var puzzle_variant_rule = document.getElementById("puzzle_variant_rule");

  var svg = document.getElementById("svg");

  function render_selected(){
    for(var i = 0; i < cells.length; i++){
      var full_cell = cells[i].parentElement;
      if (selected.has(i)){
        full_cell.classList.add('selected');
      }
      else {
        full_cell.classList.remove('selected');
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


    var sudoku = document.getElementById("sudoku");
    var sudoku_ul = document.createElement("ul");
    sudoku.appendChild(sudoku_ul);

    var corner_names = ["top-left", "top-middle", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-middle-1", "bottom-middle-2", "bottom-right"];
    for(var i = 0; i < 81; i++){
      var cell_li = document.createElement("li");
      sudoku_ul.appendChild(cell_li);
      var cell_span = document.createElement("span");
      cell_li.appendChild(cell_span);
      cells.push(cell_span);

      cell_li.addEventListener('mousedown', cell_click(i));
      cell_li.addEventListener('mouseover', cell_over(i));

      var middle_cell_span = document.createElement("span");
      cell_li.appendChild(middle_cell_span);
      middle_cells.push(middle_cell_span);
      middle_cell_span.classList.add("middle-cell");

      var corner_in_cell = new Array();
      corner_cells.push(corner_in_cell);
      for (var id in corner_names) {
        var corner_name = corner_names[id];        
        var corner_cell_span = document.createElement("span");
        cell_li.appendChild(corner_cell_span);
        corner_cell_span.classList.add("corner-cell", "human", corner_name);
        corner_in_cell.push(corner_cell_span);
      }

      background_cells.push(new Array());
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

    puzzle_name_edit.addEventListener('input', update_variant_visual);
    puzzle_author_edit.addEventListener('input', update_variant_visual);
    puzzle_message_edit.addEventListener('input', update_variant_visual);
  }

  function init_button() {
    var solve = document.getElementById("solve");
    solve.onclick = solve_current;
    var new_sudoku = document.getElementById("new");
    new_sudoku.onclick = generate_new;
    var cc_button = document.getElementById("clear_computer");
    cc_button.onclick = clear_computer;
    var clear_button = document.getElementById("clear");
    clear_button.onclick = clear;
    var reset_button = document.getElementById("reset");
    reset_button.onclick = reset;
    var app_mode_button = document.getElementById("app_mode_button");
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

    hide_setter_button.onclick = (event) => {
      hide_setter = !hide_setter;
      update_variant_visual();
    };

    var keyboard_buttons = Array.from(key_number.children).concat(
      Array.from(key_middle.children),
    );
    for(let i = 0; i < keyboard_buttons.length; i++) {
      let button = keyboard_buttons[i];
      button.onclick = (event) => {
        handle_key_event(button.innerHTML);
      };
    }
    Array.from(key_corner.children).forEach(b => {
      b.onclick = (event) => {
        handle_key_event(b.children[0].innerHTML);
      }
    })

    Array.from(key_color.children).forEach((button, index) => {
      button.onclick = (event) => {
        handle_key_event( index < 9 ? index+1: button.innerHTML);
      }
    })

    function set_keyboard_mode(button, mode, keyboard) {
      button.onclick = (event) => {
        keyboard_mode = mode;
        update_variant_visual();
      };
    }
    set_keyboard_mode(key_number_button, "normal");
    set_keyboard_mode(key_middle_button, "middle");
    set_keyboard_mode(key_corner_button, "corner");
    set_keyboard_mode(key_color_button, "color");
  }

  function toggle_cells_color(color_index) {
    for (let cell_id of selected) {
      toggle_cell_color(cell_id, color_index);
    }
  }

  function toggle_cell_color(cell_id, color_index) {
    color_index = parseInt(color_index) || color_index;
    var cell = cells[cell_id].parentNode;
    var colors = background_cells[cell_id];
    var style = "";
    if (color_index != "Delete" && color_index != "Backspace") {
      var pos = colors.indexOf(color_index);
      if (pos >= 0) {
        colors.splice(pos, 1);
      }
      else if (color_index >= 1 && color_index <= 9) {
        colors.push(color_index);
        colors.sort();
      }
    }
    else {
      colors = new Array();
    }

    if (colors.length == 1) {
      style = `background-color: var(--solve-color-${colors[0]});`;
    }
    else if (colors.length > 1) {
      style = "background: conic-gradient(";
      var l = colors.length;
      var step = 360 / l;
      for(var i = 0; i < l; i++) {
        if (i != 0) {
          style += ",";
        }
        style += `var(--solve-color-${colors[i]}) ${i * step}deg ${(i+1) *step}deg`
      }

      style += ");";
    }

    cell.style = style;
    background_cells[cell_id] = colors;
  }

  function update_variant_visual(){
      // Constraints / Variants
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


      // Settings
      update_text_on_off(hide_setter, hide_setter_button);

      // Puzzle informations
      puzzle_name.innerHTML = puzzle_name_edit.value || "Sudoku";
      if (puzzle_author_edit.value != "") {
        puzzle_author.classList.remove("hidden");
        puzzle_author.innerHTML = "by " + puzzle_author_edit.value;
      }
      else {
        puzzle_author.classList.add("hidden");
      }
      puzzle_message.innerHTML = puzzle_message_edit.value;

      // Variant rules
      var content = "";
      if (diag_neg || diag_pos) {
        content += "Number on a shown diagonal cannot be repeated on that diagonal. "
      }
      if (king) {
        content += "Two cells cannot contain the same number if a king could move between them in one move. "
      }
      puzzle_variant_rule.innerHTML = content;

      // Keyboard
      function update_mode(name, button, keyboard){
        if (keyboard_mode == name)
        {
          button.classList.add("toggle-on");
          button.classList.remove("toggle-off");
          keyboard.classList.remove("hidden");
        }
        else {
          button.classList.remove("toggle-on");
          button.classList.add("toggle-off");
          keyboard.classList.add("hidden");
        }
      }
      update_mode("normal", key_number_button, key_number);
      update_mode("middle", key_middle_button, key_middle);
      update_mode("corner", key_corner_button, key_corner);
      update_mode("color", key_color_button, key_color);
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
    if (keyboard_mode == "color") {
      toggle_cells_color(key);
      return;
    }
    key = parseInt(key) || key;
    var current_kind = app_mode == 'setter' ? 'clue' : 'human';
    if (Number.isInteger(key) && key >= 1 && key <= 9){
      for (let cell_id of selected) {
        if (can_change(cell_id)) {
          set_cell(cell_id, key, current_kind, keyboard_mode);
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
    if (!hide_setter || app_mode == 'setter') {
      setter_side.classList.remove("hidden");
    }
    else {
      setter_side.classList.add("hidden");
    }
    update_solution_count();
  }

  function clear_computer(){
    for(var i = 0; i < cells.length; i++){
      set_cell(i, '', "computer");
    }
    update_solution_count()
  }

  function clear() {
    for(var i = 0; i < cells.length; i++){
      set_cell(i, '', "human");
    }
    update_solution_count()
  }

  function reset() {
    for(var i = 0; i < cells.length; i++){
      set_cell(i, '', "clue");
    }
    update_solution_count()
  }

  function get_line_with(selector){
    var line = ""
    for(var i = 0; i < 81; i++){
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
    var line = ""
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

  function get_puzzle_info() {
    var info = "";
    function add(name, edit){
      if (edit.value) {
        info += "&" + name + "=" + encodeURIComponent(puzzle_name_edit.value);
      }
    }
    add("name", puzzle_name_edit);
    add("author", puzzle_author_edit);
    add("message", puzzle_message_edit);
    return info;
  }

  function get_current_line_only() {
    return get_line_with((cell, content) => content != '');
  }

  function get_current_line() {
    return get_current_line_only() + get_variant();
  }

  function get_save_data(include_human=true) {
    var clue = "clue" + get_line_with((cell) => cell.classList.contains("clue"));
    var human = "";
    if(include_human) {
      human = ";human" + get_line_with((cell) => cell.classList.contains("human"));
    }
    return clue + human + get_variant() + get_puzzle_info()
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
    var save_data = get_save_data()
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
    var full_url = window.location.href;
    return full_url.split('?')[0];
  }

  function solve_param(force=null) {
    if (force != null || solve_only) {
      return "&solve";
    }
    else {
      return "";
    }
  }

  function update_url(){
    var base = get_url() + '?data=';
    var new_url = base + get_save_data() + solve_param();
    window.history.replaceState({}, '', new_url);

    setting_a.href = base + get_save_data();
    solving_a.href = base + get_save_data(false) + solve_param(true);
    sudokuwiki.href = "https://www.sudokuwiki.org/sudoku.htm?bd=" + get_current_line_only()
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
    for(var i = 0; i < 81; i++){
      var value = line[i];
      if(value === undefined || value === '.') {
        value = '';
      }
      set_cell(i, value, kind);
    }
    update_solution_count()
  }

  function set_cell(id, value = '', kind = "human", mode = null) {
    // kind can be "clue", "human", "computer"
    // mode can be null, "normal", "middle", "corner"
    if (mode == null) {
      mode = keyboard_mode;
    }
    if (mode == "middle" && kind == "clue") {
      kind = "human";
    }
    var array = null;
    switch (mode) {
      case "normal":
        array = cells;
        break;
      case "middle":
        array = middle_cells;
        break;
      case "corner":
        array = corner_cells;
        break;
    }
    var cell = array[id];
    var cl = cell.classList || null;
    if (mode != "normal" && cells[id].innerHTML != "") {
      console.log("already something better in cell");
      return;
    }
    if (cl) {
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
    }
    switch (mode) {
      case "normal":
        cell.innerHTML = value;
        break;
      case "middle":
        if(value == '') {
          cell.innerHTML = '';
          break;
        }
        var content = cell.innerHTML;
        if (content.indexOf(value) >= 0) {
          content = content.split(value).join('');
        }
        else {
          var as_array = (content+value).split('');
          as_array.sort();
          content = as_array.join('');
        }
        cell.innerHTML = content;
        break;
      case "corner":
        var content = "";
        if (value != '') {
          var found_value = false;
          for(var pos_id in corner_cells[id]) {
            var pos_content = corner_cells[id][pos_id].innerHTML;
            if (pos_content == value) {
              found_value = true;
            }
            else {
              content += pos_content;
            }
          }
          if (!found_value) {
            content += value;
          }
        }
        var as_array = content.split('');
        as_array.sort();
        content = as_array.join('');
        for(var pos_id in corner_cells[id]) {
          corner_cells[id][pos_id].innerHTML = content.charAt(pos_id);
        }
        break;
    }
    if (cl){
      if (value == '') {
        cl.remove("clue", "human", "computer");
      }
      else {
        cl.add(kind);
      }
    }
    if (mode == "normal") {
      var del = middle_cells[id];
      del.classList.remove("clue", "human", "computer");
      del.innerHTML = '';
      for(var pos_id in corner_cells[id]) {
        corner_cells[id][pos_id].innerHTML = '';
      }
    }
  }

  js.init()
  init_ui()
  init_keyboard()
  var params = new URLSearchParams(window.location.search);

  var par_solve_only = params.get('solve');
  if (par_solve_only != null){
    solve_only = true;
    if (app_mode == 'setter') {
      hide_setter = true;
      change_mode();
    }
    document.getElementById("app_mode_button").remove();
  }

  function set_value_if_param(param, edit){
    var load = params.get(param);
    if (load) {
      edit.value = load;
    }
  }
  set_value_if_param("name", puzzle_name_edit);
  set_value_if_param("author", puzzle_author_edit);
  set_value_if_param("message", puzzle_message_edit);

  var save = params.get('data');
  if (save != null){
    load_data(save);
  }
  update_variant_visual();

  function draw_thermo(numbers) {
    var n = numbers[0];
    var line= (n % 9) * 100 + 50;
    var col= Math.floor(n / 9) * 100 + 50;
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttributeNS(null, "r", 35);
    circle.setAttributeNS(null, "cx", line);
    circle.setAttributeNS(null, "cy", col);
    circle.setAttributeNS(null, "stroke", "FireBrick");
    circle.setAttributeNS(null, "stroke-width", "4");
    circle.setAttributeNS(null, "fill", "rgb(255,255,255)");

    var d_path = `M ${line},${col} `;
    for(var i = 1; i < numbers.length; i++) {
      var n = numbers[i];
      var line= (n % 9) * 100 + 50;
      var col= Math.floor(n / 9) * 100 + 50;
      d_path += `L ${line}, ${col}`;
    }
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, "d", d_path);
    path.setAttributeNS(null, "fill", "none");
    path.setAttributeNS(null, "stroke", "FireBrick");
    path.setAttributeNS(null, "stroke-width", "12");
    path.setAttributeNS(null, "stroke-linejoin", "round");
    path.setAttributeNS(null, "stroke-linecap", "round");
    svg.appendChild(path);
    svg.appendChild(circle);
  }
  draw_thermo([2,3,4,14,13]);
  draw_thermo([0,10,20,30,40,50,60,70,80]);
  draw_thermo([64,56,48,40,32,24,16]);
});
