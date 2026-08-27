import { LEO, LEO_ASPECT, type LeoState } from "../assets";

export type CharacterProps = {
  /** Pose/emotion. All poses come from external, replaceable files. */
  state?: LeoState | undefined;
  /** Center X in stage coordinates. */
  x: number;
  /** Bottom Y (feet line) in stage coordinates. */
  y: number;
  /** Rendered height in stage px. Width always follows the original ratio. */
  height?: number | undefined;
  flip?: boolean | undefined;
  bob?: boolean | undefined;
  glow?: boolean | undefined;
  className?: string | undefined;
};

/**
 * Leo is NEVER squeezed: only the height is set, the width follows the
 * intrinsic ratio of the artwork (width:auto + object-contain).
 */
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
  const width = height * LEO_ASPECT[state];
  return (
    <div
      className={`pointer-events-none absolute select-none ${bob ? "animate-leo-bob" : ""} ${className}`}
      style={{ left: x, top: y, transform: "translate(-50%, -100%)" }}
      aria-hidden="true"
    >
      {glow && (
        <div
          className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--highlight)] opacity-60 blur-2xl"
          style={{ width: width * 1.1, height: height * 0.9 }}
        />
      )}
      <img
        src={LEO[state]}
        alt=""
        draggable={false}
        style={{
          height,
          width: "auto",
          maxWidth: "none",
          objectFit: "contain",
          transform: flip ? "scaleX(-1)" : undefined,
        }}
        className="drop-shadow-[0_12px_18px_rgba(20,60,80,0.22)]"
      />
    </div>
  );
}
