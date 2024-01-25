import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import path from "path";
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes("bx-") || tag.includes("dds-"),
        },
      },
    }),
  ],
  define: {
    "process.env": {},
    "process": {},
  },
  transpileDependencies: true,
  base: process.env.NODE_ENV === "production" ? "/registry-ui/" : "/",
  server: {
    proxy: {
      "^/registry-ui/backend/": {
        target: "http://0.0.0.0:8085",
        changeOrigin: true,
        rewrite: (path) => path.replace(/registry-ui\/backend/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
