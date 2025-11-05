/**
 * theme-demo.tsx - Comprehensive theme system demonstration
 *
 * This example demonstrates:
 * - Using themes (unblessed and matrix)
 * - Runtime theme switching via useTheme()
 * - Theme color references ($primary, $semantic.success, etc.)
 * - Explicit colors vs themed colors
 * - Multiple widget types with themed styling
 *
 * Run with:
 * node --import tsx --no-warnings theme-demo.tsx
 */
import { NodeRuntime } from "@unblessed/node";
import * as React from "react";
import {
  Box,
  Button,
  Input,
  matrixTheme,
  render,
  Text,
  unblessedTheme,
  useKeyboard,
  useTheme,
} from "../dist/index.js";

console.log(React.version);

function ThemeDemo() {
  const [theme, setTheme] = useTheme();

  const handleToggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme.name === "matrix" ? unblessedTheme : matrixTheme,
    );
  };

  // Register global keyboard shortcuts
  useKeyboard({
    t: handleToggleTheme,
  });

  return (
    <Box
      flexDirection="column"
      gap={1}
      padding={2}
      width="100%"
      height="100%"
      minHeight={50}
      minWidth={80}
    >
      {/* Header */}
      <Box border={1} padding={1} flexDirection="column" gap={1} minHeight={6}>
        <Text bold color="$primary">
          🎨 Unblessed Theme System Demo
        </Text>
        <Text color="$semantic.muted">
          Current theme: {theme.name} | Press 't' to toggle | Press 'q' to quit
        </Text>
      </Box>

      {/* Theme toggle button */}
      <Button
        border={1}
        padding={1}
        tabIndex={0}
        onPress={handleToggleTheme}
        minHeight={5}
      >
        <Text>Toggle Theme (Current: {theme.name})</Text>
      </Button>

      {/* Semantic colors showcase */}
      <Box border={1} padding={1} flexDirection="column" gap={1} minHeight={8}>
        <Text bold color="$semantic.foreground">
          Semantic Colors (Theme References):
        </Text>
        <Box flexDirection="row" gap={2} minHeight={5}>
          <Box
            border={1}
            borderColor="$semantic.success"
            padding={1}
            flexGrow={1}
            minHeight={3}
          >
            <Text color="$semantic.success">✓ Success</Text>
          </Box>
          <Box
            border={1}
            borderColor="$semantic.warning"
            padding={1}
            flexGrow={1}
            minHeight={3}
          >
            <Text color="$semantic.warning">⚠ Warning</Text>
          </Box>
          <Box
            border={1}
            borderColor="$semantic.error"
            padding={1}
            flexGrow={1}
            minHeight={3}
          >
            <Text color="$semantic.error">✗ Error</Text>
          </Box>
          <Box
            border={1}
            borderColor="$semantic.info"
            padding={1}
            flexGrow={1}
            minHeight={3}
          >
            <Text color="$semantic.info">ℹ Info</Text>
          </Box>
        </Box>
      </Box>

      {/* Primitive colors showcase */}
      <Box border={1} padding={1} flexDirection="column" gap={1} minHeight={8}>
        <Text bold color="$semantic.foreground">
          Primitive Colors (Direct References):
        </Text>
        <Box flexDirection="row" gap={2} minHeight={5}>
          <Box
            border={1}
            borderColor="$primitives.blue.500"
            padding={1}
            flexGrow={1}
            minHeight={3}
          >
            <Text color="$primitives.blue.500">Blue 500</Text>
          </Box>
          <Box
            border={1}
            borderColor="$primitives.green.500"
            padding={1}
            flexGrow={1}
            minHeight={3}
          >
            <Text color="$primitives.green.500">Green 500</Text>
          </Box>
          <Box
            border={1}
            borderColor="$primitives.purple.500"
            padding={1}
            flexGrow={1}
            minHeight={3}
          >
            <Text color="$primitives.purple.500">Purple 500</Text>
          </Box>
          <Box
            border={1}
            borderColor="$primitives.red.500"
            padding={1}
            flexGrow={1}
            minHeight={3}
          >
            <Text color="$primitives.red.500">Red 500</Text>
          </Box>
        </Box>
      </Box>

      {/* Explicit colors (ignore theme) */}
      <Box
        border={1}
        borderStyle="single"
        borderColor="cyan"
        padding={1}
        flexDirection="column"
        gap={1}
        minHeight={8}
      >
        <Text bold color="cyan">
          Explicit Colors (Theme-Independent):
        </Text>
        <Box flexDirection="row" gap={2} minHeight={3}>
          <Text color="red">Red</Text>
          <Text color="green">Green</Text>
          <Text color="blue">Blue</Text>
          <Text color="yellow">Yellow</Text>
          <Text color="magenta">Magenta</Text>
          <Text color="cyan">Cyan</Text>
        </Box>
        <Text color="$semantic.muted">
          These colors stay the same regardless of theme
        </Text>
      </Box>

      {/* Interactive components */}
      <Box border={1} padding={1} flexDirection="column" gap={1} minHeight={12}>
        <Text bold color="$semantic.foreground">
          Interactive Components:
        </Text>

        <Input />

        <Box flexDirection="row" gap={2} justifyContent="center">
          <Button
            color="$semantic.success"
            borderColor="$semantic.success"
            padding={1}
          >
            <Text>Accept</Text>
          </Button>
          <Button
            color="$semantic.error"
            borderColor="$semantic.error"
            padding={1}
          >
            <Text>Cancel</Text>
          </Button>
        </Box>
      </Box>

      {/* Footer */}
      <Box border={1} padding={1} minHeight={5}>
        <Text color="$semantic.muted">
          💡 Tip: All theme colors automatically adapt to your terminal's color
          capabilities (256-color, 16-color, etc.)
        </Text>
      </Box>
    </Box>
  );
}

// Render app with unblessed theme by default
render(<ThemeDemo />, {
  runtime: new NodeRuntime(),
  theme: matrixTheme,
});
