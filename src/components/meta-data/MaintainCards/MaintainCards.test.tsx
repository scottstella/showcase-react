import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import MaintainCards from "./MaintainCards";
import { toast } from "react-toastify";
import { CardService } from "../../../services/CardService";
import { updateToast, displayErrorToast } from "../../../common/toastHelpers";
import type { Card } from "../../../dto/Card";

vi.mock("react-toastify", () => ({
  toast: vi.fn(() => "toast-id"),
  Id: String,
}));

vi.mock("../../../common/toastHelpers", () => ({
  displayErrorToast: vi.fn(),
  updateToast: vi.fn(),
}));

interface MockCardService {
  fetchCards: ReturnType<typeof vi.fn>;
  fetchSets: ReturnType<typeof vi.fn>;
  fetchHeroClasses: ReturnType<typeof vi.fn>;
  fetchTribes: ReturnType<typeof vi.fn>;
  addCard: ReturnType<typeof vi.fn>;
  updateCard: ReturnType<typeof vi.fn>;
  deleteCard: ReturnType<typeof vi.fn>;
}

describe("MaintainCards", () => {
  const mockCard: Card = {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Test Card",
    slug: "test-card",
    flavor_text: null,
    card_type: "MINION",
    rarity: "COMMON",
    spell_school: null,
    set_id: 1,
    hero_class_id: 1,
    race_tribe_id: null,
    mana_cost: 1,
    attack: 1,
    health: 1,
    durability: null,
    text: "Taunt.",
    is_collectible: true,
    is_token: false,
    image_url: null,
    image_path: null,
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
    set: { id: 1, name: "Core" },
    hero_class: { id: 1, name: "Mage" },
    race_tribe: null,
    card_mechanic_map: [{ mechanic: "TAUNT" }],
    card_keyword: [{ keyword: "demo" }],
    card_related_card: [],
  };

  const mockService: MockCardService = {
    fetchCards: vi.fn(),
    fetchSets: vi.fn(),
    fetchHeroClasses: vi.fn(),
    fetchTribes: vi.fn(),
    addCard: vi.fn(),
    updateCard: vi.fn(),
    deleteCard: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockService.fetchCards.mockResolvedValue({ data: [mockCard], error: null });
    mockService.fetchSets.mockResolvedValue({
      data: [
        {
          id: 1,
          name: "Core",
          created_at: "2024-01-01",
          is_standard: true,
          release_date: "2024-01-01",
        },
      ],
      error: null,
    });
    mockService.fetchHeroClasses.mockResolvedValue({
      data: [{ id: 1, name: "Mage", created_at: "2024-01-01" }],
      error: null,
    });
    mockService.fetchTribes.mockResolvedValue({
      data: [{ id: 1, name: "Beast", created_at: "2024-01-01" }],
      error: null,
    });
    mockService.addCard.mockResolvedValue({ error: null, data: null });
    mockService.updateCard.mockResolvedValue({ error: null, data: null });
    mockService.deleteCard.mockResolvedValue({ error: null, data: null });
  });

  const fillRequiredAddFormFields = async () => {
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "New Card" } });
    await waitFor(() => expect(screen.getByTestId("add-card-slug")).toHaveValue("new-card"));
    fireEvent.change(screen.getByLabelText("Set"), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText("Class"), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText("Mana"), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText("Attack"), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText("Health"), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText("Card text"), { target: { value: "Does a thing." } });
  };

  it("loads cards and shows summary table", async () => {
    render(<MaintainCards cardService={mockService as unknown as CardService} />);

    await waitFor(() => expect(mockService.fetchCards).toHaveBeenCalled());
    expect(await screen.findByText("Test Card")).toBeInTheDocument();
    const row = screen.getByTestId(`card-row-${mockCard.id}`);
    expect(within(row).getByText("Core")).toBeInTheDocument();
  });

  it("submits a new card", async () => {
    render(<MaintainCards cardService={mockService as unknown as CardService} />);

    await waitFor(() => expect(screen.getByTestId("add-card-form")).toBeInTheDocument());

    await fillRequiredAddFormFields();

    const mechanics = screen.getByTestId("add-mechanics");
    fireEvent.click(within(mechanics).getAllByRole("checkbox")[0]);

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(mockService.addCard).toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith("Adding record...");
      expect(updateToast).toHaveBeenCalled();
    });
    expect(mockService.addCard).toHaveBeenCalledWith(
      expect.objectContaining({ name: "New Card", slug: "new-card" }),
      null
    );
  });

  it("adds mechanic descriptor text for battlecry", async () => {
    render(<MaintainCards cardService={mockService as unknown as CardService} />);
    await waitFor(() => expect(screen.getByTestId("add-card-form")).toBeInTheDocument());

    await fillRequiredAddFormFields();

    const mechanics = screen.getByTestId("add-mechanics");
    fireEvent.click(within(mechanics).getByLabelText("BATTLECRY"));
    fireEvent.change(screen.getByPlaceholderText("BATTLECRY description"), {
      target: { value: "Draw a card" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(mockService.addCard).toHaveBeenCalled());
    expect(mockService.addCard).toHaveBeenCalledWith(
      expect.objectContaining({
        mechanics: expect.arrayContaining(["BATTLECRY"]),
        keywords: ["BATTLECRY: Draw a card"],
      }),
      null
    );
  });

  it("updates a card from edit modal", async () => {
    render(<MaintainCards cardService={mockService as unknown as CardService} />);
    await waitFor(() => expect(screen.getByTestId(`card-row-${mockCard.id}`)).toBeInTheDocument());

    fireEvent.click(screen.getByTestId(`card-row-${mockCard.id}`));
    await waitFor(() =>
      expect(screen.getByRole("dialog", { name: "Edit Card" })).toBeInTheDocument()
    );
    const editModal = screen.getByRole("dialog", { name: "Edit Card" });

    fireEvent.change(within(editModal).getByLabelText("Name"), {
      target: { value: "Edited Card" },
    });
    const editMechanics = within(editModal).getByTestId("edit-mechanics");
    fireEvent.click(within(editMechanics).getByLabelText("BATTLECRY"));
    fireEvent.change(within(editModal).getByPlaceholderText("BATTLECRY description"), {
      target: { value: "Deal 3 damage" },
    });
    fireEvent.click(within(editModal).getByTestId("edit-save"));

    await waitFor(() =>
      expect(mockService.updateCard).toHaveBeenCalledWith(
        mockCard.id,
        expect.objectContaining({
          name: "Edited Card",
          slug: "edited-card",
          mechanics: expect.arrayContaining(["BATTLECRY"]),
          keywords: ["BATTLECRY: Deal 3 damage"],
        }),
        null
      )
    );
  });

  it("deletes from results action icon", async () => {
    render(<MaintainCards cardService={mockService as unknown as CardService} />);
    await waitFor(() => expect(screen.getByTestId(`card-row-${mockCard.id}`)).toBeInTheDocument());

    fireEvent.click(screen.getByTestId("delete-card"));

    await waitFor(() => expect(mockService.deleteCard).toHaveBeenCalledWith(mockCard.id));
    expect(screen.queryByRole("dialog", { name: "Edit Card" })).not.toBeInTheDocument();
  });

  it("clears mechanic descriptor when unchecked", async () => {
    render(<MaintainCards cardService={mockService as unknown as CardService} />);
    await waitFor(() => expect(screen.getByTestId("add-card-form")).toBeInTheDocument());

    await fillRequiredAddFormFields();
    const mechanics = screen.getByTestId("add-mechanics");
    fireEvent.click(within(mechanics).getByLabelText("BATTLECRY"));
    fireEvent.change(screen.getByPlaceholderText("BATTLECRY description"), {
      target: { value: "This should be cleared" },
    });
    fireEvent.click(within(mechanics).getByLabelText("BATTLECRY"));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => expect(mockService.addCard).toHaveBeenCalled());
    expect(mockService.addCard).toHaveBeenCalledWith(
      expect.objectContaining({
        mechanics: expect.not.arrayContaining(["BATTLECRY"]),
        keywords: [],
      }),
      null
    );
  });

  it("opens edit modal from row click", async () => {
    render(<MaintainCards cardService={mockService as unknown as CardService} />);

    await waitFor(() => expect(screen.getByTestId(`card-row-${mockCard.id}`)).toBeInTheDocument());
    fireEvent.click(screen.getByTestId(`card-row-${mockCard.id}`));

    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: "Edit Card" })).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Card")).toBeInTheDocument();
    });
  });

  it("handles fetch error", async () => {
    mockService.fetchCards.mockResolvedValue({ data: null, error: { message: "boom" } });
    render(<MaintainCards cardService={mockService as unknown as CardService} />);

    await waitFor(() => expect(displayErrorToast).toHaveBeenCalledWith({ message: "boom" }));
  });
});
