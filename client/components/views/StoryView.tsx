"use client";

import { useI18n } from "@/lib/i18n";

export default function StoryView() {
  const { t } = useI18n();

  return (
    <section className="story" id="story">
      <div className="story-art">
        <span>01</span>
        <div className="story-shape" />
      </div>
      <div className="story-copy">
        <p className="eyebrow">{t.viewpoint}</p>
        <h2>
          {t.lessBut} <em>{t.meaningful}</em>
        </h2>
        <p>{t.storyText}</p>
        <a href="#shop">
          {t.discoverStandards} <span>→</span>
        </a>
      </div>
    </section>
  );
}
