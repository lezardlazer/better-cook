"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RecipeCard } from "./RecipeCard";
import { RecipeStatus } from "@/lib/status";
import { CARD_COLORS, BRUTAL_BORDER, BRUTAL_SHADOW_SM } from "@/lib/ui";

export interface RecipeListItem {
  id: string;
  title: string;
  imageUrl: string | null;
  prepTime: number | null;
  cookTime: number | null;
  sourceType: string;
  status: RecipeStatus;
  rating: number | null;
  tags: string[];
}

export function RecipeList({ recipes }: { recipes: RecipeListItem[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState(false);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function addSelectedToCart() {
    setPending(true);
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected), inCart: true }),
    });
    setSelected(new Set());
    router.refresh();
    setPending(false);
  }

  return (
    <div className="flex flex-col gap-3">
      {selected.size > 0 && (
        <div
          className={`flex items-center justify-between rounded-2xl bg-[#14110F] px-4 py-3 text-white ${BRUTAL_BORDER} ${BRUTAL_SHADOW_SM}`}
        >
          <span className="font-bold">{selected.size} recette(s) sélectionnée(s)</span>
          <button
            onClick={addSelectedToCart}
            disabled={pending}
            className="rounded-full bg-[#FFD53D] px-4 py-1.5 font-bold text-[#14110F] disabled:opacity-50"
          >
            🛒 Ajouter au panier
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {recipes.map((recipe, index) => (
          <RecipeCard
            key={recipe.id}
            {...recipe}
            selected={selected.has(recipe.id)}
            onToggleSelect={toggle}
            colorClass={CARD_COLORS[index % CARD_COLORS.length]}
          />
        ))}
      </div>
    </div>
  );
}
