import { redirect } from "next/navigation";

export default async function BrandPage({ params }: PageProps<"/brands/[id]">) {
  const { id } = await params;
  redirect(`/?brandId=${encodeURIComponent(id)}#shop`);
}
