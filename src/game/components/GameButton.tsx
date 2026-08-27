import type { ReactNode } from "react";
import { useAudio } from "../hooks/useAudio";

export type GameButtonProps = {
  children: ReactNode;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | undefined;
  size?: "md" | "lg" | undefined;
  /** Center X in stage coordinates (optional absolute placement). */
  x?: number | undefined;
  y?: number | undefined;
  disabled?: boolean | undefined;
};

/** Big rounded button, driven by Pointer Events, with a generous hit area. */
export function GameButton({
  children,
  onPress,
  variant = "primary",
  size = "lg",
  x,
  y,
  disabled,
}: GameButtonProps) {
  const { play } = useAudio();
  const palette =
    variant === "primary"
      ? "bg-primary text-primary-foreground border-[var(--primary-deep)]"
      : variant === "secondary"
        ? "bg-secondary text-secondary-foreground border-[var(--secondary-deep)]"
        : "bg-card text-foreground border-border";

  const positioned = x !== undefined && y !== undefined;

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={(e) => {
        e.preventDefault();
        if (disabled) return;
        play("click");
        onPress();
      }}
      className={`${positioned ? "absolute" : ""} select-none whitespace-nowrap rounded-full border-b-8 font-display tracking-wide shadow-[var(--shadow-soft)] transition-transform duration-150 hover:scale-[1.04] active:translate-y-1 active:border-b-4 disabled:opacity-50 ${palette} ${
        size === "lg" ? "px-12 py-5 text-[34px]" : "px-8 py-3 text-[24px]"
      }`}
      style={positioned ? { left: x, top: y, transform: "translate(-50%, -50%)" } : undefined}
    >
      {children}
    </button>
  );
}
