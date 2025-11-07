/**
 * Tests for BrailleCanvas widget
 */

import { beforeAll, describe, expect, it } from "vitest";
import { BrailleCanvas } from "../../src/widgets/braille-canvas.js";
import { Screen } from "../../src/widgets/screen.js";
import { initTestRuntime } from "../helpers/mock.js";

describe("BrailleCanvas", () => {
  beforeAll(() => {
    initTestRuntime();
  });

  it("should create BrailleCanvas with correct dimensions", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new BrailleCanvas({
      parent: screen,
      width: 40, // Characters
      height: 12, // Characters
    });

    expect(canvas.type).toBe("braillecanvas");

    const pixelDims = canvas.getPixelDimensions();
    expect(pixelDims.width).toBe(80); // 40 * 2
    expect(pixelDims.height).toBe(48); // 12 * 4

    const charDims = canvas.getCharDimensions();
    expect(charDims.width).toBe(40);
    expect(charDims.height).toBe(12);

    screen.destroy();
  });

  it("should set and get pixels", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new BrailleCanvas({
      parent: screen,
      width: 40,
      height: 12,
    });

    expect(canvas.getPixel(10, 10)).toBe(false);

    canvas.setPixel(10, 10);
    expect(canvas.getPixel(10, 10)).toBe(true);

    canvas.unsetPixel(10, 10);
    expect(canvas.getPixel(10, 10)).toBe(false);

    screen.destroy();
  });

  it("should toggle pixels", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new BrailleCanvas({
      parent: screen,
      width: 40,
      height: 12,
    });

    expect(canvas.getPixel(5, 5)).toBe(false);

    canvas.togglePixel(5, 5);
    expect(canvas.getPixel(5, 5)).toBe(true);

    canvas.togglePixel(5, 5);
    expect(canvas.getPixel(5, 5)).toBe(false);

    screen.destroy();
  });

  it("should handle out of bounds pixels gracefully", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new BrailleCanvas({
      parent: screen,
      width: 10,
      height: 10,
    });

    // Should not throw
    expect(() => canvas.setPixel(-1, 5)).not.toThrow();
    expect(() => canvas.setPixel(5, -1)).not.toThrow();
    expect(() => canvas.setPixel(100, 5)).not.toThrow();
    expect(() => canvas.setPixel(5, 100)).not.toThrow();

    expect(canvas.getPixel(-1, 5)).toBe(false);
    expect(canvas.getPixel(5, -1)).toBe(false);
    expect(canvas.getPixel(100, 5)).toBe(false);

    screen.destroy();
  });

  it("should clear canvas", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new BrailleCanvas({
      parent: screen,
      width: 10,
      height: 10,
    });

    canvas.setPixel(5, 5);
    canvas.setPixel(6, 6);
    canvas.setPixel(7, 7);

    canvas.clear();

    expect(canvas.getPixel(5, 5)).toBe(false);
    expect(canvas.getPixel(6, 6)).toBe(false);
    expect(canvas.getPixel(7, 7)).toBe(false);

    screen.destroy();
  });

  it("should draw horizontal line", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new BrailleCanvas({
      parent: screen,
      width: 20,
      height: 20,
    });

    canvas.drawLine(0, 10, 20, 10);

    // Check points on the line
    for (let x = 0; x <= 20; x++) {
      expect(canvas.getPixel(x, 10)).toBe(true);
    }

    screen.destroy();
  });

  it("should draw vertical line", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new BrailleCanvas({
      parent: screen,
      width: 20,
      height: 20,
    });

    canvas.drawLine(10, 0, 10, 20);

    for (let y = 0; y <= 20; y++) {
      expect(canvas.getPixel(10, y)).toBe(true);
    }

    screen.destroy();
  });

  it("should draw diagonal line", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new BrailleCanvas({
      parent: screen,
      width: 20,
      height: 20,
    });

    canvas.drawLine(0, 0, 20, 20);

    // Check endpoints and some intermediate points
    expect(canvas.getPixel(0, 0)).toBe(true);
    expect(canvas.getPixel(10, 10)).toBe(true);
    expect(canvas.getPixel(20, 20)).toBe(true);

    screen.destroy();
  });

  it("should draw unfilled rectangle", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new BrailleCanvas({
      parent: screen,
      width: 40,
      height: 40,
    });

    canvas.drawRect(10, 10, 20, 15, false);

    // Check corners
    expect(canvas.getPixel(10, 10)).toBe(true); // Top-left
    expect(canvas.getPixel(29, 10)).toBe(true); // Top-right
    expect(canvas.getPixel(10, 24)).toBe(true); // Bottom-left
    expect(canvas.getPixel(29, 24)).toBe(true); // Bottom-right

    // Check center is empty
    expect(canvas.getPixel(20, 17)).toBe(false);

    screen.destroy();
  });

  it("should draw filled rectangle", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new BrailleCanvas({
      parent: screen,
      width: 40,
      height: 40,
    });

    canvas.drawRect(10, 10, 10, 10, true);

    // Check all pixels in rectangle
    for (let y = 10; y < 20; y++) {
      for (let x = 10; x < 20; x++) {
        expect(canvas.getPixel(x, y)).toBe(true);
      }
    }

    screen.destroy();
  });

  it("should draw circle outline", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new BrailleCanvas({
      parent: screen,
      width: 40,
      height: 40,
    });

    canvas.drawCircle(40, 40, 10, false);

    // Check that pixels are set around the circle
    // (exact pixel positions depend on the midpoint circle algorithm)
    expect(canvas.getPixel(50, 40)).toBe(true); // Right
    expect(canvas.getPixel(30, 40)).toBe(true); // Left
    expect(canvas.getPixel(40, 30)).toBe(true); // Top
    expect(canvas.getPixel(40, 50)).toBe(true); // Bottom

    screen.destroy();
  });

  it("should draw filled circle", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new BrailleCanvas({
      parent: screen,
      width: 40,
      height: 40,
    });

    const cx = 40;
    const cy = 40;
    const radius = 5;

    canvas.drawCircle(cx, cy, radius, true);

    // Check center is filled
    expect(canvas.getPixel(cx, cy)).toBe(true);

    // Check points within radius are filled
    expect(canvas.getPixel(cx + 3, cy)).toBe(true);
    expect(canvas.getPixel(cx, cy + 3)).toBe(true);

    screen.destroy();
  });

  it("should plot function", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new BrailleCanvas({
      parent: screen,
      width: 40,
      height: 20,
    });

    // Plot a simple linear function
    canvas.plotFunction((x) => x, 0, 10, 1, 1, 40);

    // Just verify no errors and some pixels are set
    const dims = canvas.getPixelDimensions();
    let pixelsSet = 0;
    for (let x = 0; x < dims.width; x++) {
      for (let y = 0; y < dims.height; y++) {
        if (canvas.getPixel(x, y)) pixelsSet++;
      }
    }

    expect(pixelsSet).toBeGreaterThan(0);

    screen.destroy();
  });

  it("should handle fractional pixel coordinates", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new BrailleCanvas({
      parent: screen,
      width: 20,
      height: 20,
    });

    // Should floor coordinates
    canvas.setPixel(5.7, 10.2);
    expect(canvas.getPixel(5, 10)).toBe(true);
    expect(canvas.getPixel(6, 10)).toBe(false);

    screen.destroy();
  });

  it("should render braille characters to screen", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new BrailleCanvas({
      parent: screen,
      width: 10,
      height: 5,
      top: 2,
      left: 5,
    });

    // Set some pixels
    canvas.setPixel(0, 0);
    canvas.setPixel(1, 1);
    canvas.setPixel(2, 2);

    // Allocate screen buffer before rendering
    screen.alloc();
    screen.render();

    // Check that pixels were set correctly
    expect(canvas.getPixel(0, 0)).toBe(true);
    expect(canvas.getPixel(1, 1)).toBe(true);
    expect(canvas.getPixel(2, 2)).toBe(true);

    // Check canvas dimensions (no border, so 10x5 chars = 20x20 pixels)
    const pixelDims = canvas.getPixelDimensions();
    expect(pixelDims.width).toBe(20);
    expect(pixelDims.height).toBe(20);

    screen.destroy();
  });

  it("should use braille blank for empty cells", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new BrailleCanvas({
      parent: screen,
      width: 10,
      height: 5,
      top: 0,
      left: 0,
    });

    screen.render();

    // Empty cells should render as space
    const line = screen.lines[0];
    expect(line[0][1]).toBe(" ");

    screen.destroy();
  });
});
