/**
 * Box.tsx - Box component for @unblessed/react
 */

import type { FlexboxProps } from "@unblessed/layout";
import type { ReactNode } from "react";
import { forwardRef, type PropsWithChildren } from "react";
import type { ReactEventProps } from "../types.js";

/**
 * Props for Box component (container with flexbox layout)
 */
export interface BoxProps extends FlexboxProps, ReactEventProps {
  tabIndex?: number;
  children?: ReactNode;
  borderStyle?: "single" | "double" | "round" | "bold" | "classic";
  borderColor?: string;
  borderDimColor?: boolean;
  borderTopColor?: string;
  borderBottomColor?: string;
  borderLeftColor?: string;
  borderRightColor?: string;
  borderTopDim?: boolean;
  borderBottomDim?: boolean;
  borderLeftDim?: boolean;
  borderRightDim?: boolean;
  backgroundColor?: string;
  color?: string;
  tags?: boolean;
}

/**
 * Box component - Container with flexbox layout support
 *
 * Supports flexbox properties, borders, colors, and event handling.
 *
 * @example Basic layout
 * ```tsx
 * <Box
 *   flexDirection="row"
 *   gap={2}
 *   padding={1}
 *   borderStyle="single"
 *   borderColor="cyan"
 * >
 *   <Box width={20}>Left</Box>
 *   <Box flexGrow={1}>Middle</Box>
 *   <Box width={20}>Right</Box>
 * </Box>
 * ```
 *
 * @example With event handling
 * ```tsx
 * <Box
 *   padding={1}
 *   borderStyle="single"
 *   onClick={(data) => console.log('Clicked!', data)}
 *   onKeyPress={(ch, key) => {
 *     if (key.name === 'enter') handleSubmit();
 *   }}
 * >
 *   Interactive Box
 * </Box>
 * ```
 */
export const Box = forwardRef<any, PropsWithChildren<BoxProps>>(
  ({ children, ...props }, ref) => {
    return (
      <box ref={ref} {...props}>
        {children}
      </box>
    );
  },
);

Box.displayName = "Box";
