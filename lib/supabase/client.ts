import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || url === "https://your-project.supabase.co") {
    console.warn("Supabase environment variables are missing or use placeholders. This is expected during a Vercel build if not yet configured.");
    
    // Return a placeholder client during build to prevent crashing
    if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'test') {
      return createBrowserClient(
        url || "https://placeholder.supabase.co",
        anonKey || "placeholder-key"
      )
    }
  }

  return createBrowserClient(
    url!,
    anonKey!
  )
}
