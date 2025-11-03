/**
 * Browser runtime initialization
 *
 * This module sets up the browser environment with:
 * 1. Node.js polyfills (process, Buffer, etc.)
 * 2. @unblessed/core Runtime implementation for browser
 * 3. Global references
 */

import { setRuntime } from "@unblessed/core";
import { Buffer } from "buffer";
import { BrowserRuntime } from "./browser-runtime.js";

// Only initialize once
if (
  typeof (globalThis as any).__BLESSED_BROWSER_INITIALIZED__ === "undefined"
) {
  // Step 1: Set up process global
  if (typeof globalThis.process === "undefined") {
    const listeners = new Map<string, Set<Function>>();

    (globalThis as any).process = {
      platform: "browser",
      arch: "x64",
      env: { TERM: "xterm-256color", LANG: "en_US.UTF-8" },
      cwd: () => "/",
      exit: (code?: number) => {
        console.log(`Process exit called with code: ${code ?? 0}`);
        throw new Error("Process exited");
      },
      pid: 1,
      title: "browser",
      version: "v18.0.0",
      stdin: {},
      stdout: {},
      stderr: {},
      on: (event: string, listener: Function) => {
        if (!listeners.has(event)) {
          listeners.set(event, new Set());
        }
        listeners.get(event)!.add(listener);
      },
      once: (event: string, listener: Function) => {
        const wrapper = (...args: any[]) => {
          listener(...args);
          globalThis.process.removeListener(event, wrapper);
        };
        globalThis.process.on(event, wrapper);
      },
      removeListener: (event: string, listener: Function) => {
        const eventListeners = listeners.get(event);
        if (eventListeners) {
          eventListeners.delete(listener);
        }
      },
      removeAllListeners: (event?: string) => {
        if (event) {
          listeners.delete(event);
        } else {
          listeners.clear();
        }
      },
      listeners: (event: string) => {
        const eventListeners = listeners.get(event);
        return eventListeners ? Array.from(eventListeners) : [];
      },
      nextTick: (fn: Function, ...args: any[]) => {
        setTimeout(() => fn(...args), 0);
      },
      kill: () => {
        throw new Error("process.kill not supported in browser");
      },
    };
  }

  // Step 2: Set up Buffer global
  if (typeof globalThis.Buffer === "undefined") {
    (globalThis as any).Buffer = Buffer;
  }

  // Step 3: Set up global reference
  if (!(globalThis as any).global) {
    (globalThis as any).global = globalThis;
  }

  // Step 4: Create and initialize BrowserRuntime
  const runtime = new BrowserRuntime();
  setRuntime(runtime);

  // Mark as initialized
  (globalThis as any).__BLESSED_BROWSER_INITIALIZED__ = true;
}
