import { STAGE_H, STAGE_W } from "../stage";

export type BubbleSide = "auto" | "left" | "right" | "above";

export type SpeechBubbleProps = {
  text: string;
  /** Anchor = the character the bubble belongs to. */
  anchorX: number;
  /** Anchor top Y (head line) in stage coordinates. */
  anchorY: number;
  anchorWidth?: number | undefined;
  side?: BubbleSide | undefined;
  width?: number | undefined;
  tone?: "normal" | "cheer" | undefined;
};

/**
 * Smart speech bubble: chooses left / right / above so it never covers Leo nor
 * runs off the stage, and always keeps a safe margin from the borders.
 */
export function SpeechBubble({
  text,
  anchorX,
  anchorY,
  anchorWidth = 180,
  side = "auto",
  width = 340,
  tone = "normal",
}: SpeechBubbleProps) {
  const margin = 32;
  const gap = 24;
  const estHeight = 118;

  let resolved: Exclude<BubbleSide, "auto"> = side === "auto" ? "right" : side;
  if (side === "auto") {
    const spaceRight = STAGE_W - (anchorX + anchorWidth / 2);
    const spaceLeft = anchorX - anchorWidth / 2;
    if (spaceRight >= width + gap + margin) resolved = "right";
    else if (spaceLeft >= width + gap + margin) resolved = "left";
    else resolved = "above";
    if (resolved === "above" && anchorY - estHeight - gap < margin) {
      resolved = spaceRight >= spaceLeft ? "right" : "left";
    }
  }

  let left = anchorX;
  let top = anchorY;
  let transform = "translate(0, 0)";
  if (resolved === "right") {
    left = Math.min(anchorX + anchorWidth / 2 + gap, STAGE_W - width - margin);
    top = Math.max(anchorY - 30, margin);
    transform = "translate(0, 0)";
  } else if (resolved === "left") {
    left = Math.max(anchorX - anchorWidth / 2 - gap - width, margin);
    top = Math.max(anchorY - 30, margin);
  } else {
    left = Math.min(Math.max(anchorX - width / 2, margin), STAGE_W - width - margin);
    top = Math.max(anchorY - estHeight - gap, margin);
  }
  top = Math.min(top, STAGE_H - estHeight - margin);

  return (
    <div
      className="pointer-events-none absolute animate-pop-in"
      style={{ left, top, width, transform }}
      role="status"
      aria-live="polite"
    >
      <div
        className={`relative rounded-[28px] border-4 px-6 py-4 text-center shadow-[var(--shadow-soft)] ${
          tone === "cheer"
            ? "border-[var(--highlight)] bg-card"
            : "border-card bg-card"
        }`}
      >
        <p className="font-display text-[27px] leading-tight text-foreground">{text}</p>
        <span
          className={`absolute h-5 w-5 rotate-45 border-4 bg-card ${
            tone === "cheer" ? "border-[var(--highlight)]" : "border-card"
          }`}
          style={
            resolved === "right"
              ? { left: -12, top: 46, borderTop: "none", borderRight: "none" }
              : resolved === "left"
                ? { right: -12, top: 46, borderBottom: "none", borderLeft: "none" }
                : { bottom: -12, left: width / 2 - 10, borderTop: "none", borderLeft: "none" }
          }
        />
      </div>
    </div>
  );
}
