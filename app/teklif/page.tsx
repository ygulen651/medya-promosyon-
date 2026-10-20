import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import QuoteRequest from "@/components/QuoteRequest";
import { getStore, getNavCategories } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata:Metadata = {
  title:"Teklif Al",
  description:"Promosyon, matbaa ve iş elbiseleri için projenize özel teklif alın.",
  alternates:{canonical:"/teklif"},
};

export default async function QuotePage() {
  const store = await getStore();
  const {settings,products} = store;
  if (settings.quotePageEnabled===false) notFound();
  return <>
    <Header quotePageEnabled categories={getNavCategories(store)}/>
    <main className="catalog-section quote-area quote-page">
      <QuoteRequest products={products.filter(product=>product.active).map(({id,name})=>({id,name}))}/>
    </main>
    <Footer settings={settings}/>
    <CookieBanner/>
  </>;
}
