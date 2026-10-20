import type { MetadataRoute } from "next";
import { getStore, getNavCategories } from "@/lib/store";
import { categoryHref } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function sitemap():Promise<MetadataRoute.Sitemap> {
  const base=process.env.NEXT_PUBLIC_SITE_URL||"https://mottopromosyon.com";
  const store=await getStore();
  const {settings}=store;
  const pages:MetadataRoute.Sitemap=[
    {url:base,lastModified:new Date(),changeFrequency:"weekly",priority:1},
    {url:`${base}/urunler`,lastModified:new Date(),changeFrequency:"daily",priority:.9},
    ...getNavCategories(store).map(category=>({url:`${base}${categoryHref(category.name)}`,lastModified:new Date(),changeFrequency:"weekly" as const,priority:.8})),
    {url:`${base}/gizlilik`,lastModified:new Date(),changeFrequency:"yearly",priority:.3},
    {url:`${base}/kullanim-sartlari`,lastModified:new Date(),changeFrequency:"yearly",priority:.3},
  ];
  if(settings.quotePageEnabled!==false)pages.push({url:`${base}/teklif`,lastModified:new Date(),changeFrequency:"monthly",priority:.7});
  return pages;
}
