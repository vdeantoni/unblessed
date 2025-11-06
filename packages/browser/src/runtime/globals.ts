/**
 * Minimal global setup for browser environment
 *
 * Sets up the absolute minimum globals needed before any module imports.
 * This prevents "process is not defined" errors from dependencies like util and stream-browserify.
 */

import { Buffer } from "buffer";

// Only initialize once
if (!(globalThis as any).__UNBLESSED_GLOBALS_INITIALIZED__) {
  // Minimal process object (just enough for util and stream-browserify)
  if (typeof globalThis.process === "undefined") {
    (globalThis as any).process = {
      platform: "browser",
      env: { TERM: "xterm-256color" },
      cwd: () => "/",
      nextTick: (fn: Function, ...args: any[]) =>
        setTimeout(() => fn(...args), 0),
    };
  }

  // Set up Buffer global
  if (typeof globalThis.Buffer === "undefined") {
    (globalThis as any).Buffer = Buffer;
  }

  // Set up global reference
  if (!(globalThis as any).global) {
    (globalThis as any).global = globalThis;
  }

  (globalThis as any).__UNBLESSED_GLOBALS_INITIALIZED__ = true;
}
