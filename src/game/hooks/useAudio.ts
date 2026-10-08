import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AUDIO, MUSIC, type AudioKey } from "../assets";
import { speech } from "../speech";

type AudioCtx = {
  /** Sound is on/off. Controls BOTH the background music and every effect. */
  muted: boolean;
  toggleMute: () => void;
  setMuted: (value: boolean) => void;
  /** Called by the first user gesture (COMEÇAR) to unlock browser audio. */
  start: () => void;
  play: (key: AudioKey) => void;
};

const MUSIC_VOLUME = 0.16;
const MUSIC_DUCKED = 0.05;

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

  const start = useCallback(() => {
    setStarted(true);
    /* First user gesture: browsers now allow music and speech. */
    speech.enable();
  }, []);

  /* The single sound button also controls the narration. */
  useEffect(() => {
    speech.setMuted(muted);
  }, [muted]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!started) return;
    if (!music.current) {
      const el = new Audio(MUSIC);
      el.loop = true;
      el.volume = MUSIC_VOLUME;
      music.current = el;
    }
    const el = music.current;
    if (muted) {
      el.pause();
    } else {
      void el.play().catch(() => {});
    }
  }, [started, muted]);

  /* Ducking: music fades 0.16 → 0.05 while a recorded Leo line plays, then
     back, in ~300 ms. The configured volume itself never changes. */
  useEffect(() => {
    let raf = 0;
    const fade = (to: number) => {
      const el = music.current;
      if (!el) return;
      cancelAnimationFrame(raf);
      const from = el.volume;
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / 300);
        if (music.current) music.current.volume = from + (to - from) * k;
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    const off = speech.onVoiceActivity((on) => fade(on ? MUSIC_DUCKED : MUSIC_VOLUME));
    return () => {
      off();
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(
    () => () => {
      speech.cancel();
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
        speech.noteSfx();
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
