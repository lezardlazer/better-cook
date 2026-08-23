"use client";

interface StarRatingProps {
  value: number | null;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

export function StarRating({ value, onChange, readOnly }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-0.5">
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n)}
          aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
          className={`text-xl leading-none ${readOnly ? "cursor-default" : "cursor-pointer"} ${
            value != null && n <= value ? "text-[#FF8552]" : "text-[#14110F]/20"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
