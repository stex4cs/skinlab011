"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

const locales = [
  { code: "me" as const, label: "ME", flagCode: "me" },
  { code: "en" as const, label: "EN", flagCode: "gb" },
  { code: "ru" as const, label: "RU", flagCode: "ru" },
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
      {locales.map(({ code, label, flagCode }) => (
        <button
          key={code}
          onClick={() => handleSwitch(code)}
          className={`lang-btn ${currentLocale === code ? "active" : ""}`}
        >
          <img
            src={`https://flagcdn.com/w20/${flagCode}.png`}
            width={20}
            height={15}
            alt={label}
            style={{ display: "block" }}
          />
          {label}
        </button>
      ))}
    </div>
  );
}
