/**
 * TerminalManager - Handles terminal initialization, display, and cleanup
 */

import { FitAddon } from "https://cdn.jsdelivr.net/npm/@xterm/addon-fit@0.10.0/+esm";
import { Terminal } from "https://cdn.jsdelivr.net/npm/xterm@5.3.0/+esm";
import type { TerminalConfig } from "./types.js";

/**
 * Default terminal configuration
 */
const DEFAULT_TERMINAL_CONFIG: TerminalConfig = {
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
};

/**
 * Manages xterm.js terminal lifecycle and display
 */
export class TerminalManager {
  private terminal: Terminal | null = null;
  private fitAddon: FitAddon | null = null;
  private terminalElement: HTMLElement;
  private resizeHandler: (() => void) | null = null;

  constructor(terminalElement: HTMLElement) {
    this.terminalElement = terminalElement;
  }

  /**
   * Initialize the terminal
   */
  init(): Terminal {
    // Create xterm terminal
    this.terminal = new Terminal(DEFAULT_TERMINAL_CONFIG);

    // Add fit addon for responsive sizing
    this.fitAddon = new FitAddon();
    this.terminal.loadAddon(this.fitAddon);

    // Open terminal
    this.terminal.open(this.terminalElement);
    this.fitAddon.fit();

    // Handle window resize
    this.resizeHandler = () => {
      if (this.fitAddon) {
        this.fitAddon.fit();
      }
    };
    window.addEventListener("resize", this.resizeHandler);

    // Show welcome message
    this.showWelcome();

    return this.terminal;
  }

  /**
   * Get the current terminal instance
   */
  getTerminal(): Terminal | null {
    return this.terminal;
  }

  /**
   * Show welcome message
   */
  showWelcome(): void {
    if (!this.terminal) return;

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
   * Show error message
   */
  showError(error: Error): void {
    if (!this.terminal) return;

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
        this.terminal!.writeln(`\x1b[90m${line}\x1b[0m`);
      });
    }

    this.terminal.writeln("");
    this.terminal.writeln("\x1b[33mFix the error and click Run again\x1b[0m");
  }

  /**
   * Clear the terminal
   */
  clear(): void {
    if (!this.terminal) return;
    this.terminal.clear();
  }

  /**
   * Reinitialize the terminal (clear and show welcome)
   */
  reinit(): void {
    this.clear();
    this.showWelcome();
  }

  /**
   * Dispose terminal and cleanup
   */
  dispose(): void {
    // Remove resize handler
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
      this.resizeHandler = null;
    }

    // Dispose terminal
    if (this.terminal) {
      this.terminal.dispose();
      this.terminal = null;
    }

    if (this.fitAddon) {
      this.fitAddon = null;
    }
  }
}
