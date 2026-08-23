import Link from "next/link";
import { ALL_TAG_NAMES } from "@/lib/tags";
import { BRUTAL_PILL } from "@/lib/ui";

export function TagFilter({
  activeTag,
  status,
  q,
}: {
  activeTag?: string;
  status?: string;
  q?: string;
}) {
  function href(tag?: string) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    if (tag) params.set("tag", tag);
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={href()}
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
          className={`px-3 py-1 text-sm ${BRUTAL_PILL} ${
            activeTag === tag ? "bg-[#14110F] text-white" : "bg-white text-[#14110F]"
          }`}
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
