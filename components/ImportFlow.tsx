"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RecipeForm, RecipeFormData } from "@/components/RecipeForm";
import { BRUTAL_BORDER, BRUTAL_PILL, BRUTAL_SHADOW } from "@/lib/ui";

const URL_PATTERN = /https?:\/\/\S+/i;

function extractUrl(...values: (string | null)[]): string {
  for (const value of values) {
    if (!value) continue;
    const match = value.match(URL_PATTERN);
    if (match) return match[0];
  }
  return "";
}

function ImportFlowInner() {
  const searchParams = useSearchParams();
  const sharedUrl = extractUrl(searchParams.get("url"), searchParams.get("text"));
  const autoRun = useRef(false);

  const [url, setUrl] = useState(sharedUrl);
  const [manualCaption, setManualCaption] = useState("");
  const [needsManualCaption, setNeedsManualCaption] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RecipeFormData | null>(null);

  async function runImport(withManualCaption: boolean, importUrl?: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: importUrl ?? url,
          manualCaption: withManualCaption ? manualCaption : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.needsManualCaption) {
          setNeedsManualCaption(true);
        } else {
          setError(data.error ?? "Échec de l'import.");
        }
        return;
      }
      setNeedsManualCaption(false);
      setResult(data);
    } catch {
      setError("Échec de l'import.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (sharedUrl && !autoRun.current) {
      autoRun.current = true;
      runImport(false, sharedUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedUrl]);

  if (result) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Vérifie et ajuste la recette</h1>
        <RecipeForm initial={result} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Ajouter une recette</h1>
      <p className="text-sm font-medium">
        Colle un lien de site web, TikTok, Instagram ou YouTube.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          runImport(false);
        }}
        className="flex gap-2"
      >
        <input
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          className={`w-full rounded-2xl bg-white px-3 py-2 text-sm font-medium focus:outline-none ${BRUTAL_BORDER}`}
        />
        <button
          type="submit"
          disabled={loading}
          className={`flex-none bg-[#FFD53D] px-4 py-2 text-sm text-[#14110F] disabled:opacity-50 ${BRUTAL_PILL}`}
        >
          {loading ? "Import…" : "Importer"}
        </button>
      </form>

      {error && <p className="text-sm font-semibold text-[#D6336C]">{error}</p>}

      {needsManualCaption && (
        <div className={`flex flex-col gap-2 rounded-3xl bg-[#FFD53D] p-4 ${BRUTAL_BORDER} ${BRUTAL_SHADOW}`}>
          <p className="text-sm font-semibold">
            L&apos;extraction automatique de la légende a échoué (fréquent sur
            Instagram). Colle la légende de la vidéo ci-dessous :
          </p>
          <textarea
            value={manualCaption}
            onChange={(e) => setManualCaption(e.target.value)}
            rows={5}
            className={`w-full rounded-2xl bg-white px-3 py-2 text-sm font-medium focus:outline-none ${BRUTAL_BORDER}`}
            placeholder="Colle ici la légende / description de la vidéo…"
          />
          <button
            onClick={() => runImport(true)}
            disabled={loading || !manualCaption.trim()}
            className={`self-start bg-[#14110F] px-4 py-2 text-sm text-white disabled:opacity-50 ${BRUTAL_PILL}`}
          >
            {loading ? "Import…" : "Continuer avec cette légende"}
          </button>
        </div>
      )}
    </div>
  );
}

export function ImportFlow() {
  return (
    <Suspense fallback={null}>
      <ImportFlowInner />
    </Suspense>
  );
}
