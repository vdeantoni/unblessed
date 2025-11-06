/**
 * focus-effects.test.tsx - Test focus functionality
 *
 * PURPOSE: Verify that focus effects work correctly
 */

import { describe, expect, it } from "vitest";
import { Box, Button, Input, render } from "../src/index.js";
import { testRuntime } from "./setup.js";
import { expectRenderSuccess, findWidgetsByType } from "./test-helpers.js";

describe("Focus Effects", () => {
  it("should make widget focusable when tabIndex is set", async () => {
    const instance = render(
      <Box width={10} height={5} tabIndex={0} focus={{ bg: "green" }} />,
      { runtime: testRuntime },
    );

    await expectRenderSuccess(instance);

    const boxes = findWidgetsByType(instance.screen, "box");
    const widget = boxes[boxes.length - 1];

    // Widget should be keyable to receive focus
    expect(widget.keyable).toBe(true);

    instance.unmount();
  });

  it("should allow focusing the widget", async () => {
    const instance = render(
      <Box width={10} height={5} tabIndex={0} focus={{ bg: "green" }} />,
      { runtime: testRuntime },
    );

    await expectRenderSuccess(instance);

    const boxes = findWidgetsByType(instance.screen, "box");
    const widget = boxes[boxes.length - 1];

    // Focus the widget
    widget.focus();

    // Widget should be focused
    expect(instance.screen.focused).toBe(widget);

    instance.unmount();
  });

  it("should make Button focusable by default", async () => {
    const instance = render(
      <Button width={10} height={3} focus={{ bg: "green" }} />,
      { runtime: testRuntime },
    );

    await expectRenderSuccess(instance);

    const buttons = findWidgetsByType(instance.screen, "button");
    expect(buttons.length).toBeGreaterThan(0);

    // Button should be keyable by default
    expect(buttons[0].keyable).toBe(true);

    instance.unmount();
  });

  it("should make Input focusable by default", async () => {
    const instance = render(
      <Input width={20} height={3} focus={{ bg: "green" }} />,
      { runtime: testRuntime },
    );

    await expectRenderSuccess(instance);

    const inputs = findWidgetsByType(instance.screen, "textbox");
    expect(inputs.length).toBeGreaterThan(0);

    // Input should be keyable by default
    expect(inputs[0].keyable).toBe(true);

    instance.unmount();
  });

  it("should not make Box focusable without tabIndex", async () => {
    const instance = render(<Box width={10} height={5} />, {
      runtime: testRuntime,
    });

    await expectRenderSuccess(instance);

    const boxes = findWidgetsByType(instance.screen, "box");
    const widget = boxes[boxes.length - 1];

    // Box without tabIndex should not be keyable
    expect(widget.keyable).toBeUndefined();

    instance.unmount();
  });
});
