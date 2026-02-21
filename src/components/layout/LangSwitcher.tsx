"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

const locales = [
  { code: "me" as const, label: "ME", flag: "🇲🇪" },
  { code: "en" as const, label: "EN", flag: "🇬🇧" },
  { code: "ru" as const, label: "RU", flag: "🇷🇺" },
];

export default function LangSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitch = (locale: "me" | "en" | "ru") => {
    router.replace(pathname, { locale });
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      {locales.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => handleSwitch(code)}
          className={`lang-btn ${currentLocale === code ? "active" : ""}`}
        >
          <span style={{ fontSize: "1rem", lineHeight: 1 }}>{flag}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
