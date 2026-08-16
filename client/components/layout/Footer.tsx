"use client";

import { useI18n } from "@/lib/i18n";

type FooterLink = {
  label: string;
  href: string;
};

export default function Footer() {
  const { t } = useI18n();
  const shopLinks: FooterLink[] = [
    { label: t.newArrivals, href: "#shop" },
    { label: t.allProducts, href: "#shop" },
    { label: t.makers, href: "#shop" },
  ];
  const aboutLinks: FooterLink[] = [
    { label: t.story, href: "#story" },
    { label: t.journal, href: "#story" },
    { label: t.contact, href: "#story" },
  ];

  return (
    <footer className="grid gap-10 bg-[#ede8dd] px-[6vw] py-20 text-[11px] md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_2fr] lg:gap-16">
      <div className="flex flex-col gap-4">
        <a
          href="#top"
          className="font-serif text-[22px] font-semibold tracking-[.08em]"
        >
          ATELIER <span className="text-[9px] tracking-[.25em]">MARKET</span>
        </a>
        <p className="font-serif text-xl leading-snug text-[#716f67]">
          {t.everydayObjects}
        </p>
      </div>
      <Column title={t.shop} links={shopLinks} />
      <Column title={t.about} links={aboutLinks} />
      <div className="flex flex-col gap-3">
        <b className="text-[9px] uppercase tracking-[.15em]">
          {t.atelierNotes}
        </b>
        <p className="text-[#716f67]">{t.newsletterText}</p>
        <form className="mt-2 flex border-b border-[#24241f]">
          <input
            className="flex-1 bg-transparent py-3 outline-none"
            type="email"
            placeholder={t.emailPlaceholder}
          />
          <button
            type="button"
            className="px-2 text-lg"
            aria-label={t.subscribe}
          >
            →
          </button>
        </form>
      </div>
    </footer>
  );
}

function Column({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="flex flex-col gap-3">
      <b className="mb-2 text-[9px] uppercase tracking-[.15em]">{title}</b>
      {links.map((link) => (
        <a
          className="transition-colors hover:text-[#b95736]"
          href={link.href}
          key={link.label}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
