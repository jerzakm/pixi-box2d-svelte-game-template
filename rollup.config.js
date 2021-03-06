/* eslint-env node */
import svelte from "rollup-plugin-svelte";
import nodePolyfills from "rollup-plugin-node-polyfills";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import serve from "rollup-plugin-serve";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/main.ts",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: (css) => {
        css.write("bundle.css");
      },
      preprocess: sveltePreprocess(),
    }),
    nodePolyfills({
      /**
       * box2d-wasm has Node.js support, so Rollup will want to provide polyfills for process and filesystem APIs.
       * We don't need those polyfills, because those API calls are all behind conditions that are false when running on the Web.
       */
      exclude: "node_modules/box2d-wasm/**/*.js",
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      preferBuiltins: false,
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),
    typescript({
      sourceMap: true,
      inlineSources: !production,
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production &&
      serve({
        contentBase: ["public", "node_modules/box2d-wasm/build/es"],
        port: 4000,
      }),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
