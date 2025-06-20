import { describe, it, expect, vi, beforeEach } from "vitest";
import { CardService } from "./CardService";
import { HeroClass } from "../dto/HeroClass";
import { Tribe } from "../dto/Tribe";
import { SupabaseClient } from "@supabase/supabase-js";

interface MockQueryBuilder {
  select: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
}

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(),
} as unknown as SupabaseClient;

describe("CardService", () => {
  let cardService: CardService;
  let mockSelect: ReturnType<typeof vi.fn>;
  let mockDelete: ReturnType<typeof vi.fn>;
  let mockInsert: ReturnType<typeof vi.fn>;
  let mockEq: ReturnType<typeof vi.fn>;
  let mockOrder: ReturnType<typeof vi.fn>;
  let mockSingle: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Set up mock chain
    mockSelect = vi.fn();
    mockDelete = vi.fn();
    mockInsert = vi.fn();
    mockEq = vi.fn();
    mockOrder = vi.fn();
    mockSingle = vi.fn();

    (mockSupabase as unknown as { from: ReturnType<typeof vi.fn> }).from.mockReturnValue({
      select: mockSelect,
      delete: mockDelete,
      insert: mockInsert,
    } as MockQueryBuilder);

    mockSelect.mockReturnValue({ order: mockOrder });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockInsert.mockReturnValue({ single: mockSingle });

    // Initialize service with mock
    cardService = new CardService(mockSupabase);
  });

  describe("fetchHeroClasses", () => {
    it("should fetch hero classes ordered by name", async () => {
      const expectedResponse = { data: [{ id: 1, name: "Mage" }] };
      mockOrder.mockResolvedValue(expectedResponse);

      const result = await cardService.fetchHeroClasses();

      expect(
        (mockSupabase as unknown as { from: ReturnType<typeof vi.fn> }).from
      ).toHaveBeenCalledWith("hero_class");
      expect(mockSelect).toHaveBeenCalled();
      expect(mockOrder).toHaveBeenCalledWith("name");
      expect(result).toEqual(expectedResponse);
    });
  });

  describe("deleteHeroClass", () => {
    it("should delete hero class by id", async () => {
      const expectedResponse = { data: { id: 1 } };
      mockEq.mockResolvedValue(expectedResponse);

      const result = await cardService.deleteHeroClass(1);

      expect(
        (mockSupabase as unknown as { from: ReturnType<typeof vi.fn> }).from
      ).toHaveBeenCalledWith("hero_class");
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith("id", 1);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe("addHeroClass", () => {
    it("should add a new hero class", async () => {
      const heroClass: HeroClass = {
        id: 1,
        name: "Mage",
        created_at: "2024-03-02",
      };
      const expectedResponse = { data: heroClass };
      mockSingle.mockResolvedValue(expectedResponse);

      const result = await cardService.addHeroClass(heroClass);

      expect(
        (mockSupabase as unknown as { from: ReturnType<typeof vi.fn> }).from
      ).toHaveBeenCalledWith("hero_class");
      expect(mockInsert).toHaveBeenCalledWith([{ name: heroClass.name }]);
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });
  });

  describe("fetchTribes", () => {
    it("should fetch tribes ordered by name", async () => {
      const expectedResponse = { data: [{ id: 1, name: "Beast" }] };
      mockOrder.mockResolvedValue(expectedResponse);

      const result = await cardService.fetchTribes();

      expect(
        (mockSupabase as unknown as { from: ReturnType<typeof vi.fn> }).from
      ).toHaveBeenCalledWith("tribe");
      expect(mockSelect).toHaveBeenCalled();
      expect(mockOrder).toHaveBeenCalledWith("name");
      expect(result).toEqual(expectedResponse);
    });
  });

  describe("deleteTribe", () => {
    it("should delete tribe by id", async () => {
      const expectedResponse = { data: { id: 1 } };
      mockEq.mockResolvedValue(expectedResponse);

      const result = await cardService.deleteTribe(1);

      expect(
        (mockSupabase as unknown as { from: ReturnType<typeof vi.fn> }).from
      ).toHaveBeenCalledWith("tribe");
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith("id", 1);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe("addTribe", () => {
    it("should add a new tribe", async () => {
      const tribe: Tribe = {
        id: 1,
        name: "Beast",
        created_at: "2024-03-02",
      };
      const expectedResponse = { data: tribe };
      mockSingle.mockResolvedValue(expectedResponse);

      const result = await cardService.addTribe(tribe);

      expect(
        (mockSupabase as unknown as { from: ReturnType<typeof vi.fn> }).from
      ).toHaveBeenCalledWith("tribe");
      expect(mockInsert).toHaveBeenCalledWith([{ name: tribe.name }]);
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });
  });

  // Error cases
  describe("error handling", () => {
    it("should handle fetchHeroClasses error", async () => {
      const error = new Error("Database error");
      mockOrder.mockRejectedValue(error);

      await expect(cardService.fetchHeroClasses()).rejects.toThrow("Database error");
    });

    it("should handle deleteHeroClass error", async () => {
      const error = new Error("Delete failed");
      mockEq.mockRejectedValue(error);

      await expect(cardService.deleteHeroClass(1)).rejects.toThrow("Delete failed");
    });

    it("should handle addHeroClass error", async () => {
      const error = new Error("Insert failed");
      mockSingle.mockRejectedValue(error);

      const heroClass: HeroClass = {
        id: 1,
        name: "Mage",
        created_at: "2024-03-02",
      };

      await expect(cardService.addHeroClass(heroClass)).rejects.toThrow("Insert failed");
    });
  });
});
