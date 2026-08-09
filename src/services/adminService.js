import { supabase } from "../lib/supabaseClient";
import imageCompression from "browser-image-compression";

/**
 * The write layer used only by the admin panel. Kept separate from
 * menuService.js (the public read layer) on purpose: they have different
 * auth requirements (these calls need an authenticated session — enforced
 * server-side by the RLS policies in supabase/migrations/0001_schema.sql,
 * not just by hiding the UI) and different callers.
 */

// ─── Categories ─────────────────────────────────────────────────────────

export async function createCategory(category) {
  const { data, error } = await supabase.from("categories").insert(category).select().single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id, patch) {
  const { data, error } = await supabase.from("categories").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

// ─── Dishes ─────────────────────────────────────────────────────────────

/**
 * `dish` may include a `portions` array (new/edited rows, each without an
 * `id` for new ones) — this function handles the dish row and its portions
 * as a single logical save, so the form doesn't have to orchestrate two
 * separate service calls and get the ordering wrong.
 */
export async function saveDish(dish) {
  const { portions, id, ...dishFields } = dish;

  let dishId = id;
  if (dishId) {
    const { error } = await supabase.from("dishes").update(dishFields).eq("id", dishId);
    if (error) throw error;
  } else {
    const { data, error } = await supabase.from("dishes").insert(dishFields).select().single();
    if (error) throw error;
    dishId = data.id;
  }

  if (portions) {
    await savePortions(dishId, portions);
  }

  return dishId;
}

export async function deleteDish(id) {
  // Portions cascade-delete automatically (see the FK in 0001_schema.sql).
  const { error } = await supabase.from("dishes").delete().eq("id", id);
  if (error) throw error;
}

// ─── Portions ───────────────────────────────────────────────────────────

/**
 * Replaces a dish's entire portion list with the given rows — simplest
 * correct way to handle "added one, removed one, edited one" from a form
 * without diffing. Fine at this scale (a handful of portions per dish).
 */
export async function savePortions(dishId, portions) {
  const { error: deleteError } = await supabase.from("portions").delete().eq("dish_id", dishId);
  if (deleteError) throw deleteError;

  const rows = portions
    .filter((p) => p.title_ru?.trim())
    .map(({ id, ...rest }) => ({ ...rest, dish_id: dishId }));

  if (rows.length) {
    const { error: insertError } = await supabase.from("portions").insert(rows);
    if (insertError) throw insertError;
  }
}

// ─── Storage (dish photos) ──────────────────────────────────────────────

const PHOTO_BUCKET = "dish-photos";

/**
 * Uploads a photo file and returns its public URL — ready to drop straight
 * into a dish's `photo` field.
 */
export async function uploadDishPhoto(file) {
  // 1. Сжимаем фото до ~400КБ перед отправкой (чтобы админка не лагала)
  const options = {
    maxSizeMB: 0.4,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
  };

  let fileToUpload = file;
  try {
    fileToUpload = await imageCompression(file, options);
  } catch (e) {
    console.warn("Не удалось сжать картинку, загружаем оригинал", e);
  }

  // 2. Загружаем в Supabase Storage
  const ext = fileToUpload.name?.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, fileToUpload, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}