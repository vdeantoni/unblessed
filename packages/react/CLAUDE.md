# Claude Context for @unblessed/react

This document provides architectural context and development guidelines for the `@unblessed/react` package.

## Overview

`@unblessed/react` is a **React renderer** for unblessed that enables building terminal UIs using JSX and React components, with automatic flexbox layouts powered by Yoga.

**Purpose:** Provide a modern, declarative API for building terminal UIs with React

**Status:** 🚀 **Alpha** - Core functionality complete, event handling implemented

## What This Package Does

Enables writing terminal UIs like this:

```tsx
import { Screen } from "@unblessed/node";
import { render, Box, Text, Button } from "@unblessed/react";

const screen = new Screen();

const App = () => {
  const [count, setCount] = React.useState(0);

  return (
    <Box flexDirection="column" gap={2}>
      <Box border={1} borderStyle="single" borderColor="cyan" padding={1}>
        <Text>Count: {count}</Text>
      </Box>
      <Button
        border={1}
        borderStyle="single"
        borderColor="green"
        padding={1}
        onClick={() => setCount((c) => c + 1)}
      >
        Click me!
      </Button>
    </Box>
  );
};

render(<App />, { screen });
```

Instead of imperative blessed-style code.

## Architecture

```
React Components (<Box>, <Text>)
    ↓
Widget Descriptors (encapsulate configuration)
    ↓
React Reconciler (creates/updates LayoutNodes)
    ↓
@unblessed/layout (Yoga calculations)
    ↓
unblessed widgets (positioned)
    ↓
Terminal rendering
```

### Widget Descriptor Pattern

The core architectural pattern is the **widget descriptor**. Each widget type has a descriptor class that encapsulates all its configuration logic:

```typescript
class BoxDescriptor extends WidgetDescriptor<BoxProps> {
  // Extract layout props for Yoga
  get flexProps(): FlexboxProps { ... }

  // Extract visual/behavioral props for unblessed widget
  get widgetOptions(): Record<string, any> { ... }

  // Extract event handlers
  get eventHandlers(): Record<string, Function> { ... }

  // Create the unblessed widget instance
  createWidget(layout: ComputedLayout, screen: Screen): Element { ... }

  // Update widget on re-render
  updateWidget(widget: Element, layout: ComputedLayout): void { ... }
}
```

**Why descriptors?**

- ✅ **Type safety** - Each widget has strongly typed props
- ✅ **No string-based type discrimination** - Polymorphism instead of switch statements
- ✅ **Single source of truth** - Descriptor owns complete widget lifecycle
- ✅ **Composition** - Helper functions for shared logic (borders, text styles, focus)
- ✅ **Easy to extend** - Create new descriptor class, register it, done

**Composition via helpers:**

Descriptors use helper functions to compose features without inheritance constraints:

```typescript
// Example: Box descriptor uses helpers for clean, composable code
get flexProps() {
  return extractFlexboxProps(this.props);  // Extracts all 40+ flexbox props
}

get widgetOptions() {
  const borderInit = initializeBorderStyle(this, ...);  // Handles borders
  const baseStyle = buildStyleObject(this, ...);        // Builds base styling
  const hoverEffects = buildHoverEffects(this, ...);    // Builds hover effects
  const focusEffects = buildFocusEffects(this, ...);    // Builds focus effects
  return { border, style, hoverEffects, focusEffects, ... };
}

get eventHandlers() {
  return extractEventHandlers(this.props);  // Maps all React events
}
```

This allows flexible composition - any widget can use any combination of helpers without needing complex inheritance hierarchies.

### Available Helper Functions

**Layout Extraction:**

- `extractFlexboxProps(props)` - Extracts all 40+ flexbox properties
- Replaces 87 lines of repetitive if statements with single call

**Event Extraction:**

- `extractEventHandlers(props)` - Maps React event props to unblessed events
- Handles onClick → click, onKeyPress → keypress, etc.
- Replaces 22 lines of repetitive mapping with single call

**Border & Styling:**

- `initializeBorderStyle(descriptor, hasHoverBorder, hasFocusBorder)` - Complete border initialization
- `buildBorder(descriptor)` - Creates border object from props
- `buildStyleObject(descriptor, styleObj?)` - Builds style with theme cascade
- `extractStyleProps(props)` - Extracts style properties from props

**Effects (Hover & Focus):**

- `buildEffects(descriptor, style, options)` - Unified effect builder
- `buildHoverEffects(descriptor, hoverStyle)` - Builds hover effects with theme fallback
- `buildFocusEffects(descriptor, focusStyle, hasBorder)` - Builds focus effects + auto focusBorderColor
- Automatically applies `theme.global.focusBorderColor` to bordered widgets

**List-Specific:**

- `buildItemStyles(descriptor, propStyle, themeDefaults, config)` - List item styling with theme fallback
- Handles itemStyle, itemSelected, itemHover patterns
- Replaces 66 lines of repetitive code with 3 function calls

**Focus Management:**

- `buildFocusableOptions(props, defaultTabIndex?)` - Sets tabIndex, keyable, clickable

**Utilities:**

- `getComponentDefaults(descriptor)` - Merges component → global theme defaults
- `mergeStyles(...styles)` - Merges style objects with nested border handling
- `buildTextStyles(descriptor, componentType?)` - Text styling with theme override

### Key Components

**1. reconciler.ts** - React reconciler configuration

- Handles React component lifecycle (create, update, delete)
- Creates widget descriptors from React props
- Creates LayoutNodes via LayoutManager using descriptor's extracted props
- Triggers layout calculation on commit

**2. widget-descriptors/** - Descriptor infrastructure

- base.ts - WidgetDescriptor abstract base class
- helpers.ts - Composition helpers (20+ functions for borders, effects, focus, events, layout)
- common-props.ts - Shared prop interfaces (BorderProps, StyleObject, etc.)
- factory.ts - Descriptor registry and creation

**Key helpers:**

- `extractFlexboxProps()` - 87 lines → 1 call
- `extractEventHandlers()` - 22 lines → 1 call
- `buildItemStyles()` - Unified List item styling
- `buildEffects()` - Unified hover/focus effect builder
- `initializeBorderStyle()` - Complete border initialization

**3. dom.ts** - Virtual DOM

- DOMNode wraps LayoutNode with React metadata
- TextNode for text content
- Tree manipulation (appendChild, removeChild, etc.)

**4. render.ts** - Main render() function

- Creates Screen and LayoutManager
- Mounts React tree
- Returns instance with unmount/rerender methods

**5. components/** - Widget components and descriptors

Each component file contains both the descriptor class AND the React component:

- Box.tsx - BoxDescriptor + Box component
- Text.tsx - TextDescriptor + Text component
- Spacer.tsx - SpacerDescriptor + Spacer component
- Button.tsx - ButtonDescriptor + Button component
- Input.tsx - InputDescriptor + Input component
- BigText.tsx - BigTextDescriptor + BigText component

## Event Handling

### Overview

All React components support event handling through React-style props (onClick, onFocus, etc.) that are automatically bound to unblessed widget events.

### Supported Events

**Mouse Events:**

- `onClick` → `click`
- `onMouseDown` → `mousedown`
- `onMouseUp` → `mouseup`
- `onMouseMove` → `mousemove`
- `onMouseOver` → `mouseover`
- `onMouseOut` → `mouseout`
- `onMouseWheel` → `mousewheel`

**Keyboard Events:**

- `onKeyPress` → `keypress`

**Focus Events:**

- `onFocus` → `focus`
- `onBlur` → `blur`

**Widget-Specific Events:**

- `onPress` → `press` (Button)
- `onSubmit` → `submit` (Input/Textarea)
- `onCancel` → `cancel` (Input/Textarea)

### Implementation

**1. Props Extraction (reconciler.ts)**

Event props are extracted and converted to unblessed event names:

```typescript
function propsToEventHandlers(props: Props): EventHandlers {
  const handlers: EventHandlers = {};
  if (props.onClick) handlers.click = props.onClick;
  if (props.onKeyPress) handlers.keypress = props.onKeyPress;
  // ... etc
  return handlers;
}
```

**2. Event Storage (LayoutNode)**

Handlers are stored on the LayoutNode:

```typescript
interface LayoutNode {
  eventHandlers?: Record<string, Function>;
  _boundHandlers?: Record<string, Function>; // For cleanup
  // ...
}
```

**3. Binding (widget-sync.ts)**

Events are bound when widgets are created/updated:

```typescript
function bindEventHandlers(
  widget: Element,
  handlers: Record<string, Function>,
) {
  for (const [event, handler] of Object.entries(handlers)) {
    widget.on(event, handler);
  }
}
```

**4. Cleanup**

Old handlers are unbound before binding new ones:

```typescript
function unbindEventHandlers(
  widget: Element,
  handlers: Record<string, Function>,
) {
  for (const [event, handler] of Object.entries(handlers)) {
    widget.removeListener(event, handler);
  }
}
```

### Usage Examples

**Click Handler:**

```tsx
<Box onClick={(data) => console.log("Clicked at", data.x, data.y)}>
  Click me
</Box>
```

**Keyboard Handler:**

```tsx
<Box
  onKeyPress={(ch, key) => {
    if (key.name === "enter") handleSubmit();
  }}
>
  Press Enter
</Box>
```

**Button Component:**

```tsx
<Button onPress={() => console.log("Pressed!")}>Submit</Button>
```

**Input Component:**

```tsx
<Input
  onSubmit={(value) => console.log("Submitted:", value)}
  onCancel={() => console.log("Cancelled")}
/>
```

### JSX Element Names

To avoid conflicts with HTML elements, custom element names are used:

- `<tbutton>` - Button (avoids HTML `<button>`)
- `<textinput>` - Input (avoids HTML `<input>`)

Components (`<Button>`, `<Input>`) internally use these custom elements.

## Critical Learnings

### Borders Require Yoga Awareness

**CRITICAL:** Borders must include `border={1}` (or `borderTop={1}`, etc.) so that Yoga reserves space.

**Problem:**

```tsx
// ❌ WRONG - borderStyle alone doesn't tell Yoga to reserve space
<Box borderStyle="single" borderColor="cyan" padding={1}>
  Content will overflow!
</Box>
```

**Solution:**

```tsx
// ✅ CORRECT - border={1} tells Yoga to reserve 1 char on each side
<Box border={1} borderStyle="single" borderColor="cyan" padding={1}>
  Content fits properly
</Box>
```

**Why:** Yoga needs to know about borders to calculate layout correctly. The `border` number tells Yoga "reserve this many characters", while `borderStyle` and `borderColor` are visual-only (passed to unblessed).

**Implementation:** The `buildBorder()` helper in `helpers.ts` only creates a border object if border numbers are present:

```typescript
export function buildBorder(props) {
  // Only create border if Yoga knows about it
  if (!Number(props.border) && !Number(props.borderTop) && ...) {
    return null;  // No border - prevents overlap
  }
  // ... build border
}
```

### Border Color Handling

**Problem:** unblessed expects border colors as numbers, React uses strings.

**Solution:** Convert color names to numbers using `colors.convert()`:

```typescript
// In reconciler.ts
import { colors } from "@unblessed/core";

// Convert border colors
if (props.borderColor) {
  border.fg = colors.convert(props.borderColor as string); // "cyan" → 6
}
```

**Border property mapping:**

- React prop → unblessed Border interface
- `borderTopColor` → `topColor` (NOT `borderTopColor`)
- `borderBottomColor` → `bottomColor`
- `borderLeftColor` → `leftColor`
- `borderRightColor` → `rightColor`
- `borderDimColor` → `dim` (NOT `borderDim`)
- `borderTopDim` → `topDim`

### style.border.fg Initialization

**Problem:** Border color not showing even when `border.fg` was set correctly.

**Cause:** unblessed copies `border.fg` to `style.border.fg` during initialization, but only if `style.border` is an object.

**Solution:** Pre-populate `style.border.fg` ourselves:

```typescript
// In propsToWidgetOptions()
if (widgetOptions.border) {
  widgetOptions.style = widgetOptions.style || {};
  widgetOptions.style.border = widgetOptions.style.border || {};

  // Copy border.fg to style.border.fg (where unblessed reads it from)
  if (widgetOptions.border.fg !== undefined) {
    widgetOptions.style.border.fg = widgetOptions.border.fg;
  }
}
```

### Coordinate System

**Critical Decision:** Use **absolute coordinates** from Yoga, not relative.

```typescript
// ✅ Correct
const widget = new Box({
  top: yogaLayout.top,    // Absolute
  left: yogaLayout.left,
  ...
});
parentWidget.append(widget);  // append() handles absolute coords

// ❌ Wrong
const widget = new Box({
  top: yogaTop - parentTop - parentBorder - parentPadding,  // Don't do this
  ...
});
```

**Why:** When using `widget.append()`, unblessed handles coordinate translation automatically. We tried converting to relative coordinates (subtracting parent position, border, padding) but it broke - absolute coordinates work.

### Text Color vs Border Color Conflict

**Problem:** Setting `style.fg` on Box widgets conflicts with border color initialization.

**Cause:** unblessed skips copying `border.fg` to `style.border.fg` if `style` already exists.

**Solution:** Only set `style.fg/bg` for Text widgets, not Box widgets:

```typescript
// In widget-sync.ts
if (!isTextWidget && widgetOpts.style) {
  delete widgetOpts.style.fg; // Remove text colors from Box widgets
  delete widgetOpts.style.bg;
}
```

Box widgets should only have border colors in `style.border.*`, not text colors in `style.*`.

### Text Content Concatenation

**Problem:** `<Text>X: {value}</Text>` creates multiple #text children, and calling `setContent()` for each one overwrites previous content.

**Solution:** Collect all #text children, concatenate their content, then call `setContent()` once:

```typescript
// In syncWidgetWithYoga(), after syncing all children:
if (node.children.length > 0) {
  const allTextNodes = node.children.every((c) => c.type === "#text");

  if (allTextNodes) {
    const fullContent = node.children
      .map((c) => c.widgetOptions?.content || "")
      .join("");

    node.widget.setContent(fullContent);
  }
}
```

This ensures "X: " + "42" → "X: 42" instead of just "42".

## Package Structure

```
packages/react/
├── src/
│   ├── index.ts              # Main exports
│   ├── types.ts              # TypeScript definitions
│   ├── jsx.d.ts              # JSX element declarations
│   ├── dom.ts                # Virtual DOM (wraps LayoutNode)
│   ├── reconciler.ts         # React reconciler config
│   ├── render.ts             # render() function
│   ├── themes/               # Theme system
│   │   ├── theme.ts          # Theme type definitions
│   │   ├── theme-utils.ts    # Color resolution utilities
│   │   ├── theme-registry.ts # Theme storage/retrieval
│   │   ├── unblessed.ts      # Default theme
│   │   └── matrix.ts         # Matrix theme
│   ├── widget-descriptors/   # Descriptor infrastructure
│   │   ├── base.ts           # WidgetDescriptor base class
│   │   ├── helpers.ts        # 20+ composition helpers
│   │   ├── common-props.ts   # Shared prop interfaces
│   │   ├── factory.ts        # Descriptor registry
│   │   └── index.ts          # Public exports
│   └── components/           # React components
│       ├── Box.tsx           # Box component + descriptor
│       ├── Text.tsx          # Text component + descriptor
│       ├── Spacer.tsx        # Spacer component + descriptor
│       ├── Button.tsx        # Button component + descriptor
│       ├── Input.tsx         # Input component + descriptor
│       ├── List.tsx          # List component + descriptor
│       ├── BigText.tsx       # BigText component + descriptor
│       └── ThemeProvider.tsx # Theme context provider
├── __tests__/
│   ├── setup.ts              # Test setup
│   ├── render.test.tsx       # Basic rendering tests
│   ├── events.test.tsx       # Event handling tests
│   ├── focus-effects.test.tsx # Focus effects tests
│   └── themes.test.tsx       # Theme tests
├── examples/
│   ├── hello-react.tsx       # Basic example
│   ├── interactive-demo.tsx  # Interactive demo
│   ├── keyboard-game.tsx     # Keyboard game
│   └── theme-demo.tsx        # Theme showcase
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── vitest.config.ts
```

## How Props Flow

**React → Descriptor → Flexbox → Yoga:**

```tsx
<Box padding={1} border={1} borderColor="cyan">
```

**Step 1: Reconciler creates descriptor:**

```typescript
const descriptor = createDescriptor("box", props);
// BoxDescriptor instance with typed props
```

**Step 2: Descriptor extracts props:**

```typescript
// flexProps (for Yoga layout)
descriptor.flexProps = {
  padding: 1,
  border: 1, // Tells Yoga to reserve space
};

// widgetOptions (for unblessed widget)
descriptor.widgetOptions = {
  border: {
    type: "line",
    style: "single",
    fg: 6, // Cyan converted to number via buildBorder() helper
  },
  style: {
    border: { fg: 6 }, // Pre-populated via prepareBorderStyle() helper
  },
};

// eventHandlers
descriptor.eventHandlers = {
  /* onClick, onKeyPress, etc. */
};
```

**Step 3: LayoutManager:**

- Creates LayoutNode with descriptor's flexbox props
- Stores descriptor and widgetOptions on LayoutNode

**Step 4: Yoga calculates layout:**

- Accounts for border (1 char) in positioning
- Calculates top, left, width, height for every node

**Step 5: widget-sync.ts:**

- Calls `descriptor.createWidget(layout, screen)` to create unblessed widget
- Widget has Yoga coordinates + descriptor's widgetOptions
- Binds event handlers from descriptor

**Key insight:** Descriptor acts as the adapter between React props and unblessed widgets, handling all the prop splitting and conversion logic.

## Theme System

**Status:** ✅ **Complete** - Full theme support with runtime switching

The theme system provides a professional design token architecture for consistent, customizable styling across your terminal UI.

### Architecture Overview

**Three-layer design tokens:**

1. **Primitives** - Color palette foundation (gray50-900, blue50-900, etc.)
2. **Semantic** - Intent-based colors (primary, success, error, foreground, etc.)
3. **Components** - Widget-specific defaults (box.bg, button.fg, etc.)

**Runtime swappable** via `useTheme()` hook with automatic re-rendering.

**Hybrid widget integration:**

- Explicit colors take priority (backward compatible)
- Theme references via `$` prefix (e.g., `fg="$primary"`)
- Auto-fallback to component/semantic defaults when colors omitted
- Terminal capability auto-reduction using existing `colors.reduce()`

### Theme Structure

```typescript
interface Theme {
  name: string;
  primitives: ThemePrimitives; // Color scales (50-900)
  semantic: ThemeSemantic; // Intent-based colors
  components: ComponentDefaults; // Widget defaults
}
```

### Usage Examples

**Basic usage with default theme:**

```tsx
import { render, Box, Text, unblessedTheme } from "@unblessed/react";

render(<App />, {
  runtime,
  theme: unblessedTheme, // Optional, this is the default
});
```

**Runtime theme switching:**

```tsx
import { useTheme, unblessedTheme, matrixTheme } from "@unblessed/react";

function App() {
  const [theme, setTheme] = useTheme();

  return (
    <Box>
      <Button
        onClick={() =>
          setTheme(theme === unblessedTheme ? matrixTheme : unblessedTheme)
        }
      >
        Toggle Theme
      </Button>
    </Box>
  );
}
```

**Theme color references:**

```tsx
// Semantic colors (recommended)
<Text fg="$primary">Primary text</Text>
<Text fg="$semantic.success">Success message</Text>

// Primitive colors (for specific shades)
<Box borderColor="$primitives.blue.500">Blue border</Box>

// Explicit colors (theme-independent)
<Text fg="cyan">Always cyan, ignores theme</Text>
```

### Color Resolution Order

When a color prop is specified, resolution happens in this order:

1. **Explicit color** (e.g., `"cyan"`, `"#ff0000"`) - Highest priority, ignores theme
2. **Theme reference** (e.g., `"$primary"`) - Resolved from theme
3. **Component default** (e.g., `theme.components.box.fg`) - Used when prop omitted
4. **Fallback** - Transparent/default if all else fails

### Theme Reference Syntax

Theme references use `$` prefix and dot notation:

- `$primary` → `theme.semantic.primary` (shorthand for semantic)
- `$semantic.success` → `theme.semantic.success`
- `$semantic.border` → `theme.semantic.border`
- `$primitives.blue.500` → `theme.primitives.blue[500]`

### Available Themes

**`unblessedTheme`** - Professional dark theme optimized for terminal readability

- Background: `#111827` (gray.900)
- Foreground: `#e5e7eb` (gray.200)
- Primary: `#3b82f6` (blue.500)
- Based on Tailwind CSS color system

**`matrixTheme`** - Matrix movie-inspired cyber-punk theme

- Background: `#0a0e0a` (near-black with green tint)
- Foreground: `#00ff41` (bright Matrix green)
- Primary: `#00ff00` (classic Matrix green)
- Accent colors: Cyan, dark red (errors), amber (warnings)
- Perfect for terminal animations and Matrix rain effects

Both themes include complete color scales and semantic mappings.

### Implementation Details

**Theme Storage:**

- Theme passed via `render()` options
- Stored in reconciler alongside LayoutManager
- Automatically injected into all widget descriptors

**Theme Provider (Internal):**

- `render()` automatically wraps app in `<ThemeProvider>`
- Users never directly use `<ThemeProvider>`
- Theme state managed via React Context

**Widget Integration:**

- `WidgetDescriptor<TProps, TTheme>` - Generic theme parameter
- Base class in `@unblessed/layout` stays agnostic
- React descriptors specialize with `Theme` type
- Helper functions (`buildBorder`, `buildTextStyles`, etc.) accept theme parameter
- Colors resolved during `widgetOptions` getter

**Terminal Compatibility:**

- All colors automatically reduced to terminal capabilities
- Uses existing `colors.convert()` from `@unblessed/core`
- Supports 256-color, 16-color, and 8-color terminals
- No manual fallbacks needed

### Creating Custom Themes

```typescript
import { Theme, unblessedTheme } from '@unblessed/react';

const myTheme: Theme = {
  name: 'my-theme',
  primitives: unblessedTheme.primitives,  // Reuse color scales
  semantic: {
    ...unblessedTheme.semantic,
    primary: '#ff6b6b',        // Custom primary color
    success: '#51cf66',        // Custom success color
    // ... other semantic overrides
  },
  components: {
    ...unblessedTheme.components,
    button: {
      bg: '$primary',         // Reference semantic colors
      fg: '#ffffff',
      border: '$primary',
      // ... other button colors
    },
    // ... other component overrides
  },
};

render(<App />, { runtime, theme: myTheme });
```

### Theme Examples

See `examples/theme-demo.tsx` for a comprehensive demonstration showing:

- Default theme usage
- Runtime theme switching
- Theme color references
- Explicit vs themed colors
- Multiple widget types with themed styling

Run with:

```bash
cd packages/react/examples
node --import tsx --no-warnings theme-demo.tsx
```

## Current State

**✅ Working:**

- React reconciler integration
- Box, Text, Spacer, BigText, Button, Input, List components
- Flexbox layout (flexGrow, justifyContent, gap, etc.)
- Border styles and colors (per-side support)
- Absolute positioning from Yoga
- Event handling (onClick, onKeyPress, onSubmit, etc.)
- Event cleanup on update/unmount
- Handler rebinding on prop changes
- Content updates on state changes (text concatenation)
- Widget descriptor pattern for type-safe configuration
- **Composition via 20+ helper functions:**
  - `extractFlexboxProps()` - Automatic flexbox extraction
  - `extractEventHandlers()` - Automatic event mapping
  - `buildItemStyles()` - List item styling with theme fallback
  - `buildEffects()` - Unified hover/focus effect builder
  - `initializeBorderStyle()` - Complete border initialization
  - And 15+ more specialized helpers
- **Theme system with runtime switching (useTheme hook)**
- **Design token architecture (primitives → semantic → components)**
- **Two built-in themes (unblessedTheme, matrixTheme)**
- **State styling (hover and focus effects)**
- **Automatic theme fallback for all components:**
  - Button automatically uses theme.components.button.hoverFg/hoverBg
  - List items use theme.components.list.item.{selectedFg,hoverFg,etc}
  - Focus border auto-applies theme.global.focusBorderColor
- **Theme color references ($primary, $semantic.success, etc.)**
- **Automatic terminal color reduction**
- 14+ tests passing (render, events, content, effects, themes)

**Code Quality Improvements:**

- ~300+ lines of duplication eliminated through helper functions
- Components reduced from 200+ lines to ~100 lines average
- Single source of truth for all common patterns
- Consistent behavior guaranteed across all widgets

**📋 TODO:**

- Text wrapping support
- Yoga measure function for text
- Hooks (useInput, useApp, useFocus)
- More component wrappers (ListTable, ProgressBar, Checkbox, RadioButton, etc.)
- Comprehensive integration tests
- Performance optimization

## Testing

**Current tests (10):**

**Render tests (4):**

- Basic rendering without crashing
- Box component rendering
- Flexbox layout with flexGrow
- Spacer component

**Event tests (6):**

- onClick handler binding
- onKeyPress handler binding
- onPress handler binding (Button)
- onSubmit handler binding (Input)
- Handler updates (rebinding on prop change)
- Cleanup on unmount

**Content update tests (2):**

- Text content updates on state changes
- Multiple text widgets update independently

**To run:**

```bash
pnpm --filter @unblessed/react test
```

**Example to run:**

```bash
cd packages/react/examples
node --import tsx --no-warnings interactive-demo.tsx
node --import tsx --no-warnings keyboard-game.tsx
```

## Development Tips

### Debug Mode

Enable debug logging:

```tsx
render(<App />, {
  screen,
  debug: true, // Logs layout calculations
});
```

And in LayoutManager:

```tsx
const manager = new LayoutManager({ screen, debug: true });
```

### Border Props Checklist

When adding border support, remember:

1. ✅ Convert color strings to numbers (`colors.convert()`)
2. ✅ Map to correct Border interface names (`topColor` not `borderTopColor`)
3. ✅ Set `style.border.fg` explicitly (don't rely on unblessed copying)
4. ✅ Tell Yoga about border (`border: 1` in flexbox props)
5. ✅ Don't set `style.fg` on Box widgets (conflicts with border colors)

## Future Work

### Phase 1: Hooks ⚠️ **Next Priority**

- useInput hook for keyboard
- useApp hook for lifecycle
- useFocus hook for Tab navigation

### Phase 2: Text Rendering

- Implement text wrapping
- Add Yoga measure function for text
- Support multi-line text

### Phase 3: More Components

- List component wrapper
- ListTable component wrapper
- ProgressBar component
- Checkbox component
- RadioButton/RadioSet components
- Form component
- FileManager component

## Summary

**@unblessed/react** brings React's declarative component model to terminal UIs. It integrates React's reconciler with @unblessed/layout's Yoga engine and unblessed's rendering capabilities.

**Key insights:**

- The reconciler manages LayoutNodes, not widgets directly
- LayoutManager handles Yoga calculations and widget synchronization
- Event props are extracted and bound to unblessed EventEmitter
- Custom JSX elements avoid conflicts with HTML elements

**Status:** Core functionality complete with event handling. Ready for hooks and additional components.
