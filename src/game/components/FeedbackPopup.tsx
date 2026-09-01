import { useCallback, useEffect, useRef, useState } from "react";
import { STAGE_W } from "../stage";
import { TIMING, speech } from "../speech";

export type FeedbackTone = "success" | "gentle";
export type FeedbackMessage = { text: string; tone: FeedbackTone } | null;

/** Transient, always-kind feedback. Errors never punish nor auto-advance. */
export function useFeedback() {
  const [feedback, setFeedback] = useState<FeedbackMessage>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unsubscribe = useRef<(() => void) | null>(null);

  /**
   * The feedback is spoken and stays visible for the whole narration plus a
   * short pause; `ms` acts as the minimum reading time when there is no voice.
   */
  const show = useCallback((text: string, tone: FeedbackTone = "success", ms?: number) => {
    const min = ms ?? (tone === "success" ? TIMING.ROUND_FEEDBACK_MIN : TIMING.GENTLE_FEEDBACK_MIN);
    const startedAt = Date.now();
    setFeedback({ text, tone });
    if (timer.current) clearTimeout(timer.current);
    if (unsubscribe.current) unsubscribe.current();

    speech.speak(text, { interrupt: true, force: true });
    unsubscribe.current = speech.onEnd(text, () => {
      const wait = Math.max(TIMING.FEEDBACK_POST_SPEECH_DELAY, min - (Date.now() - startedAt));
      timer.current = setTimeout(() => setFeedback(null), wait);
    });
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
    if (unsubscribe.current) unsubscribe.current();
  }, []);
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
