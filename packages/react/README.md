# @unblessed/react

React renderer for unblessed with flexbox layout support.

[![npm version](https://img.shields.io/npm/v/@unblessed/react)](https://www.npmjs.com/package/@unblessed/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../../LICENSE)

> ⚠️ **ALPHA SOFTWARE / WORK IN PROGRESS** - This package is under active development. Core functionality is implemented but not all features are complete yet.

## Overview

`@unblessed/react` enables building terminal UIs using React components and JSX, with automatic flexbox layout powered by Yoga.

**Features:**

- 🎨 **React components** - Build UIs with familiar JSX syntax
- 📦 **Flexbox layout** - Automatic positioning via Yoga layout engine
- 🎯 **TypeScript first** - Full type safety
- 🌐 **Platform-agnostic** - Works in Node.js and browsers

## Installation

```bash
npm install @unblessed/react@alpha react
# or
pnpm add @unblessed/react@alpha react
```

**Also install a runtime:**

```bash
# For Node.js
npm install @unblessed/node@alpha

# For browser
npm install @unblessed/browser@alpha
```

**Requirements:**

- Node.js >= 22.0.0
- React ^18.0.0 or ^19.0.0

## Quick Start

```tsx
import { render, Box, Text, Spacer } from "@unblessed/react";

const App = () => (
  <Box flexDirection="column" padding={1} gap={1}>
    <Box borderStyle="single" padding={1}>
      <Text color="green" bold>
        Hello from React!
      </Text>
    </Box>

    <Box flexDirection="row" gap={2}>
      <Box width={20}>Left</Box>
      <Spacer />
      <Box width={20}>Right</Box>
    </Box>
  </Box>
);

render(<App />);
```

**Note:** The runtime (`@unblessed/node` or `@unblessed/browser`) auto-initializes when imported, so you don't need explicit initialization.

## Components

### Box

Container component with flexbox layout support.

```tsx
<Box
  flexDirection="row" // Layout direction
  gap={2} // Gap between children
  padding={1} // Padding
  borderStyle="single" // Border style
  borderColor="cyan" // Border color
  width={40} // Fixed width
  flexGrow={1} // Grow to fill space
>
  {/* children */}
</Box>
```

**Flexbox Props:**

- `flexDirection`: 'row' | 'column' | 'row-reverse' | 'column-reverse'
- `justifyContent`: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
- `alignItems`: 'flex-start' | 'center' | 'flex-end' | 'stretch'
- `flexGrow`, `flexShrink`, `flexBasis`
- `width`, `height`, `minWidth`, `minHeight`, `maxWidth`, `maxHeight`
- `padding`, `paddingX`, `paddingY`, `paddingTop`, etc.
- `margin`, `marginX`, `marginY`, `marginTop`, etc.
- `gap`, `rowGap`, `columnGap`

**Styling Props:**

- `borderStyle`: 'single' | 'double' | 'round' | 'bold' | 'classic'
- `borderColor`, `borderTopColor`, `borderBottomColor`, etc.
- `color` - Text color
- `backgroundColor` - Background color

### Text

Text component with styling support.

```tsx
<Text
  color="green" // Text color
  bold // Bold text
  italic // Italic text
  dim // Dim text
>
  Hello World!
</Text>
```

**Props:**

- `color`, `backgroundColor`
- `bold`, `italic`, `underline`, `strikethrough`
- `inverse`, `dim`

### Spacer

Flexible space component that expands to fill available space.

```tsx
<Box flexDirection="row">
  <Box width={20}>Left</Box>
  <Spacer /> {/* Fills remaining space */}
  <Box width={20}>Right</Box>
</Box>
```

Equivalent to `<Box flexGrow={1} />`.

### BigText

Large ASCII art text component using terminal fonts.

```tsx
<BigText color="cyan">HELLO</BigText>
```

**Props:**

- `color` - Text color
- `backgroundColor` - Background color

Automatically calculates dimensions based on font (14 rows × 8 columns per character).

### Button

Interactive button component with hover and focus effects.

```tsx
<Button
  hoverBg="blue"
  focusBg="cyan"
  borderStyle="single"
  padding={1}
>
  Click Me
</Button>
```

**Props:**

- All Box props (flexbox, border, etc.)
- `hoverBg` - Background color on hover
- `focusBg` - Border color when focused

### Input

Text input component for user interaction.

```tsx
<Input
  autoFocus
  borderStyle="single"
  borderColor="blue"
  height={3}
/>
```

**Props:**

- All Box props (flexbox, border, etc.)
- `autoFocus` - Automatically focus on mount

## Examples

### Dashboard Layout

```tsx
const Dashboard = () => (
  <Box flexDirection="column" width={80} height={24}>
    {/* Header */}
    <Box height={3} borderStyle="single">
      <Text bold>Dashboard</Text>
    </Box>

    {/* Content area */}
    <Box flexDirection="row" flexGrow={1}>
      {/* Sidebar */}
      <Box width={20} borderStyle="single">
        <Text>Menu</Text>
      </Box>

      {/* Main content */}
      <Box flexGrow={1} borderStyle="single">
        <Text>Content area</Text>
      </Box>
    </Box>
  </Box>
);

render(<Dashboard />);
```

### Centered Content

```tsx
const Centered = () => (
  <Box justifyContent="center" alignItems="center" width={80} height={24}>
    <Box borderStyle="double" padding={2}>
      <Text color="cyan" bold>
        Centered!
      </Text>
    </Box>
  </Box>
);
```

### Interactive Form

```tsx
import { BigText, Box, Text, Button, Input } from "@unblessed/react";

const LoginForm = () => (
  <Box flexDirection="column" padding={2} gap={1}>
    <BigText color="cyan">LOGIN</BigText>

    <Box flexDirection="column" gap={1}>
      <Text>Username:</Text>
      <Input autoFocus borderColor="blue" />

      <Text>Password:</Text>
      <Input borderColor="blue" />

      <Button hoverBg="green" focusBg="cyan" padding={1}>
        <Text>Login</Text>
      </Button>
    </Box>
  </Box>
);
```

## Architecture

@unblessed/react builds on top of:

- **@unblessed/core** - Widget library and terminal rendering
- **@unblessed/layout** - Yoga flexbox layout engine
- **react-reconciler** - React's custom renderer API

### High-Level Flow

```
React Components
    ↓
React Reconciler (creates LayoutNodes)
    ↓
LayoutManager (Yoga calculations)
    ↓
unblessed Widgets (positioned)
    ↓
Terminal Rendering
```

### Understanding the Node Types

The architecture uses several different "node" types, each with a specific responsibility:

#### 1. **YogaNode** (from `yoga-layout`)
The low-level flexbox layout engine (C++/WASM). Calculates positions and sizes based on flexbox properties.

```typescript
// Created internally - you don't use this directly
yogaNode.setWidth(100);
yogaNode.setHeight(50);
yogaNode.calculateLayout(); // Computes layout
```

#### 2. **LayoutNode** (from `@unblessed/layout`)
Wraps YogaNode with metadata, bridging React props to Yoga calculations and unblessed widgets.

```typescript
interface LayoutNode {
  type: string;              // 'box', 'text', 'button', etc.
  yogaNode: YogaNode;       // The Yoga layout engine
  props: FlexboxProps;      // width, height, padding, gap, etc.
  widgetOptions: any;       // border, colors, content, etc.
  widget?: Element;         // The final unblessed widget
}
```

#### 3. **DOMNode** (from `@unblessed/react`)
Virtual DOM element used by React reconciler. Wraps LayoutNode with React-specific data.

```typescript
interface DOMNode {
  type: ElementType;        // 'box', 'text', 'root'
  layoutNode: LayoutNode;   // References the layout layer
  props: BoxProps;          // React component props
  childNodes: AnyNode[];    // Virtual DOM children
}
```

#### 4. **Widget/Element** (from `@unblessed/core`)
The actual terminal UI widget that renders to screen. Created after Yoga calculates layout.

```typescript
// Box, Text, Button, etc.
new Box({
  top: 10,      // From Yoga calculations
  left: 20,
  width: 50,
  height: 30,
  border: { type: 'line' },
  content: 'Hello'
});
```

### Data Flow Example

When you write:

```tsx
<Box padding={1} gap={2} borderColor="cyan">
  <Text>Hello</Text>
</Box>
```

Here's what happens:

```
1. React Component
   <Box padding={1} gap={2} borderColor="cyan">
      ↓
2. React Reconciler creates DOMNode
   DOMNode { type: 'box', props: {...}, layoutNode: LayoutNode }
      ↓
3. LayoutNode splits props
   LayoutNode {
     props: { padding: 1, gap: 2 },        → Sent to YogaNode
     widgetOptions: { borderColor: 'cyan' } → Saved for widget
     yogaNode: YogaNode
   }
      ↓
4. Yoga calculates layout
   YogaNode.calculateLayout()
   Result: { top: 0, left: 0, width: 100, height: 50 }
      ↓
5. Widget created/updated with positions
   Box {
     top: 0, left: 0, width: 100, height: 50,
     border: { type: 'line', fg: 6 }  // cyan converted to color code
   }
      ↓
6. Rendered to terminal
```

### Why Multiple Layers?

Each layer has a specific responsibility:

| Layer | Responsibility |
|-------|---------------|
| **DOMNode** | React reconciler - manages virtual DOM tree |
| **LayoutNode** | Bridge between React props and layout engine |
| **YogaNode** | Pure flexbox calculations (no UI concerns) |
| **Widget** | Terminal rendering (no layout concerns) |

This separation allows:
- React to handle component lifecycle
- Yoga to handle layout calculations
- unblessed to handle terminal rendering
- Each layer can be tested independently

## Current Status

**✅ Implemented:**

- React reconciler with full lifecycle support
- Yoga flexbox layout engine integration
- Components: Box, Text, Spacer, BigText, Button, Input
- `render()` function with unmount/rerender support
- Border styles and colors (per-side support)
- Flexbox properties (gap, padding, margin, alignment, etc.)
- Color conversion (string colors → terminal color codes)
- Focus effects (hover, focus states)

**🚧 In Progress:**

- Event handling hooks (useInput, useApp, useFocus)
- Text wrapping and overflow handling
- Full test coverage
- Performance optimization

**📋 Planned:**

- More component wrappers (List, ListTable, ProgressBar, etc.)
- Animation support
- Context-based theming
- Comprehensive documentation and examples

## Contributing

See the main [unblessed repository](https://github.com/vdeantoni/unblessed) for contribution guidelines.

## License

MIT © [Vinicius De Antoni](https://github.com/vdeantoni)

## Related

- [@unblessed/core](../core) - Core TUI library
- [@unblessed/layout](../layout) - Flexbox layout engine
- [@unblessed/node](../node) - Node.js runtime
- [@unblessed/browser](../browser) - Browser runtime
