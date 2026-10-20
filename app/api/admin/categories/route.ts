import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getStore, updateStore, type Category } from "@/lib/store";

function cleanImageUrl(value: unknown) {
  const url = String(value || "").trim();
  if (!url) return "";
  return url.startsWith("/") || /^https?:\/\//i.test(url) ? url : "";
}

function categoryFields(body: Record<string, unknown>) {
  return {
    name: String(body.name || "").trim().slice(0, 80),
    imageUrl: cleanImageUrl(body.imageUrl),
    order: Math.max(0, Math.round(Number(body.order) || 0)),
    active: body.active !== false,
  };
}

const sorted = (categories: Category[]) => [...categories].sort((a, b) => a.order - b.order);

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });
  return NextResponse.json(sorted((await getStore()).categories));
}

export async function POST(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });
  const fields = categoryFields(await request.json() as Record<string, unknown>);
  if (fields.name.length < 2) return NextResponse.json({ message: "Kategori adı zorunludur." }, { status: 400 });

  let category: Category | undefined;
  let duplicate = false;
  await updateStore((store) => {
    duplicate = store.categories.some((item) => item.name.toLocaleLowerCase("tr") === fields.name.toLocaleLowerCase("tr"));
    if (duplicate) return;
    const order = fields.order || store.categories.reduce((max, item) => Math.max(max, item.order), 0) + 1;
    category = { id: `cat-${randomUUID().slice(0, 8)}`, ...fields, order };
    store.categories.push(category);
  });
  if (duplicate) return NextResponse.json({ message: "Bu isimde bir kategori zaten var." }, { status: 409 });
  return NextResponse.json(category, { status: 201 });
}

export async function PUT(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });
  const body = await request.json() as Record<string, unknown>;
  const id = String(body.id || "");
  const fields = categoryFields(body);
  if (fields.name.length < 2) return NextResponse.json({ message: "Kategori adı zorunludur." }, { status: 400 });

  let updated: Category | undefined;
  await updateStore((store) => {
    const previous = store.categories.find((item) => item.id === id);
    if (!previous) return;
    updated = { ...previous, ...fields };
    store.categories = store.categories.map((item) => item.id === id ? updated! : item);
    // Keep products attached to a renamed category.
    if (previous.name !== updated.name) store.products = store.products.map((product) => product.category === previous.name ? { ...product, category: updated!.name } : product);
  });
  return updated ? NextResponse.json(updated) : NextResponse.json({ message: "Kategori bulunamadı" }, { status: 404 });
}

export async function DELETE(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  await updateStore((store) => { store.categories = store.categories.filter((item) => item.id !== id); });
  return NextResponse.json({ success: true });
}
