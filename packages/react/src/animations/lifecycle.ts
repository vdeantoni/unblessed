/**
 * lifecycle.ts - Animation lifecycle management
 *
 * Manages starting, stopping, and tracking animations on widgets.
 * Uses WeakMap to automatically clean up when widgets are garbage collected.
 */

import { Element, makeAnimatable } from "@unblessed/core";
import { getBorderGenerator, getTextAnimationConfig } from "./presets.js";
import type { BorderAnimationConfig, TextAnimationConfig } from "./types.js";

/**
 * Type for animation cleanup functions
 */
type StopFunction = () => void;

/**
 * Storage for active animations (keyed by widget)
 * Uses WeakMap to allow garbage collection when widgets are destroyed
 */
const activeAnimations = new WeakMap<Element, StopFunction[]>();

/**
 * Starts a border animation on a widget
 *
 * @param widget - Widget to animate
 * @param config - Animation configuration
 * @returns Cleanup function to stop the animation
 */
function startBorderAnimation(
  widget: Element,
  config: BorderAnimationConfig,
): StopFunction {
  makeAnimatable(widget);

  const fps = config.fps ?? 30;
  const generator = getBorderGenerator(config);

  return widget.animateBorderColors(generator, { fps });
}

/**
 * Starts a text color animation on a widget
 *
 * @param widget - Widget to animate
 * @param config - Animation configuration
 * @returns Cleanup function to stop the animation
 */
function startTextAnimation(
  widget: Element,
  config: TextAnimationConfig,
): StopFunction {
  makeAnimatable(widget);

  const fullConfig = getTextAnimationConfig(config);

  switch (config.type) {
    case "pulse":
      return widget.pulse("fg", fullConfig.colors, {
        duration: fullConfig.duration,
      });

    case "color-cycle": {
      // Continuous color cycling (does not loop back like pulse)
      let currentIndex = 0;
      const interval = setInterval(() => {
        widget.style.fg = fullConfig.colors[currentIndex];
        currentIndex = (currentIndex + 1) % fullConfig.colors.length;
        widget.screen.render();
      }, 1000 / fullConfig.fps);

      return () => clearInterval(interval);
    }

    case "typewriter": {
      // Character-by-character text reveal effect
      const text = fullConfig.text || widget.getContent?.() || "";
      if (!text) {
        return () => {}; // No text to animate
      }

      const chars = text.split("");
      let charIndex = 0;

      widget.setContent?.("");

      const interval = setInterval(() => {
        if (charIndex >= chars.length) {
          clearInterval(interval);
          return;
        }

        charIndex++;
        widget.setContent?.(chars.slice(0, charIndex).join(""));
        widget.screen.render();
      }, fullConfig.duration / chars.length);

      return () => {
        clearInterval(interval);
        widget.setContent?.(text); // Restore full text on cleanup
      };
    }

    default:
      // Unknown animation type - no-op
      return () => {};
  }
}

/**
 * Starts all configured animations on a widget
 *
 * Animations run concurrently and are automatically cleaned up when
 * stopAnimations() is called or when the widget is garbage collected.
 *
 * @param widget - Widget to animate
 * @param border - Optional border animation config
 * @param color - Optional text animation config
 */
export function startAnimations(
  widget: Element,
  border?: BorderAnimationConfig,
  color?: TextAnimationConfig,
): void {
  const stops: StopFunction[] = [];

  if (border) {
    stops.push(startBorderAnimation(widget, border));
  }

  if (color) {
    stops.push(startTextAnimation(widget, color));
  }

  if (stops.length > 0) {
    activeAnimations.set(widget, stops);
  }
}

/**
 * Stops all animations on a widget and cleans up resources
 *
 * Safe to call multiple times or on widgets without animations.
 *
 * @param widget - Widget to stop animations on
 */
export function stopAnimations(widget: Element): void {
  const stops = activeAnimations.get(widget);

  if (stops) {
    stops.forEach((stop) => stop());
    activeAnimations.delete(widget);
  }
}

/**
 * Checks if a widget has active animations
 *
 * @param widget - Widget to check
 * @returns True if widget has active animations
 */
export function hasAnimations(widget: Element): boolean {
  return activeAnimations.has(widget);
}
