import { describe, it, expect } from "vitest";
import { heroClassSchema, tribeSchema, setSchema } from "./index";

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
});
