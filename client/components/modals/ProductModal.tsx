"use client";
import { useEffect, useState } from "react";
import { api, type Device } from "@/lib/api";
import Icon from "@/components/ui/Icon";
import ProductVisual from "@/components/products/ProductVisual";
import { useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();
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
          <p className="eyebrow">{brand || t.independentMaker}</p>
          <h2>{product.name}</h2>
          <div className="modal-rating">
            <span>
              <Icon name="star" size={15} />{" "}
              {Number(product.rating || 0).toFixed(1)}
            </span>
            <strong>${Number(product.price).toLocaleString()}</strong>
          </div>
          <p className="modal-description">{t.productDescription}</p>
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
            {t.addToBag} <Icon name="arrow" size={18} />
          </button>
          <small>{t.deliveryReturns}</small>
        </div>
      </div>
    </div>
  );
}
