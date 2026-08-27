import { useState } from "react";
import { ACTIVITIES, FEEDBACK } from "../data/activities";
import { BACKGROUNDS, EFFECTS, OBJECTS } from "../assets";
import { Character } from "../components/Character";
import { DragItem } from "../components/DragItem";
import { DropZone } from "../components/DropZone";
import { GameButton } from "../components/GameButton";
import { SceneFrame } from "../components/SceneFrame";
import { SpeechBubble } from "../components/SpeechBubble";
import { FeedbackPopup, useFeedback } from "../components/FeedbackPopup";
import { useAudio } from "../hooks/useAudio";

const A = ACTIVITIES[6]!;
const SIZE = A.params!["pieceSize"] as number;

/** Activity 6 — 3 big pieces, forgiving snap, locks in place + small party. */
const PIECES = [
  { id: "p1", image: OBJECTS.puzzle1, start: { x: 220, y: 250 }, slot: { x: 760, y: 250 } },
  { id: "p2", image: OBJECTS.puzzle2, start: { x: 220, y: 450 }, slot: { x: 760, y: 420 } },
  { id: "p3", image: OBJECTS.puzzle3, start: { x: 220, y: 640 }, slot: { x: 760, y: 590 } },
];

export function S07Puzzle({ onComplete, progress }: { onComplete: () => void; progress: { total: number; current: number } }) {
  const [locked, setLocked] = useState<string[]>([]);
  const [over, setOver] = useState<string | null>(null);
  const { feedback, show } = useFeedback();
  const { play } = useAudio();
  const done = locked.length === PIECES.length;

  return (
    <SceneFrame background={BACKGROUNDS.bedroom} progress={progress}>
      {PIECES.map((p) => (
        <DropZone
          key={p.id}
          id={p.id}
          x={p.slot.x}
          y={p.slot.y}
          w={SIZE}
          h={SIZE}
          tolerance="overlap"
          padding={A.params!["snapRadius"] as number}
          active={over === p.id}
          enabled={!locked.includes(p.id)}
          showTarget={!locked.includes(p.id)}
        />
      ))}

      {locked.map((id) => {
        const p = PIECES.find((x) => x.id === id)!;
        return (
          <img
            key={id}
            src={p.image}
            alt=""
            className="pointer-events-none absolute animate-pop-in"
            style={{ left: p.slot.x, top: p.slot.y, width: SIZE, height: SIZE, transform: "translate(-50%, -50%)" }}
          />
        );
      })}

      {done && (
        <img
          src={EFFECTS.confetti}
          alt=""
          className="pointer-events-none absolute h-[120px] w-[120px] animate-pop-in"
          style={{ left: 760, top: 120, transform: "translateX(-50%)" }}
        />
      )}

      <Character state={done ? "celebrating" : "pointing"} x={1130} y={690} height={260} bob={done} />
      <SpeechBubble
        text={done ? "Ficou lindo!" : "Monte o foguete do Leo."}
        anchorX={200}
        anchorY={90}
        anchorWidth={0}
        side="right"
        width={320}
        tone={done ? "cheer" : "normal"}
      />

      {PIECES.filter((p) => !locked.includes(p.id)).map((p) => (
        <DragItem
          key={p.id}
          image={p.image}
          start={p.start}
          size={SIZE}
          onPickup={() => play("pick")}
          onZoneChange={setOver}
          onDrop={(zone) => {
            setOver(null);
            if (zone === p.id) {
              setLocked((s) => [...s, p.id]);
              play("success");
              show(FEEDBACK.yes, "success");
              return "stay";
            }
            show(FEEDBACK.almost, "gentle");
            return "return";
          }}
        />
      ))}

      <FeedbackPopup message={feedback} />
      {done && (
        <div className="absolute left-[300px] top-[640px] -translate-x-1/2">
          <GameButton onPress={onComplete}>SEGUIR</GameButton>
        </div>
      )}
    </SceneFrame>
  );
}
