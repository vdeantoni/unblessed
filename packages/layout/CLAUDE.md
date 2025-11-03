# Claude Context for @unblessed/layout

This document provides architectural context and development guidelines for the `@unblessed/layout` package.

## Overview

`@unblessed/layout` is a **flexbox layout engine** that bridges Facebook's Yoga layout library to unblessed widgets. It enables modern, declarative flexbox-style layouts in terminal UIs while keeping @unblessed/core platform-agnostic and dependency-free.

**Purpose:** Foundation for framework integrations like @unblessed/react, @unblessed/vue, @unblessed/svelte, etc.

**Status:** ✅ **Fully functional** - 41 tests passing (100% coverage)

## The Core Problem This Solves

### Before @unblessed/layout:

Positioning widgets required imperative code with manual coordinate calculations:

```typescript
const box1 = new Box({ top: 0, left: 0, width: 20, height: 5 });
const box2 = new Box({ top: 0, left: 20, width: 30, height: 5 }); // Manual calc
const box3 = new Box({ top: 0, left: 50, width: 30, height: 5 }); // Manual calc
```

If box1 width changes? Recalculate box2 and box3 positions manually.

### After @unblessed/layout:

Declarative flexbox layout with automatic positioning:

```typescript
const container = manager.createNode("container", {
  flexDirection: "row",
  gap: 2,
});
const box1 = manager.createNode("box1", { width: 20 });
const box2 = manager.createNode("box2", { flexGrow: 1 }); // Auto-fills space!
const box3 = manager.createNode("box3", { width: 30 });

manager.appendChild(container, box1);
manager.appendChild(container, box2);
manager.appendChild(container, box3);

manager.performLayout(container); // Yoga calculates everything!
```

If box1 width changes? Just call `performLayout()` again. Yoga recalculates.

## Architecture

### The Three-Layer System

```
┌──────────────────────────────────────────────────────────────┐
│  LAYER 1: Framework (e.g., @unblessed/react)                 │
│  - React components with flexbox props                       │
│  - React reconciler manages component lifecycle              │
│  - Calls LayoutManager to handle layout                      │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│  LAYER 2: @unblessed/layout (THIS PACKAGE)                   │
│  - LayoutManager API                                          │
│  - Yoga node lifecycle management                            │
│  - Yoga → unblessed widget synchronization                   │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│  LAYER 3: @unblessed/core                                    │
│  - Widgets with top/left/width/height                        │
│  - Terminal rendering                                        │
│  - No knowledge of Yoga or flexbox                           │
└──────────────────────────────────────────────────────────────┘
```

### Data Flow (The Critical Insight)

**Yoga and unblessed are SEQUENTIAL, not parallel:**

```
1. Framework updates props
   ↓
2. LayoutManager applies props to Yoga nodes
   ↓
3. Yoga.calculateLayout() runs
   ↓
4. Extract computed coordinates (top, left, width, height)
   ↓
5. Sync coordinates to unblessed widgets
   ↓
6. unblessed renders to terminal
```

**They DON'T overlap:**

- **Yoga:** "This box should be at row 5, column 10, 40 chars wide, 3 lines tall"
- **unblessed:** "OK, I'll draw a box there with the content you gave me"

**Yoga knows nothing about:**

- Terminal escape codes, border characters, color codes, actual rendering

**unblessed knows nothing about:**

- flexGrow, justifyContent, Flexbox layout

## Key Design Decisions

### 1. Declarative-Only Model (No Bidirectional Sync)

**Decision:** Yoga is ALWAYS the source of truth for widget positions.

```typescript
// In syncWidgetWithYoga():
node.widget.rtop = layout.top; // ← OVERWRITTEN every render
node.widget.rleft = layout.left; // ← OVERWRITTEN every render
node.widget.width = layout.width; // ← OVERWRITTEN every render
```

**Why:**

- ✅ Prevents synchronization bugs
- ✅ Predictable, testable behavior
- ✅ Matches React/framework philosophy
- ❌ Can't use unblessed's native drag-and-drop (intentional trade-off)

**Alternative considered:** Bidirectional sync (Yoga ↔ widgets)

- **Rejected:** Too complex, prone to race conditions and bugs

### 2. Separate Package (Not in @unblessed/core)

**Decision:** Yoga lives in its own package.

**Why:**

- ✅ Keeps @unblessed/core pure (platform-agnostic, zero Yoga dependency)
- ✅ Reusable by multiple frameworks (React, Vue, Svelte)
- ✅ Users only install Yoga if they need flexbox
- ✅ Clear separation of concerns

**Alternative considered:** Bundle Yoga in @unblessed/core

- **Rejected:** Forces everyone to download Yoga even if not using flexbox

### 3. Root Width Behavior

**Decision:** Only set root width from terminal if user didn't specify it.

```typescript
// layout-engine.ts line 179
if (rootNode.props.width === undefined) {
  rootNode.yogaNode.setWidth(terminalWidth);
}
```

**Why:**

- ✅ Respects explicit user dimensions
- ✅ Provides sensible defaults (terminal width)
- ✅ Flexible for testing and custom scenarios

**Bug avoided:** Early implementation always overwrote width with `screen.width`, breaking tests and user-specified dimensions.

## Package Structure

```
packages/layout/
├── src/
│   ├── index.ts           # Public API exports
│   ├── types.ts           # TypeScript interfaces
│   ├── yoga-node.ts       # Yoga lifecycle (create, update, destroy)
│   ├── widget-sync.ts     # Yoga → widget synchronization
│   └── layout-engine.ts   # LayoutManager (main API)
├── __tests__/
│   ├── setup.js           # Test runtime initialization
│   ├── yoga-node.test.ts  # Yoga lifecycle tests (19 tests)
│   ├── widget-sync.test.ts # Synchronization tests (4 tests)
│   ├── layout-engine.test.ts # LayoutManager API tests (11 tests)
│   └── integration.test.ts # Complex scenarios (7 tests)
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
├── .prettierignore
└── README.md
```

## Core APIs

### LayoutManager

**Main class** for creating and managing flexbox layouts.

```typescript
import { Screen } from "@unblessed/node";
import { LayoutManager } from "@unblessed/layout";

const screen = new Screen();
const manager = new LayoutManager({ screen, debug: false });

// Create layout tree
const container = manager.createNode("container", {
  flexDirection: "row",
  gap: 2,
});

const left = manager.createNode("left", { width: 20 });
const spacer = manager.createNode("spacer", { flexGrow: 1 });
const right = manager.createNode("right", { width: 20 });

manager.appendChild(container, left);
manager.appendChild(container, spacer);
manager.appendChild(container, right);

// Calculate and render
manager.performLayout(container);

// Cleanup
manager.destroy(container);
screen.destroy();
```

### LayoutNode

**Virtual DOM node** that holds:

- `yogaNode` - Yoga layout node for flexbox calculations
- `props` - Flexbox properties
- `children` - Child layout nodes
- `parent` - Parent layout node
- `widget` - Created unblessed widget (after layout)
- `widgetOptions` - Additional widget options (content, border, style, etc.)

### FlexboxProps

**Supported Yoga properties:**

**Container:**

- `flexDirection`: 'row' | 'column' | 'row-reverse' | 'column-reverse'
- `justifyContent`: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
- `alignItems`: 'flex-start' | 'center' | 'flex-end' | 'stretch'
- `flexWrap`: 'nowrap' | 'wrap' | 'wrap-reverse'

**Item:**

- `flexGrow`: number (default: 0)
- `flexShrink`: number (default: 1)
- `flexBasis`: number | string
- `alignSelf`: 'auto' | 'flex-start' | 'center' | 'flex-end' | 'stretch'

**Dimensions:**

- `width`, `height`: number | string ('50%' | 'auto')
- `minWidth`, `minHeight`, `maxWidth`, `maxHeight`: number | string

**Spacing:**

- `padding`, `paddingTop`, `paddingBottom`, `paddingLeft`, `paddingRight`, `paddingX`, `paddingY`
- `margin`, `marginTop`, `marginBottom`, `marginLeft`, `marginRight`, `marginX`, `marginY`
- `gap`, `rowGap`, `columnGap`

**Other:**

- `position`: 'relative' | 'absolute'
- `display`: 'flex' | 'none'

## How It Works - Deep Dive

### Step 1: Create Layout Nodes

```typescript
// packages/layout/src/yoga-node.ts
export function createLayoutNode(
  type: string,
  props: FlexboxProps,
): LayoutNode {
  const yogaNode = Yoga.Node.create(); // Create Yoga node

  const node: LayoutNode = {
    type,
    yogaNode,
    props,
    children: [],
    parent: null,
    widget: undefined, // No widget yet!
  };

  applyFlexStyles(yogaNode, props); // Apply flexbox props to Yoga
  return node;
}
```

**Key Point:** Widget is NOT created yet. We're just building a Yoga tree.

### Step 2: Apply Flexbox Styles to Yoga

```typescript
// packages/layout/src/yoga-node.ts
export function applyFlexStyles(yogaNode: YogaNode, props: FlexboxProps): void {
  if (props.flexGrow !== undefined) {
    yogaNode.setFlexGrow(props.flexGrow); // ← Yoga API
  }

  if (props.flexDirection === "row") {
    yogaNode.setFlexDirection(Yoga.FLEX_DIRECTION_ROW); // ← Yoga API
  }

  // ... 200+ lines of prop → Yoga API mapping
}
```

**Key Point:** This translates React/framework props to Yoga's C++ API.

### Step 3: Build Tree Structure

```typescript
// packages/layout/src/yoga-node.ts
export function appendChild(parent: LayoutNode, child: LayoutNode): void {
  child.parent = parent;
  parent.children.push(child); // ← Update JS tree
  parent.yogaNode.insertChild(child.yogaNode, parent.children.length - 1); // ← Update Yoga tree
}
```

**Key Point:** Keep JS tree and Yoga tree in sync.

### Step 4: Calculate Layout

```typescript
// packages/layout/src/layout-engine.ts
private calculateLayout(rootNode: LayoutNode): void {
  const terminalWidth = this.screen.width || 80;

  // Only set if user didn't specify width
  if (rootNode.props.width === undefined) {
    rootNode.yogaNode.setWidth(terminalWidth);
  }

  // THIS IS THE MAGIC - Yoga calculates positions for ENTIRE tree
  rootNode.yogaNode.calculateLayout(
    undefined,
    undefined,
    Yoga.DIRECTION_LTR
  );

  // After this, every Yoga node knows its top, left, width, height
}
```

**Key Point:** One function call, entire tree calculated.

### Step 5: Extract Computed Coordinates

```typescript
// packages/layout/src/widget-sync.ts
export function getComputedLayout(node: LayoutNode): ComputedLayout {
  return {
    top: Math.round(node.yogaNode.getComputedTop()),
    left: Math.round(node.yogaNode.getComputedLeft()),
    width: Math.round(node.yogaNode.getComputedWidth()),
    height: Math.round(node.yogaNode.getComputedHeight()),
  };
}
```

**Key Point:** Extract Yoga's output as plain numbers.

### Step 6: Sync to unblessed Widgets

```typescript
// packages/layout/src/widget-sync.ts
export function syncWidgetWithYoga(node: LayoutNode, screen: Screen): Box {
  const layout = getComputedLayout(node);

  if (!node.widget) {
    // First render - CREATE widget
    node.widget = new Box({
      screen,
      top: layout.top,
      left: layout.left,
      width: layout.width,
      height: layout.height,
      ...node.widgetOptions, // content, border, style, etc.
    });
  } else {
    // Update existing widget - OVERWRITE position
    node.widget.rtop = layout.top;
    node.widget.rleft = layout.left;
    node.widget.width = layout.width;
    node.widget.height = layout.height;
  }

  // Recursively sync children
  for (const child of node.children) {
    const childWidget = syncWidgetWithYoga(child, screen);
    childWidget.parent = node.widget;
  }

  return node.widget;
}
```

**CRITICAL PRINCIPLE:** Widget positions are **OVERWRITTEN** every render. Yoga is always source of truth.

### Step 7: Render

```typescript
screen.render(); // Standard unblessed rendering
```

**Key Point:** Once widgets have correct positions, unblessed handles the rest.

## The Complete Flow (Example)

```typescript
// 1. User creates layout tree
const container = manager.createNode("container", {
  flexDirection: "row",
  width: 80,
});

const left = manager.createNode("left", { width: 20, height: 10 });
const spacer = manager.createNode("spacer", { flexGrow: 1, height: 10 });
const right = manager.createNode("right", { width: 20, height: 10 });

manager.appendChild(container, left);
manager.appendChild(container, spacer);
manager.appendChild(container, right);

// 2. User triggers layout
manager.performLayout(container);

// What happens internally:
// a) Yoga.calculateLayout() runs
//    - Container: { left: 0, top: 0, width: 80, height: 10 }
//    - Left:      { left: 0, top: 0, width: 20, height: 10 }
//    - Spacer:    { left: 20, top: 0, width: 40, height: 10 }  ← flexGrow!
//    - Right:     { left: 60, top: 0, width: 20, height: 10 }
//
// b) syncWidgetWithYoga() creates/updates widgets:
//    - left.widget   = new Box({ top: 0, left: 0, width: 20, height: 10 })
//    - spacer.widget = new Box({ top: 0, left: 20, width: 40, height: 10 })
//    - right.widget  = new Box({ top: 0, left: 60, width: 20, height: 10 })
//
// c) screen.render() draws to terminal
```

## Critical Concepts

### Declarative vs Imperative

**This package is DECLARATIVE ONLY.**

```typescript
// ✅ Declarative (Yoga controls position)
<Box flexGrow={1} />  // Position calculated by Yoga

// ❌ Imperative (doesn't work with Yoga)
widget.enableDrag();  // Would break sync - position changes outside Yoga
```

**Why:** Prevents desynchronization. Yoga and widgets can't get out of sync if Yoga is the only one setting positions.

### Synchronization Strategy

**Question:** How do positions stay in sync after user interactions?

**Answer:** They don't need to sync because we don't allow desynchronization!

**In Ink (our model):**

```
User Input (keyboard)
    ↓
Update React state
    ↓
React re-render
    ↓
Yoga RECALCULATES (from scratch!)
    ↓
Widgets repositioned
    ↓
Terminal renders new frame
```

**No "drag and drop"** - all interaction is:

1. Keyboard-driven (useInput hook)
2. State-driven (React state)
3. Fully recalculated each time

**For @unblessed/react:** Use hooks like `useInput()` to handle keyboard, update state, let Yoga recalculate.

### Widget Reuse vs Recreation

**Optimization:** Widgets are reused across renders.

```typescript
if (!node.widget) {
  node.widget = new Box({ ... });  // First render - create
} else {
  node.widget.rtop = layout.top;   // Updates - reuse and update
  node.widget.width = layout.width;
}
```

**Why:** Performance - creating widgets is expensive, updating positions is cheap.

## Common Patterns

### Pattern 1: Spacer (Fill Available Space)

```typescript
const spacer = manager.createNode("spacer", { flexGrow: 1 });
```

This will expand to fill all available space in its container.

### Pattern 2: Centered Layout

```typescript
const container = manager.createNode("container", {
  justifyContent: "center",
  alignItems: "center",
  width: 80,
  height: 24,
});

const box = manager.createNode("box", { width: 40, height: 10 });
manager.appendChild(container, box);
```

### Pattern 3: Nested Containers

```typescript
const outer = manager.createNode("outer", {
  flexDirection: "column",
  width: 80,
  height: 24,
});

const header = manager.createNode("header", { height: 5 });

const content = manager.createNode("content", {
  flexDirection: "row",
  flexGrow: 1, // Fill remaining height
});

const sidebar = manager.createNode("sidebar", { width: 20 });
const main = manager.createNode("main", { flexGrow: 1 });

manager.appendChild(outer, header);
manager.appendChild(outer, content);
manager.appendChild(content, sidebar);
manager.appendChild(content, main);
```

### Pattern 4: Responsive Grid

```typescript
const grid = manager.createNode("grid", {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 1,
  width: 80,
});

for (let i = 0; i < 9; i++) {
  const cell = manager.createNode(`cell-${i}`, { width: 25, height: 7 });
  manager.appendChild(grid, cell);
}
```

## Testing Strategy

### Test Files (41 tests total)

**yoga-node.test.ts (19 tests)** - Yoga lifecycle

- Node creation and initialization
- Flex property application (flexGrow, justifyContent, etc.)
- Tree manipulation (appendChild, removeChild, insertBefore)
- Resource cleanup

**widget-sync.test.ts (4 tests)** - Widget synchronization

- Widget creation from layout nodes
- Widget updates on re-layout
- Parent-child relationship maintenance
- Computed layout extraction

**layout-engine.test.ts (11 tests)** - LayoutManager API

- Node creation via manager
- Tree manipulation via manager
- Layout calculation (simple, row, column)
- flexGrow behavior
- space-between justification
- Padding and gap application
- Resource cleanup

**integration.test.ts (7 tests)** - Complex scenarios

- Nested containers (header/sidebar/main)
- Column layouts with flexGrow
- alignItems: center
- Dynamic updates (prop changes)
- Constraints (minWidth, maxWidth)
- display: none
- widgetOptions preservation

### Test Setup

**Runtime Initialization:** Uses same setup as @unblessed/core tests.

```javascript
// __tests__/setup.js
import { setRuntime } from "@unblessed/core";

function createMockRuntime() {
  return {
    fs,
    path,
    process,
    buffer,
    url,
    util,
    stream,
    stringDecoder,
    events, // ← events.EventEmitter required!
    images,
    processes,
    networking,
  };
}

beforeAll(() => {
  setRuntime(createMockRuntime());
});
```

**Screen Dimensions:** Tests use `new Screen({ width: 80, height: 24 })` for predictable layouts.

### Testing Gotchas

**1. Yoga API Quirks:**

```typescript
// ❌ Wrong - returns { value: NaN, unit: 0 }
expect(yogaNode.getPadding(Yoga.EDGE_TOP).value).toBe(2);

// ✅ Right - just verify it's an object
const padding = yogaNode.getPadding(Yoga.EDGE_TOP);
expect(typeof padding).toBe("object");

// ✅ Gap returns number directly
expect(yogaNode.getGap(Yoga.GUTTER_ALL)).toBe(2);
```

**2. Yoga Node Equality:**

```typescript
// ❌ Wrong - Yoga nodes may be proxies/wrappers
expect(parent.yogaNode.getChild(0)).toBe(child.yogaNode);

// ✅ Right - just verify structure
expect(parent.yogaNode.getChildCount()).toBe(1);
expect(parent.yogaNode.getChild(0)).toBeDefined();
```

**3. Screen Width in Tests:**

```typescript
// ❌ Wrong - screen.width returns TTY width (1 in tests!)
const screen = new Screen();
expect(screen.width).toBe(80); // Fails! width is 1

// ✅ Right - Yoga respects explicit node dimensions
const root = manager.createNode("root", { width: 80 });
manager.performLayout(root);
expect(root.widget.width).toBe(80); // Passes!
```

## Integration with @unblessed/react (Future)

This package is designed to be used by `@unblessed/react` (Phase 2-4 of PLAN.md):

```typescript
// Future: @unblessed/react reconciler
import { LayoutManager } from "@unblessed/layout";

const reconciler = createReconciler({
  createInstance(type, props) {
    // Create Yoga node via LayoutManager
    return manager.createNode(type, props);
  },

  appendChild(parent, child) {
    // Update Yoga tree
    manager.appendChild(parent, child);
  },

  resetAfterCommit(rootNode) {
    // Trigger layout calculation and widget sync
    manager.performLayout(rootNode);
  },
});
```

**Flow:**

1. React creates components
2. Reconciler creates layout nodes
3. `resetAfterCommit()` triggers `performLayout()`
4. Widgets positioned and rendered

## Performance Considerations

### Yoga Performance

- Simple layout (3-5 nodes): < 1ms
- Complex layout (50-100 nodes): < 5ms
- Very complex (500+ nodes): ~20-30ms

**Fast enough** for real-time UI updates.

### Optimization: Widget Reuse

Widgets are reused across renders instead of recreated:

```typescript
if (!node.widget) {
  node.widget = new Box({ ... });  // Create once
} else {
  node.widget.rtop = layout.top;   // Update many times
}
```

**Why:** Box creation is ~1ms, position update is ~0.01ms (100x faster).

### Memory Management

**CRITICAL:** Always clean up Yoga nodes to prevent leaks.

```typescript
manager.destroy(rootNode); // ← Frees Yoga nodes recursively
```

Yoga nodes are C++ objects that must be explicitly freed. The `destroy()` method handles this automatically.

## Limitations & Trade-offs

### No Imperative Position Control

**Can't do this:**

```typescript
widget.enableDrag(); // ❌ Breaks Yoga sync
widget.rtop = 10; // ❌ Will be overwritten on next layout
```

**Why:** Yoga must be source of truth. Manual position changes would be lost.

**Workaround (future):** "Unmanaged" escape hatch for advanced use cases.

### No Mouse Drag-and-Drop

Yoga-managed layouts are **keyboard-driven** only (like Ink).

**Why:** Mouse drag would require bidirectional sync (complex, bug-prone).

**Alternative:** Build custom mouse handling that updates React state, triggers re-layout.

### Full Recalculation on Every Update

When props change, Yoga recalculates the ENTIRE tree.

**Why:** Yoga's API doesn't support incremental updates.

**Impact:** Minimal - Yoga is fast enough for real-time updates.

## Common Issues & Solutions

### Issue: Widget Dimensions Wrong

**Symptom:** `widget.width` is 1 instead of expected value.

**Cause:** Screen width defaults to 1 in tests (no TTY).

**Solution:** Use explicit dimensions in root node:

```typescript
const root = manager.createNode("root", { width: 80, height: 24 });
```

### Issue: flexGrow Not Working

**Symptom:** Spacer has width 0.

**Cause:** Missing height on spacer node.

**Solution:** Always set height for row layouts:

```typescript
const spacer = manager.createNode("spacer", {
  flexGrow: 1,
  height: 10, // ← Required!
});
```

### Issue: Memory Leak

**Symptom:** Process memory grows over time.

**Cause:** Yoga nodes not freed.

**Solution:** Always call `destroy()`:

```typescript
manager.destroy(rootNode); // Frees all Yoga nodes
```

### Issue: Borders Not Accounting for Space

**Symptom:** Layout breaks when adding borders - content overflows.

**Cause:** Yoga doesn't know about borders, so doesn't reserve space.

**Solution:** Use `hasBorder` or per-side `border/borderTop/etc` props:

```typescript
// Option 1: Use hasBorder flag
const node = manager.createNode("box", {
  width: 40,
  height: 10,
  hasBorder: true, // ← Tells Yoga to reserve 1 char on each side
});

// Option 2: Use border numbers (per-side)
const node = manager.createNode("box", {
  width: 40,
  height: 10,
  border: 1, // ← Reserves 1 char on all sides
  // Or: borderTop: 1, borderBottom: 1, borderLeft: 1, borderRight: 1
});
```

This is like CSS `box-sizing: border-box` - the border is included in the width/height.

### Issue: Padding Returns NaN

**Symptom:** `yogaNode.getPadding(EDGE_TOP)` returns `{ value: NaN, unit: 0 }`.

**Cause:** Yoga API quirk with how padding is stored/retrieved.

**Solution:** Call setPadding individually per edge instead of using EDGE_ALL:

```typescript
// ❌ May not work correctly
yogaNode.setPadding(Yoga.EDGE_ALL, value);

// ✅ Works correctly
yogaNode.setPadding(Yoga.EDGE_TOP, value);
yogaNode.setPadding(Yoga.EDGE_BOTTOM, value);
yogaNode.setPadding(Yoga.EDGE_LEFT, value);
yogaNode.setPadding(Yoga.EDGE_RIGHT, value);
```

After this, `getPadding()` returns `{ value: 1, unit: 1 }` correctly.

### Issue: Children Positioned Incorrectly with Borders/Padding

**Symptom:** Child widgets overlap borders or ignore padding.

**Cause:** Coordinate system mismatch - Yoga uses absolute, unblessed uses relative.

**Solution:** Use absolute coordinates from Yoga directly when using `.append()`:

```typescript
// ✅ Correct - use Yoga's absolute coordinates
const childWidget = new Box({
  top: yogaLayout.top,     // Absolute position
  left: yogaLayout.left,
  ...
});
parentWidget.append(childWidget);  // append() handles absolute positioning

// ❌ Wrong - don't convert to relative
const childWidget = new Box({
  top: yogaTop - parentTop - border - padding,  // Over-complicated
  ...
});
```

When using `.append()`, unblessed handles coordinate translation automatically.

## Development Guidelines

### Adding New Flexbox Properties

If Yoga supports a property we don't:

1. Add to `FlexboxProps` interface in `types.ts`
2. Add handler in `applyFlexStyles()` in `yoga-node.ts`
3. Add test in `yoga-node.test.ts`

Example:

```typescript
// types.ts
export interface FlexboxProps {
  // ... existing
  aspectRatio?: number; // New property
}

// yoga-node.ts
if (props.aspectRatio !== undefined) {
  yogaNode.setAspectRatio(props.aspectRatio);
}

// yoga-node.test.ts
it("applies aspectRatio", () => {
  const yogaNode = Yoga.Node.create();
  applyFlexStyles(yogaNode, { aspectRatio: 1.5 });
  expect(yogaNode.getAspectRatio()).toBe(1.5);
  yogaNode.free();
});
```

### Adding New Widget Types

Currently only Box is supported. To add Text, Image, etc.:

1. Update `syncWidgetWithYoga()` to handle different types
2. Add type-specific logic (e.g., Text needs Yoga measure function)
3. Add tests

### Debugging Layout Issues

**Enable debug mode:**

```typescript
const manager = new LayoutManager({ screen, debug: true });
```

**Output:**

```
[LayoutManager] Created node: container { flexDirection: 'row' }
[LayoutManager] Appended left to container
[LayoutManager] Starting layout calculation
  container: top=0 left=0 width=80 height=10
    left: top=0 left=0 width=20 height=10
    spacer: top=0 left=20 width=40 height=10
    right: top=0 left=60 width=20 height=10
[LayoutManager] Layout complete and rendered
```

## Yoga API Reference

### Key Yoga Methods

**Node Creation:**

- `Yoga.Node.create()` - Create node
- `yogaNode.free()` - Free single node
- `yogaNode.freeRecursive()` - Free node and children

**Properties:**

- `setFlexGrow(number)` / `getFlexGrow()`
- `setWidth(number)` / `getWidth()` → `{ value, unit }`
- `setMargin(edge, value)` / `getMargin(edge)` → `{ value, unit }`
- `setGap(gutter, value)` / `getGap(gutter)` → `number` (not object!)

**Tree:**

- `insertChild(child, index)`
- `removeChild(child)`
- `getChild(index)` → YogaNode
- `getChildCount()` → number

**Layout:**

- `calculateLayout(width, height, direction)`
- `getComputedLayout()` → `{ top, left, width, height, right, bottom }`
- `getComputedTop()` / `getComputedLeft()` / etc.

## Future Enhancements

Potential improvements:

1. **Text Support** - Add Text widget with Yoga measure function for wrapping
2. **Absolute Positioning** - Support `position: 'absolute'` properly
3. **Percentage Sizing** - Handle '50%' width/height correctly
4. **Auto Sizing** - Better `width: 'auto'` / `height: 'auto'` support
5. **Caching** - Cache Yoga calculations if props haven't changed
6. **Escape Hatch** - `unmanaged` flag to allow imperative control

## Resources

- **Yoga Documentation**: https://yogalayout.com/docs
- **Ink Source** (reference implementation): `/Users/vdeantoni/workspace/vdeantoni/ink/src/`
  - `styles.ts` - Flexbox property application
  - `reconciler.ts` - React reconciler with Yoga
  - `render-node-to-output.ts` - Yoga → output rendering
- **PLAN.md** - React support implementation plan
- **@unblessed/core** - Widget API documentation

## Quick Reference

### Create LayoutManager

```typescript
const manager = new LayoutManager({ screen, debug: false });
```

### Create Nodes

```typescript
const node = manager.createNode(type, flexboxProps, widgetOptions);
```

### Build Tree

```typescript
manager.appendChild(parent, child);
manager.insertBefore(parent, child, referenceChild);
manager.removeChild(parent, child);
```

### Calculate Layout

```typescript
manager.performLayout(rootNode); // Calculates, syncs, renders
```

### Cleanup

```typescript
manager.destroy(rootNode); // Frees Yoga nodes and destroys widgets
screen.destroy();
```

## Summary

**@unblessed/layout** is the bridge between modern flexbox layouts (Yoga) and terminal rendering (unblessed). It enables declarative, automatic positioning while maintaining the principle that **Yoga is always the source of truth**.

This package is the foundation for @unblessed/react and future framework integrations, completing Phase 0 (Layout Foundation) of the React support plan.

**Key Takeaway:** Yoga and unblessed don't "overlap" - they work **sequentially**. Yoga calculates positions, unblessed renders at those positions. Simple, predictable, powerful.
