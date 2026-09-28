import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { fileURLToPath, URL } from "node:url";

// Single self-contained HTML: every asset (JS, CSS, fonts) is inlined so the
// booth machine can open dist/index.html straight from disk, offline.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  build: { assetsInlineLimit: 100_000_000, cssCodeSplit: false },
});
