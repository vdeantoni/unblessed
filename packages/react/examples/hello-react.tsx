#!/usr/bin/env tsx
/**
 * hello-react.tsx - Example showcasing @unblessed/react with various border styles
 *
 * Demonstrates:
 * - Various border styles (single, double, round, bold)
 * - Per-side border colors
 * - Flexbox layout with gap
 * - Spacer component
 * - Nested borders
 * - Theme color references
 * - useKeyboard() hook for shortcuts
 *
 * Run with:
 *   tsx packages/react/examples/hello-react.tsx
 *   or
 *   node --import tsx --no-warnings hello-react.tsx
 */
import { NodeRuntime } from "@unblessed/node";
import * as React from "react";
import {
  BigText,
  Box,
  Button,
  Input,
  List,
  render,
  Spacer,
  Text,
} from "../dist/index.js";

const App: React.FC = () => {
  return (
    <Box
      flexDirection="column"
      padding={2}
      gap={1}
      width="100%"
      height="100%"
      minHeight={50}
      minWidth={80}
    >
      {/* Title */}
      <Box justifyContent="center" minHeight={6}>
        <BigText char="U" color="$primary">
          UNBLESSED
        </BigText>
      </Box>

      {/* Header with input */}
      <Box flexDirection="column" padding={1} border={1} gap={1} minHeight={10}>
        <Input />
        <Text color="$semantic.primary">@unblessed/react Border Showcase</Text>
      </Box>

      {/* Border styles */}
      <Box flexDirection="row" gap={1} minHeight={7}>
        <Box
          width={18}
          border={1}
          padding={1}
          hover={{ border: { color: "green", dim: true } }}
          minHeight={5}
        >
          <Text>Single</Text>
        </Box>
        <Box
          width={18}
          border={1}
          borderStyle="double"
          borderColor="$semantic.warning"
          padding={1}
          minHeight={5}
        >
          <Text>Double</Text>
        </Box>
        <Box
          width={18}
          border={1}
          borderStyle="round"
          borderColor="magenta"
          padding={1}
          minHeight={5}
        >
          <Text>Round</Text>
        </Box>
        <Box
          width={18}
          border={1}
          borderStyle="bold"
          borderColor="$semantic.error"
          padding={1}
          minHeight={5}
        >
          <Text>Bold</Text>
        </Box>
      </Box>

      {/* Per-side border colors */}
      <Box flexDirection="row" gap={1} minHeight={7}>
        <Box
          flexGrow={1}
          border={1}
          borderTopColor="red"
          borderBottomColor="blue"
          borderLeftColor="green"
          borderRightColor="yellow"
          padding={1}
          minHeight={5}
        >
          <Text>Per-side colors (R/B/G/Y)</Text>
        </Box>

        <Box
          width={25}
          border={1}
          borderStyle="single"
          borderColor="cyan"
          borderDimColor={true}
          padding={1}
          minHeight={5}
        >
          <Text>Dim border</Text>
        </Box>
      </Box>

      {/* Flexbox with borders and spacer */}
      <Box flexDirection="row" gap={1}>
        <Box width={20}>
          <Button>{"{center}LEFT{/center}"}</Button>
        </Box>

        <Spacer />

        <Box width={30} flexDirection="column">
          <List label="This is rad!" items={["Oi", "Tchau"]} />
        </Box>
      </Box>

      {/* Nested borders */}
      <Box
        border={1}
        borderStyle="double"
        borderColor="magenta"
        padding={1}
        minHeight={7}
      >
        <Box border={1} borderStyle="single" borderColor="cyan" padding={1}>
          <Text>Nested borders (double outer, single inner)</Text>
        </Box>
      </Box>

      {/* Footer */}
      <Spacer />
      <Box
        border={1}
        borderStyle="single"
        borderColor="$semantic.border"
        padding={1}
        minHeight={5}
      >
        <Text color="$semantic.muted" dim>
          Press 'q' or Ctrl+C to quit
        </Text>
      </Box>
    </Box>
  );
};

// Render with unblessed theme
render(<App />, {
  runtime: new NodeRuntime(),
  debug: false,
});
