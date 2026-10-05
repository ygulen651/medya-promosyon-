import Image from "next/image";

type Props = { type: string; color?: string };

const images: Record<string, string> = {
  bottle: "/catalog-drinkware.png",
  shirt: "/catalog-textile.png",
  vest: "/catalog-textile.png",
  notebook: "/catalog-stationery.png",
  bag: "/catalog-textile.png",
  print: "/catalog-stationery.png",
};

const labels: Record<string, string> = {
  bottle: "Kurumsal termos ve matara",
  shirt: "Kurumsal tekstil ürünü",
  vest: "Logolu iş kıyafeti",
  notebook: "Kurumsal defter",
  bag: "Promosyon bez çanta",
  print: "Kurumsal matbaa ürünü",
};

export default function ProductVisual({ type }: Props) {
  return <div className={`product-visual photo-${type}`}>
    <Image src={images[type] || "/catalog-stationery.png"} alt={labels[type] || "Kurumsal promosyon ürünü"} fill sizes="(max-width: 760px) 250px, 280px" style={{ objectFit: "cover" }}/>
  </div>;
}
