/**
 * declarative-animations-demo.tsx - Demonstrates declarative animation API
 *
 * Shows how easy it is to add animations with simple props instead of
 * manual useEffect + refs + makeAnimatable boilerplate.
 */

import { NodeRuntime } from "@unblessed/node";
import { Box, Text, render } from "@unblessed/react";
import * as React from "react";

/**
 * Demo: Rainbow border animation (declarative)
 */
function RainbowBorderBox() {
  return (
    <Box
      border={1}
      borderStyle="double"
      padding={1}
      width={40}
      height={5}
      animateBorder={{
        type: "rainbow",
        fps: 10,
      }}
    >
      <Text bold>Rainbow Border (Declarative!)</Text>
      <Text>Just use animateBorder prop</Text>
    </Box>
  );
}

/**
 * Demo: Gradient border animation
 */
function GradientBorderBox() {
  return (
    <Box
      border={1}
      borderStyle="single"
      padding={1}
      width={40}
      height={5}
      animateBorder={{
        type: "gradient",
        colors: ["cyan", "blue", "magenta", "cyan"],
        fps: 20,
      }}
    >
      <Text bold>Gradient Border</Text>
      <Text>Custom color gradient</Text>
    </Box>
  );
}

/**
 * Demo: Rotating colors border
 */
function RotatingColorsBox() {
  return (
    <Box
      border={1}
      borderStyle="round"
      padding={1}
      width={40}
      height={5}
      animateBorder={{
        type: "rotating-colors",
        colors: ["red", "yellow", "green", "cyan"],
        fps: 5,
      }}
    >
      <Text bold>Rotating Colors</Text>
      <Text>Each segment cycles</Text>
    </Box>
  );
}

/**
 * Demo: Pulsing text
 */
function PulsingText() {
  return (
    <Box border={1} borderStyle="single" padding={1} width={40} height={5}>
      <Text
        bold
        animateColor={{
          type: "pulse",
          colors: ["red", "yellow", "red"],
          duration: 1000,
        }}
      >
        Pulsing Text Animation
      </Text>
      <Text dim>Text color pulses smoothly</Text>
    </Box>
  );
}

/**
 * Demo: Color cycle text
 */
function ColorCycleText() {
  return (
    <Box border={1} borderStyle="single" padding={1} width={40} height={5}>
      <Text
        bold
        animateColor={{
          type: "color-cycle",
          colors: ["cyan", "green", "yellow", "magenta"],
          fps: 2,
        }}
      >
        Color Cycling Text
      </Text>
      <Text dim>Cycles through colors</Text>
    </Box>
  );
}

/**
 * Demo: Fade-in effect using pulse
 */
function FadeInBox() {
  return (
    <Box
      border={1}
      borderStyle="single"
      borderColor="green"
      padding={1}
      width={40}
      height={5}
      animateColor={{
        type: "pulse",
        colors: ["gray", "green", "green"],
        duration: 1000,
      }}
    >
      <Text bold color="green">
        Fade-In Effect (Pulse)
      </Text>
      <Text dim>Uses pulse with gray→green</Text>
    </Box>
  );
}

/**
 * Demo: Chase effect (left-to-right loop)
 */
function ChaseEffectLTR() {
  return (
    <Box border={1} borderStyle="single" padding={1} width={40} height={5}>
      <Text
        animateColor={{
          type: "chase",
          baseColor: "gray",
          highlightColor: "cyan",
          width: 3,
          direction: "ltr",
          mode: "loop",
          fps: 20,
        }}
      >
        Loading data...
      </Text>
      <Text dim>Chase effect (loop)</Text>
    </Box>
  );
}

/**
 * Demo: Chase effect (bounce mode)
 */
function ChaseEffectBounce() {
  return (
    <Box border={1} borderStyle="single" padding={1} width={40} height={5}>
      <Text
        animateColor={{
          type: "chase",
          baseColor: "gray",
          highlightColor: "yellow",
          width: 4,
          direction: "ltr",
          mode: "bounce",
          fps: 15,
        }}
      >
        Processing...
      </Text>
      <Text dim>Chase effect (bounce)</Text>
    </Box>
  );
}

/**
 * Demo: Blink effect
 */
function BlinkEffect() {
  return (
    <Box border={1} borderStyle="single" padding={1} width={40} height={5}>
      <Text
        bold
        color="red"
        animateColor={{
          type: "blink",
          duration: 400,
        }}
      >
        ⚠️ Warning!
      </Text>
      <Text dim>Classic terminal blink</Text>
    </Box>
  );
}

/**
 * Demo: Gradient effect
 */
function GradientEffect() {
  return (
    <Box border={1} borderStyle="single" padding={1} width={40} height={5}>
      <Text
        bold
        animateColor={{
          type: "gradient",
          colors: ["cyan", "blue", "magenta"],
        }}
      >
        Beautiful Gradient Text
      </Text>
      <Text dim>Static gradient (not animated)</Text>
    </Box>
  );
}

/**
 * Demo: Rainbow effect
 */
function RainbowEffect() {
  return (
    <Box border={1} borderStyle="single" padding={1} width={40} height={5}>
      <Text
        bold
        animateColor={{
          type: "rainbow",
          fps: 10,
        }}
      >
        Rainbow Animation!
      </Text>
      <Text dim>Animated rainbow colors</Text>
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
          Declarative Animation API Demo
        </Text>
      </Box>

      <Box>
        <Text bold>Border Animations:</Text>
      </Box>
      <Box flexDirection="row" gap={2}>
        <RainbowBorderBox />
        <GradientBorderBox />
        <RotatingColorsBox />
      </Box>

      <Box>
        <Text bold>Text Animations (Basic):</Text>
      </Box>
      <Box flexDirection="row" gap={2}>
        <PulsingText />
        <ColorCycleText />
        <FadeInBox />
      </Box>

      <Box>
        <Text bold>Text Animations (New):</Text>
      </Box>
      <Box flexDirection="row" gap={2}>
        <ChaseEffectLTR />
        <ChaseEffectBounce />
      </Box>

      <Box flexDirection="row" gap={2}>
        <BlinkEffect />
        <GradientEffect />
        <RainbowEffect />
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
