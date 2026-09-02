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
      {stars.map((n) => {
        const fill = value == null ? 0 : Math.max(0, Math.min(1, value - (n - 1)));
        return (
          <div key={n} className="relative text-xl leading-none">
            <span className="text-[#14110F]/20">★</span>
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 overflow-hidden text-[#FF8552]"
              style={{ width: `${fill * 100}%` }}
            >
              ★
            </span>
            {!readOnly && (
              <>
                <button
                  type="button"
                  onClick={() => onChange?.(n - 0.5)}
                  aria-label={`${n - 0.5} étoile${n - 0.5 > 1 ? "s" : ""}`}
                  className="absolute inset-y-0 left-0 w-1/2 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => onChange?.(n)}
                  aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
                  className="absolute inset-y-0 right-0 w-1/2 cursor-pointer"
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
