import { useCallback, useEffect, useRef, useState } from "react";
import { STAGE_W } from "../stage";
import { TIMING, speech } from "../speech";

export type FeedbackTone = "success" | "gentle";
export type FeedbackMessage = { text: string; tone: FeedbackTone } | null;

/** Transient, always-kind feedback. Errors never punish nor auto-advance. */
export function useFeedback() {
  const [feedback, setFeedback] = useState<FeedbackMessage>(null);
  const busy = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unsubscribe = useRef<(() => void) | null>(null);

  /**
   * The feedback is spoken and stays visible for the whole narration plus a
   * short pause; `ms` acts as the minimum reading time when there is no voice
   * and can only make it LONGER than the global minimum, never shorter.
   * `onDone` runs after the feedback disappeared — the next round/instruction
   * starts there, so it is never spoken on top of the feedback.
   */
  const show = useCallback(
    (text: string, tone: FeedbackTone = "success", ms?: number, onDone?: () => void) => {
      const floor = tone === "success" ? TIMING.ROUND_FEEDBACK_MIN : TIMING.GENTLE_FEEDBACK_MIN;
      const min = Math.max(ms ?? floor, floor);
      const startedAt = Date.now();
      setFeedback({ text, tone });
      busy.current = true;
      if (timer.current) clearTimeout(timer.current);
      if (unsubscribe.current) unsubscribe.current();

      /* The child already acted: any instruction still talking became
         useless, so the feedback may take the voice immediately. */
      speech.cancel({ release: true });
      const id = speech.speak(text);
      unsubscribe.current = speech.onEnd(id, () => {
        const wait = Math.max(TIMING.FEEDBACK_POST_SPEECH_DELAY, min - (Date.now() - startedAt));
        timer.current = setTimeout(() => {
          setFeedback(null);
          busy.current = false;
          onDone?.();
        }, wait);
      });
    },
    [],
  );

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (unsubscribe.current) unsubscribe.current();
    },
    [],
  );
  /** True while a feedback is still being said: used as a short lock. */
  const isBusy = feedback !== null;
  return { feedback, show, isBusy, busyRef: busy };
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
