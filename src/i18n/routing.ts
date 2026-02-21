import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["me", "en", "ru"],
  defaultLocale: "me",
});
