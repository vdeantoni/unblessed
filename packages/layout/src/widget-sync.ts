/**
 * widget-sync.ts - Synchronize Yoga layout to unblessed widgets
 */

import {
  BigText,
  Box,
  Button,
  Element,
  Screen,
  Text,
  Textbox,
} from "@unblessed/core";
import Yoga from "yoga-layout";
import type { ComputedLayout, LayoutNode } from "./types.js";

/**
 * Binds event handlers to a widget.
 */
function bindEventHandlers(
  widget: Element,
  handlers: Record<string, Function>,
): void {
  for (const [event, handler] of Object.entries(handlers)) {
    widget.on(event, handler as any);
  }
}

/**
 * Unbinds event handlers from a widget.
 */
function unbindEventHandlers(
  widget: Element,
  handlers: Record<string, Function>,
): void {
  for (const [event, handler] of Object.entries(handlers)) {
    widget.removeListener(event, handler as any);
  }
}

/**
 * Extracts computed layout from a Yoga node.
 */
export function getComputedLayout(node: LayoutNode): ComputedLayout {
  return {
    top: Math.round(node.yogaNode.getComputedTop()),
    left: Math.round(node.yogaNode.getComputedLeft()),
    width: Math.round(node.yogaNode.getComputedWidth()),
    height: Math.round(node.yogaNode.getComputedHeight()),
  };
}

/**
 * Synchronizes a layout node tree to unblessed widgets.
 * Yoga positions are applied to widgets. Widgets are created/updated as needed.
 */
export function syncWidgetWithYoga(node: LayoutNode, screen: Screen): Element {
  // Extract Yoga's computed layout
  const layout = getComputedLayout(node);

  let top = layout.top;
  let left = layout.left;

  if (node.parent) {
    const parentBorderTop = node.parent.yogaNode.getComputedBorder(
      Yoga.EDGE_TOP,
    );
    const parentBorderLeft = node.parent.yogaNode.getComputedBorder(
      Yoga.EDGE_LEFT,
    );

    // Adjust for border collapse difference between Yoga and unblessed
    top = layout.top - parentBorderTop;
    left = layout.left - parentBorderLeft;
  }

  // Text nodes return hidden elements; content is set on parent after syncing children
  if (node.type === "#text") {
    if (node.widget) {
      return node.widget;
    }
    node.widget = new Element({ screen, hidden: true });
    return node.widget;
  }

  if (!node.widget) {
    // First render - create new widget
    let WidgetClass = Box;
    switch (node.type) {
      case "text": {
        WidgetClass = Text;
        break;
      }
      case "bigtext": {
        WidgetClass = BigText;
        break;
      }
      case "button":
      case "tbutton": {
        WidgetClass = Button;
        break;
      }
      case "input":
      case "textinput": {
        WidgetClass = Textbox;
        break;
      }
    }

    node.widget = new WidgetClass({
      screen,
      tags: true,
      mouse: true,
      keys: true,
      inputOnFocus: true,
      top,
      left,
      width: layout.width,
      height: layout.height,
      ...node.widgetOptions,
    });

    if (node.eventHandlers && Object.keys(node.eventHandlers).length > 0) {
      bindEventHandlers(node.widget, node.eventHandlers);
      node._boundHandlers = node.eventHandlers;
    }
  } else {
    node.widget.position.top = top;
    node.widget.position.left = left;
    node.widget.position.width = layout.width;
    node.widget.position.height = layout.height;

    if (node.widgetOptions) {
      Object.assign(node.widget, node.widgetOptions);
    }

    if (node.eventHandlers) {
      if (node._boundHandlers) {
        unbindEventHandlers(node.widget, node._boundHandlers);
      }

      if (Object.keys(node.eventHandlers).length > 0) {
        bindEventHandlers(node.widget, node.eventHandlers);
        node._boundHandlers = node.eventHandlers;
      } else {
        node._boundHandlers = undefined;
      }
    }
  }

  for (const child of node.children) {
    const childWidget = syncWidgetWithYoga(child, screen);

    if (childWidget.parent !== node.widget) {
      node.widget.append(childWidget);
    }
  }

  // Concatenate all #text children and set as widget content
  if (node.children.length > 0) {
    const allTextNodes = node.children.every((c) => c.type === "#text");

    if (allTextNodes) {
      const fullContent = node.children
        .map((c) => c.widgetOptions?.content || "")
        .join("");

      if (fullContent) {
        node.widget.setContent(fullContent);
      }
    }
  }

  return node.widget;
}

/**
 * Synchronizes layout tree to widgets and renders to screen.
 */
export function syncTreeAndRender(rootNode: LayoutNode, screen: Screen): void {
  const rootWidget = syncWidgetWithYoga(rootNode, screen);

  if (!rootWidget.parent) {
    screen.append(rootWidget);
  }

  screen.render();
}

/**
 * Destroys all widgets in a layout tree and unbinds event handlers.
 */
export function destroyWidgets(node: LayoutNode): void {
  for (const child of node.children) {
    destroyWidgets(child);
  }

  if (node.widget) {
    if (node._boundHandlers) {
      unbindEventHandlers(node.widget, node._boundHandlers);
      node._boundHandlers = undefined;
    }

    node.widget.detach();
    node.widget.destroy();
    node.widget = undefined;
  }
}
