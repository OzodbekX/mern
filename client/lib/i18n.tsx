"use client";
import { createContext, useContext } from "react";

export const locales=["en","ru","uz"] as const;
export type Locale=(typeof locales)[number];
export const isLocale=(value:string):value is Locale=>locales.includes(value as Locale);

const dictionaries={
 en:{newArrivals:"New arrivals",brands:"Brands",categories:"Categories",story:"Our story",shopByMaker:"Shop by maker",shopByCategory:"Shop by category",noBrands:"No brands yet",noCategories:"No categories yet",search:"Search the collection",allCategories:"All categories",allMakers:"All makers",featured:"Featured",addToBag:"Add to bag",back:"Back to collection"},
 ru:{newArrivals:"Новинки",brands:"Бренды",categories:"Категории",story:"О нас",shopByMaker:"По производителю",shopByCategory:"По категории",noBrands:"Брендов пока нет",noCategories:"Категорий пока нет",search:"Поиск по коллекции",allCategories:"Все категории",allMakers:"Все бренды",featured:"Рекомендуемые",addToBag:"В корзину",back:"Назад к коллекции"},
 uz:{newArrivals:"Yangi mahsulotlar",brands:"Brendlar",categories:"Toifalar",story:"Biz haqimizda",shopByMaker:"Brend bo‘yicha",shopByCategory:"Toifa bo‘yicha",noBrands:"Brendlar hali yo‘q",noCategories:"Toifalar hali yo‘q",search:"To‘plamdan qidiring",allCategories:"Barcha toifalar",allMakers:"Barcha brendlar",featured:"Tavsiya etilgan",addToBag:"Savatga qo‘shish",back:"To‘plamga qaytish"},
};
type Dictionary=(typeof dictionaries)["en"];
const I18nContext=createContext<{locale:Locale;t:Dictionary}>({locale:"en",t:dictionaries.en});
export function I18nProvider({locale,children}:{locale:Locale;children:React.ReactNode}){return <I18nContext.Provider value={{locale,t:dictionaries[locale]}}>{children}</I18nContext.Provider>}
export function useI18n(){return useContext(I18nContext)}
export function localizedPath(locale:Locale,path:string){return `/${locale}${path==="/"?"":path}`}
