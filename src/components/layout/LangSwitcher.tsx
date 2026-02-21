"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

const locales = [
  { code: "me" as const, label: "ME" },
  { code: "en" as const, label: "EN" },
  { code: "ru" as const, label: "RU" },
];

export default function LangSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitch = (locale: "me" | "en" | "ru") => {
    router.replace(pathname, { locale });
  };

  return (
    <div className="flex gap-1">
      {locales.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => handleSwitch(code)}
          className={`px-3 py-1 rounded-full text-xs font-semibold border-none cursor-pointer transition-all ${
            currentLocale === code
              ? "bg-primary text-white"
              : "bg-secondary text-dark hover:bg-primary hover:text-white"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
