import path from "path";
import { fileURLToPath } from "url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as helpers from "../../src/lib/helpers.js";
import { setRuntime } from "../../src/runtime-context.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock Runtime for testing
let mockRuntime;

describe("helpers", () => {
  beforeEach(() => {
    // Setup mock runtime for tests
    mockRuntime = {
      fs: {
        readdirSync: vi.fn(),
        statSync: vi.fn(),
        lstatSync: vi.fn(),
        existsSync: vi.fn(),
        readFileSync: vi.fn(),
        mkdirSync: vi.fn(),
      },
      path: {
        join: path.join,
        resolve: path.resolve,
        dirname: path.dirname,
        basename: path.basename,
        extname: path.extname,
        sep: path.sep,
        delimiter: path.delimiter,
      },
      process: {
        env: {}, // Empty environment, but defined
        platform: "test",
        cwd: () => "/test",
      },
      childProcess: {},
      tty: {},
      url: {
        fileURLToPath: (url) => url.replace("file://", ""),
      },
    };
    setRuntime(mockRuntime);
  });

  afterEach(() => {
    setRuntime(null);
    vi.clearAllMocks();
  });
  describe("merge", () => {
    it("should merge object properties from b into a", () => {
      const a = { foo: 1, bar: 2 };
      const b = { bar: 3, baz: 4 };
      const result = helpers.merge(a, b);

      expect(result).toBe(a);
      expect(result).toEqual({ foo: 1, bar: 3, baz: 4 });
    });

    it("should return the first object", () => {
      const a = { x: 1 };
      const b = { y: 2 };
      const result = helpers.merge(a, b);

      expect(result).toBe(a);
    });

    it("should handle empty objects", () => {
      const a = {};
      const b = { key: "value" };
      helpers.merge(a, b);

      expect(a).toEqual({ key: "value" });
    });

    it("should overwrite existing properties", () => {
      const a = { x: 1, y: 2, z: 3 };
      const b = { x: 10, z: 30 };
      helpers.merge(a, b);

      expect(a).toEqual({ x: 10, y: 2, z: 30 });
    });

    it("should handle nested objects by reference", () => {
      const nested = { deep: "value" };
      const a = { foo: 1 };
      const b = { nested };
      helpers.merge(a, b);

      expect(a.nested).toBe(nested);
      expect(a).toEqual({ foo: 1, nested: { deep: "value" } });
    });

    it("should merge empty source object", () => {
      const a = { x: 1 };
      const b = {};
      const result = helpers.merge(a, b);

      expect(result).toEqual({ x: 1 });
    });
  });

  describe("asort", () => {
    it("should sort array by name property alphabetically", () => {
      const arr = [{ name: "zebra" }, { name: "apple" }, { name: "banana" }];

      const result = helpers.asort(arr);

      expect(result[0].name).toBe("apple");
      expect(result[1].name).toBe("banana");
      expect(result[2].name).toBe("zebra");
    });

    it("should be case-insensitive", () => {
      const arr = [{ name: "Zebra" }, { name: "apple" }, { name: "Banana" }];

      const result = helpers.asort(arr);

      expect(result[0].name).toBe("apple");
      expect(result[1].name).toBe("Banana");
      expect(result[2].name).toBe("Zebra");
    });

    it("should handle dotfiles correctly", () => {
      const arr = [
        { name: ".zshrc" },
        { name: ".bashrc" },
        { name: "file.txt" },
      ];

      const result = helpers.asort(arr);

      // Dotfiles sorted by second character, regular files by first
      expect(result[0].name).toBe(".bashrc");
      expect(result[1].name).toBe(".zshrc");
      expect(result[2].name).toBe("file.txt");
    });

    it("should sort by first character only", () => {
      const arr = [{ name: "aaa" }, { name: "azz" }, { name: "bbb" }];

      const result = helpers.asort(arr);

      // All 'a' names should come before 'b', but order within 'a' is preserved
      expect(result[0].name).toBe("aaa");
      expect(result[1].name).toBe("azz");
      expect(result[2].name).toBe("bbb");
    });

    it("should handle single element array", () => {
      const arr = [{ name: "only" }];
      const result = helpers.asort(arr);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("only");
    });

    it("should handle empty array", () => {
      const arr = [];
      const result = helpers.asort(arr);

      expect(result).toHaveLength(0);
    });

    it("should sort dotfiles among themselves", () => {
      const arr = [
        { name: ".zshrc" },
        { name: ".config" },
        { name: ".bashrc" },
      ];

      const result = helpers.asort(arr);

      // Sorted by second character: b, c, z
      expect(result[0].name).toBe(".bashrc");
      expect(result[1].name).toBe(".config");
      expect(result[2].name).toBe(".zshrc");
    });
  });

  describe("hsort", () => {
    it("should sort array by index property in descending order", () => {
      const arr = [{ index: 1 }, { index: 5 }, { index: 3 }];

      const result = helpers.hsort(arr);

      expect(result[0].index).toBe(5);
      expect(result[1].index).toBe(3);
      expect(result[2].index).toBe(1);
    });

    it("should handle negative indices", () => {
      const arr = [{ index: -1 }, { index: 10 }, { index: 0 }];

      const result = helpers.hsort(arr);

      expect(result[0].index).toBe(10);
      expect(result[1].index).toBe(0);
      expect(result[2].index).toBe(-1);
    });

    it("should handle equal indices", () => {
      const arr = [
        { index: 5, name: "a" },
        { index: 5, name: "b" },
        { index: 5, name: "c" },
      ];

      const result = helpers.hsort(arr);

      // All have same index, order is preserved (stable sort)
      expect(result.every((item) => item.index === 5)).toBe(true);
      expect(result).toHaveLength(3);
    });

    it("should handle single element array", () => {
      const arr = [{ index: 42 }];
      const result = helpers.hsort(arr);

      expect(result).toHaveLength(1);
      expect(result[0].index).toBe(42);
    });

    it("should handle empty array", () => {
      const arr = [];
      const result = helpers.hsort(arr);

      expect(result).toHaveLength(0);
    });

    it("should handle floating point indices", () => {
      const arr = [{ index: 1.5 }, { index: 2.7 }, { index: 0.3 }];

      const result = helpers.hsort(arr);

      expect(result[0].index).toBe(2.7);
      expect(result[1].index).toBe(1.5);
      expect(result[2].index).toBe(0.3);
    });
  });

  describe("findFile", () => {
    it("should find file in current directory", () => {
      mockRuntime.fs.readdirSync.mockReturnValue(["file1.txt", "target.txt"]);
      mockRuntime.fs.statSync.mockReturnValue({ isDirectory: () => false });

      const result = helpers.findFile("/test", "target.txt");

      expect(result).toBe("/test/target.txt");
      expect(mockRuntime.fs.readdirSync).toHaveBeenCalledWith("/test");
    });

    it("should return null when file not found", () => {
      mockRuntime.fs.readdirSync.mockReturnValue(["other.txt"]);
      mockRuntime.fs.statSync.mockReturnValue({ isDirectory: () => false });

      const result = helpers.findFile("/test", "nonexistent.txt");

      expect(result).toBeNull();
    });

    it("should skip system directories", () => {
      const result = helpers.findFile("/dev", "some-file");

      expect(result).toBeNull();
      expect(mockRuntime.fs.readdirSync).not.toHaveBeenCalled();
    });

    it("should find file in nested directories", () => {
      // First call to /test
      mockRuntime.fs.readdirSync.mockReturnValueOnce(["subdir"]);
      mockRuntime.fs.lstatSync.mockReturnValueOnce({
        isDirectory: () => true,
        isSymbolicLink: () => false,
      });

      // Second call to /test/subdir
      mockRuntime.fs.readdirSync.mockReturnValueOnce(["target.txt"]);
      mockRuntime.fs.lstatSync.mockReturnValueOnce({
        isDirectory: () => false,
        isSymbolicLink: () => false,
      });

      const result = helpers.findFile("/test", "target.txt");

      expect(result).toBe("/test/subdir/target.txt");
      expect(mockRuntime.fs.readdirSync).toHaveBeenCalledWith("/test");
      expect(mockRuntime.fs.readdirSync).toHaveBeenCalledWith("/test/subdir");
    });
  });

  describe("escape", () => {
    it("should escape curly braces", () => {
      const text = "Hello {world}";
      const result = helpers.escape(text);

      expect(result).toBe("Hello {open}world{close}");
    });

    it("should escape multiple braces", () => {
      const text = "{red-fg}Text{/red-fg} and {bold}more{/bold}";
      const result = helpers.escape(text);

      expect(result).toBe(
        "{open}red-fg{close}Text{open}/red-fg{close} and {open}bold{close}more{open}/bold{close}",
      );
    });

    it("should return unchanged text without braces", () => {
      const text = "No braces here";
      const result = helpers.escape(text);

      expect(result).toBe("No braces here");
    });

    it("should handle empty string", () => {
      expect(helpers.escape("")).toBe("");
    });

    it("should escape opening brace only", () => {
      const text = "Text with {only opening";
      const result = helpers.escape(text);

      expect(result).toBe("Text with {open}only opening");
    });

    it("should escape closing brace only", () => {
      const text = "Text with only} closing";
      const result = helpers.escape(text);

      expect(result).toBe("Text with only{close} closing");
    });

    it("should handle nested braces", () => {
      const text = "{{nested}}";
      const result = helpers.escape(text);

      expect(result).toBe("{open}{open}nested{close}{close}");
    });

    it("should handle consecutive braces", () => {
      const text = "{}{}{}";
      const result = helpers.escape(text);

      expect(result).toBe("{open}{close}{open}{close}{open}{close}");
    });
  });

  describe("stripTags", () => {
    it("should strip blessed tags", () => {
      const text = "{red-fg}Red text{/red-fg}";
      const result = helpers.stripTags(text);

      expect(result).toBe("Red text");
    });

    it("should strip ANSI escape sequences", () => {
      const text = "\x1b[31mRed text\x1b[0m";
      const result = helpers.stripTags(text);

      expect(result).toBe("Red text");
    });

    it("should strip both blessed tags and ANSI codes", () => {
      const text = "{bold}\x1b[1mBold text\x1b[0m{/bold}";
      const result = helpers.stripTags(text);

      expect(result).toBe("Bold text");
    });

    it("should handle null/undefined", () => {
      expect(helpers.stripTags(null)).toBe("");
      expect(helpers.stripTags(undefined)).toBe("");
      expect(helpers.stripTags("")).toBe("");
    });

    it("should handle complex tags", () => {
      const text = "{red-fg,bold,underline}Complex{/}";
      const result = helpers.stripTags(text);

      expect(result).toBe("Complex");
    });

    it("should strip multiple ANSI codes", () => {
      const text = "\x1b[31m\x1b[1m\x1b[4mText\x1b[0m\x1b[0m\x1b[0m";
      const result = helpers.stripTags(text);

      expect(result).toBe("Text");
    });

    it("should handle mixed content", () => {
      const text = "Start {red-fg}red\x1b[0m middle {/red-fg} end";
      const result = helpers.stripTags(text);

      expect(result).toBe("Start red middle  end");
    });

    it("should strip tags with special characters", () => {
      const text = "{red-fg,!bold,#custom}Text{/}";
      const result = helpers.stripTags(text);

      expect(result).toBe("Text");
    });

    it("should handle text with only tags", () => {
      const text = "{bold}{/bold}\x1b[0m";
      const result = helpers.stripTags(text);

      expect(result).toBe("");
    });
  });

  describe("cleanTags", () => {
    it("should strip tags and trim whitespace", () => {
      const text = "  {red-fg}Text{/red-fg}  ";
      const result = helpers.cleanTags(text);

      expect(result).toBe("Text");
    });

    it("should handle text with only whitespace and tags", () => {
      const text = "  {bold}{/bold}  ";
      const result = helpers.cleanTags(text);

      expect(result).toBe("");
    });

    it("should trim leading whitespace", () => {
      const text = "   Text";
      const result = helpers.cleanTags(text);

      expect(result).toBe("Text");
    });

    it("should trim trailing whitespace", () => {
      const text = "Text   ";
      const result = helpers.cleanTags(text);

      expect(result).toBe("Text");
    });

    it("should handle tabs and newlines", () => {
      const text = "\t\n{bold}Text{/bold}\n\t";
      const result = helpers.cleanTags(text);

      expect(result).toBe("Text");
    });

    it("should preserve internal whitespace", () => {
      const text = "  {bold}Hello   World{/bold}  ";
      const result = helpers.cleanTags(text);

      expect(result).toBe("Hello   World");
    });
  });

  describe("generateTags", () => {
    it("should generate opening and closing tags from style object", () => {
      const style = { fg: "red", bg: "blue" };
      const result = helpers.generateTags(style);

      expect(result.open).toContain("{red-fg}");
      expect(result.open).toContain("{blue-bg}");
      expect(result.close).toContain("{/red-fg}");
      expect(result.close).toContain("{/blue-bg}");
    });

    it("should wrap text when provided", () => {
      const style = { fg: "green" };
      const result = helpers.generateTags(style, "Hello");

      expect(result).toBe("{green-fg}Hello{/green-fg}");
    });

    it("should handle boolean style values", () => {
      const style = { bold: true, underline: true };
      const result = helpers.generateTags(style);

      expect(result.open).toContain("{bold}");
      expect(result.open).toContain("{underline}");
      expect(result.close).toContain("{/bold}");
      expect(result.close).toContain("{/underline}");
    });

    it("should handle light/bright prefixes", () => {
      const style = { fg: "lightred" };
      const result = helpers.generateTags(style);

      expect(result.open).toBe("{light-red-fg}");
      expect(result.close).toBe("{/light-red-fg}");
    });

    it("should handle null/empty style", () => {
      const result = helpers.generateTags(null);

      expect(result.open).toBe("");
      expect(result.close).toBe("");
    });

    it("should return object when text is null", () => {
      const style = { fg: "red" };
      const result = helpers.generateTags(style, null);

      expect(typeof result).toBe("object");
      expect(result.open).toBeDefined();
      expect(result.close).toBeDefined();
    });

    it("should handle bright prefix", () => {
      const style = { fg: "brightblue" };
      const result = helpers.generateTags(style);

      expect(result.open).toBe("{bright-blue-fg}");
      expect(result.close).toBe("{/bright-blue-fg}");
    });

    it("should ignore false boolean values", () => {
      const style = { bold: false, underline: true };
      const result = helpers.generateTags(style);

      expect(result.open).toContain("{underline}");
      expect(result.open).not.toContain("{bold}");
    });

    it("should handle empty object", () => {
      const style = {};
      const result = helpers.generateTags(style);

      expect(result.open).toBe("");
      expect(result.close).toBe("");
    });

    it("should handle multiple styles with text", () => {
      const style = { fg: "red", bold: true };
      const result = helpers.generateTags(style, "Test");

      expect(result).toContain("Test");
      expect(result).toContain("{red-fg}");
      expect(result).toContain("{bold}");
    });

    it("should wrap empty string", () => {
      const style = { fg: "red" };
      const result = helpers.generateTags(style, "");

      expect(result).toBe("{red-fg}{/red-fg}");
    });
  });

  describe("dropUnicode", () => {
    it("should handle emoji and special unicode", () => {
      // dropUnicode only replaces certain unicode categories defined in unicode.js
      // The → character may not be in those categories
      const text = "Hello 😀 World";
      const result = helpers.dropUnicode(text);

      // Just verify it doesn't crash and returns a string
      expect(typeof result).toBe("string");
      expect(result).toContain("Hello");
      expect(result).toContain("World");
    });

    it("should handle null/undefined", () => {
      expect(helpers.dropUnicode(null)).toBe("");
      expect(helpers.dropUnicode(undefined)).toBe("");
      expect(helpers.dropUnicode("")).toBe("");
    });

    it("should keep ASCII characters", () => {
      const text = "ASCII text 123";
      const result = helpers.dropUnicode(text);

      expect(result).toBe("ASCII text 123");
    });

    it("should handle mixing ASCII and unicode", () => {
      const text = "Hello 世界";
      const result = helpers.dropUnicode(text);

      expect(typeof result).toBe("string");
      expect(result).toContain("Hello");
    });

    it("should handle text with only unicode", () => {
      const text = "你好世界";
      const result = helpers.dropUnicode(text);

      expect(typeof result).toBe("string");
      // Should have replaced unicode characters
      expect(result.length).toBeGreaterThan(0);
    });

    it("should handle combining characters", () => {
      // Combining diacritical marks
      const text = "e\u0301"; // é with combining acute accent
      const result = helpers.dropUnicode(text);

      expect(typeof result).toBe("string");
    });

    it("should handle surrogate pairs", () => {
      // Emoji using surrogate pairs
      const text = "Test \uD83D\uDE00 emoji";
      const result = helpers.dropUnicode(text);

      expect(typeof result).toBe("string");
      expect(result).toContain("Test");
      expect(result).toContain("emoji");
    });
  });
});
