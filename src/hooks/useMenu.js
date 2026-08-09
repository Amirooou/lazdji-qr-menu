import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

export function useMenu() {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Функция загрузки данных
  const fetchMenu = useCallback(async () => {
    try {
      // Запрашиваем категории и блюда без сортировки по несуществующему полю
const { data: categoriesData, error: catErr } = await supabase
  .from("categories")
  .select("*, dishes(*, portions(*))");

      if (catErr) throw catErr;

      // Вытаскиваем все блюда в плоский массив для удобного поиска
      const allDishes = categoriesData.flatMap((cat) => cat.dishes || []);

      setCategories(categoriesData || []);
      setDishes(allDishes);
      setError(null);
    } catch (err) {
      console.error("Ошибка загрузки меню:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();

    // Генерируем уникальный ID канала, чтобы React StrictMode не вызивал ошибку повторной подписки
    const channelId = `menu-realtime-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase.channel(channelId);

    // Сначала ВСЕ .on(), и только в самом конце .subscribe()
    channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dishes" },
        () => {
          fetchMenu();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        () => {
          fetchMenu();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "portions" },
        () => {
          fetchMenu();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMenu]);

  return {
    categories,
    dishes,
    loading,
    error,
    refetch: fetchMenu,
  };
}