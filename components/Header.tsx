"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Heart, House, Menu, Phone, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { categoryHref, type NavCategory } from "@/lib/catalog";
import { useQuoteList } from "./QuoteListProvider";

export default function Header({ quotePageEnabled = false, categories = [] }: { quotePageEnabled?: boolean; categories?: NavCategory[] }) {
  const { list } = useQuoteList();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobileCats, setMobileCats] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const total = categories.reduce((sum, category) => sum + category.count, 0);

  const showMega = () => { clearTimeout(closeTimer.current); setMega(true); };
  const hideMega = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setMega(false), 160); };
  const closeAll = () => { setMega(false); setOpen(false); setMobileCats(false); };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setMega(false); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); clearTimeout(closeTimer.current); };
  }, []);

  return <>
    <div className="topbar"><div className="catalog-container"><a href="tel:+902120000000"><Phone size={14}/> Nasıl teklif alabilirim?</a><span>Ücretsiz tasarım desteği • Türkiye geneli teslimat</span></div></div>
    <header className="catalog-header" onMouseLeave={hideMega}><div className="catalog-container header-main">
      <Link className="catalog-logo" href="/" aria-label="Meday ana sayfa"><Image src="/meday-logo.png" alt="Meday Reklam ve Baskı" width={162} height={56} priority/></Link>
      <nav className={open ? "catalog-nav is-open" : "catalog-nav"} aria-label="Ana menü">
        <Link className="nav-home" href="/" aria-label="Ana sayfa" onClick={closeAll}><House size={18}/><span>Ana sayfa</span></Link>
        <button type="button" className={mega ? "nav-products is-active" : "nav-products"} aria-expanded={mega || mobileCats} aria-controls="mega-menu" onMouseEnter={showMega} onClick={() => { setMega(!mega); setMobileCats(!mobileCats); }}>Ürünler <ChevronDown size={15}/></button>
        {mobileCats && <div className="mobile-cats">
          <Link href="/urunler" onClick={closeAll}>Tüm ürünler</Link>
          {categories.map((category) => <Link key={category.id} href={categoryHref(category.name)} onClick={closeAll}>{category.name}<small>{category.count}</small></Link>)}
        </div>}
        <Link href="/urunler" onMouseEnter={hideMega} onClick={closeAll}>Tüm Ürünler</Link>
        {quotePageEnabled && <Link href="/teklif" onMouseEnter={hideMega} onClick={closeAll}>Teklif Al</Link>}
        <a href="#iletisim" onMouseEnter={hideMega} onClick={closeAll}>İletişim</a>
      </nav>
      <div className="catalog-actions"><button className="icon-action" aria-label="Favoriler"><Heart/></button>{quotePageEnabled&&<Link className="quote-list" href="/teklif"><span>{list.length}</span> Teklif Listesi</Link>}<button className="icon-action account" aria-label="Hesabım"><UserRound/></button><button className="mobile-toggle" aria-label={open ? "Menüyü kapat" : "Menüyü aç"} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></div>
    </div>
    <div id="mega-menu" className={mega ? "mega-menu is-open" : "mega-menu"} onMouseEnter={showMega} onMouseLeave={hideMega}>
      <div className="catalog-container mega-panel">
        {categories.length ? <div className="mega-grid">{categories.map((category) => <Link className="mega-item" key={category.id} href={categoryHref(category.name)} onClick={closeAll}>
          <span className="mega-thumb">{category.imageUrl ? <img src={category.imageUrl} alt="" loading="lazy"/> : <b aria-hidden="true">{category.name.charAt(0)}</b>}</span>
          <span className="mega-text"><strong>{category.name}</strong><small>{category.count} ürün</small></span>
        </Link>)}</div> : <p className="mega-empty">Henüz kategori eklenmedi.</p>}
        <div className="mega-foot"><span>{total} kurumsal promosyon ürünü, {categories.length} kategori</span><Link className="mega-all" href="/urunler" onClick={closeAll}>Tüm Ürünleri Gör <ArrowRight size={16}/></Link></div>
      </div>
    </div></header>
  </>;
}
