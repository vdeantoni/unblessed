/**
 * Tests for makeAnimatable mixin
 */

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { generateRainbow, rotateColors } from "../../src/lib/border-colors.js";
import { makeAnimatable } from "../../src/mixins/animatable.js";
import { Box } from "../../src/widgets/box.js";
import { Screen } from "../../src/widgets/screen.js";
import { initTestRuntime } from "../helpers/mock.js";

describe("makeAnimatable mixin", () => {
  let screen: Screen;

  beforeAll(() => {
    initTestRuntime();
  });

  beforeEach(() => {
    screen = new Screen({
      width: 80,
      height: 24,
      smartCSR: true,
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    screen.destroy();
    vi.restoreAllMocks();
  });

  it("should add animatable flag and methods to element", () => {
    const box = new Box({
      parent: screen,
      border: { type: "line" },
      width: 20,
      height: 10,
      animatable: true,
    });

    expect(box.animatable).toBe(true);
    expect(typeof box.animateBorderColors).toBe("function");
    expect(typeof box.pulse).toBe("function");
  });

  it("should not add methods if animatable is false", () => {
    const box = new Box({
      parent: screen,
      border: { type: "line" },
      width: 20,
      height: 10,
      animatable: false,
    });

    expect(box.animatable).toBeUndefined();
    expect(box.animateBorderColors).toBeUndefined();
  });

  it("should allow manual makeAnimatable call", () => {
    const box = new Box({
      parent: screen,
      border: { type: "line" },
      width: 20,
      height: 10,
    });

    expect(box.animateBorderColors).toBeUndefined();

    makeAnimatable(box);

    expect(box.animatable).toBe(true);
    expect(typeof box.animateBorderColors).toBe("function");
  });

  describe("animateBorderColors", () => {
    it("should animate border colors using generator function", () => {
      const box = new Box({
        parent: screen,
        border: { type: "line" },
        width: 20,
        height: 10,
        animatable: true,
      });

      const renderSpy = vi.spyOn(screen, "render");
      let frameCount = 0;

      const stop = box.animateBorderColors!(
        (length, frame) => {
          frameCount = frame;
          const colors = generateRainbow(length);
          return rotateColors(colors, frame);
        },
        { fps: 30 },
      );

      // Advance enough time for at least one frame to fire
      vi.advanceTimersByTime((1000 / 30) * 2);

      // Should have called the generator at least once
      expect(frameCount).toBeGreaterThan(0);
      expect(renderSpy).toHaveBeenCalled();
      expect(box.getBorderColors().length).toBeGreaterThan(0);

      stop();
      renderSpy.mockRestore();
    });

    it("should stop animation when stop function is called", () => {
      const box = new Box({
        parent: screen,
        border: { type: "line" },
        width: 20,
        height: 10,
        animatable: true,
      });

      const renderSpy = vi.spyOn(screen, "render");
      let callCount = 0;

      const stop = box.animateBorderColors!(
        () => {
          callCount++;
          return ["red", "green", "blue"];
        },
        { fps: 30 },
      );

      vi.advanceTimersByTime(1000 / 30);
      expect(callCount).toBe(1);

      stop();

      vi.advanceTimersByTime(1000 / 30);
      expect(callCount).toBe(1); // Should not increase after stop

      renderSpy.mockRestore();
    });
  });

  describe("pulse", () => {
    it("should pulse foreground color", () => {
      const box = new Box({
        parent: screen,
        width: 20,
        height: 10,
        animatable: true,
      });

      const originalFg = box.style.fg;
      const stop = box.pulse!("fg", ["red", "yellow", "green"], {
        duration: 1000,
        fps: 30,
      });

      // Advance through animation
      vi.advanceTimersByTime(1000 / 30);
      expect(box.style.fg).toBe("red");

      stop();
      expect(box.style.fg).toBe(originalFg); // Restored
    });

    it("should pulse dim property", () => {
      const box = new Box({
        parent: screen,
        width: 20,
        height: 10,
        animatable: true,
      });

      box.style.dim = false;
      const originalDim = box.style.dim;

      const stop = box.pulse!("dim", [false, true, false], {
        duration: 300,
        fps: 30,
      });

      vi.advanceTimersByTime(1000 / 30);
      expect(typeof box.style.dim).toBe("boolean");

      stop();
      expect(box.style.dim).toBe(originalDim);
    });

    it("should cycle through all values", () => {
      const box = new Box({
        parent: screen,
        width: 20,
        height: 10,
        animatable: true,
      });

      const colors = ["red", "yellow", "green", "blue"];
      const observedColors = new Set<string>();

      const stop = box.pulse!("fg", colors, { duration: 400, fps: 30 });

      // Observe colors over multiple frames
      for (let i = 0; i < 10; i++) {
        vi.advanceTimersByTime(1000 / 30);
        if (typeof box.style.fg === "string") {
          observedColors.add(box.style.fg);
        }
      }

      expect(observedColors.size).toBeGreaterThan(1);
      stop();
    });
  });
});
