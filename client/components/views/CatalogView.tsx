"use client";

import type { Device, Taxonomy } from "@/lib/api";
import Icon from "@/components/ui/Icon";
import ProductCard from "@/components/products/ProductCard";
import { useI18n } from "@/lib/i18n";

type Props = {
  devices: Device[];
  brands: Taxonomy[];
  types: Taxonomy[];
  loading: boolean;
  error: string;
  query: string;
  sort: string;
  brandId: number | null;
  typeId: number | null;
  favorites: number[];
  count: number;
  page: number;
  onQuery: (v: string) => void;
  onSort: (v: string) => void;
  onBrand: (v: number | null) => void;
  onType: (v: number | null) => void;
  onClear: () => void;
  onSelect: (v: Device) => void;
  onFavorite: (id: number) => void;
  onAdd: (v: Device) => void;
  onPage: (v: number) => void;
};

export default function CatalogView(p: Props) {
  const pages = Math.ceil(p.count / 9);
  const { t } = useI18n();
  return (
    <section className="catalog" id="shop">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t.shopAll}</p>
          <h2>{t.designed}</h2>
        </div>
        <p>
          {p.count} {p.count === 1 ? t.piece : t.pieces}, {t.qualityText}
        </p>
      </div>
      <div className="shop-tools">
        <div className="search-box">
          <Icon name="search" size={19} />
          <input
            id="search"
            value={p.query}
            onChange={(e) => p.onQuery(e.target.value)}
            placeholder={t.search}
          />
        </div>
        <div className="selects">
          <select
            aria-label={t.categories}
            value={p.typeId || ""}
            onChange={(e) => p.onType(e.target.value ? +e.target.value : null)}
          >
            <option value="">{t.allCategories}</option>
            {p.types.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
          <select
            aria-label={t.brands}
            value={p.brandId || ""}
            onChange={(e) => p.onBrand(e.target.value ? +e.target.value : null)}
          >
            <option value="">{t.allMakers}</option>
            {p.brands.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
          <select
            aria-label={t.featured}
            value={p.sort}
            onChange={(e) => p.onSort(e.target.value)}
          >
            <option value="featured">{t.featured}</option>
            <option value="price-low">{t.priceLow}</option>
            <option value="price-high">{t.priceHigh}</option>
            <option value="rating">{t.topRated}</option>
          </select>
        </div>
      </div>
      {(p.brandId || p.typeId || p.query) && (
        <div className="active-filter">
          <span>{t.refinedSelection}</span>
          <button onClick={p.onClear}>
            {t.clearFilters} <Icon name="close" size={14} />
          </button>
        </div>
      )}
      {p.loading ? (
        <div className="product-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="skeleton" key={i}>
              <div />
              <span />
              <small />
            </div>
          ))}
        </div>
      ) : p.error ? (
        <div className="empty">
          <div>↗</div>
          <h3>{t.collectionMoment}</h3>
          <p>{p.error}</p>
          <button className="outline" onClick={() => location.reload()}>
            {t.tryAgain}
          </button>
        </div>
      ) : p.devices.length === 0 ? (
        <div className="empty">
          <h3>{t.noPieces}</h3>
          <p>{t.noPiecesText}</p>
          <button className="outline" onClick={p.onClear}>
            {t.viewEverything}
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {p.devices.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              brandName={p.brands.find((b) => b.id === product.brandId)?.name}
              isNew={index < 2}
              isFavorite={p.favorites.includes(product.id)}
              onSelect={() => p.onSelect(product)}
              onFavorite={() => p.onFavorite(product.id)}
              onAdd={() => p.onAdd(product)}
            />
          ))}
        </div>
      )}
      {p.count > 9 && (
        <div className="pagination">
          <button disabled={p.page === 1} onClick={() => p.onPage(p.page - 1)}>
            {t.previous}
          </button>
          <span>
            {t.page} {p.page} {t.of} {pages}
          </span>
          <button
            disabled={p.page >= pages}
            onClick={() => p.onPage(p.page + 1)}
          >
            {t.next}
          </button>
        </div>
      )}
    </section>
  );
}
