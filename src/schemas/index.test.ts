import { describe, it, expect } from "vitest";
import { heroClassSchema, tribeSchema, setSchema, cardSchema } from "./index";
import { MECHANICS } from "../constants/cardEnums";

function emptyMechanicsRecord(): Record<string, boolean> {
  return MECHANICS.reduce<Record<string, boolean>>((acc, m) => {
    acc[m] = false;
    return acc;
  }, {});
}

describe("yup schemas", () => {
  describe("heroClassSchema", () => {
    it("accepts a valid name", async () => {
      await expect(heroClassSchema.validate({ name: "Mage" })).resolves.toEqual({ name: "Mage" });
    });

    it("rejects empty name", async () => {
      await expect(heroClassSchema.validate({ name: "" })).rejects.toThrow(/required/i);
    });
  });

  describe("tribeSchema", () => {
    it("accepts a valid name", async () => {
      await expect(tribeSchema.validate({ name: "Murloc" })).resolves.toEqual({ name: "Murloc" });
    });

    it("rejects missing name", async () => {
      await expect(tribeSchema.validate({ name: "" })).rejects.toThrow();
    });
  });

  describe("setSchema", () => {
    it("accepts valid set fields", async () => {
      const values = {
        name: "March of the Lich King",
        is_standard: true,
        release_date: new Date("2022-12-06"),
      };
      await expect(setSchema.validate(values)).resolves.toMatchObject({
        name: "March of the Lich King",
        is_standard: true,
      });
    });

    it("rejects missing name", async () => {
      await expect(
        setSchema.validate({
          name: "",
          is_standard: false,
          release_date: new Date(),
        })
      ).rejects.toThrow();
    });
  });

  describe("cardSchema", () => {
    const baseCard = {
      name: "Test",
      slug: "test",
      flavor_text: "",
      rarity: "COMMON",
      set_id: 1,
      hero_class_id: 1,
      race_tribe_id: undefined as number | undefined,
      mana_cost: 1,
      attack: 1,
      health: 1,
      durability: undefined as number | undefined,
      text: "x",
      is_collectible: true,
      is_token: false,
      mechanics: emptyMechanicsRecord(),
    };

    it("allows empty spell school for spells", async () => {
      await expect(
        cardSchema.validate({
          ...baseCard,
          card_type: "SPELL",
          spell_school: "",
          attack: undefined,
          health: undefined,
          durability: undefined,
        })
      ).resolves.toMatchObject({ card_type: "SPELL", spell_school: "" });
    });

    it("rejects spell school on minions", async () => {
      await expect(
        cardSchema.validate({
          ...baseCard,
          card_type: "MINION",
          spell_school: "FIRE",
        })
      ).rejects.toThrow(/spell school applies only to spells/i);
    });
  });
});
