/**
 * content-update.test.tsx - Test content updates on state changes
 *
 * PURPOSE: Verify that React state updates trigger proper re-renders
 */

import { useState } from "react";
import { describe, expect, it } from "vitest";
import { Box, render, Text } from "../src/index.js";
import { testRuntime } from "./setup.js";
import { expectRenderSuccess, findWidgetByContent } from "./test-helpers.js";

describe("Content Updates", () => {
  it("should update text content when state changes", async () => {
    let updateCount: (c: number) => void = () => {};

    const Counter = () => {
      const [count, setCount] = useState(0);
      updateCount = setCount;

      return (
        <Box width={20} height={5}>
          <Text>Count: {count}</Text>
        </Box>
      );
    };

    const instance = render(<Counter />, { runtime: testRuntime });
    expectRenderSuccess(instance);

    // Initial state - count should be 0
    let widget = findWidgetByContent(instance.screen, "Count: 0");
    expect(widget).toBeDefined();

    // Update to 5
    updateCount(5);
    await new Promise((resolve) => setTimeout(resolve, 0));
    widget = findWidgetByContent(instance.screen, "Count: 5");
    expect(widget).toBeDefined();

    // Update to 42
    updateCount(42);
    await new Promise((resolve) => setTimeout(resolve, 0));
    widget = findWidgetByContent(instance.screen, "Count: 42");
    expect(widget).toBeDefined();

    instance.unmount();
  });

  it("should handle multiple independent state updates", async () => {
    let updateX: (n: number) => void = () => {};
    let updateY: (n: number) => void = () => {};

    const Coords = () => {
      const [x, setX] = useState(0);
      const [y, setY] = useState(0);
      updateX = setX;
      updateY = setY;

      return (
        <Box flexDirection="column" width={30} height={10}>
          <Text>X: {x}</Text>
          <Text>Y: {y}</Text>
        </Box>
      );
    };

    const instance = render(<Coords />, { runtime: testRuntime });
    expectRenderSuccess(instance);

    // Initial state
    expect(findWidgetByContent(instance.screen, "X: 0")).toBeDefined();
    expect(findWidgetByContent(instance.screen, "Y: 0")).toBeDefined();

    // Update X only
    updateX(10);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(findWidgetByContent(instance.screen, "X: 10")).toBeDefined();
    expect(findWidgetByContent(instance.screen, "Y: 0")).toBeDefined();

    // Update Y only
    updateY(20);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(findWidgetByContent(instance.screen, "X: 10")).toBeDefined();
    expect(findWidgetByContent(instance.screen, "Y: 20")).toBeDefined();

    instance.unmount();
  });
});
