export type TagCategory = "type_plat" | "regime" | "style";

export const TAG_TAXONOMY: Record<TagCategory, string[]> = {
  type_plat: ["Plat", "Dessert", "Snack", "Boisson"],
  regime: ["Healthy", "Protéinée", "Végé", "Vegan", "Léger"],
  style: ["Gourmande", "Rapide", "Économique", "Confort food"],
};

export const ALL_TAG_NAMES = Object.values(TAG_TAXONOMY).flat();

export type DishType = "plat" | "dessert";

export const DISH_TYPE_TAG: Record<DishType, string> = {
  plat: "Plat",
  dessert: "Dessert",
};

export function parseDishType(value?: string): DishType {
  return value === "dessert" ? "dessert" : "plat";
}

const DISH_TYPE_TAG_NAMES = new Set(Object.values(DISH_TYPE_TAG));

export const FILTERABLE_TAG_NAMES = ALL_TAG_NAMES.filter(
  (name) => !DISH_TYPE_TAG_NAMES.has(name),
);

export function categoryForTag(name: string): TagCategory | null {
  for (const [category, names] of Object.entries(TAG_TAXONOMY) as [
    TagCategory,
    string[],
  ][]) {
    if (names.includes(name)) return category;
  }
  return null;
}
