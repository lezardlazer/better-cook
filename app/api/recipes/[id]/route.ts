import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { deleteRecipeImage } from "@/lib/images";

const recipeWithRelations = {
  ingredients: { orderBy: { position: "asc" as const } },
  steps: { orderBy: { position: "asc" as const } },
  tags: { include: { tag: true } },
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;
  const recipe = await prisma.recipe.findFirst({
    where: { id, userId: session.user.id },
    include: recipeWithRelations,
  });
  if (!recipe) {
    return NextResponse.json({ error: "Recette introuvable." }, { status: 404 });
  }
  return NextResponse.json(recipe);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const data: {
    status?: "a_tester" | "teste";
    rating?: number | null;
    testNote?: string | null;
    inCart?: boolean;
  } = {};

  if (body.status !== undefined) {
    if (body.status !== "a_tester" && body.status !== "teste") {
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
    }
    data.status = body.status;
    if (body.status === "a_tester") {
      data.rating = null;
      data.testNote = null;
    }
  }

  if (body.rating !== undefined) {
    if (
      body.rating !== null &&
      (typeof body.rating !== "number" ||
        !Number.isInteger(body.rating * 2) ||
        body.rating < 0.5 ||
        body.rating > 5)
    ) {
      return NextResponse.json(
        { error: "La note doit être un multiple de 0,5 entre 0,5 et 5." },
        { status: 400 },
      );
    }
    data.rating = body.rating;
  }

  if (body.testNote !== undefined) {
    if (body.testNote !== null && typeof body.testNote !== "string") {
      return NextResponse.json({ error: "Le commentaire est invalide." }, { status: 400 });
    }
    data.testNote = body.testNote;
  }

  if (body.inCart !== undefined) {
    if (typeof body.inCart !== "boolean") {
      return NextResponse.json({ error: "inCart doit être un booléen." }, { status: 400 });
    }
    data.inCart = body.inCart;
  }

  const { count } = await prisma.recipe.updateMany({
    where: { id, userId: session.user.id },
    data,
  });

  if (count === 0) {
    return NextResponse.json({ error: "Recette introuvable." }, { status: 404 });
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: recipeWithRelations,
  });

  return NextResponse.json(recipe);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;
  const recipe = await prisma.recipe.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!recipe) {
    return NextResponse.json({ error: "Recette introuvable." }, { status: 404 });
  }

  await prisma.recipe.delete({ where: { id } });
  await deleteRecipeImage(recipe.imageUrl);
  return NextResponse.json({ ok: true });
}
