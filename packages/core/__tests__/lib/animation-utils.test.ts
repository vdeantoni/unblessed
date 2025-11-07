/**
 * Tests for animation utilities
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AnimationController,
  clamp,
  easing,
  lerp,
  lerpColor,
  Spring,
} from "../../src/lib/animation-utils.js";

describe("Easing functions", () => {
  it("linear easing should return input value", () => {
    expect(easing.linear(0)).toBe(0);
    expect(easing.linear(0.5)).toBe(0.5);
    expect(easing.linear(1)).toBe(1);
  });

  it("easeIn should accelerate from zero", () => {
    expect(easing.easeIn(0)).toBe(0);
    expect(easing.easeIn(0.5)).toBe(0.25); // t * t
    expect(easing.easeIn(1)).toBe(1);
  });

  it("easeOut should decelerate to zero", () => {
    expect(easing.easeOut(0)).toBe(0);
    expect(easing.easeOut(0.5)).toBe(0.75); // t * (2 - t)
    expect(easing.easeOut(1)).toBe(1);
  });

  it("easeInOut should combine ease-in and ease-out", () => {
    expect(easing.easeInOut(0)).toBe(0);
    expect(easing.easeInOut(0.25)).toBeLessThan(0.25);
    expect(easing.easeInOut(0.5)).toBe(0.5);
    expect(easing.easeInOut(0.75)).toBeGreaterThan(0.75);
    expect(easing.easeInOut(1)).toBe(1);
  });
});

describe("lerp", () => {
  it("should interpolate between numbers", () => {
    expect(lerp(0, 100, 0)).toBe(0);
    expect(lerp(0, 100, 0.5)).toBe(50);
    expect(lerp(0, 100, 1)).toBe(100);
  });

  it("should work with negative numbers", () => {
    expect(lerp(-100, 100, 0.5)).toBe(0);
    expect(lerp(-50, 50, 0.25)).toBe(-25);
  });

  it("should work with non-zero start", () => {
    expect(lerp(10, 20, 0.5)).toBe(15);
    expect(lerp(100, 200, 0.75)).toBe(175);
  });
});

describe("lerpColor", () => {
  it("should interpolate between RGB colors", () => {
    const black: [number, number, number] = [0, 0, 0];
    const white: [number, number, number] = [255, 255, 255];

    expect(lerpColor(black, white, 0)).toEqual([0, 0, 0]);
    expect(lerpColor(black, white, 0.5)).toEqual([128, 128, 128]);
    expect(lerpColor(black, white, 1)).toEqual([255, 255, 255]);
  });

  it("should interpolate between different colors", () => {
    const red: [number, number, number] = [255, 0, 0];
    const blue: [number, number, number] = [0, 0, 255];

    const result = lerpColor(red, blue, 0.5);
    expect(result[0]).toBe(128); // R
    expect(result[1]).toBe(0); // G
    expect(result[2]).toBe(128); // B
  });

  it("should round to nearest integer", () => {
    const result = lerpColor([0, 0, 0], [10, 10, 10], 0.33);
    result.forEach((channel) => {
      expect(Number.isInteger(channel)).toBe(true);
    });
  });
});

describe("clamp", () => {
  it("should clamp value between min and max", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("should handle edge cases", () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });
});

describe("Spring", () => {
  it("should initialize with correct values", () => {
    const spring = new Spring(0);
    expect(spring.getValue()).toBe(0);
    expect(spring.getVelocity()).toBe(0);
  });

  it("should move towards target", () => {
    const spring = new Spring(0, 100, 10);
    spring.setTarget(100);

    spring.update(1 / 60); // One frame at 60fps
    expect(spring.getValue()).toBeGreaterThan(0);
    expect(spring.getValue()).toBeLessThan(100);
  });

  it("should eventually reach target", () => {
    const spring = new Spring(0, 100, 10);
    spring.setTarget(100);

    // Simulate many frames
    for (let i = 0; i < 100; i++) {
      spring.update(1 / 60);
    }

    // Should be very close to target after 100 frames
    expect(spring.getValue()).toBeCloseTo(100, 0);
    // Test that it's close enough (within 1% of target)
    expect(Math.abs(spring.getValue() - 100)).toBeLessThan(1);
  });

  it("should respect stiffness parameter", () => {
    const stiffSpring = new Spring(0, 200, 10);
    const softSpring = new Spring(0, 50, 10);

    stiffSpring.setTarget(100);
    softSpring.setTarget(100);

    stiffSpring.update(1 / 60);
    softSpring.update(1 / 60);

    expect(stiffSpring.getValue()).toBeGreaterThan(softSpring.getValue());
  });

  it("should respect damping parameter", () => {
    const highDamping = new Spring(0, 100, 20);
    const lowDamping = new Spring(0, 100, 5);

    highDamping.setTarget(100);
    lowDamping.setTarget(100);

    // Simulate to near completion
    for (let i = 0; i < 50; i++) {
      highDamping.update(1 / 60);
      lowDamping.update(1 / 60);
    }

    // High damping should overshoot less
    expect(Math.abs(100 - highDamping.getValue())).toBeLessThan(
      Math.abs(100 - lowDamping.getValue()),
    );
  });

  it("should reset correctly", () => {
    const spring = new Spring(0, 100, 10);
    spring.setTarget(100);
    spring.update(1 / 60);

    spring.reset(50);
    expect(spring.getValue()).toBe(50);
    expect(spring.getVelocity()).toBe(0);
  });
});

describe("AnimationController", () => {
  let controller: AnimationController;

  beforeEach(() => {
    controller = new AnimationController();
    vi.useFakeTimers();
  });

  afterEach(() => {
    controller.stop();
    vi.restoreAllMocks();
  });

  it("should initialize correctly", () => {
    expect(controller.isRunning()).toBe(false);
    expect(controller.getCallbackCount()).toBe(0);
  });

  it("should start and stop", () => {
    controller.start(30);
    expect(controller.isRunning()).toBe(true);

    controller.stop();
    expect(controller.isRunning()).toBe(false);
  });

  it("should call registered callbacks", () => {
    const callback = vi.fn();
    controller.addCallback(callback);
    controller.start(30);

    vi.advanceTimersByTime(1000 / 30);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(expect.any(Number));
  });

  it("should call multiple callbacks", () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    controller.addCallback(callback1);
    controller.addCallback(callback2);
    controller.start(30);

    vi.advanceTimersByTime(1000 / 30);
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it("should remove callbacks", () => {
    const callback = vi.fn();
    controller.addCallback(callback);
    controller.removeCallback(callback);
    controller.start(30);

    vi.advanceTimersByTime(1000 / 30);
    expect(callback).not.toHaveBeenCalled();
  });

  it("should respect FPS setting", () => {
    const callback = vi.fn();
    controller.addCallback(callback);
    controller.start(60); // 60 FPS

    expect(controller.getFPS()).toBe(60);

    vi.advanceTimersByTime(1000); // 1 second
    // Allow for slight timing variance (58-62 calls is acceptable for 60 FPS)
    expect(callback).toHaveBeenCalled();
    expect(callback.mock.calls.length).toBeGreaterThanOrEqual(58);
    expect(callback.mock.calls.length).toBeLessThanOrEqual(62);
  });

  it("should handle errors in callbacks", () => {
    const errorCallback = vi.fn(() => {
      throw new Error("Test error");
    });
    const normalCallback = vi.fn();

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    controller.addCallback(errorCallback);
    controller.addCallback(normalCallback);
    controller.start(30);

    vi.advanceTimersByTime(1000 / 30);

    expect(consoleSpy).toHaveBeenCalled();
    expect(normalCallback).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should not start twice", () => {
    controller.start(30);
    const interval1 = controller["interval"];

    controller.start(30);
    const interval2 = controller["interval"];

    expect(interval1).toBe(interval2);
  });
});
