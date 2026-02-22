"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Save, Plus, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import type { CategoryWithTreatments, Treatment } from "@/types/database";

const CARD = "#1C1C28";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const TEXT = "rgba(255,255,255,0.85)";
const TEXT_MUTED = "rgba(255,255,255,0.4)";
const GOLD = "#D4AF78";
const INPUT_BG = "rgba(255,255,255,0.05)";
const INPUT_BORDER = "rgba(255,255,255,0.1)";

const inputStyle: React.CSSProperties = {
  background: INPUT_BG,
  border: `1px solid ${INPUT_BORDER}`,
  borderRadius: "8px",
  padding: "6px 10px",
  fontSize: "13px",
  color: TEXT,
  outline: "none",
  width: "100%",
};

export default function PricesPage() {
  const t = useTranslations("admin");
  const [categories, setCategories] = useState<CategoryWithTreatments[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, Partial<Treatment>>>({});

  useEffect(() => {
    fetch("/api/treatments")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        if (data.length > 0) setOpenCategory(data[0].id);
        setLoading(false);
      });
  }, []);

  function handleEdit(id: string, field: keyof Treatment, value: unknown) {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  }

  async function saveTreatment(treatment: Treatment) {
    const changes = edits[treatment.id];
    if (!changes || Object.keys(changes).length === 0) return;

    setSaving(treatment.id);
    try {
      const res = await fetch(`/api/treatments/${treatment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });

      if (res.ok) {
        toast.success(t("priceEditor.saved"));
        setCategories((prev) =>
          prev.map((cat) => ({
            ...cat,
            treatments: cat.treatments.map((tr) =>
              tr.id === treatment.id ? { ...tr, ...changes } : tr
            ),
          }))
        );
        setEdits((prev) => {
          const next = { ...prev };
          delete next[treatment.id];
          return next;
        });
      } else {
        toast.error("Greška pri čuvanju.");
      }
    } finally {
      setSaving(null);
    }
  }

  async function toggleActive(treatment: Treatment) {
    const newActive = !treatment.is_active;
    handleEdit(treatment.id, "is_active", newActive);
    await fetch(`/api/treatments/${treatment.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: newActive }),
    });
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        treatments: cat.treatments.map((tr) =>
          tr.id === treatment.id ? { ...tr, is_active: newActive } : tr
        ),
      }))
    );
    toast.success(newActive ? "Tretman aktiviran." : "Tretman deaktiviran.");
  }

  function getValue<K extends keyof Treatment>(
    treatment: Treatment,
    field: K
  ): Treatment[K] {
    return edits[treatment.id]?.[field] !== undefined
      ? (edits[treatment.id][field] as Treatment[K])
      : treatment[field];
  }

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="font-heading text-3xl mb-8" style={{ color: TEXT }}>
          {t("priceEditor.title")}
        </h1>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-2xl animate-pulse"
              style={{ background: CARD }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl mb-1" style={{ color: TEXT }}>
          {t("priceEditor.title")}
        </h1>
        <p className="text-sm" style={{ color: TEXT_MUTED }}>
          Izmjene se odmah primjenjuju na sva 3 jezička sajta.
        </p>
        <div
          style={{
            height: "2px",
            width: "48px",
            background: `linear-gradient(to right, ${GOLD}, transparent)`,
            marginTop: "12px",
          }}
        />
      </div>

      <div className="space-y-3">
        {categories.map((cat) => {
          const isOpen = openCategory === cat.id;
          return (
            <div
              key={cat.id}
              className="rounded-2xl overflow-hidden"
              style={{
                background: CARD,
                border: `1px solid ${isOpen ? "rgba(212,175,120,0.2)" : CARD_BORDER}`,
                transition: "border-color 0.2s ease",
              }}
            >
              {/* Category header */}
              <button
                onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                className="w-full flex items-center justify-between p-5 bg-transparent border-none cursor-pointer text-left"
                style={{ transition: "background 0.2s ease" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color, boxShadow: `0 0 8px ${cat.color}80` }}
                  />
                  <span className="font-heading text-base font-semibold" style={{ color: TEXT }}>
                    {cat.name_me}
                  </span>
                  <span className="text-xs" style={{ color: TEXT_MUTED }}>
                    ({cat.treatments.length} stavki)
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp size={18} style={{ color: TEXT_MUTED }} />
                ) : (
                  <ChevronDown size={18} style={{ color: TEXT_MUTED }} />
                )}
              </button>

              {/* Treatments table */}
              {isOpen && (
                <div style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                  {/* Table header */}
                  <div
                    className="grid gap-3 px-5 py-2 text-xs font-semibold uppercase"
                    style={{
                      gridTemplateColumns: "2fr 2fr 2fr 1fr 80px 80px 60px",
                      color: TEXT_MUTED,
                      background: "rgba(255,255,255,0.02)",
                      letterSpacing: "0.5px",
                    }}
                  >
                    <span>{t("priceEditor.nameME")}</span>
                    <span>{t("priceEditor.nameEN")}</span>
                    <span>{t("priceEditor.nameRU")}</span>
                    <span>{t("priceEditor.price")}</span>
                    <span>{t("priceEditor.duration")}</span>
                    <span>{t("priceEditor.active")}</span>
                    <span></span>
                  </div>

                  {cat.treatments.map((treatment) => {
                    const hasEdits = !!(edits[treatment.id] && Object.keys(edits[treatment.id]).length > 0);
                    return (
                      <div
                        key={treatment.id}
                        className="grid gap-3 px-5 py-3 items-center"
                        style={{
                          gridTemplateColumns: "2fr 2fr 2fr 1fr 80px 80px 60px",
                          borderTop: `1px solid rgba(255,255,255,0.04)`,
                          opacity: treatment.is_active ? 1 : 0.4,
                        }}
                      >
                        <input
                          type="text"
                          value={getValue(treatment, "name_me") as string}
                          onChange={(e) => handleEdit(treatment.id, "name_me", e.target.value)}
                          style={inputStyle}
                          onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,120,0.5)"; }}
                          onBlur={(e) => { e.target.style.borderColor = INPUT_BORDER; }}
                        />
                        <input
                          type="text"
                          value={getValue(treatment, "name_en") as string}
                          onChange={(e) => handleEdit(treatment.id, "name_en", e.target.value)}
                          style={inputStyle}
                          onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,120,0.5)"; }}
                          onBlur={(e) => { e.target.style.borderColor = INPUT_BORDER; }}
                        />
                        <input
                          type="text"
                          value={getValue(treatment, "name_ru") as string}
                          onChange={(e) => handleEdit(treatment.id, "name_ru", e.target.value)}
                          style={inputStyle}
                          onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,120,0.5)"; }}
                          onBlur={(e) => { e.target.style.borderColor = INPUT_BORDER; }}
                        />
                        <input
                          type="text"
                          value={getValue(treatment, "price") as string}
                          onChange={(e) => handleEdit(treatment.id, "price", e.target.value)}
                          style={{ ...inputStyle, color: GOLD, fontWeight: 600 }}
                          onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,120,0.5)"; }}
                          onBlur={(e) => { e.target.style.borderColor = INPUT_BORDER; }}
                        />
                        <input
                          type="number"
                          value={(getValue(treatment, "duration_minutes") as number | null) ?? ""}
                          onChange={(e) =>
                            handleEdit(treatment.id, "duration_minutes", e.target.value ? parseInt(e.target.value) : null)
                          }
                          placeholder="min"
                          style={inputStyle}
                          onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,120,0.5)"; }}
                          onBlur={(e) => { e.target.style.borderColor = INPUT_BORDER; }}
                        />
                        <button
                          onClick={() => toggleActive(treatment)}
                          className="flex items-center justify-center bg-transparent border-none cursor-pointer"
                          title={treatment.is_active ? "Deaktiviraj" : "Aktiviraj"}
                        >
                          {treatment.is_active ? (
                            <Eye size={18} style={{ color: "#66BB6A" }} />
                          ) : (
                            <EyeOff size={18} style={{ color: "rgba(255,255,255,0.2)" }} />
                          )}
                        </button>
                        <button
                          onClick={() => saveTreatment(treatment)}
                          disabled={saving === treatment.id || !hasEdits}
                          className="flex items-center justify-center p-2 rounded-lg border-none cursor-pointer transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                          title={t("actions.save")}
                          style={
                            hasEdits
                              ? { background: "rgba(212,175,120,0.2)", color: GOLD, border: "1px solid rgba(212,175,120,0.35)" }
                              : { background: "rgba(255,255,255,0.04)", color: TEXT_MUTED }
                          }
                        >
                          <Save size={15} />
                        </button>
                      </div>
                    );
                  })}

                  {/* Add treatment */}
                  <div
                    className="px-5 py-3"
                    style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }}
                  >
                    <button
                      className="flex items-center gap-2 text-sm font-medium bg-transparent border-none cursor-pointer transition-all"
                      style={{ color: TEXT_MUTED }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = GOLD; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = TEXT_MUTED; }}
                    >
                      <Plus size={15} />
                      {t("actions.add")} tretman
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
