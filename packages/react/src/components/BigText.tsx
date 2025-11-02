/**
 * BigText.tsx - BigText component for @unblessed/react
 */

import { forwardRef, type PropsWithChildren } from "react";
import type { BoxProps } from "./Box.js";

/**
 * Props for BigText component
 */
export interface BigTextProps extends BoxProps {
  children?: string;
}

/**
 * BigText component - Renders large ASCII art text
 *
 * Uses terminal fonts to render large text. Each character is 14 rows × 8 columns.
 * Supports all BoxProps including flexbox layout, borders, and event handling.
 *
 * @example
 * ```tsx
 * <BigText color="cyan">
 *   HELLO
 * </BigText>
 * ```
 *
 * @example With border and events
 * ```tsx
 * <BigText
 *   color="green"
 *   borderStyle="single"
 *   padding={1}
 *   onClick={() => console.log('Big text clicked!')}
 * >
 *   WELCOME
 * </BigText>
 * ```
 */
export const BigText = forwardRef<any, PropsWithChildren<BigTextProps>>(
  ({ children, ...props }, ref) => {
    const fontHeight = 14;
    const fontWidth = 8;

    return (
      <bigtext
        ref={ref}
        color="white"
        height={fontHeight}
        width={(children?.length || 0) * fontWidth}
        {...props}
      >
        {children}
      </bigtext>
    );
  },
);

BigText.displayName = "BigText";
