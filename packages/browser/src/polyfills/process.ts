/**
 * Process polyfill for browser
 *
 * Provides a minimal process object compatible with Node.js process API
 */

export function createProcess() {
  const listeners = new Map<string, Set<Function>>();

  return {
    platform: "browser" as const,
    arch: "x64" as const,
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
        processObj.removeListener(event, wrapper);
      };
      processObj.on(event, wrapper);
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
  } as any;
}

// Store reference for self-referencing wrapper
const processObj = createProcess();
