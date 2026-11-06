const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

/**
 * Mode démonstration : activé automatiquement lorsque les variables Supabase
 * sont absentes. Les données sont alors persistées localement dans
 * `data/demo-db.json` (serveur uniquement). Dès que Supabase est configuré,
 * l'application bascule sur PostgreSQL + Supabase Auth sans changement de code.
 */
export const isDemoMode = !supabaseUrl || !supabaseAnonKey;

export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
} as const;

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const DEMO_EMAIL = "demo@devforge.app";
export const DEMO_PASSWORD = "devforge2026";

export const APP_NAME = "DEVFORGE";
export const APP_TAGLINE =
  "La régularité forge l'expertise technique. Un problème résolu par jour.";
