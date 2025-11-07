/**
 * animatable.ts - animatable mixin for blessed elements
 *
 * Adds animation capabilities to elements without polluting the Element class.
 * Follow the same pattern as makeScrollable for consistency.
 */

/**
 * Animatable Methods Interface
 * Defines the methods added by makeAnimatable
 */
export interface AnimatableMethods {
  /**
   * Animate border colors over time using a generator function.
   * Returns a function to stop the animation.
   *
   * @param generator - Function that generates color array for each frame.
   *                    Receives border length and frame number as parameters.
   * @param options - Animation options
   * @param options.fps - Frames per second (default: 30)
   * @returns Function to stop the animation
   *
   * @example
   * ```ts
   * // Rainbow animation
   * const stop = element.animateBorderColors((length, frame) => {
   *   const colors = generateRainbow(length);
   *   return rotateColors(colors, frame);
   * }, { fps: 30 });
   *
   * // Later, stop the animation
   * stop();
   * ```
   */
  animateBorderColors(
    generator: (length: number, frame: number) => (string | number)[],
    options?: { fps?: number },
  ): () => void;

  /**
   * Pulse effect - oscillate a style property between values.
   * Returns a function to stop the animation.
   *
   * @param property - Style property to animate ('fg', 'bg', or 'dim')
   * @param values - Array of values to cycle through
   * @param options - Animation options
   * @param options.duration - Duration of one complete cycle in milliseconds (default: 1000)
   * @param options.fps - Frames per second (default: 30)
   * @returns Function to stop the animation and restore original value
   *
   * @example
   * ```ts
   * // Pulse foreground color
   * const stop = element.pulse('fg', ['red', 'yellow', 'red'], {
   *   duration: 1000
   * });
   *
   * // Pulse dim property for fade effect
   * element.pulse('dim', [false, true, false], { duration: 1000 });
   * ```
   */
  pulse(
    property: "fg" | "bg" | "dim",
    values: any[],
    options?: { duration?: number; fps?: number },
  ): () => void;
}

/**
 * Interface for elements with animation capabilities
 */
interface AnimatableElement extends AnimatableMethods {
  animatable: boolean;
  getBorderLength(): number;
  setBorderColors(colors: (string | number)[]): void;
  style: {
    fg?: string;
    bg?: string;
    dim?: boolean;
    [key: string]: any;
  };
  screen: {
    render(): void;
  };
}

/**
 * Animation method implementations
 */
const animationMethods = {
  animateBorderColors(
    this: AnimatableElement,
    generator: (length: number, frame: number) => (string | number)[],
    options: { fps?: number } = {},
  ): () => void {
    const fps = options.fps || 30;
    const length = this.getBorderLength();
    let frame = 0;
    let stopped = false;

    const interval = setInterval(() => {
      if (stopped) return;

      const colors = generator(length, frame++);
      this.setBorderColors(colors);
      this.screen.render();
    }, 1000 / fps);

    return () => {
      stopped = true;
      clearInterval(interval);
    };
  },

  pulse(
    this: AnimatableElement,
    property: "fg" | "bg" | "dim",
    values: any[],
    options: { duration?: number; fps?: number } = {},
  ): () => void {
    const duration = options.duration || 1000;
    const fps = options.fps || 30;
    const totalFrames = Math.ceil(duration / (1000 / fps));
    let frame = 0;
    let stopped = false;

    // Store original value with proper typing
    const originalValue =
      property === "dim"
        ? (this.style.dim as boolean | undefined)
        : property === "fg"
          ? (this.style.fg as string | undefined)
          : (this.style.bg as string | undefined);

    const interval = setInterval(() => {
      if (stopped) return;

      const progress = (frame % totalFrames) / totalFrames;
      const index = Math.floor(progress * values.length);
      const value = values[index % values.length];

      // Set value with proper typing
      if (property === "dim") {
        this.style.dim = value as boolean;
      } else if (property === "fg") {
        this.style.fg = value as string;
      } else {
        this.style.bg = value as string;
      }

      this.screen.render();
      frame++;
    }, 1000 / fps);

    return () => {
      stopped = true;
      clearInterval(interval);

      // Restore original value with proper typing
      if (property === "dim") {
        this.style.dim = originalValue as boolean | undefined;
      } else if (property === "fg") {
        this.style.fg = originalValue as string | undefined;
      } else {
        this.style.bg = originalValue as string | undefined;
      }

      this.screen.render();
    };
  },
};

/**
 * Make an element animatable
 *
 * Adds animation methods to any element that supports borders and styling.
 * Follow the same pattern as makeScrollable for consistency.
 *
 * @param element - The element to make animatable
 *
 * @example
 * ```ts
 * const box = new Box({
 *   parent: screen,
 *   border: { type: 'line' },
 *   width: 20,
 *   height: 10
 * });
 *
 * makeAnimatable(box);
 *
 * // Now you can use animation methods
 * box.animateBorderColors((length, frame) => {
 *   const colors = generateRainbow(length);
 *   return rotateColors(colors, frame);
 * });
 * ```
 */
export function makeAnimatable(element: any): void {
  // Mark as animatable
  element.animatable = true;

  // Add animation methods directly to the instance (not prototype!)
  // This ensures only this specific element gets the methods
  Object.keys(animationMethods).forEach((method: string) => {
    if (!element[method]) {
      element[method] = animationMethods[method as keyof AnimatableMethods];
    }
  });
}

export default makeAnimatable;
