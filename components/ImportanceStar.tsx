import { Star } from "lucide-react";
import { classifyImportance } from "./ImportanceBadge";

// Star + "X/10" — used on landing-page post cards.
// Returns null for value <= 1 (no visible rating).

export default function ImportanceStar({ value }: { value: number }) {
  const tier = classifyImportance(value);
  if (!tier) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono tabular-nums text-[12px] font-semibold"
      style={{ color: tier.star }}
      title={`Importance ${value}/10 — ${tier.label}`}
    >
      <Star
        className="w-3.5 h-3.5"
        fill={tier.star}
        strokeWidth={0}
        aria-hidden
      />
      {value}/10
    </span>
  );
}
