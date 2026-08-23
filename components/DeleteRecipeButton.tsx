"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BRUTAL_PILL } from "@/lib/ui";

export function DeleteRecipeButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm("Supprimer cette recette ?")) return;
    setPending(true);
    await fetch(`/api/recipes/${id}`, { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className={`bg-[#FFB4C6] px-3 py-1.5 text-sm text-[#14110F] disabled:opacity-50 ${BRUTAL_PILL}`}
    >
      {pending ? "Suppression…" : "Supprimer"}
    </button>
  );
}
