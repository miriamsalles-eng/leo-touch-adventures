import { createContext, useCallback, useContext, useMemo, useRef } from "react";
import type { ReactNode } from "react";

export type Tolerance = "center" | "overlap";

export type ZoneDef = {
  id: string;
  /** Center-based rect in stage coordinates. */
  x: number;
  y: number;
  w: number;
  h: number;
  /**
   * "center"  -> the dragged item's center must be inside the zone.
   * "overlap" -> ~50% of the item area must be over the zone (more forgiving).
   */
  tolerance: Tolerance;
  /** Extra forgiving padding in px added around the zone. */
  padding: number;
  enabled: boolean;
};

export type ItemRect = { x: number; y: number; w: number; h: number };

type Ctx = {
  register: (zone: ZoneDef) => void;
  unregister: (id: string) => void;
  hitTest: (item: ItemRect) => string | null;
};

const DragDropCtx = createContext<Ctx | null>(null);

export function useDragDropContext() {
  const ctx = useContext(DragDropCtx);
  if (!ctx) throw new Error("Drag/drop components must live inside <DragDropProvider>");
  return ctx;
}

function overlapArea(a: ItemRect, b: ItemRect) {
  const dx = Math.min(a.x + a.w / 2, b.x + b.w / 2) - Math.max(a.x - a.w / 2, b.x - b.w / 2);
  const dy = Math.min(a.y + a.h / 2, b.y + b.h / 2) - Math.max(a.y - a.h / 2, b.y - b.h / 2);
  return dx > 0 && dy > 0 ? dx * dy : 0;
}

export function DragDropProvider({ children }: { children: ReactNode }) {
  const zones = useRef(new Map<string, ZoneDef>());

  const register = useCallback((zone: ZoneDef) => {
    zones.current.set(zone.id, zone);
  }, []);
  const unregister = useCallback((id: string) => {
    zones.current.delete(id);
  }, []);

  const hitTest = useCallback((item: ItemRect) => {
    let best: { id: string; score: number } | null = null;
    zones.current.forEach((z) => {
      if (!z.enabled) return;
      const zr: ItemRect = { x: z.x, y: z.y, w: z.w + z.padding * 2, h: z.h + z.padding * 2 };
      let ok = false;
      let score = 0;
      if (z.tolerance === "center") {
        ok =
          Math.abs(item.x - zr.x) <= zr.w / 2 && Math.abs(item.y - zr.y) <= zr.h / 2;
        score = -Math.hypot(item.x - zr.x, item.y - zr.y);
      } else {
        const area = overlapArea(item, zr);
        ok = area >= item.w * item.h * 0.5;
        score = area;
      }
      if (ok && (best === null || score > best.score)) best = { id: z.id, score };
    });
    return best ? (best as { id: string }).id : null;
  }, []);

  const value = useMemo(() => ({ register, unregister, hitTest }), [register, unregister, hitTest]);
  return <DragDropCtx.Provider value={value}>{children}</DragDropCtx.Provider>;
}
