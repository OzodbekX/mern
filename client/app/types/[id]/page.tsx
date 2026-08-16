import { redirect } from "next/navigation";

export default async function TypePage({ params }: PageProps<"/types/[id]">) {
  const { id } = await params;
  redirect(`/?typeId=${encodeURIComponent(id)}#shop`);
}
