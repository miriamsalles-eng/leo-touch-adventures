import type { ReactNode } from "react";
import { UI } from "../assets";
import { useAudio } from "../hooks/useAudio";
import { GameButton } from "./GameButton";
import { ProgressDots } from "./ProgressDots";

export type SceneFrameProps = {
  background?: string | undefined;
  /** Fallback gradient when there is no photo background. */
  gradient?: string | undefined;
  children: ReactNode;
  progress?: { total: number; current: number } | undefined;
  onRestart?: (() => void) | undefined;
  /** Standard SEGUIR button — always in the same place on every scene. */
  onNext?: (() => void) | undefined;
  /** Discreetly pulses the sound button (used by the computer activity). */
  highlightAudio?: boolean | undefined;
  /**
   * Slightly calms the illustrated scenery (saturation/contrast) so the
   * manipulable objects and Leo stand out. The background keeps its art —
   * only its intensity drops a little. Leo and objects stay at 100%.
   */
  focus?: boolean | undefined;
  /** Hide the scene veil (used by the cover, which is already art-directed). */
  plain?: boolean | undefined;
};

/**
 * Every scene lives inside this frame: overflow hidden, safe margins, mute
 * button (top right), progress bar (bottom center) and the SEGUIR button
 * (bottom right) — same position on every screen.
 */
export function SceneFrame({
  background,
  gradient,
  children,
  progress,
  onRestart,
  onNext,
  highlightAudio = false,
  focus = false,
  plain = false,
}: SceneFrameProps) {
  const { muted, toggleMute } = useAudio();

  return (
    <div className="absolute inset-0 animate-scene-in overflow-hidden">
      <div
        className="absolute inset-0 transition-[filter] duration-500"
        style={{
          backgroundImage: background ? `url(${background})` : gradient,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: focus ? "saturate(0.82) contrast(0.94) brightness(1.05)" : undefined,
        }}
      />
      {!plain && <div className="absolute inset-0 bg-[var(--scene-veil)]" />}
      {focus && <div className="absolute inset-0 bg-white/12" />}
      <div className="absolute inset-0">{children}</div>


      <button
        type="button"
        aria-label={muted ? "Ativar som" : "Desativar som"}
        onPointerDown={(e) => {
          e.preventDefault();
          toggleMute();
        }}
        className={`absolute right-6 top-6 z-40 grid h-[68px] w-[68px] place-items-center rounded-full border-4 bg-card/90 shadow-[var(--shadow-soft)] transition-transform hover:scale-105 ${
          highlightAudio
            ? "animate-pulse border-[var(--highlight)] ring-8 ring-[var(--highlight-soft)]/60"
            : "border-card"
        }`}
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

      {onNext && (
        <div className="absolute right-8 top-[618px] z-40 animate-pop-in">
          <GameButton onPress={onNext}>SEGUIR</GameButton>
        </div>
      )}
    </div>
  );
}
