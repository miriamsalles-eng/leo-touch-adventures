import { useState } from "react";
import { ACTIVITIES, FEEDBACK } from "../data/activities";
import { BACKGROUNDS, OBJECTS, UI } from "../assets";
import { DragItem } from "../components/DragItem";
import { DraggableLeo } from "../components/DraggableLeo";
import { DropZone } from "../components/DropZone";
import { SceneFrame } from "../components/SceneFrame";
import { SkillIntro } from "../components/SkillIntro";
import { SpeechBubble } from "../components/SpeechBubble";
import { FeedbackPopup, useFeedback } from "../components/FeedbackPopup";
import { useAudio } from "../hooks/useAudio";

const A = ACTIVITIES[10]!;
const SIZE = A.params!["itemSize"] as number;
const PADDING = A.params!["zonePadding"] as number;

/** Foods come from different directions, so every drag is a new movement. */
const FOODS = [
  { id: "cheese", image: OBJECTS.cheese, x: 250, y: 250 },
  { id: "grape", image: OBJECTS.grape, x: 1030, y: 260 },
  { id: "apple", image: OBJECTS.apple, x: 1060, y: 560 },
  { id: "banana", image: OBJECTS.banana, x: 250, y: 590 },
];

const BLANKET = { x: 640, y: 430 };
const LEO_SPOT = { x: 400, y: 560 };

type Phase = "click" | "fill" | "walk" | "done";

export function S11Picnic({
  onComplete,
  progress,
}: {
  onComplete: () => void;
  progress: { total: number; current: number };
}) {
  const [phase, setPhase] = useState<Phase>("click");
  const [placed, setPlaced] = useState<string[]>([]);
  const [active, setActive] = useState(false);
  const [leoHome, setLeoHome] = useState(false);
  const { feedback, show } = useFeedback();
  const { play } = useAudio();

  const bubble =
    phase === "click"
      ? "Clique na cesta para abrir!"
      : phase === "fill"
        ? "Arraste a comida para a toalha!"
        : phase === "walk"
          ? "Agora me leve até a toalha!"
          : "Muito bem! Piquenique pronto!";

  return (
    <SceneFrame
      background={BACKGROUNDS.picnic}
      progress={progress}
      onNext={phase === "done" ? onComplete : undefined}
    >
      {/* Blanket: the picnic table for the food */}
      <img
        src={OBJECTS.blanket}
        alt=""
        className="pointer-events-none absolute object-contain"
        style={{
          left: BLANKET.x,
          top: BLANKET.y,
          width: 420,
          height: 250,
          transform: "translate(-50%, -50%) rotate(-3deg)",
        }}
      />

      {/* The basket only exists while it has a job: opening the picnic. */}
      {phase === "click" && (
        <button
          type="button"
          aria-label="Abrir a cesta"
          onPointerDown={(e) => {
            e.preventDefault();
            play("click");
            show(FEEDBACK.yes, "success");
            setPhase("fill");
          }}
          className="absolute animate-pop-in transition-transform duration-150 hover:scale-110"
          style={{ left: 640, top: 380, width: 210, height: 210, transform: "translate(-50%, -50%)" }}
        >
          <img src={OBJECTS.basket} alt="" className="h-full w-full object-contain" draggable={false} />
        </button>
      )}

      {phase !== "click" && (
        <DropZone
          id="blanket"
          x={BLANKET.x}
          y={BLANKET.y}
          w={340}
          h={220}
          tolerance="overlap"
          padding={PADDING}
          enabled={phase === "fill"}
          active={active}
          showTarget={phase === "fill"}
        />
      )}

      {phase !== "click" &&
        FOODS.map((f, i) =>
          placed.includes(f.id) ? (
            <img
              key={`p-${f.id}`}
              src={f.image}
              alt=""
              className="pointer-events-none absolute animate-pop-in object-contain"
              style={{
                left: BLANKET.x - 105 + i * 90,
                top: BLANKET.y + 10,
                width: 95,
                height: 95,
                transform: "translate(-50%, -50%)",
              }}
            />
          ) : phase === "fill" ? (
            <DragItem
              key={f.id}
              image={f.image}
              start={{ x: f.x, y: f.y }}
              size={SIZE}
              label={f.id}
              onPickup={() => play("pick")}
              onZoneChange={(zone) => setActive(zone === "blanket")}
              onDrop={(zone) => {
                setActive(false);
                if (zone !== "blanket") {
                  show(FEEDBACK.holding, "gentle");
                  return "return";
                }
                play("drop");
                const next = [...placed, f.id];
                setPlaced(next);
                if (next.length === FOODS.length) {
                  show(FEEDBACK.nice, "success");
                  setPhase("walk");
                } else {
                  show(FEEDBACK.yes, "success");
                }
                return "stay";
              }}
            />
          ) : null,
        )}

      {(phase === "walk" || phase === "done") && !leoHome && (
        <>
          {/* Discreet pulsing glow: the blanket itself is the destination. */}
          <div
            className="pointer-events-none absolute animate-pulse rounded-[70px] border-[6px] border-dashed border-[var(--highlight)]/70 bg-[var(--highlight-soft)]/35"
            style={{
              left: BLANKET.x,
              top: BLANKET.y,
              width: 330,
              height: 195,
              transform: "translate(-50%, -50%) rotate(-3deg)",
            }}
          />
          <DropZone
            id="leo-spot"
            x={BLANKET.x}
            y={BLANKET.y}
            w={320}
            h={190}
            tolerance="overlap"
            padding={70}
            active={false}
            showTarget={false}
          />
        </>
      )}

      <DraggableLeo
        start={LEO_SPOT}
        size={150}
        state={phase === "done" ? "celebrating" : "neutral"}
        disabled={phase !== "walk"}
        onPickup={() => play("pick")}
        onDrop={(zone) => {
          if (zone !== "leo-spot") {
            show(FEEDBACK.almost, "gentle");
            return "return";
          }
          play("celebrate");
          setLeoHome(true);
          setPhase("done");
          return "stay";
        }}
      />

      <SpeechBubble
        text={bubble}
        anchorX={LEO_SPOT.x}
        anchorY={LEO_SPOT.y - 155}
        anchorWidth={150}
        side="above"
        width={330}
        tone={phase === "done" ? "cheer" : "normal"}
      />
      <SkillIntro steps={[{ text: "Vamos usar tudo o que aprendemos!", icon: UI.gestureDrop }]} />
      <FeedbackPopup message={feedback} />
    </SceneFrame>
  );
}
