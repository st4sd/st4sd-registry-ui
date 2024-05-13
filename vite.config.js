import { defineConfig, splitVendorChunkPlugin } from "vite";
import vue from "@vitejs/plugin-vue";

import path from "path";
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) =>
            tag.includes("bx-") || tag.includes("dds-") || tag.includes("cds-"),
        },
      },
    }),
    splitVendorChunkPlugin(),
  ],
  define: {
    process: {},
    "process.env": {},
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
  preview: {
    host: "localhost",
    port: "8080",
    proxy: {
      "/registry-ui/registry-ui/": {
        target: "http://localhost:8080",
        rewrite: (path) => path.replace(/registry-ui/, ""),
      },
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
