/**
 * Central asset registry — "Leo em Movimento".
 *
 * Every visual asset is EXTERNAL and replaceable: nothing about Leo is drawn
 * with inline SVG in components. To swap art, drop a new file in
 * /public/assets/<folder>/ keeping the same filename — no code change needed.
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
 * Official artwork: neutral, pointing and celebrating. Remaining states reuse
 * one of the three official poses so Leo's identity never changes on screen.
 */
export const LEO: Record<LeoState, string> = {
  neutral: `${LEO_DIR}/leo-neutral.png`,
  happy: `${LEO_DIR}/leo-celebrating.png`,
  pointing: `${LEO_DIR}/leo-pointing.png`,
  thinking: `${LEO_DIR}/leo-neutral.png`,
  celebrating: `${LEO_DIR}/leo-celebrating.png`,
  "with-cheese": `${LEO_DIR}/leo-celebrating.png`,
  laptop: `${LEO_DIR}/leo-neutral.png`,
  "looking-up": `${LEO_DIR}/leo-neutral.png`,
  "looking-left": `${LEO_DIR}/leo-pointing.png`,
  "looking-right": `${LEO_DIR}/leo-pointing.png`,
};

/** Intrinsic aspect ratio (width / height) of the official Leo art. */
export const LEO_ASPECT: Record<LeoState, number> = {
  neutral: 566 / 900,
  happy: 626 / 900,
  pointing: 651 / 900,
  thinking: 566 / 900,
  celebrating: 626 / 900,
  "with-cheese": 626 / 900,
  laptop: 566 / 900,
  "looking-up": 566 / 900,
  "looking-left": 651 / 900,
  "looking-right": 651 / 900,
};

export const BACKGROUNDS = {
  cover: "/assets/backgrounds/cover.jpg",
  bedroom: "/assets/backgrounds/bedroom.jpg",
  garden: "/assets/backgrounds/garden.jpg",
  forest: "/assets/backgrounds/forest.jpg",
  /** Abstract kid desktop is composed with tokens (no photo needed). */
  desktop: "",
  picnic: "/assets/backgrounds/garden.jpg",
} as const;

const OBJ = "/assets/objects";
export const OBJECTS = {
  cheese: `${OBJ}/cheese.png`,
  backpack: `${OBJ}/backpack.png`,
  apple: `${OBJ}/apple.png`,
  banana: `${OBJ}/banana.png`,
  ball: `${OBJ}/ball.png`,
  pencil: `${OBJ}/pencil.png`,
  notebook: `${OBJ}/notebook.png`,
  pencilcase: `${OBJ}/pencilcase.png`,
  book: `${OBJ}/book.png`,
  shelf: `${OBJ}/shelf.png`,
  /** Caixa de brinquedos oficial (mesma arte de toybox). */
  box: `${OBJ}/toybox.png`,
  toybox: `${OBJ}/toybox.png`,
  folder: `${OBJ}/folder.png`,
  imagefile: `${OBJ}/imagefile.png`,
  basket: `${OBJ}/basket.png`,
  grape: `${OBJ}/grape.png`,
  blanket: `${OBJ}/blanket.png`,
  rocketNose: `${OBJ}/rocket-nose.svg`,
  rocketBody: `${OBJ}/rocket-body.svg`,
  rocketBase: `${OBJ}/rocket-base.svg`,
  rocketGuide: `${OBJ}/rocket-guide.svg`,
  rocket: `${OBJ}/rocket.svg`,
  laptop: `${OBJ}/laptop.png`,
  star: `${OBJ}/star.svg`,
  flag: `${OBJ}/flag.svg`,
} as const;

export const UI = {
  soundOn: "/assets/ui/sound-on.svg",
  soundOff: "/assets/ui/sound-off.svg",
  arrow: "/assets/ui/arrow.svg",
  cursor: "/assets/ui/cursor.svg",
  restart: "/assets/ui/restart.svg",
  gestureMove: "/assets/ui/gesture-move.svg",
  gestureClick: "/assets/ui/gesture-click.svg",
  gestureDrag: "/assets/ui/gesture-drag.svg",
  gestureDrop: "/assets/ui/gesture-drop.svg",
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

/** Soft, wordless background loop. Low volume, controlled by the sound button. */
export const MUSIC = "/assets/audio/ambient.mp3";
