import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export function useAdminRealtime(onDataChange) {
  useEffect(() => {
    // Подписываемся на ВСЕ изменения в таблице dishes
    const channel = supabase
      .channel("admin-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dishes" },
        (payload) => {
          console.log("Realtime change in dishes:", payload);
          onDataChange(payload);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        (payload) => {
          onDataChange(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onDataChange]);
}