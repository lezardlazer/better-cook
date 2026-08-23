"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ALL_TAG_NAMES } from "@/lib/tags";
import { BRUTAL_BORDER, BRUTAL_PILL, BRUTAL_SHADOW, BRUTAL_PRESS } from "@/lib/ui";

export interface RecipeFormData {
  title: string;
  sourceUrl: string;
  sourceType: string;
  imageUrl?: string;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  servings: number | null;
  ingredients: string[];
  steps: string[];
  suggestedTags: string[];
  rawText: string;
}

const inputClass = `w-full rounded-2xl bg-white px-3 py-2 text-sm font-medium focus:outline-none ${BRUTAL_BORDER}`;
const labelClass = "mb-1 block text-sm font-bold";

export function RecipeForm({ initial }: { initial: RecipeFormData }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [prepTime, setPrepTime] = useState(initial.prepTimeMinutes ?? "");
  const [cookTime, setCookTime] = useState(initial.cookTimeMinutes ?? "");
  const [servings, setServings] = useState(initial.servings ?? "");
  const [ingredients, setIngredients] = useState(initial.ingredients.join("\n"));
  const [steps, setSteps] = useState(initial.steps.join("\n"));
  const [tags, setTags] = useState<string[]>(initial.suggestedTags);
  const [imageUrl, setImageUrl] = useState(initial.imageUrl);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload-image", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de l'envoi de l'image.");
      setImageUrl(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'envoi de l'image.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          sourceUrl: initial.sourceUrl,
          sourceType: initial.sourceType,
          imageUrl,
          prepTimeMinutes: prepTime === "" ? null : Number(prepTime),
          cookTimeMinutes: cookTime === "" ? null : Number(cookTime),
          servings: servings === "" ? null : Number(servings),
          ingredients: ingredients.split("\n").map((s) => s.trim()).filter(Boolean),
          steps: steps.split("\n").map((s) => s.trim()).filter(Boolean),
          tags,
          rawExtract: initial.rawText,
        }),
      });
      if (!res.ok) throw new Error("Échec de l'enregistrement.");
      const recipe = await res.json();
      router.push(`/recipes/${recipe.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className={labelClass}>Titre</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Image</label>
        <div className="flex items-center gap-3">
          <div
            className={`flex h-20 w-20 flex-none items-center justify-center overflow-hidden rounded-2xl bg-white text-2xl ${BRUTAL_BORDER}`}
          >
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              "🍽️"
            )}
          </div>
          <label
            className={`cursor-pointer bg-white px-3 py-2 text-sm ${BRUTAL_PILL} ${uploadingImage ? "opacity-50" : ""}`}
          >
            {uploadingImage ? "Envoi…" : imageUrl ? "Changer l'image" : "Ajouter une image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              disabled={uploadingImage}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className={labelClass}>Préparation (min)</label>
          <input
            type="number"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value === "" ? "" : Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div className="flex-1">
          <label className={labelClass}>Cuisson (min)</label>
          <input
            type="number"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value === "" ? "" : Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div className="flex-1">
          <label className={labelClass}>Portions</label>
          <input
            type="number"
            value={servings}
            onChange={(e) => setServings(e.target.value === "" ? "" : Number(e.target.value))}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Ingrédients (un par ligne)</label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          rows={6}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Étapes (une par ligne)</label>
        <textarea
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          rows={6}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Tags</label>
        <div className="flex flex-wrap gap-2">
          {ALL_TAG_NAMES.map((tagName) => (
            <button
              type="button"
              key={tagName}
              onClick={() => toggleTag(tagName)}
              className={`px-3 py-1 text-sm ${BRUTAL_PILL} ${
                tags.includes(tagName) ? "bg-[#A8E890] text-[#14110F]" : "bg-white text-[#14110F]"
              }`}
            >
              {tagName}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm font-semibold text-[#D6336C]">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving || uploadingImage || !title.trim()}
        className={`rounded-full bg-[#FFD53D] px-4 py-3 font-bold text-[#14110F] disabled:opacity-50 ${BRUTAL_BORDER} ${BRUTAL_SHADOW} ${BRUTAL_PRESS}`}
      >
        {saving ? "Enregistrement…" : "Enregistrer la recette"}
      </button>
    </div>
  );
}
