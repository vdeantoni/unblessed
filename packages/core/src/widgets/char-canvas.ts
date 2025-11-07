/**
 * char-canvas.ts - Character-based canvas widget for text animations
 *
 * Provides a canvas for character-level drawing and animations.
 * Perfect for Matrix rain, falling text, ASCII art animations, etc.
 *
 * Resolution: 1:1 (one character per cell)
 * Storage: Array of [attr, char] pairs
 */

import type { BoxOptions } from "../types/index.js";
import { Box } from "./box.js";

/**
 * CharCanvas options
 */
export interface CharCanvasOptions extends BoxOptions {
  /**
   * Canvas width in characters
   */
  width: number;

  /**
   * Canvas height in characters
   */
  height: number;
}

/**
 * CharCanvas Widget
 *
 * A character-based canvas for text animations and effects.
 * Each cell can be individually addressed with a character and attributes.
 *
 * @example
 * ```ts
 * const canvas = new CharCanvas({
 *   parent: screen,
 *   width: 80,
 *   height: 24,
 *   top: 0,
 *   left: 0
 * });
 *
 * // Set individual cells
 * canvas.setCell(10, 5, 'X', 0);
 *
 * // Draw a line
 * canvas.drawLine(0, 0, 10, 10, '*', 0);
 *
 * // Render to screen
 * screen.render();
 * ```
 */
export class CharCanvas extends Box {
  override type = "charcanvas";
  private buffer: Array<Array<[number, string]>>;
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(options: CharCanvasOptions) {
    super(options);

    // Calculate actual canvas dimensions (accounting for borders and padding)
    let canvasWidth = options.width;
    let canvasHeight = options.height;

    // Account for border
    if (this.border) {
      canvasWidth -= 2;
      canvasHeight -= 2;
    }

    // Account for padding (only if padding values are set)
    if (
      this.padding &&
      (this.padding.left > 0 ||
        this.padding.right > 0 ||
        this.padding.top > 0 ||
        this.padding.bottom > 0)
    ) {
      canvasWidth -= this.padding.left + this.padding.right;
      canvasHeight -= this.padding.top + this.padding.bottom;
    }

    this.canvasWidth = Math.max(1, canvasWidth);
    this.canvasHeight = Math.max(1, canvasHeight);

    // Initialize buffer: [attr, char]
    // Note: Using .map() to create unique array instances for each cell
    this.buffer = Array(this.canvasHeight)
      .fill(null)
      .map(() =>
        Array(this.canvasWidth)
          .fill(null)
          .map(() => [0, " "]),
      );
  }

  /**
   * Set a character at specific position
   *
   * @param x - X coordinate (column)
   * @param y - Y coordinate (row)
   * @param char - Character to display
   * @param attr - Terminal attribute code
   *
   * @example
   * ```ts
   * canvas.setCell(10, 5, 'X', 0);
   * ```
   */
  setCell(x: number, y: number, char: string, attr: number): void {
    if (x >= 0 && x < this.canvasWidth && y >= 0 && y < this.canvasHeight) {
      this.buffer[y][x] = [attr, char];
    }
  }

  /**
   * Get a character at specific position
   *
   * @param x - X coordinate (column)
   * @param y - Y coordinate (row)
   * @returns [attr, char] tuple or null if out of bounds
   *
   * @example
   * ```ts
   * const [attr, char] = canvas.getCell(10, 5);
   * ```
   */
  getCell(x: number, y: number): [number, string] | null {
    if (x >= 0 && x < this.canvasWidth && y >= 0 && y < this.canvasHeight) {
      return this.buffer[y][x];
    }
    return null;
  }

  /**
   * Clear canvas
   *
   * @param char - Character to fill with (default: space)
   * @param attr - Attribute to use (default: 0)
   *
   * @example
   * ```ts
   * canvas.clear();
   * canvas.clear('.', 0); // Fill with dots
   * ```
   */
  clear(char: string = " ", attr: number = 0): void {
    for (let y = 0; y < this.canvasHeight; y++) {
      for (let x = 0; x < this.canvasWidth; x++) {
        this.buffer[y][x] = [attr, char];
      }
    }
  }

  /**
   * Get the actual canvas width (accounting for borders/padding)
   * @returns Canvas width in characters
   */
  getCanvasWidth(): number {
    return this.canvasWidth;
  }

  /**
   * Get the actual canvas height (accounting for borders/padding)
   * @returns Canvas height in characters
   */
  getCanvasHeight(): number {
    return this.canvasHeight;
  }

  /**
   * Draw a line of characters using Bresenham's algorithm
   *
   * @param x0 - Start X
   * @param y0 - Start Y
   * @param x1 - End X
   * @param y1 - End Y
   * @param char - Character to draw with
   * @param attr - Attribute to use
   *
   * @example
   * ```ts
   * canvas.drawLine(0, 0, 10, 10, '*', 0);
   * ```
   */
  drawLine(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    char: string,
    attr: number,
  ): void {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    let x = x0;
    let y = y0;

    while (true) {
      this.setCell(x, y, char, attr);

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
   * @param x - Top-left X
   * @param y - Top-left Y
   * @param width - Rectangle width
   * @param height - Rectangle height
   * @param char - Character to draw with
   * @param attr - Attribute to use
   * @param fill - Whether to fill the rectangle (default: false)
   *
   * @example
   * ```ts
   * // Draw outline
   * canvas.drawRect(5, 5, 10, 5, '#', 0, false);
   *
   * // Draw filled
   * canvas.drawRect(5, 5, 10, 5, '#', 0, true);
   * ```
   */
  drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    char: string,
    attr: number,
    fill: boolean = false,
  ): void {
    if (fill) {
      for (let cy = y; cy < y + height; cy++) {
        for (let cx = x; cx < x + width; cx++) {
          this.setCell(cx, cy, char, attr);
        }
      }
    } else {
      // Top and bottom
      for (let cx = x; cx < x + width; cx++) {
        this.setCell(cx, y, char, attr);
        this.setCell(cx, y + height - 1, char, attr);
      }
      // Left and right
      for (let cy = y; cy < y + height; cy++) {
        this.setCell(x, cy, char, attr);
        this.setCell(x + width - 1, cy, char, attr);
      }
    }
  }

  /**
   * Draw text at position
   *
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param text - Text to draw
   * @param attr - Attribute to use
   *
   * @example
   * ```ts
   * canvas.drawText(10, 5, 'Hello World', 0);
   * ```
   */
  drawText(x: number, y: number, text: string, attr: number): void {
    for (let i = 0; i < text.length; i++) {
      this.setCell(x + i, y, text[i], attr);
    }
  }

  /**
   * Render canvas to screen
   * Overrides Box.render() to draw buffer contents
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

    // Get default attribute from style (for cells with attr === 0)
    const defaultAttr = this.sattr(this.style);

    // Write buffer to screen lines
    for (
      let y = 0;
      y < this.canvasHeight && yi + y < this.screen.lines.length;
      y++
    ) {
      const line = this.screen.lines[yi + y];
      for (let x = 0; x < this.canvasWidth && xi + x < line.length; x++) {
        const [attr, char] = this.buffer[y][x];
        // Use element's style when attr is 0, otherwise use provided attr
        line[xi + x][0] = attr === 0 ? defaultAttr : attr;
        line[xi + x][1] = char;
      }
      line.dirty = true;
    }

    return ret;
  }
}

export default CharCanvas;
