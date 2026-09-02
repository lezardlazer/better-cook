import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { consolidateShoppingList } from "@/lib/shoppingList";
import { ClearCartButton } from "@/components/ClearCartButton";
import { CartToggleButton } from "@/components/CartToggleButton";
import { CartItem } from "@/components/CartItem";
import { SignInGate } from "@/components/SignInGate";
import { BRUTAL_BORDER, BRUTAL_PILL, BRUTAL_SHADOW } from "@/lib/ui";

export default async function CartPage() {
  const session = await auth();
  if (!session?.user?.id) return <SignInGate />;

  const recipes = await prisma.recipe.findMany({
    where: { inCart: true, userId: session.user.id },
    include: { ingredients: { orderBy: { position: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Panier</h1>
        <p className="py-10 text-center text-lg font-semibold">
          Ton panier est vide.{" "}
          <Link href="/" className={`inline-block bg-[#FFD53D] px-3 py-1 text-sm ${BRUTAL_PILL}`}>
            Sélectionne des recettes
          </Link>
        </p>
      </div>
    );
  }

  let shoppingList: string[] = [];
  let error: string | null = null;
  try {
    shoppingList = await consolidateShoppingList(
      recipes.map((r) => ({
        title: r.title,
        ingredients: r.ingredients.map((i) => i.text),
      })),
    );
  } catch {
    error = "Échec de la consolidation par l'IA — voici les ingrédients par recette.";
  }

  const checkedItems = await prisma.cartCheckedItem.findMany({
    where: { userId: session.user.id },
  });
  const checkedTexts = new Set(checkedItems.map((c) => c.text));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Panier</h1>
        <ClearCartButton />
      </div>

      <section className={`rounded-3xl bg-[#A8E890] p-4 ${BRUTAL_BORDER} ${BRUTAL_SHADOW}`}>
        <h2 className="mb-3 text-lg font-bold">🛒 Liste de courses</h2>
        {error && <p className="mb-2 text-sm font-semibold text-[#D6336C]">{error}</p>}
        {shoppingList.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {shoppingList.map((item, idx) => (
              <CartItem key={idx} text={item} checked={checkedTexts.has(item)} />
            ))}
          </ul>
        ) : (
          <ul className="flex flex-col gap-2">
            {recipes.flatMap((r) => r.ingredients).map((ing) => (
              <CartItem key={ing.id} text={ing.text} checked={checkedTexts.has(ing.text)} />
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Recettes sélectionnées</h2>
        <ul className="flex flex-col gap-2">
          {recipes.map((recipe) => (
            <li
              key={recipe.id}
              className={`flex items-center justify-between rounded-2xl bg-white p-3 ${BRUTAL_BORDER} ${BRUTAL_SHADOW}`}
            >
              <Link href={`/recipes/${recipe.id}`} className="font-bold hover:underline">
                {recipe.title}
              </Link>
              <CartToggleButton id={recipe.id} inCart />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
