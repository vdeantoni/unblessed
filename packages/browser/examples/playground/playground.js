/**
 * Tui Playground
 * Interactive code execution environment for @unblessed/browser
 */

import { FitAddon } from "https://cdn.jsdelivr.net/npm/@xterm/addon-fit@0.10.0/+esm";
import { Terminal } from "https://cdn.jsdelivr.net/npm/xterm@5.3.0/+esm";
import * as tui from "../../dist/index.js";

// Import React and Babel for JSX transformation
import { transform } from "https://esm.sh/@babel/standalone@7.23.5";
import React from "https://esm.sh/react@18.3.1";

// Import React components from @unblessed/react
import * as tuiReact from "../../../react/dist/index.js";

// BrowserRuntime is now exported from the main package
const { BrowserRuntime } = tui;

export class BlessedPlayground {
  constructor(terminalElement, options = {}) {
    this.terminalElement = terminalElement;
    this.terminal = null;
    this.screen = null;
    this.fitAddon = null;
    this.intervals = [];
    this.timeouts = [];
    this.debounceDelay = options.debounceDelay ?? 300;
    this.debounceTimer = null;

    // Initialize BrowserRuntime once for the playground
    this.runtime = new BrowserRuntime();

    // Set the runtime globally so Screen can access it
    const { setRuntime } = tui;
    setRuntime(this.runtime);
  }

  /**
   * Initialize the terminal
   */
  init() {
    // Create xterm terminal
    this.terminal = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: "#1e1e1e",
        foreground: "#d4d4d4",
        cursor: "#ffffff",
        black: "#000000",
        red: "#cd3131",
        green: "#0dbc79",
        yellow: "#e5e510",
        blue: "#2472c8",
        magenta: "#bc3fbc",
        cyan: "#11a8cd",
        white: "#e5e5e5",
        brightBlack: "#666666",
        brightRed: "#f14c4c",
        brightGreen: "#23d18b",
        brightYellow: "#f5f543",
        brightBlue: "#3b8eea",
        brightMagenta: "#d670d6",
        brightCyan: "#29b8db",
        brightWhite: "#ffffff",
      },
    });

    // Add fit addon for responsive sizing
    this.fitAddon = new FitAddon();
    this.terminal.loadAddon(this.fitAddon);

    // Open terminal
    this.terminal.open(this.terminalElement);
    this.fitAddon.fit();

    // Handle window resize
    window.addEventListener("resize", () => {
      if (this.fitAddon) {
        this.fitAddon.fit();
      }
    });

    // Show welcome message
    this.showWelcome();
  }

  /**
   * Show welcome message
   */
  showWelcome() {
    this.terminal.writeln(
      "\x1b[1;36m╔══════════════════════════════════════════╗\x1b[0m",
    );
    this.terminal.writeln(
      "\x1b[1;36m║    unblessed-browser Interactive Playground    ║\x1b[0m",
    );
    this.terminal.writeln(
      "\x1b[1;36m╚══════════════════════════════════════════╝\x1b[0m",
    );
    this.terminal.writeln("");
    this.terminal.writeln("Write blessed code on the left and click Run");
    this.terminal.writeln("");
  }

  /**
   * Clear the terminal and cleanup
   */
  clear() {
    // Clear all timers
    this.intervals.forEach((id) => clearInterval(id));
    this.timeouts.forEach((id) => clearTimeout(id));
    this.intervals = [];
    this.timeouts = [];

    // Destroy screen
    if (this.screen) {
      try {
        this.screen.destroy();
      } catch (e) {
        // Ignore errors during cleanup
      }
      this.screen = null;
    }

    // Dispose terminal
    if (this.terminal) {
      this.terminal.dispose();
      this.terminal = null;
    }

    if (this.fitAddon) {
      this.fitAddon = null;
    }

    // Reinitialize
    this.init();
  }

  /**
   * Run user code with debouncing
   */
  debounceRun(code) {
    // Clear existing debounce timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Set new debounce timer
    this.debounceTimer = setTimeout(() => {
      this.run(code);
      this.debounceTimer = null;
    }, this.debounceDelay);
  }

  /**
   * Check if code contains JSX
   */
  isJSXCode(code) {
    // Simple heuristic: check for JSX-like patterns
    // Look for React component patterns or the render function from tuiReact
    return (
      code.includes("tuiReact") ||
      code.includes("render(<") ||
      /<[A-Z]/.test(code) || // JSX components start with capital letter: <Box>, <Text>
      code.includes("</") // Closing JSX tags
    );
  }

  /**
   * Transform JSX code to regular JavaScript
   */
  transformJSX(code) {
    try {
      const result = transform(code, {
        presets: ["react"],
        filename: "playground.jsx",
      });
      return result.code;
    } catch (error) {
      throw new Error(`JSX transformation failed: ${error.message}`);
    }
  }

  /**
   * Run user code
   */
  async run(code) {
    try {
      // Clear previous execution
      this.intervals.forEach((id) => clearInterval(id));
      this.timeouts.forEach((id) => clearTimeout(id));
      this.intervals = [];
      this.timeouts = [];

      // Destroy previous screen if exists
      if (this.screen) {
        try {
          this.screen.destroy();
        } catch (e) {
          // Ignore
        }
      }

      // Clear terminal
      this.terminal.clear();

      // Check if this is JSX code
      const isJSX = this.isJSXCode(code);

      // Transform JSX if needed
      let transformedCode = code;
      if (isJSX) {
        transformedCode = this.transformJSX(code);
      }

      // Create new screen for the playground
      this.screen = new tui.Screen({
        terminal: this.terminal,
      });

      // Handle quit key
      this.screen.key(["escape", "q", "C-c"], () => {
        this.clear();
      });

      // Create wrapped setInterval/setTimeout that we can track
      const wrappedSetInterval = (fn, delay) => {
        const id = setInterval(fn, delay);
        this.intervals.push(id);
        return id;
      };

      const wrappedSetTimeout = (fn, delay) => {
        const id = setTimeout(fn, delay);
        this.timeouts.push(id);
        return id;
      };

      if (isJSX) {
        // Merge tui with React components for convenience
        const tuiWithReact = {
          ...tui,
          ...tuiReact,
        };

        // Create a function that has access to the screen
        const userFunction = new Function(
          "React",
          "tui",
          "screen",
          "setInterval",
          "setTimeout",
          "clearInterval",
          "clearTimeout",
          transformedCode,
        );

        // Execute with React available, passing the screen
        await userFunction(
          React,
          tuiWithReact,
          this.screen,
          wrappedSetInterval,
          wrappedSetTimeout,
          clearInterval,
          clearTimeout,
        );
      } else {
        // Classic mode
        const userFunction = new Function(
          "tui",
          "screen",
          "setInterval",
          "setTimeout",
          "clearInterval",
          "clearTimeout",
          transformedCode,
        );

        // Execute user code
        await userFunction(
          tui,
          this.screen,
          wrappedSetInterval,
          wrappedSetTimeout,
          clearInterval,
          clearTimeout,
        );
      }
    } catch (error) {
      // Display error
      this.showError(error);
    }
  }

  /**
   * Show error message
   */
  showError(error) {
    this.terminal.clear();
    this.terminal.writeln(
      "\x1b[1;31m╔══════════════════════════════════════════╗\x1b[0m",
    );
    this.terminal.writeln(
      "\x1b[1;31m║              ERROR                       ║\x1b[0m",
    );
    this.terminal.writeln(
      "\x1b[1;31m╚══════════════════════════════════════════╝\x1b[0m",
    );
    this.terminal.writeln("");
    this.terminal.writeln(`\x1b[1;31m${error.message}\x1b[0m`);
    this.terminal.writeln("");

    if (error.stack) {
      this.terminal.writeln("\x1b[90mStack trace:\x1b[0m");
      const stackLines = error.stack.split("\n").slice(1, 6); // First 5 lines
      stackLines.forEach((line) => {
        this.terminal.writeln(`\x1b[90m${line}\x1b[0m`);
      });
    }

    this.terminal.writeln("");
    this.terminal.writeln("\x1b[33mFix the error and click Run again\x1b[0m");
  }

  /**
   * Cleanup resources
   */
  destroy() {
    // Clear debounce timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    this.intervals.forEach((id) => clearInterval(id));
    this.timeouts.forEach((id) => clearTimeout(id));

    if (this.screen) {
      this.screen.destroy();
    }

    if (this.terminal) {
      this.terminal.dispose();
    }
  }
}

export default BlessedPlayground;
