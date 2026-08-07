import { useState } from "react";
import { LogOut } from "lucide-react";
import { AppProvider } from "../context/AppContext";
import { useAuth } from "../hooks/useAuth";
import { signOut } from "../services/authService";
import { useMenu } from "../hooks/useMenu";
import LoginScreen from "./LoginScreen";
import DishList from "./DishList";
import DishForm from "./DishForm";
import Wordmark from "../components/Wordmark";
import Toast from "../components/Toast";
import ConnectionError from "../components/ConnectionError";

/**
 * The whole admin panel. Gated behind Supabase Auth (see useAuth) — the
 * gate here is just for UX (hiding the form so no one without an account
 * stumbles into it); the real enforcement is server-side, via the RLS
 * policies in supabase/migrations/0001_schema.sql, so a stray client-side
 * bug here can't actually let an unauthenticated write through.
 */
function AdminShell() {
  const { categories, error } = useMenu();
  const [view, setView] = useState({ type: "list" }); // { type: "list" } | { type: "new" } | { type: "edit", dish }

  const goToList = () => setView({ type: "list" });

  if (error) return <ConnectionError message={error.message} />;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "#fff", borderBottom: "1px solid #E7E5E4" }}>
        <Wordmark size={22} />
        <button
          onClick={() => signOut()}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 10, border: "1px solid #E7E5E4", background: "#fff", color: "#78716C", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
        >
          <LogOut size={13} /> Выйти
        </button>
      </div>

      {view.type === "list" && (
        <DishList onEdit={(dish) => setView({ type: "edit", dish })} onNew={() => setView({ type: "new" })} />
      )}
      {view.type === "new" && <DishForm categories={categories} onSaved={goToList} onCancel={goToList} />}
      {view.type === "edit" && <DishForm dish={view.dish} categories={categories} onSaved={goToList} onCancel={goToList} />}
      <Toast />
    </div>
  );
}

export default function AdminApp() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ minHeight: "100vh", background: "#F9F8F6" }} />;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // AppProvider isn't strictly needed for the admin panel's own logic, but
  // Wordmark and other shared components read from useApp() for language —
  // reusing the same provider keeps them drop-in reusable instead of
  // needing an admin-only fork.
  return (
    <AppProvider>
      <AdminShell />
    </AppProvider>
  );
}
