import { Receipt, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Overlay } from "./Overlay";
import { GOLD, CREAM, DARK_LEATHER } from "../theme";

export default function ServiceFeeModal({ onClose }) {
  const { t } = useApp();

  return (
    <Overlay onClose={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="sheet-anim"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          margin: "0 auto",
          borderRadius: 28,
          backgroundColor: DARK_LEATHER || "#160305",
          border: `1px solid ${GOLD || "#D4A017"}44`,
          padding: "36px 28px 28px",
          textAlign: "center",
          boxShadow: "0 12px 40px rgba(0,0,0,0.8)",
        }}
      >
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.06)",
            border: "none",
            color: CREAM || "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <X size={16} />
        </button>

        {/* Иконка чека в золотом обрамлении */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background: "rgba(212, 160, 23, 0.12)",
            border: `1px solid ${GOLD || "#D4A017"}33`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <Receipt size={26} strokeWidth={1.8} color={GOLD || "#D4A017"} />
        </div>

        <h3 style={{ fontSize: 19, fontWeight: 800, color: CREAM || "#fff", margin: 0 }}>
          {t("feeTitle")}
        </h3>

        <p style={{ fontSize: 13, color: "rgba(245, 230, 211, 0.65)", margin: "8px 0 24px", lineHeight: 1.5 }}>
          {t("feeSubtitle")}
        </p>

        {/* Блок с процентом */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 18,
            padding: "18px 0",
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 32, fontWeight: 800, color: GOLD || "#D4A017" }}>10%</span>
        </div>

        {/* Кнопка действия */}
        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "15px 0",
            borderRadius: 16,
            background: "linear-gradient(180deg, #3D080E 0%, #1A0205 100%)",
            color: CREAM || "#fff",
            fontSize: 14,
            fontWeight: 700,
            border: `1px solid ${GOLD || "#D4A017"}aa`,
            cursor: "pointer",
            letterSpacing: "0.02em",
            boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
          }}
        >
          {t("continue")}
        </button>
      </div>
    </Overlay>
  );
}