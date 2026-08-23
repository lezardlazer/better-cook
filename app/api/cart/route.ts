import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const ids: string[] = Array.isArray(body?.ids)
    ? body.ids.filter((id: unknown) => typeof id === "string")
    : [];
  const inCart = body?.inCart;

  if (ids.length === 0 || typeof inCart !== "boolean") {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
  }

  await prisma.recipe.updateMany({
    where: { id: { in: ids } },
    data: { inCart },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await prisma.recipe.updateMany({
    where: { inCart: true },
    data: { inCart: false },
  });
  return NextResponse.json({ ok: true });
}
