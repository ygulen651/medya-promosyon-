import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { firebaseBucket } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["video/mp4", "mp4"],
  ["video/webm", "webm"],
]);
const imageMaxSize = 5 * 1024 * 1024;
const videoMaxSize = 50 * 1024 * 1024;

export async function POST(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ message: "Yetkisiz" }, { status: 401 });

  const formData = await request.formData();
  const upload = formData.get("file");
  if (!(upload instanceof File) || upload.size === 0) return NextResponse.json({ message: "Bir medya dosyası seçin." }, { status: 400 });
  if (!allowedTypes.has(upload.type)) return NextResponse.json({ message: "Yalnızca JPG, PNG, WebP, MP4 veya WebM yükleyebilirsiniz." }, { status: 415 });
  const isVideo = upload.type.startsWith("video/");
  if ((!isVideo && upload.size > imageMaxSize) || (isVideo && upload.size > videoMaxSize)) return NextResponse.json({ message: isVideo ? "Video en fazla 50 MB olabilir." : "Her görsel en fazla 5 MB olabilir." }, { status: 413 });

  const token = randomUUID();
  const objectName = `products/${isVideo ? "videos" : "images"}/${Date.now()}-${randomUUID()}.${allowedTypes.get(upload.type)}`;
  try {
    const file = firebaseBucket.file(objectName);
    await file.save(Buffer.from(await upload.arrayBuffer()), {
      resumable: false,
      contentType: upload.type,
      metadata: {
        cacheControl: "public,max-age=31536000,immutable",
        metadata: { firebaseStorageDownloadTokens: token },
      },
    });

    const url = `https://firebasestorage.googleapis.com/v0/b/${firebaseBucket.name}/o/${encodeURIComponent(objectName)}?alt=media&token=${token}`;
    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error("Product image upload failed", error);
    return NextResponse.json({ message: "Firebase Storage henüz etkin değil. Firebase Console'dan Storage hizmetini başlatın." }, { status: 503 });
  }
}
