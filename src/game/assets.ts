/**
 * Central asset registry — "Aventuras no Touchpad".
 *
 * Every visual asset is EXTERNAL and replaceable: nothing about Leo is drawn
 * with inline SVG in components. To swap art, drop a new file in
 * /public/assets/<folder>/ keeping the same filename (PNG/WebP transparent
 * recommended for Leo and objects) — no code change required.
 */

export type LeoState =
  | "neutral"
  | "happy"
  | "pointing"
  | "thinking"
  | "celebrating"
  | "with-cheese"
  | "laptop"
  | "looking-up"
  | "looking-left"
  | "looking-right";

const LEO_DIR = "/assets/leo";

/**
 * Each Leo state maps to its own file. States without dedicated art yet fall
 * back to a coherent placeholder pose (documented in the audit).
 */
export const LEO: Record<LeoState, string> = {
  neutral: `${LEO_DIR}/leo-neutral.png`,
  happy: `${LEO_DIR}/leo-happy.png`,
  pointing: `${LEO_DIR}/leo-pointing.png`,
  thinking: `${LEO_DIR}/leo-neutral.png`, // placeholder -> leo-thinking.png
  celebrating: `${LEO_DIR}/leo-celebrating.png`,
  "with-cheese": `${LEO_DIR}/leo-happy.png`, // placeholder -> leo-with-cheese.png
  laptop: `${LEO_DIR}/leo-neutral.png`, // placeholder -> leo-laptop.png
  "looking-up": `${LEO_DIR}/leo-neutral.png`, // placeholder
  "looking-left": `${LEO_DIR}/leo-pointing.png`, // placeholder (mirrored in UI)
  "looking-right": `${LEO_DIR}/leo-pointing.png`, // placeholder
};

export const BACKGROUNDS = {
  bedroom: "/assets/backgrounds/bedroom.jpg",
  garden: "/assets/backgrounds/garden.jpg",
  forest: "/assets/backgrounds/forest.jpg",
  /** Abstract kid desktop is composed with tokens (no photo needed). */
  desktop: "",
  picnic: "/assets/backgrounds/garden.jpg",
} as const;

const OBJ = "/assets/objects";
export const OBJECTS = {
  cheese: `${OBJ}/cheese.svg`,
  apple: `${OBJ}/apple.svg`,
  ball: `${OBJ}/ball.svg`,
  pencil: `${OBJ}/pencil.svg`,
  notebook: `${OBJ}/notebook.svg`,
  pencilcase: `${OBJ}/pencilcase.svg`,
  backpack: `${OBJ}/backpack.svg`,
  book: `${OBJ}/book.svg`,
  shelf: `${OBJ}/shelf.svg`,
  box: `${OBJ}/box.svg`,
  toybox: `${OBJ}/toybox.svg`,
  folder: `${OBJ}/folder.svg`,
  imagefile: `${OBJ}/imagefile.svg`,
  basket: `${OBJ}/basket.svg`,
  grape: `${OBJ}/grape.svg`,
  blanket: `${OBJ}/blanket.svg`,
  puzzle1: `${OBJ}/puzzle1.svg`,
  puzzle2: `${OBJ}/puzzle2.svg`,
  puzzle3: `${OBJ}/puzzle3.svg`,
  rocket: `${OBJ}/rocket.svg`,
  laptop: `${OBJ}/laptop.svg`,
  star: `${OBJ}/star.svg`,
  flag: `${OBJ}/flag.svg`,
} as const;

export const UI = {
  soundOn: "/assets/ui/sound-on.svg",
  soundOff: "/assets/ui/sound-off.svg",
  arrow: "/assets/ui/arrow.svg",
  cursor: "/assets/ui/cursor.svg",
  restart: "/assets/ui/restart.svg",
} as const;

export const EFFECTS = {
  sparkle: "/assets/effects/sparkle.svg",
  confetti: "/assets/effects/confetti.svg",
  glow: "/assets/effects/glow.svg",
} as const;

/** Optional audio. Missing files are ignored silently (never blocking). */
export const AUDIO = {
  click: "/assets/audio/click.mp3",
  pick: "/assets/audio/pick.mp3",
  drop: "/assets/audio/drop.mp3",
  success: "/assets/audio/success.mp3",
  oops: "/assets/audio/oops.mp3",
  celebrate: "/assets/audio/celebrate.mp3",
} as const;

export type AudioKey = keyof typeof AUDIO;
