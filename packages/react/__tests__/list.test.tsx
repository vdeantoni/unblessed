/**
 * list.test.tsx - List component tests
 *
 * PURPOSE: Verify that List component renders and handles interactions
 */

import { describe, expect, it } from "vitest";
import { List, render } from "../src/index.js";
import { testRuntime } from "./setup.js";
import { expectRenderSuccess, findWidgetsByType } from "./test-helpers.js";

describe("List Component", () => {
  it("should render list with items", async () => {
    const items = ["Apple", "Banana", "Cherry"];

    const instance = render(<List items={items} width={20} height={10} />, {
      runtime: testRuntime,
    });

    await expectRenderSuccess(instance);

    const lists = findWidgetsByType(instance.screen, "list");
    expect(lists.length).toBeGreaterThan(0);
    expect(lists[0].items.length).toBe(3);

    instance.unmount();
  });

  it("should bind onSelect handler", async () => {
    let selectedItem = "";
    let selectedIndex = -1;

    const items = ["Item 1", "Item 2", "Item 3"];

    const instance = render(
      <List
        items={items}
        width={20}
        height={10}
        onSelect={(item: string, index: number) => {
          selectedItem = item;
          selectedIndex = index;
        }}
      />,
      {
        runtime: testRuntime,
      },
    );

    await expectRenderSuccess(instance);

    const lists = findWidgetsByType(instance.screen, "list");
    const listWidget = lists[0];

    listWidget.emit("select", "Item 1", 0);

    expect(selectedItem).toBe("Item 1");
    expect(selectedIndex).toBe(0);

    instance.unmount();
  });

  it("should bind onCancel handler", async () => {
    let cancelled = false;

    const items = ["Item 1", "Item 2"];

    const instance = render(
      <List
        items={items}
        width={20}
        height={10}
        onCancel={() => {
          cancelled = true;
        }}
      />,
      {
        runtime: testRuntime,
      },
    );

    await expectRenderSuccess(instance);

    const lists = findWidgetsByType(instance.screen, "list");
    lists[0].emit("cancel");

    expect(cancelled).toBe(true);

    instance.unmount();
  });

  it("should be interactive by default", async () => {
    const items = ["Item 1", "Item 2"];

    const instance = render(<List items={items} width={20} height={10} />, {
      runtime: testRuntime,
    });

    await expectRenderSuccess(instance);

    const lists = findWidgetsByType(instance.screen, "list");
    expect(lists[0].interactive).toBe(true);
    expect(lists[0].mouse).toBe(true);

    instance.unmount();
  });

  it("should respect disabled prop", async () => {
    const items = ["Item 1", "Item 2"];

    const instance = render(
      <List items={items} width={20} height={10} disabled={true} />,
      {
        runtime: testRuntime,
      },
    );

    await expectRenderSuccess(instance);

    const lists = findWidgetsByType(instance.screen, "list");
    expect(lists[0].interactive).toBe(false);

    instance.unmount();
  });
});
