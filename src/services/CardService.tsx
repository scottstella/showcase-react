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
    return await this.supabase.from("hero_class").delete().eq("id", id);
  }

  async addHeroClass(heroClass: HeroClass) {
    const { name } = heroClass;
    return await this.supabase.from("hero_class").insert([{ name }]).single();
  }

  async fetchTribes() {
    return await this.supabase.from("tribe").select().order("name");
  }

  async deleteTribe(id: number) {
    return await this.supabase.from("tribe").delete().eq("id", id);
  }

  async addTribe(tribe: Tribe) {
    const { name } = tribe;
    return await this.supabase.from("tribe").insert([{ name }]).single();
  }
}

export default new CardService(supabaseImpl);
