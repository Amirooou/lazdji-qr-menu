import { ShoppingCart } from "lucide-react";
import { useApp } from "../context/AppContext";
import Price from "./Price";
import { GOLD, FLAME } from "../theme";

export default function FloatingCartBar({ onTap }) {
  const { t, cartCount, cartTotal, orderMode } = useApp();
  if (orderMode === "in-house" || !cartCount) return null;

  return (
    <button
      onClick={onTap}
      className="slide-anim"
      style={{
        position: "fixed", bottom: 20, left: 16, right: 16, zIndex: 50, maxWidth: 480, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px",
        borderRadius: 18, background: "linear-gradient(155deg, #2A1512 0%, #170A0C 100%)", color: "#fff",
        border: `1px solid ${GOLD}66`, cursor: "pointer",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative" }}>
          <ShoppingCart size={17} strokeWidth={2} color={GOLD} />
          <span
            style={{
              position: "absolute", top: -8, right: -8, minWidth: 18, height: 18, borderRadius: 9,
              background: FLAME, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700, padding: "0 4px", color: "#fff",
            }}
          >
            {cartCount}
          </span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{t("cart")}</span>
      </div>
      <Price value={cartTotal} size={17} weight={700} on="dark" />
    </button>
  );
}
