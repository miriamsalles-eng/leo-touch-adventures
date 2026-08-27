import { Character } from "./Character";
import { useDragDrop, type DropResult } from "../hooks/useDragDrop";
import type { LeoState } from "../assets";

export type DraggableLeoProps = {
  start: { x: number; y: number };
  size?: number | undefined;
  state?: LeoState | undefined;
  disabled?: boolean | undefined;
  onPickup?: ((pos: { x: number; y: number }) => void) | undefined;
  onMove?: ((pos: { x: number; y: number }, zoneId: string | null, setPos: (p: { x: number; y: number }) => void) => void) | undefined;
  onDrop?: ((zoneId: string | null, pos: { x: number; y: number }) => DropResult) | undefined;
};

/** Leo himself as a draggable actor (path activities and final challenge). */
export function DraggableLeo({ start, size = 150, state = "neutral", disabled, onPickup, onMove, onDrop }: DraggableLeoProps) {
  const { pos, dragging, setPos, handlers } = useDragDrop({
    start,
    size,
    disabled,
    onPickup,
    onMove: (p, zone) => onMove?.(p, zone, setPos),
    onDrop,
  });

  return (
    <div
      {...handlers}
      className={`absolute z-30 ${disabled ? "" : dragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{
        left: pos.x,
        top: pos.y,
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
        touchAction: "none",
      }}
    >
      <Character state={state} x={size / 2} y={size} height={size * 1.5} glow={dragging} />
    </div>
  );
}
