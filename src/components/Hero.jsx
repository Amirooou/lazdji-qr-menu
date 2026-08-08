import { useState, useEffect } from "react";
import { Receipt, ChevronDown } from "lucide-react";
import { useApp } from "../context/AppContext";
import ServiceFeeModal from "./ServiceFeeModal";
import Wordmark from "./Wordmark";
import ContactLinks from "./ContactLinks";
// Добавляем новые ассеты: chiliFan (7 перцев) и chiliPair (парочка)
import { chiliLong, chiliHabanero, chiliDried } from "../assets/chiliAssets";
import { GOLD, CREAM } from "../theme"; // DARK_LEATHER пока не используем

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
        // ЦВЕТ ГРАНАТОВОГО СОКА: Изменили темно-бордовый на насыщенный винный (#8F1E33) в центре
        background: "radial-gradient(circle at 50% 40%, #8F1E33 0%, #31070B 60%, #0D0001 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden", 
      }}
    >
      <div
        className="hero-viewport"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "480px",
          height: "100vh",
          maxHeight: "930px", 
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden", 
          background: "transparent", 
          boxShadow: "0 10px 60px rgba(0,0,0,0.8)",
        }}
      >
        {/* ПЕРЕЦ 1 (Existing): ВЕРХНИЙ ПРАВЫЙ (Создает рамку сверху) */}
        {chiliDried && (
          <img
            src={chiliDried}
            alt=""
            style={{
              position: "absolute",
              top: "-15px", // Чуть подправили позицию
              right: "-30px",
              width: "150px",
              transform: "rotate(-110deg)",
              filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.85))",
              opacity: 0.9,
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        )}

        {/* ПЕРЕЦ 2 (Existing): ПЕРЕМЕЩЕН Чуть выше, чтобы не конфликтовать с доком */}
        {chiliLong && (
          <img
            src={chiliLong}
            alt=""
            style={{
              position: "absolute",
              bottom: "220px", // Подняли выше (было 125px)
              left: "-30px",
              width: "180px",
              transform: "rotate(30deg)",
              filter: "drop-shadow(10px 20px 30px rgba(0,0,0,0.9))",
              opacity: 0.9,
              pointerEvents: "none",
              zIndex: 1,
            }}
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
            padding: "40px 24px 0", // Оставляем паддинг сверху для 7 перцев
            textAlign: "center",
          }}
        >
          {/* НОВЫЙ БЛОК: 7 ПЕРЦЕВ «КОРОНОЙ» НАД ЛОГОТИПОМ */}
          {chiliFan && (
            <img
              src={chiliFan}
              alt=""
              style={{
                width: "220px", // Ширина, соразмерная логотипу
                marginBottom: "-20px", // Наплыв на логотип для бесшовности
                filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.8))",
                opacity: 0.95,
                zIndex: 1,
              }}
            />
          )}

          <div style={{ position: "relative", marginBottom: 18, zIndex: 2 }}>
            <Wordmark size={68} />
          </div>

          <div style={{ position: "relative", marginBottom: 32, display: "flex", alignItems: "center", gap: 12 }}>
            <p
              style={{
                color: GOLD,
                fontSize: 13,
                letterSpacing: "0.08em",
                lineHeight: 1.5,
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
                  width: "28px",
                  height: "28px",
                  filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.6))",
                  transform: "rotate(-10deg)",
                  opacity: 0.9
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
            // Градиент более плавный к фону (винному), а не черному
            background:
              "linear-gradient(180deg, rgba(10,1,2,0) 0%, rgba(13,0,1,0.9) 35%, #030000 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* НОВЫЙ БЛОК: ПАРОЧКА ЧИЛИ, ЛЕЖАЩИЕ ДРУГ НА ДРУГЕ */}
          {chiliPair && (
            <img
              src={chiliPair}
              alt=""
              style={{
                width: "160px", // Аккуратный размер, чтобы не перекрывать ссылки
                transform: "rotate(-15deg)", // Небольшой естественный наклон
                filter: "drop-shadow(0 6px 15px rgba(0,0,0,0.8))",
                opacity: 0.95,
                marginTop: "-10px", // Чуть поднять, чтобы были надContactLinks
                marginBottom: "5px",
                zIndex: 1,
              }}
            />
          )}

          <ContactLinks />

          <button
            onClick={onScrollToMenu}
            style={{
              width: "100%",
              padding: "16px 0",
              borderRadius: "16px",
              background: "linear-gradient(180deg, #3D0A11 0%, #1A0205 100%)", // Изменили #2A на #3D для соответствия фону
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