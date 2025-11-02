/**
 * Button.tsx - Button component for @unblessed/react
 */

import { forwardRef, type PropsWithChildren } from "react";
import type { BoxProps } from "./Box.js";

/**
 * Props for Button component
 */
export interface ButtonProps extends BoxProps {
  hoverBg?: string;
  focusBg?: string;
}

/**
 * Button component - Interactive button with hover and focus effects
 *
 * Supports mouse clicks, keyboard press (Enter), and visual state changes.
 * Automatically receives focus when tabbed to.
 *
 * @example Basic button
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
 *   borderStyle="single"
 *   borderColor="blue"
 *   hoverBg="blue"
 *   focusBg="cyan"
 *   padding={1}
 *   onPress={() => handleSubmit()}
 * >
 *   Submit
 * </Button>
 * ```
 *
 * @example Interactive counter
 * ```tsx
 * const [count, setCount] = useState(0);
 *
 * <Button onClick={() => setCount(c => c + 1)}>
 *   Count: {count}
 * </Button>
 * ```
 */
export const Button = forwardRef<any, PropsWithChildren<ButtonProps>>(
  ({ children, ...props }, ref) => {
    return (
      <tbutton ref={ref} border={1} {...props}>
        {children}
      </tbutton>
    );
  },
);

Button.displayName = "Button";
