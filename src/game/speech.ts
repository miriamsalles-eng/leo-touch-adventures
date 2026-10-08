/**
 * Central speech service (Web Speech API).
 *
 * Children in this material may not read yet, so every Leo line, skill
 * presentation, instruction and pedagogical feedback can be narrated by the
 * browser's own voice — no recorded files, no external services.
 *
 * Every request has its OWN identity: the same sentence can be narrated again
 * in a later round. Nothing is ever blocked because "the text is equal".
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

import { PRELOAD_IDS, VOICE_MAP, voiceFor } from "./audio/voiceMap";

type Waiter = () => void;

/** One speech request. `id` — never the text — identifies it. */
type Request = {
  id: number;
  text: string;
  /** A replay: it must not resolve anything but the line it interrupted. */
  standalone: boolean;
  /** Request whose waiters were postponed because a replay interrupted it. */
  deferred: number | null;
  /** Recorded MP3 for this line, or null → mensagem somente visual. */
  url: string | null;
  /** True only on the technical fallback after an essential MP3 failed. */
  tts: boolean;
};

const synth: SpeechSynthesis | null =
  typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;

let voices: SpeechSynthesisVoice[] = [];
let enabled = false;
let muted = false;
let nextId = 1;

let active: Request | null = null;
let queue: Request[] = [];
/** Ids already finished (or resolved without voice) but not yet observed. */
const finished = new Set<number>();
const waiters = new Map<number, Set<Waiter>>();
let safety: ReturnType<typeof setTimeout> | null = null;

/* ---------- Recorded voice (HTMLAudioElement) ---------- */
const mp3Cache = new Map<string, HTMLAudioElement>();
let voiceEl: HTMLAudioElement | null = null;
let voiceDelay: ReturnType<typeof setTimeout> | null = null;
let lastSfxAt = 0;
/** Gap kept between a sound effect and the first word of a recorded line. */
const SFX_GAP = 200;
const duckListeners = new Set<(on: boolean) => void>();
function duck(on: boolean) {
  duckListeners.forEach((cb) => {
    try {
      cb(on);
    } catch {
      /* ignore */
    }
  });
}
function getMp3(url: string) {
  let el = mp3Cache.get(url);
  if (!el) {
    el = new Audio();
    el.preload = "auto";
    el.src = url;
    mp3Cache.set(url, el);
  }
  return el;
}
function stopMp3() {
  if (voiceDelay) clearTimeout(voiceDelay);
  voiceDelay = null;
  const el = voiceEl;
  voiceEl = null;
  if (!el) return;
  el.onended = null;
  el.onerror = null;
  try {
    el.pause();
    el.currentTime = 0;
  } catch {
    /* ignore */
  }
  duck(false);
}

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

function resolve(id: number) {
  finished.add(id);
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

/** Forgets a request without notifying anybody (used on hard cancel). */
function drop(id: number) {
  waiters.delete(id);
  finished.delete(id);
}

function estimateMs(text: string) {
  return Math.max(2500, text.length * 110 + 1500);
}

function canSpeak() {
  if (voices.length === 0) loadVoices();
  return Boolean(synth) && enabled && !muted && voices.length > 0;
}

function pump() {
  if (active) return;
  const req = queue.shift();
  if (!req) return;
  active = req;

  if (req.url && enabled && !muted && typeof Audio !== "undefined") {
    playMp3(req);
    return;
  }

  /* Linhas sem MP3 são SOMENTE VISUAIS: resolvem na hora e os tempos
     mínimos de leitura assumem. SpeechSynthesis NUNCA as narra — o TTS só
     entra como fallback técnico (req.tts) quando um MP3 essencial falha. */
  if (!req.tts) {
    active = null;
    resolve(req.id);
    if (req.deferred !== null) resolve(req.deferred);
    pump();
    return;
  }

  if (!canSpeak()) {
    /* No voice: the request resolves at once and the minimum reading
       times take over. Never block the activity. */
    active = null;
    resolve(req.id);
    if (req.deferred !== null) resolve(req.deferred);
    pump();
    return;
  }

  const u = new SpeechSynthesisUtterance(req.text);
  u.lang = "pt-BR";
  const voice = pickVoice();
  if (voice) u.voice = voice;
  u.rate = 0.9;
  u.pitch = 1;
  u.volume = 1;

  const finish = () => {
    /* Only the request that is actually speaking may finish itself. */
    if (active !== req) return;
    duck(false);
    active = null;
    if (safety) clearTimeout(safety);
    safety = null;
    resolve(req.id);
    if (req.deferred !== null) resolve(req.deferred);
    pump();
  };

  u.onend = finish;
  u.onerror = finish;

  if (safety) clearTimeout(safety);
  /* Some platforms silently drop the end event — never hang the activity. */
  safety = setTimeout(finish, estimateMs(req.text) * 2);

  try {
    duck(true);
    synth!.speak(u);
  } catch {
    finish();
  }
}

/** Ends the active request and moves on (shared by MP3 and TTS paths). */
function finishReq(req: Request) {
  if (active !== req) return;
  active = null;
  if (safety) clearTimeout(safety);
  safety = null;
  resolve(req.id);
  if (req.deferred !== null) resolve(req.deferred);
  pump();
}

function playMp3(req: Request) {
  const el = getMp3(req.url!);
  const fallback = (why: unknown) => {
    if (active !== req) return;
    console.error("[LeoVoice] MP3 failed, falling back to TTS:", req.url, why);
    stopMp3();
    /* Same line, same id, now through SpeechSynthesis — never both. */
    active = null;
    queue.unshift({ ...req, url: null, tts: true });
    pump();
  };
  const start = () => {
    voiceDelay = null;
    if (active !== req) return;
    voiceEl = el;
    el.onended = () => {
      if (active !== req) return;
      el.onended = null;
      el.onerror = null;
      voiceEl = null;
      duck(false);
      finishReq(req);
    };
    el.onerror = () => fallback(el.error);
    try {
      el.currentTime = 0;
    } catch {
      /* ignore */
    }
    duck(true);
    const p = el.play();
    if (p && typeof p.catch === "function") p.catch((e) => fallback(e));
  };
  const wait = SFX_GAP - (Date.now() - lastSfxAt);
  if (wait > 0) voiceDelay = setTimeout(start, wait);
  else start();
}

function stopSynth() {
  if (!synth) return;
  try {
    synth.cancel();
  } catch {
    /* ignore */
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
    /* Light preload: only the first activity's recorded lines. */
    if (typeof Audio !== "undefined") {
      for (const id of PRELOAD_IDS) {
        const url = VOICE_MAP[id];
        if (url) getMp3(url);
      }
    }
  },
  /** A sound effect just played: a recorded line waits a short gap. */
  noteSfx() {
    lastSfxAt = Date.now();
  },
  /** Music ducking: called with true while a recorded line is playing. */
  onVoiceActivity(cb: (on: boolean) => void): () => void {
    duckListeners.add(cb);
    return () => {
      duckListeners.delete(cb);
    };
  },
  setMuted(value: boolean) {
    if (muted === value) return;
    muted = value;
    /* Turning the sound off must never freeze a narration in progress:
       pending waiters are released so the reading times take over. */
    if (value) speech.cancel({ release: true });
  },
  /**
   * Stops everything. `release` resolves the pending waiters (mute), while the
   * default silently forgets them (scene change / restart).
   */
  cancel(opts?: { release?: boolean }) {
    const release = opts?.release === true;
    const pending: Request[] = [...(active ? [active] : []), ...queue];
    active = null;
    queue = [];
    if (safety) clearTimeout(safety);
    safety = null;
    stopSynth();
    stopMp3();
    for (const req of pending) {
      if (release) {
        resolve(req.id);
        if (req.deferred !== null) resolve(req.deferred);
      } else {
        drop(req.id);
        if (req.deferred !== null) drop(req.deferred);
      }
    }
    if (!release) {
      for (const id of [...waiters.keys()]) drop(id);
      finished.clear();
    }
  },
  /**
   * Queues a line and returns the id of THIS request. Adding a line never
   * interrupts nor invalidates the line currently being spoken.
   */
  speak(text: string): number {
    const id = nextId++;
    if (!text) {
      finished.add(id);
      return id;
    }
    queue.push({ id, text, standalone: false, deferred: null, url: voiceFor(text), tts: false });
    pump();
    return id;
  },
  /**
   * Repeats the visible line without touching any state: it interrupts the
   * current voice and, when it ends, releases the interrupted request so the
   * sequence resumes exactly where it was.
   */
  replay(text: string) {
    if (!text) return;
    /* Replay só existe para falas com MP3; mensagens somente visuais não
       têm o que repetir (o botão de replay também é ocultado nelas). */
    const url = voiceFor(text);
    if (!url) return;
    const interrupted = active;
    if (interrupted) {
      active = null;
      if (safety) clearTimeout(safety);
      safety = null;
      stopSynth();
      stopMp3();
    }
    queue.unshift({
      id: nextId++,
      text,
      standalone: true,
      deferred: interrupted ? interrupted.id : null,
      url: voiceFor(text),
    });
    pump();
  },
  /**
   * Runs `cb` when THAT request finishes. Unknown or already finished ids
   * resolve immediately, so callers fall back to their minimum reading time.
   */
  onEnd(id: number, cb: Waiter): () => void {
    const known = active?.id === id || queue.some((r) => r.id === id);
    if (!known) {
      finished.delete(id);
      const t = setTimeout(cb, 0);
      return () => clearTimeout(t);
    }
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
