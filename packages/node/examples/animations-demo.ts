/**
 * animations-demo.ts - Comprehensive demonstration of animation capabilities
 *
 * Showcases:
 * - makeAnimatable with border animations
 * - pulse() effects
 * - CharCanvas for character-based animations
 * - BrailleCanvas for high-resolution graphics
 * - Spring physics
 * - AnimationController
 *
 * Run with: node --import tsx --no-warnings animations-demo.ts
 */

import {
  Box,
  BrailleCanvas,
  CharCanvas,
  generateGradient,
  generateRainbow,
  rotateColors,
  Screen,
  setRuntime,
  Spring,
} from "@unblessed/core";
import { NodeRuntime } from "@unblessed/node"; // Initialize runtime

// Initialize runtime
setRuntime(new NodeRuntime());

// Create screen
const screen = new Screen({
  smartCSR: true,
  title: "unblessed Animations Demo",
});

// =============================================================================
// 1. RAINBOW BORDER ANIMATION
// =============================================================================

const rainbowBox = new Box({
  parent: screen,
  top: 1,
  left: 2,
  width: 38,
  height: 7,
  border: { type: "line" },
  content:
    "{center}{bold}Rainbow Border Animation{/bold}\n\nUsing animateBorderColors(){/center}",
  tags: true,
  animatable: true, // Enable animations!
});

// Animate rainbow border
rainbowBox.animateBorderColors!(
  (length, frame) => {
    const colors = generateRainbow(length);
    return rotateColors(colors, frame);
  },
  { fps: 15 },
);

// =============================================================================
// 2. GRADIENT BORDER ANIMATION
// =============================================================================

const gradientBox = new Box({
  parent: screen,
  top: 1,
  left: 42,
  width: 38,
  height: 7,
  border: { type: "line" },
  content: "{center}{bold}Gradient Border{/bold}\n\nCyan → Magenta{/center}",
  tags: true,
  animatable: true,
});

gradientBox.animateBorderColors!(
  (length, frame) => {
    const gradient = generateGradient("cyan", "magenta", length);
    return rotateColors(gradient, frame);
  },
  { fps: 15 },
);

// =============================================================================
// 3. PULSE EFFECT
// =============================================================================

const pulseBox = new Box({
  parent: screen,
  top: 9,
  left: 2,
  width: 26,
  height: 5,
  border: { type: "line" },
  content: "{center}{bold}Pulse Effect{/bold}{/center}",
  tags: true,
  animatable: true,
});

pulseBox.pulse!("fg", ["red", "yellow", "red"], { duration: 1000 });

// =============================================================================
// 4. SPRING PHYSICS - BOUNCING BALL
// =============================================================================

const springBox = new Box({
  parent: screen,
  top: 9,
  left: 30,
  width: 28,
  height: 5,
  border: { type: "line" },
  content: "{center}Spring Physics{/center}",
  tags: true,
});

// Bouncing ball with spring physics
const ballSpring = new Spring(0, 150, 8); // position, stiffness, damping
const boxWidth = 26; // 28 - 2 for borders
let currentTarget = boxWidth - 1;
ballSpring.setTarget(currentTarget);

setInterval(() => {
  const position = ballSpring.update(1 / 30);

  // Check if spring has settled near target, then reverse direction
  if (ballSpring.isAtRest() && Math.abs(position - currentTarget) < 1) {
    currentTarget = currentTarget === 0 ? boxWidth - 1 : 0;
    ballSpring.setTarget(currentTarget);
  }

  // Create visual representation of bouncing ball
  const ballPos = Math.round(Math.max(0, Math.min(boxWidth - 1, position)));
  const line = " ".repeat(ballPos) + "●" + " ".repeat(boxWidth - ballPos - 1);

  springBox.setContent(`{center}Spring Physics{/center}\n${line}`);
  screen.renderThrottled();
}, 1000 / 30);

// =============================================================================
// 5. CHARCANVAS - MATRIX RAIN
// =============================================================================

const charCanvas = new CharCanvas({
  parent: screen,
  top: 15,
  left: 2,
  width: 38,
  height: 12,
  border: { type: "line" },
  style: {
    fg: "green",
    bg: "transparent",
  },
});

// Matrix rain drops
interface Drop {
  x: number;
  y: number;
  length: number;
  speed: number;
}

const drops: Drop[] = [];
// Get actual canvas dimensions (accounts for border automatically)
const charCanvasWidth = charCanvas.getCanvasWidth();
const charCanvasHeight = charCanvas.getCanvasHeight();

// Initialize drops
for (let i = 0; i < 15; i++) {
  drops.push({
    x: Math.floor(Math.random() * charCanvasWidth),
    y: Math.floor(Math.random() * charCanvasHeight),
    length: 3 + Math.floor(Math.random() * 5),
    speed: 0.3 + Math.random() * 0.5,
  });
}

const matrixChars = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ0123456789";

setInterval(() => {
  // Fade existing characters
  for (let y = 0; y < charCanvasHeight; y++) {
    for (let x = 0; x < charCanvasWidth; x++) {
      const cell = charCanvas.getCell(x, y);
      if (cell && cell[1] !== " ") {
        charCanvas.setCell(x, y, " ", 0);
      }
    }
  }

  // Update and draw drops
  drops.forEach((drop) => {
    drop.y += drop.speed;

    // Draw the drop trail
    for (let i = 0; i < drop.length; i++) {
      const y = Math.floor(drop.y - i);
      if (y >= 0 && y < charCanvasHeight) {
        const char =
          matrixChars[Math.floor(Math.random() * matrixChars.length)];
        charCanvas.setCell(drop.x, y, char, 0);
      }
    }

    // Reset if off screen
    if (drop.y > charCanvasHeight + drop.length) {
      drop.y = -drop.length;
      drop.x = Math.floor(Math.random() * charCanvasWidth);
    }
  });

  screen.renderThrottled();
}, 80);

// =============================================================================
// 6. BRAILLECANVAS - SINE WAVE
// =============================================================================

const brailleCanvas = new BrailleCanvas({
  parent: screen,
  top: 15,
  left: 42,
  width: 38,
  height: 12,
});

let phase = 0;

setInterval(() => {
  brailleCanvas.clear();

  // Plot sine wave
  brailleCanvas.plotFunction(
    (x) => Math.sin(x + phase),
    0,
    Math.PI * 4,
    1,
    18,
    24,
  );

  // Plot cosine wave
  brailleCanvas.plotFunction(
    (x) => Math.cos(x + phase),
    0,
    Math.PI * 4,
    1,
    18,
    24,
  );

  phase += 0.1;
  screen.renderThrottled();
}, 50);

// =============================================================================
// LABELS
// =============================================================================

new Box({
  parent: screen,
  top: 14,
  left: 2,
  width: 38,
  height: 1,
  content: "{center}{bold}CharCanvas - Matrix Rain{/bold}{/center}",
  tags: true,
});

new Box({
  parent: screen,
  top: 14,
  left: 42,
  width: 38,
  height: 1,
  content: "{center}{bold}BrailleCanvas - Sine/Cosine{/bold}{/center}",
  tags: true,
});

// Info box
new Box({
  parent: screen,
  bottom: 0,
  left: 0,
  right: 0,
  height: 1,
  content:
    "{center}Press Ctrl+C to exit | unblessed Animation System Demo{/center}",
  tags: true,
  style: {
    fg: "white",
    bg: "blue",
  },
});

// Set max FPS for smoother animations
screen.setMaxFPS(30);

// Initial render
screen.render();

// Handle quit
screen.key(["C-c"], () => {
  process.exit(0);
});
