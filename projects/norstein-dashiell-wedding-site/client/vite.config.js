import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/wedding/",
  plugins: [react()],

  server: {
    proxy: {
      "/wedding/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});