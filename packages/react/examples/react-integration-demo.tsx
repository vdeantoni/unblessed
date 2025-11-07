/**
 * react-integration-demo.tsx - Demonstrates new React integration features
 *
 * Shows:
 * 1. useScreen() hook for direct screen access
 * 2. forwardRef support with direct widget manipulation
 * 3. CharCanvas component for character-based animations
 * 4. BrailleCanvas component for high-resolution graphics
 */

import type {
  Box as BoxWidget,
  BrailleCanvas as BrailleCanvasWidget,
  CharCanvas as CharCanvasWidget,
} from "@unblessed/core";
import { NodeRuntime } from "@unblessed/node";
import {
  Box,
  BrailleCanvas,
  CharCanvas,
  Text,
  generateRainbow,
  makeAnimatable,
  render,
  rotateColors,
  useScreen,
  useWindowSize,
} from "@unblessed/react";
import * as React from "react";

/**
 * Demo 1: useScreen() hook
 */
function ScreenInfo() {
  const screen = useScreen();
  const { width, height } = useWindowSize();

  return (
    <Box border={1} borderStyle="single" borderColor="cyan" padding={1}>
      <Text bold>Screen Info (useScreen hook):</Text>
      <Text>
        Size: {width}x{height}
      </Text>
      <Text>Program: {screen.program.term}</Text>
    </Box>
  );
}

/**
 * Demo 2: forwardRef with direct widget manipulation
 */
function AnimatedBorder() {
  const boxRef = React.useRef<BoxWidget>(null);

  React.useEffect(() => {
    const widget = boxRef.current;
    if (!widget) return;

    // Direct widget manipulation - no React re-renders!
    makeAnimatable(widget);

    const stop = widget.animateBorderColors(
      (length, frame) => {
        const colors = generateRainbow(length);
        return rotateColors(colors, frame);
      },
      { fps: 10 },
    );

    return () => stop();
  }, []);

  return (
    <Box
      ref={boxRef}
      border={1}
      borderStyle="double"
      padding={1}
      width={40}
      height={5}
    >
      <Text bold>Animated Border (forwardRef):</Text>
      <Text>Rainbow colors via direct widget access</Text>
    </Box>
  );
}

/**
 * Demo 3: CharCanvas for character-based animations (Fixed size for now)
 */
function MatrixRainDemo() {
  const canvasRef = React.useRef<CharCanvasWidget>(null);
  const canvasWidth = 35;
  const canvasHeight = 12;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Simple matrix rain simulation
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*";
    const drops: number[] = [];

    // Initialize drops
    for (let i = 0; i < canvasWidth; i++) {
      drops.push(Math.floor(Math.random() * canvasHeight));
    }

    const interval = setInterval(() => {
      canvas.clear();

      // Update and draw each drop
      for (let x = 0; x < drops.length; x++) {
        const y = drops[x];
        const char = chars[Math.floor(Math.random() * chars.length)];
        canvas.setCell(x, y, char, 0);

        // Move drop down
        drops[x] = y >= canvasHeight - 1 ? 0 : y + 1;
      }

      canvas.screen.render();
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box border={1} borderStyle="single" borderColor="green" padding={1}>
      <Text bold color="green">
        CharCanvas Demo:
      </Text>
      <CharCanvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
    </Box>
  );
}

/**
 * Demo 4: BrailleCanvas for high-resolution graphics (Fixed size for now)
 */
function WaveformDemo() {
  const canvasRef = React.useRef<BrailleCanvasWidget>(null);
  const canvasWidth = 35;
  const canvasHeight = 10;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let frame = 0;

    const interval = setInterval(() => {
      canvas.clear();

      const { width: pixelWidth, height: pixelHeight } =
        canvas.getPixelDimensions();
      const midY = Math.floor(pixelHeight / 2);

      // Draw sine wave
      for (let x = 0; x < pixelWidth; x++) {
        const angle = (x / pixelWidth) * Math.PI * 4 + frame * 0.1;
        const y = midY + Math.floor(Math.sin(angle) * (midY - 2));
        canvas.setPixel(x, y);
      }

      // Draw cosine wave
      for (let x = 0; x < pixelWidth; x++) {
        const angle = (x / pixelWidth) * Math.PI * 4 + frame * 0.1;
        const y = midY + Math.floor(Math.cos(angle) * (midY - 4));
        canvas.setPixel(x, y);
      }

      canvas.screen.render();
      frame++;
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box border={1} borderStyle="single" borderColor="blue" padding={1}>
      <Text bold color="blue">
        BrailleCanvas Demo (High-Res):
      </Text>
      <BrailleCanvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
      />
    </Box>
  );
}

/**
 * Main App
 */
function App() {
  return (
    <Box flexDirection="column" gap={1} padding={1}>
      <Box>
        <Text bold underline>
          React Integration Demo
        </Text>
      </Box>

      <Box flexDirection="row" gap={2}>
        <Box flexDirection="column" gap={1} width={42}>
          <ScreenInfo />
          <AnimatedBorder />
        </Box>

        <Box flexDirection="column" gap={1}>
          <MatrixRainDemo />
          <WaveformDemo />
        </Box>
      </Box>

      <Box>
        <Text dim>Press 'q' or Ctrl+C to exit</Text>
      </Box>
    </Box>
  );
}

// Render
const runtime = new NodeRuntime();
render(<App />, { runtime });
