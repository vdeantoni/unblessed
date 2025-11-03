/**
 * VRT Interaction Tests for @unblessed/node
 *
 * Tests widget interactions like dragging, scrolling, and focus changes.
 * Uses multi-frame VRT to capture state changes over time.
 */

import { Box, ScrollableText, setRuntime } from "@unblessed/core";
import { describe } from "vitest";
import { NodeRuntime } from "../../src";
import { createMultiFrameVRTTest } from "../helpers/vrt-test.js";

describe("VRT - Widget Interactions", () => {
  setRuntime(new NodeRuntime());

  createMultiFrameVRTTest(
    "draggable box moves to different positions",
    async (screen, capture) => {
      // Create draggable box
      const box = new Box({
        parent: screen,
        left: 10,
        top: 5,
        width: 30,
        height: 7,
        content: "{center}{bold}Drag Me!{/bold}{/center}",
        tags: true,
        border: { type: "line" },
        draggable: true,
        style: {
          border: { fg: "green" },
        },
      });

      screen.render();
      await capture(); // Frame 1: Initial position (10, 5)

      // Move to position 2
      box.left = 25;
      box.top = 10;
      screen.render();
      await capture(); // Frame 2: Moved to (25, 10)

      // Move to position 3
      box.left = 40;
      box.top = 15;
      screen.render();
      await capture(); // Frame 3: Moved to (40, 15)

      // Move back to top-left
      box.left = 5;
      box.top = 2;
      screen.render();
      await capture(); // Frame 4: Moved to (5, 2)
    },
    "__tests__/vrt/fixtures/box-dragging.vrt.json",
  );

  createMultiFrameVRTTest(
    "scrollable text scrolls through content",
    async (screen, capture) => {
      const content = [
        "Line 1 - First line of content",
        "Line 2 - Second line",
        "Line 3 - Third line",
        "Line 4 - Fourth line",
        "Line 5 - Fifth line",
        "Line 6 - Sixth line",
        "Line 7 - Seventh line",
        "Line 8 - Eighth line",
        "Line 9 - Ninth line",
        "Line 10 - Tenth line",
      ].join("\n");

      const scrollable = new ScrollableText({
        parent: screen,
        top: 0,
        left: 0,
        width: 40,
        height: 6,
        content,
        border: { type: "line" },
        scrollbar: {
          ch: "█",
        },
        keys: true,
        vi: true,
      });

      screen.render();
      await capture(); // Frame 1: Top of content

      // Scroll down
      scrollable.scroll(2);
      screen.render();
      await capture(); // Frame 2: Scrolled down 2 lines

      // Scroll down more
      scrollable.scroll(2);
      screen.render();
      await capture(); // Frame 3: Scrolled down 4 lines total

      // Scroll back up
      scrollable.scroll(-3);
      screen.render();
      await capture(); // Frame 4: Scrolled back up
    },
    "__tests__/vrt/fixtures/scrollable-text.vrt.json",
  );

  createMultiFrameVRTTest(
    "box content updates dynamically",
    async (screen, capture) => {
      const box = new Box({
        parent: screen,
        top: "center",
        left: "center",
        width: 35,
        height: 8,
        content: "Initial Content",
        border: { type: "line" },
        tags: true,
        style: {
          fg: "white",
        },
      });

      screen.render();
      await capture(); // Frame 1: Initial content

      // Update content
      box.setContent("{bold}{cyan-fg}Updated Content{/}");
      screen.render();
      await capture(); // Frame 2: After update

      // Update again with more text
      box.setContent(
        ["{bold}Multiple Lines{/}", "", "Line 2", "Line 3"].join("\n"),
      );
      screen.render();
      await capture(); // Frame 3: Multi-line content

      // Clear content
      box.setContent("");
      screen.render();
      await capture(); // Frame 4: Empty
    },
    "__tests__/vrt/fixtures/dynamic-content.vrt.json",
  );
});
