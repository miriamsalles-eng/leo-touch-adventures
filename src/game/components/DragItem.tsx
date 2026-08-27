import { useDragDrop, type DropResult } from "../hooks/useDragDrop";

export type DragItemProps = {
  image: string;
  start: { x: number; y: number };
  size?: number | undefined;
  disabled?: boolean | undefined;
  label?: string | undefined;
  onPickup?: ((pos: { x: number; y: number }) => void) | undefined;
  onZoneChange?: ((zoneId: string | null) => void) | undefined;
  onMove?: ((pos: { x: number; y: number }, zoneId: string | null) => void) | undefined;
  onDrop?: ((zoneId: string | null, pos: { x: number; y: number }) => DropResult) | undefined;
};

/**
 * Draggable object. Uses pointerdown + setPointerCapture so the drag survives
 * fast touchpad movements and pointer leaving the element.
 */
export function DragItem({
  image,
  start,
  size = 130,
  disabled,
  label,
  onPickup,
  onZoneChange,
  onMove,
  onDrop,
}: DragItemProps) {
  const { pos, dragging, handlers } = useDragDrop({
    start,
    size,
    disabled,
    onPickup,
    onZoneChange,
    onMove,
    onDrop,
  });

  return (
    <div
      {...handlers}
      className={`absolute select-none ${disabled ? "" : "cursor-grab"} ${dragging ? "z-30 cursor-grabbing" : "z-20"}`}
      style={{
        left: pos.x,
        top: pos.y,
        width: size,
        height: size,
        transform: `translate(-50%, -50%) scale(${dragging ? 1.12 : 1})`,
        transition: dragging ? "none" : "left .25s ease, top .25s ease, transform .15s ease",
        touchAction: "none",
      }}
    >
      <img
        src={image}
        alt={label ?? ""}
        draggable={false}
        className="h-full w-full object-contain drop-shadow-[0_10px_14px_rgba(20,60,80,0.25)]"
      />
    </div>
  );
}
