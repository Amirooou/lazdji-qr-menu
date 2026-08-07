import { useState } from "react";
import { X, Plus, Trash2, Save } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "../services/adminService";
import ConfirmDialog from "./ConfirmDialog";

const inputStyle = {
  padding: "8px 10px", borderRadius: 8, border: "1px solid #E7E5E4",
  fontSize: 13, color: "#1C1917", outline: "none",
};

function Row({ category, onSaved }) {
  const [name_ru, setNameRu] = useState(category.name_ru);
  const [name_kz, setNameKz] = useState(category.name_kz);
  const [order, setOrder] = useState(category.order);
  const [pendingDelete, setPendingDelete] = useState(false);
  const dirty = name_ru !== category.name_ru || name_kz !== category.name_kz || order !== category.order;

  const save = async () => {
    await updateCategory(category.id, { name_ru, name_kz, order: Number(order) });
  };

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}>
      <input value={name_ru} onChange={(e) => setNameRu(e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="Название RU" />
      <input value={name_kz} onChange={(e) => setNameKz(e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="Название KZ" />
      <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} style={{ ...inputStyle, width: 56 }} />
      <button
        onClick={save}
        disabled={!dirty}
        style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: dirty ? "#1C1917" : "#F5F5F4", color: dirty ? "#fff" : "#D6D3D1", cursor: dirty ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
      >
        <Save size={13} />
      </button>
      <button
        onClick={() => setPendingDelete(true)}
        style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#FEF2F2", color: "#C83E2B", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
      >
        <Trash2 size={13} />
      </button>

      {pendingDelete && (
        <ConfirmDialog
          title="Удалить категорию?"
          message="Возможно только если в ней больше нет блюд."
          onConfirm={async () => {
            try {
              await deleteCategory(category.id);
            } finally {
              setPendingDelete(false);
            }
          }}
          onCancel={() => setPendingDelete(false)}
        />
      )}
    </div>
  );
}

export default function CategoryManager({ categories, onClose }) {
  const [newRu, setNewRu] = useState("");
  const [newKz, setNewKz] = useState("");

  const addCategory = async () => {
    if (!newRu.trim() || !newKz.trim()) return;
    const nextOrder = Math.max(0, ...categories.map((c) => c.order)) + 1;
    await createCategory({ name_ru: newRu.trim(), name_kz: newKz.trim(), order: nextOrder });
    setNewRu("");
    setNewKz("");
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 480, maxHeight: "85vh", overflowY: "auto", background: "#F9F8F6", borderRadius: "20px 20px 0 0", padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: "#1C1917", margin: 0 }}>Категории</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 16, border: "none", background: "#F5F5F4", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={15} color="#57534E" />
          </button>
        </div>

        {categories.sort((a, b) => a.order - b.order).map((cat) => (
          <Row key={cat.id} category={cat} />
        ))}

        <div style={{ display: "flex", gap: 6, marginTop: 12, paddingTop: 12, borderTop: "1px solid #E7E5E4" }}>
          <input value={newRu} onChange={(e) => setNewRu(e.target.value)} placeholder="Новая (RU)" style={{ ...inputStyle, flex: 1 }} />
          <input value={newKz} onChange={(e) => setNewKz(e.target.value)} placeholder="Новая (KZ)" style={{ ...inputStyle, flex: 1 }} />
          <button onClick={addCategory} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#1C1917", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
