import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createClient } from "@supabase/supabase-js";

// Mock the createClient function
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    // Mock minimal Supabase client interface
    from: vi.fn(),
    auth: vi.fn(),
  })),
}));

describe("Supabase Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear module cache
    vi.resetModules();
    // Mock environment variables before importing the module
    vi.stubEnv("VITE_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv(
      "VITE_SUPABASE_ANON_KEY",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNzQ5NjAwMCwiZXhwIjoxOTUzMDcyMDAwfQ.test"
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("creates a client with correct configuration", async () => {
    // Import after mocking environment variables
    const { supabase } = await import("./Client");

    expect(createClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNzQ5NjAwMCwiZXhwIjoxOTUzMDcyMDAwfQ.test"
    );
  });

  it("exports a supabase client instance", async () => {
    const { supabase } = await import("./Client");

    expect(supabase).toBeDefined();
    expect(supabase.from).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });

  it("creates only one instance", async () => {
    await import("./Client");

    expect(createClient).toHaveBeenCalledTimes(1);
  });

  it("validates environment variables correctly", async () => {
    // Test with valid environment variables
    await expect(import("./Client")).resolves.toBeDefined();
  });
});
