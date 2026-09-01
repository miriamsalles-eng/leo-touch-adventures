import { STAGE_H, STAGE_W } from "../stage";
import { UI } from "../assets";
import { speech } from "../speech";

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
 * runs off the stage. The tail is short, clean and always points at Leo.
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
  /* The bubble only DISPLAYS the line. Who starts a narration is the owner of
     that message type (useNarration, useInstructionSpeech, SkillIntro,
     useFeedback) — never the bubble itself. */



  const margin = 32;
  const gap = 26;
  const estHeight = 118;
  const minWidth = 250;

  const spaceRight = STAGE_W - (anchorX + anchorWidth / 2) - gap - margin;
  const spaceLeft = anchorX - anchorWidth / 2 - gap - margin;
  /** Leo on the left half speaks to the right, and vice-versa. */
  const prefer: "left" | "right" = anchorX <= STAGE_W / 2 ? "right" : "left";
  const other = prefer === "right" ? "left" : "right";

  let resolved: Exclude<BubbleSide, "auto"> = side === "auto" ? prefer : side;
  let w = width;

  if (side === "auto") {
    const preferSpace = prefer === "right" ? spaceRight : spaceLeft;
    const otherSpace = prefer === "right" ? spaceLeft : spaceRight;
    if (preferSpace >= minWidth) {
      resolved = prefer;
      w = Math.min(width, preferSpace);
    } else if (otherSpace >= minWidth) {
      resolved = other;
      w = Math.min(width, otherSpace);
    } else {
      resolved = "above";
    }
    if (resolved === "above" && anchorY - estHeight - gap < margin) {
      resolved = preferSpace >= otherSpace ? prefer : other;
      w = Math.max(minWidth, Math.min(width, Math.max(preferSpace, otherSpace)));
    }
  }

  let left = anchorX;
  let top = anchorY;
  if (resolved === "right") {
    left = Math.min(anchorX + anchorWidth / 2 + gap, STAGE_W - w - margin);
    top = Math.max(anchorY - 30, margin);
  } else if (resolved === "left") {
    left = Math.max(anchorX - anchorWidth / 2 - gap - w, margin);
    top = Math.max(anchorY - 30, margin);
  } else {
    left = Math.min(Math.max(anchorX - w / 2, margin), STAGE_W - w - margin);
    top = Math.max(anchorY - estHeight - gap, margin);
  }
  top = Math.min(top, STAGE_H - estHeight - margin);

  /* Keep clear of the reserved top-center feedback band. */
  const overlapsFeedbackBand = left < STAGE_W / 2 + 240 && left + w > STAGE_W / 2 - 240;
  if (overlapsFeedbackBand && top < 118) top = 118;


  const border = tone === "cheer" ? "var(--highlight)" : "var(--bubble-line)";

  /* The tail is a small triangle glued to the bubble edge, aimed at Leo. */
  const tailSize = 26;
  const vTail = Math.min(Math.max(anchorY - top, 34), estHeight - 18);
  const hTail = Math.min(Math.max(anchorX - left, 40), w - 40);

  const tailStyle: React.CSSProperties =
    resolved === "right"
      ? { left: -tailSize + 4, top: vTail, width: tailSize, height: tailSize }
      : resolved === "left"
        ? { right: -tailSize + 4, top: vTail, width: tailSize, height: tailSize }
        : { bottom: -tailSize + 4, left: hTail - tailSize / 2, width: tailSize, height: tailSize };

  const tailPath =
    resolved === "right"
      ? "polygon(0% 50%, 100% 0%, 100% 100%)"
      : resolved === "left"
        ? "polygon(100% 50%, 0% 0%, 0% 100%)"
        : "polygon(50% 100%, 0% 0%, 100% 0%)";

  return (
    <div
      className="pointer-events-none absolute z-30 animate-pop-in"
      style={{ left, top, width: w }}
      role="status"
      aria-live="polite"
    >
      <div
        className="relative rounded-[28px] border-4 bg-card px-6 py-4 text-center shadow-[var(--shadow-soft)]"
        style={{ borderColor: border }}
      >
        <p className="font-display text-[27px] leading-tight text-foreground">{text}</p>
        <button
          type="button"
          aria-label="Ouvir novamente"
          className="pointer-events-auto absolute -bottom-4 -right-3 grid h-[46px] w-[46px] place-items-center rounded-full border-4 border-card bg-card shadow-[var(--shadow-soft)] transition-transform hover:scale-110"
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            speech.replay(text);
          }}
        >
          <img src={UI.soundOn} alt="" className="h-7 w-7" />
        </button>
        <span
          className="absolute block"
          style={{ ...tailStyle, clipPath: tailPath, backgroundColor: border }}
        />
        <span
          className="absolute block bg-card"
          style={{
            ...tailStyle,
            clipPath: tailPath,
            transform:
              resolved === "right"
                ? "translateX(5px) scale(0.78)"
                : resolved === "left"
                  ? "translateX(-5px) scale(0.78)"
                  : "translateY(-5px) scale(0.78)",
          }}
        />
      </div>
    </div>
  );
}
