import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MaintainClasses from "./MaintainClasses";
import { toast } from "react-toastify";
import type { HeroClass } from "../../../dto/HeroClass";
import { CardService } from "../../../services/CardService";
import { updateToast } from "../../../common/toastHelpers";
import { supabase } from "../../../supabase/Client";

interface ValidationError extends Error {
  name: string;
  errors: string[];
  inner?: Array<{ path: string; message: string }>;
}

// Mock dependencies
vi.mock("react-toastify", () => ({
  toast: vi.fn(() => "toast-id"),
  Id: String,
}));

vi.mock("../../../common/toastHelpers", () => ({
  displayErrorToast: vi.fn(),
  updateToast: vi.fn(),
}));

// Mock the schema
vi.mock("../../../schemas/index.js", () => ({
  heroClassSchema: {
    validateSync: vi.fn((values) => {
      if (!values.name) {
        const error = new Error("Required") as ValidationError;
        error.name = "ValidationError";
        error.inner = [{ path: "name", message: "Required" }];
        throw error;
      }
      return values;
    }),
    validate: vi.fn(async (values) => {
      if (!values.name) {
        const error = new Error("Required") as ValidationError;
        error.name = "ValidationError";
        error.inner = [{ path: "name", message: "Required" }];
        throw error;
      }
      return values;
    }),
    isValid: vi.fn((values) => Promise.resolve(values?.name ? true : false)),
    isValidSync: vi.fn((values) => (values?.name ? true : false)),
    cast: vi.fn((values) => values),
    _nodes: ["name"],
    fields: { name: { type: "string", tests: [] } },
    spec: {
      strict: true,
      abortEarly: true,
      recursive: true,
      nullable: false,
      optional: false,
      strip: false,
    },
  },
}));

describe("MaintainClasses", () => {
  const mockHeroClasses: HeroClass[] = [
    { id: 1, name: "Mage", created_at: "2024-03-01" },
    { id: 2, name: "Warrior", created_at: "2024-03-02" },
  ];

  // Create a mock service that extends CardService
  const mockService = new CardService(supabase);
  Object.keys(mockService).forEach((key) => {
    if (typeof (mockService as any)[key] === "function") {
      (mockService as any)[key] = vi.fn();
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
    (mockService as any).fetchHeroClasses.mockResolvedValue({
      data: mockHeroClasses,
      error: null,
    });
  });

  it("renders without crashing", () => {
    render(<MaintainClasses cardService={mockService} />);
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
  });

  it("shows loading state initially and then removes it", async () => {
    render(<MaintainClasses cardService={mockService} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  it("fetches and displays hero classes on mount", async () => {
    render(<MaintainClasses cardService={mockService} />);

    // First verify loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for loading to finish and data to be displayed
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Now check for the rendered data in the table
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(3); // Header row + 2 data rows

    // Find cells containing the hero class names
    const cells = screen.getAllByRole("cell");
    const nameCell1 = cells.find((cell) => cell.textContent === "Mage");
    const nameCell2 = cells.find((cell) => cell.textContent === "Warrior");

    expect(nameCell1).toBeInTheDocument();
    expect(nameCell2).toBeInTheDocument();
  });

  it("handles fetch error", async () => {
    const error = { message: "Failed to fetch" };
    (mockService as any).fetchHeroClasses.mockResolvedValue({
      data: null,
      error,
    });

    render(<MaintainClasses cardService={mockService} />);

    await waitFor(() => {
      expect(mockService.fetchHeroClasses).toHaveBeenCalled();
    });
  });

  it("adds a new hero class", async () => {
    (mockService as any).addHeroClass.mockResolvedValue({
      data: null,
      error: null,
    });

    render(<MaintainClasses cardService={mockService} />);

    const input = screen.getByPlaceholderText("Name");
    await fireEvent.change(input, { target: { value: "Druid" } });
    const form = screen.getByRole("form");
    await fireEvent.submit(form);

    await waitFor(() => {
      expect(mockService.addHeroClass).toHaveBeenCalledWith({
        id: 0,
        name: "Druid",
        created_at: expect.any(String),
      });
    });

    expect(toast).toHaveBeenCalledWith("Adding record...");
  });

  it("handles add hero class error", async () => {
    const error = { message: "Failed to add" };
    (mockService as any).addHeroClass.mockResolvedValue({ data: null, error });

    render(<MaintainClasses cardService={mockService} />);

    // Fill out and submit the form
    const input = screen.getByPlaceholderText("Name");
    const inputValue = "Druid";
    await fireEvent.change(input, { target: { value: inputValue } });
    const form = screen.getByRole("form");
    await fireEvent.submit(form);

    // Verify service was called
    await waitFor(() => {
      expect(mockService.addHeroClass).toHaveBeenCalledWith({
        id: 0,
        name: inputValue,
        created_at: expect.any(String),
      });
    });

    // Verify toast notifications
    await waitFor(() => {
      // Verify toast was called in correct order with correct messages
      expect(toast).toHaveBeenCalledTimes(1);
      expect(toast).toHaveBeenNthCalledWith(1, "Adding record...");
      expect(updateToast).toHaveBeenCalledTimes(1);
      expect(updateToast).toHaveBeenCalledWith(
        { current: "toast-id" },
        error,
        true
      );
    });

    // Verify form wasn't reset (value should still be there)
    expect(input).toHaveValue(inputValue);

    // Verify the form is still enabled and can be submitted again
    expect(input).not.toBeDisabled();
    expect(form).not.toBeDisabled();
  });

  it("deletes a hero class", async () => {
    (mockService as any).deleteHeroClass.mockResolvedValue({
      data: null,
      error: null,
    });

    render(<MaintainClasses cardService={mockService} />);

    await waitFor(() => {
      expect(screen.getByText("Mage")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("img", { hidden: true });
    await fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockService.deleteHeroClass).toHaveBeenCalledWith(1);
    });

    expect(toast).toHaveBeenCalledWith("Deleting record...");
  });

  it("handles delete hero class error", async () => {
    const error = { message: "Failed to delete" };
    (mockService as any).deleteHeroClass.mockResolvedValue({
      data: null,
      error,
    });

    render(<MaintainClasses cardService={mockService} />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Verify initial state
    const mageText = screen.getByText("Mage");
    expect(mageText).toBeInTheDocument();

    // Clear any toast calls from initial render
    vi.clearAllMocks();

    // Attempt to delete
    const deleteButtons = screen.getAllByRole("img", { hidden: true });
    await fireEvent.click(deleteButtons[0]);

    // Verify delete attempt
    await waitFor(() => {
      expect(mockService.deleteHeroClass).toHaveBeenCalledWith(1);
    });

    // Verify toast notifications
    await waitFor(() => {
      // Verify toast was called in correct order with correct messages
      expect(toast).toHaveBeenCalledTimes(1);
      expect(toast).toHaveBeenNthCalledWith(1, "Deleting record...");
      expect(updateToast).toHaveBeenCalledTimes(1);
      expect(updateToast).toHaveBeenCalledWith(
        { current: "toast-id" },
        error,
        true
      );
    });

    // Verify the record is still in the table (not removed)
    expect(mageText).toBeInTheDocument();

    // Verify delete button is still enabled
    const deleteButton = deleteButtons[0];
    expect(deleteButton).not.toBeDisabled();
    expect(deleteButton).toHaveAttribute("id", "1");
  });

  it("validates form input", async () => {
    render(<MaintainClasses cardService={mockService} />);

    const form = screen.getByRole("form");
    await fireEvent.submit(form);

    await waitFor(() => {
      const errorElement = screen.getByText("Required", { exact: true });
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveClass("error-msg");
    });
  });

  it("resets form after successful submission", async () => {
    (mockService as any).addHeroClass.mockResolvedValue({
      data: null,
      error: null,
    });

    render(<MaintainClasses cardService={mockService} />);

    const input = screen.getByPlaceholderText("Name");
    await fireEvent.change(input, { target: { value: "Druid" } });
    const form = screen.getByRole("form");
    await fireEvent.submit(form);

    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });
});
