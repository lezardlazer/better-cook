"use client";

import { useState } from "react";
import { ImportFlow } from "./ImportFlow";
import { RecipeForm, RecipeFormData } from "./RecipeForm";
import { BRUTAL_PILL } from "@/lib/ui";

const BLANK_RECIPE: RecipeFormData = {
  title: "",
  sourceUrl: "",
  sourceType: "manual",
  imageUrl: undefined,
  prepTimeMinutes: null,
  cookTimeMinutes: null,
  servings: null,
  ingredients: [],
  steps: [],
  suggestedTags: [],
  rawText: "",
};

export function NewRecipeFlow() {
  const [mode, setMode] = useState<"import" | "manual">("import");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("import")}
          className={`px-3 py-1.5 text-sm ${BRUTAL_PILL} ${
            mode === "import" ? "bg-[#14110F] text-white" : "bg-white text-[#14110F]"
          }`}
        >
          Depuis un lien
        </button>
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`px-3 py-1.5 text-sm ${BRUTAL_PILL} ${
            mode === "manual" ? "bg-[#14110F] text-white" : "bg-white text-[#14110F]"
          }`}
        >
          Ajouter manuellement
        </button>
      </div>

      {mode === "import" ? (
        <ImportFlow />
      ) : (
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Ajouter une recette</h1>
          <RecipeForm initial={BLANK_RECIPE} />
        </div>
      )}
    </div>
  );
}
