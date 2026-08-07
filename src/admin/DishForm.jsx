import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { saveDish } from "../services/adminService";
import { useApp } from "../context/AppContext";
import PhotoUploader from "./PhotoUploader";
import PortionsEditor from "./PortionsEditor";

const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E7E5E4",
  fontSize: 14, color: "#1C1917", outline: "none", fontFamily: "inherit",
};
const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#78716C", marginBottom: 6 };

function emptyDish(categoryId) {
  return {
    category_id: categoryId || "",
    title_ru: "", title_kz: "",
    description_ru: "", description_kz: "",
    price: "",
    photo: "",
    available: true,
    is_signature: false,
    is_spicy: false,
    is_new: false,
    portions: [],
  };
}

/**
 * Create/edit form for a single dish. A dish is priced one of two ways —
 * a flat `price`, or a list of `portions` — never both; the toggle below
 * switches which one the form collects and blanks out the other before
 * saving, so the database never ends up with both set.
 */
export default function DishForm({ dish, categories, onSaved, onCancel }) {
  const { showToast } = useApp();
  const [form, setForm] = useState(() =>
    dish
      ? { ...dish, price: dish.price ?? "", portions: dish.portions?.length ? dish.portions : [] }
      : emptyDish(categories[0]?.id)
  );
  const [usesPortions, setUsesPortions] = useState(Boolean(dish?.portions?.length));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        price: usesPortions ? null : Number(form.price) || 0,
        portions: usesPortions
          ? form.portions.map((p) => ({ ...p, price: Number(p.price) || 0 }))
          : [],
      };
      await saveDish(payload);
      showToast(dish ? "Изменения сохранены" : "Блюдо добавлено");
      onSaved();
    } catch (err) {
      setError(err.message || "Не удалось сохранить блюдо");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F9F8F6" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#fff", borderBottom: "1px solid #E7E5E4", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
        <button type="button" onClick={onCancel} style={{ width: 36, height: 36, borderRadius: 10, border: "none", background: "#F5F5F4", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft size={18} color="#1C1917" />
        </button>
        <h1 style={{ fontSize: 16, fontWeight: 800, color: "#1C1917", margin: 0 }}>
          {dish ? "Редактировать блюдо" : "Новое блюдо"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "20px 16px 100px", maxWidth: 560, margin: "0 auto" }}>
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Фото</label>
          <PhotoUploader value={form.photo} onChange={(url) => set("photo", url)} />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Категория</label>
          <select value={form.category_id} onChange={(e) => set("category_id", e.target.value)} required style={inputStyle}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name_ru}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Название (RU)</label>
            <input value={form.title_ru} onChange={(e) => set("title_ru", e.target.value)} required style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Название (KZ)</label>
            <input value={form.title_kz} onChange={(e) => set("title_kz", e.target.value)} required style={inputStyle} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Описание (RU)</label>
            <textarea rows={3} value={form.description_ru} onChange={(e) => set("description_ru", e.target.value)} style={{ ...inputStyle, resize: "none" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Описание (KZ)</label>
            <textarea rows={3} value={form.description_kz} onChange={(e) => set("description_kz", e.target.value)} style={{ ...inputStyle, resize: "none" }} />
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Цена</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <button
              type="button"
              onClick={() => setUsesPortions(false)}
              style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: !usesPortions ? "1px solid #1C1917" : "1px solid #E7E5E4", background: !usesPortions ? "#1C1917" : "#fff", color: !usesPortions ? "#fff" : "#57534E", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
            >
              Обычная цена
            </button>
            <button
              type="button"
              onClick={() => setUsesPortions(true)}
              style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: usesPortions ? "1px solid #1C1917" : "1px solid #E7E5E4", background: usesPortions ? "#1C1917" : "#fff", color: usesPortions ? "#fff" : "#57534E", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
            >
              Несколько порций
            </button>
          </div>

          {usesPortions ? (
            <PortionsEditor portions={form.portions} onChange={(p) => set("portions", p)} />
          ) : (
            <input type="number" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} required style={inputStyle} />
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          {[
            ["is_signature", "Фирменное блюдо"],
            ["is_spicy", "Острое"],
            ["is_new", "Новинка"],
            ["available", "Показывать в меню"],
          ].map(([field, label]) => (
            <label key={field} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#1C1917", cursor: "pointer" }}>
              <input type="checkbox" checked={form[field]} onChange={(e) => set(field, e.target.checked)} style={{ width: 18, height: 18 }} />
              {label}
            </label>
          ))}
        </div>

        {error && <p style={{ fontSize: 13, color: "#C83E2B", marginBottom: 12 }}>{error}</p>}

        <button
          type="submit"
          disabled={saving}
          style={{ width: "100%", padding: "13px 0", borderRadius: 12, background: "#1C1917", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: saving ? 0.6 : 1 }}
        >
          {saving && <Loader2 size={16} className="spin" />}
          {saving ? "Сохраняем…" : "Сохранить"}
        </button>
      </form>
    </div>
  );
}
