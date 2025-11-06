/**
 * test-helpers.ts - Utilities for testing React components
 */

import type { Element } from "@unblessed/core";
import type { RenderInstance } from "../src/types.js";

/**
 * Helper to find widgets by type in the screen tree
 */
export function findWidgetsByType(
  screen: RenderInstance["screen"],
  type: string,
): Element[] {
  const results: Element[] = [];

  function traverse(element: Element) {
    if (element.type === type) {
      results.push(element);
    }
    if (element.children) {
      for (const child of element.children) {
        traverse(child);
      }
    }
  }

  for (const child of screen.children) {
    traverse(child);
  }

  return results;
}

/**
 * Helper to find a widget by content
 */
export function findWidgetByContent(
  screen: RenderInstance["screen"],
  content: string,
): Element | null {
  function traverse(element: Element): Element | null {
    if (element.content && element.content.includes(content)) {
      return element;
    }
    if (element.children) {
      for (const child of element.children) {
        const result = traverse(child);
        if (result) return result;
      }
    }
    return null;
  }

  for (const child of screen.children) {
    const result = traverse(child);
    if (result) return result;
  }

  return null;
}

/**
 * Helper to get all widgets in the tree
 */
export function getAllWidgets(screen: RenderInstance["screen"]): Element[] {
  const results: Element[] = [];

  function traverse(element: Element) {
    results.push(element);
    if (element.children) {
      for (const child of element.children) {
        traverse(child);
      }
    }
  }

  for (const child of screen.children) {
    traverse(child);
  }

  return results;
}

/**
 * Helper to check if rendering completed successfully
 * Also waits for React rendering to complete
 */
export async function expectRenderSuccess(
  instance: RenderInstance,
): Promise<void> {
  // Basic checks that render completed
  expect(instance).toBeDefined();
  expect(instance.screen).toBeDefined();
  expect(instance.unmount).toBeTypeOf("function");
  expect(instance.rerender).toBeTypeOf("function");

  // Wait for React rendering to complete (React's updateContainer is async)
  await waitForReact();
}

/**
 * Wait for React rendering to complete
 * React's updateContainer callback is async, so we need to wait
 */
export function waitForReact(): Promise<void> {
  return new Promise((resolve) => {
    // Wait for multiple ticks to ensure React has finished rendering
    setTimeout(() => {
      setTimeout(resolve, 0);
    }, 0);
  });
}

/**
 * Wait for async effects to complete
 */
export function waitForEffects(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
