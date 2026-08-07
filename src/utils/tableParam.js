/**
 * Reads the table number from the URL a QR code pointed at, supporting
 * both shapes the printed table QR codes might use:
 *   /menu?table=12
 *   /menu/12
 *
 * Not used anywhere in the UI yet (Sprint 2 only prepares this — it'll
 * drive "call waiter" / "send order" in Sprint 3, so those requests can be
 * tagged with the right table without asking the person to type it in).
 *
 * Persisted to sessionStorage so it survives a refresh or an in-site
 * navigation for the rest of this visit, without following the person
 * around after they've left (sessionStorage clears when the tab closes —
 * intentional, since a new diner could pick up the same phone next visit).
 *
 * NOTE for deployment: static hosts need a SPA fallback rule so
 * `/menu/12` serves index.html instead of 404ing — e.g. on Netlify,
 * a `_redirects` file with `/menu/* /index.html 200`.
 */
const STORAGE_KEY = "lazdji_table";

export function getTableNumber() {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("table");
  if (fromQuery) {
    sessionStorage.setItem(STORAGE_KEY, fromQuery);
    return fromQuery;
  }

  const pathMatch = window.location.pathname.match(/\/menu\/(\d+)/);
  if (pathMatch) {
    sessionStorage.setItem(STORAGE_KEY, pathMatch[1]);
    return pathMatch[1];
  }

  return sessionStorage.getItem(STORAGE_KEY);
}
