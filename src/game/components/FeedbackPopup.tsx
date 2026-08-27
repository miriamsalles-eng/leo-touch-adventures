import { useCallback, useEffect, useRef, useState } from "react";
import { STAGE_W } from "../stage";

export type FeedbackTone = "success" | "gentle";
export type FeedbackMessage = { text: string; tone: FeedbackTone } | null;

/** Transient, always-kind feedback. Errors never punish nor auto-advance. */
export function useFeedback() {
  const [feedback, setFeedback] = useState<FeedbackMessage>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Standard durations: success ~3s, gentle retry ~2.2s. */
  const show = useCallback((text: string, tone: FeedbackTone = "success", ms?: number) => {
    const duration = ms ?? (tone === "success" ? 3000 : 2200);
    setFeedback({ text, tone });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setFeedback(null), duration);
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return { feedback, show };
}

export function FeedbackPopup({ message }: { message: FeedbackMessage }) {
  if (!message) return null;
  return (
    <div
      className="pointer-events-none absolute top-[26px] z-40 animate-pop-in"
      style={{ left: STAGE_W / 2, transform: "translateX(-50%)" }}
      role="status"
      aria-live="polite"
    >
      <div
        className={`rounded-full border-4 px-9 py-3 shadow-[var(--shadow-soft)] ${
          message.tone === "success"
            ? "border-[var(--highlight)] bg-card"
            : "border-[var(--secondary-deep)] bg-card"
        }`}
      >
        <span className="font-display text-[30px] text-foreground">{message.text}</span>
      </div>
    </div>
  );
}
