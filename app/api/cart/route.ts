import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const ids: string[] = Array.isArray(body?.ids)
    ? body.ids.filter((id: unknown) => typeof id === "string")
    : [];
  const inCart = body?.inCart;

  if (ids.length === 0 || typeof inCart !== "boolean") {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
  }

  await prisma.recipe.updateMany({
    where: { id: { in: ids }, userId: session.user.id },
    data: { inCart },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  await prisma.recipe.updateMany({
    where: { inCart: true, userId: session.user.id },
    data: { inCart: false },
  });

  return NextResponse.json({ ok: true });
}
