import { useEffect, useState } from "react";
import { getSession, onAuthStateChange } from "../services/authService";

/**
 * `session` is `undefined` while the initial check is in flight, `null`
 * once we know for sure no one's signed in, or the Supabase session object
 * when they are. Kept as three distinct states so the admin panel can show
 * a loading screen instead of flashing the login form for a moment first.
 */
export function useAuth() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    let cancelled = false;
    getSession().then((s) => {
      if (!cancelled) setSession(s);
    });
    const unsubscribe = onAuthStateChange((s) => {
      if (!cancelled) setSession(s);
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return { session, loading: session === undefined, isAuthenticated: Boolean(session) };
}
