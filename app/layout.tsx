import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";
import ConsentAnalytics from "@/components/ConsentAnalytics";

const geist = Geist({ subsets:["latin"], variable:"--font-sans", display:"swap" });
const display = Instrument_Serif({ subsets:["latin"], variable:"--font-display", weight:"400", display:"swap" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mottopromosyon.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default:"Meday | Promosyon, Matbaa ve İş Elbiseleri", template:"%s | Meday" },
  description:"Markanıza özel promosyon ürünleri, kurumsal matbaa çözümleri ve dayanıklı iş elbiseleri. Projenize özel hızlı teklif alın.",
  alternates:{ canonical:"/" },
  openGraph:{ title:"Meday", description:"Markanızı görünür kılan ürünler, baskılar ve iş kıyafetleri.", url:siteUrl, siteName:"Meday", locale:"tr_TR", type:"website", images:[{url:"/hero-products.png",width:1792,height:896,alt:"Promosyon ürünleri koleksiyonu"}] },
  twitter:{card:"summary_large_image",title:"Meday",description:"Promosyon, matbaa ve iş elbiselerinde kurumsal çözüm ortağınız.",images:["/hero-products.png"]},
  icons:{
    icon:[{url:"/favicon.png",type:"image/png",sizes:"34x39"}],
    shortcut:"/favicon.png",
    apple:"/favicon.png"
  }
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="tr"><body className={`${geist.variable} ${display.variable}`}>{children}<ConsentAnalytics/></body></html>;
}
