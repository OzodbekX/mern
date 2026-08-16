import type { Device } from "@/lib/api";
import Icon from "@/components/ui/Icon";
import ProductVisual from "./ProductVisual";

type Props = { product:Device; brandName?:string; isNew:boolean; isFavorite:boolean; onSelect:()=>void; onFavorite:()=>void; onAdd:()=>void };

export default function ProductCard({ product, brandName, isNew, isFavorite, onSelect, onFavorite, onAdd }: Props) {
  return <article className="product-card">
    <button className={`favorite ${isFavorite ? "active" : ""}`} onClick={onFavorite} aria-label="Save product"><Icon name="heart" size={19}/></button>
    <button className="visual-button" onClick={onSelect}><ProductVisual product={product}/>{isNew && <span className="tag">New</span>}</button>
    <div className="product-meta"><div><p>{brandName || "Independent maker"}</p><h3><button onClick={onSelect}>{product.name}</button></h3></div><strong>${Number(product.price).toLocaleString()}</strong></div>
    <div className="rating"><Icon name="star" size={13}/><span>{Number(product.rating || 0).toFixed(1)}</span></div>
    <button className="quick-add" onClick={onAdd}>Add to bag <Icon name="plus" size={17}/></button>
  </article>;
}
