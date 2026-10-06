"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import ProductVisual from "./ProductVisual";

type Media = { type: "image" | "video"; url: string };

export default function ProductGallery({ type, color, name, imageUrls, videoUrl }: { type:string; color?:string; name:string; imageUrls:string[]; videoUrl?:string }) {
  const media: Media[] = [
    ...imageUrls.slice(0, 5).map((url): Media => ({ type: "image", url })),
    ...(videoUrl ? [{ type: "video", url: videoUrl } as Media] : []),
  ];
  const [active, setActive] = useState(0);
  const selected = media[active];

  return <div className="product-gallery">
    <div className="product-gallery-main">
      {!selected && <ProductVisual type={type} color={color} alt={name} />}
      {selected?.type === "image" && <ProductVisual type={type} color={color} imageUrl={selected.url} alt={name} />}
      {selected?.type === "video" &&
        <video src={selected.url} controls playsInline preload="metadata" aria-label={`${name} ürün videosu`}/>
      }
    </div>
    {media.length > 1 && <div className="product-gallery-thumbs" aria-label="Ürün medyaları">
      {media.map((item, index) => <button type="button" className={active === index ? "active" : ""} onClick={() => setActive(index)} aria-label={item.type === "video" ? "Ürün videosunu göster" : `${index + 1}. ürün görselini göster`} aria-pressed={active === index} key={`${item.type}-${item.url}`}>
        {item.type === "image" ? <img src={item.url} alt=""/> : <span><Play/> Video</span>}
      </button>)}
    </div>}
  </div>;
}
