/**
 * border-colors.ts - Utility functions for addressable border colors
 * Provides helpers for generating color arrays for animated borders
 */

import colors from "./colors.js";

/**
 * Convert HSL to RGB color values
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns RGB array [r, g, b] where each value is 0-255
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // Achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Convert RGB to hex color string
 * @param r - Red (0-255)
 * @param g - Green (0-255)
 * @param b - Blue (0-255)
 * @returns Hex color string (e.g., "#ff0000")
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
}

/**
 * Generate a rainbow color array for border animations
 * Colors smoothly transition through the entire color spectrum
 *
 * @param length - Number of colors to generate (typically border perimeter)
 * @returns Array of hex color strings
 *
 * @example
 * const colors = generateRainbow(56); // For 20x10 box
 * box.setBorderColors(colors);
 */
export function generateRainbow(length: number): string[] {
  const result: string[] = [];
  for (let i = 0; i < length; i++) {
    const hue = (i / length) * 360;
    const [r, g, b] = hslToRgb(hue, 100, 50);
    result.push(rgbToHex(r, g, b));
  }
  return result;
}

/**
 * Generate a gradient between two colors
 * Smoothly interpolates from start color to end color
 *
 * @param from - Start color (name, hex, or number)
 * @param to - End color (name, hex, or number)
 * @param length - Number of steps in gradient
 * @returns Array of hex color strings
 *
 * @example
 * const gradient = generateGradient("cyan", "magenta", 28);
 * box.setBorderColors(gradient);
 */
export function generateGradient(
  from: string | number,
  to: string | number,
  length: number,
): string[] {
  // Convert colors to RGB arrays
  let fromRgb: number[];
  let toRgb: number[];

  if (typeof from === "string") {
    if (from.startsWith("#")) {
      fromRgb = colors.hexToRGB(from);
    } else {
      // Named color, convert to number first
      const colorNum = colors.convert(from);
      fromRgb = colors.vcolors[colorNum] || [0, 0, 0];
    }
  } else {
    fromRgb = colors.vcolors[from] || [0, 0, 0];
  }

  if (typeof to === "string") {
    if (to.startsWith("#")) {
      toRgb = colors.hexToRGB(to);
    } else {
      const colorNum = colors.convert(to);
      toRgb = colors.vcolors[colorNum] || [0, 0, 0];
    }
  } else {
    toRgb = colors.vcolors[to] || [0, 0, 0];
  }

  const gradient: string[] = [];

  for (let i = 0; i < length; i++) {
    const ratio = length > 1 ? i / (length - 1) : 0;
    const r = Math.round(fromRgb[0] + (toRgb[0] - fromRgb[0]) * ratio);
    const g = Math.round(fromRgb[1] + (toRgb[1] - fromRgb[1]) * ratio);
    const b = Math.round(fromRgb[2] + (toRgb[2] - fromRgb[2]) * ratio);
    gradient.push(rgbToHex(r, g, b));
  }

  return gradient;
}

/**
 * Rotate a color array (for animations)
 * Shifts colors by specified number of steps (positive = right, negative = left)
 *
 * @param colorArray - Array of colors to rotate
 * @param steps - Number of positions to rotate (default: 1)
 * @returns New rotated array (does not mutate original)
 *
 * @example
 * const rotated = rotateColors(["red", "cyan", "yellow"], 1);
 * // Result: ["yellow", "red", "cyan"]
 */
export function rotateColors(
  colorArray: (string | number)[],
  steps: number = 1,
): (string | number)[] {
  if (colorArray.length === 0) return [];

  // Normalize steps to be within array bounds
  const normalizedSteps =
    ((steps % colorArray.length) + colorArray.length) % colorArray.length;

  // Optimized rotation using slice (O(n) instead of O(n * steps))
  if (normalizedSteps === 0) return [...colorArray];

  const splitPoint = colorArray.length - normalizedSteps;
  return [...colorArray.slice(splitPoint), ...colorArray.slice(0, splitPoint)];
}
