/**
 * @unblessed/node - Node.js runtime adapter for @unblessed/core
 *
 * This package provides Node.js-specific implementations and makes it easy
 * to use @unblessed/core in Node.js environments.
 *
 * ## Usage
 *
 * Simply import widgets and use them - runtime auto-initializes:
 *
 * ```typescript
 * import { Screen, Box } from '@unblessed/node';
 *
 * const screen = new Screen({ smartCSR: true });
 * const box = new Box({ screen, content: 'Hello!' });
 * screen.render();
 * ```
 */

import type { Runtime } from "@unblessed/core";
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

// Re-export all from @unblessed/core
export * from "@unblessed/core";
