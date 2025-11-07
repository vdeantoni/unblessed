/**
 * Tests for Screen performance optimizations
 * Tests renderThrottled, beginBatch, endBatch, and setMaxFPS
 */

import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { Box } from "../../src/widgets/box.js";
import { Screen } from "../../src/widgets/screen.js";
import { initTestRuntime } from "../helpers/mock.js";

describe("Screen performance optimizations", () => {
  beforeAll(() => {
    initTestRuntime();
  });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("setMaxFPS", () => {
    it("should set maximum FPS", () => {
      const screen = new Screen({ width: 80, height: 24 });

      screen.setMaxFPS(30);
      expect(screen["_maxFPS"]).toBe(30);

      screen.setMaxFPS(60);
      expect(screen["_maxFPS"]).toBe(60);

      screen.destroy();
    });
  });

  describe("renderThrottled", () => {
    it("should queue a render", () => {
      const screen = new Screen({ width: 80, height: 24 });
      const renderSpy = vi.spyOn(screen, "render");

      screen.renderThrottled();

      expect(renderSpy).not.toHaveBeenCalled(); // Not immediate
      expect(screen["_renderQueued"]).toBe(true);

      vi.advanceTimersByTime(1000 / 60); // Default 60 FPS

      expect(renderSpy).toHaveBeenCalledTimes(1);
      expect(screen["_renderQueued"]).toBe(false);

      renderSpy.mockRestore();
      screen.destroy();
    });

    it("should not queue multiple renders", () => {
      const screen = new Screen({ width: 80, height: 24 });
      const renderSpy = vi.spyOn(screen, "render");

      screen.renderThrottled();
      screen.renderThrottled();
      screen.renderThrottled();

      vi.advanceTimersByTime(1000 / 60);

      expect(renderSpy).toHaveBeenCalledTimes(1); // Only one render

      renderSpy.mockRestore();
      screen.destroy();
    });

    it("should respect maxFPS setting", () => {
      const screen = new Screen({ width: 80, height: 24 });
      const renderSpy = vi.spyOn(screen, "render");

      screen.setMaxFPS(30);
      screen.renderThrottled();

      vi.advanceTimersByTime(1000 / 60); // Too soon for 30 FPS
      expect(renderSpy).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000 / 60); // Now it's been ~33ms (30 FPS)
      expect(renderSpy).toHaveBeenCalledTimes(1);

      renderSpy.mockRestore();
      screen.destroy();
    });

    it("should cancel queued renders", () => {
      const screen = new Screen({ width: 80, height: 24 });
      const renderSpy = vi.spyOn(screen, "render");

      screen.renderThrottled();
      expect(screen["_renderQueued"]).toBe(true);

      screen.cancelThrottledRender();
      expect(screen["_renderQueued"]).toBe(false);

      vi.advanceTimersByTime(1000 / 60);
      expect(renderSpy).not.toHaveBeenCalled();

      renderSpy.mockRestore();
      screen.destroy();
    });
  });

  describe("beginBatch / endBatch", () => {
    it("should defer rendering in batch mode", () => {
      const screen = new Screen({ width: 80, height: 24 });
      const renderSpy = vi.spyOn(screen, "render");

      screen.beginBatch();

      // Multiple render calls should be deferred
      screen.render();
      screen.render();
      screen.render();

      expect(renderSpy).toHaveBeenCalledTimes(3); // Called but returned early
      expect(screen["_batchRenderNeeded"]).toBe(true);

      renderSpy.mockRestore();
      screen.destroy();
    });

    it("should render once when batch ends", () => {
      const screen = new Screen({ width: 80, height: 24 });
      const box1 = new Box({ parent: screen, content: "Box 1" });
      const box2 = new Box({ parent: screen, content: "Box 2" });
      const box3 = new Box({ parent: screen, content: "Box 3" });

      let actualRenders = 0;
      const originalRender = screen.render.bind(screen);
      screen.render = function (this: Screen) {
        if (!this["_batchMode"]) {
          actualRenders++;
        }
        return originalRender();
      };

      screen.beginBatch();

      // Multiple updates
      box1.setContent("Updated 1");
      screen.render();
      box2.setContent("Updated 2");
      screen.render();
      box3.setContent("Updated 3");
      screen.render();

      expect(actualRenders).toBe(0); // No actual renders yet

      screen.endBatch();

      expect(actualRenders).toBe(1); // Only one render

      screen.destroy();
    });

    it("should not render if no updates during batch", () => {
      const screen = new Screen({ width: 80, height: 24 });
      let renderCount = 0;

      const originalRender = screen.render.bind(screen);
      screen.render = function (this: Screen) {
        if (!this["_batchMode"]) {
          renderCount++;
        }
        return originalRender();
      };

      screen.beginBatch();
      // No render calls
      screen.endBatch();

      expect(renderCount).toBe(0);

      screen.destroy();
    });

    it("should allow nested batch operations", () => {
      const screen = new Screen({ width: 80, height: 24 });
      let renderCount = 0;

      const originalRender = screen.render.bind(screen);
      screen.render = function (this: Screen) {
        if (!this["_batchMode"]) {
          renderCount++;
        }
        return originalRender();
      };

      screen.beginBatch();
      screen.render();
      screen.beginBatch(); // Nested
      screen.render();
      screen.endBatch(); // Still in batch mode
      expect(renderCount).toBe(0);

      screen.endBatch(); // Exit batch mode
      expect(renderCount).toBe(1);

      screen.destroy();
    });
  });

  describe("integration", () => {
    it("should improve performance with batch updates", () => {
      const screen = new Screen({ width: 80, height: 24 });
      const boxes: Box[] = [];

      // Create many boxes
      for (let i = 0; i < 50; i++) {
        boxes.push(
          new Box({
            parent: screen,
            content: `Box ${i}`,
          }),
        );
      }

      let renderCount = 0;
      const originalRender = screen.render.bind(screen);
      screen.render = function (this: Screen) {
        if (!this["_batchMode"]) {
          renderCount++;
        }
        return originalRender();
      };

      // Without batch - 50 renders
      boxes.forEach((box, i) => {
        box.setContent(`Updated ${i}`);
        screen.render();
      });

      expect(renderCount).toBe(50);

      // Reset
      renderCount = 0;

      // With batch - 1 render
      screen.beginBatch();
      boxes.forEach((box, i) => {
        box.setContent(`Updated again ${i}`);
        screen.render();
      });
      screen.endBatch();

      expect(renderCount).toBe(1);

      screen.destroy();
    });
  });
});
