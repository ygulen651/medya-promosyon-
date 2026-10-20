import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import ProductsCatalog from "@/components/ProductsCatalog";
import { getStore, getNavCategories } from "@/lib/store";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const slug = (await searchParams).kategori;
  const category = typeof slug === "string" ? getNavCategories(await getStore()).find((item) => item.slug === slug) : undefined;
  if (!category) return { title: "Tüm Ürünler", description: "Kurumsal promosyon ürünleri, matbaa ve iş elbiselerinin tamamını kategorilere göre inceleyin.", alternates: { canonical: "/urunler" } };
  return {
    title: `${category.name} | Promosyon Ürünleri`,
    description: `Logo baskılı ${category.name.toLocaleLowerCase("tr")} modellerini, fiyatlarını ve minimum sipariş adetlerini inceleyin.`,
    alternates: { canonical: `/urunler?kategori=${category.slug}` },
  };
}

export default async function ProductsPage() {
  const store = await getStore();
  const categories = getNavCategories(store);
  const quotePageEnabled = store.settings.quotePageEnabled !== false;
  return <>
    <Header quotePageEnabled={quotePageEnabled} categories={categories}/>
    <ProductsCatalog products={store.products.filter((product) => product.active)} categories={categories}/>
    <Footer settings={store.settings}/>
    <CookieBanner/>
  </>;
}
