import { useState, useEffect } from "react";
import { Receipt, ChevronDown } from "lucide-react";
import { useApp } from "../context/AppContext";
import ServiceFeeModal from "./ServiceFeeModal";
import Wordmark from "./Wordmark";
import ContactLinks from "./ContactLinks";
import { chiliLong, chiliHabanero, chiliDried } from "../assets/chiliAssets";
import { GOLD, CREAM } from "../theme";

// Если 7 перчиков уже лежит в assets, раскомментируй строку ниже и измени имя файла:
// import chili7 from "../assets/chili_pile.png"; 

export default function Hero({ onScrollToMenu }) {
  const { t } = useApp();
  const [showFee, setShowFee] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("qr") || params.has("table")) {
      setShowFee(true);
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "radial-gradient(circle at 50% 40%, #4D0A12 0%, #1A0205 60%, #0D0001 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        className="hero hero-viewport"
        style={{
          width: "100%",
          maxWidth: "480px",
          height: "100vh",
          maxHeight: "930px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "transparent",
          boxShadow: "0 10px 60px rgba(0,0,0,0.8)",
        }}
      >
        {/* ========================================================= */}
        {/* 1. ВЕРХНИЙ ЛЕВЫЙ УГОЛ (МЕСТО ДЛЯ 7 ПЕРЧИКОВ)              */}
        {/* Чтобы вставить:                                           */}
        {/* 1) Заимпортируй картинку вверху файла                   */}
        {/* 2) Раскомментируй этот блок {chili7 && ...}              */}
        {/* ========================================================= */}
        {/*
        {chili7 && (
          <img
            src={chili7}
            alt=""
            style={{
              position: "absolute",
              top: "-10px",
              left: "-20px",
              width: "220px",
              transform: "rotate(10deg)",
              filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.85))",
              opacity: 0.95,
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        )}
        */}

        {/* 2. ВЕРХНИЙ ПРАВЫЙ УГОЛ (Большой сушеный перец) */}
        {chiliDried && (
          <img
            src={chiliDried}
            alt=""
            style={{
              transform: "rotate(-115deg)",
            }}
            className="hero__pepper hero__pepper--top-left"
          />
        )}

        {/* 3. НИЖНИЙ ЛЕВЫЙ УГОЛ (Большой длинный перец) */}
        {chiliLong && (
          <img
            src={chiliLong}
            alt=""
            style={{
              transform: "rotate(30deg)",
            }}
            className="hero__pepper hero__pepper--bottom-right"
          />
        )}

        {/* ЦЕНТРАЛЬНЫЙ БЛОК */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 20px 0",
            textAlign: "center",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* ЛОГОТИП — Идеальный центр, максимальный размер */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Wordmark size={260} style={{ width: "70%", maxWidth: "260px" }} />
          </div>

          <div
            style={{
              position: "relative",
              marginBottom: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              width: "100%",
            }}
          >
            <p
              style={{
                color: GOLD,
                fontSize: 13,
                letterSpacing: "0.08em",
                lineHeight: 1.4,
                margin: 0,
                fontWeight: 600,
                textTransform: "uppercase",
                opacity: 0.95,
                textShadow: "0 2px 12px rgba(0,0,0,0.9)",
              }}
            >
              {t("tagline")}
            </p>

            {chiliHabanero && (
              <img
                src={chiliHabanero}
                alt=""
                style={{
                  width: "32px",
                  height: "32px",
                  filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.6))",
                  transform: "rotate(-10deg)",
                  opacity: 0.95,
                  flexShrink: 0,
                }}
              />
            )}
          </div>

          <button
            onClick={() => setShowFee(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 22px",
              borderRadius: "24px",
              border: `1px solid ${GOLD}66`,
              background: "rgba(10, 1, 2, 0.5)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
            }}
          >
            <Receipt size={14} strokeWidth={1.8} color={GOLD} />
            <span
              style={{
                color: GOLD,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              {t("service")}
            </span>
          </button>
        </div>

        {/* НИЖНИЙ ДОК */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            padding: "24px 24px 32px",
            background:
              "linear-gradient(180deg, rgba(10,1,2,0) 0%, rgba(10,1,2,0.98) 35%, #030000 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <ContactLinks />

          <button
            onClick={onScrollToMenu}
            style={{
              width: "100%",
              padding: "16px 0",
              borderRadius: "16px",
              background: "linear-gradient(180deg, #2A080C 0%, #140305 100%)",
              color: CREAM,
              fontSize: 14,
              fontWeight: 700,
              border: `1px solid ${GOLD}88`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              letterSpacing: "0.03em",
              boxShadow: "0 8px 30px rgba(0,0,0,0.75)",
            }}
          >
            {t("scrollHint")}
            <ChevronDown size={18} strokeWidth={2.2} color={GOLD} />
          </button>
        </div>

        {showFee && <ServiceFeeModal onClose={() => setShowFee(false)} />}
      </div>
    </div>
  );
}