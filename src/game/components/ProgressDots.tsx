import { STAGE_H, STAGE_W } from "../stage";

/** Discreet progress: no score, no timer — only "where am I". */
export function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div
      className="pointer-events-none absolute z-30 flex gap-[10px]"
      style={{ left: STAGE_W / 2, top: STAGE_H - 30, transform: "translate(-50%, -50%)" }}
      aria-hidden="true"
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`block rounded-full transition-all duration-300 ${
            i === current
              ? "h-[14px] w-[30px] bg-[var(--primary-deep)]"
              : i < current
                ? "h-[14px] w-[14px] bg-[var(--primary)]/70"
                : "h-[14px] w-[14px] bg-white/70"
          }`}
        />
      ))}
    </div>
  );
}
