import Link from "next/link";
import type { SiteSettings } from "@/lib/store";

export default function Footer({settings}:{settings:SiteSettings}) {
  return <footer className="catalog-footer" id="iletisim">
    <div className="catalog-container footer-grid">
      <div><b className="footer-logo">Meday</b><p>Promosyon, matbaa ve iş elbiselerinde kurumsal çözüm ortağınız.</p></div>
      <div><strong>Ürünler</strong><Link href="/urunler">Tüm ürünler</Link><Link href="/#kategoriler">Kategoriler</Link>{settings.quotePageEnabled!==false&&<Link href="/teklif">Hızlı teklif</Link>}</div>
      <div><strong>Kurumsal</strong>{settings.quotePageEnabled!==false&&<Link href="/teklif">Teklif Al</Link>}<Link href="/gizlilik">Gizlilik Politikası</Link><Link href="/kullanim-sartlari">Kullanım Şartları</Link></div>
      <div><strong>Bize ulaşın</strong><a href={`tel:${settings.phone.replace(/\s/g,"")}`}>{settings.phone}</a><a href={`mailto:${settings.email}`}>{settings.email}</a></div>
    </div>
    <div className="catalog-container footer-copy">© {new Date().getFullYear()} {settings.businessName}<span className="footer-credit">Web Sitesi ve Yazılım: <a href="https://www.entekdigital.com/" target="_blank" rel="noopener noreferrer">Entek Digital</a></span></div>
  </footer>;
}
