import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act, within } from "@testing-library/react";
import MaintainSets from "./MaintainSets";
import { toast } from "react-toastify";
import type { Set } from "../../../dto/Set";
import { CardService } from "../../../services/CardService";
import { displayErrorToast, updateToast } from "../../../common/toastHelpers";

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
  updateSet: ReturnType<typeof vi.fn>;
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
    updateSet: vi.fn(),
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

    await act(async () => {
      fireEvent.change(dateInput, { target: { value: "2024-05-01", name: "release_date" } });
    });

    expect(blurSpy).toHaveBeenCalled();
    blurSpy.mockRestore();
  });

  it("paginates set rows and navigates pages", async () => {
    const pagedSets: Set[] = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Set ${i + 1}`,
      created_at: "2024-03-01",
      is_standard: i % 2 === 0,
      release_date: "2020-01-01",
    }));

    mockService.fetchSets.mockResolvedValue({ data: pagedSets, error: null });

    await act(async () => {
      render(
        <MaintainSets
          cardService={mockService as unknown as CardService}
          initialPageSize={5}
          pageSizeOptions={[5, 10]}
        />
      );
    });

    expect(await screen.findByText("Set 1")).toBeInTheDocument();
    expect(screen.queryByText("Set 6")).not.toBeInTheDocument();
    expect(screen.getByTestId("pagination-summary")).toHaveTextContent("1-5 of 12");

    fireEvent.click(screen.getByTestId("next-page"));

    await waitFor(() => {
      expect(screen.getByText("Set 6")).toBeInTheDocument();
      expect(screen.queryByText("Set 1")).not.toBeInTheDocument();
    });
    expect(screen.getByTestId("pagination-summary")).toHaveTextContent("6-10 of 12");
  });

  it("changes page size and resets to first page", async () => {
    const pagedSets: Set[] = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Set ${i + 1}`,
      created_at: "2024-03-01",
      is_standard: i % 2 === 0,
      release_date: "2020-01-01",
    }));

    mockService.fetchSets.mockResolvedValue({ data: pagedSets, error: null });

    await act(async () => {
      render(
        <MaintainSets
          cardService={mockService as unknown as CardService}
          initialPageSize={5}
          pageSizeOptions={[5, 10]}
        />
      );
    });

    fireEvent.click(screen.getByTestId("next-page"));
    await waitFor(() => expect(screen.getByText("Set 6")).toBeInTheDocument());

    fireEvent.change(screen.getByTestId("page-size-select"), { target: { value: "10" } });

    await waitFor(() => {
      expect(screen.getByText("Set 1")).toBeInTheDocument();
      expect(screen.getByText("Set 10")).toBeInTheDocument();
      expect(screen.queryByText("Set 11")).not.toBeInTheDocument();
    });
    expect(screen.getByTestId("pagination-summary")).toHaveTextContent("1-10 of 12");
  });

  it("opens edit modal when row is clicked", async () => {
    await act(async () => {
      render(<MaintainSets cardService={mockService as unknown as CardService} />);
    });

    await waitFor(() => expect(screen.getByText("Core")).toBeInTheDocument());
    fireEvent.click(screen.getByTestId("set-row-1"));

    const modal = screen.getByTestId("edit-modal");
    expect(modal).toBeInTheDocument();
    expect(within(modal).getByLabelText("Name")).toHaveValue("Core");
  });

  it("cancels edit and discards unsaved changes", async () => {
    await act(async () => {
      render(<MaintainSets cardService={mockService as unknown as CardService} />);
    });

    await act(async () => {
      fireEvent.click(await screen.findByTestId("set-row-1"));
    });
    const modal = screen.getByTestId("edit-modal");
    const editNameInput = within(modal).getByLabelText("Name");
    fireEvent.change(editNameInput, { target: { value: "Changed Name" } });
    expect(editNameInput).toHaveValue("Changed Name");

    await act(async () => {
      fireEvent.click(screen.getByTestId("edit-cancel"));
    });
    await waitFor(() => expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument());

    await act(async () => {
      fireEvent.click(screen.getByTestId("set-row-1"));
    });
    await waitFor(() =>
      expect(within(screen.getByTestId("edit-modal")).getByLabelText("Name")).toHaveValue("Core")
    );
  });

  it("validates required name in edit mode", async () => {
    await act(async () => {
      render(<MaintainSets cardService={mockService as unknown as CardService} />);
    });

    fireEvent.click(await screen.findByTestId("set-row-1"));
    const editNameInput = within(screen.getByTestId("edit-modal")).getByLabelText("Name");
    fireEvent.change(editNameInput, { target: { value: "" } });
    fireEvent.click(screen.getByTestId("edit-save"));

    await waitFor(() => expect(screen.getByText("Required")).toBeInTheDocument());
    expect(mockService.updateSet).not.toHaveBeenCalled();
  });

  it("updates set and refetches on successful save", async () => {
    mockService.updateSet.mockResolvedValue({ error: null });
    mockService.fetchSets
      .mockResolvedValueOnce({ data: mockSets, error: null })
      .mockResolvedValueOnce({
        data: [{ ...mockSets[0], name: "Core Updated" }],
        error: null,
      });

    await act(async () => {
      render(<MaintainSets cardService={mockService as unknown as CardService} />);
    });

    fireEvent.click(await screen.findByTestId("set-row-1"));
    const editNameInput = within(screen.getByTestId("edit-modal")).getByLabelText("Name");
    fireEvent.change(editNameInput, { target: { value: "Core Updated" } });
    fireEvent.click(screen.getByTestId("edit-save"));

    await waitFor(() => {
      expect(mockService.updateSet).toHaveBeenCalledWith(1, {
        name: "Core Updated",
        is_standard: true,
        release_date: "2020-01-01",
      });
      expect(updateToast).toHaveBeenCalledWith(
        { current: "toast-id" },
        null,
        true,
        "Record updated"
      );
      expect(mockService.fetchSets).toHaveBeenCalledTimes(2);
      expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument();
    });
  });

  it("keeps edit modal open when update fails", async () => {
    mockService.updateSet.mockResolvedValue({ error: { message: "Update failed" } });

    await act(async () => {
      render(<MaintainSets cardService={mockService as unknown as CardService} />);
    });

    fireEvent.click(await screen.findByTestId("set-row-1"));
    const editNameInput = within(screen.getByTestId("edit-modal")).getByLabelText("Name");
    fireEvent.change(editNameInput, { target: { value: "Core Updated" } });
    fireEvent.click(screen.getByTestId("edit-save"));

    await waitFor(() => {
      expect(mockService.updateSet).toHaveBeenCalled();
      expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
      expect(within(screen.getByTestId("edit-modal")).getByLabelText("Name")).toHaveValue(
        "Core Updated"
      );
      expect(mockService.fetchSets).toHaveBeenCalledTimes(1);
    });
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
