import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createClient } from "@supabase/supabase-js";

const clientMocks = vi.hoisted(() => ({
  signInWithOAuth: vi.fn().mockResolvedValue({ data: {}, error: null }),
  signOut: vi.fn().mockResolvedValue({ error: null }),
  getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(),
    auth: {
      signInWithOAuth: clientMocks.signInWithOAuth,
      signOut: clientMocks.signOut,
      getUser: clientMocks.getUser,
    },
  })),
}));

describe("Supabase Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.stubEnv("VITE_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv(
      "VITE_SUPABASE_ANON_KEY",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNzQ5NjAwMCwiZXhwIjoxOTUzMDcyMDAwfQ.test"
    );
    clientMocks.signInWithOAuth.mockResolvedValue({ data: {}, error: null });
    clientMocks.signOut.mockResolvedValue({ error: null });
    clientMocks.getUser.mockResolvedValue({ data: { user: null } });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("creates a client with correct configuration", async () => {
    await import("./Client");

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
    await expect(import("./Client")).resolves.toBeDefined();
  });

  it("signIn uses GitHub OAuth with app origin redirect", async () => {
    const { signIn } = await import("./Client");

    await signIn();

    expect(clientMocks.signInWithOAuth).toHaveBeenCalledWith({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
  });

  it("signOut delegates to supabase.auth.signOut", async () => {
    const { signOut } = await import("./Client");

    await signOut();

    expect(clientMocks.signOut).toHaveBeenCalled();
  });

  it("getCurrentUser returns user from getUser", async () => {
    const user = { id: "user-1", email: "a@b.com" };
    clientMocks.getUser.mockResolvedValueOnce({ data: { user } });

    const { getCurrentUser } = await import("./Client");

    await expect(getCurrentUser()).resolves.toEqual(user);
  });
});
