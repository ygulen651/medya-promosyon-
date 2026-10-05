"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Heart, Menu, Phone, UserRound, X } from "lucide-react";
import { useState } from "react";

export const navCategories = ["Termos", "Su Şişesi", "Çanta", "Kalem", "Defter", "Teknoloji", "Matbaa", "İş Elbisesi"];

export default function Header({ quoteCount = 0 }: { quoteCount?: number }) {
  const [open, setOpen] = useState(false);
  return <>
    <div className="topbar"><div className="catalog-container"><a href="tel:+902120000000"><Phone size={14}/> Nasıl teklif alabilirim?</a><span>Ücretsiz tasarım desteği • Türkiye geneli teslimat</span></div></div>
    <header className="catalog-header"><div className="catalog-container header-main">
      <Link className="catalog-logo" href="/" aria-label="Meday ana sayfa"><Image src="/meday-logo.png" alt="Meday Reklam ve Baskı" width={162} height={56} priority/></Link>
      <nav className={open ? "catalog-nav is-open" : "catalog-nav"} aria-label="Ürün kategorileri">
        {navCategories.map((item) => <a key={item} href={`#${item.toLocaleLowerCase("tr").replaceAll(" ", "-")}`} onClick={() => setOpen(false)}>{item}</a>)}
        <a href="#urunler">Diğer <ChevronDown size={15}/></a>
      </nav>
      <div className="catalog-actions"><button className="icon-action" aria-label="Favoriler"><Heart/></button><a className="quote-list" href="#teklif"><span>{quoteCount}</span> Teklif Listesi</a><button className="icon-action account" aria-label="Hesabım"><UserRound/></button><button className="mobile-toggle" aria-label={open ? "Menüyü kapat" : "Menüyü aç"} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></div>
    </div></header>
  </>;
}
