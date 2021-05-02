'use strict';

export function update_text_on_off(value, button) {
  if (value) {
    button.classList.add("toggle-on");
    button.classList.remove("toggle-off");
  }
  else {
    button.classList.remove("toggle-on");
    button.classList.add("toggle-off");
  }
}
