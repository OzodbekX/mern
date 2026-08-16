"use client";

import type { Taxonomy } from "@/lib/api";
import Link from "next/link";
import { localizedPath, useI18n } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

type HeaderProps = {
  brands: Taxonomy[];
  types: Taxonomy[];
  cartCount: number;
  onAccountOpen: () => void;
  onCartOpen: () => void;
};

function HeaderIcon({ name }: { name: "search" | "user" | "bag" }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    bag: <><path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
  };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{paths[name]}</svg>;
}

export default function Header({ brands, types, cartCount, onAccountOpen, onCartOpen }: HeaderProps) {
  const { locale, t } = useI18n();
  return <>
    <div className="announcement">Complimentary delivery on orders over $150 <span>Explore the edit →</span></div>
    <header className="header">
      <Link href={localizedPath(locale,"/")} className="logo">ATELIER<span>MARKET</span></Link>
      <nav>
        <a href="#shop">{t.newArrivals}</a>
        <div className="nav-menu">
          <button>{t.brands} <span>⌄</span></button>
          <div className="nav-dropdown">
            <p>{t.shopByMaker}</p>
            {brands.length ? brands.map(item => <Link key={item.id} href={localizedPath(locale,`/brands/${item.id}`)}>{item.name}<span>→</span></Link>) : <small>{t.noBrands}</small>}
          </div>
        </div>
        <div className="nav-menu">
          <button>{t.categories} <span>⌄</span></button>
          <div className="nav-dropdown">
            <p>{t.shopByCategory}</p>
            {types.length ? types.map(item => <Link key={item.id} href={localizedPath(locale,`/types/${item.id}`)}>{item.name}<span>→</span></Link>) : <small>{t.noCategories}</small>}
          </div>
        </div>
        <a href="#story">{t.story}</a>
      </nav>
      <div className="header-actions">
        <LanguageSwitcher/>
        <button aria-label="Search" onClick={() => document.getElementById("search")?.focus()}><HeaderIcon name="search"/></button>
        <button aria-label="Account" onClick={onAccountOpen}><HeaderIcon name="user"/></button>
        <button aria-label="Shopping bag" className="count-button" onClick={onCartOpen}><HeaderIcon name="bag"/><b>{cartCount}</b></button>
      </div>
    </header>
  </>;
}
