import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // The C# API only allows this origin in its CORS policy, so never fall back to another port.
    port: 5173,
    strictPort: true,
  },
});
