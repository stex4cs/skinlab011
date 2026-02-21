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
    <section id="services" className="py-20" style={{ background: "var(--color-light)" }}>
      <div className="container">
        <h2 className="section-title">{t("title")}</h2>
        <p className="section-subtitle">{t("subtitle")}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceKeys.map(({ key, icon }) => (
            <div
              key={key}
              className="service-card"
            >
              <div className="text-5xl mb-4">{icon}</div>
              <h3 className="">
                {t(`items.${key}.title`)}
              </h3>
              <p className="">
                {t(`items.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
