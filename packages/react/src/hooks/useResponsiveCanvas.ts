/**
 * useResponsiveCanvas.ts - Hook for responsive canvas sizing
 *
 * Automatically calculates canvas dimensions based on parent container,
 * accounting for borders, padding, and other decorations.
 */

import type { Element } from "@unblessed/core";
import { useEffect, useRef, useState } from "react";

export interface UseResponsiveCanvasOptions {
  /**
   * Account for border (1 char per side)
   * @default true
   */
  accountForBorder?: boolean;

  /**
   * Account for padding (1 char per side)
   * @default true
   */
  accountForPadding?: boolean;

  /**
   * Extra height to subtract (e.g., for header text)
   * @default 0
   */
  reserveHeight?: number;

  /**
   * Minimum canvas width
   * @default 1
   */
  minWidth?: number;

  /**
   * Minimum canvas height
   * @default 1
   */
  minHeight?: number;
}

export interface ResponsiveCanvasDimensions {
  width: number;
  height: number;
}

/**
 * Hook for responsive canvas sizing.
 *
 * Returns a ref to attach to the parent container and the calculated
 * canvas dimensions that update automatically on resize.
 *
 * @param options - Configuration options
 * @returns Object with containerRef and dimensions
 *
 * @example
 * ```tsx
 * function MyCanvas() {
 *   const { containerRef, dimensions } = useResponsiveCanvas({
 *     accountForBorder: true,
 *     accountForPadding: true,
 *     reserveHeight: 1, // For header text
 *   });
 *
 *   return (
 *     <Box ref={containerRef} border={1} padding={1} flexGrow={1}>
 *       <Text>My Chart</Text>
 *       <CharCanvas width={dimensions.width} height={dimensions.height} />
 *     </Box>
 *   );
 * }
 * ```
 */
export function useResponsiveCanvas<T extends Element = Element>(
  options: UseResponsiveCanvasOptions = {},
): {
  containerRef: { current: T | null };
  dimensions: ResponsiveCanvasDimensions;
} {
  const {
    accountForBorder = true,
    accountForPadding = true,
    reserveHeight = 0,
    minWidth = 1,
    minHeight = 1,
  } = options;

  const containerRef = useRef<T | null>(null);
  const [dimensions, setDimensions] = useState<ResponsiveCanvasDimensions>({
    width: minWidth,
    height: minHeight,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      let availableWidth = container.width;
      let availableHeight = container.height;

      // Account for border (1 char each side = 2 total)
      if (accountForBorder) {
        availableWidth -= 2;
        availableHeight -= 2;
      }

      // Account for padding (1 char each side = 2 total)
      if (accountForPadding) {
        availableWidth -= 2;
        availableHeight -= 2;
      }

      // Reserve additional height (e.g., for header text)
      availableHeight -= reserveHeight;

      // Apply minimum constraints
      availableWidth = Math.max(minWidth, availableWidth);
      availableHeight = Math.max(minHeight, availableHeight);

      // Only update if dimensions actually changed
      setDimensions((prev) => {
        if (prev.width === availableWidth && prev.height === availableHeight) {
          return prev; // Return same reference to avoid triggering effects
        }
        return {
          width: availableWidth,
          height: availableHeight,
        };
      });
    };

    // Initial calculation
    updateDimensions();

    // Listen for terminal resize
    container.screen.on("resize", updateDimensions);

    return () => {
      container.screen.off("resize", updateDimensions);
    };
  }, [accountForBorder, accountForPadding, reserveHeight, minWidth, minHeight]);

  return { containerRef, dimensions };
}
