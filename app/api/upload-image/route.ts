import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { saveImageBuffer } from "@/lib/images";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE = 8 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Format d'image non supporté." }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image trop volumineuse (8 Mo max)." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const imageUrl = await saveImageBuffer(buffer, file.type);

  return NextResponse.json({ imageUrl });
}
