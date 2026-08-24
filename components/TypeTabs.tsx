import Link from "next/link";
import { BRUTAL_PILL } from "@/lib/ui";
import type { DishType } from "@/lib/tags";

const TYPE_TABS: { value: DishType; label: string }[] = [
  { value: "plat", label: "Plats" },
  { value: "dessert", label: "Desserts" },
];

export function TypeTabs({
  activeType,
  tags,
  q,
  status,
}: {
  activeType: DishType;
  tags?: string[];
  q?: string;
  status?: string;
}) {
  function href(type: DishType) {
    const params = new URLSearchParams();
    if (type !== "plat") params.set("type", type);
    if (tags && tags.length > 0) params.set("tags", tags.join(","));
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }

  return (
    <div className="flex gap-2">
      {TYPE_TABS.map((tab) => (
        <Link
          key={tab.value}
          href={href(tab.value)}
          className={`px-4 py-2 text-sm ${BRUTAL_PILL} ${
            activeType === tab.value ? "bg-[#14110F] text-white" : "bg-white text-[#14110F]"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
