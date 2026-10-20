import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getStore, updateStore, type SiteSettings } from "@/lib/store";

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({message:"Yetkisiz"},{status:401});
  return NextResponse.json((await getStore()).settings);
}

export async function PUT(request:Request) {
  if (!await isAdmin()) return NextResponse.json({message:"Yetkisiz"},{status:401});
  const body = await request.json() as SiteSettings;
  if (body.quotePageEnabled!==undefined&&typeof body.quotePageEnabled!=="boolean") {
    return NextResponse.json({message:"Teklif sayfası durumu geçersiz."},{status:400});
  }
  const result = await updateStore(store=>{
    store.settings = {
      businessName:String(body.businessName||"Meday"),phone:String(body.phone||""),
      email:String(body.email||""),whatsapp:String(body.whatsapp||""),
      heroTitle:String(body.heroTitle||""),heroAccent:String(body.heroAccent||""),
      heroDescription:String(body.heroDescription||""),announcement:String(body.announcement||""),
      quotePageEnabled:body.quotePageEnabled??store.settings.quotePageEnabled??true,
    };
  });
  return NextResponse.json(result.settings);
}
