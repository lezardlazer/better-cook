export type TagCategory = "type_plat" | "regime" | "style";

export const TAG_TAXONOMY: Record<TagCategory, string[]> = {
  type_plat: ["Entrée", "Plat", "Dessert", "Snack", "Boisson"],
  regime: ["Healthy", "Protéinée", "Végé", "Vegan", "Léger"],
  style: ["Gourmande", "Rapide", "Économique", "Confort food"],
};

export const ALL_TAG_NAMES = Object.values(TAG_TAXONOMY).flat();

export function categoryForTag(name: string): TagCategory | null {
  for (const [category, names] of Object.entries(TAG_TAXONOMY) as [
    TagCategory,
    string[],
  ][]) {
    if (names.includes(name)) return category;
  }
  return null;
}
