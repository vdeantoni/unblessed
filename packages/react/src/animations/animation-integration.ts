/**
 * animation-integration.ts - Integrates animations with widget lifecycle
 *
 * Walks layout tree and starts/stops animations based on configs stored on nodes.
 */

import type { LayoutNode } from "@unblessed/layout";
import { startAnimations, stopAnimations } from "./lifecycle.js";

/**
 * Starts animations on a layout tree
 * Called after widgets are created/updated by syncTreeAndRender
 *
 * @param node - Root layout node to process
 */
export function startTreeAnimations(node: LayoutNode): void {
  // Skip if no widget
  if (!node.widget) return;

  // Start animations if configured
  if (node._animations) {
    startAnimations(
      node.widget,
      node._animations.border,
      node._animations.color,
    );
  }

  // Recursively process children
  for (const child of node.children) {
    startTreeAnimations(child);
  }
}

/**
 * Stops animations on a layout tree
 * Called before widgets are updated/destroyed
 *
 * @param node - Root layout node to process
 */
export function stopTreeAnimations(node: LayoutNode): void {
  // Stop animations if widget exists
  if (node.widget) {
    stopAnimations(node.widget);
  }

  // Recursively process children
  for (const child of node.children) {
    stopTreeAnimations(child);
  }
}
