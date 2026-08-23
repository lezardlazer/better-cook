import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { DeleteRecipeButton } from "@/components/DeleteRecipeButton";
import { RecipeStatusControl } from "@/components/RecipeStatusControl";
import { CartToggleButton } from "@/components/CartToggleButton";
import { SignInGate } from "@/components/SignInGate";
import { BRUTAL_BORDER, BRUTAL_SHADOW } from "@/lib/ui";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return <SignInGate />;

  const { id } = await params;

  const recipe = await prisma.recipe.findFirst({
    where: { id, userId: session.user.id },
    include: {
      ingredients: { orderBy: { position: "asc" } },
      steps: { orderBy: { position: "asc" } },
      tags: { include: { tag: true } },
    },
  });

  if (!recipe) notFound();

  return (
    <article className="flex flex-col gap-6">
      {recipe.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={recipe.imageUrl}
          alt=""
          className={`h-56 w-full rounded-3xl object-cover ${BRUTAL_BORDER} ${BRUTAL_SHADOW}`}
        />
      )}

      <div className="flex items-start justify-between gap-3">
        <h1 className="text-3xl font-bold">{recipe.title}</h1>
        <div className="flex flex-none gap-2">
          <CartToggleButton id={recipe.id} inCart={recipe.inCart} />
          <DeleteRecipeButton id={recipe.id} />
        </div>
      </div>

      <RecipeStatusControl id={recipe.id} status={recipe.status} rating={recipe.rating} />

      <div className="flex flex-wrap gap-1.5">
        {recipe.tags.map(({ tag }) => (
          <span
            key={tag.id}
            className={`rounded-full bg-white px-2.5 py-1 text-xs font-bold ${BRUTAL_BORDER}`}
          >
            {tag.name}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 text-sm font-semibold">
        {recipe.prepTime != null && (
          <span className={`rounded-full bg-[#9FD8F5] px-3 py-1 ${BRUTAL_BORDER}`}>
            ⏱ Préparation : {recipe.prepTime} min
          </span>
        )}
        {recipe.cookTime != null && (
          <span className={`rounded-full bg-[#FFB27A] px-3 py-1 ${BRUTAL_BORDER}`}>
            🔥 Cuisson : {recipe.cookTime} min
          </span>
        )}
        {recipe.servings != null && (
          <span className={`rounded-full bg-[#A8E890] px-3 py-1 ${BRUTAL_BORDER}`}>
            🍽 {recipe.servings} portions
          </span>
        )}
      </div>

      <section className={`rounded-3xl bg-[#C9B8FA] p-4 ${BRUTAL_BORDER} ${BRUTAL_SHADOW}`}>
        <h2 className="mb-2 text-lg font-bold">Ingrédients</h2>
        <ul className="list-inside list-disc space-y-1 font-medium">
          {recipe.ingredients.map((ing) => (
            <li key={ing.id}>{ing.text}</li>
          ))}
        </ul>
      </section>

      <section className={`rounded-3xl bg-white p-4 ${BRUTAL_BORDER} ${BRUTAL_SHADOW}`}>
        <h2 className="mb-2 text-lg font-bold">Étapes</h2>
        <ol className="list-inside list-decimal space-y-2 font-medium">
          {recipe.steps.map((step) => (
            <li key={step.id}>{step.text}</li>
          ))}
        </ol>
      </section>

      {recipe.sourceUrl && (
        <a
          href={recipe.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold underline"
        >
          Voir la source d&apos;origine
        </a>
      )}
    </article>
  );
}
