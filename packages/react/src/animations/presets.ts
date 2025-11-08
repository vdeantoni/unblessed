/**
 * presets.ts - Animation preset implementations
 *
 * Provides ready-to-use animation generators for common effects.
 */

import {
  generateGradient,
  generateRainbow,
  rotateColors,
} from "@unblessed/core";
import type {
  BorderAnimationConfig,
  BorderAnimationType,
  TextAnimationConfig,
  TextAnimationType,
} from "./types.js";

/**
 * Default colors for gradient border animations
 */
const DEFAULT_GRADIENT_COLORS: (string | number)[] = [
  "cyan",
  "blue",
  "magenta",
  "cyan",
];

/**
 * Default colors for rotating-colors border animations
 */
const DEFAULT_ROTATING_COLORS: (string | number)[] = [
  "cyan",
  "green",
  "yellow",
  "red",
];

/**
 * Generate a multi-color gradient by chaining two-color gradients
 *
 * @param colors - Array of colors to interpolate between
 * @param length - Total length of the gradient
 * @returns Array of interpolated colors
 */
export function generateMultiColorGradient(
  colors: (string | number)[],
  length: number,
): (string | number)[] {
  if (colors.length < 2) {
    throw new Error("Need at least 2 colors for gradient");
  }

  // Fast path for two-color gradients
  if (colors.length === 2) {
    return generateGradient(colors[0], colors[1], length);
  }

  // Chain multiple two-color gradients for smooth transitions
  const segmentCount = colors.length - 1;
  const segmentLength = Math.ceil(length / segmentCount);
  const result: (string | number)[] = [];

  for (let i = 0; i < segmentCount; i++) {
    const segment = generateGradient(colors[i], colors[i + 1], segmentLength);

    // Avoid duplicate colors at segment boundaries
    if (i === segmentCount - 1) {
      result.push(...segment);
    } else {
      result.push(...segment.slice(0, -1));
    }
  }

  return result.slice(0, length);
}

/**
 * Border animation generators
 */
export const borderAnimations = {
  /**
   * Rainbow border animation - cycles through rainbow colors
   */
  rainbow: (length: number, frame: number): (string | number)[] => {
    const colors = generateRainbow(length);
    return rotateColors(colors, frame);
  },

  /**
   * Gradient border animation - smooth color transitions
   */
  gradient: (
    length: number,
    frame: number,
    colors?: (string | number)[],
  ): (string | number)[] => {
    const gradientColors = colors ?? DEFAULT_GRADIENT_COLORS;
    const gradient = generateMultiColorGradient(gradientColors, length);
    return rotateColors(gradient, frame);
  },

  /**
   * Rotating colors animation - each segment cycles through discrete colors
   */
  "rotating-colors": (
    length: number,
    frame: number,
    colors?: (string | number)[],
  ): (string | number)[] => {
    const colorSet = colors ?? DEFAULT_ROTATING_COLORS;
    const repeated: (string | number)[] = [];

    for (let i = 0; i < length; i++) {
      const colorIndex = (i + frame) % colorSet.length;
      repeated.push(colorSet[colorIndex]);
    }

    return repeated;
  },
};

/**
 * Get border animation generator function from config
 *
 * @param config - Border animation configuration
 * @returns Generator function that produces color arrays for each frame
 */
export function getBorderGenerator(
  config: BorderAnimationConfig,
): (length: number, frame: number) => (string | number)[] {
  // Custom generator takes precedence
  if (config.type === "custom" && config.generator) {
    return config.generator;
  }

  // Built-in generators with proper typing
  const generators: Record<
    Exclude<BorderAnimationType, "custom">,
    (length: number, frame: number) => (string | number)[]
  > = {
    gradient: (length: number, frame: number) =>
      borderAnimations.gradient(length, frame, config.colors),
    "rotating-colors": (length: number, frame: number) =>
      borderAnimations["rotating-colors"](length, frame, config.colors),
    rainbow: borderAnimations.rainbow,
  };

  return (
    generators[config.type as Exclude<BorderAnimationType, "custom">] ??
    borderAnimations.rainbow
  );
}

/**
 * Default configuration for each text animation type
 */
export const textAnimationDefaults: Record<
  TextAnimationType,
  Partial<TextAnimationConfig>
> = {
  pulse: {
    colors: ["white", "gray", "white"],
    duration: 1000,
  },
  "color-cycle": {
    colors: ["cyan", "green", "yellow", "magenta"],
    fps: 2,
  },
  typewriter: {
    duration: 2000,
  },
  chase: {
    baseColor: "gray",
    highlightColor: "white",
    width: 3,
    direction: "ltr",
    mode: "loop",
    fps: 30,
  },
  blink: {
    duration: 500,
  },
  gradient: {
    colors: ["cyan", "blue", "magenta"],
  },
  rainbow: {
    fps: 10,
  },
};

/**
 * Get text animation config with defaults applied
 *
 * @param config - User-provided text animation configuration
 * @returns Complete configuration with defaults filled in
 */
export function getTextAnimationConfig(
  config: TextAnimationConfig,
): Required<Omit<TextAnimationConfig, "text">> & { text?: string } {
  const defaults = textAnimationDefaults[config.type];

  return {
    type: config.type,
    fps: config.fps ?? defaults.fps ?? 30,
    colors: config.colors ?? defaults.colors ?? ["white"],
    duration: config.duration ?? defaults.duration ?? 1000,
    text: config.text,
    baseColor: config.baseColor ?? defaults.baseColor ?? "gray",
    highlightColor: config.highlightColor ?? defaults.highlightColor ?? "white",
    width: config.width ?? defaults.width ?? 3,
    direction: config.direction ?? defaults.direction ?? "ltr",
    mode: config.mode ?? defaults.mode ?? "loop",
  };
}
