import { useRef } from "react";
import { useApp } from "../context/AppContext";
import Wordmark from "./Wordmark";
import halal from "../assets/halal.jpg";
import { GOLD, GOLD_DIM, DARK_LEATHER_DEEP } from "../theme";

export default function Header() {
  const { lang, setLang, setAdmin } = useApp();
  const pressTimer = useRef(null);

  const startPress = () => {
    pressTimer.current = setTimeout(() => setAdmin((a) => !a), 750);
  };
  const endPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  return (
    <header style={{ background: DARK_LEATHER_DEEP, borderBottom: `1px solid ${GOLD}33` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, padding: "0 16px" }}>
        {/* Значок Халал */}
        <img
          src={halal}
          alt="Halal"
          style={{ width: 40, height: 40, borderRadius: 20, objectFit: "cover", border: `1px solid ${GOLD}55`, flexShrink: 0 }}
        />

        {/* Wordmark — удерживание переключает админку */}
        <div
          onMouseDown={startPress}
          onMouseUp={endPress}
          onMouseLeave={endPress}
          onTouchStart={startPress}
          onTouchEnd={endPress}
          style={{ flex: 1, display: "flex", justifyContent: "center", userSelect: "none" }}
        >
          <Wordmark size={32} />
        </div>

        {/* Переключатель языка KZ / RU */}
        <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", borderRadius: 8, border: `1px solid ${GOLD}55`, overflow: "hidden" }}>
            <button
              onClick={() => setLang("kz")}
              style={{
                padding: "5px 10px",
                fontSize: 11,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                background: lang === "kz" ? GOLD : "transparent",
                color: lang === "kz" ? DARK_LEATHER_DEEP : GOLD_DIM,
              }}
            >
              KZ
            </button>
            <button
              onClick={() => setLang("ru")}
              style={{
                padding: "5px 10px",
                fontSize: 11,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                background: lang === "ru" ? GOLD : "transparent",
                color: lang === "ru" ? DARK_LEATHER_DEEP : GOLD_DIM,
              }}
            >
              RU
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}