import { useEffect, useState } from "react";
import { TIMING, speech } from "../speech";

/**
 * Plays a short sequence of Leo lines inside his own speech bubble (no extra
 * screens, no extra clicks). Each line is spoken by the browser voice (the
 * bubble itself starts the narration) and only changes AFTER the voice has
 * finished plus a small pause — never before. With the sound off, a minimum
 * reading time is used instead.
 */
export function useNarration(
  lines: string[],
  active: boolean,
  onDone?: () => void,
  minMs = TIMING.NARRATIVE_MIN,
): string | null {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (lines.length === 0) {
      onDone?.();
      return;
    }
    const line = lines[Math.min(index, lines.length - 1)]!;
    const startedAt = Date.now();
    let hold: ReturnType<typeof setTimeout> | null = null;

    const advance = () => {
      if (index < lines.length - 1) setIndex((i) => i + 1);
      else onDone?.();
    };

    const unsubscribe = speech.onEnd(line, () => {
      const elapsed = Date.now() - startedAt;
      const wait = Math.max(TIMING.POST_SPEECH_DELAY, minMs - elapsed);
      hold = setTimeout(advance, wait);
    });

    return () => {
      unsubscribe();
      if (hold) clearTimeout(hold);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, index, lines.length, minMs]);

  useEffect(() => {
    if (!active) setIndex(0);
  }, [active]);

  if (!active || lines.length === 0) return null;
  return lines[Math.min(index, lines.length - 1)] ?? null;
}
