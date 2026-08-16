import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Use this inside Server Components, Server Actions, and Route
// Handlers — e.g. app/page.js, app/tours/[id]/page.js — anywhere
// data is fetched on the server before HTML is sent to the browser.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll was called from a Server Component — safe to
            // ignore if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}
