"use client";

import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, var(--color-secondary) 0%, var(--color-light) 100%)",
      }}
    >
      {/* Floating decoration */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full opacity-10 animate-float pointer-events-none"
        style={{
          background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
          top: "10%",
          right: "-5%",
        }}
      />
      <div
        className="absolute w-[200px] h-[200px] rounded-full opacity-5 animate-float pointer-events-none"
        style={{
          background: "linear-gradient(135deg, var(--color-accent), var(--color-primary))",
          bottom: "10%",
          left: "-3%",
          animationDelay: "3s",
        }}
      />

      <div className="text-center z-10 px-5">
        <h1
          className="font-heading text-6xl md:text-8xl font-light tracking-[8px] mb-4"
          style={{ color: "var(--color-primary)", letterSpacing: "8px" }}
        >
          {t("title")}
        </h1>
        <p
          className="text-lg md:text-xl mb-10 font-light tracking-wider"
          style={{ color: "rgba(44,44,44,0.7)" }}
        >
          {t("subtitle")}
        </p>
        <a
          href="#booking"
          className="cta-button"
          style={{
            background: "linear-gradient(135deg, #D4AF78, #C9A666)",
          }}
        >
          {t("cta")}
        </a>
      </div>
    </section>
  );
}
