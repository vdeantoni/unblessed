/**
 * braille-canvas.ts - High-resolution pixel canvas using braille characters
 *
 * Provides a high-resolution canvas using braille Unicode characters (U+2800 - U+28FF).
 * Each braille character represents a 2×4 pixel grid, giving 4× the resolution
 * of character-based rendering.
 *
 * Resolution: 2×4 pixels per character (effective 4× resolution boost)
 * Storage: Bit flags in byte array (compact and efficient)
 *
 * Perfect for: Charts, graphs, sparklines, waveforms, data visualization
 *
 * This is a UNIQUE DIFFERENTIATOR - Ink doesn't have this capability!
 */

import type { BoxOptions } from "../types/index.js";
import { Box } from "./box.js";

/**
 * BrailleCanvas options
 */
export interface BrailleCanvasOptions extends BoxOptions {
  /**
   * Canvas width in characters (pixel width will be width × 2)
   */
  width: number;

  /**
   * Canvas height in characters (pixel height will be height × 4)
   */
  height: number;
}

/**
 * BrailleCanvas Widget
 *
 * High-resolution pixel canvas using braille characters for data visualization.
 * Achieves 4× higher resolution than character-based rendering.
 *
 * Each character cell contains a 2×4 pixel grid using braille Unicode:
 * - Character width: 40  → Pixel width: 80
 * - Character height: 12 → Pixel height: 48
 *
 * Perfect for charts, graphs, sparklines, and data visualization.
 *
 * @example
 * ```ts
 * const canvas = new BrailleCanvas({
 *   parent: screen,
 *   width: 40,   // 80 pixels wide
 *   height: 12,  // 48 pixels tall
 *   border: 1
 * });
 *
 * // Draw a line chart
 * for (let i = 0; i < data.length - 1; i++) {
 *   const x1 = i * 2;
 *   const y1 = data[i];
 *   const x2 = (i + 1) * 2;
 *   const y2 = data[i + 1];
 *   canvas.drawLine(x1, y1, x2, y2);
 * }
 *
 * screen.render();
 * ```
 */
export class BrailleCanvas extends Box {
  override type = "braillecanvas";
  private buffer: Uint8Array;
  private charWidth: number;
  private charHeight: number;
  private pixelWidth: number;
  private pixelHeight: number;

  // Braille dot mapping (2×4 grid)
  // Unicode braille pattern: U+2800 + bit pattern
  private static readonly BRAILLE_MAP = [
    [0x1, 0x8], // Top row (dots 1, 4)
    [0x2, 0x10], // Second row (dots 2, 5)
    [0x4, 0x20], // Third row (dots 3, 6)
    [0x40, 0x80], // Bottom row (dots 7, 8)
  ];

  constructor(options: BrailleCanvasOptions) {
    super(options);

    // Calculate actual canvas dimensions (accounting for borders and padding)
    let charWidth = options.width;
    let charHeight = options.height;

    // Account for border
    if (this.border) {
      charWidth -= 2;
      charHeight -= 2;
    }

    // Account for padding (only if padding values are set)
    if (
      this.padding &&
      (this.padding.left > 0 ||
        this.padding.right > 0 ||
        this.padding.top > 0 ||
        this.padding.bottom > 0)
    ) {
      charWidth -= this.padding.left + this.padding.right;
      charHeight -= this.padding.top + this.padding.bottom;
    }

    this.charWidth = Math.max(1, charWidth);
    this.charHeight = Math.max(1, charHeight);

    // Pixel dimensions (2×4 per character)
    this.pixelWidth = this.charWidth * 2;
    this.pixelHeight = this.charHeight * 4;

    // Byte buffer for braille encoding
    this.buffer = new Uint8Array(this.charWidth * this.charHeight);
    this.clear();
  }

  /**
   * Set a pixel at specific position
   *
   * @param x - X coordinate (0 to pixelWidth-1)
   * @param y - Y coordinate (0 to pixelHeight-1)
   *
   * @example
   * ```ts
   * canvas.setPixel(10, 5);
   * ```
   */
  setPixel(x: number, y: number): void {
    if (x < 0 || x >= this.pixelWidth || y < 0 || y >= this.pixelHeight) {
      return;
    }

    x = Math.floor(x);
    y = Math.floor(y);

    // Map pixel to character position
    const charX = Math.floor(x / 2);
    const charY = Math.floor(y / 4);
    const coord = charX + this.charWidth * charY;

    // Map pixel to dot within character
    const dotX = x % 2;
    const dotY = y % 4;
    const mask = BrailleCanvas.BRAILLE_MAP[dotY][dotX];

    // Set bit
    this.buffer[coord] |= mask;
  }

  /**
   * Unset a pixel at specific position
   *
   * @param x - X coordinate
   * @param y - Y coordinate
   *
   * @example
   * ```ts
   * canvas.unsetPixel(10, 5);
   * ```
   */
  unsetPixel(x: number, y: number): void {
    if (x < 0 || x >= this.pixelWidth || y < 0 || y >= this.pixelHeight) {
      return;
    }

    x = Math.floor(x);
    y = Math.floor(y);

    const charX = Math.floor(x / 2);
    const charY = Math.floor(y / 4);
    const coord = charX + this.charWidth * charY;

    const dotX = x % 2;
    const dotY = y % 4;
    const mask = BrailleCanvas.BRAILLE_MAP[dotY][dotX];

    // Clear bit
    this.buffer[coord] &= ~mask;
  }

  /**
   * Toggle a pixel at specific position
   *
   * @param x - X coordinate
   * @param y - Y coordinate
   *
   * @example
   * ```ts
   * canvas.togglePixel(10, 5);
   * ```
   */
  togglePixel(x: number, y: number): void {
    if (x < 0 || x >= this.pixelWidth || y < 0 || y >= this.pixelHeight) {
      return;
    }

    x = Math.floor(x);
    y = Math.floor(y);

    const charX = Math.floor(x / 2);
    const charY = Math.floor(y / 4);
    const coord = charX + this.charWidth * charY;

    const dotX = x % 2;
    const dotY = y % 4;
    const mask = BrailleCanvas.BRAILLE_MAP[dotY][dotX];

    // Toggle bit
    this.buffer[coord] ^= mask;
  }

  /**
   * Check if a pixel is set
   *
   * @param x - X coordinate
   * @param y - Y coordinate
   * @returns True if pixel is set
   */
  getPixel(x: number, y: number): boolean {
    if (x < 0 || x >= this.pixelWidth || y < 0 || y >= this.pixelHeight) {
      return false;
    }

    x = Math.floor(x);
    y = Math.floor(y);

    const charX = Math.floor(x / 2);
    const charY = Math.floor(y / 4);
    const coord = charX + this.charWidth * charY;

    const dotX = x % 2;
    const dotY = y % 4;
    const mask = BrailleCanvas.BRAILLE_MAP[dotY][dotX];

    return (this.buffer[coord] & mask) !== 0;
  }

  /**
   * Clear canvas
   *
   * @example
   * ```ts
   * canvas.clear();
   * ```
   */
  clear(): void {
    this.buffer.fill(0);
  }

  /**
   * Draw a smooth line using Bresenham's algorithm
   *
   * @param x0 - Start X (pixel coordinate)
   * @param y0 - Start Y (pixel coordinate)
   * @param x1 - End X (pixel coordinate)
   * @param y1 - End Y (pixel coordinate)
   *
   * @example
   * ```ts
   * canvas.drawLine(0, 0, 80, 48);
   * ```
   */
  drawLine(x0: number, y0: number, x1: number, y1: number): void {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    let x = x0;
    let y = y0;

    while (true) {
      this.setPixel(x, y);

      if (x === x1 && y === y1) break;

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
  }

  /**
   * Draw a rectangle
   *
   * @param x - Top-left X (pixel coordinate)
   * @param y - Top-left Y (pixel coordinate)
   * @param width - Rectangle width in pixels
   * @param height - Rectangle height in pixels
   * @param fill - Whether to fill the rectangle (default: false)
   *
   * @example
   * ```ts
   * canvas.drawRect(10, 10, 20, 15, false); // Outline
   * canvas.drawRect(10, 10, 20, 15, true);  // Filled
   * ```
   */
  drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    fill: boolean = false,
  ): void {
    if (fill) {
      for (let cy = y; cy < y + height; cy++) {
        for (let cx = x; cx < x + width; cx++) {
          this.setPixel(cx, cy);
        }
      }
    } else {
      // Draw outline
      this.drawLine(x, y, x + width - 1, y);
      this.drawLine(x + width - 1, y, x + width - 1, y + height - 1);
      this.drawLine(x + width - 1, y + height - 1, x, y + height - 1);
      this.drawLine(x, y + height - 1, x, y);
    }
  }

  /**
   * Draw a circle using midpoint circle algorithm
   *
   * @param cx - Center X (pixel coordinate)
   * @param cy - Center Y (pixel coordinate)
   * @param radius - Circle radius in pixels
   * @param fill - Whether to fill the circle (default: false)
   *
   * @example
   * ```ts
   * canvas.drawCircle(40, 24, 15, false); // Outline
   * canvas.drawCircle(40, 24, 15, true);  // Filled
   * ```
   */
  drawCircle(
    cx: number,
    cy: number,
    radius: number,
    fill: boolean = false,
  ): void {
    if (fill) {
      for (let y = -radius; y <= radius; y++) {
        for (let x = -radius; x <= radius; x++) {
          if (x * x + y * y <= radius * radius) {
            this.setPixel(cx + x, cy + y);
          }
        }
      }
    } else {
      let x = radius;
      let y = 0;
      let err = 0;

      while (x >= y) {
        this.setPixel(cx + x, cy + y);
        this.setPixel(cx + y, cy + x);
        this.setPixel(cx - y, cy + x);
        this.setPixel(cx - x, cy + y);
        this.setPixel(cx - x, cy - y);
        this.setPixel(cx - y, cy - x);
        this.setPixel(cx + y, cy - x);
        this.setPixel(cx + x, cy - y);

        if (err <= 0) {
          y += 1;
          err += 2 * y + 1;
        }
        if (err > 0) {
          x -= 1;
          err -= 2 * x + 1;
        }
      }
    }
  }

  /**
   * Plot a function over a range
   *
   * @param fn - Function to plot (x => y)
   * @param x0 - Start X value
   * @param x1 - End X value
   * @param scaleX - X scale factor (default: 1)
   * @param scaleY - Y scale factor (default: 1)
   * @param offsetY - Y offset (default: pixelHeight/2)
   *
   * @example
   * ```ts
   * // Plot sine wave
   * canvas.plotFunction(
   *   (x) => Math.sin(x),
   *   0,
   *   Math.PI * 2,
   *   10,
   *   10,
   *   24
   * );
   * ```
   */
  plotFunction(
    fn: (x: number) => number,
    x0: number,
    x1: number,
    scaleX: number = 1,
    scaleY: number = 1,
    offsetY: number = this.pixelHeight / 2,
  ): void {
    const steps = this.pixelWidth;
    const dx = (x1 - x0) / steps;

    for (let i = 0; i < steps - 1; i++) {
      const x1Val = x0 + i * dx;
      const x2Val = x0 + (i + 1) * dx;

      const y1Val = fn(x1Val);
      const y2Val = fn(x2Val);

      const px1 = Math.round(i * scaleX);
      const py1 = Math.round(offsetY - y1Val * scaleY);
      const px2 = Math.round((i + 1) * scaleX);
      const py2 = Math.round(offsetY - y2Val * scaleY);

      this.drawLine(px1, py1, px2, py2);
    }
  }

  /**
   * Get pixel dimensions
   *
   * @returns { width, height } in pixels
   */
  getPixelDimensions(): { width: number; height: number } {
    return {
      width: this.pixelWidth,
      height: this.pixelHeight,
    };
  }

  /**
   * Get character dimensions
   *
   * @returns { width, height } in characters
   */
  getCharDimensions(): { width: number; height: number } {
    return {
      width: this.charWidth,
      height: this.charHeight,
    };
  }

  /**
   * Render canvas to screen
   * Overrides Box.render() to convert buffer to braille characters
   */
  override render(): any {
    const ret = super.render();
    if (!ret) return;

    let xi = ret.xi;
    let yi = ret.yi;

    if (this.border) {
      xi++;
      yi++;
    }

    // Convert buffer to braille characters and write to screen
    for (
      let y = 0;
      y < this.charHeight && yi + y < this.screen.lines.length;
      y++
    ) {
      const line = this.screen.lines[yi + y];
      for (let x = 0; x < this.charWidth && xi + x < line.length; x++) {
        const byte = this.buffer[x + this.charWidth * y];
        // Convert to braille Unicode (U+2800 base + bit pattern)
        const char = byte ? String.fromCharCode(0x2800 + byte) : " ";
        line[xi + x][1] = char;
      }
      line.dirty = true;
    }

    return ret;
  }
}

export default BrailleCanvas;
