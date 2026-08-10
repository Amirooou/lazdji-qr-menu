import { Ban, Flame, Star, Sparkles, Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import Price from "./Price";
import OrnamentalCorner from "./OrnamentalCorner";
import { dishDisplayPrice } from "../utils/format";
import { GOLD, GOLD_DIM, FLAME, DARK_LEATHER_DEEP } from "../theme";

export default function MenuItemRow({ item, onTap }) {
  const { lang, t, addToCart, isAvailable, admin, toggleAvailability, showToast, orderMode } = useApp();
  const off = !isAvailable(item);
  // Если блюда нет в наличии И пользователь не админ — ничего не рендерим
if (off && !admin) {
  return null;
}
  const name = lang === "ru" ? item.title_ru : item.title_kz;
  const desc = lang === "ru" ? item.description_ru : item.description_kz;
  const price = dishDisplayPrice(item);

  return (
    <div
      style={{
        position: "relative", margin: "0 16px 10px", borderRadius: 16,
        border: `1px solid ${GOLD}40`, background: "linear-gradient(155deg, #3A1E17 0%, #241210 100%)",
        overflow: "hidden", opacity: off ? 0.45 : 1, filter: off ? "grayscale(1)" : "none",
        boxShadow: "0 3px 10px rgba(0,0,0,0.35)",
      }}
    >
      {/* Gold ornamental corner flourishes — not a plain square bracket. */}
      {["top left", "top right", "bottom left", "bottom right"].map((pos) => (
        <OrnamentalCorner key={pos} corner={pos} size={20} />
      ))}

      {admin && (
        <button
          onClick={(e) => { e.stopPropagation(); toggleAvailability(item); }}
          style={{
            position: "absolute", left: 8, top: 8, zIndex: 10, width: 24, height: 24, borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer",
            background: off ? FLAME : "rgba(0,0,0,0.5)", color: off ? "#fff" : GOLD,
          }}
        >
          <Ban size={10} />
        </button>
      )}
      {off && (
        <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.55)" }}>
          <span style={{ background: DARK_LEATHER_DEEP, color: GOLD, fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 8, border: `1px solid ${GOLD}66` }}>{t("outOfStock")}</span>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "stretch" }}>
        <div onClick={() => !off && onTap(item)} style={{ width: 128, height: 128, flexShrink: 0, overflow: "hidden", background: "#1A0D0B", cursor: "pointer" }}>
          <img src={item.photo} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
        </div>

        <div onClick={() => !off && onTap(item)} style={{ flex: 1, minWidth: 0, padding: "12px 14px", display: "flex", flexDirection: "column", justifyContent: "center", cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <h3 style={{ fontSize: 14.5, fontWeight: 650, color: "#FFF8EE", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</h3>
            {item.is_spicy && (
              <span style={{ display: "inline-flex", alignItems: "center", padding: "1px 5px", borderRadius: 4, background: "rgba(240,80,48,0.18)", color: FLAME, flexShrink: 0 }}>
                <Flame size={9} strokeWidth={2.5} />
              </span>
            )}
            {item.is_signature && <Star size={11} strokeWidth={2.5} color={GOLD} style={{ flexShrink: 0 }} />}
            {item.is_new && (
              <span style={{ display: "inline-flex", alignItems: "center", padding: "1px 5px", borderRadius: 4, background: "rgba(16,185,129,0.18)", color: "#34D399", flexShrink: 0 }}>
                <Sparkles size={9} strokeWidth={2.5} />
              </span>
            )}
          </div>
          <p style={{ fontSize: 12, color: GOLD_DIM, margin: "3px 0 0", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.4 }}>
            {desc}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
            <Price value={price.value} from={price.from} size={19} weight={800} on="dark" />
            {orderMode !== "in-house" && (
              <button
                disabled={off}
                onClick={(e) => { e.stopPropagation(); addToCart(item); showToast(t("addedToCart")); }}
                style={{
                  width: 30, height: 30, borderRadius: 15, background: `linear-gradient(155deg, ${FLAME} 0%, #B8341A 100%)`,
                  color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", opacity: off ? 0.3 : 1, flexShrink: 0,
                }}
              >
                <Plus size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
