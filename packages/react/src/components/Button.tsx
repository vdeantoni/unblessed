/**
 * Button.tsx - Button component for @unblessed/react
 */

import { forwardRef, type PropsWithChildren } from "react";
import { BoxProps } from "./Box";

/**
 * Props for Button component
 */
export interface ButtonProps extends BoxProps {
  /**
   * Background color when button is hovered.
   */
  hoverBg?: string;

  focusBg?: string;
}

/**
 * Button component
 */
export const Button = forwardRef<any, PropsWithChildren<ButtonProps>>(
  ({ children, ...props }, ref) => {
    return (
      <button ref={ref} border={1} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
