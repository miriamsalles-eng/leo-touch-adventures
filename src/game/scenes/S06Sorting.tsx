import { useState } from "react";
import { ACTIVITIES, FEEDBACK } from "../data/activities";
import { BACKGROUNDS, OBJECTS } from "../assets";
import { Character } from "../components/Character";
import { DragItem } from "../components/DragItem";
import { DropZone } from "../components/DropZone";
import { GameButton } from "../components/GameButton";
import { SceneFrame } from "../components/SceneFrame";
import { SpeechBubble } from "../components/SpeechBubble";
import { FeedbackPopup, useFeedback } from "../components/FeedbackPopup";
import { useAudio } from "../hooks/useAudio";

const A = ACTIVITIES[5]!;
const SIZE = A.params!["itemSize"] as number;
const PADDING = A.params!["zonePadding"] as number;

const PAIRS = [
  { id: "book", image: OBJECTS.book, zone: "shelf", start: { x: 250, y: 250 }, label: "livro" },
  { id: "ball", image: OBJECTS.ball, zone: "box", start: { x: 250, y: 430 }, label: "bola" },
  { id: "pencil", image: OBJECTS.pencil, zone: "case", start: { x: 250, y: 610 }, label: "lápis" },
];

const ZONES = [
  { id: "shelf", image: OBJECTS.shelf, x: 660, y: 250, label: "estante" },
  { id: "box", image: OBJECTS.box, x: 660, y: 470, label: "caixa" },
  { id: "case", image: OBJECTS.pencilcase, x: 950, y: 360, label: "estojo" },
];

/** Activity 5 — three clearly distinct, large targets. */
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
          w={210}
          h={190}
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
            className="pointer-events-none absolute h-[80px] w-[80px]"
            style={{ left: z.x + 60, top: z.y + 55, transform: "translate(-50%, -50%)" }}
          />
        );
      })}

      <Character state={done ? "celebrating" : "thinking"} x={1160} y={690} height={250} bob={done} />
      <SpeechBubble
        text={done ? "Tudo no lugar certo!" : "Cada objeto no lugar certo."}
        anchorX={200}
        anchorY={90}
        anchorWidth={0}
        side="right"
        width={330}
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
              setPlaced((s) => [...s, p.id]);
              play("success");
              show(FEEDBACK.yes, "success");
              return "stay";
            }
            play("oops");
            show(FEEDBACK.almost, "gentle");
            return "return";
          }}
        />
      ))}

      <FeedbackPopup message={feedback} />
      {done && (
        <div className="absolute left-[300px] top-[630px] -translate-x-1/2">
          <GameButton onPress={onComplete}>SEGUIR</GameButton>
        </div>
      )}
    </SceneFrame>
  );
}
