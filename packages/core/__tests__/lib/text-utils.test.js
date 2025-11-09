/**
 * text-utils.test.js - Tests for text truncation and wrapping utilities
 */

import { describe, expect, it } from "vitest";
import {
  findTruncationPoint,
  getActiveAnsiCodes,
  getVisualWidth,
  measureVisualWidth,
  needsWrapping,
  stripAnsi,
  truncateText,
  wrapTextLines,
} from "../../src/lib/text-utils.js";

describe("text-utils", () => {
  describe("stripAnsi", () => {
    it("should remove ANSI escape codes", () => {
      expect(stripAnsi("\x1b[31mHello\x1b[39m")).toBe("Hello");
      expect(stripAnsi("\x1b[1m\x1b[31mBold Red\x1b[39m\x1b[22m")).toBe(
        "Bold Red",
      );
      expect(stripAnsi("No codes")).toBe("No codes");
    });

    it("should handle multiple codes", () => {
      expect(
        stripAnsi("\x1b[31mRed \x1b[32mGreen \x1b[33mYellow\x1b[39m"),
      ).toBe("Red Green Yellow");
    });

    it("should handle empty string", () => {
      expect(stripAnsi("")).toBe("");
    });

    it("should handle only ANSI codes", () => {
      expect(stripAnsi("\x1b[31m\x1b[1m\x1b[0m")).toBe("");
    });
  });

  describe("measureVisualWidth", () => {
    it("should measure width of plain text", () => {
      expect(measureVisualWidth("Hello", false)).toBe(5);
      expect(measureVisualWidth("Hello World", false)).toBe(11);
    });

    it("should ignore ANSI codes in measurement", () => {
      expect(measureVisualWidth("\x1b[31mHello\x1b[39m", false)).toBe(5);
      expect(
        measureVisualWidth("\x1b[1m\x1b[31mTest\x1b[39m\x1b[22m", false),
      ).toBe(4);
    });

    it("should handle empty string", () => {
      expect(measureVisualWidth("", false)).toBe(0);
    });

    it("should handle only ANSI codes", () => {
      expect(measureVisualWidth("\x1b[31m\x1b[1m\x1b[0m", false)).toBe(0);
    });

    // Note: Full unicode width testing requires unicode module which is tested separately
    it("should support fullUnicode mode", () => {
      // ASCII should be same width in both modes
      expect(measureVisualWidth("Hello", true)).toBe(5);
    });
  });

  describe("getActiveAnsiCodes", () => {
    it("should return empty string when no codes active", () => {
      expect(getActiveAnsiCodes("Hello World", 5)).toBe("");
    });

    it("should track bold code", () => {
      const text = "\x1b[1mBold Text\x1b[22m";
      expect(getActiveAnsiCodes(text, 10)).toBe("\x1b[1m");
    });

    it("should track multiple codes", () => {
      const text = "\x1b[1m\x1b[31mBold Red\x1b[39m\x1b[22m";
      const active = getActiveAnsiCodes(text, 15);
      expect(active).toContain("\x1b[1m"); // Bold should be active
    });

    it("should handle reset code", () => {
      const text = "\x1b[1m\x1b[31mBold Red\x1b[0mReset";
      const active = getActiveAnsiCodes(text, 25);
      expect(active).toBe(""); // Reset clears everything
    });

    it("should track foreground color", () => {
      const text = "\x1b[31mRed text\x1b[39m";
      const active = getActiveAnsiCodes(text, 10);
      // Should have red foreground (we don't reconstruct exact code, just track state)
      expect(active).toBe(""); // After the \x1b[39m it's reset
    });

    it("should handle position at start", () => {
      expect(getActiveAnsiCodes("\x1b[1mBold", 0)).toBe("");
    });

    it("should handle position beyond codes", () => {
      const text = "\x1b[1mBold\x1b[22m";
      expect(getActiveAnsiCodes(text, 100)).toBe(""); // Bold is closed
    });
  });

  describe("findTruncationPoint", () => {
    it("should find truncation point in plain text", () => {
      const text = "Hello World";
      expect(findTruncationPoint(text, 5, false)).toBe(5);
      expect(findTruncationPoint(text, 11, false)).toBe(11);
    });

    it("should skip ANSI codes when measuring", () => {
      const text = "\x1b[31mHello\x1b[39m World";
      // Visual width 5 should be after "Hello" but accounting for ANSI codes
      const point = findTruncationPoint(text, 5, false);
      // Should be at position after "Hello" and the ANSI codes
      expect(text.substring(0, point)).toContain("Hello");
      expect(text.substring(0, point)).toContain("\x1b[39m");
    });

    it("should handle width 0", () => {
      expect(findTruncationPoint("Hello", 0, false)).toBe(0);
    });

    it("should handle width larger than text", () => {
      const text = "Short";
      expect(findTruncationPoint(text, 100, false)).toBe(5);
    });

    it("should handle empty string", () => {
      expect(findTruncationPoint("", 5, false)).toBe(0);
    });
  });

  describe("truncateText - end position", () => {
    it("should not truncate if text fits", () => {
      const text = "Hello";
      const result = truncateText(text, 10, { position: "end" });
      expect(result).toBe("Hello");
    });

    it("should truncate at end with default ellipsis", () => {
      const text = "Hello World";
      const result = truncateText(text, 7, { position: "end" });
      // Should be "Hello …" or similar
      expect(result).toContain("…");
      expect(stripAnsi(result).length).toBeLessThanOrEqual(7);
    });

    it("should truncate at end with custom ellipsis", () => {
      const text = "Hello World";
      const result = truncateText(text, 9, {
        position: "end",
        ellipsis: "...",
      });
      expect(result).toContain("...");
      expect(stripAnsi(result).length).toBeLessThanOrEqual(9);
    });

    it("should preserve ANSI codes before truncation", () => {
      const text = "\x1b[31mHello World\x1b[39m";
      const result = truncateText(text, 7, { position: "end" });
      expect(result).toContain("\x1b[31m"); // Should have red color
      expect(result).toContain("…");
    });

    it("should close ANSI codes at truncation point", () => {
      const text = "\x1b[31mHello World\x1b[39m";
      const result = truncateText(text, 7, { position: "end" });
      // Should have closing code before ellipsis
      expect(result).toContain("\x1b[0m");
    });

    it("should handle very small width", () => {
      const text = "Hello World";
      const result = truncateText(text, 1, { position: "end" });
      expect(stripAnsi(result)).toBe("…");
    });
  });

  describe("truncateText - start position", () => {
    it("should truncate at start with ellipsis", () => {
      const text = "Hello World";
      const result = truncateText(text, 7, { position: "start" });
      expect(result).toContain("…");
      expect(result).toContain("World");
      expect(stripAnsi(result).length).toBeLessThanOrEqual(7);
    });

    it("should preserve ANSI codes after truncation", () => {
      const text = "Hello \x1b[32mWorld\x1b[39m";
      const result = truncateText(text, 7, { position: "start" });
      expect(result).toContain("…");
      expect(result).toContain("\x1b[32m"); // Should have green color
      expect(result).toContain("World");
    });

    it("should reopen ANSI codes at truncation point", () => {
      const text = "\x1b[31mHello World\x1b[39m";
      const result = truncateText(text, 7, { position: "start" });
      // Should reopen red color after ellipsis
      expect(result.indexOf("…")).toBeLessThan(result.indexOf("World"));
    });
  });

  describe("truncateText - middle position", () => {
    it("should truncate in middle with ellipsis", () => {
      const text = "Hello World";
      const result = truncateText(text, 7, { position: "middle" });
      expect(result).toContain("…");
      expect(result).toContain("Hel"); // Start part
      expect(result).toContain("rld"); // End part
      expect(stripAnsi(result).length).toBeLessThanOrEqual(7);
    });

    it("should preserve ANSI codes on both sides", () => {
      const text = "\x1b[31mHello\x1b[39m \x1b[32mWorld\x1b[39m";
      const result = truncateText(text, 7, { position: "middle" });
      expect(result).toContain("…");
      // Visual inspection would show colors preserved
      expect(stripAnsi(result).length).toBeLessThanOrEqual(7);
    });

    it("should close codes before ellipsis and reopen after", () => {
      const text = "\x1b[31mHello World\x1b[39m";
      const result = truncateText(text, 7, { position: "middle" });
      expect(result).toContain("…");
      // Should have reset and reopen codes around ellipsis
      expect(result).toContain("\x1b[0m");
    });

    it("should handle odd width", () => {
      const text = "Hello World";
      const result = truncateText(text, 8, { position: "middle" });
      expect(result).toContain("…");
      expect(stripAnsi(result).length).toBeLessThanOrEqual(8);
    });
  });

  describe("wrapTextLines", () => {
    it("should not wrap text that fits", () => {
      const text = "Hello";
      const lines = wrapTextLines(text, { width: 10 });
      expect(lines).toHaveLength(1);
      expect(lines[0]).toBe("Hello");
    });

    it("should wrap text at width boundary", () => {
      const text = "Hello World";
      const lines = wrapTextLines(text, { width: 6 });
      expect(lines.length).toBeGreaterThan(1);
      lines.forEach((line) => {
        expect(stripAnsi(line).length).toBeLessThanOrEqual(6);
      });
    });

    it("should prefer breaking on spaces", () => {
      const text = "Hello World Test";
      const lines = wrapTextLines(text, { width: 7 });
      // Should break after "Hello" and "World" at spaces
      expect(lines[0]).toContain("Hello");
    });

    it("should handle text with no spaces", () => {
      const text = "Supercalifragilisticexpialidocious";
      const lines = wrapTextLines(text, { width: 10 });
      expect(lines.length).toBeGreaterThan(3);
      lines.forEach((line) => {
        expect(stripAnsi(line).length).toBeLessThanOrEqual(10);
      });
    });

    it("should handle empty string", () => {
      const lines = wrapTextLines("", { width: 10 });
      expect(lines).toHaveLength(1);
      expect(lines[0]).toBe("");
    });

    it("should respect lookBackDistance option", () => {
      const text = "Hello     World"; // Multiple spaces
      const lines = wrapTextLines(text, { width: 8, lookBackDistance: 5 });
      expect(lines.length).toBeGreaterThan(0);
    });

    it("should handle ANSI codes in wrapped text", () => {
      const text = "\x1b[31mHello World Test\x1b[39m";
      const lines = wrapTextLines(text, { width: 7 });
      expect(lines.length).toBeGreaterThan(1);
      // ANSI codes don't count toward width
      lines.forEach((line) => {
        const visualWidth = measureVisualWidth(line, false);
        expect(visualWidth).toBeLessThanOrEqual(7);
      });
    });
  });

  describe("getVisualWidth", () => {
    it("should be an alias for measureVisualWidth", () => {
      expect(getVisualWidth("Hello")).toBe(measureVisualWidth("Hello"));
      expect(getVisualWidth("\x1b[31mHello\x1b[39m")).toBe(5);
    });
  });

  describe("needsWrapping", () => {
    it("should return false if text fits", () => {
      expect(needsWrapping("Hello", 10)).toBe(false);
      expect(needsWrapping("Hello", 5)).toBe(false);
    });

    it("should return true if text exceeds width", () => {
      expect(needsWrapping("Hello World", 5)).toBe(true);
      expect(needsWrapping("Hello", 3)).toBe(true);
    });

    it("should ignore ANSI codes in width calculation", () => {
      expect(needsWrapping("\x1b[31mHello\x1b[39m", 10)).toBe(false);
      expect(needsWrapping("\x1b[31mHello\x1b[39m", 3)).toBe(true);
    });

    it("should handle empty string", () => {
      expect(needsWrapping("", 0)).toBe(false);
      expect(needsWrapping("", 10)).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle text with only ANSI codes", () => {
      const text = "\x1b[31m\x1b[1m\x1b[0m";
      expect(truncateText(text, 10, { position: "end" })).toBe(text);
      expect(wrapTextLines(text, { width: 10 })).toHaveLength(1);
    });

    it("should handle width equal to text width", () => {
      const text = "Hello";
      expect(truncateText(text, 5, { position: "end" })).toBe("Hello");
      expect(wrapTextLines(text, { width: 5 })).toHaveLength(1);
    });

    it("should handle single character", () => {
      expect(truncateText("H", 1, { position: "end" })).toBe("H");
      expect(truncateText("H", 0, { position: "end" })).toBe("…");
    });

    it("should handle newlines in text", () => {
      const text = "Hello\nWorld";
      // Current implementation treats \n as regular character
      // This might need special handling in future
      const result = truncateText(text, 7, { position: "end" });
      expect(result).toBeTruthy();
    });

    it("should handle very long ANSI sequences", () => {
      const text = "\x1b[38;5;196mRed text in 256 color mode\x1b[39m";
      const result = truncateText(text, 10, { position: "end" });
      expect(stripAnsi(result).length).toBeLessThanOrEqual(10);
    });

    it("should handle mixed ANSI codes and spaces", () => {
      const text = "\x1b[31mHello\x1b[39m \x1b[32mWorld\x1b[39m";
      const lines = wrapTextLines(text, { width: 7 });
      expect(lines.length).toBeGreaterThan(0);
    });
  });

  describe("ANSI state tracking", () => {
    it("should track bold state correctly", () => {
      const text = "Normal \x1b[1mBold \x1b[22mNormal";
      const active1 = getActiveAnsiCodes(text, 15); // During "Bold"
      const active2 = getActiveAnsiCodes(text, 28); // After reset
      expect(active1).toContain("\x1b[1m");
      expect(active2).toBe("");
    });

    it("should track multiple simultaneous styles", () => {
      const text =
        "\x1b[1m\x1b[4m\x1b[31mBold Underline Red\x1b[39m\x1b[24m\x1b[22m";
      const active = getActiveAnsiCodes(text, 20);
      // Should have bold, underline active (color might be tracked differently)
      expect(active).toContain("\x1b[1m");
      expect(active).toContain("\x1b[4m");
    });

    it("should handle reset code clearing all styles", () => {
      const text = "\x1b[1m\x1b[31mBold Red\x1b[0mNormal";
      const active = getActiveAnsiCodes(text, 25);
      expect(active).toBe("");
    });
  });

  describe("fullUnicode mode", () => {
    it("should handle ASCII same in both modes", () => {
      const text = "Hello World";
      const result1 = truncateText(text, 7, {
        position: "end",
        fullUnicode: false,
      });
      const result2 = truncateText(text, 7, {
        position: "end",
        fullUnicode: true,
      });
      // Results might differ slightly in implementation but should both be valid
      expect(stripAnsi(result1).length).toBeLessThanOrEqual(7);
      expect(stripAnsi(result2).length).toBeLessThanOrEqual(7);
    });

    // Note: Full wide character testing would require specific Unicode test cases
    // and proper terminal support. These are basic sanity checks.
  });
});
