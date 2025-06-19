import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
const validateEnvironmentVariables = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  // Validate URL format
  try {
    new URL(supabaseUrl);
  } catch {
    throw new Error("Invalid Supabase URL format");
  }

  // Validate that the URL is a Supabase URL
  if (!supabaseUrl.includes("supabase.co")) {
    throw new Error("Invalid Supabase URL - must be a supabase.co domain");
  }

  // Validate anon key format (should be a long string)
  if (typeof supabaseAnonKey !== "string" || supabaseAnonKey.length < 50) {
    throw new Error("Invalid Supabase anon key format");
  }
};

validateEnvironmentVariables();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for auth
export const signIn = async () => {
  return await supabase.auth.signIn(
    {
      provider: "github",
    },
    {
      redirectTo: `${window.location.origin}/`,
    }
  );
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const user = supabase.auth.user();
  return user;
};
