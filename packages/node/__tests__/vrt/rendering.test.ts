/**
 * VRT Rendering Tests for @unblessed/node
 *
 * Visual regression tests that record UI rendering and compare with golden snapshots.
 * Run with UPDATE_SNAPSHOTS=1 to update baselines after intentional UI changes.
 */

import { setRuntime } from "@unblessed/core";
import { describe } from "vitest";
import { Box, List, Text } from "../../dist/index.js";
import { NodeRuntime } from "../../src";
import { createVRTTest } from "../helpers/vrt-test.js";

describe("VRT - Widget Rendering", () => {
  setRuntime(new NodeRuntime());

  createVRTTest(
    "box with border and content",
    async (screen) => {
      const box = new Box({
        parent: screen,
        top: 1,
        left: 1,
        width: 30,
        height: 7,
        content: "{center}Hello VRT!{/center}",
        tags: true,
        border: { type: "line" },
        style: {
          border: { fg: "cyan" },
          fg: "white",
        },
      });

      screen.render();
    },
    "__tests__/vrt/fixtures/box-with-border.vrt.json",
  );

  createVRTTest(
    "list with multiple items",
    async (screen) => {
      const list = new List({
        parent: screen,
        top: 0,
        left: 0,
        width: "50%",
        height: 10,
        items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
        border: { type: "line" },
        style: {
          selected: { bg: "blue" },
          item: { fg: "white" },
        },
      });

      list.select(2); // Select third item
      screen.render();
    },
    "__tests__/vrt/fixtures/list-with-items.vrt.json",
  );

  createVRTTest(
    "multiple widgets in layout",
    async (screen) => {
      const box1 = new Box({
        parent: screen,
        top: 0,
        left: 0,
        width: "50%",
        height: "50%",
        content: "Top Left",
        border: { type: "line" },
        style: {
          border: { fg: "green" },
        },
      });

      const box2 = new Box({
        parent: screen,
        top: 0,
        left: "50%",
        width: "50%",
        height: "50%",
        content: "Top Right",
        border: { type: "line" },
        style: {
          border: { fg: "yellow" },
        },
      });

      const text = new Text({
        parent: screen,
        top: "50%",
        left: "center",
        width: "shrink",
        height: "shrink",
        content: "{bold}Centered Text{/bold}",
        tags: true,
      });

      screen.render();
    },
    "__tests__/vrt/fixtures/multi-widget-layout.vrt.json",
  );

  createVRTTest(
    "box with styling and tags",
    async (screen) => {
      const box = new Box({
        parent: screen,
        top: "center",
        left: "center",
        width: 40,
        height: 8,
        content: [
          "{bold}{cyan-fg}Styled Content{/}",
          "",
          "{red-fg}Red text{/}",
          "{green-fg}Green text{/}",
          "{blue-fg}Blue text{/}",
        ].join("\n"),
        tags: true,
        border: { type: "line" },
        padding: { left: 2, right: 2, top: 1, bottom: 1 },
      });

      screen.render();
    },
    "__tests__/vrt/fixtures/box-with-styling.vrt.json",
  );
});
