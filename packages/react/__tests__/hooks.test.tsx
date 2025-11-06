/**
 * hooks.test.tsx - Tests for useScreen and useWindowSize hooks
 *
 * PURPOSE: Verify that hooks provide access to screen and dimensions
 */

import { describe, expect, it } from "vitest";
import { Box, render, Text, useScreen, useWindowSize } from "../src";
import { testRuntime } from "./setup.js";
import { expectRenderSuccess } from "./test-helpers.js";

describe("Screen Hooks", () => {
  describe("useScreen", () => {
    it("provides access to screen instance", async () => {
      let capturedScreen: any = null;

      function TestApp() {
        capturedScreen = useScreen();
        return (
          <Box width={20} height={10}>
            <Text>Test</Text>
          </Box>
        );
      }

      const instance = render(<TestApp />, {
        runtime: testRuntime,
      });

      await expectRenderSuccess(instance);

      expect(capturedScreen).toBeDefined();
      expect(capturedScreen).toBe(instance.screen);

      instance.unmount();
    });

    it("provides same screen instance across components", async () => {
      const screens: any[] = [];

      function ComponentA() {
        screens.push(useScreen());
        return (
          <Box width={10} height={5}>
            <Text>A</Text>
          </Box>
        );
      }

      function ComponentB() {
        screens.push(useScreen());
        return (
          <Box width={10} height={5}>
            <Text>B</Text>
          </Box>
        );
      }

      function TestApp() {
        return (
          <Box flexDirection="row" width={20} height={5}>
            <ComponentA />
            <ComponentB />
          </Box>
        );
      }

      const instance = render(<TestApp />, {
        runtime: testRuntime,
      });

      await expectRenderSuccess(instance);

      expect(screens.length).toBe(2);
      expect(screens[0]).toBe(screens[1]); // Same screen instance

      instance.unmount();
    });
  });

  describe("useWindowSize", () => {
    it("returns current screen dimensions", async () => {
      let capturedSize: any = null;

      function TestApp() {
        capturedSize = useWindowSize();
        return (
          <Box width={20} height={10}>
            <Text>Test</Text>
          </Box>
        );
      }

      const instance = render(<TestApp />, {
        runtime: testRuntime,
      });

      await expectRenderSuccess(instance);

      expect(capturedSize).toBeDefined();
      expect(capturedSize.width).toBeDefined();
      expect(capturedSize.height).toBeDefined();

      instance.unmount();
    });
  });
});
