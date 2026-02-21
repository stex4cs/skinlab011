"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = Array.from({ length: 10 }, (_, i) => i);

  return (
    <section id="faq" className="py-24" style={{ background: "var(--color-light)" }}>
      <div className="container">
        <h2 className="section-title">{t("title")}</h2>
        <p className="section-subtitle">{t("subtitle")}</p>

        <div style={{ maxWidth: "820px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {items.map((i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "white",
                boxShadow: openIndex === i
                  ? "0 8px 30px rgba(212,175,120,0.15)"
                  : "0 2px 12px rgba(0,0,0,0.04)",
                border: openIndex === i
                  ? "1px solid rgba(212,175,120,0.3)"
                  : "1px solid rgba(0,0,0,0.04)",
                transition: "box-shadow 0.3s ease, border-color 0.3s ease",
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center text-left bg-transparent border-none cursor-pointer"
                style={{
                  padding: "1.3rem 1.6rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.93rem",
                  fontWeight: 500,
                  letterSpacing: "0.2px",
                  color: openIndex === i ? "var(--color-primary)" : "var(--color-dark)",
                  transition: "color 0.3s ease",
                }}
              >
                <span>{t(`items.${i}.q`)}</span>
                <ChevronDown
                  size={20}
                  style={{
                    flexShrink: 0,
                    marginLeft: "1rem",
                    color: "var(--color-primary)",
                    transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                />
              </button>
              <div
                style={{
                  overflow: "hidden",
                  maxHeight: openIndex === i ? "600px" : "0",
                  transition: "max-height 0.35s ease",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    padding: "1rem 1.6rem 1.5rem",
                    fontSize: "0.87rem",
                    lineHeight: "1.85",
                    color: "rgba(44,44,44,0.62)",
                    borderTop: "1px solid rgba(212,175,120,0.18)",
                  }}
                >
                  {t(`items.${i}.a`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
