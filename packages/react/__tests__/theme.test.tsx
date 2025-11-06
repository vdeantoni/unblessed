/**
 * theme.test.tsx - Tests for theme system
 *
 * PURPOSE: Verify that themes work and colors can be resolved
 */

import { afterEach, describe, it } from "vitest";
import { Box, matrixTheme, render, Text, unblessedTheme } from "../src";
import { testRuntime } from "./setup.js";
import { expectRenderSuccess } from "./test-helpers.js";

describe("Theme System", () => {
  const instances: ReturnType<typeof render>[] = [];

  afterEach(async () => {
    // Clean up all instances
    for (const instance of instances) {
      instance.unmount();
    }
    instances.length = 0;
    // Wait for cleanup
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  it("renders with default unblessedTheme", async () => {
    const instance = render(
      <Box width={20} height={10}>
        <Text>Test</Text>
      </Box>,
      {
        runtime: testRuntime,
      },
    );
    instances.push(instance);

    await expectRenderSuccess(instance);
  });

  it("renders with matrixTheme", async () => {
    const instance = render(
      <Box width={20} height={10}>
        <Text>Test</Text>
      </Box>,
      {
        runtime: testRuntime,
        theme: matrixTheme,
      },
    );
    instances.push(instance);

    await expectRenderSuccess(instance);
  });

  it("renders with custom theme colors", async () => {
    const instance = render(
      <Box width={20} height={10} border={1} borderColor="$primary">
        <Text color="$semantic.foreground">Themed</Text>
      </Box>,
      {
        runtime: testRuntime,
        theme: unblessedTheme,
      },
    );
    instances.push(instance);

    await expectRenderSuccess(instance);
  });

  describe("Color Resolution", () => {
    it("resolves $primary semantic color", async () => {
      const instance = render(
        <Box width={20} height={10}>
          <Text color="$primary">Primary</Text>
        </Box>,
        {
          runtime: testRuntime,
          theme: unblessedTheme,
        },
      );
      instances.push(instance);

      await expectRenderSuccess(instance);
    });

    it("resolves $semantic.success color", async () => {
      const instance = render(
        <Box width={20} height={10}>
          <Text color="$semantic.success">Success</Text>
        </Box>,
        {
          runtime: testRuntime,
          theme: unblessedTheme,
        },
      );
      instances.push(instance);

      await expectRenderSuccess(instance);
    });

    it("resolves $primitives.blue.500 color", async () => {
      const instance = render(
        <Box width={20} height={10}>
          <Text color="$primitives.blue.500">Blue</Text>
        </Box>,
        {
          runtime: testRuntime,
          theme: unblessedTheme,
        },
      );
      instances.push(instance);

      await expectRenderSuccess(instance);
    });

    it("uses explicit colors without theme resolution", async () => {
      const instance = render(
        <Box width={20} height={10}>
          <Text color="cyan">Cyan</Text>
        </Box>,
        {
          runtime: testRuntime,
          theme: unblessedTheme,
        },
      );
      instances.push(instance);

      await expectRenderSuccess(instance);
    });

    it("applies matrix theme colors", async () => {
      const instance = render(
        <Box width={20} height={10} border={1} borderColor="$primary">
          <Text color="$semantic.foreground">Matrix</Text>
        </Box>,
        {
          runtime: testRuntime,
          theme: matrixTheme,
        },
      );
      instances.push(instance);

      await expectRenderSuccess(instance);
    });
  });
});
