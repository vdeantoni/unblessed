import { describe, expect, it } from "vitest";
import { createFilesystem } from "../../../src/polyfills/fs-helper";

describe("polyfills/fs", () => {
  const fs = createFilesystem();

  describe("readFileSync", () => {
    it("returns terminfo data for xterm paths", () => {
      const result = fs.readFileSync("/usr/share/terminfo/x/xterm-256color");
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Uint8Array); // Buffer extends Uint8Array
      expect(result.length).toBeGreaterThan(0);
    });

    it("throws for non-terminfo paths", () => {
      expect(() => fs.readFileSync("/etc/passwd")).toThrow();
      expect(() => fs.readFileSync("/home/user/file.txt")).toThrow();
    });
  });

  describe("readdirSync", () => {
    it("returns xterm variants for terminfo directories", () => {
      const result = fs.readdirSync("/usr/share/terminfo/x");
      expect(result).toEqual(["xterm", "xterm-256color", "xterm-color"]);
    });

    it("throws for non-terminfo directories", () => {
      expect(() => fs.readdirSync("/etc")).toThrow();
      expect(() => fs.readdirSync("/home")).toThrow();
    });
  });

  describe("existsSync", () => {
    it("returns true for xterm terminfo paths", () => {
      expect(fs.existsSync("/usr/share/terminfo/x/xterm")).toBe(true);
      expect(fs.existsSync("/usr/share/terminfo/x/xterm-256color")).toBe(true);
      expect(fs.existsSync("/some/terminfo/path")).toBe(true);
    });

    it("returns false for other paths", () => {
      expect(fs.existsSync("/etc/passwd")).toBe(false);
      expect(fs.existsSync("/home/user/file.txt")).toBe(false);
    });
  });
});
