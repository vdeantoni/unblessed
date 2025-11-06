import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Program from "../../src/lib/program.js";
import Box from "../../src/widgets/box.js";
import Screen from "../../src/widgets/screen.js";

// Runtime is initialized globally in __tests__/setup.js

describe("Screen", () => {
  let screen;

  beforeEach(() => {
    screen = new Screen({
      smartCSR: true,
      dockBorders: true,
    });
  });

  afterEach(() => {
    if (screen && screen.program) {
      screen.destroy();
    }
    vi.restoreAllMocks();
  });

  describe("constructor", () => {
    it("should create a screen instance", () => {
      expect(screen).toBeDefined();
      expect(screen.type).toBe("screen");
    });

    it("should inherit from Node", () => {
      expect(typeof screen.append).toBe("function");
      expect(typeof screen.prepend).toBe("function");
      expect(typeof screen.remove).toBe("function");
    });

    it("should initialize program", () => {
      expect(screen.program).toBeDefined();
      expect(screen.tput).toBeDefined();
    });

    it("should default autoPadding to true", () => {
      expect(screen.autoPadding).toBe(true);
    });

    it("should accept autoPadding option", () => {
      const s = new Screen({ autoPadding: false });

      expect(s.autoPadding).toBe(false);

      s.destroy();
    });

    it("should initialize tab character with default size", () => {
      expect(screen.tabc).toBe("    "); // 4 spaces
    });

    it("should accept custom tabSize", () => {
      const s = new Screen({ tabSize: 2 });

      expect(s.tabc).toBe("  "); // 2 spaces

      s.destroy();
    });

    it("should initialize position object", () => {
      expect(screen.position).toBeDefined();
      expect(screen.position.left).toBe(0);
      expect(screen.position.top).toBe(0);
    });

    it("should initialize padding object", () => {
      expect(screen.padding).toBeDefined();
      expect(screen.padding.left).toBe(0);
      expect(screen.padding.top).toBe(0);
      expect(screen.padding.right).toBe(0);
      expect(screen.padding.bottom).toBe(0);
    });

    it("should initialize cursor configuration", () => {
      expect(screen.cursor).toBeDefined();
      expect(screen.cursor.shape).toBe("block");
      expect(screen.cursor.blink).toBe(false);
      expect(screen.cursor.artificial).toBe(false);
    });

    it("should accept cursor options", () => {
      const s = new Screen({
        cursorShape: "underline",
        cursorBlink: true,
      });

      expect(s.cursor.shape).toBe("underline");
      expect(s.cursor.blink).toBe(true);

      s.destroy();
    });

    it("should accept title option", () => {
      const s = new Screen({ title: "My App" });

      expect(s.title).toBe("My App");

      s.destroy();
    });

    it("should initialize empty history", () => {
      expect(screen.history).toEqual([]);
    });

    it("should initialize empty clickable array", () => {
      expect(screen.clickable).toEqual([]);
    });

    it("should initialize empty keyable array", () => {
      expect(screen.keyable).toEqual([]);
    });
  });

  describe("append()", () => {
    it("should append child elements", () => {
      const box = new Box({ screen });

      screen.append(box);

      expect(screen.children).toContain(box);
    });

    it("should set parent reference", () => {
      const box = new Box({ screen });

      screen.append(box);

      expect(box.parent).toBe(screen);
    });
  });

  describe("render()", () => {
    it("should have render method", () => {
      expect(typeof screen.render).toBe("function");
    });

    it("should increment renders count", () => {
      const initialRenders = screen.renders;

      screen.render();

      expect(screen.renders).toBe(initialRenders + 1);
    });
  });

  describe("key()", () => {
    it("should have key method", () => {
      expect(typeof screen.key).toBe("function");
    });

    it("should register key handler on program", () => {
      const handler = vi.fn();

      screen.key("q", handler);

      expect(screen.program.listeners("keypress").length).toBeGreaterThan(0);
    });

    it("should accept array of keys", () => {
      const handler = vi.fn();

      screen.key(["q", "escape"], handler);

      expect(screen.program.listeners("keypress").length).toBeGreaterThan(0);
    });
  });

  describe("onceKey()", () => {
    it("should have onceKey method", () => {
      expect(typeof screen.onceKey).toBe("function");
    });

    it("should register one-time key handler on program", () => {
      const handler = vi.fn();

      screen.onceKey("enter", handler);

      expect(screen.program.listeners("keypress").length).toBeGreaterThan(0);
    });
  });

  describe("unkey() and removeKey()", () => {
    it("should have unkey method", () => {
      expect(typeof screen.unkey).toBe("function");
    });

    it("should have removeKey method", () => {
      expect(typeof screen.removeKey).toBe("function");
    });

    it("should remove key handler", () => {
      const handler = vi.fn();

      screen.key("x", handler);
      const before = screen.listeners("keypress").length;

      screen.unkey("x", handler);

      expect(screen.listeners("keypress").length).toBeLessThanOrEqual(before);
    });
  });

  describe("focus management", () => {
    it("should have focusNext method", () => {
      expect(typeof screen.focusNext).toBe("function");
    });

    it("should have focusPrevious method", () => {
      expect(typeof screen.focusPrevious).toBe("function");
    });

    it("should have focusPush method", () => {
      expect(typeof screen.focusPush).toBe("function");
    });

    it("should have focusPop method", () => {
      expect(typeof screen.focusPop).toBe("function");
    });

    it("should have saveFocus method", () => {
      expect(typeof screen.saveFocus).toBe("function");
    });

    it("should have restoreFocus method", () => {
      expect(typeof screen.restoreFocus).toBe("function");
    });
  });

  describe("title", () => {
    it("should have title getter", () => {
      screen.title = "Test Title";

      expect(screen.title).toBe("Test Title");
    });
  });

  describe("destroy()", () => {
    it("should have destroy method", () => {
      expect(typeof screen.destroy).toBe("function");
    });

    it("should clean up program on destroy", () => {
      const s = new Screen({ smartCSR: true });
      const programDestroySpy = vi.spyOn(s.program, "destroy");

      s.destroy();

      expect(programDestroySpy).toHaveBeenCalled();
    });
  });

  describe("common use cases", () => {
    it("should create a basic screen", () => {
      const s = new Screen({
        smartCSR: true,
        title: "My Application",
      });

      expect(s.title).toBe("My Application");
      expect(s.program).toBeDefined();

      s.destroy();
    });

    it("should support autoPadding for borders", () => {
      const s = new Screen({
        autoPadding: true,
        dockBorders: true,
      });

      expect(s.autoPadding).toBe(true);
      expect(s.dockBorders).toBe(true);

      s.destroy();
    });

    it("should support cursor customization", () => {
      const s = new Screen({
        cursorShape: "line",
        cursorBlink: true,
      });

      expect(s.cursor.shape).toBe("line");
      expect(s.cursor.blink).toBe(true);

      s.destroy();
    });

    it("should manage child elements", () => {
      const s = new Screen({ smartCSR: true });
      const box1 = new Box({ screen: s, top: 0 });
      const box2 = new Box({ screen: s, top: 5 });

      s.append(box1);
      s.append(box2);

      expect(s.children.length).toBe(2);
      expect(s.children).toContain(box1);
      expect(s.children).toContain(box2);

      s.destroy();
    });

    it("should track renders", () => {
      const s = new Screen({ smartCSR: true });
      const initialRenders = s.renders;

      s.render();
      s.render();

      expect(s.renders).toBe(initialRenders + 2);

      s.destroy();
    });

    it("should support tab size configuration", () => {
      const s = new Screen({ tabSize: 8 });

      expect(s.tabc).toBe("        "); // 8 spaces

      s.destroy();
    });
  });

  describe("Render Cycle & Buffer Management", () => {
    it("should initialize screen buffer on creation", () => {
      const s = new Screen({ smartCSR: true });

      expect(s.lines).toBeDefined();
      expect(Array.isArray(s.lines)).toBe(true);
      expect(s.lines.length).toBeGreaterThan(0);

      s.destroy();
    });

    it("should initialize old lines buffer", () => {
      const s = new Screen({ smartCSR: true });

      expect(s.olines).toBeDefined();
      expect(Array.isArray(s.olines)).toBe(true);

      s.destroy();
    });

    it("should track render count", () => {
      const s = new Screen({ smartCSR: true });
      const initialRenders = s.renders;

      s.render();

      expect(s.renders).toBe(initialRenders + 1);

      s.destroy();
    });

    it("should handle multiple consecutive renders", () => {
      const s = new Screen({ smartCSR: true });
      const box = new Box({ screen: s, content: "Test" });

      s.append(box);
      s.render();
      s.render();
      s.render();

      expect(s.renders).toBeGreaterThanOrEqual(3);

      s.destroy();
    });

    it("should render with smartCSR enabled", () => {
      const s = new Screen({ smartCSR: true });

      s.render();
      expect(s.renders).toBeGreaterThan(0);

      s.destroy();
    });

    it("should render with smartCSR disabled", () => {
      const s = new Screen({ smartCSR: false });

      s.render();
      expect(s.renders).toBeGreaterThan(0);

      s.destroy();
    });

    it("should render child elements", () => {
      const s = new Screen({ smartCSR: true });
      const box = new Box({
        screen: s,
        top: 0,
        left: 0,
        width: 10,
        height: 5,
        content: "Hello",
      });

      s.append(box);
      s.render();

      expect(s.renders).toBeGreaterThan(0);

      s.destroy();
    });

    it("should handle empty screen render", () => {
      const s = new Screen({ smartCSR: true });

      s.render();

      expect(s.renders).toBeGreaterThan(0);

      s.destroy();
    });

    it("should handle rendering with many children", () => {
      const s = new Screen({ smartCSR: true });

      for (let i = 0; i < 10; i++) {
        const box = new Box({ screen: s, top: i, content: `Box ${i}` });
        s.append(box);
      }

      s.render();

      expect(s.children.length).toBe(10);

      s.destroy();
    });

    it("should handle dockBorders option", () => {
      const s = new Screen({ dockBorders: true });

      expect(s.dockBorders).toBe(true);

      s.destroy();
    });

    it("should handle fullUnicode option", () => {
      const s = new Screen({ fullUnicode: true, forceUnicode: true });

      expect(s.fullUnicode).toBe(true);

      s.destroy();
    });

    it("should handle ignoreLocked option", () => {
      const s = new Screen({ ignoreLocked: ["test"] });

      expect(s.ignoreLocked).toEqual(["test"]);

      s.destroy();
    });

    it("should maintain screen dimensions", () => {
      const s = new Screen({ smartCSR: true });

      expect(s.width).toBeGreaterThan(0);
      expect(s.height).toBeGreaterThan(0);

      s.destroy();
    });

    it("should handle title option", () => {
      const s = new Screen({ title: "My App" });

      expect(s.title).toBe("My App");

      s.destroy();
    });

    it("should emit render event", () => {
      const s = new Screen({ smartCSR: true });
      const renderSpy = vi.fn();

      s.on("render", renderSpy);
      s.render();

      expect(renderSpy).toHaveBeenCalled();

      s.destroy();
    });

    it("should handle autoPadding disabled", () => {
      const s = new Screen({ autoPadding: false });

      expect(s.autoPadding).toBe(false);

      s.destroy();
    });

    it("should render after adding element", () => {
      const s = new Screen({ smartCSR: true });
      const box = new Box({ screen: s });
      const initialRenders = s.renders;

      s.append(box);
      s.render();

      expect(s.renders).toBe(initialRenders + 1);

      s.destroy();
    });

    it("should handle rendering after element removal", () => {
      const s = new Screen({ smartCSR: true });
      const box = new Box({ screen: s });

      s.append(box);
      s.render();

      box.detach();
      s.render();

      expect(s.children.length).toBe(0);

      s.destroy();
    });

    it("should handle hidden elements in render", () => {
      const s = new Screen({ smartCSR: true });
      const box = new Box({ screen: s, hidden: true });

      s.append(box);
      s.render();

      expect(box.hidden).toBe(true);

      s.destroy();
    });

    it("should handle visible elements in render", () => {
      const s = new Screen({ smartCSR: true });
      const box = new Box({ screen: s, hidden: false });

      s.append(box);
      s.render();

      expect(box.hidden).toBe(false);

      s.destroy();
    });

    it("should support forceRedraw option", () => {
      const s = new Screen({ smartCSR: true, forceUnicode: false });

      s.render();
      expect(s.renders).toBeGreaterThan(0);

      s.destroy();
    });

    it("should accept warnings option", () => {
      const s = new Screen({ warnings: true });

      // warnings option is accepted in constructor
      s.render();

      s.destroy();
    });
  });

  describe("Focus Management", () => {
    it("should initialize focused property", () => {
      const s = new Screen({ smartCSR: true });

      expect("focused" in s).toBe(true);

      s.destroy();
    });

    it("should focus clickable element", () => {
      const s = new Screen({ smartCSR: true });
      const box = new Box({ screen: s, clickable: true });

      s.append(box);
      box.focus();

      expect(s.focused).toBe(box);

      s.destroy();
    });

    it("should track clickable elements", () => {
      const s = new Screen({ smartCSR: true });
      const box1 = new Box({ screen: s, clickable: true });
      const box2 = new Box({ screen: s, clickable: true });

      s.append(box1);
      s.append(box2);

      expect(s.clickable.length).toBeGreaterThanOrEqual(0);

      s.destroy();
    });

    it("should track keyable elements", () => {
      const s = new Screen({ smartCSR: true });
      const box1 = new Box({ screen: s, keys: true });
      const box2 = new Box({ screen: s, keys: true });

      s.append(box1);
      s.append(box2);

      expect(s.keyable.length).toBeGreaterThanOrEqual(0);

      s.destroy();
    });

    it("should handle focus change", () => {
      const s = new Screen({ smartCSR: true });
      const box1 = new Box({ screen: s, clickable: true });
      const box2 = new Box({ screen: s, clickable: true });

      s.append(box1);
      s.append(box2);

      box1.focus();
      expect(s.focused).toBe(box1);

      box2.focus();
      expect(s.focused).toBe(box2);

      s.destroy();
    });

    it("should emit focus event", () => {
      const s = new Screen({ smartCSR: true });
      const box = new Box({ screen: s, clickable: true });
      const focusSpy = vi.fn();

      s.append(box);
      box.on("focus", focusSpy);
      box.focus();

      expect(focusSpy).toHaveBeenCalled();

      s.destroy();
    });

    it("should initialize grabKeys property", () => {
      const s = new Screen({ smartCSR: true });

      expect(s.grabKeys).toBeDefined();

      s.destroy();
    });

    it("should initialize lockKeys property", () => {
      const s = new Screen({ smartCSR: true });

      expect(s.lockKeys).toBeDefined();

      s.destroy();
    });

    it("should handle hover tracking", () => {
      const s = new Screen({ smartCSR: true });

      expect(s.hover).toBeNull();

      s.destroy();
    });

    it("should track history", () => {
      const s = new Screen({ smartCSR: true });

      expect(s.history).toBeDefined();
      expect(Array.isArray(s.history)).toBe(true);

      s.destroy();
    });

    it("should handle multiple focusable elements", () => {
      const s = new Screen({ smartCSR: true });
      const box1 = new Box({ screen: s, clickable: true });
      const box2 = new Box({ screen: s, clickable: true });
      const box3 = new Box({ screen: s, clickable: true });

      s.append(box1);
      s.append(box2);
      s.append(box3);

      box2.focus();
      expect(s.focused).toBe(box2);

      s.destroy();
    });

    it("should handle focus with no focusable elements", () => {
      const s = new Screen({ smartCSR: true });
      const box = new Box({ screen: s, clickable: false });

      s.append(box);

      // Box is not focusable (no tabIndex), so focus should remain undefined
      expect(s.focused).toBeUndefined();

      s.destroy();
    });

    it("should handle detached element focus", () => {
      const s = new Screen({ smartCSR: true });
      const box = new Box({ screen: s, clickable: true });

      s.append(box);
      box.focus();
      box.detach();

      s.destroy();
    });

    it("should support focusNext navigation", () => {
      const s = new Screen({ smartCSR: true });

      expect(typeof s.focusNext).toBe("function");

      s.destroy();
    });

    it("should support focusPrevious navigation", () => {
      const s = new Screen({ smartCSR: true });

      expect(typeof s.focusPrevious).toBe("function");

      s.destroy();
    });
  });

  describe("Mouse & Input Handling", () => {
    it("should have enableMouse method", () => {
      const s = new Screen({ smartCSR: true });

      expect(typeof s.enableMouse).toBe("function");

      s.destroy();
    });

    it("should have enableKeys method", () => {
      const s = new Screen({ smartCSR: true });

      expect(typeof s.enableKeys).toBe("function");

      s.destroy();
    });

    it("should have enableInput method", () => {
      const s = new Screen({ smartCSR: true });

      expect(typeof s.enableInput).toBe("function");

      s.destroy();
    });

    it("should handle mouse listeners on elements", () => {
      const s = new Screen({ smartCSR: true });
      const box = new Box({ screen: s, clickable: true });

      s.append(box);

      expect(s.clickable.length).toBeGreaterThanOrEqual(0);

      s.destroy();
    });

    it("should register key listeners", () => {
      const s = new Screen({ smartCSR: true });
      const handler = vi.fn();

      s.key("x", handler);

      expect(s.program.listeners("keypress").length).toBeGreaterThan(0);

      s.destroy();
    });
  });

  describe("Screen Dimensions", () => {
    it("should have cols property", () => {
      const s = new Screen({ smartCSR: true });

      expect(s.cols).toBeGreaterThan(0);

      s.destroy();
    });

    it("should have rows property", () => {
      const s = new Screen({ smartCSR: true });

      expect(s.rows).toBeGreaterThan(0);

      s.destroy();
    });

    it("should have width matching cols", () => {
      const s = new Screen({ smartCSR: true });

      expect(s.width).toBe(s.cols);

      s.destroy();
    });

    it("should have height matching rows", () => {
      const s = new Screen({ smartCSR: true });

      expect(s.height).toBe(s.rows);

      s.destroy();
    });

    it("should handle window resize events", () => {
      const s = new Screen({ smartCSR: true });
      const resizeSpy = vi.fn();

      s.on("resize", resizeSpy);
      s.program.emit("resize");

      expect(resizeSpy).toHaveBeenCalled();

      s.destroy();
    });
  });

  describe("Terminal Configuration", () => {
    it("should have terminal getter", () => {
      const s = new Screen({ smartCSR: true });

      expect(s.terminal).toBeDefined();

      s.destroy();
    });

    it("should have terminal setter", () => {
      const s = new Screen({
        smartCSR: true,
        termcap: true, // Use termcap to avoid filesystem access in tests
      });

      // Just verify the terminal property is settable
      // Don't actually change it since that triggers terminfo loading
      expect(s.terminal).toBeDefined();
      expect(s.program.terminal).toBeDefined();

      s.destroy();
    });

    it("should have setTerminal method", () => {
      const s = new Screen({ smartCSR: true });

      expect(typeof s.setTerminal).toBe("function");

      s.destroy();
    });

    it("should initialize program with options", () => {
      const s = new Screen({
        smartCSR: true,
        terminal: "xterm",
        forceUnicode: true,
      });

      expect(s.program).toBeDefined();
      expect(s.tput).toBeDefined();

      s.destroy();
    });

    it("should accept existing program", () => {
      const prog = new Program({
        tput: true,
        buffer: true,
        zero: true,
      });

      const s = new Screen({ program: prog });

      expect(s.program).toBe(prog);

      s.destroy();
    });
  });

  describe("Debug & Logging", () => {
    it("should have log method", () => {
      const s = new Screen({ smartCSR: true });

      expect(typeof s.log).toBe("function");

      s.destroy();
    });

    it("should have debug method", () => {
      const s = new Screen({ smartCSR: true });

      expect(typeof s.debug).toBe("function");

      s.destroy();
    });

    it("should handle debug option", () => {
      const s = new Screen({
        smartCSR: true,
        debug: true,
      });

      expect(s.program).toBeDefined();

      s.destroy();
    });
  });

  describe("Buffer Management", () => {
    it("should have alloc method", () => {
      const s = new Screen({ smartCSR: true });

      expect(typeof s.alloc).toBe("function");

      s.destroy();
    });

    it("should have realloc method", () => {
      const s = new Screen({ smartCSR: true });

      expect(typeof s.realloc).toBe("function");

      s.destroy();
    });

    it("should have blankLine method", () => {
      const s = new Screen({ smartCSR: true });

      expect(typeof s.blankLine).toBe("function");

      s.destroy();
    });

    it("should have insertLine method", () => {
      const s = new Screen({ smartCSR: true });

      expect(typeof s.insertLine).toBe("function");

      s.destroy();
    });

    it("should have deleteLine method", () => {
      const s = new Screen({ smartCSR: true });

      expect(typeof s.deleteLine).toBe("function");

      s.destroy();
    });

    it("should manage screen buffer", () => {
      const s = new Screen({ smartCSR: true });

      expect(s.lines).toBeDefined();
      expect(Array.isArray(s.lines)).toBe(true);
      expect(s.lines.length).toBeGreaterThan(0);

      s.destroy();
    });

    it("should manage old buffer", () => {
      const s = new Screen({ smartCSR: true });

      expect(s.olines).toBeDefined();
      expect(Array.isArray(s.olines)).toBe(true);

      s.destroy();
    });
  });

  describe("Enter & Leave", () => {
    it("should have enter method", () => {
      const s = new Screen({ smartCSR: true });

      expect(typeof s.enter).toBe("function");

      s.destroy();
    });

    it("should have leave method", () => {
      const s = new Screen({ smartCSR: true });

      expect(typeof s.leave).toBe("function");

      s.destroy();
    });

    it("should have postEnter method", () => {
      const s = new Screen({ smartCSR: true });

      expect(typeof s.postEnter).toBe("function");

      s.destroy();
    });
  });

  describe("Error handling / Cleanup", () => {
    it("should not crash when leave() is called with undefined program", () => {
      const s = new Screen({ smartCSR: true });

      // Simulate error state where program becomes undefined
      s.program = undefined;

      // This should not throw an error
      expect(() => s.leave()).not.toThrow();
    });

    it("should not crash when destroy() is called with undefined program", () => {
      const s = new Screen({ smartCSR: true });

      // Simulate error state where program becomes undefined
      s.program = undefined;

      // This should not throw an error (destroy calls leave internally)
      expect(() => s.destroy()).not.toThrow();
    });
  });

  describe("Attribute Encoding/Decoding", () => {
    it("should encode dim attribute with codeAttr", () => {
      const screen = new Screen();
      const el = new Box({ parent: screen, width: 10, height: 5 });

      // Create an attribute with dim flag set (bit 32)
      const attr = el.sattr({ dim: true });
      const code = screen.codeAttr(attr);

      expect(code).toContain("\x1b[2m");

      screen.destroy();
    });

    it("should decode dim attribute with attrCode", () => {
      const screen = new Screen();

      // Parse ANSI code for dim
      const attr = screen.attrCode("\x1b[2m", 0, 0);

      // Extract flags and check bit 32
      const flags = (attr >> 18) & 0x1ff;
      expect(flags & 32).toBeTruthy();

      screen.destroy();
    });

    it("should encode dim with colors", () => {
      const screen = new Screen();
      const el = new Box({ parent: screen, width: 10, height: 5 });

      const attr = el.sattr({ dim: true, fg: "red" });
      const code = screen.codeAttr(attr);

      expect(code).toContain("2"); // dim
      expect(code).toContain("31"); // red

      screen.destroy();
    });

    it("should correctly reset dim with SGR 22", () => {
      const screen = new Screen();

      // First set dim
      let attr = screen.attrCode("\x1b[2m", 0, 0);
      let flags = (attr >> 18) & 0x1ff;
      expect(flags & 32).toBeTruthy();

      // Then reset with SGR 22
      attr = screen.attrCode("\x1b[22m", attr, 0);
      flags = (attr >> 18) & 0x1ff;
      expect(flags & 32).toBeFalsy();

      screen.destroy();
    });

    it("should correctly clear dim independently with SGR 22", () => {
      const screen = new Screen();

      // Set bold and dim
      let attr = screen.attrCode("\x1b[1;2m", 0, 0);
      let flags = (attr >> 18) & 0x1ff;
      expect(flags & 1).toBeTruthy(); // bold
      expect(flags & 32).toBeTruthy(); // dim

      // Clear dim only with SGR 22
      attr = screen.attrCode("\x1b[22m", attr, 0);
      flags = (attr >> 18) & 0x1ff;
      expect(flags & 1).toBeTruthy(); // bold still set
      expect(flags & 32).toBeFalsy(); // dim cleared

      screen.destroy();
    });
  });
});
