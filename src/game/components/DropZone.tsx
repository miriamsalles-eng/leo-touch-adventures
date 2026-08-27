import { useEffect } from "react";
import type { ReactNode } from "react";
import { useDragDropContext, type Tolerance } from "../dragdrop";

export type DropZoneProps = {
  id: string;
  /** Center-based rect, stage coordinates. */
  x: number;
  y: number;
  w?: number | undefined;
  h?: number | undefined;
  /** "center": item center inside zone. "overlap": ~50% of the item over it. */
  tolerance?: Tolerance | undefined;
  /** Extra forgiving margin in stage px. */
  padding?: number | undefined;
  enabled?: boolean | undefined;
  active?: boolean | undefined;
  label?: string | undefined;
  image?: string | undefined;
  children?: ReactNode | undefined;
  /** Draws a soft dashed target ring (turn off for invisible zones). */
  showTarget?: boolean | undefined;
};

export function DropZone({
  id,
  x,
  y,
  w = 240,
  h = 240,
  tolerance = "overlap",
  padding = 40,
  enabled = true,
  active = false,
  label,
  image,
  children,
  showTarget = true,
}: DropZoneProps) {
  const { register, unregister } = useDragDropContext();

  useEffect(() => {
    register({ id, x, y, w, h, tolerance, padding, enabled });
    return () => unregister(id);
  }, [id, x, y, w, h, tolerance, padding, enabled, register, unregister]);

  return (
    <div
      className="pointer-events-none absolute flex flex-col items-center justify-center"
      style={{ left: x, top: y, width: w, height: h, transform: "translate(-50%, -50%)" }}
    >
      {showTarget && (
        <div
          className={`absolute inset-0 rounded-[36px] border-[6px] border-dashed transition-all duration-200 ${
            active
              ? "scale-105 border-[var(--highlight)] bg-[var(--highlight-soft)]"
              : "border-[var(--muted-line)] bg-white/35"
          }`}
        />
      )}
      {image && (
        <img src={image} alt="" draggable={false} className="relative" style={{ width: w * 0.72 }} />
      )}
      {children}
      {label && (
        <span className="relative mt-1 font-display text-[22px] text-foreground/80">{label}</span>
      )}
    </div>
  );
}
