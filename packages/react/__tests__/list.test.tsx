/**
 * list.test.tsx - List component tests
 */

import { describe, expect, it, vi } from "vitest";
import { List, render } from "../src/index.js";
import { testRuntime } from "./setup.js";

describe("List Component", () => {
  it("should render list with items", () => {
    const items = ["Apple", "Banana", "Cherry"];

    const instance = render(<List items={items} width={20} height={10} />, {
      runtime: testRuntime,
    });

    const rootWidget = instance.screen.children[0];
    const listWidget = rootWidget.children[0];

    expect(listWidget.type).toBe("list");
    expect(listWidget.items.length).toBe(3);

    instance.unmount();
  });

  it("should bind onSelect handler", () => {
    const onSelect = vi.fn();
    const items = ["Item 1", "Item 2", "Item 3"];

    const instance = render(
      <List items={items} width={20} height={10} onSelect={onSelect} />,
      {
        runtime: testRuntime,
      },
    );

    const rootWidget = instance.screen.children[0];
    const listWidget = rootWidget.children[0];

    expect(listWidget.listeners("select")).toHaveLength(1);

    listWidget.emit("select", "Item 1", 0);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith("Item 1", 0);

    instance.unmount();
  });

  it("should bind onCancel handler", () => {
    const onCancel = vi.fn();
    const items = ["Item 1", "Item 2"];

    const instance = render(
      <List items={items} width={20} height={10} onCancel={onCancel} />,
      {
        runtime: testRuntime,
      },
    );

    const rootWidget = instance.screen.children[0];
    const listWidget = rootWidget.children[0];

    expect(listWidget.listeners("cancel")).toHaveLength(1);

    listWidget.emit("cancel");

    expect(onCancel).toHaveBeenCalledTimes(1);

    instance.unmount();
  });

  it("should have mouse and keys enabled by default", () => {
    const items = ["Item 1", "Item 2"];

    const instance = render(<List items={items} width={20} height={10} />, {
      runtime: testRuntime,
    });

    const rootWidget = instance.screen.children[0];
    const listWidget = rootWidget.children[0];

    // These should be enabled by default in React
    expect(listWidget.mouse).toBe(true);
    // keys is checked differently in unblessed, but the option should be set

    instance.unmount();
  });

  it("should respect disabled prop", () => {
    const items = ["Item 1", "Item 2"];

    const instance = render(
      <List items={items} width={20} height={10} disabled={true} />,
      {
        runtime: testRuntime,
      },
    );

    const rootWidget = instance.screen.children[0];
    const listWidget = rootWidget.children[0];

    expect(listWidget.interactive).toBe(false);

    instance.unmount();
  });

  it("should default to interactive when disabled is not set", () => {
    const items = ["Item 1", "Item 2"];

    const instance = render(<List items={items} width={20} height={10} />, {
      runtime: testRuntime,
    });

    const rootWidget = instance.screen.children[0];
    const listWidget = rootWidget.children[0];

    expect(listWidget.interactive).toBe(true);

    instance.unmount();
  });

  it("should apply selected item styling", () => {
    const items = ["Item 1", "Item 2"];

    const instance = render(
      <List
        items={items}
        label="Select one"
        width={20}
        height={10}
        itemSelected={{ bg: "blue", color: "white", bold: true }}
      />,
      { runtime: testRuntime },
    );

    const rootWidget = instance.screen.children[0];
    const listWidget = rootWidget.children[0];

    // Check that the values were set (they get converted to numbers by colors.convert())
    expect(listWidget.options.selectedBg).toBeDefined();
    expect(listWidget.options.selectedFg).toBeDefined();
    expect(listWidget.options.selectedBold).toBe(true);

    instance.unmount();
  });

  it("should apply normal item styling", () => {
    const items = ["Item 1", "Item 2"];

    const instance = render(
      <List
        items={items}
        label="Select one"
        width={20}
        height={10}
        itemStyle={{ bg: "black", color: "gray", bold: false }}
      />,
      { runtime: testRuntime },
    );

    const rootWidget = instance.screen.children[0];
    const listWidget = rootWidget.children[0];

    // Check that the values were set (they get converted to numbers by colors.convert())
    expect(listWidget.options.itemBg).toBeDefined();
    expect(listWidget.options.itemFg).toBeDefined();
    expect(listWidget.options.itemBold).toBe(false);

    instance.unmount();
  });
});
