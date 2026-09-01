/**
 * Central speech service (Web Speech API).
 *
 * Children in this material may not read yet, so every Leo line, skill
 * presentation, instruction and pedagogical feedback can be narrated by the
 * browser's own voice — no recorded files, no external services.
 *
 * Speech is a complementary accessibility layer: if it is unavailable, muted
 * or blocked, nothing is hidden and nothing is blocked; the minimum reading
 * times below take over.
 */

/** Single place for every duration used by narration/feedback timing. */
export const TIMING = {
  /** Minimum time a skill presentation banner stays on screen. */
  SKILL_INTRO_MIN: 4000,
  /** Minimum time an auto-advancing narrative line stays on screen. */
  NARRATIVE_MIN: 4000,
  /** Minimum time a between-rounds feedback stays on screen. */
  ROUND_FEEDBACK_MIN: 2800,
  /** Minimum time a gentle "try again" feedback stays on screen. */
  GENTLE_FEEDBACK_MIN: 2600,
  /** Pause kept after the voice finishes, before any automatic change. */
  POST_SPEECH_DELAY: 900,
  /** Slightly shorter pause after a feedback line. */
  FEEDBACK_POST_SPEECH_DELAY: 800,
} as const;

type Waiter = () => void;

const synth: SpeechSynthesis | null =
  typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;

let voices: SpeechSynthesisVoice[] = [];
let enabled = false;
let muted = false;
let token = 0;
/** Text currently being spoken OR queued to be spoken next. */
let activeText: string | null = null;
let busy = false;
let pending: { text: string; id: number } | null = null;
let safety: ReturnType<typeof setTimeout> | null = null;

const waiters = new Map<number, Set<Waiter>>();

function loadVoices() {
  if (!synth) return;
  try {
    voices = synth.getVoices() ?? [];
  } catch {
    voices = [];
  }
}

if (synth) {
  loadVoices();
  try {
    synth.addEventListener?.("voiceschanged", loadVoices);
  } catch {
    /* older browsers */
  }
}

/** Exact pt-BR first, then any Portuguese voice, then the browser default. */
function pickVoice(): SpeechSynthesisVoice | undefined {
  if (voices.length === 0) loadVoices();
  const norm = (l: string) => l.replace("_", "-").toLowerCase();
  return (
    voices.find((v) => norm(v.lang) === "pt-br") ??
    voices.find((v) => norm(v.lang).startsWith("pt")) ??
    undefined
  );
}

function flush(id: number) {
  const set = waiters.get(id);
  waiters.delete(id);
  set?.forEach((cb) => {
    try {
      cb();
    } catch {
      /* never break the activity because of audio */
    }
  });
}

/** Releases every waiter of ids other than the current one. */
function flushOthers(keep: number) {
  for (const id of [...waiters.keys()]) if (id !== keep) flush(id);
}

function estimateMs(text: string) {
  return Math.max(2500, text.length * 110 + 1500);
}

function startUtterance(text: string, id: number) {
  if (!synth) {
    busy = false;
    flush(id);
    return;
  }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "pt-BR";
  const voice = pickVoice();
  if (voice) u.voice = voice;
  u.rate = 0.9;
  u.pitch = 1;
  u.volume = 1;

  const finish = () => {
    if (id !== token) return;
    busy = false;
    if (safety) clearTimeout(safety);
    safety = null;
    flush(id);
    if (pending) {
      const next = pending;
      pending = null;
      busy = true;
      startUtterance(next.text, next.id);
    }
  };

  u.onend = finish;
  u.onerror = finish;

  busy = true;
  if (safety) clearTimeout(safety);
  /* Some platforms silently drop the end event — never hang the activity. */
  safety = setTimeout(finish, estimateMs(text) * 2);

  try {
    synth.speak(u);
  } catch {
    finish();
  }
}

export const speech = {
  get available() {
    return synth !== null;
  },
  /** True after the first user gesture (COMEÇAR). */
  get ready() {
    return enabled;
  },
  /** Called by the first user gesture so browsers allow playback. */
  enable() {
    enabled = true;
  },
  setMuted(value: boolean) {
    muted = value;
    if (value) speech.cancel();
  },
  cancel() {
    token++;
    pending = null;
    busy = false;
    activeText = null;
    if (safety) clearTimeout(safety);
    safety = null;
    if (synth) {
      try {
        synth.cancel();
      } catch {
        /* ignore */
      }
    }
    for (const id of [...waiters.keys()]) flush(id);
  },
  /**
   * Speaks a line. By default the same text is never repeated and a new line
   * waits politely for the current one (feedback then next instruction —
   * never two voices at once). `interrupt` cuts the current line off.
   */
  speak(text: string, opts?: { interrupt?: boolean; force?: boolean }) {
    if (!text) return;
    if (!opts?.force && text === activeText) return;

    const id = ++token;
    activeText = text;
    flushOthers(id);

    if (!synth || !enabled || muted) {
      busy = false;
      pending = null;
      /* No voice: waiters resolve at once and minimum reading times rule. */
      setTimeout(() => flush(id), 0);
      return;
    }

    if (busy && !opts?.interrupt) {
      pending = { text, id };
      return;
    }

    pending = null;
    if (busy) {
      try {
        synth.cancel();
      } catch {
        /* ignore */
      }
    }
    void programmaticCancel;
    startUtterance(text, id);
  },
  /** Repeats the given line without touching the activity state. */
  replay(text: string) {
    speech.speak(text, { interrupt: true, force: true });
  },
  /**
   * Runs `cb` when the given line finishes speaking. If there is no voice
   * (unavailable, muted, not yet enabled) it resolves immediately, so callers
   * fall back to their minimum reading time.
   */
  onEnd(text: string, cb: Waiter): () => void {
    if (activeText !== text || (!busy && pending === null)) {
      const t = setTimeout(cb, 0);
      return () => clearTimeout(t);
    }
    const id = pending?.text === text ? pending.id : token;
    let set = waiters.get(id);
    if (!set) {
      set = new Set();
      waiters.set(id, set);
    }
    set.add(cb);
    return () => {
      waiters.get(id)?.delete(cb);
    };
  },
};
