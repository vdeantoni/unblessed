import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
  },

  format: ["cjs", "esm"],
  outDir: "dist",

  bundle: true,
  splitting: false,
  treeshake: true,

  clean: true,
  sourcemap: true,
  dts: true,
  minify: false,
  shims: true,
  cjsInterop: true,

  external: ["react"],

  platform: "neutral",
  target: "es2020",

  onSuccess: async () => {
    console.log("✅ @unblessed/react build complete");
  },
});
