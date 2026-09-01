import { useEffect, useRef } from "react";
import { speech } from "../speech";

/**
 * Narrates a practical instruction ONCE when it becomes active, and again on
 * every new round — even when the sentence is exactly the same. It never
 * advances the activity, never hides the text and never competes with the
 * narrative or the skill banner (the scene only activates it when those are
 * finished).
 */
export function useInstructionSpeech(text: string | null, active: boolean, triggerKey: unknown = 0) {
  const last = useRef<string | null>(null);

  useEffect(() => {
    /* Going temporarily inactive (a feedback is talking) must NOT make the
       same instruction start again: only a new round/text does. */
    if (!active || !text) return;
    const key = `${String(triggerKey)}:${text}`;
    if (last.current === key) return;
    last.current = key;
    speech.speak(text);
  }, [active, text, triggerKey]);
}
