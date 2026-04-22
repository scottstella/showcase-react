import type { CardType, Mechanic, Rarity, SpellSchool } from "../constants/cardEnums";

export interface CardSetRef {
  id: number;
  name: string;
}

export interface CardHeroClassRef {
  id: number;
  name: string;
}

export interface CardTribeRef {
  id: number;
  name: string;
}

export interface CardMechanicRow {
  mechanic: Mechanic;
}

export interface CardKeywordRow {
  keyword: string;
}

export interface CardRelatedRow {
  related_card_id: string;
}

export interface Card {
  id: string;
  name: string;
  slug: string;
  flavor_text: string | null;

  card_type: CardType;
  rarity: Rarity;
  spell_school: SpellSchool | null;

  set_id: number;
  hero_class_id: number;
  race_tribe_id: number | null;

  mana_cost: number;
  attack: number | null;
  health: number | null;
  durability: number | null;

  text: string;

  is_collectible: boolean;
  is_token: boolean;

  image_url: string | null;
  image_path: string | null;

  created_at: string;
  updated_at: string;

  set?: CardSetRef | null;
  hero_class?: CardHeroClassRef | null;
  race_tribe?: CardTribeRef | null;

  card_mechanic_map?: CardMechanicRow[] | null;
  card_keyword?: CardKeywordRow[] | null;
  card_related_card?: CardRelatedRow[] | null;
}

export interface CardUpsertPayload {
  name: string;
  slug: string;
  flavor_text?: string | null;

  card_type: CardType;
  rarity: Rarity;
  spell_school?: SpellSchool | null;

  set_id: number;
  hero_class_id: number;
  race_tribe_id?: number | null;

  mana_cost: number;
  attack?: number | null;
  health?: number | null;
  durability?: number | null;

  text: string;

  is_collectible: boolean;
  is_token: boolean;

  image_url?: string | null;
  image_path?: string | null;

  mechanics: Mechanic[];
  keywords: string[];
  related_card_ids: string[];
}
