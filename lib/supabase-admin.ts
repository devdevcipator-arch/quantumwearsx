import { createClient, SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient;

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://ukyiqvuxqhzohaufnryr.supabase.co";

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVreWlxdnV4cWh6b2hhdWZucnlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5Mzg3OTc3OCwiZXhwIjoyMTA5NDU1Nzc4fQ.83cSMuFT0Nz28PKFgWpKWYZmn4kjrMsX_r_CIO7VRCw";

  adminClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return adminClient;
}

