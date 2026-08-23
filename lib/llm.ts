import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { ALL_TAG_NAMES } from "./tags";

const client = new Anthropic();

const StructuredRecipeSchema = z.object({
  title: z.string(),
  prepTimeMinutes: z.number().int().nullable(),
  cookTimeMinutes: z.number().int().nullable(),
  servings: z.number().int().nullable(),
  ingredients: z.array(z.string()),
  steps: z.array(z.string()),
  suggestedTags: z.array(z.enum(ALL_TAG_NAMES as [string, ...string[]])),
});

export type StructuredRecipe = z.infer<typeof StructuredRecipeSchema>;

const SYSTEM_PROMPT = `Tu structures des recettes de cuisine à partir d'un texte brut (page web ou légende de vidéo).
Réponds uniquement avec les données extraites, dans la langue d'origine de la recette (le français si le texte est en français).
Règles :
- ingredients : une entrée par ingrédient, avec quantité si disponible (ex: "200g de farine").
- steps : les étapes de préparation dans l'ordre, une action claire par étape.
- prepTimeMinutes / cookTimeMinutes / servings : null si non trouvés dans le texte, ne jamais inventer de valeur.
- suggestedTags : choisis uniquement parmi la liste de tags autorisés, seulement ceux pertinents (2 à 5 tags typiquement).`;

export async function structureRecipe(rawText: string): Promise<StructuredRecipe> {
  const response = await client.messages.parse({
    model: "claude-haiku-4-5",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Tags autorisés: ${ALL_TAG_NAMES.join(", ")}\n\nTexte source:\n${rawText}`,
      },
    ],
    output_config: {
      format: zodOutputFormat(StructuredRecipeSchema),
    },
  });

  if (!response.parsed_output) {
    throw new Error("L'IA n'a pas réussi à structurer cette recette.");
  }

  return response.parsed_output;
}
