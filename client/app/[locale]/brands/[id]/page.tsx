import { redirect } from "next/navigation";
export default async function LocalizedBrand({
  params,
}: PageProps<"/[locale]/brands/[id]">) {
  const { locale, id } = await params;
  redirect(`/${locale}?brandId=${encodeURIComponent(id)}#shop`);
}
