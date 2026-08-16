/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { FILE_BASE_URL, type Device } from "@/lib/api";

export default function ProductVisual({ product, className = "" }: { product: Device; className?: string }) {
  const [failed, setFailed] = useState(false);
  return <div className={`product-visual ${className}`}>
    {product.img && !failed
      ? <img src={`${FILE_BASE_URL}/${product.img}`} alt={product.name} onError={() => setFailed(true)}/>
      : <div className="product-monogram">{product.name.slice(0, 2).toUpperCase()}</div>}
  </div>;
}
