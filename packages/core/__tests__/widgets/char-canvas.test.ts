/**
 * Tests for CharCanvas widget
 */

import { beforeAll, describe, expect, it } from "vitest";
import { CharCanvas } from "../../src/widgets/char-canvas.js";
import { Screen } from "../../src/widgets/screen.js";
import { initTestRuntime } from "../helpers/mock.js";

describe("CharCanvas", () => {
  beforeAll(() => {
    initTestRuntime();
  });

  it("should create CharCanvas with specified dimensions", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new CharCanvas({
      parent: screen,
      width: 40,
      height: 20,
    });

    expect(canvas.type).toBe("charcanvas");
    expect(canvas["canvasWidth"]).toBe(40);
    expect(canvas["canvasHeight"]).toBe(20);
    expect(canvas["buffer"].length).toBe(20);
    expect(canvas["buffer"][0].length).toBe(40);

    screen.destroy();
  });

  it("should set and get cells", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new CharCanvas({
      parent: screen,
      width: 10,
      height: 10,
    });

    canvas.setCell(5, 5, "X", 0);
    const cell = canvas.getCell(5, 5);

    expect(cell).toEqual([0, "X"]);

    screen.destroy();
  });

  it("should return null for out of bounds cells", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new CharCanvas({
      parent: screen,
      width: 10,
      height: 10,
    });

    expect(canvas.getCell(-1, 5)).toBeNull();
    expect(canvas.getCell(5, -1)).toBeNull();
    expect(canvas.getCell(10, 5)).toBeNull();
    expect(canvas.getCell(5, 10)).toBeNull();

    screen.destroy();
  });

  it("should clear canvas", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new CharCanvas({
      parent: screen,
      width: 10,
      height: 10,
    });

    canvas.setCell(5, 5, "X", 0);
    canvas.clear();

    const cell = canvas.getCell(5, 5);
    expect(cell).toEqual([0, " "]);

    screen.destroy();
  });

  it("should clear with custom character", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new CharCanvas({
      parent: screen,
      width: 10,
      height: 10,
    });

    canvas.clear(".", 0);

    const cell = canvas.getCell(5, 5);
    expect(cell).toEqual([0, "."]);

    screen.destroy();
  });

  it("should draw horizontal line", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new CharCanvas({
      parent: screen,
      width: 20,
      height: 20,
    });

    canvas.drawLine(0, 5, 10, 5, "-", 0);

    // Check all points on the line
    for (let x = 0; x <= 10; x++) {
      const cell = canvas.getCell(x, 5);
      expect(cell).toEqual([0, "-"]);
    }

    screen.destroy();
  });

  it("should draw vertical line", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new CharCanvas({
      parent: screen,
      width: 20,
      height: 20,
    });

    canvas.drawLine(5, 0, 5, 10, "|", 0);

    for (let y = 0; y <= 10; y++) {
      const cell = canvas.getCell(5, y);
      expect(cell).toEqual([0, "|"]);
    }

    screen.destroy();
  });

  it("should draw diagonal line", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new CharCanvas({
      parent: screen,
      width: 20,
      height: 20,
    });

    canvas.drawLine(0, 0, 10, 10, "*", 0);

    // Check endpoints
    expect(canvas.getCell(0, 0)).toEqual([0, "*"]);
    expect(canvas.getCell(10, 10)).toEqual([0, "*"]);

    screen.destroy();
  });

  it("should draw unfilled rectangle", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new CharCanvas({
      parent: screen,
      width: 20,
      height: 20,
    });

    canvas.drawRect(2, 2, 6, 4, "#", 0, false);

    // Check corners
    expect(canvas.getCell(2, 2)).toEqual([0, "#"]); // Top-left
    expect(canvas.getCell(7, 2)).toEqual([0, "#"]); // Top-right
    expect(canvas.getCell(2, 5)).toEqual([0, "#"]); // Bottom-left
    expect(canvas.getCell(7, 5)).toEqual([0, "#"]); // Bottom-right

    // Check center is empty
    expect(canvas.getCell(4, 3)).toEqual([0, " "]);

    screen.destroy();
  });

  it("should draw filled rectangle", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new CharCanvas({
      parent: screen,
      width: 20,
      height: 20,
    });

    canvas.drawRect(2, 2, 6, 4, "#", 0, true);

    // Check all cells in rectangle are filled
    for (let y = 2; y < 6; y++) {
      for (let x = 2; x < 8; x++) {
        expect(canvas.getCell(x, y)).toEqual([0, "#"]);
      }
    }

    screen.destroy();
  });

  it("should draw text", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new CharCanvas({
      parent: screen,
      width: 20,
      height: 20,
    });

    canvas.drawText(5, 10, "Hello", 0);

    expect(canvas.getCell(5, 10)).toEqual([0, "H"]);
    expect(canvas.getCell(6, 10)).toEqual([0, "e"]);
    expect(canvas.getCell(7, 10)).toEqual([0, "l"]);
    expect(canvas.getCell(8, 10)).toEqual([0, "l"]);
    expect(canvas.getCell(9, 10)).toEqual([0, "o"]);

    screen.destroy();
  });

  it("should render canvas buffer to screen", () => {
    const screen = new Screen({ width: 80, height: 24 });
    const canvas = new CharCanvas({
      parent: screen,
      width: 10,
      height: 5,
      top: 2,
      left: 5,
    });

    canvas.setCell(3, 2, "X", 0);

    // Allocate screen buffer before rendering
    screen.alloc();
    screen.render();

    // Check that the canvas dimensions are correct (no border, so 10x5)
    expect(canvas.getCanvasWidth()).toBe(10);
    expect(canvas.getCanvasHeight()).toBe(5);

    // Check that the cell was set correctly
    const cell = canvas.getCell(3, 2);
    expect(cell).toEqual([0, "X"]);

    screen.destroy();
  });
});
