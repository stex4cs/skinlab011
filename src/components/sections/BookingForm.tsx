"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import type { CategoryWithTreatments, Locale } from "@/types/database";
import { getLocalizedName } from "@/types/database";
import { TIME_SLOTS } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function BookingForm() {
  const t = useTranslations("booking");
  const locale = useLocale() as Locale;
  const [categories, setCategories] = useState<CategoryWithTreatments[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetch() {
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
            treatments: treatments.filter((t) => t.category_id === cat.id),
          }))
        );
      }
    }
    fetch();
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
    <section id="booking" className="py-20 px-5 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">{t("title")}</h2>
        <p className="section-subtitle">{t("subtitle")}</p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Why book */}
          <div>
            <h3 className="font-heading text-2xl font-semibold text-dark mb-6">
              {t("whyTitle")}
            </h3>
            {(["fast", "premium", "expert", "personal"] as const).map((key) => (
              <div key={key} className="flex items-start gap-4 mb-6">
                <div className="text-3xl">{t(`reasons.${key}.icon`)}</div>
                <div>
                  <h4 className="font-semibold text-dark mb-1">
                    {t(`reasons.${key}.title`)}
                  </h4>
                  <p className="text-dark/60 text-sm">
                    {t(`reasons.${key}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">
                  {t("form.name")} *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">
                  {t("form.email")} *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-dark mb-1">
                {t("form.phone")} *
              </label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-dark mb-1">
                {t("form.treatment")} *
              </label>
              <select
                name="treatment"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white"
              >
                <option value="">{t("form.treatment")}</option>
                {categories.map((cat) => (
                  <optgroup key={cat.id} label={getLocalizedName(cat, locale)}>
                    {cat.treatments.map((tr) => (
                      <option key={tr.id} value={tr.id}>
                        {getLocalizedName(tr, locale)} - {tr.price}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">
                  {t("form.date")} *
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  min={today}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">
                  {t("form.time")} *
                </label>
                <select
                  name="time"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors bg-white"
                >
                  <option value="">{t("form.time")}</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-dark mb-1">
                {t("form.message")}
              </label>
              <textarea
                name="message"
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 text-white font-semibold text-sm tracking-wider rounded-xl border-none cursor-pointer transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
              }}
            >
              {submitting && <Loader2 size={18} className="animate-spin" />}
              {submitting ? t("form.submitting") : t("form.submit")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
