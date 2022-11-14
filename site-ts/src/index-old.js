"use strict";
import { LocalStorageSettings as Settings } from "./settings.js";
import { update_text_on_off } from "./ui.js";
import SudokuSmart from "./sudoku-smart.js?worker";

import("sudoku/sudoku.js").then((sudoku) => {
    var new_sudoku = document.getElementById("new");
    new_sudoku.onclick = generate_new;
    function generate_new() {
        set_line(sudoku.generate(), "clue");
        set_solve_message();
    }
});

var solve_only = false;
var cells = new Array();
var middle_cells = new Array();
var corner_cells = new Array();
var background_cells = new Array();
var solution_count = document.getElementById("count");
/* Clue or solve */
var app_mode = "setter";
var app_mode_text = document.getElementById("app_mode");

/* Cell mouse mode */
var mouse_mode = "selection";
var mouse_add_map = new Map();
var mouse_finish_click_map = new Map();
var mouse_clear_map = new Map();
var mouse_render_map = new Map();
var mouse_mode_leave_map = new Map();

/* Side line mouse mode */
var side_mouse_mode = null;
var side_mouse_click = new Map();
var side_mouse_render = new Map();

/* Solver keyboard_mode */
var keyboard_mode = "normal";
var key_number_button = document.getElementById("key_number");
var key_middle_button = document.getElementById("key_middle");
var key_corner_button = document.getElementById("key_corner");
var key_color_button = document.getElementById("key_color");

var key_number = document.getElementById("number");
var key_middle = document.getElementById("middle-number");
var key_corner = document.getElementById("corner-number");
var key_color = document.getElementById("color");

var setter_side = document.getElementById("setter-side");
var selected = new Set();
var input = document.getElementById("save");
var diag_pos = false;
var diag_pos_vis = document.getElementById("diag_pos_vis");
var diag_neg = false;
var diag_neg_vis = document.getElementById("diag_neg_vis");
var king = false;

var diag_pos_button = document.getElementById("diag_pos_button");
var diag_neg_button = document.getElementById("diag_neg_button");
var king_button = document.getElementById("king_button");

var solving_a = document.getElementById("solving_url");
var setting_a = document.getElementById("setting_url");
var sudokuwiki = document.getElementById("sudokuwiki");

// Settings
var setter_settings = new Settings();
setter_settings.add_boolean_option(
    "hide_setter",
    false,
    document.getElementById("hide_setter")
);
setter_settings.add_boolean_option(
    "count_after_solve",
    false,
    document.getElementById("count_after_solve")
);
setter_settings.add_number_option(
    "solution_count_limit",
    10000,
    document.getElementById("solution_count_limit")
);
setter_settings.add_number_option(
    "solve_limit",
    1000,
    document.getElementById("solve_limit")
);
setter_settings.add_number_option(
    "solve_max_middle_number",
    4,
    document.getElementById("solve_max_middle_number")
);

// Puzzle information
var puzzle_name = document.getElementById("puzzle_name");
var puzzle_name_edit = document.getElementById("puzzle_name_edit");
var puzzle_author = document.getElementById("puzzle_author");
var puzzle_author_edit = document.getElementById("puzzle_author_edit");
var puzzle_message = document.getElementById("puzzle_message");
var puzzle_message_edit = document.getElementById("puzzle_message_edit");
var puzzle_variant_rule = document.getElementById("puzzle_variant_rule");

// Thermo related vars
var thermo_surround_button = document.getElementById("thermo");
var thermo_edit = thermo_surround_button.children[0];
var thermo_delete = thermo_surround_button.children[1];
var thermo_data = new Array();
var thermo_svg = document.getElementById("thermo_svg");

// Difference related vars
var difference_button = document.getElementById("difference");
var difference_data = new Array();
var difference_svg = document.getElementById("difference_svg");

// Solve button
var solve = document.getElementById("solve");
var solve_result_message = document.getElementById("solve_result_message");
var solve_result_message_text = document.getElementById(
    "solve_result_message_text"
);

function render_selected() {
    for (var i = 0; i < cells.length; i++) {
        var full_cell = cells[i].parentElement;
        if (selected.has(i)) {
            full_cell.classList.add("selected");
        } else {
            full_cell.classList.remove("selected");
        }
    }
}

function mouse_clear(index, shift) {
    var f = mouse_clear_map.get(mouse_mode);
    if (f) {
        f(index, shift);
    }
}

function mouse_add(index) {
    var f = mouse_add_map.get(mouse_mode);
    if (f) {
        f(index);
    }
}

function mouse_render(index) {
    var f = mouse_render_map.get(mouse_mode);
    if (f) {
        f(index);
    }
}

function init_cells() {
    var is_mouse_down = false;
    var last_cell_over = null;
    function cell_click(i) {
        return (event) => {
            mouse_clear(i, event.shiftKey);
            mouse_add(i);
            mouse_render(i);
        };
    }
    function cell_over(i) {
        return () => {
            last_cell_over = i;
            setTimeout(() => {
                if (i == last_cell_over && is_mouse_down) {
                    mouse_add(i);
                    mouse_render(i);
                    last_cell_over = null;
                }
            }, 20);
        };
    }

    mouse_add_map.set("selection", (i) => selected.add(i));
    mouse_clear_map.set("selection", (index, shift) => {
        if (!shift) {
            selected.clear();
        }
    });
    mouse_render_map.set("selection", () => render_selected());
    mouse_mode_leave_map.set("selection", () => selected.clear());

    mouse_add_map.set("thermo", add_thermo);
    mouse_render_map.set("thermo", render_thermo);
    mouse_clear_map.set("thermo", start_new_thermo);
    mouse_finish_click_map.set("thermo", remove_one_cell_thermo);

    mouse_clear_map.set("thermo_delete", remove_thermo);
    mouse_render_map.set("thermo_delete", render_thermo);

    side_mouse_click.set("difference", difference_click);
    side_mouse_render.set("difference", difference_render);

    var sudoku = document.getElementById("sudoku");
    var sudoku_ul = document.createElement("ul");
    sudoku.appendChild(sudoku_ul);

    var corner_names = [
        "top-left",
        "top-middle",
        "top-right",
        "middle-left",
        "middle-right",
        "bottom-left",
        "bottom-middle-1",
        "bottom-middle-2",
        "bottom-right",
    ];
    for (var i = 0; i < 81; i++) {
        var cell_li = document.createElement("li");
        sudoku_ul.appendChild(cell_li);
        var cell_span = document.createElement("span");
        cell_li.appendChild(cell_span);
        cells.push(cell_span);

        cell_li.addEventListener("mousedown", cell_click(i));
        cell_li.addEventListener("mouseover", cell_over(i));

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
        var side_cell = null;

        // Add the invisible button on the side of the cell
        // On the right
        if (i % 9 != 8) {
            var right_cell = document.createElement("span");
            right_cell.classList.add("line-button", "right-line-button");
            right_cell.addEventListener("mousedown", cell_side_click);
            right_cell.setAttribute("cell1", i);
            right_cell.setAttribute("cell2", i + 1);
            right_cell.setAttribute("right", 1);
            cell_li.appendChild(right_cell);
        }

        // On the left
        if (i % 9 != 0) {
            side_cell = document.createElement("span");
            side_cell.classList.add("line-button", "left-line-button");
            side_cell.addEventListener("mousedown", cell_side_click);
            side_cell.setAttribute("cell1", i - 1);
            side_cell.setAttribute("cell2", i);
            right_cell.setAttribute("right", 1);
            cell_li.appendChild(side_cell);
        }

        // On the bottom
        if (i < 72) {
            var bottom_cell = document.createElement("span");
            bottom_cell.classList.add("line-button", "bottom-line-button");
            bottom_cell.addEventListener("mousedown", cell_side_click);
            bottom_cell.setAttribute("cell1", i);
            bottom_cell.setAttribute("cell2", i + 9);
            right_cell.setAttribute("right", 0);
            cell_li.appendChild(bottom_cell);
        }

        // On the top
        if (i >= 9) {
            side_cell = document.createElement("span");
            side_cell.classList.add("line-button", "top-line-button");
            side_cell.addEventListener("mousedown", cell_side_click);
            side_cell.setAttribute("cell1", i - 9);
            side_cell.setAttribute("cell2", i);
            right_cell.setAttribute("right", 0);
            cell_li.appendChild(side_cell);
        }
    }
    document.addEventListener("mousedown", () => (is_mouse_down = true));
    document.addEventListener("mouseup", () => {
        is_mouse_down = false;
        var f = mouse_finish_click_map.get(mouse_mode);
        if (f) {
            f();
            mouse_render();
        }
    });
}

function cell_side_click(e) {
    console.log(e.target.getAttribute("cell1"), e.target.getAttribute("cell2"));
    var f = side_mouse_click.get(side_mouse_mode);
    if (f) {
        f(e.target);
        f = side_mouse_render.get(side_mouse_mode);
        if (f) {
            f();
        }
    }
}

function toggle_mouse_mode(target, if_already) {
    var f = mouse_mode_leave_map.get(mouse_mode);
    if (f) {
        f();
        mouse_render();
    }
    if (mouse_mode == target) {
        mouse_mode = if_already;
    } else {
        mouse_mode = target;
    }
}

function toggle_side_mouse_mode(target, if_already) {
    /*
  var f = mouse_mode_leave_map.get(mouse_mode);
  if (f) {
    f();
    mouse_render();
  }
  */
    if (side_mouse_mode == target) {
        side_mouse_mode = if_already;
    } else {
        side_mouse_mode = target;
    }
}

function toggle_keyboard_mode(target, if_already) {
    if (keyboard_mode == target) {
        keyboard_mode = if_already;
    } else {
        keyboard_mode = target;
    }
}

function init_ui() {
    init_button();
    init_cells();

    input.addEventListener("input", () => {
        if (input.value != get_current_line()) {
            load_data(input.value);
        }
        update_url();
    });

    puzzle_name_edit.addEventListener("input", update_variant_visual);
    puzzle_author_edit.addEventListener("input", update_variant_visual);
    puzzle_message_edit.addEventListener("input", update_variant_visual);
}

function init_button() {
    solve.onclick = solve_current;
    var cc_button = document.getElementById("clear_computer");
    cc_button.onclick = clear_computer;
    var clear_button = document.getElementById("clear");
    clear_button.onclick = clear;
    var reset_button = document.getElementById("reset");
    reset_button.onclick = reset;
    var app_mode_button = document.getElementById("app_mode_button");
    app_mode_button.onclick = () => change_mode();

    diag_pos_button.onclick = () => {
        diag_pos = !diag_pos;
        update_variant_visual();
        update_solution_count();
    };

    diag_neg_button.onclick = () => {
        diag_neg = !diag_neg;
        update_variant_visual();
        update_solution_count();
    };

    king_button.onclick = () => {
        king = !king;
        update_variant_visual();
        update_solution_count();
    };

    thermo_edit.onclick = () => {
        toggle_mouse_mode("thermo", "selection");
        update_variant_visual();
        update_solution_count();
    };

    thermo_delete.onclick = () => {
        toggle_mouse_mode("thermo_delete", "selection");
        update_variant_visual();
        update_solution_count();
    };

    difference_button.onclick = () => {
        toggle_mouse_mode(null, "selection");
        toggle_side_mouse_mode("difference", null);
        toggle_keyboard_mode("difference", "normal");
        update_variant_visual();
    };

    var keyboard_buttons = Array.from(key_number.children).concat(
        Array.from(key_middle.children)
    );
    for (let i = 0; i < keyboard_buttons.length; i++) {
        let button = keyboard_buttons[i];
        button.onclick = () => {
            handle_key_event(button.innerHTML);
        };
    }
    Array.from(key_corner.children).forEach((b) => {
        b.onclick = () => {
            handle_key_event(b.children[0].innerHTML);
        };
    });

    Array.from(key_color.children).forEach((button, index) => {
        button.onclick = () => {
            handle_key_event(index < 9 ? index + 1 : button.innerHTML);
        };
    });

    function set_keyboard_mode(button, mode) {
        button.onclick = () => {
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
        } else if (color_index >= 1 && color_index <= 9) {
            colors.push(color_index);
            colors.sort();
        }
    } else {
        colors = new Array();
    }

    if (colors.length == 1) {
        style = `background-color: var(--solve-color-${colors[0]});`;
    } else if (colors.length > 1) {
        style = "background: conic-gradient(";
        var l = colors.length;
        var step = 360 / l;
        for (var i = 0; i < l; i++) {
            if (i != 0) {
                style += ",";
            }
            style += `var(--solve-color-${colors[i]}) ${i * step}deg ${
                (i + 1) * step
            }deg`;
        }

        style += ");";
    }

    cell.style = style;
    background_cells[cell_id] = colors;
}

function update_variant_visual() {
    // Constraints / Variants
    update_text_on_off(diag_pos, diag_pos_button);
    if (diag_pos) {
        diag_pos_vis.classList.add("diag", "diag-pos");
    } else {
        diag_pos_vis.classList.remove("diag-pos");
    }
    update_text_on_off(diag_neg, diag_neg_button);
    if (diag_neg) {
        diag_neg_vis.classList.add("diag", "diag-neg");
    } else {
        diag_neg_vis.classList.remove("diag-neg");
    }
    update_text_on_off(king, king_button);

    // Complex variants
    var thermo_cl = thermo_edit.classList;
    if (mouse_mode == "thermo") {
        thermo_cl.remove("toggle-on", "toggle-off");
        thermo_cl.add("toggle-edit");
    } else if (thermo_data.length == 0) {
        thermo_cl.remove("toggle-edit", "toggle-on");
        thermo_cl.add("toggle-off");
    } else {
        thermo_cl.remove("toggle-edit", "toggle-off");
        thermo_cl.add("toggle-on");
    }

    thermo_cl = thermo_delete.classList;
    if (mouse_mode == "thermo_delete") {
        thermo_delete.removeAttribute("disabled");
        thermo_cl.remove("toggle-on", "disabled");
        thermo_cl.add("toggle-edit");
    } else if (thermo_data.length == 0) {
        thermo_delete.setAttribute("disabled", null);
        thermo_cl.remove("toggle-edit", "toggle-on");
        //thermo_cl.add("disabled");
    } else {
        thermo_delete.removeAttribute("disabled");
        thermo_cl.remove("toggle-edit", "disabled");
        thermo_cl.add("toggle-on");
    }

    // Difference button
    var difference_cl = difference_button.classList;
    if (side_mouse_mode == "difference") {
        difference_cl.remove("toggle-on", "toggle-off");
        difference_cl.add("toggle-edit");
    } else if (difference_data.length == 0) {
        difference_cl.remove("toggle-edit", "toggle-on");
        difference_cl.add("toggle-off");
    } else {
        difference_cl.remove("toggle-edit", "toggle-off");
        difference_cl.add("toggle-on");
    }

    // Settings
    setter_settings.update();

    // Puzzle informations
    puzzle_name.innerHTML = puzzle_name_edit.value || "Sudoku";
    if (puzzle_author_edit.value != "") {
        puzzle_author.classList.remove("hidden");
        puzzle_author.innerHTML = "by " + puzzle_author_edit.value;
    } else {
        puzzle_author.classList.add("hidden");
    }
    puzzle_message.innerHTML = puzzle_message_edit.value;

    // Variant rules
    var content = "";
    if (diag_neg || diag_pos) {
        content +=
            "Number on a shown diagonal cannot be repeated on that diagonal. ";
    }
    if (king) {
        content +=
            "Two cells cannot contain the same number if a king could move between them in one move. ";
    }
    if (thermo_data.length != 0) {
        content +=
            "The number are growing along a thermometer from the bubble to the tip. ";
    }
    if (difference_data.length != 0) {
        content +=
            "A number in a green circle between two cells is the difference of these two cells. ";
    }
    puzzle_variant_rule.innerHTML = content;

    // Keyboard
    function update_mode(name, button, keyboard, force = false) {
        if (keyboard_mode == name || force) {
            button.classList.add("toggle-on");
            button.classList.remove("toggle-off");
            keyboard.classList.remove("hidden");
            return true;
        } else {
            button.classList.remove("toggle-on");
            button.classList.add("toggle-off");
            keyboard.classList.add("hidden");
            return false;
        }
    }
    var found = update_mode("middle", key_middle_button, key_middle);
    found |= update_mode("corner", key_corner_button, key_corner);
    found |= update_mode("color", key_color_button, key_color);
    update_mode("normal", key_number_button, key_number, !found);
}

function init_keyboard() {
    document.addEventListener("keydown", (event) => {
        handle_key_event(event.key);
    });
}

function handle_key_event(key) {
    if (keyboard_mode == "color") {
        toggle_cells_color(key);
        return;
    }
    key = parseInt(key) || key;
    var current_kind = app_mode == "setter" ? "clue" : "human";
    if (Number.isInteger(key) && key >= 1 && key <= 9) {
        if (keyboard_mode == "difference") {
            if (difference_data.length > 0) {
                difference_data[difference_data.length - 1][3] = key;
                difference_render();
            }
            return;
        }
        for (let cell_id of selected) {
            if (can_change(cell_id)) {
                set_cell(cell_id, key, current_kind, keyboard_mode);
            }
        }
        update_solution_count();
    } else if (key == "Delete" || key == "Backspace") {
        if (keyboard_mode == "difference") {
            if (difference_data.length > 0) {
                difference_render();
                difference_data[difference_data.length - 1][3] = null;
            }
            return;
        }
        for (let cell_id of selected) {
            if (can_change(cell_id)) {
                set_cell(cell_id, "", current_kind);
            }
        }
        update_solution_count();
    } else {
        console.log("unhandled event", key);
    }
}

function can_change(id) {
    if (app_mode == "setter") {
        return true;
    } else if (app_mode == "solver") {
        return !cells[id].classList.contains("clue");
    } else {
        throw "unknown app_mode";
    }
}

function change_mode(force_hide_setter = false) {
    app_mode = app_mode == "setter" ? "solver" : "setter";
    app_mode_text.innerHTML = app_mode;
    var should_hide =
        force_hide_setter || setter_settings.get_bool("hide_setter", false);
    if (!should_hide || app_mode == "setter") {
        setter_side.classList.remove("hidden");
    } else {
        setter_side.classList.add("hidden");
    }
    update_solution_count();
}

function clear_computer() {
    for (var i = 0; i < cells.length; i++) {
        set_cell(i, "", "computer", "normal");
    }
    update_solution_count();
}

function clear() {
    for (var i = 0; i < cells.length; i++) {
        set_cell(i, "", "human");
    }
    update_solution_count();
}

function reset() {
    keyboard_mode = "normal";
    mouse_mode = "selection";
    side_mouse_mode = null;
    for (var i = 0; i < cells.length; i++) {
        set_cell(i, "", "clue");
    }
    king = false;
    diag_pos = false;
    diag_neg = false;
    thermo_data = new Array();
    difference_data = new Array();
    set_solve_message();
    update_solution_count();
    update_variant_visual();
    render_thermo();
    difference_render();
}

function get_line_with(selector) {
    var line = "";
    for (var i = 0; i < 81; i++) {
        var cell = cells[i];
        var content = cells[i].innerHTML;
        if (selector(cell, content)) {
            line += cells[i].innerHTML;
        } else {
            line += ".";
        }
    }
    return line;
}

function get_variant() {
    var line = "";
    if (diag_pos) {
        line += ";diag_pos";
    }
    if (diag_neg) {
        line += ";diag_neg";
    }
    if (king) {
        line += ";king";
    }
    for (var t_id in thermo_data) {
        var thermo = thermo_data[t_id];
        line += ";thermo";
        for (var n_id in thermo) {
            var number = thermo[n_id];
            line += "|" + number;
        }
    }
    for (var id in difference_data) {
        var d = difference_data[id];
        line += `;diff|${d[0]}|${d[1]}|${d[3]}`;
    }
    return line;
}

function get_puzzle_info() {
    var info = "";
    function add(name, edit) {
        if (edit.value) {
            info += "&" + name + "=" + encodeURIComponent(edit.value);
        }
    }
    add("name", puzzle_name_edit);
    add("author", puzzle_author_edit);
    add("message", puzzle_message_edit);
    return info;
}

function get_current_line_only() {
    return get_line_with((cell, content) => content != "");
}

function get_current_line() {
    return get_current_line_only() + get_variant();
}

function get_save_data(include_human = true) {
    var clue = "clue" + get_line_with((cell) => cell.classList.contains("clue"));
    var human = "";
    if (include_human) {
        human =
            ";human" + get_line_with((cell) => cell.classList.contains("human"));
    }
    return clue + human + get_variant() + get_puzzle_info();
}

function load_data(data) {
    diag_pos = false;
    diag_neg = false;
    king = false;
    thermo_data = new Array();
    difference_data = new Array();
    data.split(";").forEach((field) => {
        if (field.startsWith("clue")) {
            set_line(field.slice(4), "clue");
        } else if (field.startsWith("human")) {
            set_line(field.slice(5), "human");
        } else if (field.startsWith("diag_pos")) {
            diag_pos = true;
        } else if (field.startsWith("diag_neg")) {
            diag_neg = true;
        } else if (field.startsWith("king")) {
            king = true;
        } else if (field.startsWith("thermo")) {
            var thermo = new Array();
            field.split("|").forEach((number) => {
                number = parseInt(number);
                if (!isNaN(number)) {
                    thermo.push(number);
                }
            });
            thermo_data.push(thermo);
        } else if (field.startsWith("diff")) {
            var diff = new Array();
            field.split("|").forEach((number) => {
                number = parseInt(number);
                if (!isNaN(number)) {
                    diff.push(number);
                }
            });
            difference_data.push([diff[0], diff[1], null, diff[2]]);
        }
    });
    update_variant_visual();
    update_solution_count();
    render_thermo();
    difference_render();
}

function update_solution_count() {
    var save_data = get_save_data();
    if (input !== document.activeElement) {
        input.value = save_data;
    }
    update_url();

    if (solve_only) {
        return;
    }

    sudoku_worker.postMessage([
        "solve_count",
        get_current_line(),
        setter_settings.get_number("solution_count_limit", 10000),
    ]);
    solution_count.innerHTML = "No result yet";
}

function get_url() {
    var full_url = window.location.href;
    return full_url.split("?")[0];
}

function solve_param(force = null) {
    if (force != null || solve_only) {
        return "&solve";
    } else {
        return "";
    }
}

function update_url() {
    var base = get_url() + "?data=";
    var new_url = base + get_save_data() + solve_param();
    window.history.replaceState({}, "", new_url);

    setting_a.href = base + get_save_data();
    solving_a.href = base + get_save_data(false) + solve_param(true);
    sudokuwiki.href =
        "https://www.sudokuwiki.org/sudoku.htm?bd=" + get_current_line_only();
}

function solve_current() {
    sudoku_worker.postMessage([
        "solve_common",
        get_current_line(),
        setter_settings.get_number("solve_limit", 1000),
    ]);
    set_solve_message("Solving...");
}

function set_solve_message(message) {
    if (message != null) {
        solve_result_message.classList.remove("hidden");
        solve_result_message_text.innerHTML = message;
    } else {
        solve_result_message.classList.add("hidden");
    }
}

function set_line(line, kind = "human") {
    for (var i = 0; i < 81; i++) {
        var value = line[i];
        if (value === undefined || value === ".") {
            value = "";
        }
        set_cell(i, value, kind);
    }
    update_solution_count();
}

function set_cell(id, value = "", kind = "human", mode = null) {
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
        switch (kind) {
        case "clue":
            cl.remove("human", "computer");
            break;
        case "human":
            if (!cl.contains("clue")) {
                cl.remove("computer");
                break;
            } else {
                return;
            }
        case "computer":
            if (!cl.contains("clue") && !cl.contains("human")) {
                break;
            } else {
                return;
            }
        default:
            console.error("UNKNOWN KIND: ", kind);
        }
    }
    var content = null;
    var as_array = null;
    var pos_id = null;
    switch (mode) {
    case "normal":
        cell.innerHTML = value;
        break;
    case "middle":
        if (value == "") {
            cell.innerHTML = "";
            break;
        }
        content = cell.innerHTML;
        if (content.indexOf(value) >= 0) {
            content = content.split(value).join("");
        } else {
            as_array = (content + value).split("");
            as_array.sort();
            content = as_array.join("");
        }
        cell.innerHTML = content;
        break;
    case "corner":
        content = "";
        if (value != "") {
            var found_value = false;
            for (pos_id in corner_cells[id]) {
                var pos_content = corner_cells[id][pos_id].innerHTML;
                if (pos_content == value) {
                    found_value = true;
                } else {
                    content += pos_content;
                }
            }
            if (!found_value) {
                content += value;
            }
        }
        as_array = content.split("");
        as_array.sort();
        content = as_array.join("");
        for (pos_id in corner_cells[id]) {
            corner_cells[id][pos_id].innerHTML = content.charAt(pos_id);
        }
        break;
    }
    if (cl) {
        if (value == "") {
            cl.remove("clue", "human", "computer");
        } else {
            cl.add(kind);
        }
    }
    if (mode == "normal") {
        var del = middle_cells[id];
        del.classList.remove("clue", "human", "computer");
        del.innerHTML = "";
        for (pos_id in corner_cells[id]) {
            corner_cells[id][pos_id].innerHTML = "";
        }
    }
}

function draw_thermo(numbers) {
    var n = numbers[0];
    var [line, col] = svg_pos_from_id(n);
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttributeNS(null, "r", 35);
    circle.setAttributeNS(null, "cx", line);
    circle.setAttributeNS(null, "cy", col);
    circle.setAttributeNS(null, "stroke", "FireBrick");
    circle.setAttributeNS(null, "stroke-width", "4");
    circle.setAttributeNS(null, "fill", "rgb(255,255,255)");

    var d_path = `M ${line},${col} `;
    for (var i = 1; i < numbers.length; i++) {
        n = numbers[i];
        line = (n % 9) * 100 + 50;
        col = Math.floor(n / 9) * 100 + 50;
        d_path += `L ${line}, ${col}`;
    }
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttributeNS(null, "d", d_path);
    path.setAttributeNS(null, "fill", "none");
    path.setAttributeNS(null, "stroke", "FireBrick");
    path.setAttributeNS(null, "stroke-width", "12");
    path.setAttributeNS(null, "stroke-linejoin", "round");
    path.setAttributeNS(null, "stroke-linecap", "round");
    thermo_svg.appendChild(path);
    thermo_svg.appendChild(circle);
}

function start_new_thermo(index) {
    var new_thermo = new Array();
    new_thermo.push(index);
    thermo_data.push(new_thermo);
}

function add_thermo(cell) {
    var current_thermo = thermo_data[thermo_data.length - 1];
    var is_index_in_thermo = current_thermo.indexOf(cell) != -1;
    if (current_thermo.length < 9 && !is_index_in_thermo) {
        var last_cell = current_thermo[current_thermo.length - 1];
        var lc_x = last_cell % 9;
        var lc_y = Math.trunc(last_cell / 9);
        var c_x = cell % 9;
        var c_y = Math.trunc(cell / 9);

        if (Math.abs(c_x - lc_x) <= 1 && Math.abs(c_y - lc_y) <= 1) {
            current_thermo.push(cell);
        }
    }
}

function render_thermo() {
    thermo_svg.innerHTML = "";
    for (const id in thermo_data) {
        draw_thermo(thermo_data[id]);
    }
    if (thermo_data.length == 0) {
        mouse_mode = "selection";
    }
    update_variant_visual();
    update_solution_count();
}

function remove_thermo(index) {
    for (var id = thermo_data.length - 1; id >= 0; id--) {
        var found_index = thermo_data[id].indexOf(index);

        if (found_index >= 0) {
            thermo_data.splice(id, 1);
            break;
        }
    }
}

function remove_one_cell_thermo() {
    for (var i = 0; i < thermo_data.length; i++) {
        if (thermo_data[i].length == 1) {
            thermo_data.splice(i, 1);
            i--;
        }
    }
}

function difference_click(element) {
    var cell1 = element.getAttribute("cell1");
    var cell2 = element.getAttribute("cell2");
    var dir = element.getAttribute("right");

    for (const i in difference_data) {
        if (difference_data[i][0] == cell1 && difference_data[i][1] == cell2) {
            difference_data.splice(i, 1);
            return;
        }
    }
    difference_data.push([cell1, cell2, dir, null]);
    console.log(difference_data);
}

function difference_render() {
    difference_svg.innerHTML = "";
    for (const id in difference_data) {
        draw_difference(difference_data[id]);
    }
    update_variant_visual();
    update_solution_count();
}

function svg_pos_from_id(id) {
    var line = (id % 9) * 100 + 50;
    var col = Math.floor(id / 9) * 100 + 50;
    return [line, col];
}

function draw_difference(difference) {
    var c1 = difference[0];
    var c2 = difference[1];
    var [l1, o1] = svg_pos_from_id(c1);
    var [l2, o2] = svg_pos_from_id(c2);

    var l = (l1 + l2) / 2;
    var o = (o1 + o2) / 2;

    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttributeNS(null, "r", 20);
    circle.setAttributeNS(null, "cx", l);
    circle.setAttributeNS(null, "cy", o);
    circle.setAttributeNS(null, "stroke", "DarkSeaGreen");
    circle.setAttributeNS(null, "stroke-width", "4");
    circle.setAttributeNS(null, "fill", "rgb(255,255,255)");
    difference_svg.appendChild(circle);

    var number = difference[3];
    if (number != null) {
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttributeNS(null, "x", l);
        text.setAttributeNS(null, "y", o);
        text.setAttributeNS(null, "text-anchor", "middle");
        text.setAttributeNS(null, "dominant-baseline", "middle");
        text.setAttributeNS(null, "font-size", "1.8em");
        text.innerHTML = number;
        difference_svg.appendChild(text);
    }
}

function handle_sudoku_message(message) {
    message = message.data;
    if (message[0] == "solve_count") {
        solution_count.innerHTML = message[1];
    } else if (message[0] == "solve_common") {
        console.log(message[1]);
        var cs = message[1].split(";");
        var solve_result = null;
        if (cs.length == 1) {
            solve_result = cs[0];
        } else {
            var max_middle = setter_settings.get_number("solve_max_middle_number", 4);
            var all_cell_too_much_poss = true;
            for (var i = 0; i < 81; i++) {
                var c = cs[i];
                if (c.length == 0) {
                    console.error("Impossible situation on cell: ", i, cs);
                } else if (c.length == 1) {
                    all_cell_too_much_poss = false;
                    set_cell(i, c, "computer", "normal");
                } else if (c.length <= max_middle) {
                    all_cell_too_much_poss = false;
                    set_cell(i, "", "computer", "normal");
                    for (var l = 0; l < c.length; l++) {
                        set_cell(i, c[l], "computer", "middle");
                    }
                }
            }
            if (all_cell_too_much_poss) {
                solve_result = "Too many possibilities on every cell";
            }
        }
        set_solve_message(solve_result);

        if (setter_settings.get_bool("count_after_solve", false)) {
            update_solution_count();
        }
    } else {
        console.error("Message not handled: ", message);
    }
}

var sudoku_worker = new SudokuSmart();
sudoku_worker.onmessage = handle_sudoku_message;

init_ui();
init_keyboard();
var params = new URLSearchParams(window.location.search);

var par_solve_only = params.get("solve");
if (par_solve_only != null) {
    solve_only = true;
    if (app_mode == "setter") {
        change_mode(true);
    }
    document.getElementById("app_mode_button").classList.add("hidden");
}

function set_value_if_param(param, edit) {
    var load = params.get(param);
    if (load) {
        edit.value = load;
    }
}
set_value_if_param("name", puzzle_name_edit);
set_value_if_param("author", puzzle_author_edit);
set_value_if_param("message", puzzle_message_edit);

var save = params.get("data");
if (save != null) {
    load_data(save);
}
update_variant_visual();
update_solution_count();
