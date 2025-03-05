import { supabase as supabaseImpl } from "../supabase/Client";
import { HeroClass } from "../dto/HeroClass";
import { Tribe } from "../dto/Tribe";

export class CardService {
  private supabase: typeof supabaseImpl;

  constructor(supabase: typeof supabaseImpl) {
    this.supabase = supabase;
  }

  async fetchHeroClasses() {
    return await this.supabase.from("hero_class").select().order("name");
  }

  async deleteHeroClass(id: number) {
    const response = await this.supabase
      .from("hero_class")
      .delete()
      .eq("id", id);

    // If no error but no rows affected, it means RLS blocked the operation
    if (!response.error && response.data?.length === 0) {
      return {
        ...response,
        error: {
          message: "You must be logged in to delete records",
          details: "",
          hint: "",
          code: "403",
        },
      };
    }
    return response;
  }

  async addHeroClass(heroClass: HeroClass) {
    const { name } = heroClass;
    return await this.supabase.from("hero_class").insert([{ name }]).single();
  }

  async fetchTribes() {
    return await this.supabase.from("tribe").select().order("name");
  }

  async deleteTribe(id: number) {
    const response = await this.supabase.from("tribe").delete().eq("id", id);

    // If no error but no rows affected, it means RLS blocked the operation
    if (!response.error && response.data?.length === 0) {
      return {
        ...response,
        error: {
          message: "You must be logged in to delete records",
          details: "",
          hint: "",
          code: "403",
        },
      };
    }
    return response;
  }

  async addTribe(tribe: Tribe) {
    const { name } = tribe;
    return await this.supabase.from("tribe").insert([{ name }]).single();
  }
}

export default new CardService(supabaseImpl);
