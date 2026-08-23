"use client";

import Link from "next/link";
import { useState } from "react";
import { STATUS_LABELS, RecipeStatus } from "@/lib/status";
import { BRUTAL_BORDER, BRUTAL_PILL, BRUTAL_SHADOW } from "@/lib/ui";

export function StatusFilter({
  activeStatus,
  tag,
  q,
}: {
  activeStatus?: string;
  tag?: string;
  q?: string;
}) {
  const [open, setOpen] = useState(false);

  function href(status?: RecipeStatus) {
    const params = new URLSearchParams();
    if (tag) params.set("tag", tag);
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }

  const options: { value?: RecipeStatus; label: string }[] = [
    { value: undefined, label: "Tout" },
    { value: "a_tester", label: STATUS_LABELS.a_tester },
    { value: "teste", label: STATUS_LABELS.teste },
  ];

  const currentLabel = options.find((o) => o.value === activeStatus)?.label ?? "Tout";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`px-3 py-1.5 text-sm ${BRUTAL_PILL} ${
          activeStatus ? "bg-[#FFD53D] text-[#14110F]" : "bg-white text-[#14110F]"
        }`}
      >
        Statut : {currentLabel} ▾
      </button>

      {open && (
        <div
          className={`absolute left-0 top-full z-20 mt-2 flex w-44 flex-col gap-1.5 rounded-2xl bg-white p-3 ${BRUTAL_BORDER} ${BRUTAL_SHADOW}`}
        >
          {options.map((opt) => (
            <Link
              key={opt.label}
              href={href(opt.value)}
              onClick={() => setOpen(false)}
              className={`px-3 py-1 text-sm ${BRUTAL_PILL} ${
                activeStatus === opt.value || (!activeStatus && !opt.value)
                  ? "bg-[#FFD53D] text-[#14110F]"
                  : "bg-white text-[#14110F]"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
