"use client";

import { useTranslations } from "next-intl";

const serviceKeys = [
  { key: "facial", icon: "✨" },
  { key: "body", icon: "💆" },
  { key: "massage", icon: "🤲" },
  { key: "waxCold", icon: "🦵" },
  { key: "waxSugar", icon: "🍯" },
  { key: "laser", icon: "⚡" },
  { key: "nails", icon: "💅" },
  { key: "brows", icon: "👁️" },
] as const;

export default function Services() {
  const t = useTranslations("services");

  return (
    <section id="services" className="py-20 px-5 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">{t("title")}</h2>
        <p className="section-subtitle">{t("subtitle")}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceKeys.map(({ key, icon }) => (
            <div
              key={key}
              className="bg-light rounded-2xl p-8 text-center transition-all hover:-translate-y-2 hover:shadow-xl cursor-pointer"
            >
              <div className="text-5xl mb-4">{icon}</div>
              <h3 className="font-heading text-xl font-semibold text-dark mb-3">
                {t(`items.${key}.title`)}
              </h3>
              <p className="text-dark/60 text-sm leading-relaxed">
                {t(`items.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
