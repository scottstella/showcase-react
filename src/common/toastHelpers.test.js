import { toast } from "react-toastify";
import { updateToast, displayErrorToast, formatErrorMessage } from "./toastHelpers";
import { describe, it, expect, beforeEach, vi } from "vitest";
// Setup Vitest mock for react-toastify
vi.mock("react-toastify", () => ({
  toast: {
    update: vi.fn(),
    error: vi.fn(),
    TYPE: {
      ERROR: "error",
      INFO: "info",
    },
  },
}));
describe("toastHelpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("updateToast", () => {
    it("should update toast with error message for RLS error", () => {
      const toastRef = { current: "toast-id" };
      const error = { code: "42501", details: "detail", message: "message" };
      updateToast(toastRef, error, false);
      expect(toast.update).toHaveBeenCalledWith("toast-id", {
        render: "You must be logged in to add records",
        type: "error",
        autoClose: 5000,
      });
    });
    it("should update toast with error message for 403 error", () => {
      const toastRef = { current: "toast-id" };
      const error = {
        code: "403",
        details: "detail",
        message: "Unauthorized access",
      };
      updateToast(toastRef, error, false);
      expect(toast.update).toHaveBeenCalledWith("toast-id", {
        render: "Unauthorized access",
        type: "error",
        autoClose: 5000,
      });
    });
    it("should update toast with generic error message for other errors", () => {
      const toastRef = { current: "toast-id" };
      const error = {
        code: "500",
        details: "Server error",
        message: "Internal error",
      };
      updateToast(toastRef, error, false);
      expect(toast.update).toHaveBeenCalledWith("toast-id", {
        render: "Error: [500] Server error, Internal error",
        type: "error",
        autoClose: 5000,
      });
    });
    it("should update toast with success message when no error and showSuccess is true", () => {
      const toastRef = { current: "toast-id" };
      updateToast(toastRef, null, true);
      expect(toast.update).toHaveBeenCalledWith("toast-id", {
        render: "Success",
        type: "info",
        autoClose: 1500,
      });
    });
    it("should not update toast when toastRef is null", () => {
      const toastRef = { current: null };
      updateToast(toastRef, null, true);
      expect(toast.update).not.toHaveBeenCalled();
    });
  });
  describe("displayErrorToast", () => {
    it("should display RLS error toast", () => {
      const error = { code: "42501", details: "detail", message: "message" };
      displayErrorToast(error);
      expect(toast.error).toHaveBeenCalledWith("You must be logged in to add records", {
        autoClose: 5000,
      });
    });
    it("should display 403 error toast", () => {
      const error = {
        code: "403",
        details: "detail",
        message: "Unauthorized access",
      };
      displayErrorToast(error);
      expect(toast.error).toHaveBeenCalledWith("Unauthorized access", {
        autoClose: 5000,
      });
    });
    it("should display generic error toast", () => {
      const error = {
        code: "500",
        details: "Server error",
        message: "Internal error",
      };
      displayErrorToast(error);
      expect(toast.error).toHaveBeenCalledWith("Error: [500] Server error, Internal error", {
        autoClose: 5000,
      });
    });
  });
  describe("formatErrorMessage", () => {
    it("should format error message correctly", () => {
      const error = {
        code: "500",
        details: "Server error",
        message: "Internal error",
      };
      const result = formatErrorMessage(error);
      expect(result).toBe("Error: [500] Server error, Internal error");
    });
  });
});
