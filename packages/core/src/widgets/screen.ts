/**
 * screen.ts - screen node for blessed
 */

/**
 * Modules
 */

import colors from "../lib/colors.js";
import helpers from "../lib/helpers.js";
import Program from "../lib/program.js";
import { getEnvVar, getNextTick } from "../lib/runtime-helpers";
import unicode from "../lib/unicode.js";
import { getRuntime } from "../runtime-context.js";
import type {
  KeyEvent,
  MouseEvent,
  RenderCoords,
  ScreenOptions,
} from "../types";
import Box from "./box.js";
import Element from "./element.js";
import Log from "./log.js";
import Node from "./node.js";

/**
 * Screen - The top-level container and rendering engine for terminal UI applications.
 *
 * @remarks
 * Screen manages the terminal, handles rendering, processes input, and serves as the root
 * container for all widgets. It provides:
 * - **Terminal management**: Alt screen buffer, cursor control, raw mode
 * - **Rendering engine**: Efficient screen updates with smart CSR
 * - **Input handling**: Keyboard and mouse events
 * - **Widget container**: Root of the widget tree
 * - **Focus management**: Tracks and manages widget focus
 *
 * @example Basic setup
 * ```typescript
 * import { Screen, Box } from '@unblessed/node';
 *
 * const screen = new Screen({
 *   smartCSR: true,
 *   title: 'My App'
 * });
 *
 * const box = new Box({
 *   parent: screen,
 *   top: 'center',
 *   left: 'center',
 *   width: '50%',
 *   height: '50%',
 *   content: 'Hello World!',
 *   border: { type: 'line' }
 * });
 *
 * screen.key(['q', 'C-c'], () => {
 *   screen.destroy();
 *   process.exit(0);
 * });
 *
 * screen.render();
 * ```
 *
 * @example With mouse support
 * ```typescript
 * const screen = new Screen({
 *   smartCSR: true,
 *   sendFocus: true
 * });
 *
 * const box = new Box({
 *   parent: screen,
 *   mouse: true,
 *   // ...
 * });
 *
 * box.on('click', () => {
 *   box.setContent('Clicked!');
 *   screen.render();
 * });
 *
 * screen.render();
 * ```
 *
 * @see {@link ScreenOptions} for all available configuration options
 * @see {@link Program} for low-level terminal control
 * @see {@link Runtime} for platform abstraction
 */
class Screen extends Node {
  declare options: ScreenOptions; // Type refinement - initialized by parent
  program: any;
  tput: any;
  autoPadding: boolean;
  tabc: string;
  dockBorders: any;
  ignoreLocked: any[];
  _unicode: boolean;
  fullUnicode: boolean;
  dattr: number;
  renders: number;
  position: any;
  left: number;
  aleft: number;
  rleft: number;
  right: number;
  aright: number;
  rright: number;
  top: number;
  atop: number;
  rtop: number;
  bottom: number;
  abottom: number;
  rbottom: number;
  ileft: number;
  itop: number;
  iright: number;
  ibottom: number;
  iheight: number;
  iwidth: number;
  padding: any;
  hover: any;
  history: any[];
  clickable: any[];
  keyable: any[];
  grabKeys: boolean;
  lockKeys: boolean;
  _buf: string;
  _ci: number;
  cursor: any;
  _listenedMouse?: boolean;
  _listenedKeys?: boolean;
  _needsClickableSort?: boolean;
  mouseDown?: any;
  lines: any[] = []; // Initialize to empty array
  olines: any[] = []; // Initialize to empty array
  _borderStops?: any;
  debugLog?: any;
  _hoverText?: any;
  _savedFocus?: any;
  _cursorBlink?: any;
  override type = "screen";

  // Performance optimization properties
  private _renderThrottle?: ReturnType<typeof setTimeout>;
  private _renderQueued: boolean = false;
  private _maxFPS: number = 60;
  private _batchMode: boolean = false;
  private _batchRenderNeeded: boolean = false;
  private _batchDepth: number = 0;

  constructor(options: ScreenOptions = {}) {
    if (options.rsety && options.listen) {
      options = { program: options };
    }

    const program_instance = options.program;

    if (!program_instance) {
      options.program = new Program({
        input: options.input,
        output: options.output,
        log: options.log,
        debug: options.debug,
        dump: options.dump,
        terminal: options.terminal || options.term,
        resizeTimeout: options.resizeTimeout,
        forceUnicode: options.forceUnicode,
        tput: true,
        buffer: true,
        zero: true,
      });
    } else {
      options.program = program_instance;
      options.program.setupTput();
      options.program.useBuffer = true;
      options.program.zero = true;
      options.program.options.resizeTimeout = options.resizeTimeout;
      if (options.forceUnicode != null) {
        options.program.tput.features.unicode = options.forceUnicode;
        options.program.tput.unicode = options.forceUnicode;
      }
    }

    // Set type before super() so Node constructor can identify this as a screen
    options._isScreen = true;

    super(options);

    Screen.bind(this);

    this.program = options.program;
    this.tput = this.program.tput;

    this.autoPadding = options.autoPadding !== false;
    this.tabc = Array((options.tabSize || 4) + 1).join(" ");
    this.dockBorders = options.dockBorders;

    this.ignoreLocked = options.ignoreLocked || [];

    this._unicode = this.tput.unicode || this.tput.numbers.U8 === 1;
    this.fullUnicode = !!(this.options.fullUnicode && this._unicode);

    this.dattr = (0 << 18) | (0x1ff << 9) | 0x1ff;

    this.renders = 0;

    // Capture screen reference for position getters
    const self = this;
    this.position = {
      left: (this.left = this.aleft = this.rleft = 0),
      right: (this.right = this.aright = this.rright = 0),
      top: (this.top = this.atop = this.rtop = 0),
      bottom: (this.bottom = this.abottom = this.rbottom = 0),
      get height() {
        return self.height;
      },
      get width() {
        return self.width;
      },
    };

    this.ileft = 0;
    this.itop = 0;
    this.iright = 0;
    this.ibottom = 0;
    this.iheight = 0;
    this.iwidth = 0;

    this.padding = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    };

    this.hover = null;
    this.history = [];
    this.clickable = [];
    this.keyable = [];
    this.grabKeys = false;
    this.lockKeys = false;
    this.focused = false;
    this._buf = "";

    this._ci = -1;

    if (options.title) {
      this.title = options.title;
    }

    const cursorConfig = options.cursor || {
      artificial: options.artificialCursor || false,
      shape: options.cursorShape || "block",
      blink: options.cursorBlink || false,
      color: options.cursorColor || null,
    };

    this.cursor = {
      artificial: cursorConfig.artificial || false,
      shape: cursorConfig.shape || "block",
      blink: cursorConfig.blink || false,
      color: cursorConfig.color || null,
      _set: false,
      _state: 1,
      _hidden: true,
    };

    this.program.on("resize", () => {
      this.alloc();
      this.render();
      (function emit(el: any) {
        el.emit("resize");
        el.children.forEach(emit);
      })(this);
    });

    this.program.on("focus", () => {
      this.emit("focus");
    });

    this.program.on("blur", () => {
      this.emit("blur");
    });

    this.program.on("warning", (text: any) => {
      this.emit("warning", text);
    });

    this.on("newListener", (type: any) => {
      if (
        type === "keypress" ||
        type.indexOf("key ") === 0 ||
        type === "mouse"
      ) {
        if (type === "keypress" || type.indexOf("key ") === 0)
          this._listenKeys();
        if (type === "mouse") this._listenMouse();
      }
      if (
        type === "mouse" ||
        type === "click" ||
        type === "mouseover" ||
        type === "mouseout" ||
        type === "mousedown" ||
        type === "mouseup" ||
        type === "mousewheel" ||
        type === "wheeldown" ||
        type === "wheelup" ||
        type === "mousemove"
      ) {
        this._listenMouse();
      }
    });

    this.setMaxListeners(Infinity);

    this.enter();

    this.postEnter();
  }

  /**
   * Set or get window title.
   */
  get title(): string {
    return this.program.title;
  }

  set title(title: string) {
    this.program.title = title;
  }

  /**
   * Set or get terminal name. Set calls screen.setTerminal() internally.
   */
  get terminal(): string {
    return this.program.terminal;
  }

  set terminal(terminal: string) {
    this.setTerminal(terminal);
  }

  /**
   * Same as screen.width.
   */
  get cols(): number {
    return this.program.cols;
  }

  /**
   * Same as screen.height.
   */
  get rows(): number {
    return this.program.rows;
  }

  /**
   * Width of the screen (same as program.cols).
   */
  get width(): number {
    return this.program.cols;
  }

  /**
   * Height of the screen (same as program.rows).
   */
  get height(): number {
    return this.program.rows;
  }

  /**
   * Top of the focus history stack.
   */
  get focused(): any {
    return this.history[this.history.length - 1];
  }

  set focused(el: any) {
    this.focusPush(el);
  }

  /**
   * Reset the terminal to term. Reloads terminfo.
   */
  setTerminal(terminal: string): void {
    const entered = !!this.program.isAlt;
    if (entered) {
      this._buf = "";
      this.program._buf = "";
      this.leave();
    }
    this.program.setTerminal(terminal);
    this.tput = this.program.tput;
    if (entered) {
      this.enter();
    }
  }

  /**
   * Enter the alternate screen buffer and initialize the screen.
   * Automatically called when the screen is created.
   */
  enter(): void {
    if (this.program.isAlt) return;
    if (!this.cursor._set) {
      if (this.options.cursor?.shape) {
        this.cursorShape(this.cursor.shape, this.cursor.blink);
      }
      if (this.options.cursor?.color) {
        this.cursorColor(this.cursor.color);
      }
    }
    if (this.runtime.process.platform === "win32") {
      try {
        this.runtime.processes!.childProcess.execSync("cls", {
          stdio: "ignore",
          timeout: 1000,
        });
      } catch (e) {}
    }
    this.program.alternateBuffer();
    this.program.put.keypad_xmit();
    this.program.csr(0, this.height - 1);
    this.program.hideCursor();
    this.program.cup(0, 0);
    // We need this for tmux now:
    if (this.tput.strings.ena_acs) {
      this.program._write(this.tput.enacs());
    }
    this.alloc();
  }

  /**
   * Leave the alternate screen buffer and restore the terminal to its original state.
   * Automatically called when the screen is destroyed.
   */
  leave(): void {
    if (!this.program || !this.program.isAlt) return;
    this.program.put.keypad_local();
    if (
      this.program.scrollTop !== 0 ||
      this.program.scrollBottom !== this.rows - 1
    ) {
      this.program.csr(0, this.height - 1);
    }
    // XXX For some reason if alloc/clear() is before this
    // line, it doesn't work on linux console.
    this.program.showCursor();
    this.alloc();
    if (this._listenedMouse) {
      this.program.disableMouse();
    }
    this.program.normalBuffer();
    if (this.cursor._set) this.cursorReset();
    this.program.flush();
    if (this.runtime.process.platform === "win32") {
      try {
        this.runtime.processes!.childProcess.execSync("cls", {
          stdio: "ignore",
          timeout: 1000,
        });
      } catch (e) {}
    }
  }

  /**
   * Perform post-enter initialization. Sets up debug log and warnings if enabled.
   * Automatically called after enter().
   */
  postEnter(): void {
    if (this.options.debug) {
      this.debugLog = new Log({
        screen: this,
        parent: this,
        hidden: true,
        draggable: true,
        left: "center",
        top: "center",
        width: "30%",
        height: "30%",
        border: "line",
        label: " {bold}Debug Log{/bold} ",
        tags: true,
        keys: true,
        vi: true,
        mouse: true,
        scrollbar: {
          ch: " ",
          track: {
            bg: "yellow",
          },
          style: {
            inverse: true,
          },
        },
      });

      this.debugLog.toggle = () => {
        if (this.debugLog.hidden) {
          this.saveFocus();
          this.debugLog.show();
          this.debugLog.setFront();
          this.debugLog.focus();
        } else {
          this.debugLog.hide();
          this.restoreFocus();
        }
        this.render();
      };

      this.debugLog.key(["q", "escape"], this.debugLog.toggle);
      this.key("f12", this.debugLog.toggle);
    }

    if (this.options.warnings) {
      this.on("warning", (text: any) => {
        const warning = new Box({
          screen: this,
          parent: this,
          left: "center",
          top: "center",
          width: "shrink",
          padding: 1,
          height: "shrink",
          align: "center",
          valign: "middle",
          border: "line",
          label: " {red-fg}{bold}WARNING{/} ",
          content: "{bold}" + text + "{/bold}",
          tags: true,
        });
        this.render();
        const timeout = setTimeout(() => {
          warning.destroy();
          this.render();
        }, 1500);
        if ((timeout as any).unref) {
          (timeout as any).unref();
        }
      });
    }
  }

  /**
   * Destroy the screen object and remove it from the global list. Also remove all global events relevant
   * to the screen object. If all screen objects are destroyed, the node process is essentially reset
   * to its initial state.
   */
  override destroy(): void {
    this.leave();

    const index = registry.instances.indexOf(this);
    if (~index) {
      registry.instances.splice(index, 1);

      registry.global = registry.instances[0] || null;

      if (registry.total === 0) {
        this.runtime.process.removeListener(
          "uncaughtException",
          Screen._exceptionHandler,
        );
        this.runtime.process.removeListener("SIGTERM", Screen._sigtermHandler);
        this.runtime.process.removeListener("SIGINT", Screen._sigintHandler);
        this.runtime.process.removeListener("SIGQUIT", Screen._sigquitHandler);
        this.runtime.process.removeListener("exit", Screen._exitHandler);
        delete (Screen as any)._exceptionHandler;
        delete (Screen as any)._sigtermHandler;
        delete (Screen as any)._sigintHandler;
        delete (Screen as any)._sigquitHandler;
        delete (Screen as any)._exitHandler;

        delete (Screen as any)._bound;
      }

      this.destroyed = true;
      this.emit("destroy");
      if ((this as any)._destroy) {
        (this as any)._destroy();
      }
    }

    if (this.program) {
      this.program.destroy();
    }
  }

  /**
   * Write string to the log file if one was created.
   */
  log(...args: any[]): any {
    return this.program.log.apply(this.program, args);
  }

  /**
   * Same as the log method, but only gets called if the debug option was set.
   */
  debug(...args: any[]): any {
    if (this.debugLog) {
      this.debugLog.log.apply(this.debugLog, args);
    }
    return this.program.debug.apply(this.program, args);
  }

  /**
   * Internal method to set up mouse event handling for the screen and optionally an element.
   * @param el - Element to register as clickable (optional)
   */
  _listenMouse(el?: any): void {
    if (el && !~this.clickable.indexOf(el)) {
      el.clickable = true;
      this.clickable.push(el);
    }

    if (this._listenedMouse) return;
    this._listenedMouse = true;

    this.program.enableMouse();
    if (this.options.sendFocus) {
      this.program.setMouse({ sendFocus: true }, true);
    }

    this.on("render", () => {
      this._needsClickableSort = true;
    });

    this.program.on("mouse", (data: MouseEvent) => {
      if (this.lockKeys) return;

      if (this._needsClickableSort) {
        this.clickable = helpers.hsort(this.clickable);
        this._needsClickableSort = false;
      }

      let i = 0;
      let el: any;
      let set: any;
      let pos: RenderCoords | undefined;

      for (; i < this.clickable.length; i++) {
        el = this.clickable[i];

        if (el.detached || !el.visible) {
          continue;
        }

        // if (this.grabMouse && this.focused !== el
        //     && !el.hasAncestor(this.focused)) continue;

        pos = el.lpos;
        if (!pos) continue;

        if (
          data.x >= pos.xi &&
          data.x < pos.xl &&
          data.y >= pos.yi &&
          data.y < pos.yl
        ) {
          el.emit("mouse", data);
          if (data.action === "mousedown") {
            this.mouseDown = el;
          } else if (data.action === "mouseup") {
            (this.mouseDown || el).emit("click", data);
            this.mouseDown = null;
          } else if (data.action === "mousemove") {
            if (this.hover && el.index > this.hover.index) {
              set = false;
            }
            if (this.hover !== el && !set) {
              if (this.hover) {
                this.hover.emit("mouseout", data);
              }
              el.emit("mouseover", data);
              this.hover = el;
            }
            set = true;
          }
          el.emit(data.action, data);
          break;
        }
      }

      // Just mouseover?
      if (
        (data.action === "mousemove" ||
          data.action === "mousedown" ||
          data.action === "mouseup") &&
        this.hover &&
        !set
      ) {
        this.hover.emit("mouseout", data);
        this.hover = null;
      }

      this.emit("mouse", data);
      this.emit(data.action, data);
    });

    // Autofocus highest element.
    // this.on('element click', function(el, data) {
    //   var target;
    //   do {
    //     if (el.clickable === true && el.options.autoFocus !== false) {
    //       target = el;
    //     }
    //   } while (el = el.parent);
    //   if (target) target.focus();
    // });

    // Autofocus elements with the appropriate option.
    this.on("element click", (el: any) => {
      if (el.clickable === true && el.options.autoFocus !== false) {
        el.focus();
      }
    });
  }

  /**
   * Enable mouse events for the screen and optionally an element (automatically called when a form of
   * on('mouse') is bound).
   */
  enableMouse(el?: any): void {
    this._listenMouse(el);
  }

  /**
   * Internal method to set up keypress event handling for the screen and optionally an element.
   * @param el - Element to register as keyable (optional)
   */
  _listenKeys(el?: any): void {
    if (el && !~this.keyable.indexOf(el)) {
      el.keyable = true;
      this.keyable.push(el);
    }

    if (this._listenedKeys) return;
    this._listenedKeys = true;

    // NOTE: The event emissions used to be reversed:
    // element + screen
    // They are now:
    // screen + element
    // After the first keypress emitted, the handler
    // checks to make sure grabKeys, lockKeys, and focused
    // weren't changed, and handles those situations appropriately.
    this.program.on("keypress", (ch: any, key: KeyEvent) => {
      if (this.lockKeys && !~this.ignoreLocked.indexOf(key.full)) {
        return;
      }

      // Global Tab navigation
      if (key.name === "tab") {
        if (key.shift) {
          this.focusPrevious();
        } else {
          this.focusNext();
        }
        return;
      }

      const focused = this.focused;
      const grabKeys = this.grabKeys;

      if (!grabKeys || ~this.ignoreLocked.indexOf(key.full)) {
        this.emit("keypress", ch, key);
        this.emit("key " + key.full, ch, key);
      }

      // If something changed from the screen key handler, stop.
      if (this.grabKeys !== grabKeys || this.lockKeys) {
        return;
      }

      if (focused && focused.keyable) {
        focused.emit("keypress", ch, key);
        focused.emit("key " + key.full, ch, key);
      }
    });
  }

  /**
   * Enable keypress events for the screen and optionally an element (automatically called when a form of
   * on('keypress') is bound).
   * @param el - Element to enable keys for (optional)
   */
  enableKeys(el?: any): void {
    this._listenKeys(el);
  }

  /**
   * Enable key and mouse events. Calls both enableMouse() and enableKeys().
   * @param el - Element to enable input for (optional)
   */
  enableInput(el?: any): void {
    this._listenMouse(el);
    this._listenKeys(el);
  }

  /**
   * Internal method to initialize the hover text box used by element.setHover().
   * Creates a floating box that follows the mouse cursor.
   */
  _initHover(): void {
    if (this._hoverText) {
      return;
    }

    this._hoverText = new Box({
      screen: this,
      left: 0,
      top: 0,
      tags: false,
      height: "shrink",
      width: "shrink",
      border: "line",
      style: {
        border: {
          fg: "default",
        },
        bg: "default",
        fg: "default",
      },
    });

    this.on("mousemove", (data: MouseEvent) => {
      if (this._hoverText.detached) return;
      this._hoverText.rleft = data.x + 1;
      this._hoverText.rtop = data.y;
      this.render();
    });

    this.on("element mouseover", (el: any, data: MouseEvent) => {
      if (!el._hoverOptions) return;
      this._hoverText.parseTags = el.parseTags;
      this._hoverText.setContent(el._hoverOptions.text);
      this.append(this._hoverText);
      this._hoverText.rleft = data.x + 1;
      this._hoverText.rtop = data.y;
      this.render();
    });

    this.on("element mouseout", () => {
      if (this._hoverText.detached) return;
      this._hoverText.detach();
      this.render();
    });

    // XXX This can cause problems if the
    // terminal does not support allMotion.
    // Workaround: check to see if content is set.
    this.on("element mouseup", (el: any) => {
      if (!this._hoverText.getContent()) return;
      if (!el._hoverOptions) return;
      this.append(this._hoverText);
      this.render();
    });
  }

  /**
   * Allocate a new pending screen buffer and a new output screen buffer.
   */
  alloc(dirty?: boolean): void {
    let x: number, y: number;

    this.lines = [];
    for (y = 0; y < this.rows; y++) {
      this.lines[y] = [];
      for (x = 0; x < this.cols; x++) {
        this.lines[y][x] = [this.dattr, " "];
      }
      this.lines[y].dirty = !!dirty;
    }

    this.olines = [];
    for (y = 0; y < this.rows; y++) {
      this.olines[y] = [];
      for (x = 0; x < this.cols; x++) {
        this.olines[y][x] = [this.dattr, " "];
      }
    }

    this.program.clear();
  }

  /**
   * Reallocate the screen buffers and clear the screen.
   */
  realloc(): void {
    return this.alloc(true);
  }

  /**
   * Render all child elements, writing all data to the screen buffer and drawing the screen.
   */
  render(): void {
    if (this.destroyed) return;

    // Respect batch mode - queue render instead of executing
    if (this._batchMode) {
      this._batchRenderNeeded = true;
      return;
    }

    this.emit("prerender");

    this._borderStops = {};

    // TODO: Possibly get rid of .dirty altogether.
    // TODO: Could possibly drop .dirty and just clear the `lines` buffer every
    // time before a screen.render. This way clearRegion doesn't have to be
    // called in arbitrary places for the sake of clearing a spot where an
    // element used to be (e.g. when an element moves or is hidden). There could
    // be some overhead though.
    // this.screen.clearRegion(0, this.cols, 0, this.rows);
    this._ci = 0;
    this.children.forEach((el: any) => {
      el.index = this._ci++;
      //el._rendering = true;
      el.render();
      //el._rendering = false;
    });
    this._ci = -1;

    if (this.screen.dockBorders) {
      this._dockBorders();
    }

    this.draw(0, this.lines.length - 1);

    // XXX Workaround to deal with cursor pos before the screen has rendered and
    // lpos is not reliable (stale).
    if (this.focused && this.focused._updateCursor) {
      this.focused._updateCursor(true);
    }

    this.renders++;

    this.emit("render");
  }

  /**
   * Set maximum FPS for throttled rendering.
   * Controls how fast renderThrottled() can trigger renders.
   *
   * @param fps - Maximum frames per second (default: 60)
   *
   * @example
   * ```ts
   * screen.setMaxFPS(30);  // Limit to 30 FPS for smoother animations
   * ```
   */
  setMaxFPS(fps: number): void {
    this._maxFPS = fps;
  }

  /**
   * Throttled render - limits FPS to avoid excessive rendering.
   * Queues a render and executes at most once per frame time.
   * Useful for animations and frequent updates.
   *
   * @example
   * ```ts
   * // In an animation loop
   * setInterval(() => {
   *   box.setContent(`Frame ${frame++}`);
   *   screen.renderThrottled();  // Won't render more than maxFPS times per second
   * }, 16);
   * ```
   */
  renderThrottled(): void {
    if (this._renderQueued) {
      return; // Already have a pending render
    }

    this._renderQueued = true;
    const frameTime = 1000 / this._maxFPS;

    this._renderThrottle = setTimeout(() => {
      this._renderQueued = false;
      this.render();
    }, frameTime);
  }

  /**
   * Cancel any queued throttled renders.
   * Useful for cleanup when stopping animations.
   *
   * @example
   * ```ts
   * // Stop animation and cancel pending renders
   * clearInterval(animationInterval);
   * screen.cancelThrottledRender();
   * ```
   */
  cancelThrottledRender(): void {
    if (this._renderThrottle) {
      clearTimeout(this._renderThrottle);
      this._renderThrottle = undefined;
      this._renderQueued = false;
    }
  }

  /**
   * Begin batch mode - defer rendering until endBatch().
   * Multiple updates will only trigger a single render when batch ends.
   * Supports nested batching - only the outermost endBatch() will render.
   *
   * @example
   * ```ts
   * screen.beginBatch();
   *
   * // Multiple updates - only renders once at end
   * for (let i = 0; i < 100; i++) {
   *   boxes[i].setContent(`Item ${i}`);
   * }
   *
   * screen.endBatch();  // Single render here
   * ```
   */
  beginBatch(): void {
    this._batchDepth++;
    if (this._batchDepth === 1) {
      this._batchMode = true;
      this._batchRenderNeeded = false;
    }
  }

  /**
   * End batch mode - render once if any updates occurred during the batch.
   * If no updates happened, no render is performed.
   * Supports nested batching - only the outermost endBatch() will render.
   *
   * @example
   * ```ts
   * screen.beginBatch();
   * updateManyWidgets();
   * screen.endBatch();  // Renders once with all changes
   * ```
   */
  endBatch(): void {
    if (this._batchDepth > 0) {
      this._batchDepth--;
    }

    // Only exit batch mode and render when we reach depth 0
    if (this._batchDepth === 0) {
      this._batchMode = false;
      if (this._batchRenderNeeded) {
        this.render();
        this._batchRenderNeeded = false;
      }
    }
  }

  /**
   * Create a blank line array for the screen buffer.
   * @param ch - Character to fill the line with (default: space)
   * @param dirty - Whether to mark the line as dirty (requires redraw)
   * @returns Array representing a blank line in the screen buffer
   */
  blankLine(ch?: string, dirty?: boolean): any[] {
    const out: any = [];
    for (let x = 0; x < this.cols; x++) {
      out[x] = [this.dattr, ch || " "];
    }
    out.dirty = dirty;
    return out;
  }

  /**
   * Insert a line into the screen (using CSR: this bypasses the output buffer).
   * Uses change_scroll_region to optimize scrolling for elements with uniform sides.
   * @param n - Number of lines to insert
   * @param y - Y position to insert at
   * @param top - Top of scroll region
   * @param bottom - Bottom of scroll region
   */
  insertLine(n: number, y: number, top: number, bottom: number): void {
    // if (y === top) return this.insertLineNC(n, y, top, bottom);

    if (
      !this.tput.strings.change_scroll_region ||
      !this.tput.strings.delete_line ||
      !this.tput.strings.insert_line
    )
      return;

    this._buf += this.tput.csr(top, bottom);
    this._buf += this.tput.cup(y, 0);
    this._buf += this.tput.il(n);
    this._buf += this.tput.csr(0, this.height - 1);

    const j = bottom + 1;

    while (n--) {
      this.lines.splice(y, 0, this.blankLine());
      this.lines.splice(j, 1);
      this.olines.splice(y, 0, this.blankLine());
      this.olines.splice(j, 1);
    }
  }

  /**
   * Delete a line from the screen (using CSR: this bypasses the output buffer).
   * Uses change_scroll_region to optimize scrolling for elements with uniform sides.
   * @param n - Number of lines to delete
   * @param y - Y position to delete from
   * @param top - Top of scroll region
   * @param bottom - Bottom of scroll region
   */
  deleteLine(n: number, y: number, top: number, bottom: number): void {
    // if (y === top) return this.deleteLineNC(n, y, top, bottom);

    if (
      !this.tput.strings.change_scroll_region ||
      !this.tput.strings.delete_line ||
      !this.tput.strings.insert_line
    )
      return;

    this._buf += this.tput.csr(top, bottom);
    this._buf += this.tput.cup(y, 0);
    this._buf += this.tput.dl(n);
    this._buf += this.tput.csr(0, this.height - 1);

    const j = bottom + 1;

    while (n--) {
      this.lines.splice(j, 0, this.blankLine());
      this.lines.splice(y, 1);
      this.olines.splice(j, 0, this.blankLine());
      this.olines.splice(y, 1);
    }
  }

  /**
   * Insert lines using ncurses method (scroll down, up cursor-wise).
   * This will only work for top line deletion as opposed to arbitrary lines.
   * @param n - Number of lines to insert
   * @param y - Y position to insert at
   * @param top - Top of scroll region
   * @param bottom - Bottom of scroll region
   */
  insertLineNC(n: number, y: number, top: number, bottom: number): void {
    if (
      !this.tput.strings.change_scroll_region ||
      !this.tput.strings.delete_line
    )
      return;

    this._buf += this.tput.csr(top, bottom);
    this._buf += this.tput.cup(top, 0);
    this._buf += this.tput.dl(n);
    this._buf += this.tput.csr(0, this.height - 1);

    const j = bottom + 1;

    while (n--) {
      this.lines.splice(j, 0, this.blankLine());
      this.lines.splice(y, 1);
      this.olines.splice(j, 0, this.blankLine());
      this.olines.splice(y, 1);
    }
  }

  /**
   * Delete lines using ncurses method (scroll up, down cursor-wise).
   * This will only work for bottom line deletion as opposed to arbitrary lines.
   * @param n - Number of lines to delete
   * @param y - Y position to delete from
   * @param top - Top of scroll region
   * @param bottom - Bottom of scroll region
   */
  deleteLineNC(n: number, y: number, top: number, bottom: number): void {
    if (
      !this.tput.strings.change_scroll_region ||
      !this.tput.strings.delete_line
    )
      return;

    this._buf += this.tput.csr(top, bottom);
    this._buf += this.tput.cup(bottom, 0);
    this._buf += Array(n + 1).join("\n");
    this._buf += this.tput.csr(0, this.height - 1);

    const j = bottom + 1;

    while (n--) {
      this.lines.splice(j, 0, this.blankLine());
      this.lines.splice(y, 1);
      this.olines.splice(j, 0, this.blankLine());
      this.olines.splice(y, 1);
    }
  }

  /**
   * Insert a line at the bottom of the screen.
   * @param top - Top of scroll region
   * @param bottom - Bottom of scroll region
   */
  insertBottom(top: number, bottom: number): void {
    return this.deleteLine(1, top, top, bottom);
  }

  /**
   * Insert a line at the top of the screen.
   * @param top - Top of scroll region
   * @param bottom - Bottom of scroll region
   */
  insertTop(top: number, bottom: number): void {
    return this.insertLine(1, top, top, bottom);
  }

  /**
   * Delete a line at the bottom of the screen.
   * @param _top - Top of scroll region (unused)
   * @param bottom - Bottom of scroll region
   */
  deleteBottom(_top: number, bottom: number): void {
    return this.clearRegion(0, this.width, bottom, bottom);
  }

  /**
   * Delete a line at the top of the screen.
   * @param top - Top of scroll region
   * @param bottom - Bottom of scroll region
   */
  deleteTop(top: number, bottom: number): void {
    // Same as: return this.insertBottom(top, bottom);
    return this.deleteLine(1, top, top, bottom);
  }

  /**
   * Parse the sides of an element to determine whether an element has uniform cells on both sides.
   * If it does, we can use CSR to optimize scrolling on a scrollable element.
   * Checks if cells to the left and right of the element are all identical, allowing for
   * optimized scrolling using change_scroll_region (CSR).
   * @param el - Element to check
   * @returns True if the element has clean sides (uniform cells on both sides)
   */
  cleanSides(el: any): boolean {
    const pos = el.lpos;

    if (!pos) {
      return false;
    }

    if (pos._cleanSides != null) {
      return pos._cleanSides;
    }

    if (pos.xi <= 0 && pos.xl >= this.width) {
      return (pos._cleanSides = true);
    }

    if (this.options.fastCSR) {
      // Maybe just do this instead of parsing.
      if (pos.yi < 0) return (pos._cleanSides = false);
      if (pos.yl > this.height) return (pos._cleanSides = false);
      if (this.width - (pos.xl - pos.xi) < 40) {
        return (pos._cleanSides = true);
      }
      return (pos._cleanSides = false);
    }

    if (!this.options.smartCSR) {
      return false;
    }

    // The scrollbar can't update properly, and there's also a
    // chance that the scrollbar may get moved around senselessly.
    // NOTE: In pratice, this doesn't seem to be the case.
    // if (this.scrollbar) {
    //   return pos._cleanSides = false;
    // }

    // Doesn't matter if we're only a height of 1.
    // if ((pos.yl - el.ibottom) - (pos.yi + el.itop) <= 1) {
    //   return pos._cleanSides = false;
    // }

    const yi = pos.yi + el.itop;
    const yl = pos.yl - el.ibottom;
    let first: any;
    let ch: any;
    let x: number;
    let y: number;

    if (pos.yi < 0) return (pos._cleanSides = false);
    if (pos.yl > this.height) return (pos._cleanSides = false);
    if (pos.xi - 1 < 0) return (pos._cleanSides = true);
    if (pos.xl > this.width) return (pos._cleanSides = true);

    for (x = pos.xi - 1; x >= 0; x--) {
      if (!this.olines[yi]) break;
      first = this.olines[yi][x];
      for (y = yi; y < yl; y++) {
        if (!this.olines[y] || !this.olines[y][x]) break;
        ch = this.olines[y][x];
        if (ch[0] !== first[0] || ch[1] !== first[1]) {
          return (pos._cleanSides = false);
        }
      }
    }

    for (x = pos.xl; x < this.width; x++) {
      if (!this.olines[yi]) break;
      first = this.olines[yi][x];
      for (y = yi; y < yl; y++) {
        if (!this.olines[y] || !this.olines[y][x]) break;
        ch = this.olines[y][x];
        if (ch[0] !== first[0] || ch[1] !== first[1]) {
          return (pos._cleanSides = false);
        }
      }
    }

    return (pos._cleanSides = true);
  }

  /**
   * Internal method to dock borders with adjacent elements.
   * Processes border stops to determine which border characters should connect with adjacent borders,
   * replacing corner and T-junction characters as appropriate.
   */
  _dockBorders(): void {
    const lines = this.lines;
    const stops = this._borderStops;
    let i: number;
    let y: number;
    let x: number;
    let ch: any;

    // var keys, stop;
    //
    // keys = Object.keys(this._borderStops)
    //   .map(function(k) { return +k; })
    //   .sort(function(a, b) { return a - b; });
    //
    // for (i = 0; i < keys.length; i++) {
    //   y = keys[i];
    //   if (!lines[y]) continue;
    //   stop = this._borderStops[y];
    //   for (x = stop.xi; x < stop.xl; x++) {

    const stopKeys = Object.keys(stops)
      .map((k) => +k)
      .sort((a, b) => a - b);

    for (i = 0; i < stopKeys.length; i++) {
      y = stopKeys[i];
      if (!lines[y]) continue;
      for (x = 0; x < this.width; x++) {
        ch = lines[y][x][1];
        if (angles[ch]) {
          lines[y][x][1] = this._getAngle(lines, x, y);
          lines[y].dirty = true;
        }
      }
    }
  }

  /**
   * Internal method to determine the correct border angle character for a given position.
   * Examines adjacent cells to determine which directions have borders, then returns
   * the appropriate Unicode box-drawing character.
   * @param lines - Screen buffer lines
   * @param x - X coordinate
   * @param y - Y coordinate
   * @returns Unicode box-drawing character for this position
   */
  _getAngle(lines: any[], x: number, y: number): string {
    let angle = 0;
    const attr = lines[y][x][0];
    const ch = lines[y][x][1];

    if (lines[y][x - 1] && langles[lines[y][x - 1][1]]) {
      if (!this.options.ignoreDockContrast) {
        if (lines[y][x - 1][0] !== attr) return ch;
      }
      angle |= 1 << 3;
    }

    if (lines[y - 1] && uangles[lines[y - 1][x][1]]) {
      if (!this.options.ignoreDockContrast) {
        if (lines[y - 1][x][0] !== attr) return ch;
      }
      angle |= 1 << 2;
    }

    if (lines[y][x + 1] && rangles[lines[y][x + 1][1]]) {
      if (!this.options.ignoreDockContrast) {
        if (lines[y][x + 1][0] !== attr) return ch;
      }
      angle |= 1 << 1;
    }

    if (lines[y + 1] && dangles[lines[y + 1][x][1]]) {
      if (!this.options.ignoreDockContrast) {
        if (lines[y + 1][x][0] !== attr) return ch;
      }
      angle |= 1 << 0;
    }

    // Experimental: fixes this situation:
    // +----------+
    //            | <-- empty space here, should be a T angle
    // +-------+  |
    // |       |  |
    // +-------+  |
    // |          |
    // +----------+
    // if (uangles[lines[y][x][1]]) {
    //   if (lines[y + 1] && cdangles[lines[y + 1][x][1]]) {
    //     if (!this.options.ignoreDockContrast) {
    //       if (lines[y + 1][x][0] !== attr) return ch;
    //     }
    //     angle |= 1 << 0;
    //   }
    // }

    return angleTable[angle] || ch;
  }

  /**
   * Draw the screen based on the contents of the screen buffer.
   * Compares the pending buffer (lines) with the output buffer (olines) and writes only
   * the changes to minimize terminal output. Handles SGR codes, cursor positioning,
   * double-width characters, and terminal-specific optimizations.
   * @param start - Starting line number
   * @param end - Ending line number
   */
  draw(start: number, end: number): void {
    // this.emit('predraw');

    let x: number;
    let y: number;
    let line: any;
    let out: string;
    let ch: string;
    let data: number;
    let attr: number;
    let fg: number;
    let bg: number;
    let flags: number;

    let main = "";
    let pre: string;
    let post: string;

    let clr: boolean;
    let neq: boolean;
    let xx: number;

    let lx = -1;
    let ly = -1;
    let o: any;

    let acs: boolean = false;

    if (this._buf) {
      main += this._buf;
      this._buf = "";
    }

    for (y = start; y <= end; y++) {
      line = this.lines[y];
      o = this.olines[y];

      if (!line.dirty && !(this.cursor.artificial && y === this.program.y)) {
        continue;
      }
      line.dirty = false;

      out = "";
      attr = this.dattr;

      for (x = 0; x < line.length; x++) {
        data = line[x][0];
        ch = line[x][1];

        // Render the artificial cursor.
        if (
          this.cursor.artificial &&
          !this.cursor._hidden &&
          this.cursor._state &&
          x === this.program.x &&
          y === this.program.y
        ) {
          const cattr = this._cursorAttr(this.cursor, data);
          if (cattr.ch) ch = cattr.ch;
          data = cattr.attr;
        }

        // Take advantage of xterm's back_color_erase feature by using a
        // lookahead. Stop spitting out so many damn spaces. NOTE: Is checking
        // the bg for non BCE terminals worth the overhead?
        if (
          this.options.useBCE &&
          ch === " " &&
          (this.tput.bools.back_color_erase ||
            (data & 0x1ff) === (this.dattr & 0x1ff)) &&
          ((data >> 18) & 8) === ((this.dattr >> 18) & 8)
        ) {
          clr = true;
          neq = false;

          for (xx = x; xx < line.length; xx++) {
            if (line[xx][0] !== data || line[xx][1] !== " ") {
              clr = false;
              break;
            }
            if (line[xx][0] !== o[xx][0] || line[xx][1] !== o[xx][1]) {
              neq = true;
            }
          }

          if (clr && neq) {
            lx = -1;
            ly = -1;
            if (data !== attr) {
              out += this.codeAttr(data);
              attr = data;
            }
            out += this.tput.cup(y, x);
            out += this.tput.el();
            for (xx = x; xx < line.length; xx++) {
              o[xx][0] = data;
              o[xx][1] = " ";
            }
            break;
          }

          // If there's more than 10 spaces, use EL regardless
          // and start over drawing the rest of line. Might
          // not be worth it. Try to use ECH if the terminal
          // supports it. Maybe only try to use ECH here.
          // //if (this.tput.strings.erase_chars)
          // if (!clr && neq && (xx - x) > 10) {
          //   lx = -1, ly = -1;
          //   if (data !== attr) {
          //     out += this.codeAttr(data);
          //     attr = data;
          //   }
          //   out += this.tput.cup(y, x);
          //   if (this.tput.strings.erase_chars) {
          //     // Use erase_chars to avoid erasing the whole line.
          //     out += this.tput.ech(xx - x);
          //   } else {
          //     out += this.tput.el();
          //   }
          //   if (this.tput.strings.parm_right_cursor) {
          //     out += this.tput.cuf(xx - x);
          //   } else {
          //     out += this.tput.cup(y, xx);
          //   }
          //   this.fillRegion(data, ' ',
          //     x, this.tput.strings.erase_chars ? xx : line.length,
          //     y, y + 1);
          //   x = xx - 1;
          //   continue;
          // }

          // Skip to the next line if the
          // rest of the line is already drawn.
          // if (!neq) {
          //   for (; xx < line.length; xx++) {
          //     if (line[xx][0] !== o[xx][0] || line[xx][1] !== o[xx][1]) {
          //       neq = true;
          //       break;
          //     }
          //   }
          //   if (!neq) {
          //     attr = data;
          //     break;
          //   }
          // }
        }

        // Optimize by comparing the real output
        // buffer to the pending output buffer.
        if (data === o[x][0] && ch === o[x][1]) {
          if (lx === -1) {
            lx = x;
            ly = y;
          }
          continue;
        } else if (lx !== -1) {
          if (this.tput.strings.parm_right_cursor) {
            out += y === ly ? this.tput.cuf(x - lx) : this.tput.cup(y, x);
          } else {
            out += this.tput.cup(y, x);
          }
          lx = -1;
          ly = -1;
        }
        o[x][0] = data;
        o[x][1] = ch;

        if (data !== attr) {
          if (attr !== this.dattr) {
            out += "\x1b[m";
          }
          if (data !== this.dattr) {
            out += "\x1b[";

            bg = data & 0x1ff;
            fg = (data >> 9) & 0x1ff;
            flags = data >> 18;

            // bold
            if (flags & 1) {
              out += "1;";
            }

            // underline
            if (flags & 2) {
              out += "4;";
            }

            // blink
            if (flags & 4) {
              out += "5;";
            }

            // inverse
            if (flags & 8) {
              out += "7;";
            }

            // invisible
            if (flags & 16) {
              out += "8;";
            }

            // dim
            if (flags & 32) {
              out += "2;";
            }

            if (bg !== 0x1ff) {
              bg = this._reduceColor(bg);
              if (bg < 16) {
                if (bg < 8) {
                  bg += 40;
                } else if (bg < 16) {
                  bg -= 8;
                  bg += 100;
                }
                out += bg + ";";
              } else {
                out += "48;5;" + bg + ";";
              }
            }

            if (fg !== 0x1ff) {
              fg = this._reduceColor(fg);
              if (fg < 16) {
                if (fg < 8) {
                  fg += 30;
                } else if (fg < 16) {
                  fg -= 8;
                  fg += 90;
                }
                out += fg + ";";
              } else {
                out += "38;5;" + fg + ";";
              }
            }

            if (out[out.length - 1] === ";") out = out.slice(0, -1);

            out += "m";
          }
        }

        // If we find a double-width char, eat the next character which should be
        // a space due to parseContent's behavior.
        if (this.fullUnicode) {
          // If this is a surrogate pair double-width char, we can ignore it
          // because parseContent already counted it as length=2.
          if (unicode.charWidth(line[x][1]) === 2) {
            // NOTE: At cols=44, the bug that is avoided
            // by the angles check occurs in widget-unicode:
            // Might also need: `line[x + 1][0] !== line[x][0]`
            // for borderless boxes?
            if (x === line.length - 1 || angles[line[x + 1][1]]) {
              // If we're at the end, we don't have enough space for a
              // double-width. Overwrite it with a space and ignore.
              ch = " ";
              o[x][1] = "\0";
            } else {
              // ALWAYS refresh double-width chars because this special cursor
              // behavior is needed. There may be a more efficient way of doing
              // this. See above.
              o[x][1] = "\0";

              // For XTerm.js in browsers, don't skip the next cell.
              // XTerm automatically advances the cursor by 2 cells when rendering
              // a wide character, so we need to let the next cell render normally.
              // Detect browser XTerm by checking TERM="xterm-256color" AND platform="browser".
              if (getEnvVar("TERM") !== "xterm-256color") {
                // Traditional terminal: eat the next character by moving forward
                // and marking as a space (which it is).
                o[++x][1] = "\0";
              }
            }
          }
        }

        // Attempt to use ACS for supported characters.
        // This is not ideal, but it's how ncurses works.
        // There are a lot of terminals that support ACS
        // *and UTF8, but do not declare U8. So ACS ends
        // up being used (slower than utf8). Terminals
        // that do not support ACS and do not explicitly
        // support UTF8 get their unicode characters
        // replaced with really ugly ascii characters.
        // It is possible there is a terminal out there
        // somewhere that does not support ACS, but
        // supports UTF8, but I imagine it's unlikely.
        // Maybe remove !this.tput.unicode check, however,
        // this seems to be the way ncurses does it.
        if (
          this.tput.strings.enter_alt_charset_mode &&
          !this.tput.brokenACS &&
          (this.tput.acscr[ch] || acs)
        ) {
          // Fun fact: even if this.tput.brokenACS wasn't checked here,
          // the linux console would still work fine because the acs
          // table would fail the check of: this.tput.acscr[ch]
          if (this.tput.acscr[ch]) {
            if (acs) {
              ch = this.tput.acscr[ch];
            } else {
              ch = this.tput.smacs() + this.tput.acscr[ch];
              acs = true;
            }
          } else if (acs) {
            ch = this.tput.rmacs() + ch;
            acs = false;
          }
        } else {
          // U8 is not consistently correct. Some terminfo's
          // terminals that do not declare it may actually
          // support utf8 (e.g. urxvt), but if the terminal
          // does not declare support for ACS (and U8), chances
          // are it does not support UTF8. This is probably
          // the "safest" way to do this. Should fix things
          // like sun-color.
          // NOTE: It could be the case that the $LANG
          // is all that matters in some cases:
          // if (!this.tput.unicode && ch > '~') {
          if (!this.tput.unicode && this.tput.numbers.U8 !== 1 && ch > "~") {
            ch = this.tput.utoa[ch] || "?";
          }
        }

        out += ch;
        attr = data;
      }

      if (attr !== this.dattr) {
        out += "\x1b[m";
      }

      if (out) {
        main += this.tput.cup(y, 0) + out;
      }
    }

    if (acs) {
      main += this.tput.rmacs();
      acs = false;
    }

    if (main) {
      pre = "";
      post = "";

      pre += this.tput.sc();
      post += this.tput.rc();

      if (!this.program.cursorHidden) {
        pre += this.tput.civis();
        post += this.tput.cnorm();
      }

      // this.program.flush();
      // this.program._owrite(pre + main + post);
      this.program._write(pre + main + post);
    }

    // this.emit('draw');
  }

  /**
   * Internal method to reduce color values to the number of colors supported by the terminal.
   * @param color - Color value to reduce
   * @returns Reduced color value
   */
  _reduceColor(color: number): number {
    return colors.reduce(color, this.tput.colors);
  }

  /**
   * Convert an SGR escape code string to blessed's internal attribute format.
   * Parses SGR sequences like "\x1b[1;31m" and returns a packed integer containing
   * flags (bold, underline, etc.), foreground color, and background color.
   * @param code - SGR escape code string
   * @param cur - Current attribute value
   * @param def - Default attribute value
   * @returns Packed attribute integer
   */
  attrCode(code: string, cur: number, def: number): number {
    let flags = (cur >> 18) & 0x1ff;
    let fg = (cur >> 9) & 0x1ff;
    let bg = cur & 0x1ff;
    let c: number;
    let i: number;

    let codeArray = code.slice(2, -1).split(";");
    if (!codeArray[0]) codeArray[0] = "0";

    for (i = 0; i < codeArray.length; i++) {
      c = +codeArray[i] || 0;
      switch (c) {
        case 0: // normal
          bg = def & 0x1ff;
          fg = (def >> 9) & 0x1ff;
          flags = (def >> 18) & 0x1ff;
          break;
        case 1: // bold
          flags |= 1;
          break;
        case 2: // dim
          flags |= 32;
          break;
        case 21:
          flags &= ~1; // clear bold
          break;
        case 22:
          flags &= ~32; // clear dim
          break;
        case 4: // underline
          flags |= 2;
          break;
        case 24: // not underlined
          flags &= ~2;
          break;
        case 5: // blink
          flags |= 4;
          break;
        case 25: // not blinking
          flags &= ~4;
          break;
        case 7: // inverse
          flags |= 8;
          break;
        case 27: // not inverse
          flags &= ~8;
          break;
        case 8: // invisible
          flags |= 16;
          break;
        case 28: // visible (not invisible)
          flags &= ~16;
          break;
        case 39: // default fg
          fg = (def >> 9) & 0x1ff;
          break;
        case 49: // default bg
          bg = def & 0x1ff;
          break;
        case 100: // default fg/bg
          fg = (def >> 9) & 0x1ff;
          bg = def & 0x1ff;
          break;
        default: // color
          if (c === 48 && +codeArray[i + 1] === 5) {
            i += 2;
            bg = +codeArray[i];
            break;
          } else if (c === 48 && +codeArray[i + 1] === 2) {
            i += 2;
            bg = colors.match(
              +codeArray[i],
              +codeArray[i + 1],
              +codeArray[i + 2],
            );
            if (bg === -1) bg = def & 0x1ff;
            i += 2;
            break;
          } else if (c === 38 && +codeArray[i + 1] === 5) {
            i += 2;
            fg = +codeArray[i];
            break;
          } else if (c === 38 && +codeArray[i + 1] === 2) {
            i += 2;
            fg = colors.match(
              +codeArray[i],
              +codeArray[i + 1],
              +codeArray[i + 2],
            );
            if (fg === -1) fg = (def >> 9) & 0x1ff;
            i += 2;
            break;
          }
          if (c >= 40 && c <= 47) {
            bg = c - 40;
          } else if (c >= 100 && c <= 107) {
            bg = c - 100;
            bg += 8;
          } else if (c === 49) {
            bg = def & 0x1ff;
          } else if (c >= 30 && c <= 37) {
            fg = c - 30;
          } else if (c >= 90 && c <= 97) {
            fg = c - 90;
            fg += 8;
          } else if (c === 39) {
            fg = (def >> 9) & 0x1ff;
          } else if (c === 100) {
            fg = (def >> 9) & 0x1ff;
            bg = def & 0x1ff;
          }
          break;
      }
    }

    return (flags << 18) | (fg << 9) | bg;
  }

  /**
   * Convert blessed's internal attribute format to an SGR escape code string.
   * Unpacks the attribute integer and generates the appropriate SGR sequence
   * for terminal output.
   * @param code - Packed attribute integer
   * @returns SGR escape code string
   */
  codeAttr(code: number): string {
    let flags = (code >> 18) & 0x1ff;
    let fg = (code >> 9) & 0x1ff;
    let bg = code & 0x1ff;
    let out = "";

    // bold
    if (flags & 1) {
      out += "1;";
    }

    // dim
    if (flags & 32) {
      out += "2;";
    }

    // underline
    if (flags & 2) {
      out += "4;";
    }

    // blink
    if (flags & 4) {
      out += "5;";
    }

    // inverse
    if (flags & 8) {
      out += "7;";
    }

    // invisible
    if (flags & 16) {
      out += "8;";
    }

    if (bg !== 0x1ff) {
      bg = this._reduceColor(bg);
      if (bg < 16) {
        if (bg < 8) {
          bg += 40;
        } else if (bg < 16) {
          bg -= 8;
          bg += 100;
        }
        out += bg + ";";
      } else {
        out += "48;5;" + bg + ";";
      }
    }

    if (fg !== 0x1ff) {
      fg = this._reduceColor(fg);
      if (fg < 16) {
        if (fg < 8) {
          fg += 30;
        } else if (fg < 16) {
          fg -= 8;
          fg += 90;
        }
        out += fg + ";";
      } else {
        out += "38;5;" + fg + ";";
      }
    }

    if (out[out.length - 1] === ";") out = out.slice(0, -1);

    return "\x1b[" + out + "m";
  }

  /**
   * Collect and sort all focusable elements in tab order.
   * @private
   */
  _getFocusableElements(): any[] {
    const focusable: any[] = [];

    const collect = (node: any) => {
      if (node.isInTabOrder && node.isInTabOrder()) {
        focusable.push(node);
      }
      if (node.children) {
        node.children.forEach(collect);
      }
    };

    this.children.forEach(collect);

    focusable.sort((a, b) => {
      const aIndex = a.getTabIndex();
      const bIndex = b.getTabIndex();

      if (aIndex > 0 && bIndex > 0) return aIndex - bIndex;
      if (aIndex > 0) return -1;
      if (bIndex > 0) return 1;

      return 0;
    });

    return focusable;
  }

  /**
   * Focus element by offset of focusable elements.
   * Moves focus forward or backward through the list of focusable elements in tab order,
   * skipping detached or hidden elements.
   * @param offset - Number of elements to move (positive for forward, negative for backward)
   * @returns The newly focused element, or undefined if no element was found
   */
  focusOffset(offset: number): any {
    const focusable = this._getFocusableElements();

    if (!focusable.length || !offset) {
      return;
    }

    let i = focusable.indexOf(this.focused);
    if (!~i) {
      // If nothing focused, start from appropriate end
      if (offset > 0) {
        return focusable[0].focus();
      } else {
        return focusable[focusable.length - 1].focus();
      }
    }

    if (offset > 0) {
      while (offset-- > 0) {
        if (++i > focusable.length - 1) i = 0;
      }
    } else {
      offset = -offset;
      while (offset-- > 0) {
        if (--i < 0) i = focusable.length - 1;
      }
    }

    const target = focusable[i];

    // If we're about to re-focus the same element, enter "rest state" (unfocus) instead
    // This prevents duplicate focus events and provides an escape for single-element cases
    if (target === this.focused) {
      const old = this.history.pop();
      if (old) {
        old.emit("blur");
      }
      return undefined;
    }

    return target.focus();
  }

  /**
   * Focus previous element in the index.
   * Shorthand for focusOffset(-1).
   * @returns The newly focused element
   */
  focusPrev(): any {
    return this.focusOffset(-1);
  }

  /**
   * Focus previous element in the index.
   * Alias for focusPrev().
   * @returns The newly focused element
   */
  focusPrevious(): any {
    return this.focusOffset(-1);
  }

  /**
   * Focus next element in the index.
   * Shorthand for focusOffset(1).
   * @returns The newly focused element
   */
  focusNext(): any {
    return this.focusOffset(1);
  }

  /**
   * Push element on the focus stack (equivalent to screen.focused = el).
   * Maintains a history of up to 10 focused elements for focus management.
   * @param el - Element to focus
   */
  focusPush(el: any): void {
    if (!el) return;
    const old = this.history[this.history.length - 1];
    if (this.history.length === 10) {
      this.history.shift();
    }
    this.history.push(el);
    this._focus(el, old);
  }

  /**
   * Pop element off the focus stack.
   * Removes the current element from focus and returns focus to the previous element.
   * @returns The element that was popped from the focus stack
   */
  focusPop(): any {
    const old = this.history.pop();
    if (this.history.length) {
      this._focus(this.history[this.history.length - 1], old);
    }
    return old;
  }

  /**
   * Save the focused element.
   * Stores the currently focused element for later restoration via restoreFocus().
   * @returns The saved focused element
   */
  saveFocus(): any {
    return (this._savedFocus = this.focused);
  }

  /**
   * Restore the saved focused element.
   * Returns focus to the element saved by saveFocus().
   * @returns The newly focused element
   */
  restoreFocus(): any {
    if (!this._savedFocus) return;
    this._savedFocus.focus();
    delete this._savedFocus;
    return this.focused;
  }

  /**
   * "Rewind" focus to the last visible and attached element.
   * Walks backward through the focus history to find an element that is still
   * visible and attached to the screen.
   * @returns The element that received focus, or undefined if none found
   */
  rewindFocus(): any {
    const old = this.history.pop();
    let el: any;

    while (this.history.length) {
      el = this.history.pop();
      if (!el.detached && el.visible) {
        this.history.push(el);
        this._focus(el, old);
        return el;
      }
    }

    if (old) {
      old.emit("blur");
    }
  }

  /**
   * Internal method to handle focus changes.
   * Automatically scrolls scrollable ancestors to bring the focused element into view,
   * and emits focus/blur events.
   * @param self - Element receiving focus
   * @param old - Element losing focus
   */
  _focus(self: any, old: any): void {
    // Find a scrollable ancestor if we have one.
    let el = self;
    while ((el = el.parent)) {
      if (el.scrollable) break;
    }

    // If we're in a scrollable element,
    // automatically scroll to the focused element.
    // Only attempt auto-scrolling if element has been rendered (has lpos).
    if (el && !el.detached && self.lpos) {
      // NOTE: This is different from the other "visible" values - it needs the
      // visible height of the scrolling element itself, not the element within
      // it.
      const visible =
        self.screen.height - el.atop - el.itop - el.abottom - el.ibottom;
      if (self.rtop < el.childBase) {
        el.scrollTo(self.rtop);
        self.screen.render();
      } else if (
        self.rtop + self.height - self.ibottom >
        el.childBase + visible
      ) {
        // Explanation for el.itop here: takes into account scrollable elements
        // with borders otherwise the element gets covered by the bottom border:
        el.scrollTo(self.rtop - (el.height - self.height) + el.itop, true);
        self.screen.render();
      }
    }

    if (old) {
      old.emit("blur", self);
    }

    self.emit("focus", old);
  }

  /**
   * Clear any region on the screen.
   * Fills the region with spaces using the default attribute.
   * @param xi - Left X coordinate
   * @param xl - Right X coordinate
   * @param yi - Top Y coordinate
   * @param yl - Bottom Y coordinate
   * @param override - If true, always write even if cell hasn't changed
   */
  clearRegion(
    xi: number,
    xl: number,
    yi: number,
    yl: number,
    override?: boolean,
  ): void {
    return this.fillRegion(this.dattr, " ", xi, xl, yi, yl, override);
  }

  /**
   * Fill any region with a character of a certain attribute.
   * Used for clearing regions, drawing backgrounds, etc.
   * @param attr - Attribute to fill with
   * @param ch - Character to fill with
   * @param xi - Left X coordinate
   * @param xl - Right X coordinate
   * @param yi - Top Y coordinate
   * @param yl - Bottom Y coordinate
   * @param override - If true, always write even if cell hasn't changed
   */
  fillRegion(
    attr: number,
    ch: string,
    xi: number,
    xl: number,
    yi: number,
    yl: number,
    override?: boolean,
  ): void {
    const lines = this.lines;
    let cell: any;
    let xx: number;

    if (xi < 0) xi = 0;
    if (yi < 0) yi = 0;

    for (; yi < yl; yi++) {
      if (!lines[yi]) break;
      for (xx = xi; xx < xl; xx++) {
        cell = lines[yi][xx];
        if (!cell) break;
        if (override || attr !== cell[0] || ch !== cell[1]) {
          lines[yi][xx][0] = attr;
          lines[yi][xx][1] = ch;
          lines[yi].dirty = true;
        }
      }
    }
  }

  /**
   * Bind a key event handler.
   * @param args - Arguments to pass to program.key()
   * @returns The bound key handler
   */
  key(...args: any[]): any {
    return this.program.key.apply(this, args);
  }

  /**
   * Bind a key event handler that fires only once.
   * @param args - Arguments to pass to program.onceKey()
   * @returns The bound key handler
   */
  onceKey(...args: any[]): any {
    return this.program.onceKey.apply(this, args);
  }

  /**
   * Unbind a key event handler.
   * @param args - Arguments to pass to program.unkey()
   * @returns Result of unbinding
   */
  unkey(...args: any[]): any {
    return this.program.unkey.apply(this, args);
  }

  /**
   * Remove a key event handler.
   * Alias for unkey().
   * @param args - Arguments to pass to program.removeKey()
   * @returns Result of removing
   */
  removeKey(...args: any[]): any {
    return this.program.removeKey.apply(this, args);
  }

  /**
   * Spawn a process in the foreground, return to blessed app after exit.
   * Temporarily leaves the alternate screen buffer and restores it after the process exits.
   * @param file - Command to execute
   * @param args - Arguments to pass to the command
   * @param options - Options to pass to child_process.spawn
   * @returns ChildProcess instance
   */
  spawn(file: string, args?: any, options?: any): any {
    if (!Array.isArray(args)) {
      options = args;
      args = [];
    }

    const screen = this;
    const program = screen.program;
    const { spawn } = this.runtime.processes!.childProcess;
    const mouse = program.mouseEnabled;
    let ps: any;

    options = options || {};

    options.stdio = options.stdio || "inherit";

    program.lsaveCursor("spawn");
    // program.csr(0, program.rows - 1);
    program.normalBuffer();
    program.showCursor();
    if (mouse) program.disableMouse();

    const write = program.output.write;
    program.output.write = function () {};
    program.input.pause();
    if (program.input.setRawMode) {
      program.input.setRawMode(false);
    }

    const resume = function () {
      if ((resume as any).done) return;
      (resume as any).done = true;

      if (program.input.setRawMode) {
        program.input.setRawMode(true);
      }
      program.input.resume();
      program.output.write = write;

      program.alternateBuffer();
      // program.csr(0, program.rows - 1);
      if (mouse) {
        program.enableMouse();
        if (screen.options.sendFocus) {
          screen.program.setMouse({ sendFocus: true }, true);
        }
      }

      screen.alloc();
      screen.render();

      screen.program.lrestoreCursor("spawn", true);
    };

    ps = spawn(file, args, options);

    ps.on("error", resume);

    ps.on("exit", resume);

    return ps;
  }

  /**
   * Spawn a process in the foreground, return to blessed app after exit. Executes callback on error or exit.
   * @param file - Command to execute
   * @param args - Arguments to pass to the command
   * @param options - Options to pass to child_process.spawn
   * @param callback - Callback function (err, success)
   * @returns ChildProcess instance
   */
  exec(file: string, args?: any, options?: any, callback?: any): any {
    const ps = this.spawn(file, args, options);

    ps.on("error", (err: any) => {
      if (!callback) return;
      return callback(err, false);
    });

    ps.on("exit", (code: any) => {
      if (!callback) return;
      return callback(null, code === 0);
    });

    return ps;
  }

  /**
   * Read data from text editor.
   * Spawns the user's $EDITOR (or vi) to edit a temporary file, then returns the contents.
   * @param options - Options object or callback function
   * @param callback - Callback function (err, data)
   * @returns Result of the editor operation
   */
  readEditor(options: any, callback?: any): any {
    if (typeof options === "string") {
      options = { editor: options };
    }

    if (!callback) {
      callback = options;
      options = null;
    }

    if (!callback) {
      callback = function () {};
    }

    options = options || {};

    const editor = options.editor || getEnvVar("EDITOR") || "vi";
    const name = options.name || this.runtime.process.title || "blessed";
    const rnd = Math.random().toString(36).split(".").pop();
    const file = "/tmp/" + name + "." + rnd;
    const args = [file];
    let opt: any;

    opt = {
      stdio: "inherit",
      env: this.runtime.process.env,
      cwd: getEnvVar("HOME"),
    };

    const writeFile = (callback: any) => {
      if (!options.value) return callback();
      return this.runtime.fs.writeFile(file, options.value, callback);
    };

    return writeFile((err: any) => {
      if (err) return callback(err);
      return this.exec(editor, args, opt, (err: any, success: any) => {
        if (err) return callback(err);
        return this.runtime.fs.readFile(file, "utf8", (err: any, data: any) => {
          return this.runtime.fs.unlink(file, () => {
            if (!success) return callback(new Error("Unsuccessful."));
            if (err) return callback(err);
            return callback(null, data);
          });
        });
      });
    });
  }

  /**
   * Display an image in the terminal using w3m.
   * Experimental feature that spawns w3m to render images.
   * @param file - Path to image file
   * @param callback - Callback function (err, success)
   * @returns Result of the display operation
   */
  displayImage(file: string, callback?: any): any {
    if (!file) {
      if (!callback) return;
      return callback(new Error("No image."));
    }

    file = this.runtime.path.resolve(this.runtime.process.cwd(), file);

    if (!~file.indexOf("://")) {
      file = "file://" + file;
    }

    const args = ["w3m", "-T", "text/html"];

    const input =
      "<title>press q to exit</title>" +
      '<img align="center" src="' +
      file +
      '">';

    const opt = {
      stdio: ["pipe", 1, 2],
      env: this.runtime.process.env,
      cwd: getEnvVar("HOME"),
    };

    const ps = this.spawn(args[0], args.slice(1), opt);

    ps.on("error", (err: any) => {
      if (!callback) return;
      return callback(err);
    });

    ps.on("exit", (code: any) => {
      if (!callback) return;
      if (code !== 0) return callback(new Error("Exit Code: " + code));
      return callback(null, code === 0);
    });

    ps.stdin.write(input + "\n");
    ps.stdin.end();
  }

  /**
   * Set effects based on two events and attributes.
   * Used to apply hover and focus effects to elements. When the 'over' event fires,
   * the effects are applied; when the 'out' event fires, the effects are removed.
   * @param el - Element to apply effects to (or function returning element)
   * @param fel - Element to listen for events on
   * @param over - Event name to trigger effects (e.g., 'mouseover')
   * @param out - Event name to remove effects (e.g., 'mouseout')
   * @param effects - Style object with effects to apply
   * @param temp - Property name to store temporary state in
   */
  setEffects(
    el: any,
    fel: any,
    over: any,
    out: any,
    effects: any,
    temp?: any,
  ): void {
    if (!effects) return;

    const tmp: any = {};
    if (temp) el[temp] = tmp;

    if (typeof el !== "function") {
      const _el = el;
      el = function () {
        return _el;
      };
    }

    fel.on(over, () => {
      const element = el();
      Object.keys(effects).forEach((key: string) => {
        const val = effects[key];
        if (val !== null && typeof val === "object") {
          tmp[key] = tmp[key] || {};
          element.style[key] = element.style[key] || {};
          Object.keys(val).forEach((k: any) => {
            const v = val[k];
            tmp[key][k] = element.style[key][k];
            element.style[key][k] = v;
          });
          return;
        }
        tmp[key] = element.style[key];
        element.style[key] = val;
      });
      element.screen.render();
    });

    fel.on(out, () => {
      const element = el();
      Object.keys(effects).forEach((key: string) => {
        const val = effects[key];
        if (val !== null && typeof val === "object") {
          tmp[key] = tmp[key] || {};
          element.style[key] = element.style[key] || {};
          Object.keys(val).forEach((k: any) => {
            if (tmp[key].hasOwnProperty(k)) {
              element.style[key][k] = tmp[key][k];
            }
          });
          return;
        }
        if (tmp.hasOwnProperty(key)) {
          element.style[key] = tmp[key];
        }
      });
      element.screen.render();
    });
  }

  /**
   * Handle SIGTSTP signal (Ctrl+Z).
   * Sets up a handler to properly restore the screen after the process is resumed.
   * @param callback - Optional callback to execute after resume
   */
  sigtstp(callback?: any): void {
    this.program.sigtstp(() => {
      this.alloc();
      this.render();
      this.program.lrestoreCursor("pause", true);
      if (callback) callback();
    });
  }

  /**
   * Attempt to copy text to clipboard using iTerm2's proprietary sequence. Returns true if successful.
   * Only works in iTerm2 with the proper terminal sequences enabled.
   * @param text - Text to copy to clipboard
   * @returns True if successful
   */
  copyToClipboard(text: string): boolean {
    return this.program.copyToClipboard(text);
  }

  /**
   * Attempt to change cursor shape. Will not work in all terminals (see artificial cursors for a solution
   * to this). Returns true if successful.
   * @param shape - Cursor shape ('block', 'underline', 'line', or style object)
   * @param blink - Whether the cursor should blink
   * @returns True if successful
   */
  cursorShape(shape?: string, blink?: boolean): boolean {
    this.cursor.shape = shape || "block";
    this.cursor.blink = blink || false;
    this.cursor._set = true;

    if (this.cursor.artificial) {
      if (!this.program.hideCursor_old) {
        const hideCursor = this.program.hideCursor;
        this.program.hideCursor_old = this.program.hideCursor;
        this.program.hideCursor = () => {
          hideCursor.call(this.program);
          this.cursor._hidden = true;
          if (this.renders) this.render();
        };
      }
      if (!this.program.showCursor_old) {
        const showCursor = this.program.showCursor;
        this.program.showCursor_old = this.program.showCursor;
        this.program.showCursor = () => {
          this.cursor._hidden = false;
          if (this.program._exiting) showCursor.call(this.program);
          if (this.renders) this.render();
        };
      }
      if (!this._cursorBlink) {
        this._cursorBlink = setInterval(() => {
          if (!this.cursor.blink) return;
          this.cursor._state ^= 1;
          if (this.renders) this.render();
        }, 500);
        if ((this._cursorBlink as any).unref) {
          (this._cursorBlink as any).unref();
        }
      }
      return true;
    }

    return this.program.cursorShape(this.cursor.shape, this.cursor.blink);
  }

  /**
   * Attempt to change cursor color. Returns true if successful.
   * Only works in terminals that support the cursor color escape sequence.
   * @param color - Color name or code
   * @returns True if successful
   */
  cursorColor(color: any): boolean {
    this.cursor.color = color != null ? colors.convert(color) : null;
    this.cursor._set = true;

    if (this.cursor.artificial) {
      return true;
    }

    return this.program.cursorColor(colors.ncolors[this.cursor.color]);
  }

  /**
   * Attempt to reset cursor. Returns true if successful.
   * Restores cursor to default shape, color, and blink state.
   * @returns True if successful
   */
  cursorReset(): boolean {
    this.cursor.shape = "block";
    this.cursor.blink = false;
    this.cursor.color = null;
    this.cursor._set = false;

    if (this.cursor.artificial) {
      this.cursor.artificial = false;
      if (this.program.hideCursor_old) {
        this.program.hideCursor = this.program.hideCursor_old;
        delete this.program.hideCursor_old;
      }
      if (this.program.showCursor_old) {
        this.program.showCursor = this.program.showCursor_old;
        delete this.program.showCursor_old;
      }
      if (this._cursorBlink) {
        clearInterval(this._cursorBlink);
        delete this._cursorBlink;
      }
      return true;
    }

    return this.program.cursorReset();
  }

  /**
   * Reset cursor (alias for cursorReset() for backward compatibility).
   * @returns True if successful
   */
  resetCursor(): boolean {
    return this.cursorReset();
  }

  /**
   * Internal method to calculate cursor attribute for artificial cursor rendering.
   * Determines the correct attribute and character for rendering the cursor at a given position.
   * @param cursor - Cursor configuration object
   * @param dattr - Default attribute (optional)
   * @returns Object with 'ch' (character) and 'attr' (attribute) properties
   */
  _cursorAttr(cursor: any, dattr?: number): any {
    let attr = dattr || this.dattr;
    let cattr: any;
    let ch: string = " ";

    if (cursor.shape === "line") {
      attr &= ~(0x1ff << 9);
      attr |= 7 << 9;
      ch = "\u2502";
    } else if (cursor.shape === "underline") {
      attr &= ~(0x1ff << 9);
      attr |= 7 << 9;
      attr |= 2 << 18;
    } else if (cursor.shape === "block") {
      attr &= ~(0x1ff << 9);
      attr |= 7 << 9;
      attr |= 8 << 18;
    } else if (typeof cursor.shape === "object" && cursor.shape) {
      cattr = Element.prototype.sattr.call(cursor, cursor.shape);

      if (
        cursor.shape.bold ||
        cursor.shape.underline ||
        cursor.shape.blink ||
        cursor.shape.inverse ||
        cursor.shape.invisible
      ) {
        attr &= ~(0x1ff << 18);
        attr |= ((cattr >> 18) & 0x1ff) << 18;
      }

      if (cursor.shape.fg) {
        attr &= ~(0x1ff << 9);
        attr |= ((cattr >> 9) & 0x1ff) << 9;
      }

      if (cursor.shape.bg) {
        attr &= ~(0x1ff << 0);
        attr |= cattr & 0x1ff;
      }

      if (cursor.shape.ch) {
        ch = cursor.shape.ch;
      }
    }

    if (cursor.color != null) {
      attr &= ~(0x1ff << 9);
      attr |= cursor.color << 9;
    }

    return {
      ch: ch,
      attr: attr,
    };
  }

  /**
   * Take an SGR screenshot of the screen within the region. Returns a string containing only
   * characters and SGR codes. Can be displayed by simply echoing it in a terminal.
   * @param xi - Left X coordinate (default: 0)
   * @param xl - Right X coordinate (default: screen width)
   * @param yi - Top Y coordinate (default: 0)
   * @param yl - Bottom Y coordinate (default: screen height)
   * @param term - Terminal object to screenshot from (default: this screen)
   * @returns SGR-encoded screenshot string
   */
  screenshot(
    xi?: number,
    xl?: number,
    yi?: number,
    yl?: number,
    term?: any,
  ): string {
    if (xi == null) xi = 0;
    if (xl == null) xl = this.cols;
    if (yi == null) yi = 0;
    if (yl == null) yl = this.rows;

    if (xi < 0) xi = 0;
    if (yi < 0) yi = 0;

    let x: number;
    let y: number;
    let line: any;
    let out: string;
    let ch: string;
    let data: number;
    let attr: number;

    const sdattr = this.dattr;

    if (term) {
      this.dattr = term.defAttr;
    }

    let main = "";

    for (y = yi; y < yl; y++) {
      line = term ? term.lines[y] : this.lines[y];

      if (!line) break;

      out = "";
      attr = this.dattr;

      for (x = xi; x < xl; x++) {
        if (!line[x]) break;

        data = line[x][0];
        ch = line[x][1];

        if (data !== attr) {
          if (attr !== this.dattr) {
            out += "\x1b[m";
          }
          if (data !== this.dattr) {
            let _data = data;
            if (term) {
              if (((_data >> 9) & 0x1ff) === 257) _data |= 0x1ff << 9;
              if ((_data & 0x1ff) === 256) _data |= 0x1ff;
            }
            out += this.codeAttr(_data);
          }
        }

        if (this.fullUnicode) {
          if (unicode.charWidth(line[x][1]) === 2) {
            if (x === xl - 1) {
              ch = " ";
            } else {
              x++;
            }
          }
        }

        out += ch;
        attr = data;
      }

      if (attr !== this.dattr) {
        out += "\x1b[m";
      }

      if (out) {
        main += (y > 0 ? "\n" : "") + out;
      }
    }

    main = main.replace(/(?:\s*\x1b\[40m\s*\x1b\[m\s*)*$/, "") + "\n";

    if (term) {
      this.dattr = sdattr;
    }

    return main;
  }

  /**
   * Positioning
   */

  /**
   * Internal method to get position coordinates.
   * For Screen, this always returns itself since Screen is the root container.
   * @returns This screen instance
   */
  _getPos(): any {
    return this;
  }

  static resetCursor: any;
  static _exceptionHandler: any;
  static _sigtermHandler: any;
  static _sigintHandler: any;
  static _sigquitHandler: any;
  static _exitHandler: any;
  static _bound: any;
  static override bind: (screen: any) => void;
}

// Use Node.ScreenRegistry to break circular dependency
// Screen imports Node, so we use Node's registry instead of Screen static properties
const registry = (Node as any).ScreenRegistry;

// Maintain backward compatibility with Screen.total, Screen.global, Screen.instances
Object.defineProperty(Screen, "global", {
  get() {
    return registry.global;
  },
  set(value: any) {
    registry.global = value;
  },
});

Object.defineProperty(Screen, "total", {
  get() {
    return registry.total;
  },
});

Object.defineProperty(Screen, "instances", {
  get() {
    return registry.instances;
  },
});

Screen.bind = function (screen: any) {
  if (!registry.global) {
    registry.global = screen;
  }

  if (!~registry.instances.indexOf(screen)) {
    registry.instances.push(screen);
    screen.index = registry.total;
  }

  if (Screen._bound) return;
  Screen._bound = true;

  const runtime = getRuntime();

  runtime.process.on(
    "uncaughtException",
    (Screen._exceptionHandler = function (err: any) {
      if (runtime.process.listeners("uncaughtException").length > 1) {
        return;
      }
      registry.instances.slice().forEach(function (screen: any) {
        screen.destroy();
      });
      err = err || new Error("Uncaught Exception.");
      console.error(err.stack ? err.stack + "" : err + "");
      getNextTick()(function () {
        runtime.process.exit(1);
      });
    }),
  );

  (["SIGTERM", "SIGINT", "SIGQUIT"] as const).forEach(function (signal) {
    const name = "_" + signal.toLowerCase() + "Handler";
    runtime.process.on(
      signal,
      ((Screen as any)[name] = function () {
        if (runtime.process.listeners(signal).length > 1) {
          return;
        }
        getNextTick()(function () {
          runtime.process.exit(0);
        });
      }),
    );
  });

  runtime.process.on(
    "exit",
    (Screen._exitHandler = function () {
      registry.instances.slice().forEach(function (screen: any) {
        screen.destroy();
      });
    }),
  );
};

/**
 * Angle Table
 */

const angles: any = {
  "\u2518": true, // '┘'
  "\u2510": true, // '┐'
  "\u250c": true, // '┌'
  "\u2514": true, // '└'
  "\u253c": true, // '┼'
  "\u251c": true, // '├'
  "\u2524": true, // '┤'
  "\u2534": true, // '┴'
  "\u252c": true, // '┬'
  "\u2502": true, // '│'
  "\u2500": true, // '─'
};

const langles: any = {
  "\u250c": true, // '┌'
  "\u2514": true, // '└'
  "\u253c": true, // '┼'
  "\u251c": true, // '├'
  "\u2534": true, // '┴'
  "\u252c": true, // '┬'
  "\u2500": true, // '─'
};

const uangles: any = {
  "\u2510": true, // '┐'
  "\u250c": true, // '┌'
  "\u253c": true, // '┼'
  "\u251c": true, // '├'
  "\u2524": true, // '┤'
  "\u252c": true, // '┬'
  "\u2502": true, // '│'
};

const rangles: any = {
  "\u2518": true, // '┘'
  "\u2510": true, // '┐'
  "\u253c": true, // '┼'
  "\u2524": true, // '┤'
  "\u2534": true, // '┴'
  "\u252c": true, // '┬'
  "\u2500": true, // '─'
};

const dangles: any = {
  "\u2518": true, // '┘'
  "\u2514": true, // '└'
  "\u253c": true, // '┼'
  "\u251c": true, // '├'
  "\u2524": true, // '┤'
  "\u2534": true, // '┴'
  "\u2502": true, // '│'
};

// var cdangles = {
//   '\u250c': true  // '┌'
// };

// Every ACS angle character can be
// represented by 4 bits ordered like this:
// [langle][uangle][rangle][dangle]
const angleTable: any = {
  "0000": "", // ?
  "0001": "\u2502", // '│' // ?
  "0010": "\u2500", // '─' // ??
  "0011": "\u250c", // '┌'
  "0100": "\u2502", // '│' // ?
  "0101": "\u2502", // '│'
  "0110": "\u2514", // '└'
  "0111": "\u251c", // '├'
  "1000": "\u2500", // '─' // ??
  "1001": "\u2510", // '┐'
  "1010": "\u2500", // '─' // ??
  "1011": "\u252c", // '┬'
  "1100": "\u2518", // '┘'
  "1101": "\u2524", // '┤'
  "1110": "\u2534", // '┴'
  "1111": "\u253c", // '┼'
};

Object.keys(angleTable).forEach(function (key: string) {
  angleTable[parseInt(key, 2)] = angleTable[key];
  delete angleTable[key];
});

/**
 * Expose
 */

export default Screen;
export { Screen };
