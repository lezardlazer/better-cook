"use client";

import Link from "next/link";
import { ALL_TAG_NAMES } from "@/lib/tags";
import { BRUTAL_BORDER, BRUTAL_PILL, BRUTAL_SHADOW } from "@/lib/ui";
import { useDropdown } from "./DropdownProvider";

export function TagFilter({
  activeTag,
  status,
  q,
}: {
  activeTag?: string;
  status?: string;
  q?: string;
}) {
  const { isOpen: open, toggle, close } = useDropdown("tag-filter");

  function href(tag?: string) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    if (tag) params.set("tag", tag);
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        className={`px-3 py-1.5 text-sm ${BRUTAL_PILL} ${
          activeTag ? "bg-[#14110F] text-white" : "bg-white text-[#14110F]"
        }`}
      >
        {activeTag ? `Filtre : ${activeTag}` : "Filtres"} ▾
      </button>

      {open && (
        <div
          className={`absolute left-1/2 top-full z-20 mt-2 flex max-h-[70vh] w-[min(20rem,90vw)] -translate-x-1/2 flex-wrap gap-1.5 overflow-y-auto rounded-2xl bg-white p-3 ${BRUTAL_BORDER} ${BRUTAL_SHADOW}`}
        >
          <Link
            href={href()}
            onClick={close}
            className={`px-3 py-1 text-sm ${BRUTAL_PILL} ${
              !activeTag ? "bg-[#14110F] text-white" : "bg-white text-[#14110F]"
            }`}
          >
            Tout
          </Link>
          {ALL_TAG_NAMES.map((tag) => (
            <Link
              key={tag}
              href={href(tag)}
              onClick={close}
              className={`px-3 py-1 text-sm ${BRUTAL_PILL} ${
                activeTag === tag ? "bg-[#14110F] text-white" : "bg-white text-[#14110F]"
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
