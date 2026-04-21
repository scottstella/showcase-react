import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import type { User } from "@supabase/supabase-js";
import Auth from "./Auth";

const authMocks = vi.hoisted(() => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  getUser: vi.fn(),
  onAuthStateChange: vi.fn(),
}));

vi.mock("../supabase/Client", () => ({
  signIn: authMocks.signIn,
  signOut: authMocks.signOut,
  supabase: {
    auth: {
      getUser: authMocks.getUser,
      onAuthStateChange: authMocks.onAuthStateChange,
    },
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe("Auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMocks.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    } as unknown as ReturnType<typeof authMocks.onAuthStateChange>);
  });

  it("shows spinner while resolving session", async () => {
    authMocks.getUser.mockImplementation(() => new Promise(() => {}));

    render(<Auth />);

    expect(document.querySelector(".auth-spinner")).toBeInTheDocument();
  });

  it("shows GitHub sign-in when logged out", async () => {
    authMocks.getUser.mockResolvedValue({ data: { user: null } });

    render(<Auth />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /sign in with github/i })).toBeInTheDocument();
    });
  });

  it("shows email and sign out when logged in", async () => {
    authMocks.getUser.mockResolvedValue({
      data: {
        user: {
          id: "1",
          email: "player@example.com",
          user_metadata: {},
        } as unknown as User,
      },
    });

    render(<Auth />);

    await waitFor(() => {
      expect(screen.getByText("player@example.com")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
    });
  });

  it("prefers GitHub user_name in label when present", async () => {
    authMocks.getUser.mockResolvedValue({
      data: {
        user: {
          id: "1",
          email: "player@example.com",
          user_metadata: { user_name: "cardfan" },
        } as unknown as User,
      },
    });

    render(<Auth />);

    await waitFor(() => {
      expect(screen.getByText("cardfan")).toBeInTheDocument();
    });
  });

  it("handles sign-in error from Supabase", async () => {
    authMocks.getUser.mockResolvedValue({ data: { user: null } });
    authMocks.signIn.mockResolvedValue({ error: { message: "OAuth failed" } });

    const { toast } = await import("react-toastify");

    render(<Auth />);

    await waitFor(() => screen.getByRole("button", { name: /sign in with github/i }));
    fireEvent.click(screen.getByRole("button", { name: /sign in with github/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error signing in: OAuth failed");
    });
  });

  it("handles sign-in unexpected throw", async () => {
    authMocks.getUser.mockResolvedValue({ data: { user: null } });
    authMocks.signIn.mockRejectedValue(new Error("network down"));

    const { toast } = await import("react-toastify");

    render(<Auth />);

    await waitFor(() => screen.getByRole("button", { name: /sign in with github/i }));
    fireEvent.click(screen.getByRole("button", { name: /sign in with github/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error signing in: network down");
    });
  });

  it("shows success toast on sign out", async () => {
    authMocks.getUser.mockResolvedValue({
      data: {
        user: { id: "1", email: "a@b.com", user_metadata: {} } as unknown as User,
      },
    });
    authMocks.signOut.mockResolvedValue({ error: null });

    const { toast } = await import("react-toastify");

    render(<Auth />);

    await waitFor(() => screen.getByRole("button", { name: /sign out/i }));
    fireEvent.click(screen.getByRole("button", { name: /sign out/i }));

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith("Signed out successfully");
    });
  });

  it("shows error toast when sign out returns error", async () => {
    authMocks.getUser.mockResolvedValue({
      data: {
        user: { id: "1", email: "a@b.com", user_metadata: {} } as unknown as User,
      },
    });
    authMocks.signOut.mockResolvedValue({ error: { message: "Session expired" } });

    const { toast } = await import("react-toastify");

    render(<Auth />);

    await waitFor(() => screen.getByRole("button", { name: /sign out/i }));
    fireEvent.click(screen.getByRole("button", { name: /sign out/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error signing out: Session expired");
    });
  });

  it("updates displayed user when auth state changes", async () => {
    let authListener: (event: string, session: { user: User | null } | null) => void = () => {};
    authMocks.onAuthStateChange.mockImplementation(cb => {
      authListener = cb as typeof authListener;
      return { data: { subscription: { unsubscribe: vi.fn() } } } as never;
    });

    authMocks.getUser.mockResolvedValue({ data: { user: null } });

    render(<Auth />);

    await waitFor(() => screen.getByRole("button", { name: /sign in with github/i }));

    await act(async () => {
      authListener("SIGNED_IN", {
        user: { id: "1", email: "new@example.com", user_metadata: {} } as unknown as User,
      });
    });

    await waitFor(() => {
      expect(screen.getByText("new@example.com")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
    });
  });

  it("handles sign-out throw with generic message", async () => {
    authMocks.getUser.mockResolvedValue({
      data: {
        user: { id: "1", email: "a@b.com", user_metadata: {} } as unknown as User,
      },
    });
    authMocks.signOut.mockRejectedValue("boom");

    const { toast } = await import("react-toastify");

    render(<Auth />);

    await waitFor(() => screen.getByRole("button", { name: /sign out/i }));
    fireEvent.click(screen.getByRole("button", { name: /sign out/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error signing out: An unknown error occurred");
    });
  });
});
