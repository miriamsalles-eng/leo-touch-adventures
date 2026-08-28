import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AUDIO, MUSIC, type AudioKey } from "../assets";

type AudioCtx = {
  /** Sound is on/off. Controls BOTH the background music and every effect. */
  muted: boolean;
  toggleMute: () => void;
  setMuted: (value: boolean) => void;
  /** Called by the first user gesture (COMEÇAR) to unlock browser audio. */
  start: () => void;
  play: (key: AudioKey) => void;
};

const Ctx = createContext<AudioCtx | null>(null);

/**
 * Audio is optional and never blocking. Browsers block autoplay, so the
 * background music only starts after the first user gesture (`start()`).
 * Nothing is persisted: every reload begins a new session with sound on.
 */
export function AudioProvider({ children }: { children: ReactNode }) {
  const [muted, setMutedState] = useState(false);
  const [started, setStarted] = useState(false);
  const cache = useRef(new Map<AudioKey, HTMLAudioElement>());
  const music = useRef<HTMLAudioElement | null>(null);

  const start = useCallback(() => setStarted(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!started) return;
    if (!music.current) {
      const el = new Audio(MUSIC);
      el.loop = true;
      el.volume = 0.16;
      music.current = el;
    }
    const el = music.current;
    if (muted) {
      el.pause();
    } else {
      void el.play().catch(() => {});
    }
  }, [started, muted]);

  useEffect(
    () => () => {
      music.current?.pause();
      music.current = null;
    },
    [],
  );

  const play = useCallback(
    (key: AudioKey) => {
      if (muted || typeof window === "undefined") return;
      try {
        let el = cache.current.get(key);
        if (!el) {
          el = new Audio(AUDIO[key]);
          el.volume = 0.4;
          cache.current.set(key, el);
        }
        el.currentTime = 0;
        void el.play().catch(() => {});
      } catch {
        /* audio is optional */
      }
    },
    [muted],
  );

  const value = useMemo(
    () => ({
      muted,
      toggleMute: () => setMutedState((m) => !m),
      setMuted: setMutedState,
      start,
      play,
    }),
    [muted, play, start],
  );

  return createElement(Ctx.Provider, { value }, children);
}

export function useAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be used inside <AudioProvider>");
  return ctx;
}
