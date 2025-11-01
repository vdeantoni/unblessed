/**
 * Input.tsx - Input component for @unblessed/react
 */

import { forwardRef, type PropsWithChildren } from "react";
import { BoxProps } from "./Box";

/**
 * Props for Input component
 */
export interface InputProps extends BoxProps {
  autoFocus?: boolean;
}

/**
 * Input component
 */
export const Input = forwardRef<any, PropsWithChildren<InputProps>>(
  ({ children, ...props }, ref) => {
    return (
      <input ref={ref} border={1} height={3} {...props}>
        {children}
      </input>
    );
  },
);

Input.displayName = "Input";
