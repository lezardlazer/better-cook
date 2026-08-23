"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BRUTAL_PILL } from "@/lib/ui";

export function ClearCartButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function clear() {
    setPending(true);
    await fetch("/api/cart", { method: "DELETE" });
    router.refresh();
    setPending(false);
  }

  return (
    <button
      onClick={clear}
      disabled={pending}
      className={`bg-white px-3 py-1.5 text-sm text-[#14110F] disabled:opacity-50 ${BRUTAL_PILL}`}
    >
      Vider le panier
    </button>
  );
}
