import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export interface WebExtractResult {
  rawText: string;
  imageUrl?: string;
}

function textFromHowToStep(step: unknown): string {
  if (typeof step === "string") return step;
  if (step && typeof step === "object") {
    const s = step as Record<string, unknown>;
    if (typeof s.text === "string") return s.text;
    if (typeof s.name === "string") return s.name;
    if (Array.isArray(s.itemListElement)) {
      return s.itemListElement.map(textFromHowToStep).join(" ");
    }
  }
  return "";
}

function findRecipeNode(node: unknown): Record<string, unknown> | null {
  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findRecipeNode(item);
      if (found) return found;
    }
    return null;
  }
  if (node && typeof node === "object") {
    const obj = node as Record<string, unknown>;
    const type = obj["@type"];
    const isRecipe =
      type === "Recipe" || (Array.isArray(type) && type.includes("Recipe"));
    if (isRecipe) return obj;
    if (Array.isArray(obj["@graph"])) {
      const found = findRecipeNode(obj["@graph"]);
      if (found) return found;
    }
  }
  return null;
}

function extractJsonLdRecipe(dom: JSDOM): WebExtractResult | null {
  const scripts = dom.window.document.querySelectorAll(
    'script[type="application/ld+json"]',
  );

  for (const script of scripts) {
    try {
      const parsed = JSON.parse(script.textContent ?? "");
      const recipe = findRecipeNode(parsed);
      if (!recipe) continue;

      const name = typeof recipe.name === "string" ? recipe.name : "";
      const ingredients = Array.isArray(recipe.recipeIngredient)
        ? (recipe.recipeIngredient as unknown[]).filter(
            (i): i is string => typeof i === "string",
          )
        : [];
      const instructions = Array.isArray(recipe.recipeInstructions)
        ? (recipe.recipeInstructions as unknown[])
            .map(textFromHowToStep)
            .filter(Boolean)
        : typeof recipe.recipeInstructions === "string"
          ? [recipe.recipeInstructions]
          : [];

      const lines = [
        `Titre: ${name}`,
        recipe.prepTime ? `Temps de préparation (ISO 8601): ${recipe.prepTime}` : "",
        recipe.cookTime ? `Temps de cuisson (ISO 8601): ${recipe.cookTime}` : "",
        recipe.totalTime ? `Temps total (ISO 8601): ${recipe.totalTime}` : "",
        recipe.recipeYield ? `Portions: ${recipe.recipeYield}` : "",
        "Ingrédients:",
        ...ingredients.map((i) => `- ${i}`),
        "Étapes:",
        ...instructions.map((s, idx) => `${idx + 1}. ${s}`),
      ].filter(Boolean);

      let imageUrl: string | undefined;
      const image = recipe.image;
      if (typeof image === "string") imageUrl = image;
      else if (Array.isArray(image) && typeof image[0] === "string")
        imageUrl = image[0];
      else if (image && typeof image === "object" && "url" in image) {
        const url = (image as Record<string, unknown>).url;
        if (typeof url === "string") imageUrl = url;
      }

      if (ingredients.length > 0 || instructions.length > 0) {
        return { rawText: lines.join("\n"), imageUrl };
      }
    } catch {
      // Ignore malformed JSON-LD blocks and keep looking.
    }
  }

  return null;
}

export async function extractWebRecipe(url: string): Promise<WebExtractResult> {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; RecipeHub/1.0)" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`Impossible de récupérer la page (HTTP ${response.status})`);
  }
  const html = await response.text();
  const dom = new JSDOM(html, { url });

  const jsonLd = extractJsonLdRecipe(dom);
  if (jsonLd) return jsonLd;

  const article = new Readability(dom.window.document).parse();
  if (!article?.textContent) {
    throw new Error("Impossible d'extraire le contenu de la page.");
  }

  return { rawText: article.textContent.trim() };
}
