/**
 * VRT Complex Rendering Tests for @unblessed/node
 *
 * Tests complex rendering scenarios like overlapping widgets, shadows, and layering.
 */

import { Box, setRuntime } from "@unblessed/core";
import { describe } from "vitest";
import { NodeRuntime } from "../../src";
import { createVRTTest } from "../helpers/vrt-test.js";

describe("VRT - Complex Rendering", () => {
  setRuntime(new NodeRuntime());

  createVRTTest(
    "overlapping boxes with shadows render correctly",
    async (screen) => {
      // Background box
      const bg = new Box({
        parent: screen,
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        style: {
          bg: "blue",
        },
      });

      // Box underneath
      const under = new Box({
        parent: screen,
        left: 10,
        top: 4,
        width: "40%",
        height: "30%",
        shadow: true,
        style: {
          bg: "yellow",
        },
        border: { type: "line" },
        content: "Box with Shadow",
      });

      // Overlapping box on top
      const over = new Box({
        parent: screen,
        left: 20,
        top: 8,
        width: "50%",
        height: "40%",
        shadow: true,
        style: {
          bg: "red",
        },
        border: { type: "line" },
        content: "{center}{bold}Top Box{/bold}{/center}",
        tags: true,
      });

      screen.render();
    },
    "__tests__/vrt/fixtures/overlapping-shadows.vrt.json",
  );

  createVRTTest(
    "transparent box overlays content",
    async (screen) => {
      // Base content
      const base = new Box({
        parent: screen,
        left: 5,
        top: 3,
        width: 60,
        height: 15,
        content:
          "Base Layer Content\n\nThis should be visible\nthrough the transparent overlay.",
        border: { type: "line" },
        style: {
          fg: "white",
          bg: "blue",
        },
      });

      // Transparent overlay
      const overlay = new Box({
        parent: screen,
        left: 15,
        top: 6,
        width: 50,
        height: 10,
        content: "{center}{bold}OVERLAY{/bold}{/center}",
        tags: true,
        border: { type: "line" },
        style: {
          fg: "yellow",
          bg: "red",
          transparent: true,
        },
      });

      screen.render();
    },
    "__tests__/vrt/fixtures/transparent-overlay.vrt.json",
  );

  createVRTTest(
    "docked borders connect correctly",
    async (screen) => {
      // Enable dock borders
      screen.dockBorders = true;

      // Top-left box
      const box1 = new Box({
        parent: screen,
        left: 0,
        top: 0,
        width: 40,
        height: 12,
        content: "Top Left",
        border: { type: "line" },
      });

      // Top-right box
      const box2 = new Box({
        parent: screen,
        left: 40,
        top: 0,
        width: 40,
        height: 12,
        content: "Top Right",
        border: { type: "line" },
      });

      // Bottom box (spans both)
      const box3 = new Box({
        parent: screen,
        left: 0,
        top: 12,
        width: 80,
        height: 12,
        content: "Bottom (borders should dock)",
        border: { type: "line" },
      });

      screen.render();
    },
    "__tests__/vrt/fixtures/docked-borders.vrt.json",
  );
});
