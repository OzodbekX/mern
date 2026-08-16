import { redirect } from "next/navigation";
export default async function LocalizedType({
  params,
}: PageProps<"/[locale]/types/[id]">) {
  const { locale, id } = await params;
  redirect(`/${locale}?typeId=${encodeURIComponent(id)}#shop`);
}
