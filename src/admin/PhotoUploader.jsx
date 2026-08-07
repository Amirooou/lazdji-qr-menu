import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uploadDishPhoto } from "../services/adminService";

/**
 * Handles the file picker + upload-to-Supabase-Storage + preview. Reports
 * the resulting public URL back via `onChange` — the parent form just
 * treats it as another field, same as title or price.
 */
export default function PhotoUploader({ value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadDishPhoto(file);
      onChange(url);
    } catch (err) {
      setError("Не удалось загрузить фото. Попробуйте ещё раз.");
    } finally {
      setUploading(false);
      e.target.value = ""; // allow re-selecting the same file
    }
  };

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />

      {value ? (
        <div style={{ position: "relative", width: "100%", height: 180, borderRadius: 14, overflow: "hidden", background: "#F5F5F4" }}>
          <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <button
            type="button"
            onClick={() => onChange("")}
            style={{ position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: 15, background: "rgba(0,0,0,0.55)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <X size={15} color="#fff" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            style={{ position: "absolute", bottom: 8, right: 8, padding: "6px 12px", borderRadius: 10, background: "rgba(0,0,0,0.55)", border: "none", cursor: "pointer", color: "#fff", fontSize: 12, fontWeight: 600 }}
          >
            Заменить
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            width: "100%", height: 180, borderRadius: 14, border: "1.5px dashed #D6D3D1", background: "#FAFAF9",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer",
          }}
        >
          {uploading ? (
            <>
              <Loader2 size={22} strokeWidth={2} color="#78716C" className="spin" />
              <span style={{ fontSize: 13, color: "#78716C" }}>Загружаем…</span>
            </>
          ) : (
            <>
              <ImagePlus size={22} strokeWidth={1.8} color="#A8A29E" />
              <span style={{ fontSize: 13, color: "#78716C" }}>Загрузить фото</span>
            </>
          )}
        </button>
      )}

      {error && <p style={{ fontSize: 12.5, color: "#C83E2B", marginTop: 8 }}>{error}</p>}
    </div>
  );
}
