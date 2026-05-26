import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { ollamaLocalPlugin } from "./vite.ollama-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: 5173,
    open: true,
    proxy: {
      "/ollama": {
        target: "http://127.0.0.1:11434",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ollama/, ""),
      },
      "/sdapi": {
        target: "http://127.0.0.1:7860",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    ollamaLocalPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
