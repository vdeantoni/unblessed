/**
 * @unblessed/blessed - 100% backward compatible blessed API
 *
 * This package wraps @unblessed/core to provide the exact same API as the original
 * blessed library. It's a drop-in replacement for users migrating from blessed.
 */

import type { Runtime } from "@unblessed/core";
import * as TuiTypes from "@unblessed/core";
import { setRuntime } from "@unblessed/core";
import { Buffer } from "buffer";
import * as child_process from "child_process";
import { EventEmitter } from "events";
import fs from "fs";
import net from "net";
import { GifReader } from "omggif";
import path from "path";
import { PNG } from "pngjs";
import process from "process";
import { Readable, Writable } from "stream";
import { StringDecoder } from "string_decoder";
import tty from "tty";
import * as url from "url";
import * as util from "util";

/**
 * Node.js runtime implementation (internal)
 * @internal
 */
export class NodeRuntime implements Runtime {
  fs = fs;
  path = path;
  process = process;
  buffer = { Buffer };
  url = url;
  util = util;
  stream = { Readable, Writable };
  stringDecoder = { StringDecoder };
  events = { EventEmitter };

  images = {
    png: { PNG },
    gif: { GifReader },
  };

  processes = {
    childProcess: child_process,
  };

  networking = {
    net: net,
    tty: tty,
  };
}

setRuntime(new NodeRuntime());

export * from "@unblessed/core";

/**
 * WidgetFactory type - matches old blessed pattern
 * Factory function + class constructor + prototype
 */
export type WidgetFactory<T> = {
  (options?: any): T;
  class: new (options?: any) => T;
  prototype: T;
};

/**
 * Helper to create a WidgetFactory from a class
 */
function createWidgetFactory<T>(
  WidgetClass: new (options?: any) => T,
): WidgetFactory<T> {
  const factory = (options?: any) => new WidgetClass(options);
  (factory as any).class = WidgetClass;
  (factory as any).prototype = WidgetClass.prototype;
  return factory as WidgetFactory<T>;
}

/**
 * BlessedFunction interface - matches old blessed structure
 */
export interface BlessedFunction {
  // Callable - creates Program
  (...args: any[]): TuiTypes.Program;

  // Methods
  program(...args: any[]): TuiTypes.Program;
  tput(...args: any[]): TuiTypes.Tput;

  // Classes
  Program: typeof TuiTypes.Program;
  Tput: typeof TuiTypes.Tput;

  // Utilities
  colors: typeof TuiTypes.colors;
  unicode: typeof TuiTypes.unicode;
  helpers: typeof TuiTypes & {
    sprintf: typeof TuiTypes.sprintf;
    tryRead: typeof TuiTypes.tryRead;
  };

  // Widget factories (PascalCase)
  Node: WidgetFactory<TuiTypes.Node>;
  Screen: WidgetFactory<TuiTypes.Screen>;
  Element: WidgetFactory<TuiTypes.Element>;
  Box: WidgetFactory<TuiTypes.Box>;
  Text: WidgetFactory<TuiTypes.Text>;
  Line: WidgetFactory<TuiTypes.Line>;
  ScrollableBox: WidgetFactory<TuiTypes.ScrollableBox>;
  ScrollableText: WidgetFactory<TuiTypes.ScrollableText>;
  BigText: WidgetFactory<TuiTypes.BigText>;
  List: WidgetFactory<TuiTypes.List>;
  Form: WidgetFactory<TuiTypes.Form>;
  Input: WidgetFactory<TuiTypes.Input>;
  Textarea: WidgetFactory<TuiTypes.Textarea>;
  Textbox: WidgetFactory<TuiTypes.Textbox>;
  Button: WidgetFactory<TuiTypes.Button>;
  ProgressBar: WidgetFactory<TuiTypes.ProgressBar>;
  FileManager: WidgetFactory<TuiTypes.FileManager>;
  Checkbox: WidgetFactory<TuiTypes.Checkbox>;
  RadioSet: WidgetFactory<TuiTypes.RadioSet>;
  RadioButton: WidgetFactory<TuiTypes.RadioButton>;
  Prompt: WidgetFactory<TuiTypes.Prompt>;
  Question: WidgetFactory<TuiTypes.Question>;
  Message: WidgetFactory<TuiTypes.Message>;
  Loading: WidgetFactory<TuiTypes.Loading>;
  Listbar: WidgetFactory<TuiTypes.Listbar>;
  Log: WidgetFactory<TuiTypes.Log>;
  Table: WidgetFactory<TuiTypes.Table>;
  ListTable: WidgetFactory<TuiTypes.ListTable>;
  Image: WidgetFactory<TuiTypes.Image>;
  ANSIImage: WidgetFactory<TuiTypes.ANSIImage>;
  OverlayImage: WidgetFactory<TuiTypes.OverlayImage>;
  Layout: WidgetFactory<TuiTypes.Layout>;

  // Widget factories (lowercase)
  node: WidgetFactory<TuiTypes.Node>;
  screen: WidgetFactory<TuiTypes.Screen>;
  element: WidgetFactory<TuiTypes.Element>;
  box: WidgetFactory<TuiTypes.Box>;
  text: WidgetFactory<TuiTypes.Text>;
  line: WidgetFactory<TuiTypes.Line>;
  scrollablebox: WidgetFactory<TuiTypes.ScrollableBox>;
  scrollabletext: WidgetFactory<TuiTypes.ScrollableText>;
  bigtext: WidgetFactory<TuiTypes.BigText>;
  list: WidgetFactory<TuiTypes.List>;
  form: WidgetFactory<TuiTypes.Form>;
  input: WidgetFactory<TuiTypes.Input>;
  textarea: WidgetFactory<TuiTypes.Textarea>;
  textbox: WidgetFactory<TuiTypes.Textbox>;
  button: WidgetFactory<TuiTypes.Button>;
  progressbar: WidgetFactory<TuiTypes.ProgressBar>;
  filemanager: WidgetFactory<TuiTypes.FileManager>;
  checkbox: WidgetFactory<TuiTypes.Checkbox>;
  radioset: WidgetFactory<TuiTypes.RadioSet>;
  radiobutton: WidgetFactory<TuiTypes.RadioButton>;
  prompt: WidgetFactory<TuiTypes.Prompt>;
  question: WidgetFactory<TuiTypes.Question>;
  message: WidgetFactory<TuiTypes.Message>;
  loading: WidgetFactory<TuiTypes.Loading>;
  listbar: WidgetFactory<TuiTypes.Listbar>;
  log: WidgetFactory<TuiTypes.Log>;
  table: WidgetFactory<TuiTypes.Table>;
  listtable: WidgetFactory<TuiTypes.ListTable>;
  image: WidgetFactory<TuiTypes.Image>;
  ansiimage: WidgetFactory<TuiTypes.ANSIImage>;
  overlayimage: WidgetFactory<TuiTypes.OverlayImage>;
  layout: WidgetFactory<TuiTypes.Layout>;
}

/**
 * Widgets namespace - contains all widget types and options
 * Provides compatibility with @types/blessed
 */
export namespace Widgets {
  // Type aliases for backward compatibility
  export namespace Types {
    export type TTopLeft = TuiTypes.PositionValue;
    export type TPosition = TuiTypes.PositionValue;
    export type TAlign = TuiTypes.Alignment;
    export type TMouseAction = TuiTypes.MouseAction;
    export type TBorder = TuiTypes.Border;
    export type TStyleBorder = TuiTypes.StyleBorder;
    export type TCursor = TuiTypes.Cursor;
    export type Effects = TuiTypes.Effects;
    export type TStyle = TuiTypes.Style;
    export type TImage = TuiTypes.ImageData;
  }

  export namespace Events {
    export type IMouseEventArg = TuiTypes.MouseEvent;
    export type IKeyEventArg = TuiTypes.KeyEvent;
  }

  // Widget class types
  export type Node = TuiTypes.Node;
  export type Screen = TuiTypes.Screen;
  export type BlessedElement = TuiTypes.Element;
  export type Element = TuiTypes.Element;
  export type BoxElement = TuiTypes.Box;
  export type Box = TuiTypes.Box;
  export type TextElement = TuiTypes.Text;
  export type Text = TuiTypes.Text;
  export type LineElement = TuiTypes.Line;
  export type Line = TuiTypes.Line;
  export type ScrollableBoxElement = TuiTypes.ScrollableBox;
  export type ScrollableBox = TuiTypes.ScrollableBox;
  export type ScrollableTextElement = TuiTypes.ScrollableText;
  export type ScrollableText = TuiTypes.ScrollableText;
  export type BigTextElement = TuiTypes.BigText;
  export type BigText = TuiTypes.BigText;
  export type ListElement = TuiTypes.List;
  export type List = TuiTypes.List;
  export type FormElement = TuiTypes.Form;
  export type Form = TuiTypes.Form;
  export type InputElement = TuiTypes.Input;
  export type Input = TuiTypes.Input;
  export type TextareaElement = TuiTypes.Textarea;
  export type Textarea = TuiTypes.Textarea;
  export type TextboxElement = TuiTypes.Textbox;
  export type Textbox = TuiTypes.Textbox;
  export type ButtonElement = TuiTypes.Button;
  export type Button = TuiTypes.Button;
  export type ProgressBarElement = TuiTypes.ProgressBar;
  export type ProgressBar = TuiTypes.ProgressBar;
  export type FileManagerElement = TuiTypes.FileManager;
  export type FileManager = TuiTypes.FileManager;
  export type CheckboxElement = TuiTypes.Checkbox;
  export type Checkbox = TuiTypes.Checkbox;
  export type RadioSetElement = TuiTypes.RadioSet;
  export type RadioSet = TuiTypes.RadioSet;
  export type RadioButtonElement = TuiTypes.RadioButton;
  export type RadioButton = TuiTypes.RadioButton;
  export type PromptElement = TuiTypes.Prompt;
  export type Prompt = TuiTypes.Prompt;
  export type QuestionElement = TuiTypes.Question;
  export type Question = TuiTypes.Question;
  export type MessageElement = TuiTypes.Message;
  export type Message = TuiTypes.Message;
  export type LoadingElement = TuiTypes.Loading;
  export type Loading = TuiTypes.Loading;
  export type ListbarElement = TuiTypes.Listbar;
  export type Listbar = TuiTypes.Listbar;
  export type Log = TuiTypes.Log;
  export type TableElement = TuiTypes.Table;
  export type Table = TuiTypes.Table;
  export type ListTableElement = TuiTypes.ListTable;
  export type ListTable = TuiTypes.ListTable;
  export type ImageElement = TuiTypes.Image;
  export type Image = TuiTypes.Image;
  export type ANSIImageElement = TuiTypes.ANSIImage;
  export type ANSIImage = TuiTypes.ANSIImage;
  export type OverlayImageElement = TuiTypes.OverlayImage;
  export type OverlayImage = TuiTypes.OverlayImage;
  export type LayoutElement = TuiTypes.Layout;
  export type Layout = TuiTypes.Layout;
  export type Program = TuiTypes.Program;

  // Options types
  export type INodeOptions = TuiTypes.NodeOptions;
  export type IScreenOptions = TuiTypes.ScreenOptions;
  export type ElementOptions = TuiTypes.ElementOptions;
  export type ScrollableOptions = TuiTypes.ScrollableOptions;
  export type ScrollableBoxOptions = TuiTypes.ScrollableBoxOptions;
  export type ScrollableTextOptions = TuiTypes.ScrollableTextOptions;
  export type BoxOptions = TuiTypes.BoxOptions;
  export type TextOptions = TuiTypes.TextOptions;
  export type LineOptions = TuiTypes.LineOptions;
  export type BigTextOptions = TuiTypes.BigTextOptions;
  export type ListOptions<
    TStyle extends TuiTypes.ListElementStyle = TuiTypes.ListElementStyle,
  > = TuiTypes.ListOptions<TStyle>;
  export type FormOptions = TuiTypes.FormOptions;
  export type InputOptions = TuiTypes.InputOptions;
  export type TextareaOptions = TuiTypes.TextareaOptions;
  export type TextboxOptions = TuiTypes.TextboxOptions;
  export type ButtonOptions = TuiTypes.ButtonOptions;
  export type ProgressBarOptions = TuiTypes.ProgressBarOptions;
  export type FileManagerOptions = TuiTypes.FileManagerOptions;
  export type CheckboxOptions = TuiTypes.CheckboxOptions;
  export type RadioSetOptions = TuiTypes.RadioSetOptions;
  export type RadioButtonOptions = TuiTypes.RadioButtonOptions;
  export type PromptOptions = TuiTypes.PromptOptions;
  export type QuestionOptions = TuiTypes.QuestionOptions;
  export type MessageOptions = TuiTypes.MessageOptions;
  export type LoadingOptions = TuiTypes.LoadingOptions;
  export type ListbarOptions = TuiTypes.ListbarOptions;
  export type LogOptions = TuiTypes.LogOptions;
  export type TableOptions = TuiTypes.TableOptions;
  export type ListTableOptions = TuiTypes.ListTableOptions;
  export type ImageOptions = TuiTypes.ImageOptions;
  export type ANSIImageOptions = TuiTypes.ANSIImageOptions;
  export type OverlayImageOptions = TuiTypes.OverlayImageOptions;
  export type LayoutOptions = TuiTypes.LayoutOptions;

  // Style types
  export type Style = TuiTypes.Style;
  export type StyleBorder = TuiTypes.StyleBorder;
  export type Effects = TuiTypes.Effects;
  export type ListElementStyle = TuiTypes.ListElementStyle;
  export type StyleListTable = TuiTypes.StyleListTable;
  export type ProgressBarStyle = TuiTypes.ProgressBarStyle;
  export type Border = TuiTypes.Border;
  export type Padding = TuiTypes.Padding;
  export type Position = TuiTypes.Position;
  export type PositionCoords = TuiTypes.PositionCoords;
  export type Coords = TuiTypes.Coords;
  export type RenderCoords = TuiTypes.RenderCoords;
  export type Cursor = TuiTypes.Cursor;
  export type LabelOptions = TuiTypes.LabelOptions;
}

// Widget class to factory mapping
const WIDGET_CLASSES = {
  Node: TuiTypes.Node,
  Screen: TuiTypes.Screen,
  Element: TuiTypes.Element,
  Box: TuiTypes.Box,
  Text: TuiTypes.Text,
  Line: TuiTypes.Line,
  ScrollableBox: TuiTypes.ScrollableBox,
  ScrollableText: TuiTypes.ScrollableText,
  BigText: TuiTypes.BigText,
  List: TuiTypes.List,
  Form: TuiTypes.Form,
  Input: TuiTypes.Input,
  Textarea: TuiTypes.Textarea,
  Textbox: TuiTypes.Textbox,
  Button: TuiTypes.Button,
  ProgressBar: TuiTypes.ProgressBar,
  FileManager: TuiTypes.FileManager,
  Checkbox: TuiTypes.Checkbox,
  RadioSet: TuiTypes.RadioSet,
  RadioButton: TuiTypes.RadioButton,
  Prompt: TuiTypes.Prompt,
  Question: TuiTypes.Question,
  Message: TuiTypes.Message,
  Loading: TuiTypes.Loading,
  Listbar: TuiTypes.Listbar,
  Log: TuiTypes.Log,
  Table: TuiTypes.Table,
  ListTable: TuiTypes.ListTable,
  Image: TuiTypes.Image,
  ANSIImage: TuiTypes.ANSIImage,
  OverlayImage: TuiTypes.OverlayImage,
  Layout: TuiTypes.Layout,
} as const;

// Create all widget factories
const factories = Object.fromEntries(
  Object.entries(WIDGET_CLASSES).map(([name, WidgetClass]) => [
    name,
    createWidgetFactory(WidgetClass),
  ]),
) as Record<keyof typeof WIDGET_CLASSES, WidgetFactory<any>>;

// Create lowercase variant names (PascalCase → lowercase)
const lowercaseFactories = Object.fromEntries(
  Object.entries(factories).map(([name, factory]) => [
    name.toLowerCase(), // Convert entire name to lowercase
    factory,
  ]),
);

/**
 * Create the blessed function (callable + properties)
 */
function createBlessedFunction(): BlessedFunction {
  // Main callable function - creates Program
  const blessedFn = function (...args: any[]): TuiTypes.Program {
    return new TuiTypes.Program(...args);
  };

  // Add all properties
  Object.assign(blessedFn, {
    // Methods
    program: (...args: any[]) => new TuiTypes.Program(...args),
    tput: (...args: any[]) => new TuiTypes.Tput(...args),

    // Classes
    Program: TuiTypes.Program,
    Tput: TuiTypes.Tput,

    // Utilities
    colors: TuiTypes.colors,
    unicode: TuiTypes.unicode,
    helpers: Object.assign({}, TuiTypes, {
      sprintf: TuiTypes.sprintf,
      tryRead: TuiTypes.tryRead,
    }),

    // Widget factories (PascalCase)
    ...factories,

    // Widget factories (lowercase)
    ...lowercaseFactories,
  });

  return blessedFn as BlessedFunction;
}

// Create and export the blessed function
const blessed = createBlessedFunction();

// Default export (CommonJS: const blessed = require('@unblessed/blessed'))
export default blessed;

// Named exports matching old blessed
export const program = blessed.program;
export const tput = blessed.tput;

// Widget factories - dynamically export both PascalCase and lowercase
export const {
  Node,
  Screen,
  Element,
  Box,
  Text,
  Line,
  ScrollableBox,
  ScrollableText,
  BigText,
  List,
  Form,
  Input,
  Textarea,
  Textbox,
  Button,
  ProgressBar,
  FileManager,
  Checkbox,
  RadioSet,
  RadioButton,
  Prompt,
  Question,
  Message,
  Loading,
  Listbar,
  Log,
  Table,
  ListTable,
  Image,
  ANSIImage,
  OverlayImage,
  Layout,
  node,
  screen,
  element,
  box,
  text,
  line,
  scrollablebox,
  scrollabletext,
  bigtext,
  list,
  form,
  input,
  textarea,
  textbox,
  button,
  progressbar,
  filemanager,
  checkbox,
  radioset,
  radiobutton,
  prompt,
  question,
  message,
  loading,
  listbar,
  log,
  table,
  listtable,
  image,
  ansiimage,
  overlayimage,
  layout,
} = blessed;

// Helper functions
export const { escape, stripTags, cleanTags, generateTags } = TuiTypes;
export const colors = blessed.colors;
export const unicode = blessed.unicode;
export const helpers = blessed.helpers;

// Legacy type aliases for backward compatibility
export type TTopLeft = TuiTypes.PositionValue;
export type TPosition = TuiTypes.PositionValue;
export type TAlign = TuiTypes.Alignment;
export type TMouseAction = TuiTypes.MouseAction;
export type TImage = TuiTypes.ImageData;
