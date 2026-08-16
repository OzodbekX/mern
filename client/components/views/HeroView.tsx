"use client";

import { useI18n } from "@/lib/i18n";

export function HeroView() {
  const { t } = useI18n();

  return (
    <section
      className="grid min-h-[660px] overflow-hidden bg-[#f4f0e7] lg:grid-cols-[51%_49%]"
      id="top"
    >
      <div className="flex flex-col items-start justify-center px-6 py-20 md:px-[11%]">
        <p className="mb-6 text-[9px] font-semibold uppercase tracking-[.22em] text-[#b95736]">
          {t.heroEyebrow}
        </p>
        <h1 className="font-serif text-[50px] font-medium leading-[.92] tracking-[-.045em] sm:text-7xl xl:text-[92px]">
          {t.heroTitle}
          <br />
          <em className="font-normal text-[#b95736]">{t.heroEmphasis}</em>
        </h1>
        <p className="my-8 max-w-[480px] text-sm leading-7 text-[#716f67]">
          {t.heroText}
        </p>
        <a
          href="#shop"
          className="flex min-h-12 items-center gap-9 bg-[#24241f] px-6 text-[10px] !text-white uppercase tracking-[.12em] transition-all hover:gap-11 hover:bg-[#b95736]"
        >
          {t.shopCollection} <span className="text-lg !text-white">→</span>
        </a>
      </div>
      <div className="hero-art min-h-[400px]">
        <div className="sun" />
        <div className="arch">
          <div className="pedestal">
            <div className="object">
              <span />
              <i />
            </div>
          </div>
        </div>
        <p>
          {t.form} <span>×</span> {t.function}
        </p>
      </div>
    </section>
  );
}

export function ValueStrip() {
  const { t } = useI18n();
  const items = [
    [t.curated, t.curatedText],
    [t.delivered, t.deliveredText],
    [t.support, t.supportText],
  ];

  return (
    <section className="grid border-b border-[#d8d2c5] px-[7vw] py-5 md:min-h-[105px] md:grid-cols-3 md:items-center md:py-0">
      {items.map(([title, caption]) => (
        <div
          className="flex flex-col items-center gap-1 border-b border-[#d8d2c5] py-4 last:border-0 md:border-r md:border-b-0"
          key={title}
        >
          <b className="font-serif text-lg">{title}</b>
          <span className="text-[9px] uppercase tracking-[.12em] text-[#716f67]">
            {caption}
          </span>
        </div>
      ))}
    </section>
  );
}
