"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

export default function About() {
  const t = useTranslations("about");

  const stats = [
    { value: t("stats.year"), label: t("stats.yearLabel") },
    { value: t("stats.clients"), label: t("stats.clientsLabel") },
    { value: t("stats.treatments"), label: t("stats.treatmentsLabel") },
  ];

  const credentials = [
    t("owner.credentials.cert"),
    t("owner.credentials.spec"),
    t("owner.credentials.exp"),
    t("owner.credentials.intl"),
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container">
        <h2 className="section-title">{t("title")}</h2>

        <div className="grid md:grid-cols-2 gap-12 mt-12 items-stretch">

          {/* Left column: story + stats + Neda bio */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h3 className="font-heading text-2xl font-semibold text-dark mb-4">
              {t("storyTitle")}
            </h3>
            <p className="text-dark/70 mb-4 leading-relaxed">{t("storyP1")}</p>
            <p className="text-dark/70 mb-8 leading-relaxed">{t("storyP2")}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-xl"
                  style={{ background: "var(--color-secondary)" }}
                >
                  <div
                    className="text-2xl font-bold font-heading"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-dark/60 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Neda bio - directly below stats, stretches to fill remaining height */}
            <div
              className="rounded-2xl p-7"
              style={{ background: "var(--color-secondary)", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            >
              <h3 className="font-heading text-xl font-semibold text-dark mb-1">
                {t("owner.name")}
              </h3>
              <p
                className="mb-4 text-sm font-medium"
                style={{ color: "var(--color-primary)" }}
              >
                {t("owner.title")}
              </p>
              <p className="text-dark/70 text-sm leading-relaxed mb-6">
                {t("owner.bio")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {credentials.map((cred) => (
                  <div
                    key={cred}
                    className="bg-white rounded-xl p-3 text-center text-xs text-dark/70 shadow-sm"
                  >
                    {cred}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Neda image – fills full column height */}
          <div style={{ position: "relative", minHeight: "500px" }}>
            <div className="rounded-2xl overflow-hidden shadow-xl" style={{ height: "100%" }}>
              <Image
                src="/images/neda.png"
                alt="SkinLab 011 - Neda Vukobrat"
                width={500}
                height={800}
                className="w-full object-cover"
                style={{ height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
