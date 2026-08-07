import { forwardRef, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import CategoryIcon from "./CategoryIcon";
import { GOLD, GOLD_DIM, DARK_LEATHER_DEEP } from "../theme";

// forwardRef so App.jsx can measure this element's own height directly —
// crucial detail: we must NOT wrap this in an extra plain <div> just for
// measuring, because that div would become this element's sticky
// "containing block". If that wrapper is only as tall as the bar itself,
// the bar can only stay stuck for a few dozen pixels of scroll before CSS
// forces it to un-stick (sticky elements can never stick past the bottom
// of their own containing block). Attaching the ref straight to the real
// sticky element means its containing block stays whatever large scrolling
// container it's actually placed in (the whole menu), so it sticks
// properly for the entire scroll, not just the first ~50px of it.
const CategoryBar = forwardRef(function CategoryBar({ categories, active, onSelect }, ref) {
  const { lang } = useApp();
  const scrollerRef = useRef(null);

  // Scroll the active pill into view WITHIN this horizontal strip only.
  // Deliberately not using scrollIntoView() here: it can walk up through
  // multiple scrollable ancestors (including the page itself), and since
  // `active` updates continuously while the person scrolls the menu,
  // that was fighting the page's own vertical scroll. Element.scrollTo()
  // only ever touches the element it's called on, so it can't do that —
  // same end result (active pill centred, ribbon follows along), safer.
  useEffect(() => {
    const container = scrollerRef.current;
    const el = container?.querySelector(`[data-c="${active}"]`);
    if (!container || !el) return;
    const target = el.offsetLeft - container.clientWidth / 2 + el.offsetWidth / 2;
    container.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [active]);

  return (
    <div
      ref={ref}
      style={{
        position: "sticky", top: 0, zIndex: 40,
        background: `linear-gradient(180deg, #291410 0%, ${DARK_LEATHER_DEEP} 100%)`,
        borderBottom: `1px solid ${GOLD}33`,
      }}
    >
      <div ref={scrollerRef} className="no-scrollbar" style={{ display: "flex", gap: 6, overflowX: "auto", padding: "10px 14px" }}>
        {categories.map((cat) => {
          const on = active === cat.id;
          return (
            <button
              key={cat.id}
              data-c={cat.id}
              onClick={() => onSelect(cat.id)}
              style={{
                flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 20,
                fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", cursor: "pointer",
                border: on ? `1.5px solid ${GOLD}` : "1px solid transparent",
                background: on
                  ? "linear-gradient(180deg, #241210 0%, #150A08 100%)"
                  : "transparent",
                boxShadow: on
                  ? `inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -2px 3px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.35)`
                  : "none",
                color: on ? GOLD : GOLD_DIM,
                transition: "background-color 150ms ease, color 150ms ease, border-color 150ms ease, box-shadow 150ms ease",
              }}
            >
              <CategoryIcon cat={cat.id} size={13} color={on ? GOLD : GOLD_DIM} />
              {lang === "ru" ? cat.name_ru : cat.name_kz}
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default CategoryBar;
