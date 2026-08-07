/**
 * Splits the app into two scenarios that need genuinely different cart
 * behaviour:
 *
 *   "in-house" — a guest scanned the table's QR code. The cart is disabled
 *                entirely; ordering happens by calling staff over.
 *   "delivery" — someone found the site on its own (lazdji.kz, a shared
 *                link, etc). The cart works normally and checks out via
 *                WhatsApp.
 *
 * Detected from the URL, the same way utils/tableParam.js already detects
 * the table number: `?table=5`, `?qr=true`, or the `/menu/5` path shape.
 * Persisted to sessionStorage so a guest who navigates within the site
 * stays in "in-house" mode for the rest of the visit even if a later URL
 * doesn't repeat the query param.
 */
const MODE_STORAGE_KEY = "lazdji_order_mode";

export function getOrderMode() {
  if (typeof window === "undefined") return "delivery";

  const params = new URLSearchParams(window.location.search);
  const isInHouse =
    params.has("table") ||
    params.get("qr") === "true" ||
    /\/menu\/\d+/.test(window.location.pathname);

  if (isInHouse) {
    sessionStorage.setItem(MODE_STORAGE_KEY, "in-house");
    return "in-house";
  }

  return sessionStorage.getItem(MODE_STORAGE_KEY) || "delivery";
}
