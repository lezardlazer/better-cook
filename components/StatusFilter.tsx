import Link from "next/link";
import { STATUS_LABELS, RecipeStatus } from "@/lib/status";
import { BRUTAL_PILL } from "@/lib/ui";

export function StatusFilter({
  activeStatus,
  tag,
  q,
}: {
  activeStatus?: string;
  tag?: string;
  q?: string;
}) {
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

  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <Link
          key={opt.label}
          href={href(opt.value)}
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
  );
}
