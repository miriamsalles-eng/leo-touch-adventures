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

const A = ACTIVITIES[4]!;
const SIZE = A.params!["itemSize"] as number;
const PADDING = A.params!["zonePadding"] as number;

const ITEMS = [
  { id: "pencil", image: OBJECTS.pencil, x: 300, y: 250, label: "lápis" },
  { id: "notebook", image: OBJECTS.notebook, x: 300, y: 430, label: "caderno" },
  { id: "pencilcase", image: OBJECTS.pencilcase, x: 300, y: 610, label: "estojo" },
];

/** Activity 4 — release inside the open backpack; 1/3 progress; misses return. */
export function S05Backpack({ onComplete, progress }: { onComplete: () => void; progress: { total: number; current: number } }) {
  const bag = { x: 830, y: 420 };
  const [stored, setStored] = useState<string[]>([]);
  const [over, setOver] = useState(false);
  const { feedback, show } = useFeedback();
  const { play } = useAudio();
  const done = stored.length === ITEMS.length;

  return (
    <SceneFrame background={BACKGROUNDS.bedroom} progress={progress}>
      <DropZone
        id="bag"
        x={bag.x}
        y={bag.y}
        w={300}
        h={300}
        tolerance="overlap"
        padding={PADDING}
        active={over}
        image={OBJECTS.backpack}
        enabled={!done}
      />

      <div
        className="pointer-events-none absolute flex gap-3"
        style={{ left: bag.x, top: bag.y + 190, transform: "translateX(-50%)" }}
      >
        {stored.map((id) => {
          const item = ITEMS.find((i) => i.id === id)!;
          return <img key={id} src={item.image} alt="" className="h-[62px] w-[62px]" />;
        })}
      </div>

      <div
        className="pointer-events-none absolute rounded-full border-4 border-card bg-card/90 px-6 py-2 font-display text-[28px] text-foreground"
        style={{ left: 1120, top: 130, transform: "translateX(-50%)" }}
      >
        {stored.length}/{ITEMS.length}
      </div>

      <Character state={done ? "celebrating" : "pointing"} x={1130} y={690} height={280} bob={done} />
      <SpeechBubble
        text={done ? "Mochila pronta!" : "Guarde tudo na mochila."}
        anchorX={200}
        anchorY={90}
        anchorWidth={0}
        side="right"
        width={330}
        tone={done ? "cheer" : "normal"}
      />

      {ITEMS.filter((i) => !stored.includes(i.id)).map((item) => (
        <DragItem
          key={item.id}
          image={item.image}
          start={{ x: item.x, y: item.y }}
          size={SIZE}
          label={item.label}
          onPickup={() => play("pick")}
          onZoneChange={(z) => setOver(z === "bag")}
          onDrop={(zone) => {
            setOver(false);
            if (zone === "bag") {
              setStored((s) => [...s, item.id]);
              play("drop");
              show(stored.length === ITEMS.length - 1 ? FEEDBACK.did : FEEDBACK.yes, "success");
              return "stay";
            }
            show(FEEDBACK.almost, "gentle");
            return "return";
          }}
        />
      ))}

      <FeedbackPopup message={feedback} />
      {done && (
        <div className="absolute left-[380px] top-[620px] -translate-x-1/2">
          <GameButton onPress={onComplete}>SEGUIR</GameButton>
        </div>
      )}
    </SceneFrame>
  );
}
