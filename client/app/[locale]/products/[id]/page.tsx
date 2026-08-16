import ProductDetailsView from "@/components/views/ProductDetailsView";
export default async function LocalizedProduct({params}:PageProps<"/[locale]/products/[id]">){const{id}=await params;return <ProductDetailsView id={id}/>}
