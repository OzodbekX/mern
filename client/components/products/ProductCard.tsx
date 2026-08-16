import type { Device } from "@/lib/api";
import Icon from "@/components/ui/Icon";
import ProductVisual from "./ProductVisual";
import Link from "next/link";
import { localizedPath, useI18n } from "@/lib/i18n";

type Props = { product:Device; brandName?:string; isNew:boolean; isFavorite:boolean; onSelect:()=>void; onFavorite:()=>void; onAdd:()=>void };

export default function ProductCard({ product, brandName, isNew, isFavorite, onFavorite, onAdd }: Props) {
  const { locale, t } = useI18n();
  return <article className="product-card">
    <button className={`favorite ${isFavorite ? "active" : ""}`} onClick={onFavorite} aria-label="Save product"><Icon name="heart" size={19}/></button>
    <Link className="visual-button" href={localizedPath(locale,`/products/${product.id}`)}><ProductVisual product={product}/>{isNew && <span className="tag">New</span>}</Link>
    <div className="product-meta"><div><p>{brandName || "Independent maker"}</p><h3><Link href={localizedPath(locale,`/products/${product.id}`)}>{product.name}</Link></h3></div><strong>${Number(product.price).toLocaleString()}</strong></div>
    <div className="rating"><Icon name="star" size={13}/><span>{Number(product.rating || 0).toFixed(1)}</span></div>
    <button className="quick-add" onClick={onAdd}>{t.addToBag} <Icon name="plus" size={17}/></button>
  </article>;
}
