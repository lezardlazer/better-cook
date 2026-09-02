import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  const checked = body?.checked;

  if (!text || typeof checked !== "boolean") {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
  }

  if (checked) {
    await prisma.cartCheckedItem.upsert({
      where: { userId_text: { userId: session.user.id, text } },
      create: { userId: session.user.id, text },
      update: {},
    });
  } else {
    await prisma.cartCheckedItem.deleteMany({
      where: { userId: session.user.id, text },
    });
  }

  return NextResponse.json({ ok: true });
}
