import { PostgrestError } from "@supabase/supabase-js";
import { supabase as supabaseImpl } from "../supabase/Client";
import { HeroClass } from "../dto/HeroClass";
import { Tribe } from "../dto/Tribe";
import { Set } from "../dto/Set";
import type { Card, CardUpsertPayload } from "../dto/Card";

// Utility function to handle RLS blocked operations
const handleRLSError = <T extends { error: PostgrestError | null; data?: unknown }>(
  response: T
): T => {
  // If no error but no rows affected, it means RLS blocked the operation
  if (!response.error && Array.isArray(response.data) && response.data.length === 0) {
    return {
      ...response,
      error: new PostgrestError({
        message: "You must be logged in to delete records",
        details: "",
        hint: "",
        code: "403",
      }),
    };
  }
  return response;
};

export class CardService {
  private supabase: typeof supabaseImpl;

  public static readonly CARD_IMAGE_BUCKET = "card-images";

  constructor(supabase: typeof supabaseImpl) {
    this.supabase = supabase;
  }

  private cardSelectQuery() {
    // card_related_card references card twice (card_id + related_card_id) — PostgREST needs the FK hint (PGRST201).
    return `
      *,
      set:set_id ( id, name ),
      hero_class:hero_class_id ( id, name ),
      race_tribe:race_tribe_id ( id, name ),
      card_mechanic_map ( mechanic ),
      card_keyword ( keyword ),
      card_related_card!card_related_card_card_id_fkey ( related_card_id )
    `;
  }

  async fetchCards() {
    return await this.supabase.from("card").select(this.cardSelectQuery()).order("name");
  }

  async deleteCard(id: string) {
    const response = await this.supabase.from("card").delete().eq("id", id).select("id");
    return handleRLSError(response);
  }

  /** Safe object key segment from card slug (hyphens allowed). */
  private static slugForStorageKey(slug: string): string {
    const trimmed = slug
      .trim()
      .replace(/[^a-zA-Z0-9_.-]+/g, "_")
      .replace(/_+/g, "_");
    const collapsed = trimmed.replace(/^_|_$/g, "");
    return collapsed || "card";
  }

  private static extensionFromFile(file: File): string {
    const match = /\.([a-zA-Z0-9]+)$/.exec(file.name);
    if (match) return match[1].toLowerCase();
    if (file.type === "image/png") return "png";
    if (file.type === "image/jpeg" || file.type === "image/jpg") return "jpg";
    if (file.type === "image/webp") return "webp";
    if (file.type === "image/gif") return "gif";
    if (file.type === "image/svg+xml") return "svg";
    return "img";
  }

  async uploadCardImage(cardId: string, slug: string, file: File) {
    if (!file.size) {
      return {
        data: null,
        error: new Error("Image file is empty"),
      };
    }

    const base = CardService.slugForStorageKey(slug);
    const ext = CardService.extensionFromFile(file);
    const objectPath = `${cardId}/${base}.${ext}`;
    const contentType = file.type || "application/octet-stream";

    const upload = await this.supabase.storage
      .from(CardService.CARD_IMAGE_BUCKET)
      .upload(objectPath, file, {
        upsert: true,
        contentType,
        cacheControl: "3600",
      });

    if (upload.error) {
      return upload;
    }

    if (!upload.data?.path) {
      return {
        data: null,
        error: new Error("Storage upload returned no path"),
      };
    }

    const storedPath = upload.data.path;
    const { data } = this.supabase.storage
      .from(CardService.CARD_IMAGE_BUCKET)
      .getPublicUrl(storedPath);
    return {
      data: { publicUrl: data.publicUrl, path: storedPath },
      error: null,
    };
  }

  async addCard(payload: CardUpsertPayload, imageFile?: File | null) {
    const { mechanics, keywords, related_card_ids, ...cardRow } = payload;

    const insertResponse = await this.supabase.from("card").insert([cardRow]).select().single();
    const insertHandled = handleRLSError(insertResponse) as {
      data: Card | null;
      error: PostgrestError | null;
    };
    if (insertHandled.error || !insertHandled.data) {
      return insertHandled;
    }

    const created = insertHandled.data;
    const cardId = created.id;

    const childError = await this.replaceCardChildren(
      cardId,
      mechanics,
      keywords,
      related_card_ids
    );
    if (childError) {
      await this.supabase.from("card").delete().eq("id", cardId);
      return { data: null, error: childError };
    }

    if (imageFile) {
      const uploadResult = await this.uploadCardImage(cardId, created.slug, imageFile);
      if (uploadResult.error) {
        await this.supabase.from("card").delete().eq("id", cardId);
        return { data: null, error: uploadResult.error };
      }

      const publicUrl = (uploadResult.data as { publicUrl: string }).publicUrl;
      const path = (uploadResult.data as { path: string }).path;

      const updateImage = await this.supabase
        .from("card")
        .update({ image_url: publicUrl, image_path: path, updated_at: new Date().toISOString() })
        .eq("id", cardId)
        .select()
        .single();

      const updateHandled = handleRLSError(updateImage);
      if (updateHandled.error) {
        await this.supabase.from("card").delete().eq("id", cardId);
        return { data: null, error: updateHandled.error };
      }

      return updateHandled;
    }

    return insertHandled;
  }

  async updateCard(id: string, patch: CardUpsertPayload, imageFile?: File | null) {
    const { mechanics, keywords, related_card_ids, ...cardRow } = patch;

    const updateResponse = await this.supabase
      .from("card")
      .update({
        ...cardRow,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    const updateHandled = handleRLSError(updateResponse);
    if (updateHandled.error) {
      return updateHandled;
    }

    const childError = await this.replaceCardChildren(id, mechanics, keywords, related_card_ids);
    if (childError) {
      return { data: null, error: childError };
    }

    if (imageFile) {
      const uploadResult = await this.uploadCardImage(id, cardRow.slug, imageFile);
      if (uploadResult.error) {
        return { data: null, error: uploadResult.error };
      }

      const publicUrl = (uploadResult.data as { publicUrl: string }).publicUrl;
      const path = (uploadResult.data as { path: string }).path;

      const updateImage = await this.supabase
        .from("card")
        .update({ image_url: publicUrl, image_path: path, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      return handleRLSError(updateImage);
    }

    return updateHandled;
  }

  private async replaceCardChildren(
    cardId: string,
    mechanics: CardUpsertPayload["mechanics"],
    keywords: CardUpsertPayload["keywords"],
    related_card_ids: CardUpsertPayload["related_card_ids"]
  ): Promise<PostgrestError | null> {
    const { error: delMechErr } = await this.supabase
      .from("card_mechanic_map")
      .delete()
      .eq("card_id", cardId);
    if (delMechErr) return delMechErr;

    if (mechanics.length > 0) {
      const rows = mechanics.map(mechanic => ({ card_id: cardId, mechanic }));
      const { error } = await this.supabase.from("card_mechanic_map").insert(rows);
      if (error) return error;
    }

    const { error: delKwErr } = await this.supabase
      .from("card_keyword")
      .delete()
      .eq("card_id", cardId);
    if (delKwErr) return delKwErr;

    if (keywords.length > 0) {
      const rows = keywords.map(keyword => ({ card_id: cardId, keyword }));
      const { error } = await this.supabase.from("card_keyword").insert(rows);
      if (error) return error;
    }

    const { error: delRelErr } = await this.supabase
      .from("card_related_card")
      .delete()
      .eq("card_id", cardId);
    if (delRelErr) return delRelErr;

    if (related_card_ids.length > 0) {
      const rows = related_card_ids.map(related_card_id => ({ card_id: cardId, related_card_id }));
      const { error } = await this.supabase.from("card_related_card").insert(rows);
      if (error) return error;
    }

    return null;
  }

  async fetchHeroClasses() {
    return await this.supabase.from("hero_class").select().order("name");
  }

  async deleteHeroClass(id: number) {
    const response = await this.supabase.from("hero_class").delete().eq("id", id).select("id");
    return handleRLSError(response);
  }

  async addHeroClass(heroClass: HeroClass) {
    const { name } = heroClass;
    const now = new Date().toISOString();
    const response = await this.supabase
      .from("hero_class")
      .insert([{ name, created_at: now, updated_at: now }])
      .single();
    return handleRLSError(response);
  }

  async updateHeroClass(id: number, patch: Pick<HeroClass, "name">) {
    const response = await this.supabase
      .from("hero_class")
      .update({
        ...patch,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .single();
    return handleRLSError(response);
  }

  async fetchTribes() {
    return await this.supabase.from("tribe").select().order("name");
  }

  async deleteTribe(id: number) {
    const response = await this.supabase.from("tribe").delete().eq("id", id).select("id");
    return handleRLSError(response);
  }

  async addTribe(tribe: Tribe) {
    const { name } = tribe;
    const now = new Date().toISOString();
    const response = await this.supabase
      .from("tribe")
      .insert([{ name, created_at: now, updated_at: now }])
      .single();
    return handleRLSError(response);
  }

  async updateTribe(id: number, patch: Pick<Tribe, "name">) {
    const response = await this.supabase
      .from("tribe")
      .update({
        ...patch,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .single();
    return handleRLSError(response);
  }

  async fetchSets() {
    return await this.supabase.from("set").select().order("name");
  }

  async deleteSet(id: number) {
    const response = await this.supabase.from("set").delete().eq("id", id).select("id");
    return handleRLSError(response);
  }

  async addSet(set: Set) {
    const { name, is_standard, release_date } = set;
    const now = new Date().toISOString();
    const response = await this.supabase
      .from("set")
      .insert([{ name, is_standard, release_date, created_at: now, updated_at: now }])
      .single();
    return handleRLSError(response);
  }

  async updateSet(id: number, setPatch: Pick<Set, "name" | "is_standard" | "release_date">) {
    const { name, is_standard, release_date } = setPatch;
    const response = await this.supabase
      .from("set")
      .update({
        name,
        is_standard,
        release_date,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .single();
    return handleRLSError(response);
  }
}

export default new CardService(supabaseImpl);
