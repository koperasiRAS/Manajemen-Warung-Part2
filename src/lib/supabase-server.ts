import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client for API routes
// Uses service role key (bypasses RLS) when available,
// otherwise falls back to anon key with forwarded auth header
export async function createServerSupabase(authHeader?: string | null) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // If we have a service role key, use it (bypasses RLS)
  if (serviceKey) {
    return createClient(url, serviceKey, {
      auth: { persistSession: false },
    });
  }

  // Fallback: use anon key + forwarded auth header
  return createClient(url, anonKey, {
    auth: { persistSession: false },
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  });
}
