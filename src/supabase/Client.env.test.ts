import { describe, it, expect, afterEach, vi } from "vitest";

const validKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNzQ5NjAwMCwiZXhwIjoxOTUzMDcyMDAwfQ.test";

describe("Client environment validation", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("throws when URL is missing", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "x".repeat(50));

    await expect(import("./Client")).rejects.toThrow("Missing Supabase environment variables");
  });

  it("throws when anon key is missing", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");

    await expect(import("./Client")).rejects.toThrow("Missing Supabase environment variables");
  });

  it("throws on invalid URL format", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "not-a-url");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "x".repeat(50));

    await expect(import("./Client")).rejects.toThrow("Invalid Supabase URL format");
  });

  it("throws when URL is not supabase.co", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://example.com");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "x".repeat(50));

    await expect(import("./Client")).rejects.toThrow(
      "Invalid Supabase URL - must be a supabase.co domain"
    );
  });

  it("throws when anon key is too short", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "short");

    await expect(import("./Client")).rejects.toThrow("Invalid Supabase anon key format");
  });

  it("loads when env is valid", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", validKey);

    await expect(import("./Client")).resolves.toMatchObject({
      supabase: expect.any(Object),
    });
  });
});
