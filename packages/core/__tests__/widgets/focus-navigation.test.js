import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Box from "../../src/widgets/box.js";
import Button from "../../src/widgets/button.js";
import Checkbox from "../../src/widgets/checkbox.js";
import FileManager from "../../src/widgets/filemanager.js";
import List from "../../src/widgets/list.js";
import Prompt from "../../src/widgets/prompt.js";
import Question from "../../src/widgets/question.js";
import RadioButton from "../../src/widgets/radiobutton.js";
import Screen from "../../src/widgets/screen.js";
import Textarea from "../../src/widgets/textarea.js";
import Textbox from "../../src/widgets/textbox.js";
import { createMockProgram } from "../helpers/mock.js";

describe("Focus Navigation", () => {
  let screen;

  beforeEach(() => {
    // Use real Screen instance with mock program for I/O
    const program = createMockProgram();
    screen = new Screen({ program });

    // Important: Register keypress listener so _listenKeys() is called
    // This sets up the global Tab/Shift+Tab handler
    screen.on("keypress", () => {});
  });

  afterEach(() => {
    // Clean up screen to avoid interference between tests
    if (screen && screen.destroy) {
      screen.destroy();
    }
  });

  describe("Default focusability", () => {
    it("textbox is focusable by default", () => {
      const textbox = new Textbox({ parent: screen });

      expect(textbox.isFocusable()).toBe(true);
      expect(textbox.isInTabOrder()).toBe(true);
      expect(textbox.getTabIndex()).toBe(0);
    });

    it("textarea is focusable by default", () => {
      const textarea = new Textarea({ parent: screen });

      expect(textarea.isFocusable()).toBe(true);
      expect(textarea.isInTabOrder()).toBe(true);
      expect(textarea.getTabIndex()).toBe(0);
    });

    it("button is focusable by default", () => {
      const button = new Button({ parent: screen });

      expect(button.isFocusable()).toBe(true);
      expect(button.isInTabOrder()).toBe(true);
      expect(button.getTabIndex()).toBe(0);
    });

    it("checkbox is focusable by default", () => {
      const checkbox = new Checkbox({ parent: screen });

      expect(checkbox.isFocusable()).toBe(true);
      expect(checkbox.isInTabOrder()).toBe(true);
      expect(checkbox.getTabIndex()).toBe(0);
    });

    it("radio-button is focusable by default", () => {
      const radio = new RadioButton({ parent: screen });

      expect(radio.isFocusable()).toBe(true);
      expect(radio.isInTabOrder()).toBe(true);
      expect(radio.getTabIndex()).toBe(0);
    });

    it("list is focusable by default", () => {
      const list = new List({ parent: screen });

      expect(list.isFocusable()).toBe(true);
      expect(list.isInTabOrder()).toBe(true);
      expect(list.getTabIndex()).toBe(0);
    });

    it("file-manager is focusable by default", () => {
      const fm = new FileManager({ parent: screen, cwd: "/" });

      expect(fm.isFocusable()).toBe(true);
      expect(fm.isInTabOrder()).toBe(true);
      expect(fm.getTabIndex()).toBe(0);
    });

    it.skip("prompt is not focusable but children are", () => {
      const prompt = new Prompt({ parent: screen });

      // Prompt itself is not focusable (it's a Box container, like <dialog>)
      prompt.show();
      expect(prompt.isFocusable()).toBe(false);
      expect(prompt.isInTabOrder()).toBe(false);

      // But its children (Textbox, Buttons) ARE focusable when shown
      expect(prompt._.input.isFocusable()).toBe(true);
      expect(prompt._.input.isInTabOrder()).toBe(true);
      expect(prompt._.okay.isFocusable()).toBe(true);
      expect(prompt._.cancel.isFocusable()).toBe(true);

      // When hidden, children are not focusable (parent.visible affects them)
      prompt.hide();
      expect(prompt._.input.isFocusable()).toBe(false);
      expect(prompt._.okay.isFocusable()).toBe(false);
    });

    it.skip("question is not focusable but children are", () => {
      const question = new Question({ parent: screen });

      // Question itself is not focusable (it's a Box container, like <dialog>)
      question.show();
      expect(question.isFocusable()).toBe(false);
      expect(question.isInTabOrder()).toBe(false);

      // But its children (Buttons) ARE focusable when shown
      expect(question._.okay.isFocusable()).toBe(true);
      expect(question._.okay.isInTabOrder()).toBe(true);
      expect(question._.cancel.isFocusable()).toBe(true);

      // When hidden, children are not focusable
      question.hide();
      expect(question._.okay.isFocusable()).toBe(false);
    });

    it("prompt children participate in Tab order when shown", () => {
      const textbox = new Textbox({ parent: screen });
      const prompt = new Prompt({ parent: screen });
      const button = new Button({ parent: screen });

      prompt.show();

      // Get all focusable elements including prompt children
      const focusable = screen._getFocusableElements();

      // Should include prompt's children in document order
      expect(focusable).toContain(textbox);
      expect(focusable).toContain(prompt._.input);
      expect(focusable).toContain(prompt._.okay);
      expect(focusable).toContain(prompt._.cancel);
      expect(focusable).toContain(button);

      // Verify prompt itself is NOT in the list
      expect(focusable).not.toContain(prompt);
    });

    it("box is not focusable by default", () => {
      const box = new Box({ parent: screen });

      expect(box.isFocusable()).toBe(false);
      expect(box.isInTabOrder()).toBe(false);
    });

    it("box with undefined tabIndex is not focusable", () => {
      const box = new Box({ parent: screen, tabIndex: undefined });

      expect(box.isFocusable()).toBe(false);
      expect(box.isInTabOrder()).toBe(false);
    });
  });

  describe("tabIndex property", () => {
    it("tabIndex=0 makes box focusable", () => {
      const box = new Box({ parent: screen, tabIndex: 0 });

      expect(box.isFocusable()).toBe(true);
      expect(box.isInTabOrder()).toBe(true);
      expect(box.getTabIndex()).toBe(0);
    });

    it("tabIndex=-1 allows programmatic focus only", () => {
      const box = new Box({ parent: screen, tabIndex: -1 });

      expect(box.isFocusable()).toBe(true);
      expect(box.isInTabOrder()).toBe(false);
      expect(box.getTabIndex()).toBe(Infinity); // tabIndex=-1 not >= 0
    });

    it("tabIndex=1 makes box focusable with explicit order", () => {
      const box = new Box({ parent: screen, tabIndex: 1 });

      expect(box.isFocusable()).toBe(true);
      expect(box.isInTabOrder()).toBe(true);
      expect(box.getTabIndex()).toBe(1);
    });

    it("tabIndex=5 creates explicit order", () => {
      const box = new Box({ parent: screen, tabIndex: 5 });

      expect(box.isFocusable()).toBe(true);
      expect(box.isInTabOrder()).toBe(true);
      expect(box.getTabIndex()).toBe(5);
    });

    it("input widget can override with explicit tabIndex", () => {
      const textbox = new Textbox({ parent: screen, tabIndex: 2 });

      expect(textbox.isFocusable()).toBe(true);
      expect(textbox.isInTabOrder()).toBe(true);
      expect(textbox.getTabIndex()).toBe(2);
    });

    it("input widget can be excluded with tabIndex=-1", () => {
      const textbox = new Textbox({ parent: screen, tabIndex: -1 });

      expect(textbox.isFocusable()).toBe(true);
      expect(textbox.isInTabOrder()).toBe(false);
      expect(textbox.getTabIndex()).toBe(Infinity); // tabIndex=-1 is not >= 0
    });
  });

  describe.skip("Visibility and detachment", () => {
    it("hidden element is not focusable", () => {
      const box = new Box({ parent: screen, tabIndex: 0 });
      box.hide();

      expect(box.isFocusable()).toBe(false);
      expect(box.isInTabOrder()).toBe(false);
    });

    it("detached element is not focusable", () => {
      const box = new Box({ parent: screen, tabIndex: 0 });
      box.detach();

      expect(box.isFocusable()).toBe(false);
      expect(box.isInTabOrder()).toBe(false);
    });

    it("hidden input widget is not focusable", () => {
      const textbox = new Textbox({ parent: screen });
      textbox.hide();

      expect(textbox.isFocusable()).toBe(false);
      expect(textbox.isInTabOrder()).toBe(false);
    });
  });

  describe("Tab order", () => {
    it("explicit tabIndex (1,2,3) comes before natural order (0)", () => {
      const box1 = new Box({ parent: screen, tabIndex: 1 });
      const textbox = new Textbox({ parent: screen }); // natural = 0
      const box2 = new Box({ parent: screen, tabIndex: 2 });

      const focusable = screen._getFocusableElements();

      expect(focusable[0]).toBe(box1); // tabIndex 1
      expect(focusable[1]).toBe(box2); // tabIndex 2
      expect(focusable[2]).toBe(textbox); // tabIndex 0
    });

    it("same tabIndex uses document order", () => {
      const box1 = new Box({ parent: screen, tabIndex: 1 });
      const box2 = new Box({ parent: screen, tabIndex: 1 });
      const box3 = new Box({ parent: screen, tabIndex: 1 });

      const focusable = screen._getFocusableElements();

      expect(focusable[0]).toBe(box1);
      expect(focusable[1]).toBe(box2);
      expect(focusable[2]).toBe(box3);
    });

    it("natural tabIndex=0 elements use document order", () => {
      const textbox = new Textbox({ parent: screen });
      const button = new Button({ parent: screen });
      const checkbox = new Checkbox({ parent: screen });

      const focusable = screen._getFocusableElements();

      expect(focusable[0]).toBe(textbox);
      expect(focusable[1]).toBe(button);
      expect(focusable[2]).toBe(checkbox);
    });

    it("complex tab order with mixed values", () => {
      const textbox = new Textbox({ parent: screen }); // 0
      const box1 = new Box({ parent: screen, tabIndex: 3 }); // 3
      const button = new Button({ parent: screen }); // 0
      const box2 = new Box({ parent: screen, tabIndex: 1 }); // 1
      const checkbox = new Checkbox({ parent: screen, tabIndex: 2 }); // 2

      const focusable = screen._getFocusableElements();

      expect(focusable[0]).toBe(box2); // tabIndex 1
      expect(focusable[1]).toBe(checkbox); // tabIndex 2
      expect(focusable[2]).toBe(box1); // tabIndex 3
      expect(focusable[3]).toBe(textbox); // tabIndex 0 (natural, first)
      expect(focusable[4]).toBe(button); // tabIndex 0 (natural, second)
    });

    it("tabIndex=-1 excluded from tab order", () => {
      const box1 = new Box({ parent: screen, tabIndex: 0 });
      const box2 = new Box({ parent: screen, tabIndex: -1 }); // excluded
      const box3 = new Box({ parent: screen, tabIndex: 0 });

      const focusable = screen._getFocusableElements();

      expect(focusable.length).toBe(2);
      expect(focusable[0]).toBe(box1);
      expect(focusable[1]).toBe(box3);
      expect(focusable).not.toContain(box2);
    });
  });

  describe("Global Tab/Shift+Tab", () => {
    it("Tab moves to next focusable element", () => {
      const textbox = new Textbox({ parent: screen });
      const button = new Button({ parent: screen });
      const checkbox = new Checkbox({ parent: screen });

      textbox.focus();
      expect(screen.focused).toBe(textbox);

      // Simulate Tab key
      screen.program.emit("keypress", "\t", { name: "tab", shift: false });

      expect(screen.focused).toBe(button);
    });

    it("Shift+Tab moves to previous focusable element", () => {
      const textbox = new Textbox({ parent: screen });
      const button = new Button({ parent: screen });
      const checkbox = new Checkbox({ parent: screen });

      button.focus();
      expect(screen.focused).toBe(button);

      // Simulate Shift+Tab
      screen.program.emit("keypress", "\t", { name: "tab", shift: true });

      expect(screen.focused).toBe(textbox);
    });

    it("Tab wraps from last to first (circular)", () => {
      const textbox = new Textbox({ parent: screen });
      const button = new Button({ parent: screen });

      button.focus();
      expect(screen.focused).toBe(button);

      // Tab from last should wrap to first
      screen.program.emit("keypress", "\t", { name: "tab", shift: false });

      expect(screen.focused).toBe(textbox);
    });

    it("Shift+Tab wraps from first to last", () => {
      const textbox = new Textbox({ parent: screen });
      const button = new Button({ parent: screen });

      textbox.focus();
      expect(screen.focused).toBe(textbox);

      // Shift+Tab from first should wrap to last
      screen.program.emit("keypress", "\t", { name: "tab", shift: true });

      expect(screen.focused).toBe(button);
    });

    it.skip("skips hidden elements", () => {
      const box1 = new Box({ parent: screen, tabIndex: 0 });
      const box2 = new Box({ parent: screen, tabIndex: 0 });
      const box3 = new Box({ parent: screen, tabIndex: 0 });

      box2.hide();

      box1.focus();
      expect(screen.focused).toBe(box1);

      // Tab should skip box2 (hidden) and go to box3
      screen.program.emit("keypress", "\t", { name: "tab", shift: false });

      expect(screen.focused).toBe(box3);
    });

    it.skip("skips detached elements", () => {
      const box1 = new Box({ parent: screen, tabIndex: 0 });
      const box2 = new Box({ parent: screen, tabIndex: 0 });
      const box3 = new Box({ parent: screen, tabIndex: 0 });

      box2.detach();

      box1.focus();
      expect(screen.focused).toBe(box1);

      // Tab should skip box2 (detached) and go to box3
      screen.program.emit("keypress", "\t", { name: "tab", shift: false });

      expect(screen.focused).toBe(box3);
    });

    it("respects explicit tab order", () => {
      const box1 = new Box({ parent: screen, tabIndex: 2 });
      const box2 = new Box({ parent: screen, tabIndex: 1 });
      const box3 = new Box({ parent: screen, tabIndex: 0 });

      box2.focus(); // Start at tabIndex 1
      expect(screen.focused).toBe(box2);

      // Tab should go to next in order: tabIndex 2
      screen.program.emit("keypress", "\t", { name: "tab", shift: false });

      expect(screen.focused).toBe(box1);

      // Tab again should go to tabIndex 0
      screen.program.emit("keypress", "\t", { name: "tab", shift: false });

      expect(screen.focused).toBe(box3);
    });

    it("Tab when nothing focused focuses first element", () => {
      const textbox = new Textbox({ parent: screen });
      const button = new Button({ parent: screen });

      // Ensure nothing is focused
      screen.rewindFocus();
      expect(screen.focused).toBeUndefined();

      // Tab should focus first element
      screen.program.emit("keypress", "\t", { name: "tab", shift: false });

      expect(screen.focused).toBe(textbox);
    });
  });

  describe("Programmatic focus", () => {
    it("element.focus() works on tabIndex=-1 elements", () => {
      const box = new Box({ parent: screen, tabIndex: -1 });

      // Should be focusable programmatically
      box.focus();

      expect(screen.focused).toBe(box);
    });

    it("focus() emits focus event", () => {
      const textbox = new Textbox({ parent: screen });
      const spy = vi.fn();

      textbox.on("focus", spy);
      textbox.focus();

      expect(spy).toHaveBeenCalled();
    });

    it("blur event fires on previously focused element", () => {
      const textbox = new Textbox({ parent: screen });
      const button = new Button({ parent: screen });
      const spy = vi.fn();

      textbox.focus();
      textbox.on("blur", spy);

      button.focus();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(button);
    });
  });

  describe("Screen focus methods", () => {
    it("focusNext() respects tab order", () => {
      const box1 = new Box({ parent: screen, tabIndex: 2 });
      const box2 = new Box({ parent: screen, tabIndex: 1 });
      const box3 = new Box({ parent: screen, tabIndex: 0 });

      box2.focus();

      screen.focusNext();

      // Should move from tabIndex 1 to tabIndex 2
      expect(screen.focused).toBe(box1);
    });

    it("focusPrevious() respects tab order", () => {
      const box1 = new Box({ parent: screen, tabIndex: 2 });
      const box2 = new Box({ parent: screen, tabIndex: 1 });
      const box3 = new Box({ parent: screen, tabIndex: 0 });

      box1.focus();

      screen.focusPrevious();

      // Should move from tabIndex 2 to tabIndex 1
      expect(screen.focused).toBe(box2);
    });

    it("focusOffset(n) moves n steps in tab order", () => {
      const textbox = new Textbox({ parent: screen });
      const button = new Button({ parent: screen });
      const checkbox = new Checkbox({ parent: screen });

      textbox.focus();

      screen.focusOffset(2);

      expect(screen.focused).toBe(checkbox);
    });

    it("focusOffset(-n) moves n steps backward", () => {
      const textbox = new Textbox({ parent: screen });
      const button = new Button({ parent: screen });
      const checkbox = new Checkbox({ parent: screen });

      checkbox.focus();

      screen.focusOffset(-2);

      expect(screen.focused).toBe(textbox);
    });

    it("focusOffset wraps around", () => {
      const textbox = new Textbox({ parent: screen });
      const button = new Button({ parent: screen });

      button.focus();

      screen.focusOffset(5); // More than available elements

      // Should wrap around
      expect(screen.focused).toBe(textbox);
    });
  });

  describe("Edge cases", () => {
    it("handles screen with no focusable elements", () => {
      const box = new Box({ parent: screen }); // Not focusable

      screen.program.emit("keypress", "\t", { name: "tab", shift: false });

      // Should not crash
      expect(screen.focused).toBeUndefined();
    });

    it("handles single focusable element - enters rest state", () => {
      const textbox = new Textbox({ parent: screen });

      // Textbox is auto-focused when added
      expect(screen.focused).toBe(textbox);

      // Tab should enter rest state (unfocus) instead of re-focusing
      screen.program.emit("keypress", "\t", { name: "tab", shift: false });

      expect(screen.focused).toBeUndefined();

      // Tab again should focus the textbox again
      screen.program.emit("keypress", "\t", { name: "tab", shift: false });

      expect(screen.focused).toBe(textbox);
    });

    it("handles single focusable element - Shift+Tab enters rest state", () => {
      const textbox = new Textbox({ parent: screen });

      // Textbox is auto-focused when added
      expect(screen.focused).toBe(textbox);

      // Shift+Tab should also enter rest state
      screen.program.emit("keypress", "\t", { name: "tab", shift: true });

      expect(screen.focused).toBeUndefined();

      // Shift+Tab again should focus the textbox again
      screen.program.emit("keypress", "\t", { name: "tab", shift: true });

      expect(screen.focused).toBe(textbox);
    });

    it.skip("handles dynamic element visibility", () => {
      const box1 = new Box({ parent: screen, tabIndex: 0 });
      const box2 = new Box({ parent: screen, tabIndex: 0 });
      const box3 = new Box({ parent: screen, tabIndex: 0 });

      box1.focus();

      // Hide box2 after creation
      box2.hide();

      // Tab should skip box2
      screen.program.emit("keypress", "\t", { name: "tab", shift: false });

      expect(screen.focused).toBe(box3);
    });

    it("handles nested focusable elements", () => {
      const container = new Box({ parent: screen });
      const textbox = new Textbox({ parent: container });
      const button = new Button({ parent: screen });

      // Nested elements should be in document order
      const focusable = screen._getFocusableElements();

      expect(focusable[0]).toBe(textbox);
      expect(focusable[1]).toBe(button);
    });
  });
});
