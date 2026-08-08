import { useState, useEffect } from "react";
import { X, Minus, Plus, Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import { extras } from "../data/extras";
import { fmtPrice } from "../utils/format";
import { Overlay } from "./Overlay";
import Price from "./Price";
import { GOLD, CREAM, DARK_LEATHER } from "../theme";

export default function ProductSheet({ item, onClose }) {
  const { lang, t, addToCart, showToast } = useApp();
  const [sp, setSp] = useState(0);
  const [qty, setQty] = useState(1);
  const [pi, setPi] = useState(0);
  const [ex, setEx] = useState([]);

  // Блокируем скролл основного меню, пока открыта карточка товара
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!item) return null;

  const name = lang === "ru" ? item.title_ru : item.title_kz;
  const desc = lang === "ru" ? item.description_ru : item.description_kz;
  const price = item.portions?.length ? item.portions[pi].price : item.price;
  const extrasPrice = ex.reduce((s, eid) => s + (extras.find((e) => e.id === eid)?.price || 0), 0);
  const total = (price + extrasPrice) * qty;
  const spiceLabels = [t("spiceNone"), t("spiceMedium"), t("spiceHot")];

  return (
    <Overlay onClose={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="sheet-anim"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 480,
          borderRadius: "28px 28px 0 0",
          background: DARK_LEATHER || "#160305",
          borderTop: `1px solid ${GOLD}44`,
          borderLeft: `1px solid ${GOLD}22`,
          borderRight: `1px solid ${GOLD}22`,
          maxHeight: "92vh",
          overflow: "hidden",
          boxShadow: "0 -10px 40px rgba(0,0,0,0.9)",
        }}
      >
        <div
          style={{
            overflowY: "auto",
            maxHeight: "calc(92vh - 76px)",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Верхняя плашка-свайп */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "12px 0 6px",
              position: "sticky",
              top: 0,
              zIndex: 10,
              background: "rgba(22, 3, 5, 0.85)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div style={{ width: 36, height: 4, borderRadius: 4, background: "rgba(255,255,255,0.2)" }} />
          </div>

          {/* Кнопка Закрыть */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              right: 16,
              top: 12,
              zIndex: 20,
              width: 32,
              height: 32,
              borderRadius: 16,
              background: "rgba(255,255,255,0.1)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(8px)",
            }}
          >
            <X size={16} strokeWidth={2} color={CREAM || "#fff"} />
          </button>

          {/* Картинка блюда */}
          <div style={{ margin: "4px 20px 0", height: 230, borderRadius: 20, overflow: "hidden", background: "#0A0102", boxShadow: "0 8px 20px rgba(0,0,0,0.6)" }}>
            <img src={item.photo} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          {/* Контент */}
          <div style={{ padding: "16px 20px 80px" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: CREAM || "#fff", margin: 0 }}>{name}</h2>
            {desc && <p style={{ fontSize: 13, color: "rgba(245, 230, 211, 0.65)", margin: "8px 0 0", lineHeight: 1.5 }}>{desc}</p>}

            {/* Порции */}
            {item.portions?.length > 0 && (
              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                {item.portions.map((p, i) => {
                  const on = pi === i;
                  return (
                    <button
                      key={i}
                      onClick={() => setPi(i)}
                      style={{
                        flex: 1,
                        padding: 12,
                        borderRadius: 14,
                        textAlign: "left",
                        cursor: "pointer",
                        border: on ? `1px solid ${GOLD}` : "1px solid rgba(255,255,255,0.1)",
                        background: on ? "rgba(212, 160, 23, 0.15)" : "rgba(255,255,255,0.04)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 500, color: on ? GOLD : "rgba(255,255,255,0.6)" }}>
                        {lang === "ru" ? p.title_ru : p.title_kz}
                      </div>
                      <div style={{ marginTop: 4 }}>
                        <Price value={p.price} size={16} weight={700} on={on ? "gold" : "dark"} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Острота */}
            {item.is_spicy && (
              <div style={{ marginTop: 24 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: GOLD, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {t("spiceLevel")}
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {spiceLabels.map((lbl, i) => {
                    const on = sp === i;
                    return (
                      <button
                        key={i}
                        onClick={() => setSp(i)}
                        style={{
                          flex: 1,
                          padding: "10px 0",
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 600,
                          border: on ? "1px solid #C83E2B" : "1px solid rgba(255,255,255,0.1)",
                          cursor: "pointer",
                          background: on ? "linear-gradient(180deg, #A82E1C 0%, #6E1A0E 100%)" : "rgba(255,255,255,0.04)",
                          color: on ? "#fff" : "rgba(255,255,255,0.7)",
                          boxShadow: on ? "0 4px 15px rgba(200,62,43,0.4)" : "none",
                        }}
                      >
                        {lbl}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Допы (Extras) */}
            <div style={{ marginTop: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: GOLD, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {t("extras")}
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {extras.map((e) => {
                  const on = ex.includes(e.id);
                  return (
                    <button
                      key={e.id}
                      onClick={() => setEx((p) => (p.includes(e.id) ? p.filter((x) => x !== e.id) : [...p, e.id]))}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        borderRadius: 14,
                        border: on ? `1px solid ${GOLD}` : "1px solid rgba(255,255,255,0.08)",
                        background: on ? "rgba(212, 160, 23, 0.12)" : "rgba(255,255,255,0.04)",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 500, color: CREAM || "#fff" }}>
                        {lang === "ru" ? e.title_ru : e.title_kz}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Price value={e.price} size={13} weight={600} style={{ color: GOLD }} />
                        <span
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: on ? GOLD : "transparent",
                            border: on ? "none" : "1.5px solid rgba(255,255,255,0.3)",
                          }}
                        >
                          {on && <Check size={12} strokeWidth={3} color="#160305" />}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя фиксированная панель добавления */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "14px 16px 20px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(10, 1, 2, 0.95)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.06)",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                style={{ width: 40, height: 42, border: "none", background: "transparent", cursor: "pointer", color: CREAM || "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Minus size={14} strokeWidth={2} />
              </button>
              <span style={{ width: 24, textAlign: "center", fontSize: 14, fontWeight: 700, color: CREAM || "#fff" }}>{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                style={{ width: 40, height: 42, border: "none", background: "transparent", cursor: "pointer", color: CREAM || "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Plus size={14} strokeWidth={2} />
              </button>
            </div>

            <button
              onClick={() => {
                addToCart(item, qty, pi, sp, ex, "");
                showToast(t("addedToCart"));
                onClose();
              }}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "13px 0",
                borderRadius: 14,
                background: "linear-gradient(180deg, #3D080E 0%, #1A0205 100%)",
                color: CREAM || "#fff",
                fontSize: 14,
                fontWeight: 700,
                border: `1px solid ${GOLD}aa`,
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
              }}
            >
              {t("addToCart")}
              <span style={{ width: 1, height: 16, background: `${GOLD}66` }} />
              {fmtPrice(total)}
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}