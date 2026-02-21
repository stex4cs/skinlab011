"use client";

import { useTranslations } from "next-intl";

export default function Testimonials() {
  const t = useTranslations("testimonials");

  const items = [0, 1, 2];

  return (
    <section className="py-20" style={{ background: "var(--color-secondary)" }}>
      <div className="container">
        <h2 className="section-title">{t("title")}</h2>
        <p className="section-subtitle">{t("subtitle")}</p>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((i) => (
            <div
              key={i}
              className="bg-light rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 text-2xl">
                👤
              </div>
              <h4 className="font-heading text-lg font-semibold text-dark mb-3">
                {t(`items.${i}.name`)}
              </h4>
              <p className="text-dark/60 italic text-sm leading-relaxed">
                &ldquo;{t(`items.${i}.text`)}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
