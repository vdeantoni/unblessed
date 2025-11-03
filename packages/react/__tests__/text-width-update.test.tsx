/**
 * text-width-update.test.tsx - Test Yoga width updates when text content changes
 *
 * Verifies that when text content changes length (e.g., "9" → "10"),
 * the Yoga layout width is updated to prevent truncation or layout issues.
 */

import { useState } from "react";
import { describe, expect, it } from "vitest";
import { Box, render, Text } from "../src/index.js";
import { testRuntime } from "./setup.js";

describe("Text Width Updates", () => {
  it("should handle single digit to double digit transitions", () => {
    let setCount: (c: number) => void;

    const Counter = () => {
      const [count, _setCount] = useState(9);
      setCount = _setCount;

      return (
        <Box>
          <Text>Score: {count}</Text>
        </Box>
      );
    };

    const instance = render(<Counter />, { runtime: testRuntime });

    const textWidget = instance.screen.children[0].children[0].children[0];

    expect(textWidget.content).toContain("Score: 9");

    setCount(10);
    expect(textWidget.content).toContain("Score: 10");
    expect(textWidget.content).not.toBe("Score: ");

    setCount(99);
    expect(textWidget.content).toContain("Score: 99");

    setCount(100);
    expect(textWidget.content).toContain("Score: 100");

    instance.unmount();
  });

  it("should handle growing and shrinking text", () => {
    let setText: (s: string) => void;

    const DynamicText = () => {
      const [text, _setText] = useState("a");
      setText = _setText;

      return (
        <Box>
          <Text>Value: {text}</Text>
        </Box>
      );
    };

    const instance = render(<DynamicText />, { runtime: testRuntime });

    const textWidget = instance.screen.children[0].children[0].children[0];

    expect(textWidget.content).toContain("Value: a");

    setText("abc");
    expect(textWidget.content).toContain("Value: abc");

    setText("abcdefghij");
    expect(textWidget.content).toContain("Value: abcdefghij");

    setText("x");
    expect(textWidget.content).toContain("Value: x");

    instance.unmount();
  });
});
