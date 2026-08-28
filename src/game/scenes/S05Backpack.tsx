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
import { useAudio } from "../hooks/useAudio";

const A = ACTIVITIES[4]!;
const SIZE = A.params!["itemSize"] as number;
const PADDING = A.params!["zonePadding"] as number;

/** Four items around the backpack: left, right, above and below. */
const ITEMS = [
  { id: "pencil", image: OBJECTS.pencil, x: 700, y: 170 },
  { id: "notebook", image: OBJECTS.notebook, x: 300, y: 400 },
  { id: "pencilcase", image: OBJECTS.pencilcase, x: 985, y: 400 },
  { id: "book", image: OBJECTS.book, x: 480, y: 620 },
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
      <Character state={done ? "celebrating" : "pointing"} x={1140} y={615} height={255} bob={!done} />

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

      <div className="pointer-events-none absolute left-[200px] top-[40px] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-card bg-card/90 px-7 py-2 font-display text-[26px] text-foreground shadow-[var(--shadow-soft)]">
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
              if (next.length < ITEMS.length) show(FEEDBACK.yes, "success", 1300);
              return "stay";
            }}
          />
        ),
      )}

      <SpeechBubble
        text={done ? "Muito bem! Minha mochila está pronta!" : "Guarde tudo na minha mochila!"}
        anchorX={1140}
        anchorY={365}
        anchorWidth={200}
        side="above"
        width={300}
        tone={done ? "cheer" : "normal"}
      />
      <SkillIntro steps={[{ text: "Vamos praticar o que aprendemos!", icon: UI.gestureDrop }]} />
      <FeedbackPopup message={feedback} />
    </SceneFrame>
  );
}
