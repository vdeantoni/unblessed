/**
 * helpers.ts - Helper functions for widget descriptor composition
 *
 * These functions provide reusable logic that descriptors can compose together,
 * avoiding the need for complex inheritance hierarchies.
 */

import { colors } from "@unblessed/core";
import type { FlexboxProps } from "@unblessed/layout";
import { merge } from "lodash-es";
import { resolveColor } from "../themes/theme-utils.js";
import type { Theme } from "../themes/theme.js";
import type {
  BorderProps,
  BorderStyleObject,
  FocusableProps,
  StyleObject,
} from "./common-props.js";

/**
 * Descriptor interface for helpers.
 * Defines the minimum properties helpers need from a descriptor.
 */
export interface DescriptorLike {
  props: any;
  theme: Theme;
  type: string;
}

/**
 * Props that include border numbers (for Yoga layout)
 */
interface BorderNumberProps {
  border?: number;
  borderTop?: number;
  borderBottom?: number;
  borderLeft?: number;
  borderRight?: number;
}

/**
 * Gets component defaults by merging global and component-specific theme defaults.
 * Global defaults are applied first, then overridden by component-specific defaults.
 *
 * @param descriptor - Descriptor instance with type and theme
 * @returns Merged defaults (global → component)
 */
export function getComponentDefaults(descriptor: DescriptorLike): any {
  const componentKey =
    descriptor.type as keyof typeof descriptor.theme.components;
  return merge(
    {},
    descriptor.theme.global,
    descriptor.theme.components[componentKey],
  );
}

/**
 * Extracts all defined flexbox properties from props.
 * Handles the common pattern of checking 40+ flexbox props and only including defined ones.
 *
 * @param props - Component props
 * @returns FlexboxProps with only defined properties
 */
export function extractFlexboxProps(props: any): FlexboxProps {
  const flexboxProps: FlexboxProps = {};

  // Layout properties
  if (props.flexGrow !== undefined) flexboxProps.flexGrow = props.flexGrow;
  if (props.flexShrink !== undefined)
    flexboxProps.flexShrink = props.flexShrink;
  if (props.flexBasis !== undefined) flexboxProps.flexBasis = props.flexBasis;
  if (props.flexDirection !== undefined)
    flexboxProps.flexDirection = props.flexDirection;
  if (props.flexWrap !== undefined) flexboxProps.flexWrap = props.flexWrap;
  if (props.justifyContent !== undefined)
    flexboxProps.justifyContent = props.justifyContent;
  if (props.alignItems !== undefined)
    flexboxProps.alignItems = props.alignItems;
  if (props.alignSelf !== undefined) flexboxProps.alignSelf = props.alignSelf;

  // Dimensions
  if (props.width !== undefined) flexboxProps.width = props.width;
  if (props.height !== undefined) flexboxProps.height = props.height;
  if (props.minWidth !== undefined) flexboxProps.minWidth = props.minWidth;
  if (props.minHeight !== undefined) flexboxProps.minHeight = props.minHeight;
  if (props.maxWidth !== undefined) flexboxProps.maxWidth = props.maxWidth;
  if (props.maxHeight !== undefined) flexboxProps.maxHeight = props.maxHeight;

  // Padding
  if (props.padding !== undefined) flexboxProps.padding = props.padding;
  if (props.paddingX !== undefined) flexboxProps.paddingX = props.paddingX;
  if (props.paddingY !== undefined) flexboxProps.paddingY = props.paddingY;
  if (props.paddingTop !== undefined)
    flexboxProps.paddingTop = props.paddingTop;
  if (props.paddingBottom !== undefined)
    flexboxProps.paddingBottom = props.paddingBottom;
  if (props.paddingLeft !== undefined)
    flexboxProps.paddingLeft = props.paddingLeft;
  if (props.paddingRight !== undefined)
    flexboxProps.paddingRight = props.paddingRight;

  // Borders (for Yoga layout - 1 means reserve space, 0 means no space)
  if (props.border !== undefined) flexboxProps.border = props.border ? 1 : 0;
  if (props.borderTop !== undefined) flexboxProps.borderTop = props.borderTop;
  if (props.borderBottom !== undefined)
    flexboxProps.borderBottom = props.borderBottom;
  if (props.borderLeft !== undefined)
    flexboxProps.borderLeft = props.borderLeft;
  if (props.borderRight !== undefined)
    flexboxProps.borderRight = props.borderRight;

  // Margin
  if (props.margin !== undefined) flexboxProps.margin = props.margin;
  if (props.marginX !== undefined) flexboxProps.marginX = props.marginX;
  if (props.marginY !== undefined) flexboxProps.marginY = props.marginY;
  if (props.marginTop !== undefined) flexboxProps.marginTop = props.marginTop;
  if (props.marginBottom !== undefined)
    flexboxProps.marginBottom = props.marginBottom;
  if (props.marginLeft !== undefined)
    flexboxProps.marginLeft = props.marginLeft;
  if (props.marginRight !== undefined)
    flexboxProps.marginRight = props.marginRight;

  // Gap
  if (props.gap !== undefined) flexboxProps.gap = props.gap;
  if (props.rowGap !== undefined) flexboxProps.rowGap = props.rowGap;
  if (props.columnGap !== undefined) flexboxProps.columnGap = props.columnGap;

  // Position
  if (props.position !== undefined) flexboxProps.position = props.position;
  if (props.display !== undefined) flexboxProps.display = props.display;

  return flexboxProps;
}

/**
 * Extracts event handlers from props and maps them to unblessed event names.
 * Handles the common pattern of mapping React event props to widget events.
 *
 * @param props - Component props
 * @returns Record of event name to handler function
 */
export function extractEventHandlers(props: any): Record<string, Function> {
  const handlers: Record<string, Function> = {};

  // Mouse events
  if (props.onClick) handlers.click = props.onClick;
  if (props.onMouseDown) handlers.mousedown = props.onMouseDown;
  if (props.onMouseUp) handlers.mouseup = props.onMouseUp;
  if (props.onMouseMove) handlers.mousemove = props.onMouseMove;
  if (props.onMouseOver) handlers.mouseover = props.onMouseOver;
  if (props.onMouseOut) handlers.mouseout = props.onMouseOut;
  if (props.onMouseWheel) handlers.mousewheel = props.onMouseWheel;
  if (props.onWheelDown) handlers.wheeldown = props.onWheelDown;
  if (props.onWheelUp) handlers.wheelup = props.onWheelUp;

  // Keyboard events
  if (props.onKeyPress) handlers.keypress = props.onKeyPress;

  // Focus events
  if (props.onFocus) handlers.focus = props.onFocus;
  if (props.onBlur) handlers.blur = props.onBlur;

  return handlers;
}

/**
 * Builds List item styling options with theme fallback.
 * Handles the pattern of: use prop style OR theme defaults, then map to option names.
 *
 * @param descriptor - Descriptor instance
 * @param propStyle - Style object from props (itemStyle, itemSelected, or itemHover)
 * @param themeDefaults - Theme defaults for this item type (defaults.item)
 * @param config - Configuration for mapping style to options
 * @returns Options object with mapped style properties
 */
export function buildItemStyles(
  descriptor: DescriptorLike,
  propStyle: StyleObject | undefined,
  themeDefaults: any | undefined,
  config: {
    optionPrefix: string; // 'item', 'selected', 'itemHover'
    isEffects?: boolean; // If true, builds effects object instead of flat props
    themeFgKey?: string; // Key for theme fg (e.g., 'fg', 'selectedFg', 'hoverFg')
    themeBgKey?: string; // Key for theme bg
  },
): Record<string, any> {
  const options: Record<string, any> = {};

  if (propStyle) {
    // Use user-provided style
    const style = buildStyleObject(descriptor, propStyle);

    if (config.isEffects) {
      // Build effects object (for hover)
      const effects: any = {};
      if (style.fg !== undefined) effects.fg = style.fg;
      if (style.bg !== undefined) effects.bg = style.bg;
      if (Object.keys(effects).length > 0) {
        options[`${config.optionPrefix}Effects`] = effects;
      }
    } else {
      // Map to flat option properties
      if (style.fg !== undefined)
        options[`${config.optionPrefix}Fg`] = style.fg;
      if (style.bg !== undefined)
        options[`${config.optionPrefix}Bg`] = style.bg;
      if (style.bold !== undefined)
        options[`${config.optionPrefix}Bold`] = style.bold;
      if (style.underline !== undefined)
        options[`${config.optionPrefix}Underline`] = style.underline;
      if (style.blink !== undefined)
        options[`${config.optionPrefix}Blink`] = style.blink;
      if (style.inverse !== undefined)
        options[`${config.optionPrefix}Inverse`] = style.inverse;
    }
  } else if (themeDefaults) {
    // Use theme defaults
    if (config.isEffects) {
      // Build effects object from theme
      const effects: any = {};
      if (config.themeFgKey && themeDefaults[config.themeFgKey] !== undefined) {
        const resolved = resolveColor(
          themeDefaults[config.themeFgKey],
          descriptor.theme,
        );
        effects.fg = colors.convert(resolved);
      }
      if (config.themeBgKey && themeDefaults[config.themeBgKey] !== undefined) {
        const resolved = resolveColor(
          themeDefaults[config.themeBgKey],
          descriptor.theme,
        );
        effects.bg = colors.convert(resolved);
      }
      if (Object.keys(effects).length > 0) {
        options[`${config.optionPrefix}Effects`] = effects;
      }
    } else {
      // Map flat theme properties
      if (config.themeFgKey && themeDefaults[config.themeFgKey] !== undefined) {
        const resolved = resolveColor(
          themeDefaults[config.themeFgKey],
          descriptor.theme,
        );
        options[`${config.optionPrefix}Fg`] = colors.convert(resolved);
      }
      if (config.themeBgKey && themeDefaults[config.themeBgKey] !== undefined) {
        const resolved = resolveColor(
          themeDefaults[config.themeBgKey],
          descriptor.theme,
        );
        options[`${config.optionPrefix}Bg`] = colors.convert(resolved);
      }
    }
  }

  return options;
}

/**
 * Builds border configuration from descriptor props.
 * Only creates border if Yoga knows about it (border numbers are set).
 *
 * @param descriptor - Descriptor instance
 * @returns Border object or null if no border
 */
export function buildBorder(descriptor: DescriptorLike): any | null {
  const props = descriptor.props as BorderProps & BorderNumberProps;

  // Only create border if Yoga knows about it
  if (
    !Number(props.border) &&
    !Number(props.borderTop) &&
    !Number(props.borderBottom) &&
    !Number(props.borderLeft) &&
    !Number(props.borderRight)
  ) {
    return null;
  }

  const defaults = getComponentDefaults(descriptor);

  const border: any = {
    type: "line",
    style: props.borderStyle || defaults.borderStyle || "single",
    top: props.borderTop !== undefined ? Number(props.borderTop) > 0 : true,
    bottom:
      props.borderBottom !== undefined ? Number(props.borderBottom) > 0 : true,
    left: props.borderLeft !== undefined ? Number(props.borderLeft) > 0 : true,
    right:
      props.borderRight !== undefined ? Number(props.borderRight) > 0 : true,
  };

  // Main border color
  if (props.borderColor) {
    border.fg = colors.convert(
      resolveColor(props.borderColor, descriptor.theme),
    );
  } else if (defaults.borderColor) {
    border.fg = colors.convert(
      resolveColor(defaults.borderColor, descriptor.theme),
    );
  }

  // Per-side colors
  if (props.borderTopColor) {
    border.topColor = colors.convert(
      resolveColor(props.borderTopColor, descriptor.theme),
    );
  }
  if (props.borderBottomColor) {
    border.bottomColor = colors.convert(
      resolveColor(props.borderBottomColor, descriptor.theme),
    );
  }
  if (props.borderLeftColor) {
    border.leftColor = colors.convert(
      resolveColor(props.borderLeftColor, descriptor.theme),
    );
  }
  if (props.borderRightColor) {
    border.rightColor = colors.convert(
      resolveColor(props.borderRightColor, descriptor.theme),
    );
  }

  // Dim properties
  if (props.borderDimColor !== undefined) border.dim = props.borderDimColor;
  if (props.borderTopDim !== undefined)
    border.borderTopDim = props.borderTopDim;
  if (props.borderBottomDim !== undefined)
    border.borderBottomDim = props.borderBottomDim;
  if (props.borderLeftDim !== undefined)
    border.borderLeftDim = props.borderLeftDim;
  if (props.borderRightDim !== undefined)
    border.borderRightDim = props.borderRightDim;

  return border;
}

/**
 * Initializes border and style.border for widget options.
 * Handles border creation, style.border.fg pre-population, and ensures
 * style.border exists when hover/focus effects need it.
 *
 * @param descriptor - Descriptor instance
 * @param hasHoverBorder - Whether hover effects include border styling
 * @param hasFocusBorder - Whether focus effects include border styling
 * @returns Object with border and style properties
 */
export function initializeBorderStyle(
  descriptor: DescriptorLike,
  hasHoverBorder: boolean = false,
  hasFocusBorder: boolean = false,
): { border?: any; style: any } {
  const border = buildBorder(descriptor);
  const style: any = {};

  // Pre-populate style.border.fg for unblessed compatibility
  if (border?.fg !== undefined) {
    style.border = { fg: border.fg };
  }

  // Ensure style.border exists if effects use borders
  if (hasHoverBorder || hasFocusBorder) {
    style.border = style.border || {};
  }

  return { border, style };
}

/**
 * Builds text style object from descriptor props.
 * Wrapper around buildStyleObject that allows overriding the component type
 * for theme lookups.
 *
 * @param descriptor - Descriptor instance
 * @param componentType - Override for component type (defaults to descriptor.type)
 * @returns Style object or null
 */
export function buildTextStyles(
  descriptor: DescriptorLike,
  componentType?: string,
): any | null {
  const descriptorForTheme = componentType
    ? { ...descriptor, type: componentType }
    : descriptor;
  return buildStyleObject(descriptorForTheme);
}

/**
 * Builds focusable widget options.
 * Sets tabIndex and enables keyable/clickable for focus support.
 *
 * @param props - Props with focus configuration
 * @param defaultTabIndex - Default tabIndex if not provided
 * @returns Options object with focus properties
 */
export function buildFocusableOptions(
  props: FocusableProps,
  defaultTabIndex?: number,
): any {
  const options: any = {};

  if (props.tabIndex !== undefined) {
    options.tabIndex = props.tabIndex;
  } else if (defaultTabIndex !== undefined) {
    options.tabIndex = defaultTabIndex;
  }

  // Enable keyable/clickable if element has tabIndex
  if (options.tabIndex !== undefined) {
    if (options.tabIndex >= 0) {
      options.keyable = true;
      options.clickable = true;
    }
  }

  return options;
}

/**
 * Merges multiple style objects, handling nested border properties.
 *
 * @param styles - Style objects to merge
 * @returns Merged style object or null
 */
export function mergeStyles(...styles: any[]): any {
  const merged: any = {};

  for (const style of styles) {
    if (!style) continue;

    for (const [key, value] of Object.entries(style)) {
      if (key === "border" && merged.border) {
        merged.border = { ...merged.border, ...(value as any) };
      } else {
        merged[key] = value;
      }
    }
  }

  return Object.keys(merged).length > 0 ? merged : null;
}

/**
 * Builds border style object from BorderStyleObject.
 * Converts color names to numbers and normalizes shorthands.
 *
 * @param borderStyle - Border style configuration
 * @param theme - Theme for color resolution
 * @returns Unblessed border style object
 */
function buildBorderStyleObject(
  borderStyle: BorderStyleObject,
  theme: Theme,
): any {
  const border: any = {};

  // Normalize color shorthands
  const fg = borderStyle.color ?? borderStyle.fg;
  const bg =
    borderStyle.bg ?? borderStyle.background ?? borderStyle.backgroundColor;

  // Main colors
  if (fg) border.fg = colors.convert(resolveColor(fg, theme));
  if (bg) border.bg = colors.convert(resolveColor(bg, theme));

  // Per-side colors
  if (borderStyle.topColor) {
    border.topColor = colors.convert(resolveColor(borderStyle.topColor, theme));
  }
  if (borderStyle.bottomColor) {
    border.bottomColor = colors.convert(
      resolveColor(borderStyle.bottomColor, theme),
    );
  }
  if (borderStyle.leftColor) {
    border.leftColor = colors.convert(
      resolveColor(borderStyle.leftColor, theme),
    );
  }
  if (borderStyle.rightColor) {
    border.rightColor = colors.convert(
      resolveColor(borderStyle.rightColor, theme),
    );
  }

  // Dim properties
  if (borderStyle.dim !== undefined) border.dim = borderStyle.dim;
  if (borderStyle.topDim !== undefined) border.topDim = borderStyle.topDim;
  if (borderStyle.bottomDim !== undefined)
    border.bottomDim = borderStyle.bottomDim;
  if (borderStyle.leftDim !== undefined) border.leftDim = borderStyle.leftDim;
  if (borderStyle.rightDim !== undefined)
    border.rightDim = borderStyle.rightDim;

  return border;
}

/**
 * Builds style object from StyleObject.
 * Converts React props to unblessed style format with theme resolution.
 *
 * @param descriptor - Descriptor instance
 * @param styleObj - Style configuration (optional, uses descriptor.props if not provided)
 * @returns Unblessed style object
 */
export function buildStyleObject(
  descriptor: DescriptorLike,
  styleObj?: StyleObject,
): any {
  const style = styleObj || (descriptor.props as StyleObject);
  if (!style) return {};

  const result: any = {};
  const componentDefaults = getComponentDefaults(descriptor);

  // Normalize color shorthands with cascade: user prop → component → global
  const fg = style.fg ?? style.color ?? componentDefaults.fg;
  const bg =
    style.bg ??
    style.background ??
    style.backgroundColor ??
    componentDefaults.bg;

  // Convert colors
  if (fg) result.fg = colors.convert(resolveColor(fg, descriptor.theme));
  if (bg) result.bg = colors.convert(resolveColor(bg, descriptor.theme));

  // Text styles
  if (style.bold !== undefined) result.bold = style.bold;
  if (style.italic !== undefined) result.italic = style.italic;
  if (style.underline !== undefined) result.underline = style.underline;
  if (style.strikethrough !== undefined)
    result.strikethrough = style.strikethrough;
  if (style.reverse !== undefined) result.inverse = style.reverse;
  if (style.dim !== undefined) result.dim = style.dim;
  if (style.blink !== undefined) result.blink = style.blink;
  if (style.hide !== undefined) result.invisible = style.hide;

  // Border styling
  if (style.border) {
    result.border = buildBorderStyleObject(style.border, descriptor.theme);
  }

  return result;
}

/**
 * Extracts StyleObject properties from component props.
 *
 * @param props - Component props object
 * @returns StyleObject extracted from props
 */
export function extractStyleProps(props: any): StyleObject {
  const styleObj: StyleObject = {};

  // Colors
  if (props.color !== undefined) styleObj.color = props.color;
  if (props.fg !== undefined) styleObj.fg = props.fg;
  if (props.backgroundColor !== undefined)
    styleObj.backgroundColor = props.backgroundColor;
  if (props.bg !== undefined) styleObj.bg = props.bg;
  if (props.background !== undefined) styleObj.background = props.background;

  // Text styles
  if (props.bold !== undefined) styleObj.bold = props.bold;
  if (props.italic !== undefined) styleObj.italic = props.italic;
  if (props.underline !== undefined) styleObj.underline = props.underline;
  if (props.strikethrough !== undefined)
    styleObj.strikethrough = props.strikethrough;
  if (props.reverse !== undefined) styleObj.reverse = props.reverse;
  if (props.dim !== undefined) styleObj.dim = props.dim;
  if (props.blink !== undefined) styleObj.blink = props.blink;
  if (props.hide !== undefined) styleObj.hide = props.hide;

  return styleObj;
}

/**
 * Builds effects object (hover or focus) from StyleObject.
 * Handles theme resolution, color conversion, and automatic focus border color.
 *
 * @param descriptor - Descriptor instance
 * @param effectStyle - Effect state style object
 * @returns Unblessed effects object or null
 */
export function buildEffects(
  descriptor: DescriptorLike,
  effectStyle?: StyleObject,
): any | null {
  const effects: any = {};

  if (effectStyle) {
    // Normalize color shorthands
    const fg = effectStyle.fg ?? effectStyle.color;
    const bg =
      effectStyle.bg ?? effectStyle.background ?? effectStyle.backgroundColor;

    // Convert colors
    if (fg) effects.fg = colors.convert(resolveColor(fg, descriptor.theme));
    if (bg) effects.bg = colors.convert(resolveColor(bg, descriptor.theme));

    // Text styles
    if (effectStyle.bold !== undefined) effects.bold = effectStyle.bold;
    if (effectStyle.italic !== undefined) effects.italic = effectStyle.italic;
    if (effectStyle.underline !== undefined)
      effects.underline = effectStyle.underline;
    if (effectStyle.strikethrough !== undefined)
      effects.strikethrough = effectStyle.strikethrough;
    if (effectStyle.reverse !== undefined)
      effects.inverse = effectStyle.reverse;
    if (effectStyle.dim !== undefined) effects.dim = effectStyle.dim;
    if (effectStyle.blink !== undefined) effects.blink = effectStyle.blink;
    if (effectStyle.hide !== undefined) effects.invisible = effectStyle.hide;

    // Border styling
    if (effectStyle.border) {
      effects.border = buildBorderStyleObject(
        effectStyle.border,
        descriptor.theme,
      );
    }
  }

  return Object.keys(effects).length > 0 ? effects : null;
}

/**
 * Builds hover effects object from StyleObject.
 *
 * @param descriptor - Descriptor instance
 * @param hoverStyle - Hover state style object
 * @returns Unblessed hoverEffects object or null
 */
export function buildHoverEffects(
  descriptor: DescriptorLike,
  hoverStyle?: StyleObject,
): any | null {
  return buildEffects(descriptor, hoverStyle);
}

/**
 * Builds focus effects object from StyleObject.
 * Always applies focusBorderColor from theme as default.
 *
 * @param descriptor - Descriptor instance
 * @param focusStyle - Focus state style object
 * @returns Unblessed focusEffects object or null
 */
export function buildFocusEffects(
  descriptor: DescriptorLike,
  focusStyle?: StyleObject,
): any | null {
  const effects = buildEffects(descriptor, focusStyle);

  // Apply default focus border color from theme
  if (!focusStyle?.border?.fg) {
    const defaults = getComponentDefaults(descriptor);
    const focusBorderColor = defaults.focusBorderColor;

    if (focusBorderColor) {
      return merge(
        {},
        {
          border: {
            fg: colors.convert(
              resolveColor(focusBorderColor, descriptor.theme),
            ),
          },
        },
        effects,
      );
    }
  }
}
