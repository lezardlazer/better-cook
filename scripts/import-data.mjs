import "dotenv/config";
import { readFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "../app/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

const dataPath = path.join(process.cwd(), "scripts", "sqlite-export.json");
const { recipes, tags } = JSON.parse(readFileSync(dataPath, "utf-8"));

for (const tag of tags) {
  await prisma.tag.upsert({
    where: { id: tag.id },
    create: { id: tag.id, name: tag.name, category: tag.category },
    update: {},
  });
}

for (const recipe of recipes) {
  await prisma.recipe.create({
    data: {
      id: recipe.id,
      title: recipe.title,
      sourceUrl: recipe.sourceUrl,
      sourceType: recipe.sourceType,
      imageUrl: recipe.imageUrl,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      rawExtract: recipe.rawExtract,
      status: recipe.status,
      rating: recipe.rating,
      inCart: recipe.inCart,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt,
      ingredients: {
        create: recipe.ingredients.map((i) => ({ text: i.text, position: i.position })),
      },
      steps: {
        create: recipe.steps.map((s) => ({ text: s.text, position: s.position })),
      },
      tags: {
        create: recipe.tags.map((rt) => ({ tag: { connect: { id: rt.tagId } } })),
      },
    },
  });
  console.log(`imported: ${recipe.title}`);
}

console.log(`Done. ${recipes.length} recipes, ${tags.length} tags.`);
await prisma.$disconnect();
