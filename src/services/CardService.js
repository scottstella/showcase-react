import { supabase as supabaseImpl } from "../supabase/Client";

export class CardService {
  constructor(supabase) {
    this.supabase = supabase;
  }
  async fetchHeroClasses() {
    return await this.supabase.from("hero_class").select().order("name");
  }

  async deleteHeroClass(id) {
    return await this.supabase.from("hero_class").delete().eq("id", id);
  }

  async addHeroClass(heroClass) {
    const name = heroClass.name;
    return await this.supabase.from("hero_class").insert([{ name }]).single();
  }
}

export default new CardService(supabaseImpl);
