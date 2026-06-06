import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // allow importing shared source from packages/* in the monorepo
    fs: { allow: ["../.."] },
  },
  build: {
    // Multi-page build → real static URLs: "/" and "/about" (both 200 on GitHub Pages).
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        about: fileURLToPath(new URL("./about/index.html", import.meta.url)),
      },
    },
  },
});
