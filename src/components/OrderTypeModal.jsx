import { Bike, ShoppingBag, UtensilsCrossed, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Overlay, Sheet } from "./Overlay";
import { GOLD, CREAM } from "../theme";

const ORDER_TYPES = [
  { id: "delivery", Icon: Bike, labelKey: "orderTypeDelivery" },
  { id: "pickup", Icon: ShoppingBag, labelKey: "orderTypePickup" },
  { id: "reservation", Icon: UtensilsCrossed, labelKey: "orderTypeReservation" },
];

export default function OrderTypeModal({ onSelect, onClose }) {
  const { t } = useApp();

  return (
    <Overlay onClose={onClose}>
      <Sheet maxH="auto">
        <div style={{ padding: "0 20px 32px" }}>
          {/* Заголовок теперь ярко-кремовый */}
          <p style={{ fontSize: 16, fontWeight: 700, color: CREAM || "#F5E6D3", marginBottom: 16 }}>
            {t("chooseOrderType")}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {ORDER_TYPES.map(({ id, Icon, labelKey }) => (
              <button
                key={id}
                onClick={() => onSelect(id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 16,
                  // Тёмная прозрачная подложка с золотой рамкой
                  border: `1px solid ${GOLD || "#D4A017"}33`,
                  background: "rgba(255, 255, 255, 0.04)",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "background 0.2s, border-color 0.2s",
                }}
              >
                {/* Иконка в золотом стиле */}
                <span
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: "rgba(212, 160, 23, 0.12)",
                    border: `1px solid ${GOLD || "#D4A017"}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: GOLD || "#D4A017",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} strokeWidth={1.8} />
                </span>

                {/* Название варианта */}
                <span style={{ fontSize: 14, fontWeight: 600, color: CREAM || "#F5E6D3", flex: 1 }}>
                  {t(labelKey)}
                </span>

                {/* Аккуратная золотая стрелочка */}
                <ChevronRight size={18} color={GOLD || "#D4A017"} style={{ opacity: 0.7 }} />
              </button>
            ))}
          </div>
        </div>
      </Sheet>
    </Overlay>
  );
}