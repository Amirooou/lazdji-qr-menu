import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { translations } from "../i18n/translations";
import { lineTotal as computeLineTotal } from "../utils/cartMath";
import { setDishAvailability } from "../services/menuService";
import { getTableNumber } from "../utils/tableParam";
import { getOrderMode } from "../utils/orderMode";

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [lang, setLang] = useState("ru");
  const [cart, setCart] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [toast, setToast] = useState(null);
  // Not consumed anywhere in the UI yet — prepares the plumbing for
  // "call waiter" / "send order" (see utils/tableParam.js).
  const [tableNumber] = useState(() => getTableNumber());
  // "in-house" (guest scanned the table QR — cart disabled, order via
  // calling staff) or "delivery" (cart works normally, checks out via
  // WhatsApp). See utils/orderMode.js for how this is detected.
  const [orderMode] = useState(() => getOrderMode());

  const t = useCallback(
    (key) => {
      let v = translations[lang];
      for (const k of key.split(".")) v = v?.[k];
      return v || key;
    },
    [lang]
  );

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  // Availability now lives entirely in Supabase (`dishes.available`) and
  // arrives here already correct via useMenu()'s realtime subscription —
  // no local override bookkeeping needed, which also means two staff
  // members (or the admin panel and this quick gesture) can never disagree
  // about a dish's state for longer than the realtime round-trip.
  const isAvailable = useCallback((dish) => dish.available, []);

  const toggleAvailability = useCallback(
    (dish) => {
      setDishAvailability(dish.id, !dish.available).catch(() => {
        showToast(t("updateFailed"));
      });
    },
    [showToast, t]
  );

  const addToCart = useCallback((dish, qty = 1, portionIdx = 0, spice = 0, selectedExtras = [], notes = "") => {
    setCart((prev) => {
      const key = `${dish.id}-${portionIdx}-${spice}-${[...selectedExtras].sort().join(",")}`;
      const existing = prev.find((c) => c.key === key);
      if (existing) {
        return prev.map((c) => (c.key === key ? { ...c, qty: c.qty + qty } : c));
      }
      return [...prev, { key, item: dish, qty, portionIdx, spice, selectedExtras, notes }];
    });
  }, []);

  const removeFromCart = useCallback((key) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.key === key);
      if (existing && existing.qty > 1) {
        return prev.map((c) => (c.key === key ? { ...c, qty: c.qty - 1 } : c));
      }
      return prev.filter((c) => c.key !== key);
    });
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // A single place to compute "what does this cart line actually cost" —
  // used by both the running total below and anywhere a line needs its own
  // price (cart sheet, the WhatsApp order text), so that logic never
  // drifts out of sync. The actual formula lives in utils/cartMath.js so
  // generateWhatsAppText() can use the exact same pricing without going
  // through context.
  const lineTotal = useCallback((line) => computeLineTotal(line), []);

  const cartTotal = useMemo(() => cart.reduce((sum, line) => sum + lineTotal(line), 0), [cart, lineTotal]);
  const cartCount = useMemo(() => cart.reduce((s, c) => s + c.qty, 0), [cart]);

  const value = {
    lang, setLang, t,
    cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount, lineTotal,
    isAvailable, toggleAvailability,
    admin, setAdmin,
    toast, showToast,
    tableNumber, orderMode,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useApp = () => useContext(Ctx);
