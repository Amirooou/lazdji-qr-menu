import { AlertTriangle } from "lucide-react";

/**
 * Shown when the menu fails to load — almost always a missing/incorrect
 * .env during local setup, or a Supabase project that's paused/unreachable.
 * A blank page here would look like the app is just broken; this at least
 * tells whoever's looking at it what to check.
 */
export default function ConnectionError({ message }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, background: "#F9F8F6", textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <AlertTriangle size={26} strokeWidth={1.8} color="#C83E2B" />
      </div>
      <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1C1917", margin: 0 }}>Не удалось загрузить меню</h2>
      <p style={{ fontSize: 13.5, color: "#78716C", marginTop: 8, maxWidth: 320, lineHeight: 1.6 }}>
        {message || "Проверьте подключение к базе данных."}
      </p>
    </div>
  );
}
