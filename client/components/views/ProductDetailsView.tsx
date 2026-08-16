/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, FILE_BASE_URL, type Device } from "@/lib/api";
import Icon from "@/components/ui/Icon";
import { localizedPath, useI18n } from "@/lib/i18n";

export default function ProductDetailsView({ id }: { id: string }) {
  const { locale, t } = useI18n();
  const [product, setProduct] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.devices.get(id).then(setProduct).catch(error => setError(error instanceof Error ? error.message : "Product not found")) .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!product) return;
    const token = localStorage.getItem("atelier-token");
    if (token) {
      try {
        await api.basket.add(product.id, token);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Could not update your basket");
      }
      return;
    }
    const cart = JSON.parse(localStorage.getItem("atelier-cart") || "[]") as Array<Device & { quantity: number }>;
    const existing = cart.find(item => item.id === product.id);
    const next = existing ? cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...cart, { ...product, quantity: 1 }];
    localStorage.setItem("atelier-cart", JSON.stringify(next));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <main className="route-status"><div className="skeleton"><div/></div></main>;
  if (error || !product) return <main className="route-status"><p className="eyebrow">Not found</p><h1>This object isn’t available.</h1><p>{error}</p><Link className="outline" href={localizedPath(locale,"/")}>{t.back}</Link></main>;

  return <main className="product-page">
    <div className="product-page-nav"><Link href={localizedPath(locale,"/")}>← {t.back}</Link><Link href={localizedPath(locale,"/")} className="logo">ATELIER<span>MARKET</span></Link></div>
    <div className="product-page-grid">
      <div className="product-page-image">{product.img ? <img src={`${FILE_BASE_URL}/${product.img}`} alt={product.name}/> : <div className="product-monogram">{product.name.slice(0,2).toUpperCase()}</div>}</div>
      <div className="product-page-copy"><p className="eyebrow">The considered collection</p><h1>{product.name}</h1><div className="modal-rating"><span><Icon name="star" size={15}/> {Number(product.rating||0).toFixed(1)}</span><strong>${Number(product.price).toLocaleString()}</strong></div><p className="modal-description">Purposeful technology with a refined presence, selected to make your everyday rituals feel a little more considered.</p>{product.info&&product.info.length>0&&<div className="specs">{product.info.map((item,index)=><div key={item.id||index}><span>{item.title}</span><b>{item.description}</b></div>)}</div>}<button className="primary full" onClick={addToCart}>{added ? "✓" : t.addToBag}<Icon name="arrow" size={18}/></button><small>Complimentary delivery · 30-day returns</small></div>
    </div>
  </main>;
}
