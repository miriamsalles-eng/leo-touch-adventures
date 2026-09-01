import { useEffect, useState } from "react";

/**
 * Plays a short sequence of Leo lines inside his own speech bubble (no extra
 * screens, no extra clicks). When the last line finishes, `onDone` runs — used
 * both for the little intro of an activity and for the narrative bridge that
 * carries the child to the next one.
 */
export function useNarration(
  lines: string[],
  active: boolean,
  onDone?: () => void,
  msPerLine = 2600,
): string | null {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (lines.length === 0) {
      onDone?.();
      return;
    }
    const t = setTimeout(() => {
      if (index < lines.length - 1) setIndex((i) => i + 1);
      else onDone?.();
    }, msPerLine);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, index, lines.length, msPerLine]);

  useEffect(() => {
    if (!active) setIndex(0);
  }, [active]);

  if (!active || lines.length === 0) return null;
  return lines[Math.min(index, lines.length - 1)] ?? null;
}
