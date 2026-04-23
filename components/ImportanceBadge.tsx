// Importance tiers (v0.2):
//   1        → no badge at all (renders null)
//   2-4      → routine  (sage)
//   5-7      → insight  (StackOverflow orange)
//   8-10     → gem      (deep terracotta / amber)

export function classifyImportance(v: number) {
  if (v <= 1) return null;
  if (v >= 8)
    return {
      label: "gem",
      bg: "rgba(184, 85, 16, 0.13)",
      fg: "#9a4d10",
      star: "#b45910",
    };
  if (v >= 5)
    return {
      label: "insightful",
      bg: "rgba(244, 128, 36, 0.13)",
      fg: "#b05614",
      star: "#f48024",
    };
  return {
    label: "routine",
    bg: "rgba(107, 101, 88, 0.10)",
    fg: "#6b6558",
    star: "#8a8072",
  };
}

export default function ImportanceBadge({ value }: { value: number }) {
  const tier = classifyImportance(value);
  if (!tier) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase"
      style={{ backgroundColor: tier.bg, color: tier.fg }}
      title={`Importance ${value}/10 — ${tier.label}`}
    >
      <span className="font-mono font-semibold tabular-nums text-[10.5px]">
        {value}/10
      </span>
      <span className="opacity-80">{tier.label}</span>
    </span>
  );
}
