import { useState } from "react";
import { ACTIVITIES, FEEDBACK } from "../data/activities";
import { BACKGROUNDS, OBJECTS, UI } from "../assets";
import { Character } from "../components/Character";
import { DragItem } from "../components/DragItem";
import { DropZone } from "../components/DropZone";
import { SceneFrame } from "../components/SceneFrame";
import { SkillIntro } from "../components/SkillIntro";
import { SpeechBubble } from "../components/SpeechBubble";
import { FeedbackPopup, useFeedback } from "../components/FeedbackPopup";
import { useNarration } from "../hooks/useNarration";
import { useInstructionSpeech } from "../hooks/useInstructionSpeech";
import { useAudio } from "../hooks/useAudio";

const A = ACTIVITIES[6]!;
const SNAP = A.params!["zonePadding"] as number | undefined;

/** Three big, recognizable rocket parts: nose, body and base with fins. */
const HELLO = ["Vamos montar um foguete?"];
const OUTRO = ["Nosso foguete ficou ótimo!", "Que tal um passeio no parque?"];
const INSTRUCTION = "Leve cada peça para o lugar certo.";
/** Contextual feedback for each rocket piece. */
const PIECE_DONE: Record<string, string> = {
  nose: "A ponta encaixou!",
  body: "Mais uma peça no lugar!",
  base: "Última peça no lugar!",
};

const PIECES = [
  { id: "nose", image: OBJECTS.rocketNose, start: { x: 240, y: 180 }, slot: { x: 800, y: 220 }, w: 210, h: 147 },
  { id: "body", image: OBJECTS.rocketBody, start: { x: 240, y: 400 }, slot: { x: 800, y: 372 }, w: 210, h: 158 },
  { id: "base", image: OBJECTS.rocketBase, start: { x: 240, y: 610 }, slot: { x: 800, y: 525 }, w: 210, h: 158 },
];

export function S07Puzzle({
  onComplete,
  progress,
}: {
  onComplete: () => void;
  progress: { total: number; current: number };
}) {
  const [placed, setPlaced] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const { feedback, show, isBusy } = useFeedback();
  const { play } = useAudio();

  const [greeted, setGreeted] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [done, setDone] = useState(false);
  const hello = useNarration(HELLO, !greeted, () => setGreeted(true));
  const outro = useNarration(OUTRO, done, onComplete);
  useInstructionSpeech(INSTRUCTION, greeted && introDone && !isBusy && !done, placed.length);
  const highlight = dragging || active !== null;

  return (
    <SceneFrame
      background={BACKGROUNDS.bedroom}
      progress={progress}
    >
      {/* Silhouette guide of the finished rocket */}
      <img
        src={OBJECTS.rocketGuide}
        alt=""
        className="pointer-events-none absolute transition-all duration-300"
        style={{
          left: 800,
          top: 372,
          width: 210,
          height: 452,
          transform: `translate(-50%, -50%) scale(${highlight ? 1.03 : 1})`,
          opacity: highlight ? 1 : 0.8,
          filter: highlight
            ? "drop-shadow(0 0 16px rgba(127,214,230,0.85))"
            : "drop-shadow(0 2px 6px rgba(47,127,150,0.2))",
        }}
      />


      {PIECES.map((p) => (
        <DropZone
          key={`slot-${p.id}`}
          id={p.id}
          x={p.slot.x}
          y={p.slot.y}
          w={p.w}
          h={p.h}
          tolerance="overlap"
          padding={SNAP ?? 60}
          enabled={!placed.includes(p.id)}
          active={active === p.id}
          showTarget={false}
        />
      ))}

      {PIECES.map((p) =>
        placed.includes(p.id) ? (
          <img
            key={`done-${p.id}`}
            src={p.image}
            alt=""
            className="pointer-events-none absolute animate-pop-in object-contain"
            style={{ left: p.slot.x, top: p.slot.y, width: p.w, height: p.h, transform: "translate(-50%, -50%)" }}
          />
        ) : (
          <DragItem
            key={p.id}
            image={p.image}
            start={p.start}
            size={p.w}
            label={`peça ${p.id}`}
            disabled={isBusy}
            onPickup={() => {
              setDragging(true);
              play("pick");
            }}
            onZoneChange={(zone) => setActive(zone)}
            onDrop={(zone) => {
              setActive(null);
              setDragging(false);

              if (zone !== p.id) {
                show(FEEDBACK.almost, "gentle");
                return "return";
              }
              play("success");
              const next = [...placed, p.id];
              setPlaced(next);
              show(PIECE_DONE[p.id] ?? "Peça no lugar!", "success", undefined, () => {
                if (next.length === PIECES.length) setDone(true);
              });
              return "stay";
            }}
          />
        ),
      )}

      <Character state={done ? "celebrating" : "pointing"} x={1160} y={700} height={300} bob={!done} flip={!done} />
      <SpeechBubble
        text={hello ?? outro ?? INSTRUCTION}
        anchorX={1165}
        anchorY={400}
        anchorWidth={200}
        side="above"
        width={290}
        tone={done ? "cheer" : "normal"}
      />
      {greeted && (
        <SkillIntro
          steps={[{ label: "Praticando: arrastar e soltar", text: "Vamos montar um foguete!", icon: UI.gestureMove }]}
          onComplete={() => setIntroDone(true)}
        />
      )}
      <FeedbackPopup message={feedback} />
    </SceneFrame>
  );
}
