import { useState } from "react";
import { ShoppingCart, Minus, Plus, MessageCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Overlay, Sheet } from "./Overlay";
import Price from "./Price";
import OrderTypeModal from "./OrderTypeModal";
import { sendOrderToWhatsApp } from "../utils/whatsapp";
import { GOLD, CREAM, DARK_LEATHER } from "../theme";

export default function CartSheet({ onClose }) {
  const { lang, t, cart, cartTotal, lineTotal, removeFromCart, addToCart, clearCart } = useApp();
  const [showOrderType, setShowOrderType] = useState(false);

  // Для доставки обслуживание 10% НЕ берется
  const grand = cartTotal;

  const handleOrderTypeSelected = (orderType) => {
    sendOrderToWhatsApp(cart, orderType, lang);
    clearCart();
    setShowOrderType(false);
    onClose();
  };

  return (
    <>
      <Overlay onClose={onClose}>
        <Sheet maxH="88vh">
          <div
            style={{
              backgroundColor: DARK_LEATHER || "#160305",
              color: CREAM || "#fff",
              minHeight: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: "28px 28px 0 0",
              borderTop: `1px solid ${GOLD || "#D4A017"}44`,
            }}
          >
            {!cart.length ? (
              <div style={{ padding: "60px 20px 60px", textAlign: "center" }}>
                <ShoppingCart size={40} strokeWidth={1.2} color={GOLD || "#D4A017"} />
                <p style={{ marginTop: 12, fontSize: 14, fontWeight: 500, color: "rgba(245, 230, 211, 0.6)" }}>
                  {t("emptyCart")}
                </p>
              </div>
            ) : (
              <>
                {/* Шапка корзины */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px 12px",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: CREAM || "#fff", margin: 0 }}>
                    {t("cart")}
                  </h3>
                  <button
                    onClick={clearCart}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: GOLD || "#D4A017",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      opacity: 0.8,
                    }}
                  >
                    {t("clearCart")}
                  </button>
                </div>

                {/* Список блюд */}
                <div style={{ overflowY: "auto", maxHeight: "calc(88vh - 200px)", padding: "8px 20px 110px" }}>
                  {cart.map((c) => {
                    const nm = lang === "ru" ? c.item.title_ru : c.item.title_kz;
                    return (
                      <div
                        key={c.key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px 0",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                        }}
                      >
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 12,
                            overflow: "hidden",
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            flexShrink: 0,
                          }}
                        >
                          <img src={c.item.photo} alt={nm} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: CREAM || "#fff",
                              margin: 0,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {nm}
                          </h4>
                          <div style={{ marginTop: 4 }}>
                            <Price value={lineTotal(c)} size={14} weight={700} color={GOLD || "#D4A017"} />
                          </div>
                        </div>

                        {/* Переключатель кол-ва */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            borderRadius: 10,
                            border: `1px solid ${GOLD || "#D4A017"}44`,
                            background: "rgba(255, 255, 255, 0.04)",
                            overflow: "hidden",
                          }}
                        >
                          <button
                            onClick={() => removeFromCart(c.key)}
                            style={{
                              width: 32,
                              height: 32,
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                              color: CREAM || "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ width: 20, textAlign: "center", fontSize: 13, fontWeight: 700, color: CREAM || "#fff" }}>
                            {c.qty}
                          </span>
                          <button
                            onClick={() => addToCart(c.item, 1, c.portionIdx, c.spice, c.selectedExtras, c.notes)}
                            style={{
                              width: 32,
                              height: 32,
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                              color: CREAM || "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Блок итогового счета */}
                  <div
                    style={{
                      marginTop: 20,
                      padding: 16,
                      borderRadius: 18,
                      border: `1px solid ${GOLD || "#D4A017"}33`,
                      background: "rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: CREAM || "#fff" }}>
                        {t("total")}
                      </span>
                      <Price value={grand} size={20} weight={800} color={GOLD || "#D4A017"} />
                    </div>
                  </div>
                </div>

                {/* Нижняя фиксированная кнопка WhatsApp */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "14px 20px 24px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                    background: "rgba(22, 3, 5, 0.95)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <button
                    onClick={() => setShowOrderType(true)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      padding: "15px 0",
                      borderRadius: 14,
                      background: "linear-gradient(180deg, #1E4D2B 0%, #0F2916 100%)",
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 700,
                      border: `1px solid ${GOLD || "#D4A017"}88`,
                      boxShadow: "0 4px 18px rgba(0,0,0,0.5)",
                      cursor: "pointer",
                    }}
                  >
                    <MessageCircle size={18} strokeWidth={2} color="#25D366" />
                    {t("checkoutWhatsApp")}
                  </button>
                </div>
              </>
            )}
          </div>
        </Sheet>
      </Overlay>

      {showOrderType && (
        <OrderTypeModal onSelect={handleOrderTypeSelected} onClose={() => setShowOrderType(false)} />
      )}
    </>
  );
}