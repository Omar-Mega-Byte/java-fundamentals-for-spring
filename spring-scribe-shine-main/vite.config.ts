import { defineConfig } from "vite";
// import path from "path"; // Removed because 'path' is not available in browser environments
// import { fileURLToPath } from 'url';
// import { dirname, resolve } from 'path';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
export default defineConfig(({ mode }: { mode: string }) => ({
  base: "/java-fundamentals-for-spring/",
  server: {
    host: "::",
    port: 8080,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
}));
