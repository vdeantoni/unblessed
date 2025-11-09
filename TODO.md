# TODO

Code modernization and enhancement tasks for @unblessed.

## High Priority

### 1. Remove `var self = this` pattern
**Effort:** Low (~1 hour)
**Status:** Ready to implement

**Description:**
Replace old JavaScript closure pattern with arrow functions for cleaner, more maintainable code.

**Current state:**
- 7 occurrences across 2 files:
  - `overlayimage.ts`: 1 occurrence
  - `tput.ts`: 6 occurrences

**Example:**
```typescript
// Before
var self = this;
something.on('event', function() {
  self.property = value;
});

// After
something.on('event', () => {
  this.property = value;
});
```

**Files to modify:**
- `packages/core/src/widgets/overlayimage.ts`
- `packages/core/src/lib/tput.ts`

---

### 2. Add automatic cursor restoration on exit
**Effort:** Low (~30 minutes)
**Status:** Ready to implement

**Description:**
Automatically restore cursor visibility on program exit/crash to prevent stuck hidden cursor.

**Implementation:**
```typescript
// In Program._exitHandler
Program.instances.forEach((program) => {
  if (program.cursorHidden) {
    program.showCursor();
  }
  program.flush();
  program._exiting = true;
});
```

**Files to modify:**
- `packages/core/src/lib/program.ts`

**Testing:**
- Test normal exit with hidden cursor
- Test error exit with hidden cursor
- Test Ctrl+C interrupt

---

### 3. Improve keyboard callback signatures
**Effort:** Medium (~2-3 hours)
**Status:** Needs investigation

**Description:**
Add proper TypeScript types for keyboard event callbacks instead of `any`.

**Current pattern:**
```typescript
const handleKeyPress = (_ch: string, key: any) => {
  if (key.name === "t") { ... }
};
```

**Desired pattern:**
```typescript
interface KeyEvent {
  name: string;
  ctrl?: boolean;
  shift?: boolean;
  meta?: boolean;
  sequence?: string;
  full?: string;
}

const handleKeyPress = (_ch: string, key: KeyEvent) => {
  if (key.name === "t") { ... }
};
```

**Files to investigate:**
- `packages/core/src/lib/keys.ts` - Define KeyEvent interface
- `packages/core/src/types/events.ts` - Export type
- All widgets that use keypress events

---

## Medium Priority

### 4. useFocus hook for React
**Effort:** Medium (~3-4 hours)
**Status:** Design phase

**Description:**
Add React hook for programmatic focus management and keyboard navigation.

**Proposed API:**
```tsx
import { useFocus } from '@unblessed/react';

const MyInput = () => {
  const { isFocused, focus, blur } = useFocus();

  useEffect(() => {
    if (someCondition) {
      focus(); // Programmatically focus
    }
  }, []);

  return (
    <Input
      border={isFocused ? 2 : 1}
      borderColor={isFocused ? 'cyan' : 'gray'}
    />
  );
};
```

**Features:**
- Get/set focus state
- Auto-register with screen focus stack
- Cleanup on unmount
- Tab navigation integration

---

### 5. Implement remaining ANSI effect tags
**Effort:** Low (~1-2 hours)
**Status:** Ready to implement

**Description:**
Add support for remaining ANSI SGR codes in tag parser.

**Missing tags:**
- `{blink}` - Blinking text (code 5, off 25)
- `{hide}` - Hidden text (code 8, off 28)
- ~~`{bold}` - Already supported~~
- ~~`{dim}` - Already supported~~
- ~~`{underline}` - Already supported~~
- ~~`{reverse}` - Already supported (inverse)~~

**Files to modify:**
- `packages/core/src/widgets/element.ts` - `_parseTags()` method
- `packages/core/__tests__/widgets/element.test.js` - Add tests

**Note:** Check if blink actually works in modern terminals (many disable it).

---

### 6. Investigate VRT runtime initialization
**Effort:** Medium (~2-3 hours)
**Status:** Investigation needed

**Description:**
Understand why `setRuntime(new NodeRuntime())` is explicitly needed in VRT tests and whether it can be simplified or auto-initialized.

**Files to investigate:**
- `packages/vrt/__tests__/` - Test setup
- `packages/node/src/auto-init.ts` - Auto-initialization logic
- VRT package initialization flow

---

## Low Priority

### 7. Replace `var` with `const`/`let`
**Effort:** Medium (~3-4 hours)
**Status:** Future improvement

**Description:**
Replace all `var` declarations with modern ES6 `const`/`let`.

**Current state:**
- 82 occurrences across 4 files:
  - `ansiimage.ts`: 2 instances
  - `overlayimage.ts`: 16 instances (after removing var self)
  - `program.ts`: 12 instances
  - `tput.ts`: 52 instances

**Why Low Priority:**
- Current code works fine
- TypeScript strict mode catches most issues
- Not urgent, just good practice

---

## Future / Ideas

### 8. @unblessed/charts package
**Effort:** Large (~2-3 weeks)
**Status:** Future enhancement

**Description:**
Create dedicated charting package built on BrailleCanvas for data visualization.

**Potential components:**
- `<LineChart>` - Line graphs with smooth curves
- `<Sparkline>` - Compact inline charts
- `<BarChart>` - Horizontal/vertical bar charts
- `<Gauge>` - Circular/semi-circular gauges
- `<Heatmap>` - Color-coded data grids

**Benefits:**
- Unique differentiator from Ink
- High-resolution braille graphics (4× resolution)
- No npm equivalent for terminal charts at this quality
- Useful for dashboards, monitoring tools, data analysis

**Prerequisites:**
- ✅ BrailleCanvas widget (already implemented)
- ✅ Animation utilities (already implemented)
- Need: Chart component architecture
- Need: Data transformation utilities
- Need: Legend/axis rendering

---

### 9. Screen reader support
**Effort:** Large (~3-4 weeks)
**Status:** Research phase

**Description:**
Add accessibility support for screen readers in terminal UIs.

**Challenges:**
- Terminal screen readers work differently than web
- Limited standards/APIs available
- Platform-specific implementations needed
- Testing requires actual screen reader setup

**Research needed:**
- How do terminal screen readers work?
- What's the best API for TUI accessibility?
- Which screen readers to support?
- What level of compatibility is achievable?

---

### 10. Additional text animation types
**Effort:** Medium (~1-2 days per type)
**Status:** Future enhancement

**Description:**
Add more animation types to existing declarative `animateColor` system.

**Potential additions:**
- `type: "glitch"` - Random character glitching effect
- `type: "scramble"` - Matrix-style decode animation
- `type: "fade"` - Fade in/out using dim property
- `type: "wave"` - Wave pattern across text

**Note:** Core animation infrastructure already exists with `animateColor` prop.
Only need to add new generators to `packages/react/src/animations/text-generators.ts`.

---

## Not Recommended

### ❌ Add `this.runtime` to Node class
**Why Skip:** Marginal benefit, adds memory overhead, current singleton pattern is cleaner.

### ❌ Investigate EventEmitter replacement
**Why Skip:** Current implementation stable, high risk for minimal benefit.

### ⏸️ Refactor colors.ts to named exports
**Why Defer:** Breaking change, wait for v2.0.0.

---

## Recently Completed (2025-11)

These items were completed recently:

- ✅ **Text truncation with ellipsis** (2025-11-09)
  - Added `textWrap` property with ink-style truncation modes
  - `truncateText()` utility in `text-utils.ts`
  - Full ANSI code preservation
  - LRU caching for performance (wrap-cache.ts)
  - 98 new tests (79 unit + 19 integration)

- ✅ **Border styles** (already implemented)
  - Support for double, round, bold, single styles
  - Used throughout codebase and examples
  - Full React integration

- ✅ **Animation system** (2025-11)
  - Declarative `animateBorder` and `animateColor` props
  - 7 animation types (rainbow, pulse, chase, gradient, blink, typewriter, rotating-colors)
  - AnimationController and performance utilities
  - CharCanvas and BrailleCanvas widgets
  - useWidget and useScreen hooks
  - Full React integration with lifecycle management

- ✅ **Theme system** (2025-11)
  - Runtime theme switching
  - Design token architecture (primitives → semantic → components)
  - Two built-in themes (unblessed, matrix)
  - useTheme hook for React

---

## Summary

**Quick Wins (Do Soon):**
1. Remove `var self = this` pattern (~1 hour)
2. Auto-restore cursor on exit (~30 min)

**Important (Do Eventually):**
3. Improve keyboard callback types (~2-3 hours)
4. useFocus hook for React (~3-4 hours)
5. Add remaining ANSI tags (blink, hide) (~1-2 hours)

**Future Enhancements (When Needed):**
- @unblessed/charts package
- Screen reader support
- Additional animation types
- Replace var with const/let

**Total Immediate Work:** ~4-5 hours for items #1-2
**Total Short-term Work:** ~10-15 hours for items #1-5

---

Last Updated: 2025-11-09
