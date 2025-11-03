/**
 * Test setup for @unblessed/layout
 */

import { setRuntime } from "@unblessed/core";
import * as child_process from "child_process";
import { EventEmitter } from "events";
import * as fs from "fs";
import * as net from "net";
import omggif from "omggif";
import * as path from "path";
import { PNG } from "pngjs";
import { Readable, Writable } from "stream";
import { StringDecoder } from "string_decoder";
import * as tty from "tty";
import * as url from "url";
import * as util from "util";
import { beforeAll } from "vitest";

const GifReader = omggif.GifReader;

function createMockRuntime() {
  return {
    fs: {
      readFileSync: fs.readFileSync,
      existsSync: fs.existsSync,
      readdirSync: fs.readdirSync,
      statSync: fs.statSync,
      lstatSync: fs.lstatSync,
      realpathSync: fs.realpathSync,
      readlinkSync: fs.readlinkSync,
      mkdirSync: fs.mkdirSync,
      writeFileSync: fs.writeFileSync,
      unlinkSync: fs.unlinkSync,
      accessSync: fs.accessSync,
      createWriteStream: fs.createWriteStream,
      readFile: fs.readFile,
      unlink: fs.unlink,
      writeFile: fs.writeFile,
      stat: fs.stat,
      readdir: fs.readdir,
    },
    path: {
      join: path.join,
      resolve: path.resolve,
      basename: path.basename,
      dirname: path.dirname,
      extname: path.extname,
      normalize: path.normalize,
      sep: path.sep,
      delimiter: path.delimiter,
    },
    process: process,
    buffer: {
      Buffer: Buffer,
    },
    url: {
      fileURLToPath: url.fileURLToPath,
    },
    util: {
      inspect: util.inspect,
      format: util.format,
    },
    stream: {
      Readable: Readable,
      Writable: Writable,
    },
    stringDecoder: {
      StringDecoder: StringDecoder,
    },
    events: {
      EventEmitter: EventEmitter,
    },
    images: {
      png: {
        PNG: PNG,
      },
      gif: {
        GifReader: GifReader,
      },
    },
    processes: {
      childProcess: child_process,
    },
    networking: {
      net: net,
      tty: tty,
    },
  };
}

export function initTestRuntime() {
  const runtime = createMockRuntime();
  setRuntime(runtime);
  return runtime;
}

beforeAll(() => {
  initTestRuntime();
});
