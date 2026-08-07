import { Plus, Trash2 } from "lucide-react";

const emptyPortion = () => ({ title_ru: "", title_kz: "", price: "", serves: "" });

const inputStyle = {
  width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #E7E5E4",
  fontSize: 13, color: "#1C1917", outline: "none",
};

/**
 * Manages a dish's list of portions (e.g. "1 порция — 2 кг" / "0.7 порции —
 * 1 кг"). A dish either has a flat `price` OR a portions list, never both —
 * DishForm enforces that by only rendering one of the two.
 */
export default function PortionsEditor({ portions, onChange }) {
  const update = (idx, field, value) => {
    onChange(portions.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));
  };
  const remove = (idx) => onChange(portions.filter((_, i) => i !== idx));
  const add = () => onChange([...portions, emptyPortion()]);

  return (
    <div>
      {portions.map((p, idx) => (
        <div key={idx} style={{ border: "1px solid #E7E5E4", borderRadius: 12, padding: 12, marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#78716C" }}>Название (RU)</label>
              <input value={p.title_ru} onChange={(e) => update(idx, "title_ru", e.target.value)} placeholder="1 порция — 2 кг" style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#78716C" }}>Название (KZ)</label>
              <input value={p.title_kz} onChange={(e) => update(idx, "title_kz", e.target.value)} placeholder="1 порция — 2 кг" style={inputStyle} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#78716C" }}>Цена, ₸</label>
              <input type="number" min="0" value={p.price} onChange={(e) => update(idx, "price", e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#78716C" }}>На сколько человек</label>
              <input value={p.serves} onChange={(e) => update(idx, "serves", e.target.value)} placeholder="3–4" style={inputStyle} />
            </div>
            <button
              type="button"
              onClick={() => remove(idx)}
              style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid #FECACA", background: "#FEF2F2", color: "#C83E2B", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1px dashed #D6D3D1", background: "#FAFAF9", color: "#57534E", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
      >
        <Plus size={14} /> Добавить порцию
      </button>
    </div>
  );
}
