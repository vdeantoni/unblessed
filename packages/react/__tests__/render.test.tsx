/**
 * render.test.tsx - Basic tests for React renderer
 */

import { describe, expect, it } from "vitest";
import { Box, render, Spacer, Text } from "../src/index.js";
import { testRuntime } from "./setup.js";

describe("render", () => {
  it("renders without crashing", () => {
    const instance = render(
      <Box width={40} height={10}>
        <Text>Hello</Text>
      </Box>,
      { runtime: testRuntime },
    );

    expect(instance).toBeDefined();
    expect(instance.unmount).toBeDefined();
    expect(instance.rerender).toBeDefined();

    instance.unmount();
  });

  it("renders Box component", () => {
    const instance = render(<Box width={40} height={10} />, {
      runtime: testRuntime,
    });

    expect(instance).toBeDefined();

    instance.unmount();
  });

  it("renders with flexbox layout", () => {
    const instance = render(
      <Box flexDirection="row" width={80}>
        <Box width={20} height={10} />
        <Box flexGrow={1} height={10} />
        <Box width={20} height={10} />
      </Box>,
      { runtime: testRuntime },
    );

    expect(instance).toBeDefined();

    instance.unmount();
  });
});

describe("components", () => {
  it("renders Spacer component", () => {
    const instance = render(
      <Box flexDirection="row" width={80}>
        <Box width={20} />
        <Spacer />
        <Box width={20} />
      </Box>,
      { runtime: testRuntime },
    );

    expect(instance).toBeDefined();

    instance.unmount();
  });
});
