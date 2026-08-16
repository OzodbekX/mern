"use client";

import type { Taxonomy } from "@/lib/api";

type HeaderProps = {
  brands: Taxonomy[];
  types: Taxonomy[];
  cartCount: number;
  onBrandSelect: (id: number) => void;
  onTypeSelect: (id: number) => void;
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

export default function Header({ brands, types, cartCount, onBrandSelect, onTypeSelect, onAccountOpen, onCartOpen }: HeaderProps) {
  const selectAndScroll = (callback: () => void) => {
    callback();
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  return <>
    <div className="announcement">Complimentary delivery on orders over $150 <span>Explore the edit →</span></div>
    <header className="header">
      <a href="#top" className="logo">ATELIER<span>MARKET</span></a>
      <nav>
        <a href="#shop">New arrivals</a>
        <div className="nav-menu">
          <button>Brands <span>⌄</span></button>
          <div className="nav-dropdown">
            <p>Shop by maker</p>
            {brands.length ? brands.map(item => <button key={item.id} onClick={() => selectAndScroll(() => onBrandSelect(item.id))}>{item.name}<span>→</span></button>) : <small>No brands yet</small>}
          </div>
        </div>
        <div className="nav-menu">
          <button>Categories <span>⌄</span></button>
          <div className="nav-dropdown">
            <p>Shop by category</p>
            {types.length ? types.map(item => <button key={item.id} onClick={() => selectAndScroll(() => onTypeSelect(item.id))}>{item.name}<span>→</span></button>) : <small>No categories yet</small>}
          </div>
        </div>
        <a href="#story">Our story</a>
      </nav>
      <div className="header-actions">
        <button aria-label="Search" onClick={() => document.getElementById("search")?.focus()}><HeaderIcon name="search"/></button>
        <button aria-label="Account" onClick={onAccountOpen}><HeaderIcon name="user"/></button>
        <button aria-label="Shopping bag" className="count-button" onClick={onCartOpen}><HeaderIcon name="bag"/><b>{cartCount}</b></button>
      </div>
    </header>
  </>;
}
