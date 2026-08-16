import { createBrowserClient } from '@supabase/ssr';

// Use this inside Client Components ('use client' files) —
// e.g. login/signup forms, the chat page, the checkout page.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
