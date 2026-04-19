/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/** Satisfy `src/supabase/Client.tsx` validation when tests import modules that load the client. */
const supabaseTestEnv = {
  VITE_SUPABASE_URL: "https://vitest-placeholder.supabase.co",
  VITE_SUPABASE_ANON_KEY: "x".repeat(50),
} as const;

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    env: { ...supabaseTestEnv },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "node_modules/",
        "src/setupTests.ts",
        "src/index.tsx",
        "tests/",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
      ],
    },
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["tests/**/*", "node_modules/**/*"],
  },
});
