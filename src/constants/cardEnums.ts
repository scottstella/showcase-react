export const CARD_TYPES = ["MINION", "SPELL", "WEAPON", "HERO", "LOCATION"] as const;
export type CardType = (typeof CARD_TYPES)[number];

export const RARITIES = ["COMMON", "RARE", "EPIC", "LEGENDARY"] as const;
export type Rarity = (typeof RARITIES)[number];

export const SPELL_SCHOOLS = [
  "ARCANE",
  "FEL",
  "FIRE",
  "FROST",
  "HOLY",
  "NATURE",
  "SHADOW",
] as const;
export type SpellSchool = (typeof SPELL_SCHOOLS)[number];

export const MECHANICS = [
  "TAUNT",
  "DIVINE_SHIELD",
  "BATTLECRY",
  "DEATHRATTLE",
  "RUSH",
  "WINDFURY",
  "LIFESTEAL",
  "POISONOUS",
  "REBORN",
  "STEALTH",
  "IMMUNE",
  "ELUSIVE",
  "MEGA_WINDFURY",
  "OVERLOAD",
  "SECRET",
  "COMBO",
  "INSPIRE",
  "JADE_GOLEM",
  "ECHO",
  "MAGNETIC",
  "OUTCAST",
  "SPELL_DAMAGE",
  "FREEZE",
  "SILENCE",
  "DISCOVER",
] as const;
export type Mechanic = (typeof MECHANICS)[number];
