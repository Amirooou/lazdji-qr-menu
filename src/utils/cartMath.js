import { extras } from "../data/extras";

/**
 * The one place that knows how to price a cart line — used by AppContext
 * (the running total, the cart sheet's per-line price) and by
 * utils/whatsapp.js (the order text), so the formula can't drift out of
 * sync between what the guest sees and what gets sent to the restaurant.
 */

export function lineBasePrice(line) {
  return line.item.portions?.length ? line.item.portions[line.portionIdx].price : line.item.price;
}

export function lineExtrasPrice(line) {
  return line.selectedExtras.reduce(
    (sum, extraId) => sum + (extras.find((e) => e.id === extraId)?.price || 0),
    0
  );
}

/** Price of one unit of this line (base + extras), before quantity. */
export function lineUnitPrice(line) {
  return lineBasePrice(line) + lineExtrasPrice(line);
}

/** Full price of this line — unit price × quantity. */
export function lineTotal(line) {
  return lineUnitPrice(line) * line.qty;
}
