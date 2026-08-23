import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { categoryForTag } from "@/lib/tags";

const recipeWithRelations = {
  ingredients: { orderBy: { position: "asc" as const } },
  steps: { orderBy: { position: "asc" as const } },
  tags: { include: { tag: true } },
};

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag");
  const q = searchParams.get("q");

  const recipes = await prisma.recipe.findMany({
    where: {
      AND: [
        { userId: session.user.id },
        tag ? { tags: { some: { tag: { name: tag } } } } : {},
        q ? { title: { contains: q } } : {},
      ],
    },
    include: recipeWithRelations,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(recipes);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "Titre manquant." }, { status: 400 });
  }

  const ingredients: string[] = Array.isArray(body.ingredients)
    ? body.ingredients.filter((i: unknown) => typeof i === "string" && i.trim())
    : [];
  const steps: string[] = Array.isArray(body.steps)
    ? body.steps.filter((s: unknown) => typeof s === "string" && s.trim())
    : [];
  const tagNames: string[] = Array.isArray(body.tags)
    ? body.tags.filter((t: unknown) => typeof t === "string" && t.trim())
    : [];

  const recipe = await prisma.recipe.create({
    data: {
      userId: session.user.id,
      title: body.title.trim(),
      sourceUrl: body.sourceUrl ?? "",
      sourceType: body.sourceType ?? "web",
      imageUrl: body.imageUrl || null,
      prepTime: body.prepTimeMinutes ?? null,
      cookTime: body.cookTimeMinutes ?? null,
      servings: body.servings ?? null,
      rawExtract: body.rawExtract ?? null,
      ingredients: {
        create: ingredients.map((text, position) => ({ text, position })),
      },
      steps: {
        create: steps.map((text, position) => ({ text, position })),
      },
      tags: {
        create: await Promise.all(
          tagNames.map(async (name) => {
            const category = categoryForTag(name) ?? "style";
            const tag = await prisma.tag.upsert({
              where: { name },
              create: { name, category },
              update: {},
            });
            return { tag: { connect: { id: tag.id } } };
          }),
        ),
      },
    },
    include: recipeWithRelations,
  });

  return NextResponse.json(recipe, { status: 201 });
}
