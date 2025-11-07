/**
 * BrailleCanvas.tsx - BrailleCanvas component and descriptor for @unblessed/react
 */

import {
  BrailleCanvas as BrailleCanvasWidget,
  type Screen,
} from "@unblessed/core";
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
 * Props interface for BrailleCanvas component
 * Combines flexbox layout props with braille canvas-specific properties
 */
export interface BrailleCanvasProps extends InteractiveWidgetProps {
  children?: ReactNode;
}

/**
 * Descriptor for BrailleCanvas widgets
 */
export class BrailleCanvasDescriptor extends WidgetDescriptor<
  BrailleCanvasProps,
  Theme
> {
  readonly type: string = "braillecanvas";

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
    // BrailleCanvas is not focusable by default (no defaultTabIndex)
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

  createWidget(layout: ComputedLayout, screen: Screen): BrailleCanvasWidget {
    return new BrailleCanvasWidget({
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
 * BrailleCanvas component - High-resolution pixel canvas for data visualization
 *
 * Provides a high-resolution canvas using braille Unicode characters (U+2800 - U+28FF).
 * Each braille character represents a 2×4 pixel grid, giving 4× the resolution
 * of character-based rendering.
 *
 * Resolution: 2×4 pixels per character (effective 4× resolution boost)
 * Perfect for: Charts, graphs, sparklines, waveforms, data visualization
 *
 * **This is a UNIQUE DIFFERENTIATOR - Ink doesn't have this capability!**
 *
 * @example Basic usage
 * ```tsx
 * const App = () => {
 *   const canvasRef = useRef<BrailleCanvasWidget>(null);
 *
 *   useEffect(() => {
 *     const canvas = canvasRef.current;
 *     if (!canvas) return;
 *
 *     // Set individual pixels
 *     canvas.setPixel(10, 5);
 *
 *     // Draw a line
 *     canvas.drawLine(0, 0, 20, 20);
 *
 *     canvas.screen.render();
 *   }, []);
 *
 *   return (
 *     <BrailleCanvas
 *       ref={canvasRef}
 *       width={40}   // 80 pixels wide
 *       height={12}  // 48 pixels tall
 *     />
 *   );
 * };
 * ```
 *
 * @example Sparkline chart
 * ```tsx
 * const Sparkline = ({ data }: { data: number[] }) => {
 *   const canvasRef = useRef<BrailleCanvasWidget>(null);
 *
 *   useEffect(() => {
 *     const canvas = canvasRef.current;
 *     if (!canvas) return;
 *
 *     canvas.clear();
 *
 *     const max = Math.max(...data);
 *     const { width: pixelWidth, height: pixelHeight } = canvas.getPixelDimensions();
 *
 *     // Plot data points with smooth lines
 *     data.forEach((value, i) => {
 *       const x = Math.floor((i / data.length) * pixelWidth);
 *       const y = pixelHeight - Math.floor((value / max) * pixelHeight);
 *
 *       if (i > 0) {
 *         const prevX = Math.floor(((i - 1) / data.length) * pixelWidth);
 *         const prevY = pixelHeight - Math.floor((data[i - 1] / max) * pixelHeight);
 *         canvas.drawLine(prevX, prevY, x, y);
 *       }
 *     });
 *
 *     canvas.screen.render();
 *   }, [data]);
 *
 *   return <BrailleCanvas ref={canvasRef} width={40} height={10} />;
 * };
 * ```
 *
 * @example Real-time waveform
 * ```tsx
 * const Waveform = () => {
 *   const canvasRef = useRef<BrailleCanvasWidget>(null);
 *
 *   useEffect(() => {
 *     const canvas = canvasRef.current;
 *     if (!canvas) return;
 *
 *     let frame = 0;
 *     const interval = setInterval(() => {
 *       canvas.clear();
 *
 *       const { width: pixelWidth, height: pixelHeight } = canvas.getPixelDimensions();
 *       const midY = Math.floor(pixelHeight / 2);
 *
 *       for (let x = 0; x < pixelWidth; x++) {
 *         const angle = (x / pixelWidth) * Math.PI * 4 + frame * 0.1;
 *         const y = midY + Math.floor(Math.sin(angle) * (midY - 2));
 *         canvas.setPixel(x, y);
 *       }
 *
 *       canvas.screen.render();
 *       frame++;
 *     }, 50);
 *
 *     return () => clearInterval(interval);
 *   }, []);
 *
 *   return <BrailleCanvas ref={canvasRef} width={40} height={12} border={1} />;
 * };
 * ```
 */
export const BrailleCanvas = forwardRef<
  BrailleCanvasWidget,
  PropsWithChildren<BrailleCanvasProps>
>(({ children, ...props }, ref) => {
  return (
    <braillecanvas ref={ref} {...props}>
      {children}
    </braillecanvas>
  );
});

BrailleCanvas.displayName = "BrailleCanvas";
