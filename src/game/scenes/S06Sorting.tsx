import { useState } from "react";
import { ACTIVITIES, FEEDBACK } from "../data/activities";
import { BACKGROUNDS, OBJECTS } from "../assets";
import { Character } from "../components/Character";
import { DragItem } from "../components/DragItem";
import { DropZone } from "../components/DropZone";
import { GameButton } from "../components/GameButton";
import { RoundBadge } from "../components/RoundBadge";
import { SceneFrame } from "../components/SceneFrame";
import { SpeechBubble } from "../components/SpeechBubble";
import { FeedbackPopup, useFeedback } from "../components/FeedbackPopup";
import { useAudio } from "../hooks/useAudio";

const A = ACTIVITIES[5]!;
const SIZE = A.params!["itemSize"] as number;
const PADDING = A.params!["zonePadding"] as number;

/** Four actions mixing horizontal, vertical and gentle diagonal movements. */
const PAIRS = [
  { id: "book", image: OBJECTS.book, zone: "shelf", start: { x: 230, y: 230 }, label: "livro" },
  { id: "ball", image: OBJECTS.ball, zone: "box", start: { x: 230, y: 430 }, label: "bola" },
  { id: "pencil", image: OBJECTS.pencil, zone: "case", start: { x: 230, y: 620 }, label: "lápis" },
  { id: "notebook", image: OBJECTS.notebook, zone: "bag", start: { x: 470, y: 620 }, label: "caderno" },
];

const ZONES = [
  { id: "shelf", image: OBJECTS.shelf, x: 620, y: 230, label: "estante" },
  { id: "box", image: OBJECTS.box, x: 620, y: 470, label: "caixa" },
  { id: "case", image: OBJECTS.pencilcase, x: 880, y: 230, label: "estojo" },
  { id: "bag", image: OBJECTS.backpack, x: 880, y: 470, label: "mochila" },
];

/** Activity 5 — four clearly distinct, large targets. */
export function S06Sorting({ onComplete, progress }: { onComplete: () => void; progress: { total: number; current: number } }) {
  const [placed, setPlaced] = useState<string[]>([]);
  const [over, setOver] = useState<string | null>(null);
  const { feedback, show } = useFeedback();
  const { play } = useAudio();
  const done = placed.length === PAIRS.length;

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

      <Character state={done ? "celebrating" : "thinking"} x={1165} y={700} height={255} bob={done} />
      <SpeechBubble
        text={done ? "Muito bem! Tudo no lugar certo!" : "Coloque cada coisa no lugar!"}
        anchorX={1160}
        anchorY={440}
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
          onPickup={() => play("pick")}
          onZoneChange={setOver}
          onDrop={(zone) => {
            setOver(null);
            if (zone === p.zone) {
              const next = [...placed, p.id];
              setPlaced(next);
              play("success");
              if (next.length < PAIRS.length) show(FEEDBACK.yes, "success", 1300);
              return "stay";
            }
            play("oops");
            show(FEEDBACK.almost, "gentle");
            return "return";
          }}
        />
      ))}

      <RoundBadge current={placed.length} total={PAIRS.length} x={200} y={40} />
      <FeedbackPopup message={feedback} />
      {done && (
        <div className="absolute right-8 top-[618px] z-40">
          <GameButton onPress={onComplete}>SEGUIR</GameButton>
        </div>
      )}
    </SceneFrame>
  );
}
