/**
 * Type definitions for the Blessed Playground
 */

import type { Terminal } from "xterm";

/**
 * Options for initializing the playground
 */
export interface PlaygroundOptions {
  /** Debounce delay in milliseconds for auto-run */
  debounceDelay?: number;
}

/**
 * Terminal configuration options
 */
export interface TerminalConfig {
  cursorBlink: boolean;
  fontSize: number;
  fontFamily: string;
  theme: {
    background: string;
    foreground: string;
    cursor: string;
    black: string;
    red: string;
    green: string;
    yellow: string;
    blue: string;
    magenta: string;
    cyan: string;
    white: string;
    brightBlack: string;
    brightRed: string;
    brightGreen: string;
    brightYellow: string;
    brightBlue: string;
    brightMagenta: string;
    brightCyan: string;
    brightWhite: string;
  };
}

/**
 * Execution mode for code
 */
export type ExecutionMode = "classic" | "react";

/**
 * Result of JSX transformation
 */
export interface TransformResult {
  code: string;
  isJSX: boolean;
}

/**
 * Timer tracking for cleanup
 */
export interface TimerTracker {
  intervals: number[];
  timeouts: number[];
}

/**
 * External dependencies available in the playground
 */
export interface PlaygroundDependencies {
  /** Terminal instance (xterm.js) */
  terminal: Terminal;
  /** The tui library (unblessed/browser + react) */
  tui: any;
  /** React library */
  React: any;
  /** Babel standalone for JSX transformation */
  transform: any;
}
