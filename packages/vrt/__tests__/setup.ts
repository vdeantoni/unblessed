/**
 * Vitest setup file for @unblessed/vrt tests
 * Manually initializes Node.js runtime (avoids circular dependency with @unblessed/node)
 */

import type { Runtime } from "@unblessed/core";
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
import { beforeAll } from "vitest";

// Initialize Node.js runtime manually before all tests
beforeAll(() => {
  const nodeRuntime: Runtime = {
    fs: fs,
    path: path,
    process: process,
    buffer: { Buffer },
    url: url,
    util: util,
    stream: { Readable, Writable },
    stringDecoder: { StringDecoder },
    events: { EventEmitter },

    images: {
      png: { PNG },
      gif: { GifReader },
    } as Runtime["images"],

    processes: {
      childProcess: child_process,
    } as Runtime["processes"],

    networking: {
      net: net,
      tty: tty,
    } as Runtime["networking"],
  };

  setRuntime(nodeRuntime);
});
