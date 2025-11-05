/**
 * theme.ts - Theme type system for @unblessed/react
 *
 * Three-layer design token architecture with cascading defaults:
 * 1. Primitives - Color scales (gray50-900, blue50-900, etc.)
 * 2. Semantic - Intent-based colors (primary, success, error, etc.)
 * 3. Global - Default styles for all components
 * 4. Components - Widget-specific overrides
 *
 * Resolution order (CSS-like cascade):
 * User Props → Component Theme → Global Theme → Hardcoded Fallbacks
 */

/**
 * Color primitive scale from lightest (50) to darkest (900).
 * Based on standard design system conventions (Tailwind, Material, etc.)
 */
export interface ColorPrimitive {
  50: string; // Lightest
  100: string;
  200: string;
  300: string;
  400: string;
  500: string; // Base
  600: string;
  700: string;
  800: string;
  900: string; // Darkest
}

/**
 * Complete set of color primitives.
 * These are the foundational colors that semantic and component colors reference.
 */
export interface ThemePrimitives {
  // Grayscale (for text, borders, backgrounds)
  gray: ColorPrimitive;

  // Brand colors
  blue: ColorPrimitive;
  purple: ColorPrimitive;
  cyan: ColorPrimitive;
  teal: ColorPrimitive;

  // Semantic intent colors
  green: ColorPrimitive; // Success
  yellow: ColorPrimitive; // Warning
  red: ColorPrimitive; // Error/Danger
  orange: ColorPrimitive; // Info
}

/**
 * Semantic colors that map intent to specific primitive colors.
 * These provide meaning and should be used instead of primitives when possible.
 */
export interface ThemeSemantic {
  // Base colors
  foreground: string; // Default text color
  background: string; // Default background

  // Interactive states
  primary: string; // Primary actions/highlights
  secondary: string; // Secondary actions
  accent: string; // Accent/emphasis
  muted: string; // De-emphasized text

  // Intent colors
  success: string; // Success states
  warning: string; // Warning states
  error: string; // Error states
  info: string; // Info states

  // UI elements
  border: string; // Default border color
  shadow: string; // Shadow/overlay color

  // Focus
  focus: string; // Focus color
}

/**
 * Global defaults that apply to ALL components unless overridden.
 * Provides DRY defaults and consistent styling across the theme.
 *
 * Resolution order: Component Theme → Global → Hardcoded Fallbacks
 */
export interface GlobalDefaults {
  // Text defaults
  fg?: string; // Default foreground color
  bg?: string; // Default background color

  // Border defaults
  borderStyle?: string; // 'single', 'double', 'round', 'bold'
  borderColor?: string;
  focusBorderColor?: string;
}

/**
 * Component-specific color defaults.
 * Each widget type can define its default color scheme.
 * All fields are optional - components inherit from global defaults.
 */
export interface ComponentDefaults {
  box: {
    bg?: string;
    fg?: string;
    borderStyle?: string;
  };
  button: {
    bg?: string;
    fg?: string;
    borderStyle?: string;
    hoverBg?: string;
    hoverFg?: string;
  };
  input: {
    bg?: string;
    fg?: string;
    borderStyle?: string;
  };
  text: {
    fg?: string;
    bg?: string;
  };
  bigtext: {
    fg?: string;
  };
  list: {
    bg?: string;
    fg?: string;
    borderStyle?: string;
    item?: {
      bg?: string;
      fg?: string;
      selectedFg?: string;
      selectedBg?: string;
      hoverFg?: string;
      hoverBg?: string;
    };
  };
  progressBar: {
    bg?: string;
    fg?: string;
    bar?: string;
    borderStyle?: string;
  };
  scrollbar: {
    track?: string;
    thumb?: string;
  };
}

/**
 * Complete theme definition combining all four layers.
 *
 * Resolution order (CSS-like cascade):
 * User Props (highest) → Component → Global → Hardcoded (lowest)
 */
export interface Theme {
  name: string;
  primitives: ThemePrimitives;
  semantic: ThemeSemantic;
  global: GlobalDefaults;
  components: ComponentDefaults;
}
