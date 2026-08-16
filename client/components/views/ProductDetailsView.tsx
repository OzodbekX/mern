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
  const [basketMessage, setBasketMessage] = useState("");

  useEffect(() => {
    api.devices
      .get(id)
      .then(setProduct)
      .catch((error) =>
        setError(error instanceof Error ? error.message : t.productNotFound),
      )
      .finally(() => setLoading(false));
  }, [id, t.productNotFound]);

  const addToCart = async () => {
    if (!product) return;
    const token = localStorage.getItem("atelier-token");
    if (!token) {
      setBasketMessage(t.signInToAdd);
      return;
    }
    try {
      await api.basket.add(product.id, token);
      setAdded(true);
      setBasketMessage("");
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      setBasketMessage(error instanceof Error ? error.message : t.basketError);
    }
  };

  if (loading)
    return (
      <main className="route-status">
        <div className="skeleton">
          <div />
        </div>
      </main>
    );
  if (error || !product)
    return (
      <main className="route-status">
        <p className="eyebrow">{t.notFound}</p>
        <h1>{t.unavailable}</h1>
        <p>{error}</p>
        <Link className="outline" href={localizedPath(locale, "/")}>
          {t.back}
        </Link>
      </main>
    );

  return (
    <main className="product-page">
      <div className="product-page-nav">
        <Link href={localizedPath(locale, "/")}>← {t.back}</Link>
        <Link href={localizedPath(locale, "/")} className="logo">
          ATELIER<span>MARKET</span>
        </Link>
      </div>
      <div className="product-page-grid">
        <div className="product-page-image">
          {product.img ? (
            <img src={`${FILE_BASE_URL}/${product.img}`} alt={product.name} />
          ) : (
            <div className="product-monogram">
              {product.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div className="product-page-copy">
          <p className="eyebrow">{t.consideredCollection}</p>
          <h1>{product.name}</h1>
          <div className="modal-rating">
            <span>
              <Icon name="star" size={15} />{" "}
              {Number(product.rating || 0).toFixed(1)}
            </span>
            <strong>${Number(product.price).toLocaleString()}</strong>
          </div>
          <p className="modal-description">{t.productDescription}</p>
          {product.info && product.info.length > 0 && (
            <div className="specs">
              {product.info.map((item, index) => (
                <div key={item.id || index}>
                  <span>{item.title}</span>
                  <b>{item.description}</b>
                </div>
              ))}
            </div>
          )}
          <button className="primary full" onClick={addToCart}>
            {added ? "✓" : t.addToBag}
            <Icon name="arrow" size={18} />
          </button>
          {basketMessage && (
            <p className="mt-3 text-center text-xs text-[#b95736]">
              {basketMessage}
            </p>
          )}
          <small>{t.deliveryReturns}</small>
        </div>
      </div>
    </main>
  );
}
