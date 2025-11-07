/**
 * Animation utilities for high-performance terminal animations
 *
 * Provides easing functions, interpolation, spring physics, and frame control
 * for creating smooth animations in terminal UIs.
 *
 * @module animation-utils
 */

/**
 * Easing functions for smooth animations
 *
 * All easing functions take a normalized time value (0-1) and return
 * a normalized progress value (0-1).
 */
export const easing = {
  /**
   * Linear interpolation (constant speed)
   */
  linear: (t: number): number => t,

  /**
   * Quadratic ease-in (accelerating from zero velocity)
   */
  easeIn: (t: number): number => t * t,

  /**
   * Quadratic ease-out (decelerating to zero velocity)
   */
  easeOut: (t: number): number => t * (2 - t),

  /**
   * Quadratic ease-in-out (acceleration until halfway, then deceleration)
   */
  easeInOut: (t: number): number =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  /**
   * Cubic ease-in (stronger acceleration)
   */
  easeInCubic: (t: number): number => t * t * t,

  /**
   * Cubic ease-out (stronger deceleration)
   */
  easeOutCubic: (t: number): number => --t * t * t + 1,

  /**
   * Cubic ease-in-out (stronger acceleration and deceleration)
   */
  easeInOutCubic: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  /**
   * Elastic ease-out (spring-like bounce at the end)
   */
  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
        ? 1
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },

  /**
   * Back ease-out (slight overshoot then settle)
   */
  easeOutBack: (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },

  /**
   * Bounce ease-out (bouncing ball effect)
   */
  easeOutBounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
} as const;

/**
 * Linear interpolation between two numbers
 *
 * @param start - Starting value
 * @param end - Ending value
 * @param t - Progress (0-1)
 * @returns Interpolated value
 *
 * @example
 * ```ts
 * lerp(0, 100, 0.5);  // 50
 * lerp(10, 20, 0.25); // 12.5
 * ```
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * RGB color tuple
 */
export type RGB = [number, number, number];

/**
 * Interpolate between two RGB colors
 *
 * @param from - Starting color [r, g, b] (0-255)
 * @param to - Ending color [r, g, b] (0-255)
 * @param t - Progress (0-1)
 * @returns Interpolated color [r, g, b]
 *
 * @example
 * ```ts
 * lerpColor([255, 0, 0], [0, 0, 255], 0.5);
 * // [127, 0, 127] - purple (midpoint between red and blue)
 * ```
 */
export function lerpColor(from: RGB, to: RGB, t: number): RGB {
  return [
    Math.round(lerp(from[0], to[0], t)),
    Math.round(lerp(from[1], to[1], t)),
    Math.round(lerp(from[2], to[2], t)),
  ];
}

/**
 * Clamp a number between min and max
 *
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Spring physics for smooth, natural animations
 *
 * Uses spring-based physics (stiffness and damping) instead of duration-based
 * animations for more natural motion that feels responsive and organic.
 *
 * @example
 * ```ts
 * const spring = new Spring(0, 100, 10);  // initial=0, stiffness=100, damping=10
 * spring.setTarget(100);
 *
 * const interval = setInterval(() => {
 *   const value = spring.update(1/60);  // 60fps
 *   console.log(value);
 *
 *   if (spring.isAtRest()) {
 *     clearInterval(interval);
 *   }
 * }, 1000/60);
 * ```
 */
export class Spring {
  private value: number;
  private velocity: number = 0;
  private target: number;
  private stiffness: number;
  private damping: number;

  /**
   * Create a new spring
   *
   * @param initial - Initial value
   * @param stiffness - Spring stiffness (higher = faster) [default: 100]
   * @param damping - Spring damping (higher = less oscillation) [default: 10]
   */
  constructor(initial: number, stiffness: number = 100, damping: number = 10) {
    this.value = initial;
    this.target = initial;
    this.stiffness = stiffness;
    this.damping = damping;
  }

  /**
   * Set the target value to animate towards
   */
  setTarget(target: number): void {
    this.target = target;
  }

  /**
   * Update the spring physics for one frame
   *
   * @param deltaTime - Time elapsed since last update (in seconds)
   * @returns Current value
   */
  update(deltaTime: number): number {
    const force = (this.target - this.value) * this.stiffness;
    const dampingForce = this.velocity * this.damping;
    const acceleration = force - dampingForce;

    this.velocity += acceleration * deltaTime;
    this.value += this.velocity * deltaTime;

    return this.value;
  }

  /**
   * Get the current value without updating
   */
  getValue(): number {
    return this.value;
  }

  /**
   * Get the current velocity
   */
  getVelocity(): number {
    return this.velocity;
  }

  /**
   * Check if the spring has settled (at rest)
   *
   * @param velocityThreshold - Velocity threshold for "at rest" [default: 0.01]
   * @param positionThreshold - Position threshold for "at rest" [default: 0.01]
   * @returns True if the spring is at rest
   */
  isAtRest(
    velocityThreshold: number = 0.01,
    positionThreshold: number = 0.01,
  ): boolean {
    return (
      Math.abs(this.velocity) < velocityThreshold &&
      Math.abs(this.target - this.value) < positionThreshold
    );
  }

  /**
   * Reset the spring to a new value
   *
   * @param value - New value
   * @param resetVelocity - Whether to reset velocity to 0 [default: true]
   */
  reset(value: number, resetVelocity: boolean = true): void {
    this.value = value;
    this.target = value;
    if (resetVelocity) {
      this.velocity = 0;
    }
  }
}

/**
 * Animation frame controller for managing multiple animations
 *
 * Provides a central frame loop that runs at a specified FPS and calls
 * registered callbacks with delta time. More efficient than running
 * multiple setInterval calls.
 *
 * @example
 * ```ts
 * const controller = new AnimationController();
 *
 * controller.addCallback((deltaTime) => {
 *   // Update animation 1
 * });
 *
 * controller.addCallback((deltaTime) => {
 *   // Update animation 2
 * });
 *
 * controller.start(30);  // 30 FPS
 *
 * // Later...
 * controller.stop();
 * ```
 */
export class AnimationController {
  private frameCallbacks: Set<(deltaTime: number) => void> = new Set();
  private interval?: ReturnType<typeof setInterval>;
  private lastTime: number = Date.now();
  private fps: number = 30;

  /**
   * Start the animation loop
   *
   * @param fps - Frames per second [default: 30]
   */
  start(fps: number = 30): void {
    if (this.interval) {
      return; // Already running
    }

    this.fps = fps;
    const frameTime = 1000 / fps;
    this.lastTime = Date.now();

    this.interval = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - this.lastTime) / 1000; // Convert to seconds
      this.lastTime = now;

      // Call all registered callbacks
      for (const callback of this.frameCallbacks) {
        try {
          callback(deltaTime);
        } catch (error) {
          console.error("Animation callback error:", error);
        }
      }
    }, frameTime);
  }

  /**
   * Stop the animation loop
   */
  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  /**
   * Add a callback to be called on each frame
   *
   * @param callback - Function to call with deltaTime
   */
  addCallback(callback: (deltaTime: number) => void): void {
    this.frameCallbacks.add(callback);
  }

  /**
   * Remove a callback
   *
   * @param callback - Function to remove
   */
  removeCallback(callback: (deltaTime: number) => void): void {
    this.frameCallbacks.delete(callback);
  }

  /**
   * Get the current FPS setting
   */
  getFPS(): number {
    return this.fps;
  }

  /**
   * Check if the controller is running
   */
  isRunning(): boolean {
    return this.interval !== undefined;
  }

  /**
   * Get the number of registered callbacks
   */
  getCallbackCount(): number {
    return this.frameCallbacks.size;
  }
}
