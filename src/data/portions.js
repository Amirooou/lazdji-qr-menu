/**
 * Mirrors the future `portions` table:
 *   id       text/uuid primary key
 *   dish_id  text/uuid  -> FK -> dishes.id
 *   title    text       -> split into title_ru / title_kz (bilingual menu)
 *   price    numeric
 *
 * `serves` (how many people a portion feeds) isn't in the base spec, but the
 * already-approved featured-dish card displays it ("На 3–4 человека"), so
 * it's kept here as a pragmatic extra column rather than dropped.
 *
 * Only dishes priced by portion (dishes.price === null) have rows here.
 */
export const portions = [
  { id: "sig-1-full", dish_id: "sig-1", title_ru: "1 порция — 2 кг", title_kz: "1 порция — 2 кг", price: 13990, serves: "3–4" },
  { id: "sig-1-half", dish_id: "sig-1", title_ru: "0.7 порции — 1 кг", title_kz: "0.7 порция — 1 кг", price: 10990, serves: "1–2" },
];
