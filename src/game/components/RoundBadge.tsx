/** Discreet in-activity counter (1/4). Never a score — only "how many left". */
export function RoundBadge({ current, total, x = 200, y = 40 }: { current: number; total: number; x?: number; y?: number }) {
  return (
    <div
      className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-card bg-card/90 px-7 py-2 font-display text-[26px] text-foreground shadow-[var(--shadow-soft)]"
      style={{ left: x, top: y }}
      aria-hidden="true"
    >
      {current}/{total}
    </div>
  );
}
