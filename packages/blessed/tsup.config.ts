import { cp } from "fs/promises";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    tput: "bin/tput.ts",
  },

  format: ["cjs", "esm"],
  outDir: "dist",

  bundle: true,
  splitting: false,
  treeshake: false,

  clean: true,
  sourcemap: true,
  dts: {
    entry: "src/index.ts",
  },
  minify: false,
  shims: true,
  cjsInterop: true,

  external: ["pngjs", "omggif"],
  noExternal: ["@unblessed/core"],

  platform: "node",
  target: "node22",

  onSuccess: async () => {
    await cp("../core/data", "dist/data", { recursive: true });
    console.log("✅ Copied ../core/data/ to dist/data/");
    console.log("✅ @unblessed/blessed build complete");
  },
});
