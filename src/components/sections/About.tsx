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

  const values = [
    { key: "quality", icon: "💎" },
    { key: "trust", icon: "🤝" },
    { key: "expertise", icon: "🌟" },
    { key: "personal", icon: "💖" },
  ] as const;

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container">
        <h2 className="section-title">{t("title")}</h2>

        <div className="grid md:grid-cols-2 gap-12 mt-12">
          {/* Story */}
          <div>
            <h3 className="font-heading text-2xl font-semibold text-dark mb-4">
              {t("storyTitle")}
            </h3>
            <p className="text-dark/70 mb-4 leading-relaxed">{t("storyP1")}</p>
            <p className="text-dark/70 mb-8 leading-relaxed">{t("storyP2")}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-white rounded-xl">
                  <div className="text-2xl font-bold text-primary font-heading">
                    {stat.value}
                  </div>
                  <div className="text-xs text-dark/60 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/neda.png"
                alt="SkinLab 011"
                width={500}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* Owner */}
        <div className="mt-16 bg-white rounded-2xl p-8 md:p-12 shadow-lg">
          <h3 className="font-heading text-2xl font-semibold text-dark mb-2">
            {t("owner.name")}
          </h3>
          <p className="mb-4" style={{ color: "var(--color-primary)", fontWeight: 500 }}>{t("owner.title")}</p>
          <p className="text-dark/70 mb-6 leading-relaxed">{t("owner.bio")}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {credentials.map((cred) => (
              <div
                key={cred}
                className="bg-secondary/50 rounded-lg p-3 text-center text-sm text-dark/80"
              >
                {cred}
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mt-16">
          <h3 className="font-heading text-2xl font-semibold text-dark text-center mb-8">
            {t("values.title")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {values.map(({ key, icon }) => (
              <div key={key} className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-4xl mb-3">{icon}</div>
                <h4 className="font-heading text-lg font-semibold text-dark">
                  {t(`values.${key}.title`)}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
