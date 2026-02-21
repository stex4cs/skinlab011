"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Save, Plus, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import type { CategoryWithTreatments, Treatment } from "@/types/database";

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
        // Update local state
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
        <h1 className="font-heading text-3xl text-dark mb-8">{t("priceEditor.title")}</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-white rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="font-heading text-3xl text-dark mb-2">{t("priceEditor.title")}</h1>
      <p className="text-dark/50 text-sm mb-8">
        Izmjene se odmah primjenjuju na sva 3 jezička sajta.
      </p>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Category header */}
            <button
              onClick={() => setOpenCategory(openCategory === cat.id ? null : cat.id)}
              className="w-full flex items-center justify-between p-5 bg-transparent border-none cursor-pointer text-left hover:bg-light/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="font-heading text-lg font-semibold text-dark">
                  {cat.name_me}
                </span>
                <span className="text-dark/40 text-sm">
                  ({cat.treatments.length} stavki)
                </span>
              </div>
              {openCategory === cat.id ? (
                <ChevronUp size={20} className="text-dark/40" />
              ) : (
                <ChevronDown size={20} className="text-dark/40" />
              )}
            </button>

            {/* Treatments table */}
            {openCategory === cat.id && (
              <div className="border-t border-gray-100">
                {/* Table header */}
                <div
                  className="grid gap-3 px-5 py-2 text-xs font-semibold text-dark/40 uppercase bg-light/50"
                  style={{ gridTemplateColumns: "2fr 2fr 2fr 1fr 80px 80px 60px" }}
                >
                  <span>{t("priceEditor.nameME")}</span>
                  <span>{t("priceEditor.nameEN")}</span>
                  <span>{t("priceEditor.nameRU")}</span>
                  <span>{t("priceEditor.price")}</span>
                  <span>{t("priceEditor.duration")}</span>
                  <span>{t("priceEditor.active")}</span>
                  <span></span>
                </div>

                {cat.treatments.map((treatment) => (
                  <div
                    key={treatment.id}
                    className={`grid gap-3 px-5 py-3 items-center border-b border-gray-50 last:border-none ${
                      !treatment.is_active ? "opacity-50" : ""
                    }`}
                    style={{ gridTemplateColumns: "2fr 2fr 2fr 1fr 80px 80px 60px" }}
                  >
                    <input
                      type="text"
                      value={getValue(treatment, "name_me") as string}
                      onChange={(e) => handleEdit(treatment.id, "name_me", e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary w-full"
                    />
                    <input
                      type="text"
                      value={getValue(treatment, "name_en") as string}
                      onChange={(e) => handleEdit(treatment.id, "name_en", e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary w-full"
                    />
                    <input
                      type="text"
                      value={getValue(treatment, "name_ru") as string}
                      onChange={(e) => handleEdit(treatment.id, "name_ru", e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary w-full"
                    />
                    <input
                      type="text"
                      value={getValue(treatment, "price") as string}
                      onChange={(e) => handleEdit(treatment.id, "price", e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary w-full font-semibold text-primary"
                    />
                    <input
                      type="number"
                      value={(getValue(treatment, "duration_minutes") as number | null) ?? ""}
                      onChange={(e) =>
                        handleEdit(treatment.id, "duration_minutes", e.target.value ? parseInt(e.target.value) : null)
                      }
                      placeholder="min"
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary w-full"
                    />
                    <button
                      onClick={() => toggleActive(treatment)}
                      className="flex items-center justify-center bg-transparent border-none cursor-pointer"
                      title={treatment.is_active ? "Deaktiviraj" : "Aktiviraj"}
                    >
                      {treatment.is_active ? (
                        <Eye size={18} className="text-green-500" />
                      ) : (
                        <EyeOff size={18} className="text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => saveTreatment(treatment)}
                      disabled={saving === treatment.id || !edits[treatment.id]}
                      className="flex items-center justify-center p-2 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white border-none cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      title={t("actions.save")}
                    >
                      <Save size={16} />
                    </button>
                  </div>
                ))}

                {/* Add treatment button */}
                <div className="px-5 py-3 bg-light/30">
                  <button className="flex items-center gap-2 text-sm text-primary hover:text-accent font-medium bg-transparent border-none cursor-pointer">
                    <Plus size={16} />
                    {t("actions.add")} tretman
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
