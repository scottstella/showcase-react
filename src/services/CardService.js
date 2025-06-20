import { supabase as supabaseImpl } from "../supabase/Client";
// Utility function to handle RLS blocked operations
const handleRLSError = response => {
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
};
export class CardService {
  constructor(supabase) {
    this.supabase = supabase;
  }
  async fetchHeroClasses() {
    return await this.supabase.from("hero_class").select().order("name");
  }
  async deleteHeroClass(id) {
    const response = await this.supabase.from("hero_class").delete().eq("id", id);
    return handleRLSError(response);
  }
  async addHeroClass(heroClass) {
    const { name } = heroClass;
    return await this.supabase.from("hero_class").insert([{ name }]).single();
  }
  async fetchTribes() {
    return await this.supabase.from("tribe").select().order("name");
  }
  async deleteTribe(id) {
    const response = await this.supabase.from("tribe").delete().eq("id", id);
    return handleRLSError(response);
  }
  async addTribe(tribe) {
    const { name } = tribe;
    return await this.supabase.from("tribe").insert([{ name }]).single();
  }
  async fetchSets() {
    return await this.supabase.from("set").select().order("name");
  }
  async deleteSet(id) {
    const response = await this.supabase.from("set").delete().eq("id", id);
    return handleRLSError(response);
  }
  async addSet(set) {
    const { name, is_standard, release_date } = set;
    return await this.supabase.from("set").insert([{ name, is_standard, release_date }]).single();
  }
}
export default new CardService(supabaseImpl);
