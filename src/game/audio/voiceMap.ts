/**
 * PILOT — recorded voice lines (ElevenLabs).
 *
 * VOICE_MAP: semantic line id → MP3 file (file names kept exactly as delivered).
 * VOICE_LINES: semantic line id → the approved sentence that line belongs to.
 *
 * The service receives the sentence through the existing `speech.speak(text)`
 * API and resolves it to an id by a NORMALISED comparison (case, accents of
 * casing, punctuation and spaces ignored), so the visual uppercase or a
 * punctuation change never breaks the binding. Lines without a registered MP3
 * keep using SpeechSynthesis. To add a new recording, add one entry to both
 * maps — no scene needs to change.
 */
const BASE = "/audio/leo/";

export const VOICE_MAP: Record<string, string> = {
  "s02.hello": `${BASE}s02_01_oi_sou_leo.mp3.mp3`,
  "s02.skill.move": `${BASE}s02_02_aprender_mover_setinha.mp3.mp3`,
  "s02.instruction.find": `${BASE}s02_03_leve_setinha_ate_mim.mp3.mp3`,
  "s02.instruction.findAgain": `${BASE}s02_04_agora_me_encontre_aqui.mp3.mp3`,
  "s02.outro.foundAll": `${BASE}s02_05_encontrou_todas_as_vezes.mp3.mp3`,
  "s02.outro.nextObject": `${BASE}s02_06_agora_vou_pedir_um_objeto.mp3.mp3`,
  "s03.skill.click": `${BASE}s03_01_aprender_clicar.mp3.mp3`,
  "s03.instruction.cheese": `${BASE}s03_02_clique_no_queijo.mp3.mp3`,
  "s03.instruction.ball": `${BASE}s03_03_procure_a_bola.mp3.mp3`,
  "s03.instruction.apple": `${BASE}s03_04_onde_esta_a_maca.mp3.mp3`,
  "s03.instruction.banana": `${BASE}s03_05_clique_na_banana.mp3.mp3`,
  "s03.outro.helpPick": `${BASE}s03_06_pode_me_ajudar_a_pega_los.mp3.mp3`,
  "s04.skill.drag": `${BASE}s04_01_aprender_arrastar.mp3.mp3`,
};

export const VOICE_LINES: Record<string, string> = {
  "s02.hello": "Oi! Eu sou o Leo! Vamos brincar?",
  "s02.skill.move": "Agora vamos aprender a mover a setinha!",
  "s02.instruction.find": "Mova a setinha e me encontre!",
  "s02.instruction.findAgain": "Agora me encontre aqui!",
  "s02.outro.foundAll": "Nossa! Você me encontrou todas as vezes!",
  "s02.outro.nextObject": "Agora vou pedir um objeto. Quando encontrar, clique nele!",
  "s03.skill.click": "Agora vamos aprender a clicar!",
  "s03.instruction.cheese": "Onde está o queijo? Clique nele!",
  "s03.instruction.ball": "Agora procure a bola!",
  "s03.instruction.apple": "E a maçã, onde está?",
  "s03.instruction.banana": "Falta a banana! Clique nela!",
  "s03.outro.helpPick": "Agora pode me ajudar a pegá-los?",
  "s04.skill.drag": "Agora vamos aprender a arrastar!",
};

/** Lines preloaded right after COMEÇAR (first activity only). */
export const PRELOAD_IDS = ["s02.hello", "s02.skill.move", "s02.instruction.find", "s02.instruction.findAgain"];

const norm = (s: string) =>
  s
    .toLocaleLowerCase("pt-BR")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

const BY_TEXT = new Map<string, string>();
for (const [id, text] of Object.entries(VOICE_LINES)) BY_TEXT.set(norm(text), id);

/** Returns the MP3 url for this sentence, or null (→ SpeechSynthesis). */
export function voiceFor(text: string): string | null {
  const id = BY_TEXT.get(norm(text));
  return id ? (VOICE_MAP[id] ?? null) : null;
}
