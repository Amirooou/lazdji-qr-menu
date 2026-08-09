import { useState } from "react";
import { Plus, Pencil, Trash2, Star, Flame, Sparkles, Settings2 } from "lucide-react";
import { useMenu } from "../hooks/useMenu";
import { deleteDish } from "../services/adminService";
import { setDishAvailability } from "../services/menuService";
import { useApp } from "../context/AppContext";
import { fmtPrice } from "../utils/format";
import ConfirmDialog from "./ConfirmDialog";
import CategoryManager from "./CategoryManager";

// Выносим карточку блюда в отдельный компонент для оптимистичного UI
function DishItem({ dish, onEdit, onDelete, showToast }) {
  // Локальное состояние для МОМЕНТАЛЬНОГО переключения галочки
  const [isAvailable, setIsAvailable] = useState(dish.available);
  const [isUpdating, setIsUpdating] = useState(false);

  // Мгновенный переключатель стоп-листа
  const handleToggle = async (e) => {
    e.stopPropagation();
    const nextState = !isAvailable;
    
    // 1. Меняем UI моментально без ожидания ответа сервера!
    setIsAvailable(nextState);
    setIsUpdating(true);

    try {
      await setDishAvailability(dish.id, nextState);
    } catch (err) {
      // 2. Если произошла ошибка сети — откатываем галочку обратно
      setIsAvailable(!nextState);
      showToast("Ошибка обновления статуса", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "#fff",
        border: "1px solid #E7E5E4",
        borderRadius: 14,
        padding: 10,
        marginBottom: 8,
        opacity: isAvailable ? 1 : 0.55,
        transition: "opacity 0.2s ease",
      }}
    >
      <div style={{ width: 52, height: 52, borderRadius: 10, overflow: "hidden", background: "#F5F5F4", flexShrink: 0 }}>
        {dish.photo && <img src={dish.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <h3 style={{ fontSize: 13.5, fontWeight: 650, color: "#1C1917", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {dish.title_ru}
          </h3>
          {dish.is_signature && <Star size={11} color="#D97706" style={{ flexShrink: 0 }} />}
          {dish.is_spicy && <Flame size={11} color="#C83E2B" style={{ flexShrink: 0 }} />}
          {dish.is_new && <Sparkles size={11} color="#059669" style={{ flexShrink: 0 }} />}
        </div>
        <p style={{ fontSize: 12.5, color: "#78716C", margin: "2px 0 0" }}>
          {dish.portions?.length ? `от ${fmtPrice(Math.min(...dish.portions.map((p) => p.price)))}` : fmtPrice(dish.price)}
        </p>
      </div>

      {/* Быстрый тумблер с мгновенным откликом */}
      <label style={{ display: "flex", alignItems: "center", flexShrink: 0, cursor: "pointer", padding: "4px" }}>
        <input
          type="checkbox"
          checked={isAvailable}
          disabled={isUpdating}
          onChange={handleToggle}
          style={{ width: 20, height: 20, accentColor: "#C83E2B", cursor: "pointer" }}
        />
      </label>

      <button
        onClick={() => onEdit(dish)}
        style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#F5F5F4", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
      >
        <Pencil size={14} color="#57534E" />
      </button>
      <button
        onClick={() => onDelete(dish)}
        style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#FEF2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
      >
        <Trash2 size={14} color="#C83E2B" />
      </button>
    </div>
  );
}

export default function DishList({ onEdit, onNew }) {
  const { categories, dishes, loading } = useMenu();
  const { showToast } = useApp();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [showCategories, setShowCategories] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteDish(pendingDelete.id);
      showToast("Блюдо удалено");
    } catch (e) {
      showToast("Ошибка при удалении", "error");
    } finally {
      setPendingDelete(null);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center", color: "#A8A29E", fontSize: 14 }}>Загрузка…</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F9F8F6", paddingBottom: 100 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 16px 8px" }}>
        <h1 style={{ fontSize: 18, fontWeight: 800, color: "#1C1917", margin: 0 }}>Блюда</h1>
        <button
          onClick={() => setShowCategories(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 10, border: "1px solid #E7E5E4", background: "#fff", color: "#57534E", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
        >
          <Settings2 size={14} /> Категории
        </button>
      </div>

      {categories.map((cat) => {
        const items = dishes.filter((d) => d.category_id === cat.id);
        if (!items.length) return null;
        return (
          <section key={cat.id} style={{ padding: "12px 16px 4px" }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: "#A8A29E", textTransform: "uppercase", letterSpacing: "0.03em", margin: "0 0 8px" }}>
              {cat.name_ru}
            </h2>
            {items.map((dish) => (
              <DishItem
                key={dish.id}
                dish={dish}
                onEdit={onEdit}
                onDelete={(d) => setPendingDelete(d)}
                showToast={showToast}
              />
            ))}
          </section>
        );
      })}

      <button
        onClick={onNew}
        style={{
          position: "fixed", bottom: 24, left: 16, right: 16, maxWidth: 480, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "15px 0",
          borderRadius: 16, background: "#C83E2B", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer",
          boxShadow: "0 8px 24px rgba(200,62,43,0.3)",
          zIndex: 50,
        }}
      >
        <Plus size={17} strokeWidth={2.5} /> Добавить блюдо
      </button>

      {pendingDelete && (
        <ConfirmDialog
          title="Удалить блюдо?"
          message={`«${pendingDelete.title_ru}» будет удалено безвозвратно, вместе со всеми порциями.`}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {showCategories && <CategoryManager categories={categories} onClose={() => setShowCategories(false)} />}
    </div>
  );
}