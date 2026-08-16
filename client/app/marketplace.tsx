"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, type Device, type Taxonomy } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { HeroView, ValueStrip } from "@/components/views/HeroView";
import CatalogView from "@/components/views/CatalogView";
import StoryView from "@/components/views/StoryView";
import ProductModal from "@/components/modals/ProductModal";
import CartDrawer, { type CartItem } from "@/components/modals/CartDrawer";
import AuthModal from "@/components/modals/AuthModal";

const parseFilter = (value: string | null) => {
  const parsed = Number(value);
  return value && Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

export default function Marketplace() {
  const searchParams = useSearchParams();
  const brandId = parseFilter(searchParams.get("brandId"));
  const typeId = parseFilter(searchParams.get("typeId"));

  const [devices, setDevices] = useState<Device[]>([]);
  const [brands, setBrands] = useState<Taxonomy[]>([]);
  const [types, setTypes] = useState<Taxonomy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState<Device | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    Promise.resolve().then(() => {
      try {
        setCart(JSON.parse(localStorage.getItem("atelier-cart") || "[]"));
        setFavorites(JSON.parse(localStorage.getItem("atelier-favorites") || "[]"));
      } catch {}
    });
    Promise.all([api.brands.list(), api.types.list()])
      .then(([brandData, typeData]) => { setBrands(brandData); setTypes(typeData); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    queueMicrotask(() => { setLoading(true); setError(""); });
    api.devices.list({ page, limit: 9, brandId: brandId || undefined, typeId: typeId || undefined })
      .then(data => { setDevices(data.rows || []); setCount(data.count || 0); })
      .catch(() => {
        setDevices([]);
        setCount(0);
        setError("We couldn’t reach the marketplace server. Check the API URL in your .env file and make sure the server is running.");
      })
      .finally(() => setLoading(false));
  }, [brandId, typeId, page]);

  const shownDevices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const matches = devices.filter(device => !normalizedQuery || device.name.toLowerCase().includes(normalizedQuery));
    return [...matches].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [devices, query, sort]);

  const setUrlFilters = (next: { brandId?: number | null; typeId?: number | null }) => {
    const params = new URLSearchParams(searchParams.toString());
    if ("brandId" in next) {
      if (next.brandId) params.set("brandId", String(next.brandId));
      else params.delete("brandId");
    }
    if ("typeId" in next) {
      if (next.typeId) params.set("typeId", String(next.typeId));
      else params.delete("typeId");
    }
    const nextQuery = params.toString();
    window.history.pushState(null, "", nextQuery ? `?${nextQuery}` : window.location.pathname);
    setPage(1);
  };

  const saveCart = (next: CartItem[]) => {
    setCart(next);
    localStorage.setItem("atelier-cart", JSON.stringify(next));
  };

  const addToCart = (device: Device) => {
    const existing = cart.find(item => item.id === device.id);
    saveCart(existing
      ? cart.map(item => item.id === device.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { ...device, quantity: 1 }]);
    setToast(`${device.name} added to your bag`);
    setTimeout(() => setToast(""), 2400);
  };

  const toggleFavorite = (id: number) => {
    const next = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
    setFavorites(next);
    localStorage.setItem("atelier-favorites", JSON.stringify(next));
  };

  const clearFilters = () => {
    setUrlFilters({ brandId: null, typeId: null });
    setQuery("");
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return <main>
    <Header brands={brands} types={types} cartCount={cartCount} onBrandSelect={id => setUrlFilters({ brandId: id })} onTypeSelect={id => setUrlFilters({ typeId: id })} onAccountOpen={() => setAuthOpen(true)} onCartOpen={() => setCartOpen(true)}/>
    <HeroView/>
    <ValueStrip/>
    <CatalogView devices={shownDevices} brands={brands} types={types} loading={loading} error={error} query={query} sort={sort} brandId={brandId} typeId={typeId} favorites={favorites} count={count} page={page} onQuery={setQuery} onSort={setSort} onBrand={value => setUrlFilters({ brandId: value })} onType={value => setUrlFilters({ typeId: value })} onClear={clearFilters} onSelect={setSelected} onFavorite={toggleFavorite} onAdd={addToCart} onPage={setPage}/>
    <StoryView/>
    <Footer/>

    {toast && <div className="toast">✓ {toast}</div>}
    {selected && <ProductModal product={selected} brand={brands.find(item => item.id === selected.brandId)?.name} close={() => setSelected(null)} add={() => { addToCart(selected); setSelected(null); }}/>} 
    {cartOpen && <CartDrawer cart={cart} total={cartTotal} close={() => setCartOpen(false)} update={(id, delta) => saveCart(cart.map(item => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter(item => item.quantity > 0))}/>} 
    {authOpen && <AuthModal close={() => setAuthOpen(false)}/>} 
  </main>;
}
