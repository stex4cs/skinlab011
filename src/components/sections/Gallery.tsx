"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, Instagram } from "lucide-react";

const filterKeys = ["all", "facial", "body", "nails", "brows", "laser"] as const;

// Placeholder gallery items - replace with real images
const galleryItems = [
  { id: 1, src: "/images/gallery/work1.jpg", title: "Tretman lica", category: "facial" },
  { id: 2, src: "/images/gallery/work2.jpg", title: "Anti-celulit", category: "body" },
  { id: 3, src: "/images/gallery/work3.jpg", title: "Gel manikir", category: "nails" },
  { id: 4, src: "/images/gallery/work4.jpg", title: "Laminacija obrva", category: "brows" },
  { id: 5, src: "/images/gallery/work5.jpg", title: "Laserska epilacija", category: "laser" },
  { id: 6, src: "/images/gallery/work6.jpg", title: "Hidratacija", category: "facial" },
];

const beforeAfterItems = [
  { id: 1, before: "/images/gallery/before1.jpg", after: "/images/gallery/after1.jpg", title: "Dubinsko čišćenje lica + Hidratacija", category: "facial" },
  { id: 2, before: "/images/gallery/before2.jpg", after: "/images/gallery/after2.jpg", title: "Anti-celulitni tretman", category: "body" },
  { id: 3, before: "/images/gallery/before3.jpg", after: "/images/gallery/after3.jpg", title: "Laserska epilacija - 6 tretmana", category: "laser" },
];

export default function Gallery() {
  const t = useTranslations("gallery");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(null);

  const filteredGallery = activeFilter === "all"
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeFilter);

  const filteredBA = activeFilter === "all"
    ? beforeAfterItems
    : beforeAfterItems.filter((item) => item.category === activeFilter);

  return (
    <section id="gallery" className="py-20 px-5 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">{t("title")}</h2>
        <p className="section-subtitle">{t("subtitle")}</p>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {filterKeys.map((key) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-5 py-2 rounded-full text-sm font-medium border-none cursor-pointer transition-all ${
                activeFilter === key
                  ? "bg-primary text-white"
                  : "bg-secondary text-dark hover:bg-primary hover:text-white"
              }`}
            >
              {t(`filters.${key}`)}
            </button>
          ))}
        </div>

        {/* Before & After */}
        {filteredBA.length > 0 && (
          <div className="mb-12">
            <h3 className="font-heading text-2xl font-semibold text-center mb-6">
              {t("beforeAfter")}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {filteredBA.map((item) => (
                <div key={item.id} className="bg-light rounded-2xl p-4">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="text-center">
                      <div className="bg-secondary rounded-lg h-48 flex items-center justify-center text-dark/30">
                        {t("before")}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-secondary rounded-lg h-48 flex items-center justify-center text-dark/30">
                        {t("after")}
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm text-dark/70 font-medium">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio */}
        <h3 className="font-heading text-2xl font-semibold text-center mb-6">
          {t("portfolio")}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightbox({ src: item.src, title: item.title })}
              className="relative rounded-xl overflow-hidden cursor-pointer group bg-secondary h-64 flex items-center justify-center"
            >
              <span className="text-dark/30 text-sm">{item.title}</span>
              <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/50 transition-all flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram */}
        <div className="mt-16 text-center">
          <h3 className="font-heading text-2xl font-semibold mb-2">
            {t("instagram.title")}
          </h3>
          <p className="text-primary font-medium mb-6">{t("instagram.handle")}</p>
          <a
            href="https://instagram.com/skinlab011"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white font-semibold text-sm no-underline hover:scale-105 transition-transform"
            style={{
              background: "linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)",
            }}
          >
            <Instagram size={20} />
            {t("instagram.button")}
          </a>
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div
            className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 text-white bg-transparent border-none cursor-pointer"
            >
              <X size={32} />
            </button>
            <div className="max-w-4xl w-full text-center">
              <div className="bg-secondary rounded-xl h-96 flex items-center justify-center mb-4">
                <span className="text-dark/30">{lightbox.title}</span>
              </div>
              <p className="text-white text-lg">{lightbox.title}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
