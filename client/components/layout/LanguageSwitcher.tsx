"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { locales, useI18n } from "@/lib/i18n";

export default function LanguageSwitcher(){const{locale}=useI18n();const pathname=usePathname();const search=useSearchParams();const router=useRouter();const change=(next:string)=>{const parts=pathname.split("/");parts[1]=next;router.push(`${parts.join("/")}${search.size?`?${search}`:""}`)};return <select className="language-switcher" value={locale} onChange={e=>change(e.target.value)} aria-label="Language">{locales.map(item=><option key={item} value={item}>{item.toUpperCase()}</option>)}</select>}
