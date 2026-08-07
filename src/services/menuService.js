import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

/**
 * The customer-facing read layer. Every consumer (the useMenu() hook, and
 * by extension every menu component) goes through here — never straight to
 * `supabase` — so the data-fetching strategy can change in one place.
 */

function requireSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Copy .env.example to .env, add your project's " +
        "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart the dev server."
    );
  }
}

export async function getCategories() {
  requireSupabase();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("order", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getDishesWithPortions() {
  requireSupabase();
  const { data, error } = await supabase
    .from("dishes")
    .select("*, portions(*)")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getMenu() {
  const [categories, dishes] = await Promise.all([
    getCategories(),
    getDishesWithPortions(),
  ]);
  return { categories, dishes };
}

/**
 * Flip a dish's stop-list state. Used by the quick long-press admin gesture
 * on the customer site itself (for "86 this dish" in the moment, without
 * opening the full admin panel) as well as the admin panel's own toggle.
 */
export async function setDishAvailability(dishId, available) {
  requireSupabase();
  const { error } = await supabase.from("dishes").update({ available }).eq("id", dishId);
  if (error) throw error;
  return { id: dishId, available };
}

/**
 * Subscribes to every change on the three menu tables and calls `onChange`
 * (no arguments — callers just refetch) whenever any of them fire.
 */
export function subscribeToMenuChanges(onChange) {
  if (!isSupabaseConfigured) return () => {};

  // Динамический ID канала предотвращает конфликт подписок в React StrictMode
  const channelId = `menu-changes-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  const channel = supabase
    .channel(channelId)
    .on("postgres_changes", { event: "*", schema: "public", table: "dishes" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "portions" }, onChange)
    .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, onChange)
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}