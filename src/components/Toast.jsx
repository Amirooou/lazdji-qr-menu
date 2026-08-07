import { Check } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div
      className="toast-anim fixed bottom-28 left-1/2 z-[200] flex items-center gap-2.5 rounded-full px-5 py-3 shadow-2xl"
      style={{ transform: "translateX(-50%)", background: "#1C1917" }}
    >
      <Check size={14} strokeWidth={3} color="#34d399" />
      <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{toast}</span>
    </div>
  );
}
