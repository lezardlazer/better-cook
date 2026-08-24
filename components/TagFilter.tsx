"use client";

import Link from "next/link";
import { FILTERABLE_TAG_NAMES, type DishType } from "@/lib/tags";
import { BRUTAL_BORDER, BRUTAL_PILL, BRUTAL_SHADOW } from "@/lib/ui";
import { useDropdown } from "./DropdownProvider";

export function TagFilter({
  activeTags,
  status,
  q,
  type,
}: {
  activeTags: string[];
  status?: string;
  q?: string;
  type: DishType;
}) {
  const { isOpen: open, toggle } = useDropdown("tag-filter");

  function hrefFor(nextTags: string[]) {
    const params = new URLSearchParams();
    if (type !== "plat") params.set("type", type);
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    if (nextTags.length > 0) params.set("tags", nextTags.join(","));
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }

  function toggleTagHref(tag: string) {
    const next = activeTags.includes(tag)
      ? activeTags.filter((t) => t !== tag)
      : [...activeTags, tag];
    return hrefFor(next);
  }

  const label =
    activeTags.length === 0
      ? "Filtres"
      : activeTags.length === 1
        ? `Filtre : ${activeTags[0]}`
        : `Filtres (${activeTags.length})`;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        className={`px-3 py-1.5 text-sm ${BRUTAL_PILL} ${
          activeTags.length > 0 ? "bg-[#14110F] text-white" : "bg-white text-[#14110F]"
        }`}
      >
        {label} ▾
      </button>

      {open && (
        <div
          className={`absolute left-1/2 top-full z-20 mt-2 flex max-h-[70vh] w-[min(20rem,90vw)] -translate-x-1/2 flex-wrap gap-1.5 overflow-y-auto rounded-2xl bg-white p-3 ${BRUTAL_BORDER} ${BRUTAL_SHADOW}`}
        >
          <Link
            href={hrefFor([])}
            className={`px-3 py-1 text-sm ${BRUTAL_PILL} ${
              activeTags.length === 0 ? "bg-[#14110F] text-white" : "bg-white text-[#14110F]"
            }`}
          >
            Tout
          </Link>
          {FILTERABLE_TAG_NAMES.map((tag) => (
            <Link
              key={tag}
              href={toggleTagHref(tag)}
              className={`px-3 py-1 text-sm ${BRUTAL_PILL} ${
                activeTags.includes(tag) ? "bg-[#14110F] text-white" : "bg-white text-[#14110F]"
              }`}
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
