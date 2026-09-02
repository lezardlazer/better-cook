"use client";

import { useState } from "react";
import { BRUTAL_BORDER } from "@/lib/ui";

export function CartItem({ text, checked: initialChecked }: { text: string; checked: boolean }) {
  const [checked, setChecked] = useState(initialChecked);
  const [pending, setPending] = useState(false);

  async function toggle() {
    const next = !checked;
    setChecked(next);
    setPending(true);
    await fetch("/api/cart/checked", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, checked: next }),
    });
    setPending(false);
  }

  return (
    <li className={`flex items-center gap-3 rounded-xl bg-white px-3 py-2 ${BRUTAL_BORDER}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={pending}
        onChange={toggle}
        className={`h-5 w-5 rounded accent-[#14110F] ${BRUTAL_BORDER}`}
      />
      <span className={`font-medium ${checked ? "text-[#14110F]/40 line-through" : ""}`}>{text}</span>
    </li>
  );
}
