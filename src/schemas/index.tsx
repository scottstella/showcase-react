import * as yup from "yup";
import { CARD_TYPES, MECHANICS, RARITIES, SPELL_SCHOOLS } from "../constants/cardEnums";

export const heroClassSchema = yup.object({
  name: yup.string().trim().required("Name is required"),
});

export const tribeSchema = yup.object({
  name: yup.string().trim().required("Name is required"),
});

export const setSchema = yup.object({
  name: yup.string().trim().required("Name is required"),
  is_standard: yup.boolean().required("Standard set status is required"),
  release_date: yup.date().required("Release date is required"),
});

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const mechanicsFieldShape = MECHANICS.reduce<Record<string, yup.BooleanSchema>>((acc, mechanic) => {
  acc[mechanic] = yup.boolean().required();
  return acc;
}, {});

export const cardSchema = yup
  .object({
    name: yup.string().trim().required("Name is required"),
    slug: yup
      .string()
      .trim()
      .required("Slug is required")
      .matches(slugRegex, "Slug must be URL-friendly (lowercase letters, numbers, hyphens)"),
    flavor_text: yup.string().trim().nullable().optional(),

    card_type: yup
      .string()
      .oneOf([...CARD_TYPES], "Card type is required")
      .required("Card type is required"),
    rarity: yup
      .string()
      .oneOf([...RARITIES], "Rarity is required")
      .required("Rarity is required"),
    spell_school: yup
      .string()
      .oneOf([...SPELL_SCHOOLS])
      .nullable()
      .optional(),

    set_id: yup.number().integer().required("Set is required"),
    hero_class_id: yup.number().integer().required("Class is required"),
    race_tribe_id: yup.number().integer().nullable().optional(),

    mana_cost: yup.number().integer().min(0).required("Mana cost is required"),
    attack: yup.number().integer().min(0).nullable().optional(),
    health: yup.number().integer().min(0).nullable().optional(),
    durability: yup.number().integer().min(0).nullable().optional(),

    text: yup.string().required("Card text is required"),

    is_collectible: yup.boolean().required(),
    is_token: yup.boolean().required(),

    artist: yup.string().trim().nullable().optional(),

    // Form state uses a checkbox map; keywords / related IDs are validated when building the payload.
    mechanics: yup.object(mechanicsFieldShape).required(),
  })
  .test("minion-stats", "Minions require attack and health", values => {
    if (!values || values.card_type !== "MINION") return true;
    return values.attack != null && values.health != null;
  })
  .test("weapon-stats", "Weapons require attack and durability", values => {
    if (!values || values.card_type !== "WEAPON") return true;
    return values.attack != null && values.durability != null;
  })
  .test("hero-stats", "Heroes require attack and health", values => {
    if (!values || values.card_type !== "HERO") return true;
    return values.attack != null && values.health != null;
  })
  .test("spell-stats", "Spells must not have attack/health/durability", values => {
    if (!values || values.card_type !== "SPELL") return true;
    return values.attack == null && values.health == null && values.durability == null;
  })
  .test("location-stats", "Locations must not have attack/health/durability", values => {
    if (!values || values.card_type !== "LOCATION") return true;
    return values.attack == null && values.health == null && values.durability == null;
  });
