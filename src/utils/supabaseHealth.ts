import { supabase } from "@/lib/supabase";

export async function checkSupabaseConnection(): Promise<void> {
  const { error } = await supabase.auth.getSession();

  if (error) {
    console.error("Supabase connection failed:", error.message);
    return;
  }

  console.info("Supabase is connected and reachable.");
}
