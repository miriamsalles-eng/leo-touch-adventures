import type { ReactNode } from "react";
import { UI } from "../assets";
import { useAudio } from "../hooks/useAudio";
import { ProgressDots } from "./ProgressDots";

export type SceneFrameProps = {
  background?: string | undefined;
  /** Fallback gradient when there is no photo background. */
  gradient?: string | undefined;
  children: ReactNode;
  progress?: { total: number; current: number } | undefined;
  onRestart?: (() => void) | undefined;
};

/**
 * Every scene lives inside this frame: overflow hidden, safe margins, mute
 * button and the discreet progress dots. Nothing critical touches the borders.
 */
export function SceneFrame({ background, gradient, children, progress, onRestart }: SceneFrameProps) {
  const { muted, toggleMute } = useAudio();

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        backgroundImage: background ? `url(${background})` : gradient,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[var(--scene-veil)]" />
      <div className="absolute inset-0">{children}</div>

      <button
        type="button"
        aria-label={muted ? "Ativar som" : "Desativar som"}
        onPointerDown={(e) => {
          e.preventDefault();
          toggleMute();
        }}
        className="absolute right-6 top-6 z-40 grid h-[68px] w-[68px] place-items-center rounded-full border-4 border-card bg-card/90 shadow-[var(--shadow-soft)] transition-transform hover:scale-105"
      >
        <img src={muted ? UI.soundOff : UI.soundOn} alt="" className="h-11 w-11" />
      </button>

      {onRestart && (
        <button
          type="button"
          aria-label="Recomeçar"
          onPointerDown={(e) => {
            e.preventDefault();
            onRestart();
          }}
          className="absolute left-6 top-6 z-40 grid h-[68px] w-[68px] place-items-center rounded-full border-4 border-card bg-card/90 shadow-[var(--shadow-soft)] transition-transform hover:scale-105"
        >
          <img src={UI.restart} alt="" className="h-11 w-11" />
        </button>
      )}

      {progress && <ProgressDots total={progress.total} current={progress.current} />}
    </div>
  );
}
