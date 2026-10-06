import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getStore, updateStore, type Product } from "@/lib/store";

function cleanImageUrl(value: unknown) {
  const url = String(value || "").trim();
  if (!url) return "";
  return url.startsWith("/") || /^https?:\/\//i.test(url) ? url : "";
}

function cleanFeatures(value: unknown) {
  const entries = Array.isArray(value) ? value : String(value || "").split(/\r?\n/);
  return entries.map((entry) => String(entry).trim()).filter(Boolean).slice(0, 12);
}

function cleanMediaUrls(value: unknown, limit: number) {
  if (!Array.isArray(value)) return [];
  return value.map(cleanImageUrl).filter(Boolean).slice(0, limit);
}

function productFields(body: Record<string, unknown>) {
  return {
    name: String(body.name || "").trim().slice(0, 120),
    type: String(body.type || "print").slice(0, 30),
    color: String(body.color || "#ef612d").slice(0, 20),
    old: String(body.old || "").trim().slice(0, 30),
    price: String(body.price || "").trim().slice(0, 30),
    min: Math.max(1, Number(body.min) || 1),
    badge: String(body.badge || "Yeni").trim().slice(0, 60),
    category: String(body.category || "Diğer").trim().slice(0, 80),
    active: body.active !== false,
    featured: Boolean(body.featured),
    imageUrl: cleanImageUrl(body.imageUrl),
    imageUrls: cleanMediaUrls(body.imageUrls, 5),
    videoUrl: cleanImageUrl(body.videoUrl),
    description: String(body.description || "").trim().slice(0, 1200),
    features: cleanFeatures(body.features),
    freeDesign: Boolean(body.freeDesign),
  };
}

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });
  return NextResponse.json((await getStore()).products);
}

export async function POST(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });
  const body = await request.json() as Record<string, unknown>;
  const product: Product = {
    id: String(body.id || `MP-${Date.now().toString().slice(-5)}`).trim().toUpperCase().slice(0, 40),
    ...productFields(body),
    createdAt: new Date().toISOString(),
  };
  if (product.name.length < 2 || !product.price) return NextResponse.json({ message: "Ürün adı ve fiyat zorunludur." }, { status: 400 });

  let duplicate = false;
  await updateStore((store) => {
    duplicate = store.products.some((item) => item.id === product.id);
    if (!duplicate) store.products.unshift(product);
  });
  if (duplicate) return NextResponse.json({ message: "Bu ürün kodu zaten kullanılıyor." }, { status: 409 });
  return NextResponse.json(product, { status: 201 });
}

export async function PUT(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });
  const body = await request.json() as Record<string, unknown>;
  const id = String(body.id || "");
  const fields = productFields(body);
  if (fields.name.length < 2 || !fields.price) return NextResponse.json({ message: "Ürün adı ve fiyat zorunludur." }, { status: 400 });

  let found = false;
  let updated: Product | undefined;
  await updateStore((store) => {
    store.products = store.products.map((product) => {
      if (product.id !== id) return product;
      found = true;
      updated = { ...product, ...fields };
      return updated;
    });
  });
  return found ? NextResponse.json(updated) : NextResponse.json({ message: "Ürün bulunamadı" }, { status: 404 });
}

export async function DELETE(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  await updateStore((store) => { store.products = store.products.filter((product) => product.id !== id); });
  return NextResponse.json({ success: true });
}
