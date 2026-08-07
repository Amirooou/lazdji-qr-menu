// Never throws on null/undefined/NaN — a dish priced per-portion has
// `price: null` in the database (see portions.js / the `dishes` table),
// and this needs to be safe to call before a caller has had a chance to
// substitute a portion price in.
export function fmtPrice(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " \u20B8";
}

// What a dish card should actually show: its flat price if it has one, or
// — for a dish priced per-portion instead (price is null; see dishes.js /
// the `dishes` table) — the cheapest portion, prefixed "от" ("from"), since
// there's no single "the" price to show. Centralised here rather than
// repeated at every call site that renders a dish price.
export function dishDisplayPrice(dish) {
  if (dish.price !== null && dish.price !== undefined) {
    return { value: dish.price, from: false };
  }
  if (dish.portions?.length) {
    const cheapest = Math.min(...dish.portions.map((p) => p.price));
    return { value: cheapest, from: true };
  }
  return { value: null, from: false };
}

// Premium gold tones for prices — deep antique gold on light surfaces
// (modals, which stay white/cream), warm metallic gold on dark surfaces
// (now the norm across the app — see theme.js for the single source of
// truth on that exact value).
import { GOLD } from "../theme";
export const GOLD_DARK = "#96742E";
export const GOLD_LIGHT = GOLD;
