'use strict';

import { update_text_on_off } from "./ui.js";

export class LocalStorageSettings {
  constructor(prefix) {
    this.prefix = prefix;
    this.storage = window.localStorage;
    this.boolean_options = new Map();
    this.number_options = new Map();
  }

  get(key, def=null) {
    return this.storage.getItem(key) || def;
  }

  get_bool(key, def=null) {
    var val = this.get(key);
    if (val == null) {
      return def;
    }
    return val == "true";
  }

  get_number(key, def=null) {
    var val = this.get(key);
    if (val == null) {
      return def;
    }
    return parseInt(val);
  }

  set(key, value) {
    this.storage.setItem(key, value);
  }

  set_default(key, value) {
    if (this.storage.getItem(key) == null) {
      this.set(key,value);
    }
  }

  add_boolean_option(key, def, button) {
    this.set_default(key, def);
    var val = this.get_bool(key);
    button.onclick= () => {
      var new_val = !this.get_bool(key);
      this.set(key, new_val);
      update_text_on_off(new_val, button);
    };
    update_text_on_off(val, button);
    this.boolean_options.set(key, button);
  }

  add_number_option(key, def, input) {
    this.set_default(key, def);
    var val = this.get_number(key);
    input.value = val;
    input.onchange = () => {
      var new_val = input.value;
      this.set(key, new_val);
    }
    input.value = val;
    this.number_options.set(key, input);
  }

  update() {
    for (const [key, button] in this.boolean_options) {
      update_text_on_off(this.get_bool(key), button);
    }

    for (const [key, input] in this.number_options) {
      //input.value = this.get_number(key);
    }
  }
}
