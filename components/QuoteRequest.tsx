"use client";

import Link from "next/link";
import QuoteForm from "./QuoteForm";
import { useQuoteList } from "./QuoteListProvider";

export default function QuoteRequest({products}:{products:{id:string;name:string}[]}) {
  const {list,toggle} = useQuoteList();
  const selected = products.filter(product => list.includes(product.id));
  return <div className="catalog-container quote-layout">
    <div>
      <small>HIZLI TEKLİF</small>
      <h1>Projenize özel<br/>teklif alın.</h1>
      <p>İhtiyacınızı, sipariş adedini ve baskı tercihlerinizi paylaşın. Size uygun seçeneklerle dönüş yapalım.</p>
      {selected.length>0&&<><p>{selected.length} ürün teklif listenizde. Seçimleriniz talebinize eklenecek.</p><div className="selected-list">{selected.map(product=><span key={product.id}>{product.name} ({product.id})<button type="button" onClick={()=>toggle(product.id)} aria-label={`${product.name} ürününü çıkar`}>×</button></span>)}</div></>}
      <Link className="quote-back" href="/#urunler">← Ürünleri incele</Link>
    </div>
    <QuoteForm selectedProducts={selected}/>
  </div>;
}
