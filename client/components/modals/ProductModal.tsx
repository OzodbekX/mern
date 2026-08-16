"use client";
import { useEffect, useState } from "react";
import { api, type Device } from "@/lib/api";
import Icon from "@/components/ui/Icon";
import ProductVisual from "@/components/products/ProductVisual";

export default function ProductModal({
  product,
  brand,
  close,
  add,
}: {
  product: Device;
  brand?: string;
  close: () => void;
  add: () => void;
}) {
  const [detail, setDetail] = useState(product);
  useEffect(() => {
    api.devices
      .get(product.id)
      .then(setDetail)
      .catch(() => {});
  }, [product]);
  return (
    <div
      className="overlay"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div className="product-modal">
        <button className="modal-close" onClick={close}>
          <Icon name="close" />
        </button>
        <ProductVisual product={product} className="modal-image" />
        <div className="modal-copy">
          <p className="eyebrow">{brand || "Independent maker"}</p>
          <h2>{product.name}</h2>
          <div className="modal-rating">
            <span>
              <Icon name="star" size={15} />{" "}
              {Number(product.rating || 0).toFixed(1)}
            </span>
            <strong>${Number(product.price).toLocaleString()}</strong>
          </div>
          <p className="modal-description">
            Purposeful technology with a refined presence, selected to make your
            everyday rituals feel a little more considered.
          </p>
          {detail.info && detail.info.length > 0 && (
            <div className="specs">
              {detail.info.map((x, i) => (
                <div key={x.id || i}>
                  <span>{x.title}</span>
                  <b>{x.description}</b>
                </div>
              ))}
            </div>
          )}
          <button className="primary full" onClick={add}>
            Add to bag <Icon name="arrow" size={18} />
          </button>
          <small>Complimentary delivery · 30-day returns</small>
        </div>
      </div>
    </div>
  );
}
