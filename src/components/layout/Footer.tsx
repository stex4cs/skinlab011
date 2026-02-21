"use client";

import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  const links = [
    { href: "#home", label: nav("home") },
    { href: "#services", label: nav("services") },
    { href: "#pricing", label: nav("pricing") },
    { href: "#contact", label: nav("contact") },
  ];

  return (
    <footer className="bg-dark text-white py-8">
      <div className="max-w-7xl mx-auto px-5 text-center">
        <div className="flex justify-center gap-6 mb-6 flex-wrap">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-white/80 no-underline text-sm hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <p className="text-white/60 text-sm mb-2">
          &copy; {new Date().getFullYear()} SkinLab 011. {t("rights")}
        </p>
        <p className="text-white/40 text-xs">
          {t("poweredBy")}{" "}
          <a
            href="https://popzify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary no-underline hover:underline"
          >
            Popzify
          </a>
        </p>
      </div>
    </footer>
  );
}
