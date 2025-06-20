import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MaintainClasses from "./MaintainClasses";
import { toast } from "react-toastify";
import type { HeroClass } from "../../../dto/HeroClass";
import { CardService } from "../../../services/CardService";
import { updateToast, displayErrorToast } from "../../../common/toastHelpers";

interface ValidationError extends Error {
  name: string;
  errors: string[];
  inner?: Array<{ path: string; message: string }>;
}

interface MockCardService {
  fetchHeroClasses: ReturnType<typeof vi.fn>;
  addHeroClass: ReturnType<typeof vi.fn>;
  deleteHeroClass: ReturnType<typeof vi.fn>;
  fetchTribes: ReturnType<typeof vi.fn>;
  addTribe: ReturnType<typeof vi.fn>;
  deleteTribe: ReturnType<typeof vi.fn>;
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
vi.mock("../../../schemas/index", () => ({
  heroClassSchema: {
    validateSync: vi.fn(values => {
      if (!values.name) {
        const error = new Error("Required") as ValidationError;
        error.name = "ValidationError";
        error.inner = [{ path: "name", message: "Required" }];
        throw error;
      }
      return values;
    }),
    validate: vi.fn(async values => {
      if (!values.name) {
        const error = new Error("Required") as ValidationError;
        error.name = "ValidationError";
        error.inner = [{ path: "name", message: "Required" }];
        throw error;
      }
      return values;
    }),
    isValid: vi.fn(values => Promise.resolve(values?.name ? true : false)),
    isValidSync: vi.fn(values => (values?.name ? true : false)),
    cast: vi.fn(values => values),
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

  // Create a mock service
  const mockService: MockCardService = {
    fetchHeroClasses: vi.fn(),
    addHeroClass: vi.fn(),
    deleteHeroClass: vi.fn(),
    fetchTribes: vi.fn(),
    addTribe: vi.fn(),
    deleteTribe: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockService.fetchHeroClasses.mockResolvedValue({
      data: mockHeroClasses,
      error: null,
    });
  });

  it("renders without crashing", async () => {
    render(<MaintainClasses cardService={mockService as unknown as CardService} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    });
  });

  it("shows loading state initially and then removes it", async () => {
    mockService.fetchHeroClasses.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve({ data: mockHeroClasses, error: null });
          }, 100);
        })
    );

    render(<MaintainClasses cardService={mockService as unknown as CardService} />);

    // Initial loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for data to load and loading state to be removed
    await waitFor(
      () => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
        const rows = screen.getAllByRole("row");
        expect(rows.length).toBeGreaterThan(1); // Header row + at least one data row
      },
      { timeout: 2000 }
    );
  });

  it("fetches and displays hero classes on mount", async () => {
    render(<MaintainClasses cardService={mockService as unknown as CardService} />);

    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      expect(rows.length).toBe(3); // Header row + 2 data rows
      expect(screen.getByText("Mage")).toBeInTheDocument();
      expect(screen.getByText("Warrior")).toBeInTheDocument();
    });
  });

  it("handles fetch error", async () => {
    const error = { message: "Failed to fetch" };
    mockService.fetchHeroClasses.mockResolvedValue({
      data: null,
      error,
    });

    render(<MaintainClasses cardService={mockService as unknown as CardService} />);

    await waitFor(() => {
      expect(mockService.fetchHeroClasses).toHaveBeenCalled();
      expect(displayErrorToast).toHaveBeenCalledWith(error);
    });
  });

  it("adds a new hero class", async () => {
    mockService.addHeroClass.mockResolvedValue({
      data: null,
      error: null,
    });

    render(<MaintainClasses cardService={mockService as unknown as CardService} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("Name");
    fireEvent.change(input, { target: { value: "Druid" } });
    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockService.addHeroClass).toHaveBeenCalledWith({
        id: 0,
        name: "Druid",
        created_at: expect.any(String),
      });
      expect(toast).toHaveBeenCalledWith("Adding record...");
      expect(input).toHaveValue("");
    });
  });

  it("handles add hero class error", async () => {
    const error = { message: "Failed to add" };
    mockService.addHeroClass.mockResolvedValue({
      data: null,
      error,
    });

    render(<MaintainClasses cardService={mockService as unknown as CardService} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("Name");
    const inputValue = "Druid";
    fireEvent.change(input, { target: { value: inputValue } });
    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockService.addHeroClass).toHaveBeenCalledWith({
        id: 0,
        name: inputValue,
        created_at: expect.any(String),
      });
      expect(toast).toHaveBeenCalledWith("Adding record...");
      expect(updateToast).toHaveBeenCalledWith({ current: "toast-id" }, error, true);
      expect(input).toHaveValue(inputValue);
      expect(input).not.toBeDisabled();
      expect(form).not.toBeDisabled();
    });
  });

  it("deletes a hero class", async () => {
    // Mock initial data load
    mockService.fetchHeroClasses.mockResolvedValueOnce({
      data: mockHeroClasses,
      error: null,
    });

    // Mock the fetch after delete to return only one hero class
    mockService.fetchHeroClasses.mockResolvedValueOnce({
      data: [mockHeroClasses[1]], // Only return Warrior
      error: null,
    });

    // Mock successful delete
    mockService.deleteHeroClass.mockResolvedValue({
      data: null,
      error: null,
    });

    render(<MaintainClasses cardService={mockService as unknown as CardService} />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      expect(screen.getByText("Mage")).toBeInTheDocument();
      expect(screen.getByText("Warrior")).toBeInTheDocument();
      expect(screen.getAllByRole("img", { hidden: true })).toHaveLength(2);
    });

    // Click delete button for Mage (first hero class)
    const deleteButtons = screen.getAllByRole("img", { hidden: true });
    fireEvent.click(deleteButtons[0]);

    // Wait for delete operation to start
    await waitFor(() => {
      expect(mockService.deleteHeroClass).toHaveBeenCalledWith(1);
      expect(toast).toHaveBeenCalledWith("Deleting record...");
    });

    // Wait for the UI to update after deletion and refetch
    await waitFor(() => {
      expect(screen.queryByText("Mage")).not.toBeInTheDocument();
      expect(screen.getByText("Warrior")).toBeInTheDocument();
      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(2); // Header + 1 remaining row
    });
  });

  it("handles delete hero class error", async () => {
    const error = { message: "Failed to delete" };
    mockService.deleteHeroClass.mockResolvedValue({
      data: null,
      error,
    });

    render(<MaintainClasses cardService={mockService as unknown as CardService} />);

    // Wait for initial data to load and find delete button
    await waitFor(() => {
      expect(screen.getByText("Mage")).toBeInTheDocument();
      expect(screen.getAllByRole("img", { hidden: true })).toHaveLength(2);
    });

    vi.clearAllMocks();

    // Click delete button
    const deleteButtons = screen.getAllByRole("img", { hidden: true });
    fireEvent.click(deleteButtons[0]);

    // Wait for delete operation to complete and verify error handling
    await waitFor(() => {
      expect(mockService.deleteHeroClass).toHaveBeenCalledWith(1);
      expect(toast).toHaveBeenCalledWith("Deleting record...");
      expect(updateToast).toHaveBeenCalledWith({ current: "toast-id" }, error, true);
      // Verify the row is still in the table
      expect(screen.getByText("Mage")).toBeInTheDocument();
      const deleteButton = deleteButtons[0];
      expect(deleteButton).not.toBeDisabled();
      expect(deleteButton).toHaveAttribute("id", "1");
    });
  });

  it("validates form input", async () => {
    render(<MaintainClasses cardService={mockService as unknown as CardService} />);

    await waitFor(() => {
      expect(screen.getByRole("form")).toBeInTheDocument();
    });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => {
      const errorElement = screen.getByText("Required", { exact: true });
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveClass("error-msg");
    });
  });

  it("resets form after successful submission", async () => {
    mockService.addHeroClass.mockResolvedValue({
      data: null,
      error: null,
    });

    render(<MaintainClasses cardService={mockService as unknown as CardService} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("Name");
    fireEvent.change(input, { target: { value: "Druid" } });
    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });
});
