"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { StarRating } from "./StarRating";
import { STATUS_LABELS, RecipeStatus } from "@/lib/status";
import { BRUTAL_PILL } from "@/lib/ui";

interface RecipeStatusControlProps {
  id: string;
  status: RecipeStatus;
  rating: number | null;
}

export function RecipeStatusControl({ id, status, rating }: RecipeStatusControlProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function patch(data: { status?: RecipeStatus; rating?: number | null }) {
    setPending(true);
    await fetch(`/api/recipes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    router.refresh();
    setPending(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex gap-2">
        {(Object.keys(STATUS_LABELS) as RecipeStatus[]).map((s) => (
          <button
            key={s}
            type="button"
            disabled={pending}
            onClick={() => patch({ status: s })}
            className={`px-3 py-1 text-sm disabled:opacity-50 ${BRUTAL_PILL} ${
              status === s ? "bg-[#A8E890] text-[#14110F]" : "bg-white text-[#14110F]"
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>
      {status === "teste" && (
        <StarRating value={rating} onChange={(n) => patch({ rating: n })} />
      )}
    </div>
  );
}
