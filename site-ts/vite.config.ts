import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [
      wasm(), 
      topLevelAwait(),
      solidPlugin()
  ],
  worker: {
      plugins: [
          wasm(), 
          topLevelAwait()
      ],
      format: "es"
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'es2015',
  },
});
