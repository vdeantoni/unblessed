/**
 * CharCanvas.tsx - CharCanvas component and descriptor for @unblessed/react
 */

import { CharCanvas as CharCanvasWidget, type Screen } from "@unblessed/core";
import {
  ComputedLayout,
  FlexboxProps,
  WidgetDescriptor,
} from "@unblessed/layout";
import type { ReactNode } from "react";
import { forwardRef, type PropsWithChildren } from "react";
import type { Theme } from "../themes/theme.js";
import type { InteractiveWidgetProps } from "../widget-descriptors";
import {
  buildFocusableOptions,
  buildFocusEffects,
  buildHoverEffects,
  buildStyleObject,
  extractEventHandlers,
  extractFlexboxProps,
  extractStyleProps,
  getComponentDefaults,
  initializeBorderStyle,
  mergeStyles,
} from "../widget-descriptors/helpers.js";
import { COMMON_WIDGET_OPTIONS } from "./Box.js";

/**
 * Props interface for CharCanvas component
 * Combines flexbox layout props with char canvas-specific properties
 */
export interface CharCanvasProps extends InteractiveWidgetProps {
  children?: ReactNode;
}

/**
 * Descriptor for CharCanvas widgets
 */
export class CharCanvasDescriptor extends WidgetDescriptor<
  CharCanvasProps,
  Theme
> {
  readonly type: string = "charcanvas";

  get flexProps(): FlexboxProps {
    return extractFlexboxProps(this.props);
  }

  get widgetOptions(): Record<string, any> {
    const widgetOptions: any = {};

    // Initialize border and style.border in one clean step
    const borderInit = initializeBorderStyle(
      this,
      !!this.props.hover?.border,
      !!this.props.focus?.border,
    );
    if (borderInit.border) {
      widgetOptions.border = borderInit.border;
    }
    widgetOptions.style = borderInit.style;

    // Build focusable options using helper function
    // CharCanvas is not focusable by default (no defaultTabIndex)
    Object.assign(widgetOptions, buildFocusableOptions(this.props));

    // Get theme defaults for this component type
    const defaults = getComponentDefaults(this);

    // Base/default state styling from direct props
    const defaultStyle = extractStyleProps(this.props);
    const baseStyle = buildStyleObject(this, defaultStyle);
    if (Object.keys(baseStyle).length > 0) {
      widgetOptions.style = mergeStyles(widgetOptions.style, baseStyle);
    }

    // Build hover effects - use props or fall back to theme defaults
    let hoverEffects = null;
    if (this.props.hover) {
      hoverEffects = buildHoverEffects(this, this.props.hover);
    } else if (defaults.hoverFg || defaults.hoverBg) {
      // Apply theme defaults for hover
      const themeHover: any = {};
      if (defaults.hoverFg) themeHover.fg = defaults.hoverFg;
      if (defaults.hoverBg) themeHover.bg = defaults.hoverBg;
      hoverEffects = buildHoverEffects(this, themeHover);
    }
    if (hoverEffects) {
      widgetOptions.hoverEffects = hoverEffects;
    }

    // Build focus effects - automatically applies focusBorderColor from theme
    const focusEffects = buildFocusEffects(this, this.props.focus);
    if (focusEffects) {
      widgetOptions.focusEffects = focusEffects;
    }

    return widgetOptions;
  }

  get eventHandlers(): Record<string, Function> {
    return extractEventHandlers(this.props);
  }

  createWidget(layout: ComputedLayout, screen: Screen): CharCanvasWidget {
    return new CharCanvasWidget({
      screen,
      ...COMMON_WIDGET_OPTIONS,
      top: layout.top,
      left: layout.left,
      width: layout.width,
      height: layout.height,
      ...this.widgetOptions,
    });
  }
}

/**
 * CharCanvas component - Character-based canvas for text animations
 *
 * Provides a canvas for character-level drawing and animations.
 * Perfect for Matrix rain, falling text, ASCII art animations, etc.
 *
 * Resolution: 1:1 (one character per cell)
 * Storage: Array of [attr, char] pairs
 *
 * @example Basic usage
 * ```tsx
 * const App = () => {
 *   const canvasRef = useRef<CharCanvasWidget>(null);
 *
 *   useEffect(() => {
 *     const canvas = canvasRef.current;
 *     if (!canvas) return;
 *
 *     // Set individual cells
 *     canvas.setCell(10, 5, 'X', 0);
 *
 *     // Draw a line
 *     canvas.drawLine(0, 0, 10, 10, '*', 0);
 *
 *     canvas.screen.render();
 *   }, []);
 *
 *   return <CharCanvas ref={canvasRef} width={80} height={24} />;
 * };
 * ```
 *
 * @example Matrix rain animation
 * ```tsx
 * const MatrixRain = () => {
 *   const canvasRef = useRef<CharCanvasWidget>(null);
 *
 *   useEffect(() => {
 *     const canvas = canvasRef.current;
 *     if (!canvas) return;
 *
 *     const drops = createDrops(canvas.canvasWidth, canvas.canvasHeight);
 *
 *     const interval = setInterval(() => {
 *       updateDrops(drops);
 *       canvas.clear();
 *
 *       drops.forEach(drop => {
 *         canvas.setCell(drop.x, drop.y, drop.char, greenAttr);
 *       });
 *
 *       canvas.screen.render();
 *     }, 50);
 *
 *     return () => clearInterval(interval);
 *   }, []);
 *
 *   return <CharCanvas ref={canvasRef} width={80} height={24} />;
 * };
 * ```
 */
export const CharCanvas = forwardRef<
  CharCanvasWidget,
  PropsWithChildren<CharCanvasProps>
>(({ children, ...props }, ref) => {
  return (
    <charcanvas ref={ref} {...props}>
      {children}
    </charcanvas>
  );
});

CharCanvas.displayName = "CharCanvas";
