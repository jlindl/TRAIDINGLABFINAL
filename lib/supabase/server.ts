import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return createServerClient(
        "https://placeholder.supabase.co",
        "placeholder-key",
        {
          cookies: {
            getAll() { return [] },
            setAll() {}
          }
        }
      )
    }
    throw new Error("Missing Supabase environment variables");
  }

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Standard behavior is to use persistent cookies (stored for 1 year).
              // We're overriding that here to ensure authentication is "Session-Only."
              // By removing maxAge and expires, the cookie will be deleted when the browser is closed.
              const sessionOptions = { ...options };
              delete sessionOptions.maxAge;
              delete (sessionOptions as any).expires;
              
              cookieStore.set(name, value, sessionOptions);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  )
}
