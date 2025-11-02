/**
 * Input.tsx - Input component for @unblessed/react
 */

import { forwardRef, type PropsWithChildren } from "react";
import type { BoxProps } from "./Box.js";

/**
 * Props for Input component
 */
export interface InputProps extends BoxProps {
  autoFocus?: boolean;
}

/**
 * Input component - Text input field for user interaction
 *
 * Provides a single-line text input with submit/cancel events.
 * Users can type text and submit with Enter or cancel with Escape.
 *
 * @example Basic input
 * ```tsx
 * <Input
 *   borderColor="blue"
 *   autoFocus
 *   onSubmit={(value) => console.log('Submitted:', value)}
 * />
 * ```
 *
 * @example Form input
 * ```tsx
 * const [name, setName] = useState("");
 *
 * <Box flexDirection="column" gap={1}>
 *   <Text>Enter your name:</Text>
 *   <Input
 *     borderColor="cyan"
 *     onSubmit={(value) => setName(value)}
 *     onCancel={() => console.log('Cancelled')}
 *   />
 *   {name && <Text>Hello, {name}!</Text>}
 * </Box>
 * ```
 *
 * @example With key press handler
 * ```tsx
 * <Input
 *   onKeyPress={(ch, key) => {
 *     if (key.ctrl && key.name === 'c') {
 *       console.log('Ctrl+C pressed');
 *     }
 *   }}
 * />
 * ```
 */
export const Input = forwardRef<any, PropsWithChildren<InputProps>>(
  ({ children, ...props }, ref) => {
    return (
      <textinput ref={ref} border={1} height={3} {...props}>
        {children}
      </textinput>
    );
  },
);

Input.displayName = "Input";
