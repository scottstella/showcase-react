import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import MaintainSets from "./MaintainSets";
import { toast } from "react-toastify";
import type { Set } from "../../../dto/Set";
import { CardService } from "../../../services/CardService";
import { displayErrorToast } from "../../../common/toastHelpers";

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
  fetchSets: ReturnType<typeof vi.fn>;
  addSet: ReturnType<typeof vi.fn>;
  deleteSet: ReturnType<typeof vi.fn>;
}

vi.mock("react-toastify", () => ({
  toast: vi.fn(() => "toast-id"),
  Id: String,
}));

vi.mock("../../../common/toastHelpers", () => ({
  displayErrorToast: vi.fn(),
  updateToast: vi.fn(),
}));

vi.mock("../../../schemas/index", () => ({
  setSchema: {
    validateSync: vi.fn(values => {
      if (!values.name?.trim()) {
        const error = new Error("Required") as ValidationError;
        error.name = "ValidationError";
        error.inner = [{ path: "name", message: "Required" }];
        throw error;
      }
      return values;
    }),
    validate: vi.fn(async values => {
      if (!values.name?.trim()) {
        const error = new Error("Required") as ValidationError;
        error.name = "ValidationError";
        error.inner = [{ path: "name", message: "Required" }];
        throw error;
      }
      return values;
    }),
    isValid: vi.fn(values => Promise.resolve(!!values?.name?.trim())),
    isValidSync: vi.fn(values => !!values?.name?.trim()),
    cast: vi.fn(values => values),
    _nodes: ["name", "is_standard", "release_date"],
    fields: {},
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

describe("MaintainSets", () => {
  const mockSets: Set[] = [
    {
      id: 1,
      name: "Core",
      created_at: "2024-03-01",
      is_standard: true,
      release_date: "2020-01-01",
    },
  ];

  const mockService: MockCardService = {
    fetchHeroClasses: vi.fn(),
    addHeroClass: vi.fn(),
    deleteHeroClass: vi.fn(),
    fetchTribes: vi.fn(),
    addTribe: vi.fn(),
    deleteTribe: vi.fn(),
    fetchSets: vi.fn(),
    addSet: vi.fn(),
    deleteSet: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockService.fetchSets.mockResolvedValue({
      data: mockSets,
      error: null,
    });
  });

  it("shows loading then table rows after fetch", async () => {
    mockService.fetchSets.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          setTimeout(() => resolve({ data: mockSets, error: null }), 50);
        })
    );

    render(<MaintainSets cardService={mockService as unknown as CardService} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
        expect(screen.getByText("Core")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it("handles fetch error", async () => {
    const error = { message: "Failed to fetch sets" };
    mockService.fetchSets.mockResolvedValue({ data: null, error });

    await act(async () => {
      render(<MaintainSets cardService={mockService as unknown as CardService} />);
    });

    expect(displayErrorToast).toHaveBeenCalledWith(error);
  });

  it("submits a new set", async () => {
    mockService.addSet.mockResolvedValue({ data: null, error: null });

    await act(async () => {
      render(<MaintainSets cardService={mockService as unknown as CardService} />);
    });

    const nameInput = screen.getByPlaceholderText("Name");
    const form = screen.getByRole("form");

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: "Expansion" } });
      fireEvent.submit(form);
    });

    expect(mockService.addSet).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Expansion",
      })
    );
    expect(toast).toHaveBeenCalledWith("Adding record...");
  });

  it("deletes a set", async () => {
    mockService.deleteSet.mockResolvedValue({ error: null });

    await act(async () => {
      render(<MaintainSets cardService={mockService as unknown as CardService} />);
    });

    await waitFor(() => expect(screen.getAllByTestId("delete-set").length).toBeGreaterThan(0));

    await act(async () => {
      fireEvent.click(screen.getAllByTestId("delete-set")[0]);
    });

    expect(mockService.deleteSet).toHaveBeenCalledWith(1);
    expect(toast).toHaveBeenCalledWith("Deleting record...");
  });

  it("validates empty name on submit", async () => {
    await act(async () => {
      render(<MaintainSets cardService={mockService as unknown as CardService} />);
    });

    const form = screen.getByRole("form");
    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(screen.getByText("Required")).toBeInTheDocument();
    });
    expect(mockService.addSet).not.toHaveBeenCalled();
  });

  it("blurs release date input after change", async () => {
    await act(async () => {
      render(<MaintainSets cardService={mockService as unknown as CardService} />);
    });

    const dateInput = screen.getByLabelText(/release date/i) as HTMLInputElement;
    const blurSpy = vi.spyOn(dateInput, "blur");

    fireEvent.change(dateInput, { target: { value: "2024-05-01", name: "release_date" } });

    expect(blurSpy).toHaveBeenCalled();
    blurSpy.mockRestore();
  });

  it("keeps form values when addSet returns an error", async () => {
    mockService.addSet.mockResolvedValue({ error: { message: "Insert failed" } });

    await act(async () => {
      render(<MaintainSets cardService={mockService as unknown as CardService} />);
    });

    const nameInput = screen.getByPlaceholderText("Name");
    const form = screen.getByRole("form");

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: "Bad Set" } });
      fireEvent.submit(form);
    });

    await waitFor(() => expect(mockService.addSet).toHaveBeenCalled());
    expect(nameInput).toHaveValue("Bad Set");
  });

  it("does not refetch when deleteSet returns an error", async () => {
    mockService.deleteSet.mockResolvedValue({ error: { message: "Delete failed" } });

    await act(async () => {
      render(<MaintainSets cardService={mockService as unknown as CardService} />);
    });

    await waitFor(() => expect(mockService.fetchSets).toHaveBeenCalledTimes(1));

    await act(async () => {
      fireEvent.click(screen.getAllByTestId("delete-set")[0]);
    });

    await waitFor(() => expect(mockService.deleteSet).toHaveBeenCalled());
    expect(mockService.fetchSets).toHaveBeenCalledTimes(1);
  });
});
