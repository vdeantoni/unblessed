/**
 * Filesystem polyfill for browser
 *
 * Provides virtual filesystem with bundled terminfo and font data
 */

import terU14b from "@unblessed/core/data/fonts/ter-u14b.json";
import terU14n from "@unblessed/core/data/fonts/ter-u14n.json";
import xtermData from "@unblessed/core/data/terminfo/xterm-256color.json";
import { Buffer } from "buffer";
import type { PathLike } from "fs";

export function createFilesystem() {
  return {
    readFileSync: ((filePath: PathLike, encoding?: any): Buffer | string => {
      const pathStr = filePath.toString();

      // Handle terminfo files
      if (pathStr.includes("xterm")) {
        const base64Data = (xtermData as any).data;
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const buffer = Buffer.from(bytes);
        return encoding ? buffer.toString(encoding) : buffer;
      }

      // Handle font files
      if (pathStr.includes("ter-u14n")) {
        const str = JSON.stringify(terU14n);
        return encoding ? str : Buffer.from(str, "utf8");
      }
      if (pathStr.includes("ter-u14b")) {
        const str = JSON.stringify(terU14b);
        return encoding ? str : Buffer.from(str, "utf8");
      }

      console.error(`[BrowserRuntime] File not found: ${pathStr}`);
      throw new Error(
        `fs.readFileSync not supported in browser (path: ${pathStr})`,
      );
    }) as any,

    readdirSync: ((dirPath: PathLike): string[] => {
      const pathStr = dirPath.toString();
      if (pathStr.includes("terminfo")) {
        return ["xterm", "xterm-256color", "xterm-color"];
      }
      throw new Error(
        `fs.readdirSync not supported in browser (path: ${pathStr})`,
      );
    }) as any,

    existsSync: ((filePath: PathLike): boolean => {
      const pathStr = filePath.toString();
      if (pathStr.includes("xterm") || pathStr.includes("terminfo")) {
        return true;
      }
      if (
        pathStr.endsWith(".json") &&
        (pathStr.includes("ter-u14n") || pathStr.includes("ter-u14b"))
      ) {
        return true;
      }
      return false;
    }) as any,

    statSync: ((filePath: PathLike, fs: any): any => {
      const pathStr = filePath.toString();
      if (fs.existsSync(pathStr)) {
        return {
          isFile: () => true,
          isDirectory: () => false,
          isSymbolicLink: () => false,
        };
      }
      throw new Error(`ENOENT: no such file or directory, stat '${pathStr}'`);
    }) as any,

    lstatSync: ((filePath: PathLike, fs: any): any => {
      return fs.statSync(filePath, fs);
    }) as any,

    readlinkSync: ((_filePath: PathLike): string => {
      throw new Error(`fs.readlinkSync not supported in browser`);
    }) as any,

    mkdirSync: (() => {
      throw new Error("fs.mkdirSync not supported in browser");
    }) as any,

    createWriteStream: (() => {
      throw new Error("fs.createWriteStream not supported in browser");
    }) as any,

    readFile: ((...args: any[]) => {
      const callback = args[args.length - 1];
      if (typeof callback === "function") {
        callback(new Error("fs.readFile not supported in browser"));
      }
    }) as any,

    readdir: ((...args: any[]) => {
      const callback = args[args.length - 1];
      if (typeof callback === "function") {
        callback(new Error("fs.readdir not supported in browser"));
      }
    }) as any,

    unlink: ((...args: any[]) => {
      const callback = args[args.length - 1];
      if (typeof callback === "function") {
        callback(new Error("fs.unlink not supported in browser"));
      }
    }) as any,

    writeFile: ((...args: any[]) => {
      const callback = args[args.length - 1];
      if (typeof callback === "function") {
        callback(new Error("fs.writeFile not supported in browser"));
      }
    }) as any,

    stat: ((...args: any[]) => {
      const callback = args[args.length - 1];
      if (typeof callback === "function") {
        callback(new Error("fs.stat not supported in browser"));
      }
    }) as any,
  };
}
