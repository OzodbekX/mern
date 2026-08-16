"use client";

import type { Device } from "@/lib/api";
import Icon from "@/components/ui/Icon";
import ProductVisual from "@/components/products/ProductVisual";
import { useI18n } from "@/lib/i18n";

export type CartItem = Device & { quantity: number };
export default function CartDrawer({
  cart,
  total,
  close,
  update,
  clear,
  checkout,
}: {
  cart: CartItem[];
  total: number;
  close: () => void;
  update: (id: number, delta: number) => void | Promise<void>;
  clear: () => void | Promise<void>;
  checkout: () => void;
}) {
  const { t } = useI18n();

  return (
    <div
      className="overlay drawer-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <aside className="drawer">
        <div className="drawer-head">
          <div>
            <p className="eyebrow">{t.yourSelection}</p>
            <h2>{t.shoppingBag}</h2>
          </div>
          <button onClick={close}>
            <Icon name="close" />
          </button>
        </div>
        {cart.length === 0 ? (
          <div className="cart-empty">
            <Icon name="bag" size={34} />
            <h3>{t.emptyBag}</h3>
            <p>{t.emptyBagText}</p>
            <button className="outline" onClick={close}>
              {t.continueShopping}
            </button>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <ProductVisual product={item} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>${Number(item.price).toLocaleString()}</p>
                    <div className="quantity">
                      <button
                        aria-label={t.removeBasket}
                        onClick={() => update(item.id, -1)}
                      >
                        <Icon name="minus" size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        aria-label={t.addOne}
                        onClick={() => update(item.id, 1)}
                      >
                        <Icon name="plus" size={14} />
                      </button>
                    </div>
                  </div>
                  <strong>
                    ${(item.price * item.quantity).toLocaleString()}
                  </strong>
                </div>
              ))}
            </div>
            <div className="cart-foot">
              <div>
                <span>{t.subtotal}</span>
                <strong>${total.toLocaleString()}</strong>
              </div>
              <p>{t.checkoutNote}</p>
              <button
                className="mb-1 mt-3 w-full py-2 text-[9px] uppercase tracking-[.14em] text-[#716f67] hover:text-[#b95736]"
                onClick={() => clear()}
              >
                {t.clearBasket}
              </button>
              <button className="primary full" onClick={checkout}>
                {t.continueCheckout} <Icon name="arrow" size={18} />
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
