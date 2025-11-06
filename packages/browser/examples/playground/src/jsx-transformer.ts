/**
 * JSXTransformer - Detects and transforms JSX code to JavaScript
 */

import type { TransformResult } from "./types.js";

/**
 * Handles JSX detection and transformation using Babel
 */
export class JSXTransformer {
  private transform: any;

  constructor(transform: any) {
    this.transform = transform;
  }

  /**
   * Check if code contains JSX
   * Uses multiple heuristics to detect JSX patterns
   */
  isJSXCode(code: string): boolean {
    // Check for common JSX patterns
    return (
      // Imports from tuiReact or React usage
      code.includes("tuiReact") ||
      code.includes("React") ||
      // render function with JSX syntax
      code.includes("render(<") ||
      // JSX components (capitalized tags): <Box>, <Text>
      /<[A-Z]/.test(code) ||
      // Closing JSX tags
      code.includes("</") ||
      // React hooks usage
      /const\s+\{\s*\w+\s*\}\s*=\s*React/.test(code) ||
      // Common React patterns
      code.includes("useState") ||
      code.includes("useEffect")
    );
  }

  /**
   * Transform JSX code to regular JavaScript
   */
  transformJSX(code: string): string {
    try {
      const result = this.transform(code, {
        presets: ["react"],
        filename: "playground.jsx",
      });
      return result.code;
    } catch (error: any) {
      throw new Error(`JSX transformation failed: ${error.message}`);
    }
  }

  /**
   * Process code - detect JSX and transform if needed
   */
  process(code: string): TransformResult {
    const isJSX = this.isJSXCode(code);

    if (isJSX) {
      const transformedCode = this.transformJSX(code);
      return { code: transformedCode, isJSX: true };
    }

    return { code, isJSX: false };
  }
}
