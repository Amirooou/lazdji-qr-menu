import { useEffect, useState, useCallback } from "react";
import { getMenu, subscribeToMenuChanges } from "../services/menuService";

/**
 * The single point where UI meets the data layer. Components never import
 * src/services/menuService.js directly — they call this hook.
 *
 * Also subscribes to Supabase Realtime: any change to categories/dishes/
 * portions (from the admin panel, or another customer's device, or the
 * admin panel's own SQL editor) triggers a refetch here automatically —
 * this is what makes edits show up on the customer site with no manual
 * refresh.
 */
export function useMenu() {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    return getMenu()
      .then((result) => {
        setCategories(result.categories);
        setDishes(result.dishes);
        setError(null);
      })
      .catch((err) => setError(err));
  }, []);

  useEffect(() => {
    let cancelled = false;

    load().finally(() => {
      if (!cancelled) setLoading(false);
    });

    const unsubscribe = subscribeToMenuChanges(() => {
      load();
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [load]);

  return { categories, dishes, loading, error };
}
