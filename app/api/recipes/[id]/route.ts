import { NextRequest, NextResponse } from "next/server";
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
  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({
    where: { id },
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
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const data: {
    status?: "a_tester" | "teste";
    rating?: number | null;
    inCart?: boolean;
  } = {};

  if (body.status !== undefined) {
    if (body.status !== "a_tester" && body.status !== "teste") {
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
    }
    data.status = body.status;
    if (body.status === "a_tester") data.rating = null;
  }

  if (body.rating !== undefined) {
    if (body.rating !== null && (!Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5)) {
      return NextResponse.json(
        { error: "La note doit être un entier entre 1 et 5." },
        { status: 400 },
      );
    }
    data.rating = body.rating;
  }

  if (body.inCart !== undefined) {
    if (typeof body.inCart !== "boolean") {
      return NextResponse.json({ error: "inCart doit être un booléen." }, { status: 400 });
    }
    data.inCart = body.inCart;
  }

  const recipe = await prisma.recipe
    .update({ where: { id }, data, include: recipeWithRelations })
    .catch(() => null);

  if (!recipe) {
    return NextResponse.json({ error: "Recette introuvable." }, { status: 404 });
  }

  return NextResponse.json(recipe);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deleted = await prisma.recipe.delete({ where: { id } }).catch(() => null);
  if (deleted) await deleteRecipeImage(deleted.imageUrl);
  return NextResponse.json({ ok: true });
}
