"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ChevronRight, LayoutGrid, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { categorySlug, parsePrice, type NavCategory } from "@/lib/catalog";
import type { Product } from "@/lib/store";
import ProductVisual from "./ProductVisual";

const PAGE_SIZE = 24;
const sorts = {
  default: "Varsayılan Sıralama",
  newest: "En Yeniler",
  priceAsc: "Fiyat: Düşükten Yükseğe",
  priceDesc: "Fiyat: Yüksekten Düşüğe",
  name: "İsme Göre (A-Z)",
} as const;
type Sort = keyof typeof sorts;

export default function ProductsCatalog({ products, categories }: { products: Product[]; categories: NavCategory[] }) {
  const searchParams = useSearchParams();
  const slug = searchParams.get("kategori") || "";
  const active = categories.find((category) => category.slug === slug);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [sort, setSort] = useState<Sort>("default");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [sidebar, setSidebar] = useState(false);

  useEffect(() => { setVisible(PAGE_SIZE); }, [slug, query, sort]);

  function selectCategory(nextSlug: string) {
    // History API updates useSearchParams without a server round trip.
    window.history.pushState(null, "", nextSlug ? `/urunler?kategori=${nextSlug}` : "/urunler");
    setSidebar(false);
    document.getElementById("urun-listesi")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const shown = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr");
    const list = products.filter((product) =>
      (!slug || categorySlug(product.category) === slug) &&
      (!needle || `${product.name} ${product.id} ${product.category}`.toLocaleLowerCase("tr").includes(needle)));
    if (sort === "newest") list.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    if (sort === "priceAsc") list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    if (sort === "priceDesc") list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name, "tr"));
    return list;
  }, [products, slug, query, sort]);

  return <main className="products-page">
    <section className="products-hero"><div className="catalog-container">
      <nav className="product-breadcrumb" aria-label="Sayfa yolu"><Link href="/">Ana sayfa</Link><span aria-hidden="true">/</span>{active ? <><Link href="/urunler" onClick={(event) => { event.preventDefault(); selectCategory(""); }}>Ürünler</Link><span aria-hidden="true">/</span><span>{active.name}</span></> : <span>Ürünler</span>}</nav>
      <h1>{active ? active.name : "Tüm Ürünler"}</h1>
      <p>{active ? `${active.name} kategorisindeki logo baskıya uygun ürünleri inceleyin.` : "Markanıza özel baskıya hazır kurumsal promosyon ürünlerini kategorilere göre keşfedin."}</p>
    </div></section>

    <div className="catalog-container products-layout" id="urun-listesi">
      <aside className={sidebar ? "products-sidebar is-open" : "products-sidebar"} aria-label="Ürün kategorileri">
        <div className="ps-head"><b>Kategoriler</b><button type="button" onClick={() => selectCategory("")}>Tümü</button><button type="button" className="ps-close" aria-label="Kategorileri kapat" onClick={() => setSidebar(false)}><X/></button></div>
        <ul>
          <li><button type="button" className={!slug ? "is-active" : ""} onClick={() => selectCategory("")}><span className="ps-thumb"><LayoutGrid/></span><span className="ps-name">Tüm Ürünler</span><small>{products.length}</small></button></li>
          {categories.map((category) => <li key={category.id}><button type="button" className={slug === category.slug ? "is-active" : ""} onClick={() => selectCategory(category.slug)} aria-current={slug === category.slug ? "page" : undefined}>
            <span className="ps-thumb">{category.imageUrl ? <img src={category.imageUrl} alt="" loading="lazy"/> : <b aria-hidden="true">{category.name.charAt(0)}</b>}</span>
            <span className="ps-name">{category.name}</span><small>{category.count}</small><ChevronRight className="ps-chevron"/>
          </button></li>)}
        </ul>
      </aside>
      {sidebar && <button type="button" className="ps-backdrop" aria-label="Kategorileri kapat" onClick={() => setSidebar(false)}/>}

      <section className="products-main">
        <div className="products-toolbar">
          <p>Toplam <b>{shown.length}</b> ürün listeleniyor</p>
          <button type="button" className="ps-open" onClick={() => setSidebar(true)}><SlidersHorizontal/> Kategoriler</button>
          <label className="products-search"><span className="sr-only">Ürünlerde ara</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ürünlerde ara..."/><Search/></label>
          <label className="products-sort"><span className="sr-only">Sıralama</span><select value={sort} onChange={(event) => setSort(event.target.value as Sort)}>{Object.entries(sorts).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        </div>

        {shown.length ? <div className="pcard-grid">{shown.slice(0, visible).map((product) => {
          const href = `/urunler/${encodeURIComponent(product.id)}`;
          return <article className="pcard" key={product.id}>
            <Link className="pcard-media" href={href} tabIndex={-1} aria-hidden="true"><span className="pcard-code">#{product.id}</span><ProductVisual type={product.type} color={product.color} imageUrl={product.imageUrls?.[0] || product.imageUrl} alt={product.name}/></Link>
            <div className="pcard-body">
              <small>{product.category}</small>
              <h3><Link href={href}>{product.name}</Link></h3>
              <div className="pcard-foot"><div><span>Fiyat</span><b>{product.price}</b></div><Link className="pcard-go" href={href} aria-label={`${product.name} detayları`}><ArrowRight/></Link></div>
            </div>
          </article>;
        })}</div> : <div className="empty-search"><Search/><h3>Bu kriterlere uygun ürün bulunamadı</h3></div>}

        {visible < shown.length && <button type="button" className="products-more" onClick={() => setVisible(visible + PAGE_SIZE)}>Daha fazla ürün göster ({shown.length - visible})</button>}
      </section>
    </div>
  </main>;
}
