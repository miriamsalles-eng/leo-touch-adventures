import { useEffect, useRef, useState } from "react";
import { TIMING, speech } from "../speech";

/**
 * Plays a short sequence of Leo lines inside his own speech bubble (no extra
 * screens, no extra clicks). THIS hook owns the narrative voice: it speaks the
 * current line, waits for that exact request to end plus a small pause and
 * only then moves to the next line. With the sound off, a minimum reading
 * time is used instead.
 */
export function useNarration(
  lines: string[],
  active: boolean,
  onDone?: () => void,
  minMs: number = TIMING.NARRATIVE_MIN,
): string | null {
  const [index, setIndex] = useState(0);
  const spoken = useRef<string | null>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!active) return;
    if (lines.length === 0) {
      doneRef.current?.();
      return;
    }
    const line = lines[Math.min(index, lines.length - 1)]!;
    const key = `${index}:${line}`;
    /* Guards against a double effect run for the same line only. */
    if (spoken.current === key) return;
    spoken.current = key;

    const startedAt = Date.now();
    let hold: ReturnType<typeof setTimeout> | null = null;

    const id = speech.speak(line);
    const unsubscribe = speech.onEnd(id, () => {
      const elapsed = Date.now() - startedAt;
      const wait = Math.max(TIMING.POST_SPEECH_DELAY, minMs - elapsed);
      hold = setTimeout(() => {
        if (index < lines.length - 1) setIndex((i) => i + 1);
        else doneRef.current?.();
      }, wait);
    });

    return () => {
      unsubscribe();
      if (hold) clearTimeout(hold);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, index, lines.length, minMs]);

  useEffect(() => {
    if (!active) {
      setIndex(0);
      spoken.current = null;
    }
  }, [active]);

  if (!active || lines.length === 0) return null;
  return lines[Math.min(index, lines.length - 1)] ?? null;
}
