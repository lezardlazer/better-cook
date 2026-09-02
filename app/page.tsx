import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { TagFilter } from "@/components/TagFilter";
import { StatusFilter } from "@/components/StatusFilter";
import { TypeTabs } from "@/components/TypeTabs";
import { RecipeList } from "@/components/RecipeList";
import { SignInGate } from "@/components/SignInGate";
import { SearchBox } from "@/components/SearchBox";
import { BRUTAL_PILL } from "@/lib/ui";
import { DISH_TYPE_TAG, parseDishType } from "@/lib/tags";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ tags?: string; q?: string; status?: string; type?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return <SignInGate />;

  const { tags: tagsParam, q, status, type: typeParam } = await searchParams;
  const activeTags = tagsParam ? tagsParam.split(",").filter(Boolean) : [];
  const activeType = parseDishType(typeParam);

  const recipes = await prisma.recipe.findMany({
    where: {
      AND: [
        { userId: session.user.id },
        { tags: { some: { tag: { name: DISH_TYPE_TAG[activeType] } } } },
        ...activeTags.map((tag) => ({ tags: { some: { tag: { name: tag } } } })),
        q ? { title: { contains: q, mode: "insensitive" } } : {},
        status === "a_tester" || status === "teste" ? { status } : {},
      ],
    },
    include: { tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-5">
      <SearchBox q={q} />

      <TypeTabs activeType={activeType} tags={activeTags} q={q} status={status} />

      <div className="flex gap-2">
        <StatusFilter activeStatus={status} tags={activeTags} q={q} type={activeType} />
        <TagFilter activeTags={activeTags} status={status} q={q} type={activeType} />
      </div>

      {recipes.length === 0 ? (
        <p className="py-10 text-center text-lg font-semibold">
          Aucune recette pour l&apos;instant.{" "}
          <Link href="/recipes/new" className={`inline-block bg-[#FFD53D] px-3 py-1 text-sm ${BRUTAL_PILL}`}>
            Ajoute-en une
          </Link>
        </p>
      ) : (
        <RecipeList
          recipes={recipes.map((recipe) => ({
            id: recipe.id,
            title: recipe.title,
            imageUrl: recipe.imageUrl,
            prepTime: recipe.prepTime,
            cookTime: recipe.cookTime,
            sourceType: recipe.sourceType,
            status: recipe.status,
            rating: recipe.rating,
            tags: recipe.tags.map((t) => t.tag.name),
          }))}
        />
      )}
    </div>
  );
}
