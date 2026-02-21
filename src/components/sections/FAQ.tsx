"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = Array.from({ length: 10 }, (_, i) => i);

  return (
    <section id="faq" className="py-20 px-5 bg-light">
      <div className="max-w-3xl mx-auto">
        <h2 className="section-title">{t("title")}</h2>
        <p className="section-subtitle">{t("subtitle")}</p>

        <div className="flex flex-col gap-3">
          {items.map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center p-5 text-left bg-transparent border-none cursor-pointer text-dark font-medium text-base hover:text-primary transition-colors"
              >
                <span>{t(`items.${i}.q`)}</span>
                <ChevronDown
                  size={20}
                  className={`transition-transform flex-shrink-0 ml-4 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? "max-h-[500px]" : "max-h-0"
                }`}
              >
                <p className="px-5 pb-5 text-dark/60 leading-relaxed text-sm">
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
