/**
 * reconciler.ts - React reconciler for @unblessed/react
 *
 * This module configures the React reconciler to work with our virtual DOM
 * and @unblessed/layout's LayoutManager.
 *
 * Key differences from Ink:
 * - We use LayoutManager from @unblessed/layout (don't create Yoga nodes directly)
 * - Simpler DOM structure (no text wrapping, measure functions here)
 * - Layout calculation delegated to LayoutManager
 */

import { colors } from "@unblessed/core";
import type { FlexboxProps } from "@unblessed/layout";
import { LayoutManager, updateLayoutNode } from "@unblessed/layout";
import createReconciler from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants.js";
import {
  appendChild,
  createElement,
  createTextNode,
  type DOMNode,
  type ElementType,
  insertBefore,
  removeChild,
  type TextNode,
  updateNodeProps,
} from "./dom.js";
import type { EventHandlers } from "./types.js";

type Props = Record<string, unknown>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type HostContext = {};

let currentLayoutManager: LayoutManager | null = null;

/**
 * Set the layout manager for the current render
 * Called by render.ts
 */
export function setLayoutManager(manager: LayoutManager): void {
  currentLayoutManager = manager;
}

/**
 * Get the current layout manager
 */
function getLayoutManager(): LayoutManager {
  if (!currentLayoutManager) {
    throw new Error(
      "LayoutManager not set - this is a bug in @unblessed/react",
    );
  }
  return currentLayoutManager;
}

/**
 * Converts React props to Flexbox props for LayoutManager
 */
function propsToFlexbox(props: Props): FlexboxProps {
  // Extract flexbox properties from React props
  const flexboxProps: FlexboxProps = {};

  // Copy all flexbox-related props
  const flexKeys: (keyof FlexboxProps)[] = [
    "flexGrow",
    "flexShrink",
    "flexBasis",
    "flexDirection",
    "flexWrap",
    "justifyContent",
    "alignItems",
    "alignSelf",
    "width",
    "height",
    "minWidth",
    "minHeight",
    "maxWidth",
    "maxHeight",
    "padding",
    "paddingX",
    "paddingY",
    "paddingTop",
    "paddingBottom",
    "paddingLeft",
    "paddingRight",
    "border",
    "borderTop",
    "borderBottom",
    "borderLeft",
    "borderRight",
    "margin",
    "marginX",
    "marginY",
    "marginTop",
    "marginBottom",
    "marginLeft",
    "marginRight",
    "gap",
    "rowGap",
    "columnGap",
    "position",
    "display",
  ];

  for (const key of flexKeys) {
    if (key in props) {
      (flexboxProps as any)[key] = props[key];
    }
  }

  return flexboxProps;
}

/**
 * Converts React props to widget options (content, border, style, etc.)
 */
function propsToWidgetOptions(props: Props): any {
  const widgetOptions: any = {};

  // Border handling - build border object comprehensively
  if (
    Number(props.border) > 0 ||
    Number(props.borderTop) > 0 ||
    Number(props.borderBottom) > 0 ||
    Number(props.borderLeft) > 0 ||
    Number(props.borderRight) > 0
  ) {
    const border: any = {
      type: "line",
      style: props.borderStyle || "single",
    };

    // Per-side visibility (from FlexboxProps border/borderTop/etc numbers)
    // If borderTop/Bottom/Left/Right are set in flexbox props, show those sides
    // Default to showing all sides if borderStyle is set
    border.top =
      props.borderTop !== undefined ? Number(props.borderTop) > 0 : true;
    border.bottom =
      props.borderBottom !== undefined ? Number(props.borderBottom) > 0 : true;
    border.left =
      props.borderLeft !== undefined ? Number(props.borderLeft) > 0 : true;
    border.right =
      props.borderRight !== undefined ? Number(props.borderRight) > 0 : true;

    // Border color (global or per-side)
    if (props.borderColor) {
      border.fg = colors.convert(props.borderColor as string);
    }

    // Per-side border colors
    if (props.borderTopColor) {
      border.topColor = colors.convert(props.borderTopColor as string);
    }
    if (props.borderBottomColor) {
      border.bottomColor = colors.convert(props.borderBottomColor as string);
    }
    if (props.borderLeftColor) {
      border.leftColor = colors.convert(props.borderLeftColor as string);
    }
    if (props.borderRightColor) {
      border.rightColor = colors.convert(props.borderRightColor as string);
    }

    // Border dim (global or per-side)
    if (props.borderDimColor !== undefined) {
      border.dim = props.borderDimColor;
    }

    const borderDimMap = [
      ["borderTopDim", "borderTopDim"],
      ["borderBottomDim", "borderBottomDim"],
      ["borderLeftDim", "borderLeftDim"],
      ["borderRightDim", "borderRightDim"],
    ] as const;

    for (const [propKey, borderKey] of borderDimMap) {
      if (props[propKey] !== undefined) {
        border[borderKey] = props[propKey];
      }
    }

    widgetOptions.border = border;
  }

  // Colors - convert to numbers
  // For Box: Only set style.border colors (border uses style.border.fg)
  // For Text: Set style.fg/bg for text color
  if (props.color || props.backgroundColor) {
    widgetOptions.style = widgetOptions.style || {};

    if (props.color) {
      widgetOptions.style.fg = colors.convert(props.color as string);
    }
    if (props.backgroundColor) {
      widgetOptions.style.bg = colors.convert(props.backgroundColor as string);
    }

    // Text attributes
    if (props.bold) widgetOptions.style.bold = true;
    if (props.italic) widgetOptions.style.italic = true;
    if (props.underline) widgetOptions.style.underline = true;
    if (props.strikethrough) widgetOptions.style.strikethrough = true;
    if (props.inverse) widgetOptions.style.inverse = true;
    if (props.dim) widgetOptions.style.dim = true;
  }

  if (props.hoverBg) {
    widgetOptions.hoverBg = props.hoverBg;
  }

  if (props.focusBg) {
    widgetOptions.focusEffects = {
      border: { fg: props.focusBg },
    };
  }

  // Ensure style.border exists and has border colors
  // unblessed reads colors from style.border.fg, not border.fg
  if (widgetOptions.border) {
    widgetOptions.style = widgetOptions.style || {};
    widgetOptions.style.border = widgetOptions.style.border || {};

    // Copy border.fg to style.border.fg (this is where unblessed reads it from)
    if (widgetOptions.border.fg !== undefined) {
      widgetOptions.style.border.fg = widgetOptions.border.fg;
    }
  }

  if (props.tags !== undefined) {
    widgetOptions.tags = props.tags;
  }
  if (props.autoFocus !== undefined) {
    widgetOptions.autoFocus = props.autoFocus;
  }
  if (props.tabIndex !== undefined) {
    widgetOptions.tabIndex = props.tabIndex;
  }

  return widgetOptions;
}

/**
 * Converts React event props (onClick, onFocus, etc.) to unblessed event handlers
 */
function propsToEventHandlers(props: Props): EventHandlers {
  const handlers: EventHandlers = {};

  if (props.onClick) handlers.click = props.onClick as any;
  if (props.onMouseDown) handlers.mousedown = props.onMouseDown as any;
  if (props.onMouseUp) handlers.mouseup = props.onMouseUp as any;
  if (props.onMouseMove) handlers.mousemove = props.onMouseMove as any;
  if (props.onMouseOver) handlers.mouseover = props.onMouseOver as any;
  if (props.onMouseOut) handlers.mouseout = props.onMouseOut as any;
  if (props.onMouseWheel) handlers.mousewheel = props.onMouseWheel as any;
  if (props.onWheelDown) handlers.wheeldown = props.onWheelDown as any;
  if (props.onWheelUp) handlers.wheelup = props.onWheelUp as any;

  if (props.onKeyPress) handlers.keypress = props.onKeyPress as any;

  if (props.onFocus) handlers.focus = props.onFocus as any;
  if (props.onBlur) handlers.blur = props.onBlur as any;

  if (props.onPress) handlers.press = props.onPress as any;
  if (props.onSubmit) handlers.submit = props.onSubmit as any;
  if (props.onCancel) handlers.cancel = props.onCancel as any;
  if (props.onAction) handlers.action = props.onAction as any;

  return handlers;
}

const reconciler = createReconciler<
  ElementType,
  Props,
  DOMNode,
  DOMNode,
  TextNode,
  DOMNode,
  unknown,
  unknown,
  HostContext,
  unknown,
  unknown,
  unknown,
  unknown
>({
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  isPrimaryRenderer: true,

  getRootHostContext() {
    return {};
  },

  getChildHostContext() {
    return {};
  },

  // Node creation
  createInstance(type, props) {
    const manager = getLayoutManager();

    const flexboxProps = propsToFlexbox(props);
    const widgetOptions = propsToWidgetOptions(props);
    const eventHandlers = propsToEventHandlers(props);

    const layoutNode = manager.createNode(type, flexboxProps, widgetOptions);
    layoutNode.eventHandlers = eventHandlers;

    return createElement(type, layoutNode, props);
  },

  createTextInstance(text) {
    const manager = getLayoutManager();

    const layoutNode = manager.createNode(
      "#text",
      { height: 1, width: text.length },
      { content: text, tags: true },
    );

    return createTextNode(text, layoutNode, {});
  },

  // Tree manipulation
  appendInitialChild(parent, child) {
    appendChild(parent, child);

    // Also update layout tree
    const manager = getLayoutManager();
    manager.appendChild(parent.layoutNode, child.layoutNode);
  },

  appendChild(parent, child) {
    appendChild(parent, child);

    // Also update layout tree
    const manager = getLayoutManager();
    manager.appendChild(parent.layoutNode, child.layoutNode);
  },

  insertBefore(parent, child, beforeChild) {
    insertBefore(parent, child, beforeChild);

    // Also update layout tree
    const manager = getLayoutManager();
    manager.insertBefore(
      parent.layoutNode,
      child.layoutNode,
      beforeChild.layoutNode,
    );
  },

  removeChild(parent, child) {
    removeChild(parent, child);

    // Also update layout tree
    const manager = getLayoutManager();
    manager.removeChild(parent.layoutNode, child.layoutNode);
  },

  removeChildFromContainer(container, child) {
    if (container.childNodes.includes(child)) {
      removeChild(container, child);

      const manager = getLayoutManager();
      manager.removeChild(container.layoutNode, child.layoutNode);
    }
  },

  appendChildToContainer(container, child) {
    appendChild(container, child);

    const manager = getLayoutManager();
    manager.appendChild(container.layoutNode, child.layoutNode);
  },

  insertInContainerBefore(container, child, beforeChild) {
    insertBefore(container, child, beforeChild);

    const manager = getLayoutManager();
    manager.insertBefore(
      container.layoutNode,
      child.layoutNode,
      beforeChild.layoutNode,
    );
  },

  // Updates
  prepareUpdate(_instance, _type, _oldProps, _newProps) {
    // Return non-null to indicate update is needed
    // The actual update happens in commitUpdate
    return true;
  },

  commitUpdate(instance, _updatePayload, _type, _oldProps, newProps) {
    updateNodeProps(instance, newProps);

    const flexboxProps = propsToFlexbox(newProps);
    const widgetOptions = propsToWidgetOptions(newProps);
    const eventHandlers = propsToEventHandlers(newProps);

    updateLayoutNode(instance.layoutNode, flexboxProps);
    instance.layoutNode.widgetOptions = widgetOptions;
    instance.layoutNode.eventHandlers = eventHandlers;
  },

  commitTextUpdate(textInstance, _oldText, newText) {
    textInstance.nodeValue = newText;
    textInstance.layoutNode.widgetOptions = { content: newText };

    // Update Yoga width when text length changes
    textInstance.layoutNode.yogaNode.setWidth(newText.length);
    textInstance.layoutNode.props.width = newText.length;
  },

  // Commit hooks
  prepareForCommit: () => null,
  resetAfterCommit(rootNode) {
    if (rootNode.onComputeLayout) {
      rootNode.onComputeLayout();
    }
  },

  preparePortalMount: () => null,
  clearContainer: () => false,

  // Instance management
  getPublicInstance: (instance) => instance,
  finalizeInitialChildren: () => false,
  shouldSetTextContent: () => false,

  // Visibility
  hideInstance(instance) {
    instance.layoutNode.props.display = "none";
    instance.layoutNode.yogaNode.setDisplay(1); // Yoga.DISPLAY_NONE
  },

  unhideInstance(instance) {
    instance.layoutNode.props.display = "flex";
    instance.layoutNode.yogaNode.setDisplay(0); // Yoga.DISPLAY_FLEX
  },

  hideTextInstance(instance) {
    instance.nodeValue = "";
    instance.layoutNode.widgetOptions = { content: "" };
  },

  unhideTextInstance(instance, text) {
    instance.nodeValue = text;
    instance.layoutNode.widgetOptions = { content: text };
  },

  // Reset methods
  resetTextContent: () => {},

  // Scheduling
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  getCurrentEventPriority: () => DefaultEventPriority,

  // Update priority
  // @ts-expect-error
  setCurrentUpdatePriority: () => {},

  // Scope (unused)
  getInstanceFromNode: () => null,
  prepareScopeUpdate: () => {},
  getInstanceFromScope: () => null,

  // Deletion
  detachDeletedInstance: () => {},

  // Active instance (unused)
  beforeActiveInstanceBlur: () => {},
  afterActiveInstanceBlur: () => {},
});

export default reconciler;
