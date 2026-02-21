"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CategoryWithTreatments, Locale } from "@/types/database";
import { getLocalizedName } from "@/types/database";

export default function Pricing() {
  const t = useTranslations("pricing");
  const locale = useLocale() as Locale;
  const [categories, setCategories] = useState<CategoryWithTreatments[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPricing() {
      const supabase = createClient();

      const { data: cats } = await supabase
        .from("treatment_categories")
        .select("*")
        .order("sort_order");

      if (!cats) {
        setLoading(false);
        return;
      }

      const { data: treatments } = await supabase
        .from("treatments")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      const categoriesWithTreatments: CategoryWithTreatments[] = cats.map(
        (cat) => ({
          ...cat,
          treatments: (treatments || []).filter(
            (t) => t.category_id === cat.id
          ),
        })
      );

      setCategories(categoriesWithTreatments);
      setLoading(false);
    }

    fetchPricing();
  }, []);

  if (loading) {
    return (
      <section id="pricing" className="py-20 bg-light">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="section-title">{t("title")}</h2>
          <p className="section-subtitle">{t("subtitle")}</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-6 bg-secondary rounded w-1/2 mx-auto mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-4 bg-secondary rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-20 bg-light">
      <div className="container">
        <h2 className="section-title">{t("title")}</h2>
        <p className="section-subtitle">{t("subtitle")}</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3
                className="font-heading text-xl font-semibold text-center mb-4 pb-3"
                style={{ borderBottom: `2px solid ${category.color}` }}
              >
                {getLocalizedName(category, locale)}
              </h3>
              <div className="flex flex-col gap-2">
                {category.treatments.map((treatment) => (
                  <div
                    key={treatment.id}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-none"
                  >
                    <span className="text-sm text-dark/80 pr-2">
                      {getLocalizedName(treatment, locale)}
                    </span>
                    <span className="text-sm font-semibold text-primary whitespace-nowrap">
                      {treatment.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
