export interface Set {
  id: number;
  name: string;
  created_at: string;
  updated_at?: string | null;
  is_standard: boolean;
  release_date: string;
}
