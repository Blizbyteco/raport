import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@features/*": ["./src/features/*"],
      "@shared/*": ["./src/shared/*"],
    },
  },
  plugins: [react(), tailwindcss()],
});
