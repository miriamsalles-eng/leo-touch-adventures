import { LEO, type LeoState } from "../assets";

export type CharacterProps = {
  /** Pose/emotion. All poses come from external, replaceable files. */
  state?: LeoState | undefined;
  /** Center X in stage coordinates. */
  x: number;
  /** Bottom Y (feet line) in stage coordinates. */
  y: number;
  /** Rendered height in stage px. */
  height?: number | undefined;
  flip?: boolean | undefined;
  bob?: boolean | undefined;
  glow?: boolean | undefined;
  className?: string | undefined;
};

export function Character({
  state = "neutral",
  x,
  y,
  height = 300,
  flip = false,
  bob = false,
  glow = false,
  className = "",
}: CharacterProps) {
  return (
    <div
      className={`pointer-events-none absolute select-none ${bob ? "animate-leo-bob" : ""} ${className}`}
      style={{ left: x, top: y, transform: "translate(-50%, -100%)" }}
      aria-hidden="true"
    >
      {glow && (
        <div
          className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--highlight)] opacity-60 blur-2xl"
          style={{ width: height * 0.9, height: height * 0.9 }}
        />
      )}
      <img
        src={LEO[state]}
        alt=""
        draggable={false}
        style={{ height, transform: flip ? "scaleX(-1)" : undefined }}
        className="drop-shadow-[0_12px_18px_rgba(20,60,80,0.22)]"
      />
    </div>
  );
}
