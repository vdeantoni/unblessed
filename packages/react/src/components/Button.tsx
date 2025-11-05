/**
 * Button.tsx - Button component and descriptor for @unblessed/react
 */

import { Button as ButtonWidget, type Screen } from "@unblessed/core";
import { ComputedLayout } from "@unblessed/layout";
import type { ReactNode } from "react";
import { forwardRef, type PropsWithChildren } from "react";
import type { InteractiveWidgetProps } from "../widget-descriptors/common-props.js";
import { BoxDescriptor, COMMON_WIDGET_OPTIONS } from "./Box";

/**
 * Props interface for Button component
 * Inherits all interactive widget properties (layout, events, focus, borders, styling)
 */
export interface ButtonProps extends InteractiveWidgetProps {
  content?: string;
  children?: ReactNode;
}

/**
 * Descriptor for Button widgets
 */
export class ButtonDescriptor extends BoxDescriptor<ButtonProps> {
  override readonly type = "button";

  override get eventHandlers() {
    const handlers: Record<string, Function> = super.eventHandlers;
    if (this.props.onPress) handlers.press = this.props.onPress;
    return handlers;
  }

  override createWidget(layout: ComputedLayout, screen: Screen): ButtonWidget {
    return new ButtonWidget({
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
 * Button component - Interactive button with hover and focus effects
 *
 * Supports mouse clicks, keyboard press (Enter), and visual state changes.
 * Automatically receives focus when tabbed to.
 * Automatically applies theme defaults for colors and border style.
 *
 * Default state styling uses direct props (color, bg, bold, etc.)
 * State variations use nested objects (hover, focus)
 *
 * @example Basic button with theme defaults
 * ```tsx
 * <Button onClick={() => console.log('Clicked!')}>
 *   Click Me
 * </Button>
 * ```
 *
 * @example With custom colors (overrides theme)
 * ```tsx
 * <Button
 *   borderStyle="single"
 *   borderColor="green"
 *   padding={1}
 *   onClick={() => console.log('Clicked!')}
 * >
 *   Click Me
 * </Button>
 * ```
 *
 * @example With hover and focus effects
 * ```tsx
 * <Button
 *   hover={{ bg: "darkblue" }}
 *   focus={{ border: { color: "cyan" } }}
 *   padding={1}
 *   onPress={() => handleSubmit()}
 * >
 *   Submit
 * </Button>
 * ```
 */
export const Button = forwardRef<any, PropsWithChildren<ButtonProps>>(
  ({ children, ...props }, ref) => {
    return (
      <tbutton
        ref={ref}
        tabIndex={0}
        border={1}
        minHeight={3}
        alignItems="center"
        justifyContent="center"
        {...props}
      >
        {children}
      </tbutton>
    );
  },
);

Button.displayName = "Button";
