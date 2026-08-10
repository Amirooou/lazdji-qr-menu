import { useState } from "react";
import { Ban, Star, Flame, Users, Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import Price from "./Price";
import OrnamentalCorner from "./OrnamentalCorner";
import { GOLD, GOLD_DIM, FLAME, DARK_LEATHER_DEEP } from "../theme";

export default function FeaturedDishCard({ item, onTap }) {
  const { lang, t, addToCart, isAvailable, admin, toggleAvailability, showToast, orderMode } = useApp();
  const [pi, setPi] = useState(0);
  const off = !isAvailable(item);

  // Скрываем фирменные карточки из стоп-листа для обычных гостей
  if (off && !admin) {
    return null;
  }

  const name = lang === "ru" ? item.title_ru : item.title_kz;
  const desc = lang === "ru" ? item.description_ru : item.description_kz;

  return (
    <div className="card" style={{ padding: "0 16px 12px" }}>
      <div
        style={{
          position: "relative", borderRadius: 20, border: `1px solid ${GOLD}4D`,
          background: "linear-gradient(160deg, #3A1E17 0%, #241210 100%)",
          overflow: "hidden", opacity: off ? 0.45 : 1, filter: off ? "grayscale(1)" : "none",
          boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
        }}
      >
        {["top left", "top right", "bottom left", "bottom right"].map((pos) => (
          <OrnamentalCorner key={pos} corner={pos} size={26} />
        ))}

        {admin && (
          <button
            onClick={() => toggleAvailability(item)}
            style={{
              position: "absolute", right: 12, top: 12, zIndex: 10, display: "flex", alignItems: "center", gap: 4,
              padding: "6px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer",
              background: off ? FLAME : "rgba(20,8,9,0.92)", color: off ? "#fff" : GOLD,
            }}
          >
            <Ban size={11} /> {t("toggleStop")}
          </button>
        )}
        {off && (
          <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.55)" }}>
            <span style={{ background: DARK_LEATHER_DEEP, color: GOLD, fontSize: 13, fontWeight: 700, padding: "8px 20px", borderRadius: 14, border: `1px solid ${GOLD}66`, transform: "rotate(-3deg)" }}>
              {t("outOfStock")}
            </span>
          </div>
        )}

        <div onClick={() => !off && onTap(item)} style={{ cursor: "pointer" }}>
          <div style={{ position: "relative", height: 220, overflow: "hidden", background: "#1A0D0B" }}>
            <img src={item.photo} alt={name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)" }} />
            <div style={{ position: "absolute", bottom: 12, left: 12, display: "flex", gap: 6 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6, background: "rgba(20,8,9,0.92)", fontSize: 11, fontWeight: 600, color: GOLD, border: `1px solid ${GOLD}55` }}>
                <Star size={11} strokeWidth={2.5} color={GOLD} /> {t("signature")}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6, background: FLAME, fontSize: 11, fontWeight: 600, color: "#fff" }}>
                <Flame size={11} strokeWidth={2.5} /> {t("hits")}
              </span>
            </div>
          </div>
        </div>

        <div style={{ padding: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#FFF8EE", margin: 0, lineHeight: 1.2 }}>{name}</h2>
          <p style={{ fontSize: 13, color: GOLD_DIM, margin: "6px 0 0", lineHeight: 1.5 }}>{desc}</p>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            {item.portions.map((p, i) => {
              const on = pi === i;
              return (
                <button
                  key={i}
                  onClick={() => setPi(i)}
                  style={{
                    flex: 1, padding: 12, borderRadius: 14, cursor: "pointer", textAlign: "left",
                    border: on ? `1px solid ${GOLD}` : `1px solid ${GOLD}33`,
                    background: on ? `${GOLD}1F` : "rgba(0,0,0,0.2)",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 500, color: on ? GOLD : GOLD_DIM }}>{lang === "ru" ? p.title_ru : p.title_kz}</div>
                  <div style={{ marginTop: 5 }}>
                    <Price value={p.price} size={19} weight={800} on="dark" />
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 500, color: GOLD_DIM }}>
              <Users size={13} strokeWidth={2} />
              {t("forPersons")} {item.portions[pi].serves} {t("persons")}
            </span>
            {orderMode === "in-house" ? (
              <span style={{ fontSize: 12.5, fontWeight: 600, color: GOLD_DIM }}>{t("orderViaTableButton")}</span>
            ) : (
              <button
                disabled={off}
                onClick={() => { addToCart(item, 1, pi); showToast(t("addedToCart")); }}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 14,
                  background: `linear-gradient(155deg, ${FLAME} 0%, #B8341A 100%)`, color: "#fff", fontSize: 13,
                  fontWeight: 700, border: "none", cursor: "pointer", opacity: off ? 0.3 : 1,
                }}
              >
                <Plus size={14} strokeWidth={2.5} /> {t("addToCart")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}