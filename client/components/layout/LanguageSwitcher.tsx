"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { locales, type Locale, useI18n } from "@/lib/i18n";

const languageNames: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  uz: "O‘zbekcha",
};

export default function LanguageSwitcher() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const changeLanguage = (nextLocale: Locale) => {
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    const query = searchParams.toString();
    router.push(`${segments.join("/")}${query ? `?${query}` : ""}`);
    setOpen(false);
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className={`group flex h-9 items-center gap-2 rounded-full border px-3 transition-all duration-200 ${open ? "border-[#b95736] bg-[#f4f0e7] shadow-sm" : "border-[#d8d2c5] bg-white/50 hover:border-[#a9a394] hover:bg-white"}`}
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
      >
        <svg
          className="text-[#b95736]"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
        <span className="text-[10px] font-semibold tracking-[.12em]">
          {locale.toUpperCase()}
        </span>
        <svg
          className={`text-[#716f67] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div
        className={`absolute top-12 right-0 z-50 w-44 origin-top-right rounded-2xl border border-[#d8d2c5] bg-[#fbfaf6] p-2 shadow-[0_18px_55px_rgba(36,36,31,.16)] transition-all duration-200 ${open ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-2 scale-95 opacity-0"}`}
        role="listbox"
        aria-label="Languages"
      >
        <p className="px-3 pt-2 pb-2 text-[8px] font-semibold uppercase tracking-[.2em] text-[#9a958a]">
          Select language
        </p>
        {locales.map((item) => {
          const active = item === locale;
          return (
            <button
              type="button"
              key={item}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors ${active ? "bg-[#eee8db] text-[#b95736]" : "hover:bg-[#f4f0e7]"}`}
              onClick={() => changeLanguage(item)}
              role="option"
              aria-selected={active}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`grid h-7 w-7 place-items-center rounded-full text-[9px] font-bold tracking-wide ${active ? "bg-[#b95736] text-white" : "bg-[#e7e1d5] text-[#716f67]"}`}
                >
                  {item.toUpperCase()}
                </span>
                <span className="font-serif text-[15px]">
                  {languageNames[item]}
                </span>
              </span>
              {active && (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
