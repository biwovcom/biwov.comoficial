import { createBrowserClient } from "@supabase/ssr";

/** Cliente de Supabase para Client Components (ej. el formulario de login). */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
