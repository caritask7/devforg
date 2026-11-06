import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseConfig } from "@/lib/config";

/**
 * Client Supabase côté serveur (Server Components, Server Actions, Route
 * Handlers). Les cookies de session sont gérés par @supabase/ssr.
 *
 * La clé Service Role n'est jamais utilisée ici : toutes les requêtes sont
 * soumises aux politiques Row Level Security de PostgreSQL.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Les Server Components ne peuvent pas écrire de cookies.
          // Le rafraîchissement est assuré par src/proxy.ts.
        }
      },
    },
  });
}
