import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, MessageCircle } from "lucide-react";
import CookieBanner from "@/components/CookieBanner";
import Header from "@/components/Header";
import ProductGallery from "@/components/ProductGallery";
import ProductVisual from "@/components/ProductVisual";
import { getStore, getNavCategories, type Product } from "@/lib/store";
import { categoryHref, categorySlug } from "@/lib/catalog";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

async function findProduct(id: string): Promise<Product | undefined> {
  const store = await getStore();
  return store.products.find((product) => product.active && product.id.toLocaleLowerCase("tr") === id.toLocaleLowerCase("tr"));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await findProduct(decodeURIComponent(id));
  if (!product) return { title: "Ürün bulunamadı" };

  return {
    title: product.name,
    description: `${product.name} için baskı seçeneklerini, minimum sipariş miktarını ve güncel fiyat bilgisini inceleyin.`,
    alternates: { canonical: `/urunler/${encodeURIComponent(product.id)}` },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const store = await getStore();
  const product = store.products.find((item) => item.active && item.id.toLocaleLowerCase("tr") === decodeURIComponent(id).toLocaleLowerCase("tr"));
  if (!product) notFound();

  const relatedPriority = (item:Product) => {
    if (categorySlug(item.category) === categorySlug(product.category)) return 0;
    if (item.type === product.type) return 1;
    return 2;
  };
  const related = store.products
    .filter((item) => item.active && item.id !== product.id)
    .sort((a,b) => relatedPriority(a) - relatedPriority(b))
    .slice(0, 3);
  const whatsappMessage = encodeURIComponent(`Merhaba, ${product.name} (${product.id}) hakkında teklif almak istiyorum.`);

  return <>
    <Header quotePageEnabled={store.settings.quotePageEnabled!==false} categories={getNavCategories(store)} />
    <main className="product-detail-page">
      <div className="catalog-container">
        <nav className="product-breadcrumb" aria-label="Sayfa yolu">
          <Link href="/">Ana sayfa</Link><span aria-hidden="true">/</span><Link href="/urunler">Ürünler</Link><span aria-hidden="true">/</span><Link href={categoryHref(product.category)}>{product.category}</Link><span aria-hidden="true">/</span><span>{product.name}</span>
        </nav>

        <article className="product-detail-layout">
          <div className="product-detail-media">
            <span className="product-detail-badge">{product.badge}</span>
            <ProductGallery type={product.type} color={product.color} name={product.name} imageUrls={product.imageUrls?.length ? product.imageUrls : product.imageUrl ? [product.imageUrl] : []} videoUrl={product.videoUrl} />
          </div>

          <div className="product-detail-copy">
            <h1>{product.name}</h1>

            <table className="pd-specs"><tbody>
              <tr><th scope="row">Kod</th><td>{product.id}</td></tr>
              <tr><th scope="row">Birim Fiyatı</th><td>{product.old && <s>{product.old}</s>}<b>{product.price}</b></td></tr>
              {product.size && <tr><th scope="row">Ebat</th><td>{product.size}</td></tr>}
              {product.stock && <tr><th scope="row">Toplam Stok</th><td>{product.stock}</td></tr>}
              <tr><th scope="row">Kategori</th><td><Link href={categoryHref(product.category)}>{product.category}</Link></td></tr>
            </tbody></table>

            <a className="pd-info-btn" href={`https://wa.me/${store.settings.whatsapp}?text=${whatsappMessage}`} target="_blank" rel="noreferrer"><MessageCircle /> Bilgi Al</a>

            {(!!product.features?.length || product.description) && <section className="pd-card">
              <h2>Ürün Özellikleri</h2>
              {product.description && <p className="pd-desc">{product.description}</p>}
              {!!product.features?.length && <ul>{product.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>}
            </section>}

            {product.printPricing?.map((table, index) => <section className="pd-card pd-print" key={`${table.imageUrl}-${index}`}>
              <h2>{table.title}</h2>
              <a href={table.imageUrl} target="_blank" rel="noreferrer" aria-label={`${table.title} fiyat tablosunu büyük aç`}><img src={table.imageUrl} alt={`${product.name} ${table.title} fiyat tablosu`} loading="lazy"/></a>
            </section>)}

            {product.freeDesign !== false && <p className="product-detail-note"><Check /> Ücretsiz tasarım desteği · Kesin fiyat baskı türü ve adede göre paylaşılır.</p>}
          </div>
        </article>

        {related.length > 0 && <section className="related-products" aria-labelledby="related-title">
          <div className="related-heading"><div><p>SİZİN İÇİN ÖNERİLENLER</p><h2 id="related-title">Benzer ürünler</h2></div><Link href="/urunler"><ArrowLeft /> Tüm ürünlere dön</Link></div>
          <div className="related-grid">{related.map((item) => <Link href={`/urunler/${encodeURIComponent(item.id)}`} className="related-card" key={item.id}><ProductVisual type={item.type} color={item.color} imageUrl={item.imageUrls?.[0]||item.imageUrl} alt={item.name}/><small>{item.id}</small><h3>{item.name}</h3><strong>{item.price}</strong></Link>)}</div>
        </section>}
      </div>
    </main>
    <footer className="product-detail-footer"><div className="catalog-container"><b>Meday</b><span>Promosyon, matbaa ve iş elbiselerinde kurumsal çözüm ortağınız.</span><a href={`tel:${store.settings.phone.replace(/\s/g, "")}`}>{store.settings.phone}</a></div></footer>
    <CookieBanner />
  </>;
}
