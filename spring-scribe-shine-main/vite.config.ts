import { defineConfig } from "vite";
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/java-fundamentals-for-spring/',
  plugins: [react()],
  server: {
    host: "::",
    port: 8080,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
