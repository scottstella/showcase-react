import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://hasmzeqltdnshibkgbuj.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhc216ZXFsdGRuc2hpYmtnYnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTkyMTA4MTMsImV4cCI6MTk3NDc4NjgxM30.NKKEAnQPNeoohL6bjtfMlzlKbh_b-ewF3wosEI1-1rk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for auth
export const signIn = async () => {
  return await supabase.auth.signIn({
    provider: "github",
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const user = supabase.auth.user();
  return user;
};
