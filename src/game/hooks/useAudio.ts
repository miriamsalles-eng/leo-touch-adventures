import { createContext, createElement, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AUDIO, type AudioKey } from "../assets";

type AudioCtx = {
  muted: boolean;
  toggleMute: () => void;
  play: (key: AudioKey) => void;
};

const Ctx = createContext<AudioCtx | null>(null);

/**
 * Audio is fully optional and never blocking: if a file is missing or the
 * browser refuses to autoplay, the promise rejection is swallowed.
 */
export function AudioProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(false);
  const cache = useRef(new Map<AudioKey, HTMLAudioElement>());

  const play = useCallback(
    (key: AudioKey) => {
      if (muted || typeof window === "undefined") return;
      try {
        let el = cache.current.get(key);
        if (!el) {
          el = new Audio(AUDIO[key]);
          el.volume = 0.5;
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
    () => ({ muted, toggleMute: () => setMuted((m) => !m), play }),
    [muted, play],
  );

  return createElement(Ctx.Provider, { value }, children);
}

export function useAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be used inside <AudioProvider>");
  return ctx;
}
