import { GOLD, DARK_LEATHER } from "../theme";

export function Overlay({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center" onClick={onClose}>
      <div
        className="overlay-anim absolute inset-0"
        style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
      />
      {children}
    </div>
  );
}

export function Sheet({ children, maxH = "92vh" }) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="sheet-anim relative w-full overflow-hidden"
      style={{
        maxWidth: 480,
        borderRadius: "28px 28px 0 0",
        backgroundColor: DARK_LEATHER || "#160305", // Убрали #F9F8F6, теперь шторка тёмно-бордовая!
        borderTop: `1px solid ${GOLD || "#D4A017"}44`,
        maxHeight: maxH,
        boxShadow: "0 -10px 40px rgba(0,0,0,0.9)",
      }}
    >
      {/* Ручка для свайпа вниз */}
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 8 }}>
        <div style={{ width: 40, height: 4, borderRadius: 4, background: "rgba(255,255,255,0.2)" }} />
      </div>
      {children}
    </div>
  );
}