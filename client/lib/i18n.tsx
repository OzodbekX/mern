"use client";

import { createContext, useContext, type ReactNode } from "react";
import en from "@/lib/locales/en.json";
import ru from "@/lib/locales/ru.json";
import uz from "@/lib/locales/uz.json";

export const locales = ["en", "ru", "uz"] as const;

export type Locale = (typeof locales)[number];
export type Dictionary = typeof en;

export const isLocale = (value: string): value is Locale =>
  locales.includes(value as Locale);

const dictionaries = {
  en,
  ru,
  uz,
} satisfies Record<Locale, Dictionary>;

const I18nContext = createContext<{ locale: Locale; t: Dictionary }>({
  locale: "en",
  t: en,
});

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ locale, t: dictionaries[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function localizedPath(locale: Locale, path: string) {
  return `/${locale}${path === "/" ? "" : path}`;
}
