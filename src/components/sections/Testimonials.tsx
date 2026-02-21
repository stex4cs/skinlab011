"use client";

import { useTranslations } from "next-intl";

export default function Testimonials() {
  const t = useTranslations("testimonials");

  const items = [0, 1, 2];

  return (
    <section className="pt-24 pb-36" style={{ background: "var(--color-secondary)" }}>
      <div className="container">
        <h2 className="section-title">{t("title")}</h2>
        <p className="section-subtitle">{t("subtitle")}</p>

        <div className="grid md:grid-cols-3 gap-10">
          {items.map((i) => (
            <div
              key={i}
              className="rounded-2xl p-10 text-center shadow-sm hover:shadow-md transition-shadow"
              style={{ background: "var(--color-light)" }}
            >
              {/* Quote mark */}
              <div
                className="font-heading mb-6"
                style={{
                  fontSize: "4rem",
                  lineHeight: 1,
                  color: "var(--color-primary)",
                  opacity: 0.4,
                }}
              >
                &ldquo;
              </div>

              <p
                className="italic text-sm leading-relaxed mb-8"
                style={{ color: "var(--color-dark)", opacity: 0.7 }}
              >
                {t(`items.${i}.text`)}
              </p>

              {/* Stars */}
              <div className="mb-6" style={{ fontSize: "1rem", letterSpacing: "2px", color: "#F5C518" }}>
                ★★★★★
              </div>

              {/* Avatar */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: "var(--color-secondary)", fontSize: "1.5rem" }}
              >
                👤
              </div>

              <h4
                className="font-heading text-base font-semibold tracking-wide"
                style={{ color: "var(--color-dark)", letterSpacing: "1px" }}
              >
                {t(`items.${i}.name`)}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
