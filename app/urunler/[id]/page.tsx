import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, MessageCircle, PackageCheck, Palette, ShieldCheck, Truck } from "lucide-react";
import CookieBanner from "@/components/CookieBanner";
import Header from "@/components/Header";
import ProductGallery from "@/components/ProductGallery";
import ProductVisual from "@/components/ProductVisual";
import { getStore, type Product } from "@/lib/store";

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

  const related = store.products
    .filter((item) => item.active && item.id !== product.id && (item.category === product.category || item.type === product.type))
    .slice(0, 3);
  const whatsappMessage = encodeURIComponent(`Merhaba, ${product.name} (${product.id}) hakkında teklif almak istiyorum.`);

  return <>
    <Header />
    <main className="product-detail-page">
      <div className="catalog-container">
        <nav className="product-breadcrumb" aria-label="Sayfa yolu">
          <Link href="/">Ana sayfa</Link><span aria-hidden="true">/</span><Link href="/#urunler">Ürünler</Link><span aria-hidden="true">/</span><span>{product.name}</span>
        </nav>

        <article className="product-detail-layout">
          <div className="product-detail-media">
            <span className="product-detail-badge">{product.badge}</span>
            <ProductGallery type={product.type} color={product.color} name={product.name} imageUrls={product.imageUrls?.length ? product.imageUrls : product.imageUrl ? [product.imageUrl] : []} videoUrl={product.videoUrl} />
          </div>

          <div className="product-detail-copy">
            <p className="product-detail-code">{product.category} · {product.id}</p>
            <h1>{product.name}</h1>
            <p className="product-detail-intro">{product.description || "Markanıza özel baskı uygulamasıyla hazırlanır. Renk, uygulama ve teslimat seçeneklerini projenize göre birlikte netleştiriyoruz."}</p>

            {!!product.features?.length && <div className="product-specifications"><h2>Ürün özellikleri</h2><ul>{product.features.map((feature) => <li key={feature}><Check /> {feature}</li>)}</ul></div>}

            <div className="product-detail-price">
              <div><span>Birim fiyat başlangıcı</span><s>{product.old}</s><strong>{product.price}</strong></div>
              <div><span>Minimum sipariş</span><strong>{product.min} adet</strong><small>Adede göre özel fiyatlandırma</small></div>
            </div>

            <ul className="product-detail-features">
              {product.freeDesign !== false && <li><Palette /><span><b>Ücretsiz tasarım desteği</b><small>Logonuz baskıya uygun hazırlanır.</small></span></li>}
              <li><ShieldCheck /><span><b>Kalite kontrol</b><small>Üretim öncesi onay süreci uygulanır.</small></span></li>
              <li><Truck /><span><b>Türkiye geneli teslimat</b><small>Termin bilgisi teklifinizde paylaşılır.</small></span></li>
            </ul>

            <div className="product-detail-actions">
              <a className="product-primary-action" href={`https://wa.me/${store.settings.whatsapp}?text=${whatsappMessage}`} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp'tan teklif al</a>
              <Link className="product-secondary-action" href="/#teklif"><PackageCheck /> Teklif formuna git</Link>
            </div>
            <p className="product-detail-note"><Check /> Baskı türü, renk ve adet bilgisine göre kesin fiyat paylaşılır.</p>
          </div>
        </article>

        {related.length > 0 && <section className="related-products" aria-labelledby="related-title">
          <div className="related-heading"><div><p>BENZER SEÇENEKLER</p><h2 id="related-title">İlginizi çekebilecek ürünler</h2></div><Link href="/#urunler"><ArrowLeft /> Tüm ürünlere dön</Link></div>
          <div className="related-grid">{related.map((item) => <Link href={`/urunler/${encodeURIComponent(item.id)}`} className="related-card" key={item.id}><ProductVisual type={item.type} color={item.color} imageUrl={item.imageUrls?.[0]||item.imageUrl} alt={item.name}/><small>{item.id}</small><h3>{item.name}</h3><strong>{item.price}</strong></Link>)}</div>
        </section>}
      </div>
    </main>
    <footer className="product-detail-footer"><div className="catalog-container"><b>Meday</b><span>Promosyon, matbaa ve iş elbiselerinde kurumsal çözüm ortağınız.</span><a href={`tel:${store.settings.phone.replace(/\s/g, "")}`}>{store.settings.phone}</a></div></footer>
    <CookieBanner />
  </>;
}
