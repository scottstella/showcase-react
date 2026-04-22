import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  server: {
    // Vite default; avoids port 3000 where another dev server may already listen on
    // 127.0.0.1 vs ::1 — the browser can then hit the wrong app when using "localhost".
    port: 5173,
    strictPort: true,
    open: false,
    // Explicit loopback avoids Vite calling os.networkInterfaces() (can throw in
    // sandboxes / some VPN setups). Use `npm run start:lan` to listen on all interfaces.
    host: "localhost",
  },
  build: {
    outDir: "build",
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@components": resolve(__dirname, "./src/components"),
      "@services": resolve(__dirname, "./src/services"),
      "@assets": resolve(__dirname, "./src/assets"),
    },
  },
});
