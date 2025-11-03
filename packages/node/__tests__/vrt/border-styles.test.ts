/**
 * VRT Border Styles Tests for @unblessed/node
 *
 * Visual regression tests for all border styles (single, double, round, bold, etc.).
 */

import { setRuntime } from "@unblessed/core";
import { describe } from "vitest";
import { Box } from "../../dist/index.js";
import { NodeRuntime } from "../../src";
import { createVRTTest } from "../helpers/vrt-test.js";

describe("VRT - Border Styles", () => {
  setRuntime(new NodeRuntime());

  createVRTTest(
    "all border styles showcase",
    async (screen) => {
      const styles: Array<{
        name: string;
        style: any;
        col: number;
        row: number;
      }> = [
        { name: "single", style: "single", col: 0, row: 0 },
        { name: "double", style: "double", col: 20, row: 0 },
        { name: "round", style: "round", col: 40, row: 0 },
        { name: "bold", style: "bold", col: 60, row: 0 },
        { name: "singleDouble", style: "singleDouble", col: 0, row: 9 },
        { name: "doubleSingle", style: "doubleSingle", col: 20, row: 9 },
        { name: "classic", style: "classic", col: 40, row: 9 },
        { name: "arrow", style: "arrow", col: 60, row: 9 },
      ];

      for (const { name, style, col, row } of styles) {
        new Box({
          parent: screen,
          top: row,
          left: col,
          width: 18,
          height: 7,
          content: `{center}{bold}${name}{/bold}{/center}`,
          tags: true,
          border: {
            type: "line",
            style: style,
          },
          style: {
            border: { fg: "cyan" },
            fg: "white",
          },
        });
      }

      screen.render();
    },
    "__tests__/vrt/fixtures/border-styles-showcase.vrt.json",
  );

  createVRTTest(
    "border with per-side colors",
    async (screen) => {
      new Box({
        parent: screen,
        top: 2,
        left: 2,
        width: 30,
        height: 10,
        content: "{center}{bold}Per-side Colors{/bold}{/center}",
        tags: true,
        border: {
          type: "line",
          style: "single",
          topColor: "red",
          bottomColor: "green",
          leftColor: "blue",
          rightColor: "yellow",
        },
        style: {
          fg: "white",
        },
      });

      new Box({
        parent: screen,
        top: 2,
        left: 35,
        width: 30,
        height: 10,
        content: "{center}{bold}Dim Borders{/bold}{/center}",
        tags: true,
        border: {
          type: "line",
          style: "double",
          dim: true,
        },
        style: {
          border: { fg: "cyan" },
          fg: "white",
        },
      });

      screen.render();
    },
    "__tests__/vrt/fixtures/border-per-side-colors.vrt.json",
  );

  createVRTTest(
    "double border style variations",
    async (screen) => {
      // Standard double border
      new Box({
        parent: screen,
        top: 1,
        left: 1,
        width: 25,
        height: 7,
        content: "{center}Double{/center}",
        tags: true,
        border: {
          type: "line",
          style: "double",
        },
        style: {
          border: { fg: "magenta" },
          fg: "white",
        },
      });

      // Double border with color
      new Box({
        parent: screen,
        top: 1,
        left: 28,
        width: 25,
        height: 7,
        content: "{center}Double + Color{/center}",
        tags: true,
        border: {
          type: "line",
          style: "double",
        },
        style: {
          border: { fg: "green" },
          fg: "white",
        },
      });

      // Double border with partial sides
      new Box({
        parent: screen,
        top: 9,
        left: 1,
        width: 25,
        height: 7,
        content: "{center}Top + Bottom{/center}",
        tags: true,
        border: {
          type: "line",
          style: "double",
          left: false,
          right: false,
        },
        style: {
          border: { fg: "yellow" },
          fg: "white",
        },
      });

      screen.render();
    },
    "__tests__/vrt/fixtures/border-double-variations.vrt.json",
  );

  createVRTTest(
    "round border style variations",
    async (screen) => {
      // Standard round border
      new Box({
        parent: screen,
        top: 1,
        left: 1,
        width: 25,
        height: 7,
        content: "{center}Rounded{/center}",
        tags: true,
        border: {
          type: "line",
          style: "round",
        },
        style: {
          border: { fg: "cyan" },
          fg: "white",
        },
      });

      // Round with colored sides
      new Box({
        parent: screen,
        top: 1,
        left: 28,
        width: 25,
        height: 7,
        content: "{center}Round + Colors{/center}",
        tags: true,
        border: {
          type: "line",
          style: "round",
          topColor: "red",
          bottomColor: "blue",
        },
        style: {
          fg: "white",
        },
      });

      screen.render();
    },
    "__tests__/vrt/fixtures/border-round-variations.vrt.json",
  );

  createVRTTest(
    "bold border style variations",
    async (screen) => {
      // Standard bold border
      new Box({
        parent: screen,
        top: 1,
        left: 1,
        width: 25,
        height: 7,
        content: "{center}Bold{/center}",
        tags: true,
        border: {
          type: "line",
          style: "bold",
        },
        style: {
          border: { fg: "red" },
          fg: "white",
        },
      });

      // Bold with dim
      new Box({
        parent: screen,
        top: 1,
        left: 28,
        width: 25,
        height: 7,
        content: "{center}Bold + Dim{/center}",
        tags: true,
        border: {
          type: "line",
          style: "bold",
          dim: true,
        },
        style: {
          border: { fg: "red" },
          fg: "white",
        },
      });

      screen.render();
    },
    "__tests__/vrt/fixtures/border-bold-variations.vrt.json",
  );

  createVRTTest(
    "classic ASCII border",
    async (screen) => {
      new Box({
        parent: screen,
        top: 2,
        left: "center",
        width: 40,
        height: 10,
        content: [
          "{center}{bold}Classic ASCII Border{/bold}{/center}",
          "",
          "Perfect for compatibility",
          "with limited terminals",
        ].join("\n"),
        tags: true,
        border: {
          type: "line",
          style: "classic",
        },
        style: {
          border: { fg: "green" },
          fg: "white",
        },
        padding: { left: 2, right: 2, top: 1, bottom: 1 },
      });

      screen.render();
    },
    "__tests__/vrt/fixtures/border-classic.vrt.json",
  );
});
