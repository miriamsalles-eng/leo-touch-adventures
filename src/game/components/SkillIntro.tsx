import { useEffect, useState } from "react";

export type SkillIntroStep = {
  /** Short sentence naming the skill: "Agora vamos aprender a clicar!" */
  text: string;
  /** Small supporting icon (UI.gestureMove, UI.soundOn, ...). */
  icon?: string | undefined;
};

/** Default display time for skill introduction banners (ms). */
export const SKILL_INTRO_DURATION = 4000;

/**
 * Tiny, non-blocking banner that names the digital skill ONCE, at the very
 * beginning of the activity. It fades away on its own (no "continuar" button),
 * never covers the play area and never repeats between mini-rounds.
 */
export function SkillIntro({ steps, durationMs = SKILL_INTRO_DURATION }: { steps: SkillIntroStep[]; durationMs?: number }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      if (index < steps.length - 1) setIndex((i) => i + 1);
      else setVisible(false);
    }, durationMs);
    return () => clearTimeout(t);
  }, [index, visible, steps.length, durationMs]);

  if (!visible || steps.length === 0) return null;
  const step = steps[index]!;

  return (
    <div
      key={index}
      className="pointer-events-none absolute left-1/2 top-[44px] z-40 flex -translate-x-1/2 -translate-y-1/2 animate-pop-in items-center gap-3 rounded-full border-4 border-card bg-card/95 px-7 py-2 shadow-[var(--shadow-soft)]"
      aria-live="polite"
    >
      {step.icon && <img src={step.icon} alt="" className="h-[42px] w-[42px] object-contain" />}
      <span className="whitespace-nowrap font-display text-[26px] text-[var(--primary-deep)]">{step.text}</span>
    </div>
  );
}
