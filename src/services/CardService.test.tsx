import { describe, it, expect, vi, beforeEach } from "vitest";
import { CardService } from "./CardService";
import { HeroClass } from "../dto/HeroClass";
import { Tribe } from "../dto/Tribe";
import { Set } from "../dto/Set";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

interface MockQueryBuilder {
  select: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
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
  let mockUpdate: ReturnType<typeof vi.fn>;
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
    mockUpdate = vi.fn();
    mockEq = vi.fn();
    mockOrder = vi.fn();
    mockSingle = vi.fn();

    (mockSupabase as unknown as { from: ReturnType<typeof vi.fn> }).from.mockReturnValue({
      select: mockSelect,
      delete: mockDelete,
      insert: mockInsert,
      update: mockUpdate,
    } as MockQueryBuilder);

    mockSelect.mockReturnValue({ order: mockOrder });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockInsert.mockReturnValue({ single: mockSingle });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ single: mockSingle });

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
      expect(mockInsert).toHaveBeenCalledWith([
        {
          name: heroClass.name,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      ]);
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });
  });

  describe("updateHeroClass", () => {
    it("should update hero class name by id", async () => {
      const patch = { name: "Updated Mage" };
      const expectedResponse = {
        data: { id: 1, name: patch.name, created_at: "2024-03-02" },
      };
      mockSingle.mockResolvedValue(expectedResponse);

      const result = await cardService.updateHeroClass(1, patch);

      expect(
        (mockSupabase as unknown as { from: ReturnType<typeof vi.fn> }).from
      ).toHaveBeenCalledWith("hero_class");
      expect(mockUpdate).toHaveBeenCalledWith({
        ...patch,
        updated_at: expect.any(String),
      });
      expect(mockEq).toHaveBeenCalledWith("id", 1);
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });

    it("maps empty update result to RLS-style error", async () => {
      mockSingle.mockResolvedValue({ data: [], error: null });

      const result = await cardService.updateHeroClass(1, { name: "Updated Mage" });

      expect(result.error).toBeInstanceOf(PostgrestError);
      expect(result.error?.code).toBe("403");
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
      expect(mockInsert).toHaveBeenCalledWith([
        {
          name: tribe.name,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      ]);
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });
  });

  describe("updateTribe", () => {
    it("should update tribe name by id", async () => {
      const patch = { name: "Updated Beast" };
      const expectedResponse = {
        data: { id: 1, name: patch.name, created_at: "2024-03-02" },
      };
      mockSingle.mockResolvedValue(expectedResponse);

      const result = await cardService.updateTribe(1, patch);

      expect(
        (mockSupabase as unknown as { from: ReturnType<typeof vi.fn> }).from
      ).toHaveBeenCalledWith("tribe");
      expect(mockUpdate).toHaveBeenCalledWith({
        ...patch,
        updated_at: expect.any(String),
      });
      expect(mockEq).toHaveBeenCalledWith("id", 1);
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });

    it("maps empty update result to RLS-style error", async () => {
      mockSingle.mockResolvedValue({ data: [], error: null });

      const result = await cardService.updateTribe(1, { name: "Updated Beast" });

      expect(result.error).toBeInstanceOf(PostgrestError);
      expect(result.error?.code).toBe("403");
    });
  });

  describe("fetchSets", () => {
    it("should fetch sets ordered by name", async () => {
      const expectedResponse = { data: [{ id: 1, name: "Core" }] };
      mockOrder.mockResolvedValue(expectedResponse);

      const result = await cardService.fetchSets();

      expect(
        (mockSupabase as unknown as { from: ReturnType<typeof vi.fn> }).from
      ).toHaveBeenCalledWith("set");
      expect(mockSelect).toHaveBeenCalled();
      expect(mockOrder).toHaveBeenCalledWith("name");
      expect(result).toEqual(expectedResponse);
    });
  });

  describe("deleteSet", () => {
    it("should delete set by id", async () => {
      const expectedResponse = { data: { id: 1 } };
      mockEq.mockResolvedValue(expectedResponse);

      const result = await cardService.deleteSet(1);

      expect(
        (mockSupabase as unknown as { from: ReturnType<typeof vi.fn> }).from
      ).toHaveBeenCalledWith("set");
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith("id", 1);
      expect(result).toEqual(expectedResponse);
    });

    it("maps empty delete result to RLS-style error", async () => {
      mockEq.mockResolvedValue({ data: [], error: null });

      const result = await cardService.deleteSet(9);

      expect(result.error).toBeInstanceOf(PostgrestError);
      expect(result.error?.message).toContain("logged in");
    });
  });

  describe("addSet", () => {
    it("should insert name, is_standard, and release_date", async () => {
      const set: Set = {
        id: 1,
        name: "March",
        created_at: "2024-03-02",
        is_standard: true,
        release_date: "2022-12-06",
      };
      const expectedResponse = { data: set };
      mockSingle.mockResolvedValue(expectedResponse);

      const result = await cardService.addSet(set);

      expect(
        (mockSupabase as unknown as { from: ReturnType<typeof vi.fn> }).from
      ).toHaveBeenCalledWith("set");
      expect(mockInsert).toHaveBeenCalledWith([
        {
          name: set.name,
          is_standard: set.is_standard,
          release_date: set.release_date,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      ]);
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });

    it("maps empty insert result to RLS-style error", async () => {
      mockSingle.mockResolvedValue({ data: [], error: null });

      const set: Set = {
        id: 0,
        name: "X",
        created_at: "",
        is_standard: false,
        release_date: "2020-01-01",
      };

      const result = await cardService.addSet(set);

      expect(result.error).toBeInstanceOf(PostgrestError);
      expect(result.error?.code).toBe("403");
    });
  });

  describe("updateSet", () => {
    it("should update name, is_standard, and release_date by id", async () => {
      const patch = {
        name: "Updated Set",
        is_standard: false,
        release_date: "2024-10-10",
      };
      const expectedResponse = {
        data: {
          id: 2,
          name: patch.name,
          created_at: "2024-03-02",
          is_standard: patch.is_standard,
          release_date: patch.release_date,
        },
      };
      mockSingle.mockResolvedValue(expectedResponse);

      const result = await cardService.updateSet(2, patch);

      expect(
        (mockSupabase as unknown as { from: ReturnType<typeof vi.fn> }).from
      ).toHaveBeenCalledWith("set");
      expect(mockUpdate).toHaveBeenCalledWith({
        ...patch,
        updated_at: expect.any(String),
      });
      expect(mockEq).toHaveBeenCalledWith("id", 2);
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });

    it("maps empty update result to RLS-style error", async () => {
      mockSingle.mockResolvedValue({ data: [], error: null });

      const result = await cardService.updateSet(2, {
        name: "Updated Set",
        is_standard: true,
        release_date: "2024-10-10",
      });

      expect(result.error).toBeInstanceOf(PostgrestError);
      expect(result.error?.code).toBe("403");
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
