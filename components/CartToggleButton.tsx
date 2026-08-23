"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BRUTAL_PILL } from "@/lib/ui";

export function CartToggleButton({ id, inCart }: { id: string; inCart: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function toggle() {
    setPending(true);
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [id], inCart: !inCart }),
    });
    router.refresh();
    setPending(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`px-3 py-1.5 text-sm disabled:opacity-50 ${BRUTAL_PILL} ${
        inCart ? "bg-[#14110F] text-white" : "bg-[#9FD8F5] text-[#14110F]"
      }`}
    >
      {inCart ? "🛒 Retirer du panier" : "🛒 Ajouter au panier"}
    </button>
  );
}
