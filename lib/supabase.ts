import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ukyiqvuxqhzohaufnryr.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVreWlxdnV4cWh6b2hhdWZucnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4Nzk3NzgsImV4cCI6MjEwOTQ1NTc3OH0.4DsnRiqaprBib1XwBEiDQu_Q1XBd6sTQEpluNJy5byc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

