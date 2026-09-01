/**
 * Activity metadata. Copy is short (3–8 words), always kind, never punitive.
 * Tuning parameters for each activity live in `params`.
 */
export type ActivityId =
  | "opening"
  | "find-leo"
  | "click-cheese"
  | "carry-cheese"
  | "backpack"
  | "sorting"
  | "puzzle"
  | "garden-path"
  | "forest"
  | "computer"
  | "picnic"
  | "ending";

export type Activity = {
  id: ActivityId;
  title: string;
  skill: "mover" | "clicar" | "arrastar" | "soltar" | "combinado" | "—";
  instruction: string;
  params?: Record<string, number | string>;
};

/**
 * Only generic ORIENTATION messages live here. Every positive feedback is
 * contextual and belongs to its own activity ("Lápis guardado!"), so the
 * child always hears WHAT she managed to do.
 */
export const FEEDBACK = {
  almost: "Quase! Tente novamente.",
  holding: "Continue segurando enquanto move.",
  keepOnPath: "Volte para o caminho.",
} as const;

export const ACTIVITIES: Activity[] = [
  { id: "opening", title: "Leo em Movimento", skill: "—", instruction: "Vamos aprender a controlar a setinha?" },
  {
    id: "find-leo",
    title: "Encontre o Leo",
    skill: "mover",
    instruction: "Leve a setinha até mim!",
    params: { hoverRadius: 150, dwellMs: 800, rounds: 4 },
  },
  {
    id: "click-cheese",
    title: "Clique no queijo",
    skill: "clicar",
    instruction: "Clique no queijo!",
    params: { itemSize: 170, rounds: 4 },
  },
  {
    id: "carry-cheese",
    title: "Leve o queijo até Leo",
    skill: "arrastar",
    instruction: "Arraste o queijo até mim!",
    params: { itemSize: 150, zonePadding: 60, rounds: 4 },
  },
  {
    id: "backpack",
    title: "Arrume a mochila",
    skill: "soltar",
    instruction: "Guarde tudo na minha mochila!",
    params: { itemSize: 130, zonePadding: 70, itemsTotal: 4 },
  },
  {
    id: "sorting",
    title: "Cada coisa em seu lugar",
    skill: "soltar",
    instruction: "Coloque cada coisa no lugar!",
    params: { itemSize: 130, zonePadding: 50 },
  },
  {
    id: "puzzle",
    title: "Complete a figura",
    skill: "arrastar",
    instruction: "Vamos montar meu foguete!",
    params: { pieceSize: 210, zonePadding: 70 },
  },
  {
    id: "garden-path",
    title: "Caminho pelo jardim",
    skill: "arrastar",
    instruction: "Me leve pelo caminho!",
    params: { corridorWidth: 130, leoSize: 150 },
  },
  {
    id: "forest",
    title: "Floresta do Leo",
    skill: "arrastar",
    instruction: "Vamos até o queijo!",
    params: { corridorWidth: 140, leoSize: 150 },
  },
  {
    id: "computer",
    title: "Organize o computador",
    skill: "soltar",
    instruction: "Vamos organizar o computador!",
    params: { itemSize: 140, zonePadding: 60 },
  },
  {
    id: "picnic",
    title: "Desafio do piquenique",
    skill: "combinado",
    instruction: "Clique na cesta para abrir!",
    params: { itemSize: 130, zonePadding: 60 },
  },
  { id: "ending", title: "Parabéns!", skill: "—", instruction: "Você aprendeu o touchpad!" },
];

/** Number of dots shown in the discreet progress indicator. */
export const TOTAL_STEPS = ACTIVITIES.length;
