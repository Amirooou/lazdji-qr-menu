import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Whether real credentials are present. Checked explicitly (rather than
 * just letting `createClient` throw) because that throw happens the
 * instant this module is imported — before React even mounts — which
 * takes down the *entire* app with a blank page and a console-only error.
 * Anyone who clones the repo and runs `npm run dev` without having copied
 * `.env.example` to `.env` yet hits this immediately; it should fail
 * loudly in the UI, not fail silently by crashing the whole bundle.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured) {
  console.error(
    "Missing Supabase env vars. Copy .env.example to .env and fill in " +
      "VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY from your Supabase project settings, " +
      "then restart the dev server."
  );
}

// `null` when not configured — every caller (menuService.js, authService.js)
// checks `isSupabaseConfigured` first and throws a clear, catchable error
// instead of calling methods on `null`.
export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;
