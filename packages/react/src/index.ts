/**
 * @unblessed/react - React renderer for unblessed
 *
 * Build terminal UIs with React and flexbox layouts.
 *
 * @example
 * ```tsx
 * import { render, Box, Text } from '@unblessed/react';
 *
 * const App = () => (
 *   <Box flexDirection="row" gap={2} padding={1}>
 *     <Box width={20} borderStyle="single">
 *       <Text color="green">Left</Text>
 *     </Box>
 *     <Box flexGrow={1} borderStyle="single">
 *       <Text>Middle (fills space)</Text>
 *     </Box>
 *     <Box width={20} borderStyle="single">
 *       <Text color="blue">Right</Text>
 *     </Box>
 *   </Box>
 * );
 *
 * render(<App />);
 * ```
 *
 * @packageDocumentation
 */

// Export React so consumers use the same instance
export { default as React } from "react";

// Components
export { BigText, type BigTextProps } from "./components/BigText.js";
export { Box, type BoxProps } from "./components/Box.js";
export {
  BrailleCanvas,
  type BrailleCanvasProps,
} from "./components/BrailleCanvas.js";
export { Button, type ButtonProps } from "./components/Button.js";
export { CharCanvas, type CharCanvasProps } from "./components/CharCanvas.js";
export { Input, type InputProps } from "./components/Input.js";
export { List, type ListProps } from "./components/List.js";
export { Spacer } from "./components/Spacer.js";
export { Text, type TextProps } from "./components/Text.js";

// Render function
export { render } from "./render.js";

// Types
export type {
  EventHandlers,
  ReactEventProps,
  RenderInstance,
  RenderOptions,
} from "./types.js";

// Theme system
export { useTheme } from "./components/ThemeProvider.js";
export { useScreen, useWindowSize } from "./hooks/ScreenContext.js";
export {
  useKeyboard,
  type KeyboardHandler,
  type KeyboardShortcuts,
} from "./hooks/useKeyboard.js";
export {
  useResponsiveCanvas,
  type ResponsiveCanvasDimensions,
  type UseResponsiveCanvasOptions,
} from "./hooks/useResponsiveCanvas.js";
export { useWidget } from "./hooks/useWidget.js";
export { matrixTheme, unblessedTheme } from "./themes/index.js";
export type {
  ColorPrimitive,
  ComponentDefaults,
  Theme,
  ThemePrimitives,
  ThemeSemantic,
} from "./themes/theme.js";

// Theme utilities (for advanced usage)
export { isThemeReference, resolveColor } from "./themes/theme-utils.js";

// Re-export animation utilities from @unblessed/core for convenience
export {
  AnimationController,
  Spring,
  clamp,
  easing,
  generateGradient,
  generateRainbow,
  lerp,
  lerpColor,
  makeAnimatable,
  rotateColors,
  type AnimatableMethods,
} from "@unblessed/core";

// Declarative animation system
export {
  borderAnimations,
  textAnimationDefaults,
} from "./animations/presets.js";
export type {
  AnimationConfigs,
  BorderAnimationConfig,
  BorderAnimationType,
  TextAnimationConfig,
  TextAnimationType,
} from "./animations/types.js";
