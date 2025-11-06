/**
 * events.test.tsx - Test event handling
 *
 * PURPOSE: Verify that event handlers are properly bound and work
 */

import { describe, expect, it } from "vitest";
import { Box, Button, Input, render } from "../src/index.js";
import { testRuntime } from "./setup.js";
import { expectRenderSuccess, findWidgetsByType } from "./test-helpers.js";

describe("Event Handling", () => {
  it("should bind onClick handler to Box widget", async () => {
    let clicked = false;

    const instance = render(
      <Box width={20} height={5} onClick={() => (clicked = true)} />,
      { runtime: testRuntime },
    );

    await expectRenderSuccess(instance);

    // Find the box widget and trigger click event
    const boxes = findWidgetsByType(instance.screen, "box");
    expect(boxes.length).toBeGreaterThan(0);

    const box = boxes[boxes.length - 1]; // Get the last box (user's box, not root)
    box.emit("click");

    expect(clicked).toBe(true);

    instance.unmount();
  });

  it("should bind onKeyPress handler to Box widget", async () => {
    let keyPressed = false;
    let lastKey = "";

    const instance = render(
      <Box
        width={20}
        height={5}
        onKeyPress={(ch: string) => {
          keyPressed = true;
          lastKey = ch;
        }}
      />,
      { runtime: testRuntime },
    );

    await expectRenderSuccess(instance);

    const boxes = findWidgetsByType(instance.screen, "box");
    const box = boxes[boxes.length - 1];
    box.emit("keypress", "a", { name: "a" });

    expect(keyPressed).toBe(true);
    expect(lastKey).toBe("a");

    instance.unmount();
  });

  it("should bind onPress handler to Button widget", async () => {
    let pressed = false;

    const instance = render(
      <Button width={20} height={3} onPress={() => (pressed = true)} />,
      { runtime: testRuntime },
    );

    await expectRenderSuccess(instance);

    const buttons = findWidgetsByType(instance.screen, "button");
    expect(buttons.length).toBeGreaterThan(0);

    buttons[0].emit("press");

    expect(pressed).toBe(true);

    instance.unmount();
  });

  it("should bind onSubmit handler to Input widget", async () => {
    let submitted = false;
    let value = "";

    const instance = render(
      <Input
        width={20}
        onSubmit={(val: string) => {
          submitted = true;
          value = val;
        }}
      />,
      { runtime: testRuntime },
    );

    await expectRenderSuccess(instance);

    const inputs = findWidgetsByType(instance.screen, "textbox");
    expect(inputs.length).toBeGreaterThan(0);

    inputs[0].emit("submit", "test value");

    expect(submitted).toBe(true);
    expect(value).toBe("test value");

    instance.unmount();
  });

  it("should clean up handlers on unmount", async () => {
    let clickCount = 0;

    const instance = render(
      <Box width={20} height={5} onClick={() => clickCount++} />,
      { runtime: testRuntime },
    );

    await expectRenderSuccess(instance);

    const boxes = findWidgetsByType(instance.screen, "box");
    const box = boxes[boxes.length - 1];

    // Trigger before unmount
    box.emit("click");
    expect(clickCount).toBe(1);

    // Unmount
    instance.unmount();

    // Trigger after unmount - should not increase count
    box.emit("click");
    expect(clickCount).toBe(1); // Should still be 1
  });
});
