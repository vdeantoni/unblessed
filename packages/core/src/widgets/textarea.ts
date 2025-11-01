/**
 * textarea.ts - textarea element for blessed
 */

/**
 * Modules
 */

import { getNextTick } from "../lib/runtime-helpers.js";
import unicode from "../lib/unicode.js";
import type { KeyEvent, MouseEvent, TextareaOptions } from "../types";
import Input from "./input.js";

/**
 * Textarea
 *
 * @fires submit - Value is submitted (enter).
 * @fires cancel - Input is canceled (escape).
 * @fires action - Received when the textarea is submitted or canceled.
 */

class Textarea extends Input {
  override type = "textarea";
  declare options: TextareaOptions; // Type refinement - initialized by parent
  override scrollable: boolean;
  __updateCursor: any;
  __listener: any;
  __done: any;
  _reading: boolean = false;
  _callback: any;
  _done: any;
  _value: any;

  /**
   * The input text value (read-only).
   * Use setValue() to modify the value.
   *
   * @example
   * console.log(textarea.value);
   */
  get value(): any {
    return this._value;
  }

  set value(val: any) {
    this._value = val;
  }

  constructor(options: TextareaOptions = {}) {
    options.scrollable = options.scrollable !== false;

    super(options);

    this.scrollable = options.scrollable;
    this.screen._listenKeys(this);

    // Initialize using Object.defineProperty to create a value property
    // separate from _value, matching original behavior
    Object.defineProperty(this, "value", {
      value: options.value || "",
      writable: true,
      configurable: true,
      enumerable: true,
    });

    this.__updateCursor = this._updateCursor.bind(this);
    this.on("resize", this.__updateCursor);
    this.on("move", this.__updateCursor);

    if (options.inputOnFocus) {
      this.on("focus", this.readInput.bind(this, null));
    }

    if (!options.inputOnFocus && options.keys) {
      this.on("keypress", (_ch: any, key: KeyEvent) => {
        if (this._reading) return;
        if (key.name === "enter" || (options.vi && key.name === "i")) {
          return this.readInput();
        }
        if (key.name === "e") {
          return this.readEditor();
        }
      });
    }

    if (options.mouse) {
      this.on("click", (data: MouseEvent) => {
        if (this._reading) return;
        if (data.button !== "right") return;
        this.readEditor();
      });
    }
  }

  _updateCursor(get?: any) {
    if (this.screen.focused !== this) {
      return;
    }

    const lpos = get ? this.lpos : this._getCoords();
    if (!lpos || !this._clines?.length) return;

    let last = this._clines[this._clines.length - 1];
    const program = this.screen.program;
    let line: number;
    let cx: number;
    let cy: number;

    // Stop a situation where the textarea begins scrolling
    // and the last cline appears to always be empty from the
    // _typeScroll `+ '\n'` thing.
    // Maybe not necessary anymore?
    if (last === "" && this.value[this.value.length - 1] !== "\n") {
      last = this._clines[this._clines.length - 2] || "";
    }

    line = Math.min(
      this._clines.length - 1 - (this.childBase || 0),
      lpos.yl - lpos.yi - this.iheight - 1,
    );

    // When calling clearValue() on a full textarea with a border, the first
    // argument in the above Math.min call ends up being -2. Make sure we stay
    // positive.
    line = Math.max(0, line);

    cy = lpos.yi + this.itop + line;
    cx = lpos.xi + this.ileft + this.strWidth(last);

    // XXX Not sure, but this may still sometimes
    // cause problems when leaving editor.
    if (cy === program.y && cx === program.x) {
      return;
    }

    if (cy === program.y) {
      if (cx > program.x) {
        program.cuf(cx - program.x);
      } else if (cx < program.x) {
        program.cub(program.x - cx);
      }
    } else if (cx === program.x) {
      if (cy > program.y) {
        program.cud(cy - program.y);
      } else if (cy < program.y) {
        program.cuu(program.y - cy);
      }
    } else {
      program.cup(cy, cx);
    }
  }

  /**
   * Grab key events and read text from the textarea.
   * Shows cursor and allows user to type into the textarea.
   * Emits 'submit' on escape, 'cancel' on no value.
   *
   * @param callback - Function called with (err, value) when input completes
   * @example
   * textarea.readInput((err, value) => {
   *   if (err) return console.error(err);
   *   console.log('Input:', value);
   * });
   */
  readInput(callback?: any) {
    const focused = this.screen.focused === this;

    if (this._reading) return;
    this._reading = true;

    this._callback = callback;

    if (!focused) {
      this.screen.saveFocus();
      this.focus();
    }

    this.screen.grabKeys = true;

    this._updateCursor();
    this.screen.program.showCursor();
    //this.screen.program.sgr('normal');

    this._done = (err?: any, value?: any, newFocusedEl?: any) => {
      if (!this._reading) return;

      if ((this._done as any).done) return;
      (this._done as any).done = true;

      this._reading = false;

      delete this._callback;
      delete this._done;

      this.removeListener("keypress", this.__listener);
      delete this.__listener;

      this.removeListener("blur", this.__done);
      delete this.__done;

      this.screen.program.hideCursor();
      this.screen.grabKeys = false;

      if (!focused) {
        this.screen.restoreFocus();
      }

      if (this.options.inputOnFocus) {
        // Only rewind if no new focus target (element hidden/removed)
        if (!newFocusedEl) {
          this.screen.rewindFocus();
        }
      }

      // Ugly
      if (err === "stop") return;

      if (err) {
        this.emit("error", err);
      } else if (value != null) {
        this.emit("submit", value);
      } else {
        this.emit("cancel", value);
      }
      this.emit("action", value);

      if (!callback) return;

      return err ? callback(err) : callback(null, value);
    };

    // Put this in a nextTick so the current
    // key event doesn't trigger any keys input.
    getNextTick()(() => {
      this.__listener = this._listener.bind(this);
      this.on("keypress", this.__listener);
    });

    // Bind blur handler to pass the new focused element as third parameter
    this.__done = (newFocusedEl?: any) => this._done(null, null, newFocusedEl);
    this.on("blur", this.__done);
  }

  /**
   * Alias for readInput. Grab key events and read text.
   *
   * @example
   * textarea.input((err, value) => {
   *   console.log('Input:', value);
   * });
   */
  get input() {
    return this.readInput;
  }

  /**
   * Alias for readInput. Grab key events and read text.
   *
   * @example
   * textarea.setInput((err, value) => {
   *   console.log('Input:', value);
   * });
   */
  get setInput() {
    return this.readInput;
  }

  _listener(ch: any, key: KeyEvent) {
    const done = this._done;
    const value = this.value;

    if (key.name === "return") return;
    if (key.name === "enter") {
      ch = "\n";
    }

    // Ignore tab - handled by global screen navigation
    if (key.name === "tab") {
      return;
    }

    // TODO: Handle directional keys.
    if (
      key.name === "left" ||
      key.name === "right" ||
      key.name === "up" ||
      key.name === "down"
    ) {
    }

    if (this.options.keys && key.ctrl && key.name === "e") {
      return this.readEditor();
    }

    // TODO: Optimize typing by writing directly
    // to the screen and screen buffer here.
    if (key.name === "escape") {
      if (done) done(null, null);
    } else if (key.name === "backspace") {
      if (this.value.length) {
        if (this.screen.fullUnicode) {
          if (unicode.isSurrogate(this.value, this.value.length - 2)) {
            // || unicode.isCombining(this.value, this.value.length - 1)) {
            this.value = this.value.slice(0, -2);
          } else {
            this.value = this.value.slice(0, -1);
          }
        } else {
          this.value = this.value.slice(0, -1);
        }
      }
    } else if (ch) {
      if (!/^[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f]$/.test(ch)) {
        this.value += ch;
      }
    }

    if (this.value !== value) {
      this.screen.render();
    }
  }

  _typeScroll() {
    // XXX Workaround
    const height = this.height - this.iheight;
    if (this._clines.length - (this.childBase || 0) > height) {
      this.scroll?.(this._clines.length);
    }
  }

  /**
   * Get the current textarea value.
   * Same as accessing the value property.
   *
   * @returns The current textarea value
   * @example
   * const text = textarea.getValue();
   */
  getValue() {
    return this.value;
  }

  /**
   * Set the textarea value.
   * Updates display and cursor position.
   *
   * @param value - New value to set (defaults to current value if omitted)
   * @example
   * textarea.setValue('New text content');
   */
  setValue(value?: any) {
    if (value == null) {
      value = this.value;
    } else if (this._value === value) {
      return;
    }
    this.value = value;
    this._value = value;
    this.setContent(this.value);
    this._typeScroll();
    this._updateCursor();
  }

  /**
   * Clear the textarea value (set to empty string).
   *
   * @returns Result of setValue('')
   * @example
   * textarea.clearValue();
   */
  clearValue() {
    return this.setValue("");
  }

  /**
   * Alias for clearValue. Clear the textarea value.
   *
   * @example
   * textarea.clearInput();
   */
  get clearInput() {
    return this.clearValue;
  }

  /**
   * Submit the textarea (emits 'submit' event).
   * Only works if readInput is currently active.
   *
   * @example
   * textarea.submit();
   */
  submit() {
    if (!this.__listener) return;
    return this.__listener("\x1b", { name: "escape" });
  }

  /**
   * Cancel the textarea (emits 'cancel' event).
   * Only works if readInput is currently active.
   *
   * @example
   * textarea.cancel();
   */
  cancel() {
    if (!this.__listener) return;
    return this.__listener("\x1b", { name: "escape" });
  }

  override render() {
    this.setValue();
    return super.render();
  }

  /**
   * Open $EDITOR to edit the textarea value.
   * Saves value to temp file, opens editor, then reads result back.
   * After editor closes, returns to readInput mode.
   *
   * @param callback - Function called with (err, value) when editing completes
   * @example
   * textarea.readEditor((err, value) => {
   *   if (err) return console.error(err);
   *   console.log('Edited value:', value);
   * });
   */
  readEditor(callback?: any) {
    if (this._reading) {
      const _cb = this._callback;
      const cb = callback;

      this._done("stop");

      callback = (err: any, value: any) => {
        if (_cb) _cb(err, value);
        if (cb) cb(err, value);
      };
    }

    if (!callback) {
      callback = () => {};
    }

    return this.screen.readEditor(
      { value: this.value },
      (err: any, value: any) => {
        if (err) {
          if (err.message === "Unsuccessful.") {
            this.screen.render();
            return this.readInput(callback);
          }
          this.screen.render();
          this.readInput(callback);
          return callback(err);
        }
        this.setValue(value);
        this.screen.render();
        return this.readInput(callback);
      },
    );
  }

  /**
   * Alias for readEditor. Open $EDITOR to edit the textarea value.
   *
   * @example
   * textarea.editor((err, value) => {
   *   console.log('Edited:', value);
   * });
   */
  get editor() {
    return this.readEditor;
  }

  /**
   * Alias for readEditor. Open $EDITOR to edit the textarea value.
   *
   * @example
   * textarea.setEditor((err, value) => {
   *   console.log('Edited:', value);
   * });
   */
  get setEditor() {
    return this.readEditor;
  }
}

/**
 * Expose
 */

export default Textarea;
export { Textarea };
