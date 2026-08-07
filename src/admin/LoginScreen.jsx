import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { signIn } from "../services/authService";
import Wordmark from "../components/Wordmark";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await signIn(email, password);
      // No manual redirect needed — useAuth's onAuthStateChange listener
      // picks up the new session and AdminApp re-renders past this screen.
    } catch (err) {
      // Don't mask a setup problem (missing .env, unreachable project) behind
      // "wrong password" — that sends whoever's debugging it looking in
      // completely the wrong place. Only genuine auth rejections get the
      // generic message.
      setError(err.message?.includes("Supabase is not configured") ? err.message : "Неверный email или пароль");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F9F8F6", padding: 24 }}>
      <div style={{ marginBottom: 32 }}>
        <Wordmark size={32} />
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ width: "100%", maxWidth: 360, background: "#fff", borderRadius: 20, border: "1px solid #E7E5E4", padding: 28 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <LockKeyhole size={18} strokeWidth={2} color="#1C1917" />
          <h1 style={{ fontSize: 16, fontWeight: 800, color: "#1C1917", margin: 0 }}>Вход для персонала</h1>
        </div>

        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#78716C", marginBottom: 6 }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
          style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E7E5E4", fontSize: 14, color: "#1C1917", outline: "none", marginBottom: 16 }}
        />

        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#78716C", marginBottom: 6 }}>Пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E7E5E4", fontSize: 14, color: "#1C1917", outline: "none", marginBottom: error ? 10 : 20 }}
        />

        {error && <p style={{ fontSize: 12.5, color: "#C83E2B", margin: "0 0 16px" }}>{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          style={{ width: "100%", padding: "12px 0", borderRadius: 12, background: "#1C1917", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", opacity: submitting ? 0.6 : 1 }}
        >
          {submitting ? "Входим…" : "Войти"}
        </button>
      </form>

      <p style={{ marginTop: 20, fontSize: 12, color: "#A8A29E", maxWidth: 320, textAlign: "center", lineHeight: 1.5 }}>
        Учётные записи создаются в панели Supabase (Authentication → Users),
        самостоятельная регистрация не предусмотрена.
      </p>
    </div>
  );
}
