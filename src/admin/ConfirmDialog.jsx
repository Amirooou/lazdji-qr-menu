import { AlertTriangle } from "lucide-react";

/**
 * Generic yes/no confirmation — used before destructive actions (deleting
 * a dish or category). Deliberately not reusing the customer-facing
 * Overlay/Sheet components: this needs to sit above the admin panel's own
 * chrome, and a plain centred modal reads as more "are you sure" than a
 * bottom sheet does.
 */
export default function ConfirmDialog({ title, message, confirmLabel = "Удалить", onConfirm, onCancel }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 340, background: "#fff", borderRadius: 18, padding: 24, textAlign: "center" }}
      >
        <div style={{ width: 48, height: 48, borderRadius: 24, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <AlertTriangle size={22} strokeWidth={2} color="#C83E2B" />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1C1917", margin: "0 0 8px" }}>{title}</h3>
        <p style={{ fontSize: 13.5, color: "#78716C", margin: "0 0 20px", lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "1px solid #E7E5E4", background: "#fff", color: "#1C1917", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "none", background: "#C83E2B", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
