import { notFound } from "next/navigation";
import { I18nProvider, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ru" }, { locale: "uz" }];
}
export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!["en", "ru", "uz"].includes(locale)) notFound();
  return <I18nProvider locale={locale as Locale}>{children}</I18nProvider>;
}
