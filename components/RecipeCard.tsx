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
  tags: string[];
  status: RecipeStatus;
  rating: number | null;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  colorClass: string;
}

export function RecipeCard({
  id,
  title,
  imageUrl,
  prepTime,
  cookTime,
  tags,
  status,
  rating,
  selected,
  onToggleSelect,
  colorClass,
}: RecipeCardProps) {
  const totalTime = (prepTime ?? 0) + (cookTime ?? 0);
  const visibleTags = tags.slice(0, 3);
  const extraTagCount = tags.length - visibleTags.length;

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-3xl ${colorClass} ${BRUTAL_BORDER} ${BRUTAL_SHADOW}`}
    >
      {onToggleSelect && (
        <input
          type="checkbox"
          checked={selected ?? false}
          onChange={() => onToggleSelect(id)}
          aria-label={`Sélectionner ${title}`}
          className={`absolute left-2 top-2 z-10 h-5 w-5 rounded bg-white accent-[#14110F] ${BRUTAL_BORDER}`}
        />
      )}
      <Link href={`/recipes/${id}`} className="flex flex-col">
        <div className="flex aspect-square w-full items-center justify-center overflow-hidden border-b-[2px] border-[#14110F] bg-white text-4xl">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            "🍽️"
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1 p-2.5">
          <h2 className="line-clamp-2 text-sm font-bold leading-tight">{title}</h2>
          {totalTime > 0 && <p className="text-xs font-semibold">⏱ {totalTime} min</p>}
          <div className="flex flex-wrap items-center gap-1">
            <span
              className={`rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold ${BRUTAL_BORDER}`}
            >
              {STATUS_LABELS[status]}
            </span>
            {status === "teste" && <StarRating value={rating} readOnly />}
          </div>
          {visibleTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {visibleTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/70 px-1.5 py-0.5 text-[10px] font-semibold"
                >
                  {tag}
                </span>
              ))}
              {extraTagCount > 0 && (
                <span className="rounded-full bg-white/70 px-1.5 py-0.5 text-[10px] font-semibold">
                  +{extraTagCount}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
