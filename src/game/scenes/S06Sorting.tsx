import { useState } from "react";
import { ACTIVITIES, FEEDBACK } from "../data/activities";
import { BACKGROUNDS, OBJECTS, UI } from "../assets";
import { Character } from "../components/Character";
import { DragItem } from "../components/DragItem";
import { DropZone } from "../components/DropZone";
import { RoundBadge } from "../components/RoundBadge";
import { SceneFrame } from "../components/SceneFrame";
import { SkillIntro } from "../components/SkillIntro";
import { SpeechBubble } from "../components/SpeechBubble";
import { FeedbackPopup, useFeedback } from "../components/FeedbackPopup";
import { useNarration } from "../hooks/useNarration";
import { useInstructionSpeech } from "../hooks/useInstructionSpeech";
import { useAudio } from "../hooks/useAudio";

const A = ACTIVITIES[5]!;
const SIZE = A.params!["itemSize"] as number;
const PADDING = A.params!["zonePadding"] as number;

/** Four actions mixing horizontal, vertical and gentle diagonal movements. */
const PAIRS = [
  { id: "book", image: OBJECTS.book, zone: "shelf", start: { x: 230, y: 230 }, label: "livro", done: "Livro na estante!" },
  { id: "ball", image: OBJECTS.ball, zone: "box", start: { x: 230, y: 430 }, label: "bola", done: "Bola na caixa!" },
  { id: "pencil", image: OBJECTS.pencil, zone: "case", start: { x: 230, y: 620 }, label: "lápis", done: "Lápis no estojo!" },
  { id: "notebook", image: OBJECTS.notebook, zone: "bag", start: { x: 470, y: 620 }, label: "caderno", done: "Caderno na mochila!" },
];

const ZONES = [
  { id: "shelf", image: OBJECTS.shelf, x: 620, y: 230, label: "estante" },
  { id: "box", image: OBJECTS.box, x: 620, y: 470, label: "caixa" },
  { id: "case", image: OBJECTS.pencilcase, x: 880, y: 230, label: "estojo" },
  { id: "bag", image: OBJECTS.backpack, x: 880, y: 470, label: "mochila" },
];

const HELLO = ["Cada coisa tem o seu lugar!"];
const OUTRO = ["Que quarto arrumado!", "Estou animado! Vamos montar um foguete?"];
const INSTRUCTION = "Coloque cada coisa no seu lugar.";

/** Activity 5 — four clearly distinct, large targets. */
export function S06Sorting({ onComplete, progress }: { onComplete: () => void; progress: { total: number; current: number } }) {
  const [placed, setPlaced] = useState<string[]>([]);
  const [over, setOver] = useState<string | null>(null);
  const { feedback, show, isBusy } = useFeedback();
  const { play } = useAudio();
  const [greeted, setGreeted] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [done, setDone] = useState(false);
  const hello = useNarration(HELLO, !greeted, () => setGreeted(true));
  const outro = useNarration(OUTRO, done, onComplete);
  /* General activity instruction: spoken once when the activity starts. */
  useInstructionSpeech(INSTRUCTION, greeted && introDone && !isBusy && !done, "sorting-start");

  return (
    <SceneFrame background={BACKGROUNDS.bedroom} progress={progress}>
      {ZONES.map((z) => (
        <DropZone
          key={z.id}
          id={z.id}
          x={z.x}
          y={z.y}
          w={200}
          h={180}
          tolerance="overlap"
          padding={PADDING}
          active={over === z.id}
          image={z.image}
          label={z.label}
        />
      ))}

      {placed.map((id) => {
        const p = PAIRS.find((x) => x.id === id)!;
        const z = ZONES.find((x) => x.id === p.zone)!;
        return (
          <img
            key={id}
            src={p.image}
            alt=""
            className="pointer-events-none absolute h-[70px] w-[70px] object-contain"
            style={{ left: z.x + 55, top: z.y + 50, transform: "translate(-50%, -50%)" }}
          />
        );
      })}

      <Character state={done ? "celebrating" : "thinking"} x={1140} y={615} height={235} bob={done} />
      <SpeechBubble
        text={hello ?? outro ?? INSTRUCTION}
        anchorX={1140}
        anchorY={385}
        anchorWidth={200}
        side="above"
        width={300}
        tone={done ? "cheer" : "normal"}
      />

      {PAIRS.filter((p) => !placed.includes(p.id)).map((p) => (
        <DragItem
          key={p.id}
          image={p.image}
          start={p.start}
          size={SIZE}
          label={p.label}
          disabled={isBusy}
          onPickup={() => play("pick")}
          onZoneChange={setOver}
          onDrop={(zone) => {
            setOver(null);
            if (zone === p.zone) {
              const next = [...placed, p.id];
              setPlaced(next);
              play("success");
              /* Contextual feedback; the closing narration waits for it. */
              show(p.done, "success", undefined, () => {
                if (next.length === PAIRS.length) setDone(true);
              });
              return "stay";
            }
            play("oops");
            show(FEEDBACK.almost, "gentle");
            return "return";
          }}
        />
      ))}

      {greeted && (
        <SkillIntro
          steps={[{ label: "Praticando: arrastar e soltar", text: "Vamos usar o que aprendemos!", icon: UI.gestureDrag }]}
          onComplete={() => setIntroDone(true)}
        />
      )}
      <RoundBadge current={placed.length} total={PAIRS.length} x={200} y={40} />
      <FeedbackPopup message={feedback} />
    </SceneFrame>
  );
}
