import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || url === "https://your-project.supabase.co") {
    console.error("Supabase environment variables are missing or use placeholders. Did you restart your dev server after updating .env.local?");
  }

  return createBrowserClient(
    url!,
    anonKey!
  )
}
