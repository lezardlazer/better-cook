import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

const client = new Anthropic();

const ShoppingListSchema = z.object({
  items: z.array(z.string()),
});

const SYSTEM_PROMPT = `Tu fusionnes les listes d'ingrédients de plusieurs recettes en une liste de courses unique.
Règles :
- Regroupe les ingrédients identiques ou équivalents (ex: "farine" et "de la farine") en une seule ligne.
- Additionne les quantités quand les unités sont identiques ou facilement convertibles (ex: "200g de farine" + "100g de farine" -> "300g de farine").
- Si les quantités ne sont pas précisées ou pas comparables, garde une formulation simple sans inventer de chiffre.
- Trie la liste par ordre alphabétique.
- Réponds uniquement avec la liste consolidée, dans la langue d'origine (français).`;

export async function consolidateShoppingList(
  ingredientsByRecipe: { title: string; ingredients: string[] }[],
): Promise<string[]> {
  const allEmpty = ingredientsByRecipe.every((r) => r.ingredients.length === 0);
  if (allEmpty) return [];

  const inputText = ingredientsByRecipe
    .map((r) => `Recette "${r.title}":\n${r.ingredients.map((i) => `- ${i}`).join("\n")}`)
    .join("\n\n");

  const response = await client.messages.parse({
    model: "claude-haiku-4-5",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: inputText }],
    output_config: {
      format: zodOutputFormat(ShoppingListSchema),
    },
  });

  if (!response.parsed_output) {
    throw new Error("L'IA n'a pas réussi à générer la liste de courses.");
  }

  return response.parsed_output.items;
}
