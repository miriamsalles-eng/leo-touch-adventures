import { useState } from "react";
import { ACTIVITIES, FEEDBACK } from "../data/activities";
import { BACKGROUNDS, OBJECTS } from "../assets";
import { Character } from "../components/Character";
import { DragItem } from "../components/DragItem";
import { DropZone } from "../components/DropZone";
import { SceneFrame } from "../components/SceneFrame";
import { SpeechBubble } from "../components/SpeechBubble";
import { FeedbackPopup, useFeedback } from "../components/FeedbackPopup";
import { useAudio } from "../hooks/useAudio";

const A = ACTIVITIES[4]!;
const SIZE = A.params!["itemSize"] as number;
const PADDING = A.params!["zonePadding"] as number;

/** Items sit around the backpack, so each drag has a different direction. */
const ITEMS = [
  { id: "pencil", image: OBJECTS.pencil, x: 330, y: 250 },
  { id: "notebook", image: OBJECTS.notebook, x: 300, y: 560 },
  { id: "pencilcase", image: OBJECTS.pencilcase, x: 980, y: 230 },
];

const BAG = { x: 700, y: 400 };

export function S05Backpack({
  onComplete,
  progress,
}: {
  onComplete: () => void;
  progress: { total: number; current: number };
}) {
  const [stored, setStored] = useState<string[]>([]);
  const [active, setActive] = useState(false);
  const { feedback, show } = useFeedback();
  const { play } = useAudio();

  const done = stored.length === ITEMS.length;

  return (
    <SceneFrame
      background={BACKGROUNDS.bedroom}
      progress={progress}
      onNext={done ? onComplete : undefined}
    >
      <Character state={done ? "celebrating" : "pointing"} x={1130} y={660} height={300} bob={!done} />

      <DropZone
        id="bag"
        x={BAG.x}
        y={BAG.y}
        w={300}
        h={300}
        tolerance="overlap"
        padding={PADDING}
        enabled={!done}
        active={active}
        image={OBJECTS.backpack}
        showTarget={!done}
      />

      <div className="absolute left-[640px] top-[600px] -translate-x-1/2 rounded-full border-4 border-card bg-card/90 px-7 py-2 font-display text-[26px] text-foreground shadow-[var(--shadow-soft)]">
        {stored.length}/{ITEMS.length}
      </div>

      {ITEMS.map((item) =>
        stored.includes(item.id) ? null : (
          <DragItem
            key={item.id}
            image={item.image}
            start={{ x: item.x, y: item.y }}
            size={SIZE}
            label={item.id}
            onPickup={() => play("pick")}
            onZoneChange={(zone) => setActive(zone === "bag")}
            onDrop={(zone) => {
              setActive(false);
              if (zone !== "bag") {
                show(FEEDBACK.almost, "gentle");
                return "return";
              }
              play("drop");
              const next = [...stored, item.id];
              setStored(next);
              show(next.length === ITEMS.length ? FEEDBACK.did : FEEDBACK.yes, "success");
              return "stay";
            }}
          />
        ),
      )}

      <SpeechBubble
        text={done ? "Mochila arrumada!" : "Guarde tudo na mochila."}
        anchorX={1130}
        anchorY={370}
        anchorWidth={230}
        side="left"
        width={320}
        tone={done ? "cheer" : "normal"}
      />
      <FeedbackPopup message={feedback} />
    </SceneFrame>
  );
}
