import { useCallback, useEffect, useRef, useState } from "react";
import { clamp, STAGE_H, STAGE_W, useStage } from "../stage";
import { useDragDropContext } from "../dragdrop";

export type DropResult = { x: number; y: number } | "return" | "stay";

export type UseDragDropOptions = {
  start: { x: number; y: number };
  /** Item hit size in stage px (used for drop tolerance math). */
  size: number;
  disabled?: boolean | undefined;
  onPickup?: ((pos: { x: number; y: number }) => void) | undefined;
  onMove?: ((pos: { x: number; y: number }, zoneId: string | null) => void) | undefined;
  onZoneChange?: ((zoneId: string | null) => void) | undefined;
  /** Return where the item should land. "return" animates back to `start`. */
  onDrop?: ((zoneId: string | null, pos: { x: number; y: number }) => DropResult) | undefined;
};

/**
 * Pointer Events drag engine: pointerdown + setPointerCapture, pointermove,
 * pointerup. Coordinates are always converted into the 1280x720 stage space,
 * so drags behave identically at 1366x768, 1280x720 and 1920x1080.
 */
export function useDragDrop({
  start,
  size,
  disabled,
  onPickup,
  onMove,
  onZoneChange,
  onDrop,
}: UseDragDropOptions) {
  const { toStage } = useStage();
  const { hitTest } = useDragDropContext();
  const [pos, setPos] = useState(start);
  const [dragging, setDragging] = useState(false);
  const grab = useRef({ dx: 0, dy: 0 });
  const zoneRef = useRef<string | null>(null);
  const startRef = useRef(start);
  startRef.current = start;

  useEffect(() => {
    if (!dragging) setPos(start);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start.x, start.y]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      const p = toStage(e.clientX, e.clientY);
      grab.current = { dx: p.x - pos.x, dy: p.y - pos.y };
      setDragging(true);
      onPickup?.(pos);
    },
    [disabled, onPickup, pos, toStage],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const p = toStage(e.clientX, e.clientY);
      const next = {
        x: clamp(p.x - grab.current.dx, size / 2, STAGE_W - size / 2),
        y: clamp(p.y - grab.current.dy, size / 2, STAGE_H - size / 2),
      };
      setPos(next);
      const zone = hitTest({ x: next.x, y: next.y, w: size, h: size });
      if (zone !== zoneRef.current) {
        zoneRef.current = zone;
        onZoneChange?.(zone);
      }
      onMove?.(next, zone);
    },
    [dragging, hitTest, onMove, onZoneChange, size, toStage],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        /* pointer already released */
      }
      setDragging(false);
      const zone = hitTest({ x: pos.x, y: pos.y, w: size, h: size });
      zoneRef.current = null;
      onZoneChange?.(null);
      const result = onDrop?.(zone, pos) ?? "stay";
      if (result === "return") setPos(startRef.current);
      else if (result !== "stay") setPos(result);
    },
    [dragging, hitTest, onDrop, onZoneChange, pos, size],
  );

  return {
    pos,
    dragging,
    setPos,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  };
}
