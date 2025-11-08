/**
 * types.ts - Animation configuration types
 *
 * Defines the configuration interfaces for declarative animations in React components.
 */

/**
 * Border animation types
 */
export type BorderAnimationType =
  | "rainbow"
  | "gradient"
  | "rotating-colors"
  | "custom";

/**
 * Border animation configuration
 */
export interface BorderAnimationConfig {
  /**
   * Animation type
   */
  type: BorderAnimationType;

  /**
   * Animation speed in frames per second
   * @default 30
   */
  fps?: number;

  /**
   * Colors to use (for gradient and rotating-colors)
   * Can be color names or hex codes
   */
  colors?: (string | number)[];

  /**
   * Custom generator function (for type="custom")
   * @param length - Border length in characters
   * @param frame - Current frame number
   * @returns Array of colors for each border character
   */
  generator?: (length: number, frame: number) => (string | number)[];
}

/**
 * Text animation types
 */
export type TextAnimationType =
  | "pulse"
  | "color-cycle"
  | "typewriter"
  | "chase"
  | "blink"
  | "gradient"
  | "rainbow";

/**
 * Text animation configuration
 */
export interface TextAnimationConfig {
  /**
   * Animation type
   */
  type: TextAnimationType;

  /**
   * Animation speed in frames per second (for color-cycle, chase, rainbow)
   * @default 30
   */
  fps?: number;

  /**
   * Colors to cycle/pulse through (for pulse, color-cycle, gradient)
   * @default ["white", "gray", "white"]
   */
  colors?: (string | number)[];

  /**
   * Animation duration in milliseconds (for pulse, typewriter, blink)
   * @default 1000
   */
  duration?: number;

  /**
   * Text content (for typewriter effect)
   */
  text?: string;

  /**
   * Base color for non-highlighted characters (for chase)
   * @default "gray"
   */
  baseColor?: string;

  /**
   * Highlight color for chase window (for chase)
   * @default "white"
   */
  highlightColor?: string;

  /**
   * Number of characters in chase window (for chase)
   * @default 3
   */
  width?: number;

  /**
   * Direction of chase movement (for chase)
   * @default "ltr"
   */
  direction?: "ltr" | "rtl";

  /**
   * Chase mode: loop (wrap around) or bounce (ping-pong) (for chase)
   * @default "loop"
   */
  mode?: "loop" | "bounce";
}

/**
 * All animation configurations
 */
export interface AnimationConfigs {
  border?: BorderAnimationConfig;
  color?: TextAnimationConfig;
}
