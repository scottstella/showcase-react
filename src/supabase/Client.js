import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://hasmzeqltdnshibkgbuj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhc216ZXFsdGRuc2hpYmtnYnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTkyMTA4MTMsImV4cCI6MTk3NDc4NjgxM30.NKKEAnQPNeoohL6bjtfMlzlKbh_b-ewF3wosEI1-1rk"
);
