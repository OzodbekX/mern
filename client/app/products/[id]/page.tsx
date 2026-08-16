import type { Metadata } from "next";
import ProductDetailsView from "@/components/views/ProductDetailsView";

export const metadata: Metadata = { title: "Product — Atelier Market" };

export default async function ProductPage({
  params,
}: PageProps<"/products/[id]">) {
  const { id } = await params;
  return <ProductDetailsView id={id} />;
}
