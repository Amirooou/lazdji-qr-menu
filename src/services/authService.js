import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

/**
 * Thin wrapper around Supabase Auth. There's no self-serve sign-up screen
 * on purpose — staff accounts are created by you (the restaurant owner or
 * developer) once, from the Supabase dashboard (Authentication → Users →
 * Add user) or via `supabase.auth.admin.createUser` from a trusted
 * environment. The admin panel only needs to sign existing staff in.
 */

function requireSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Copy .env.example to .env, add your project's " +
        "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart the dev server."
    );
  }
}

export async function signIn(email, password) {
  requireSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

export async function signOut() {
  requireSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

/** Returns an unsubscribe function. */
export function onAuthStateChange(callback) {
  if (!isSupabaseConfigured) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}
