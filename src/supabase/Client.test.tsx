import { describe, it, expect, vi } from "vitest";
import { supabase } from "./Client";
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
  it("creates a client with correct configuration", () => {
    expect(createClient).toHaveBeenCalledWith(
      "https://hasmzeqltdnshibkgbuj.supabase.co",
      expect.any(String), // We don't want to expose the actual key in test output
    );
  });

  it("exports a supabase client instance", () => {
    expect(supabase).toBeDefined();
    expect(supabase.from).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });

  it("creates only one instance", () => {
    expect(createClient).toHaveBeenCalledTimes(1);
  });
});
