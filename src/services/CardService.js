import { supabase } from "../supabase/Client";

export class CardService {
  async fetchHeroClasses() {
    return await supabase.from("hero_class").select();
  }

  async deleteHeroClass(id) {
    return await supabase.from("hero_class").delete().eq("id", id);
  }

  async addHeroClass(heroClass) {
    const name = heroClass.name;
    return await supabase.from("hero_class").insert([{ name }]).single();
  }
}

export default new CardService();
