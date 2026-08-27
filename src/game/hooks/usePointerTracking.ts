import { useEffect, useRef, useState } from "react";
import { useStage } from "../stage";

export type StagePoint = { x: number; y: number };

/**
 * Tracks the pointer inside the stage (pointermove / pointerenter / pointerleave)
 * and reports its position in stage coordinates. Used by "move the arrow"
 * activities — no click required.
 */
export function usePointerTracking(enabled = true) {
  const { stageRef, toStage } = useStage();
  const [point, setPoint] = useState<StagePoint | null>(null);
  const [inside, setInside] = useState(false);
  const ref = useRef({ toStage });
  ref.current.toStage = toStage;

  useEffect(() => {
    const el = stageRef.current;
    if (!el || !enabled) return;
    const onMove = (e: PointerEvent) => setPoint(ref.current.toStage(e.clientX, e.clientY));
    const onEnter = (e: PointerEvent) => {
      setInside(true);
      setPoint(ref.current.toStage(e.clientX, e.clientY));
    };
    const onLeave = () => {
      setInside(false);
      setPoint(null);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, stageRef]);

  return { point, inside };
}

export const distance = (a: StagePoint, b: StagePoint) => Math.hypot(a.x - b.x, a.y - b.y);
