/**
 * declarative-animations-demo.tsx - Demonstrates declarative animation API
 *
 * Shows how easy it is to add animations with simple props instead of
 * manual useEffect + refs + makeAnimatable boilerplate.
 */

import type { Box as BoxWidget } from "@unblessed/core";
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
 * Demo: Compare imperative vs declarative
 */
function Comparison() {
  const boxRef = React.useRef<BoxWidget>(null);

  // Imperative approach (old way)
  React.useEffect(() => {
    const widget = boxRef.current;
    if (!widget) return;

    // This is the old way - lots of boilerplate!
    // makeAnimatable(widget);
    // const stop = widget.animateBorderColors((length, frame) => {
    //   const colors = generateRainbow(length);
    //   return rotateColors(colors, frame);
    // }, { fps: 10 });
    // return () => stop();
  }, []);

  return (
    <Box flexDirection="column" gap={1}>
      <Box>
        <Text bold underline>
          Before (Imperative - 10+ lines):
        </Text>
      </Box>
      <Box border={1} borderStyle="single" padding={1}>
        <Text dim>const ref = useRef();</Text>
        <Text dim>useEffect(() =&gt; {"{"}</Text>
        <Text dim> makeAnimatable(ref.current);</Text>
        <Text dim> const stop = ref.current.animate...;</Text>
        <Text dim> return () =&gt; stop();</Text>
        <Text dim>{"}"}, []);</Text>
      </Box>

      <Box>
        <Text bold underline>
          After (Declarative - 1 prop!):
        </Text>
      </Box>
      <Box border={1} borderStyle="single" padding={1}>
        <Text color="green" bold>
          animateBorder={"{"}
          {"{"} type: "rainbow" {"}"}
          {"}"}
        </Text>
      </Box>
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

      <Box flexDirection="row" gap={2}>
        <Box flexDirection="column" gap={1}>
          <RainbowBorderBox />
          <GradientBorderBox />
          <RotatingColorsBox />
        </Box>

        <Box flexDirection="column" gap={1}>
          <PulsingText />
          <ColorCycleText />
          <FadeInBox />
        </Box>

        <Comparison />
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
