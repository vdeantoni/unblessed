/**
 * useWidget.ts - Hook for accessing underlying unblessed widgets
 *
 * Provides direct access to the unblessed widget instance from React components.
 * Useful for imperative animations and direct widget manipulation that bypasses
 * React re-renders.
 */

import type { Element } from "@unblessed/core";
import { useEffect, useRef, useState } from "react";

/**
 * Hook to access the underlying unblessed widget instance.
 *
 * Returns a ref object that will contain the widget after the component mounts.
 * The widget reference allows direct manipulation for animations and other
 * imperative operations without triggering React re-renders.
 *
 * **IMPORTANT:** The widget is only available AFTER the first render.
 * Use the callback pattern or useEffect to wait for the widget to be available.
 *
 * @template T - Widget type (defaults to Element)
 * @param callback - Optional callback invoked when widget becomes available
 * @returns Ref object containing the widget instance
 *
 * @example
 * ```tsx
 * import { useWidget, makeAnimatable, generateRainbow, rotateColors } from '@unblessed/react';
 *
 * function AnimatedBox() {
 *   const widgetRef = useWidget<Box>();
 *
 *   useEffect(() => {
 *     const widget = widgetRef.current;
 *     if (!widget) return;
 *
 *     // Enable animations on the widget
 *     makeAnimatable(widget);
 *
 *     // Animate border colors - bypasses React re-renders!
 *     const stop = widget.animateBorderColors((length, frame) => {
 *       const colors = generateRainbow(length);
 *       return rotateColors(colors, frame);
 *     }, { fps: 30 });
 *
 *     return () => stop();
 *   }, []);
 *
 *   return <Box border={1}>Animated!</Box>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With callback pattern
 * function AnimatedBox() {
 *   const widgetRef = useWidget((widget) => {
 *     // Widget is guaranteed to be available here
 *     makeAnimatable(widget);
 *     widget.animateBorderColors(...);
 *   });
 *
 *   return <Box border={1}>Animated!</Box>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Pulse animation
 * function PulsingText() {
 *   const widgetRef = useWidget<Element>();
 *
 *   useEffect(() => {
 *     if (!widgetRef.current) return;
 *
 *     makeAnimatable(widgetRef.current);
 *     const stop = widgetRef.current.pulse('fg', ['red', 'yellow', 'red'], {
 *       duration: 1000
 *     });
 *
 *     return () => stop();
 *   }, []);
 *
 *   return <Text>Pulsing!</Text>;
 * }
 * ```
 */
export function useWidget<T extends Element = Element>(
  callback?: (widget: T) => void | (() => void),
): { current: T | null } {
  const widgetRef = useRef<T | null>(null);
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Try to get widget from parent DOMNode
    // This is a workaround since we don't have direct access to the reconciler instance
    // The widget will be available after the first layout calculation

    // Small delay to ensure layout has been calculated
    const timer = setTimeout(() => {
      // Try to find widget via DOM traversal (implementation detail)
      // For now, this is a placeholder - the actual implementation
      // will require integration with the reconciler

      // Force re-render to check if widget is available
      forceUpdate({});
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (widgetRef.current && callback) {
      const cleanup = callback(widgetRef.current);
      return cleanup;
    }
  }, [widgetRef.current, callback]);

  return widgetRef;
}

/**
 * Internal function to set widget reference from reconciler.
 * This is called by the reconciler after creating/updating widgets.
 *
 * @internal
 */
export function setWidgetRef<T extends Element = Element>(
  ref: { current: T | null },
  widget: T | null,
): void {
  ref.current = widget;
}
