"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import type { CategoryWithTreatments, Locale } from "@/types/database";
import { getLocalizedName } from "@/types/database";
import { TIME_SLOTS } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.85rem 1.1rem",
  border: "1px solid rgba(212,175,120,0.3)",
  borderRadius: "12px",
  fontSize: "0.88rem",
  fontFamily: "var(--font-body)",
  color: "var(--color-dark)",
  background: "var(--color-light)",
  outline: "none",
  transition: "border-color 0.2s ease",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.8px",
  textTransform: "uppercase",
  marginBottom: "0.4rem",
  color: "rgba(44,44,44,0.65)",
};

export default function BookingForm() {
  const t = useTranslations("booking");
  const locale = useLocale() as Locale;
  const [categories, setCategories] = useState<CategoryWithTreatments[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data: cats } = await supabase
        .from("treatment_categories")
        .select("*")
        .order("sort_order");
      const { data: treatments } = await supabase
        .from("treatments")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (cats && treatments) {
        setCategories(
          cats.map((cat) => ({
            ...cat,
            treatments: treatments.filter((tr) => tr.category_id === cat.id),
          }))
        );
      }
    }
    fetchData();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      treatmentId: formData.get("treatment") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      message: formData.get("message") as string,
      locale,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(t("form.success"));
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(result.message || t("form.error"));
      }
    } catch {
      toast.error(t("form.error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="booking" className="pt-24 pb-36" style={{ background: "var(--color-secondary)" }}>
      <div className="container">
        <h2 className="section-title">{t("title")}</h2>
        <p className="section-subtitle">{t("subtitle")}</p>

        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* Left – Why book */}
          <div>
            <h3
              className="font-heading mb-10"
              style={{ fontSize: "1.8rem", color: "var(--color-dark)", fontWeight: 400 }}
            >
              {t("whyTitle")}
            </h3>
            {(["fast", "premium", "expert", "personal"] as const).map((key) => (
              <div key={key} className="flex items-start gap-5 mb-8">
                <div
                  className="flex items-center justify-center flex-shrink-0 rounded-full text-xl"
                  style={{
                    width: "54px",
                    height: "54px",
                    background: "white",
                    boxShadow: "0 4px 20px rgba(212,175,120,0.2)",
                  }}
                >
                  {t(`reasons.${key}.icon`)}
                </div>
                <div>
                  <h4
                    className="font-semibold mb-1"
                    style={{ fontSize: "0.95rem", color: "var(--color-dark)" }}
                  >
                    {t(`reasons.${key}.title`)}
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "rgba(44,44,44,0.58)", lineHeight: 1.75 }}>
                    {t(`reasons.${key}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right – Form */}
          <div
            className="rounded-2xl"
            style={{
              background: "white",
              padding: "2.5rem",
              boxShadow: "0 20px 60px rgba(212,175,120,0.15)",
            }}
          >
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label style={labelStyle}>{t("form.name")} *</label>
                  <input type="text" name="name" required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{t("form.email")} *</label>
                  <input type="email" name="email" required style={inputStyle} />
                </div>
              </div>

              <div className="mb-5">
                <label style={labelStyle}>{t("form.phone")} *</label>
                <input type="tel" name="phone" required style={inputStyle} />
              </div>

              <div className="mb-5">
                <label style={labelStyle}>{t("form.treatment")} *</label>
                <select
                  name="treatment"
                  required
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="">{t("form.treatment")}</option>
                  {categories.map((cat) => (
                    <optgroup key={cat.id} label={getLocalizedName(cat, locale)}>
                      {cat.treatments.map((tr) => (
                        <option key={tr.id} value={tr.id}>
                          {getLocalizedName(tr, locale)} — {tr.price}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label style={labelStyle}>{t("form.date")} *</label>
                  <input type="date" name="date" required min={today} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{t("form.time")} *</label>
                  <select
                    name="time"
                    required
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    <option value="">{t("form.time")}</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-8">
                <label style={labelStyle}>{t("form.message")}</label>
                <textarea
                  name="message"
                  rows={3}
                  style={{ ...inputStyle, resize: "none" }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="cta-button"
                style={{
                  width: "100%",
                  border: "none",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                {submitting && <Loader2 size={18} className="animate-spin" />}
                {submitting ? t("form.submitting") : t("form.submit")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
