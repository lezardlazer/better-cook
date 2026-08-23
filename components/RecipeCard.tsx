import Link from "next/link";
import { STATUS_LABELS, RecipeStatus } from "@/lib/status";
import { StarRating } from "./StarRating";
import { BRUTAL_BORDER, BRUTAL_SHADOW } from "@/lib/ui";

interface RecipeCardProps {
  id: string;
  title: string;
  imageUrl?: string | null;
  prepTime?: number | null;
  cookTime?: number | null;
  sourceType: string;
  tags: string[];
  status: RecipeStatus;
  rating: number | null;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  colorClass: string;
}

const SOURCE_ICON: Record<string, string> = {
  web: "🌐",
  youtube: "▶️",
  tiktok: "🎵",
  instagram: "📸",
  manual: "✍️",
};

export function RecipeCard({
  id,
  title,
  imageUrl,
  prepTime,
  cookTime,
  sourceType,
  tags,
  status,
  rating,
  selected,
  onToggleSelect,
  colorClass,
}: RecipeCardProps) {
  const totalTime = (prepTime ?? 0) + (cookTime ?? 0);

  return (
    <div
      className={`flex items-stretch gap-3 rounded-3xl p-3 ${colorClass} ${BRUTAL_BORDER} ${BRUTAL_SHADOW}`}
    >
      {onToggleSelect && (
        <div className="flex flex-none items-start pt-1">
          <input
            type="checkbox"
            checked={selected ?? false}
            onChange={() => onToggleSelect(id)}
            className={`h-5 w-5 rounded accent-[#14110F] ${BRUTAL_BORDER}`}
            aria-label={`Sélectionner ${title}`}
          />
        </div>
      )}
      <Link href={`/recipes/${id}`} className="flex min-w-0 flex-1 gap-3">
        <div
          className={`flex h-24 w-24 flex-none items-center justify-center overflow-hidden rounded-2xl bg-white text-3xl ${BRUTAL_BORDER}`}
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            "🍽️"
          )}
        </div>
        <div className="min-w-0 flex-1 py-0.5">
          <div className="flex items-center gap-1.5">
            <span title={sourceType}>{SOURCE_ICON[sourceType] ?? "🌐"}</span>
            <h2 className="truncate text-lg font-bold">{title}</h2>
          </div>
          {totalTime > 0 && (
            <p className="mt-0.5 text-sm font-semibold">⏱ {totalTime} min</p>
          )}
          <div className="mt-1.5 flex items-center gap-2">
            <span
              className={`rounded-full bg-white px-2 py-0.5 text-xs font-bold ${BRUTAL_BORDER}`}
            >
              {STATUS_LABELS[status]}
            </span>
            {status === "teste" && <StarRating value={rating} readOnly />}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
