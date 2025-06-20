import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import MaintainTribes from "./MaintainTribes";
import { toast } from "react-toastify";
import { displayErrorToast } from "../../../common/toastHelpers";
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
  tribeSchema: {
    validateSync: vi.fn(values => {
      if (!values.name) {
        const error = new Error("Required");
        error.name = "ValidationError";
        error.inner = [{ path: "name", message: "Required" }];
        throw error;
      }
      return values;
    }),
    validate: vi.fn(async values => {
      if (!values.name) {
        const error = new Error("Required");
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
describe("MaintainTribes", () => {
  const mockTribes = [
    { id: 1, name: "Murloc", created_at: "2024-03-01" },
    { id: 2, name: "Dragon", created_at: "2024-03-02" },
  ];
  // Create a mock service
  const mockService = {
    fetchHeroClasses: vi.fn(),
    addHeroClass: vi.fn(),
    deleteHeroClass: vi.fn(),
    fetchTribes: vi.fn(),
    addTribe: vi.fn(),
    deleteTribe: vi.fn(),
  };
  beforeEach(() => {
    vi.clearAllMocks();
    mockService.fetchTribes.mockResolvedValue({
      data: mockTribes,
      error: null,
    });
  });
  it("renders without crashing", async () => {
    mockService.fetchTribes.mockImplementationOnce(() => new Promise(() => {}));
    await act(async () => {
      render(React.createElement(MaintainTribes, { cardService: mockService }));
    });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
  it("shows loading state initially and then removes it", async () => {
    mockService.fetchTribes.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve({ data: mockTribes, error: null });
          }, 100);
        })
    );
    render(React.createElement(MaintainTribes, { cardService: mockService }));
    // Initial loading state
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    // Wait for data to load and loading state to be removed
    await waitFor(
      () => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
        const rows = screen.getAllByRole("row");
        expect(rows.length).toBeGreaterThan(1); // Header row + at least one data row
      },
      { timeout: 2000 }
    );
  });
  it("fetches and displays tribes on mount", async () => {
    await act(async () => {
      render(React.createElement(MaintainTribes, { cardService: mockService }));
    });
    expect(mockService.fetchTribes).toHaveBeenCalled();
    expect(await screen.findByText("Murloc")).toBeInTheDocument();
  });
  it("handles fetch error", async () => {
    const error = { message: "Failed to fetch" };
    mockService.fetchTribes.mockResolvedValue({
      data: null,
      error,
    });
    await act(async () => {
      render(React.createElement(MaintainTribes, { cardService: mockService }));
    });
    expect(displayErrorToast).toHaveBeenCalledWith(error);
  });
  it("adds a new tribe", async () => {
    mockService.addTribe.mockResolvedValue({
      data: null,
      error: null,
    });
    await act(async () => {
      render(React.createElement(MaintainTribes, { cardService: mockService }));
    });
    const input = screen.getByPlaceholderText("Name");
    const form = screen.getByRole("form");
    await act(async () => {
      fireEvent.change(input, { target: { value: "Dragon" } });
      fireEvent.submit(form);
    });
    expect(mockService.addTribe).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Dragon",
      })
    );
    expect(toast).toHaveBeenCalledWith("Adding record...");
  });
  it("handles add tribe error", async () => {
    const error = { message: "Failed to add" };
    mockService.addTribe.mockResolvedValue({
      data: null,
      error,
    });
    await act(async () => {
      render(React.createElement(MaintainTribes, { cardService: mockService }));
    });
    const input = screen.getByPlaceholderText("Name");
    const form = screen.getByRole("form");
    await act(async () => {
      fireEvent.change(input, { target: { value: "Dragon" } });
      fireEvent.submit(form);
    });
    expect(mockService.addTribe).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Dragon",
      })
    );
  });
  it("deletes a tribe", async () => {
    const mockTribes = [{ id: 1, name: "Murloc", created_at: "2024-02-29T19:00:00.000Z" }];
    mockService.fetchTribes.mockResolvedValue({
      data: mockTribes,
      error: null,
    });
    mockService.deleteTribe.mockResolvedValue({ error: null });
    await act(async () => {
      render(React.createElement(MaintainTribes, { cardService: mockService }));
    });
    await act(async () => {
      await waitFor(() => {
        const deleteButtons = screen.getAllByTestId("delete-tribe");
        expect(deleteButtons.length).toBeGreaterThan(0);
        fireEvent.click(deleteButtons[0]);
      });
    });
    expect(mockService.deleteTribe).toHaveBeenCalledWith(1);
    expect(toast).toHaveBeenCalledWith("Deleting record...");
  });
  it("handles delete tribe error", async () => {
    const mockTribes = [{ id: 1, name: "Murloc", created_at: "2024-02-29T19:00:00.000Z" }];
    mockService.fetchTribes.mockResolvedValue({
      data: mockTribes,
      error: null,
    });
    const error = { message: "Failed to delete" };
    mockService.deleteTribe.mockResolvedValue({ error });
    await act(async () => {
      render(React.createElement(MaintainTribes, { cardService: mockService }));
    });
    await act(async () => {
      await waitFor(() => {
        const deleteButtons = screen.getAllByTestId("delete-tribe");
        expect(deleteButtons.length).toBeGreaterThan(0);
        fireEvent.click(deleteButtons[0]);
      });
    });
    expect(mockService.deleteTribe).toHaveBeenCalledWith(1);
    expect(toast).toHaveBeenCalledWith("Deleting record...");
  });
  it("validates form input", async () => {
    await act(async () => {
      render(React.createElement(MaintainTribes, { cardService: mockService }));
    });
    const form = screen.getByRole("form");
    await act(async () => {
      fireEvent.submit(form);
    });
    await act(async () => {
      await waitFor(() => {
        expect(screen.getByText("Required")).toBeInTheDocument();
      });
    });
    expect(mockService.addTribe).not.toHaveBeenCalled();
  });
  it("resets form after successful submission", async () => {
    mockService.addTribe.mockResolvedValue({ error: null });
    await act(async () => {
      render(React.createElement(MaintainTribes, { cardService: mockService }));
    });
    const input = screen.getByPlaceholderText("Name");
    const form = screen.getByRole("form");
    await act(async () => {
      fireEvent.change(input, { target: { value: "Dragon" } });
    });
    await act(async () => {
      fireEvent.submit(form);
    });
    await act(async () => {
      await waitFor(() => {
        expect(input).toHaveValue("");
      });
    });
  });
});
