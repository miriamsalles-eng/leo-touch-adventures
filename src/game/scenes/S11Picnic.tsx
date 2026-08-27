import { useState } from "react";
import { ACTIVITIES, FEEDBACK } from "../data/activities";
import { BACKGROUNDS, OBJECTS } from "../assets";
import { DragItem } from "../components/DragItem";
import { DraggableLeo } from "../components/DraggableLeo";
import { DropZone } from "../components/DropZone";
import { GameButton } from "../components/GameButton";
import { SceneFrame } from "../components/SceneFrame";
import { SpeechBubble } from "../components/SpeechBubble";
import { FeedbackPopup, useFeedback } from "../components/FeedbackPopup";
import { useAudio } from "../hooks/useAudio";

const A = ACTIVITIES[10]!;
const SIZE = A.params!["itemSize"] as number;
const PADDING = A.params!["zonePadding"] as number;

const FOODS = [
  { id: "cheese", image: OBJECTS.cheese, start: { x: 250, y: 250 } },
  { id: "grape", image: OBJECTS.grape, start: { x: 250, y: 450 } },
];

type Phase = "click" | "drag" | "walk" | "done";

/** Activity 10 — final short challenge: click + drag + drop + move Leo. */
export function S11Picnic({ onComplete, progress }: { onComplete: () => void; progress: { total: number; current: number } }) {
  const blanket = { x: 720, y: 470 };
  const [phase, setPhase] = useState<Phase>("click");
  const [placed, setPlaced] = useState<string[]>([]);
  const [over, setOver] = useState<string | null>(null);
  const { feedback, show } = useFeedback();
  const { play } = useAudio();

  const message =
    phase === "click"
      ? "Clique na cesta para abrir."
      : phase === "drag"
        ? "Arraste a comida para a toalha."
        : phase === "walk"
          ? "Agora leve o Leo até a toalha."
          : "Piquenique pronto!";

  return (
    <SceneFrame background={BACKGROUNDS.picnic} progress={progress}>
      <img
        src={OBJECTS.blanket}
        alt=""
        className="pointer-events-none absolute h-[260px] w-[330px] opacity-90"
        style={{ left: blanket.x, top: blanket.y, transform: "translate(-50%, -50%)" }}
      />
      <DropZone
        id="blanket"
        x={blanket.x}
        y={blanket.y}
        w={300}
        h={230}
        tolerance="overlap"
        padding={PADDING}
        active={over === "blanket"}
        enabled={phase === "drag" || phase === "walk"}
        showTarget={phase === "drag" || phase === "walk"}
      />

      {placed.map((id, i) => {
        const f = FOODS.find((x) => x.id === id)!;
        return (
          <img
            key={id}
            src={f.image}
            alt=""
            className="pointer-events-none absolute h-[92px] w-[92px]"
            style={{ left: blanket.x - 70 + i * 130, top: blanket.y - 20, transform: "translate(-50%, -50%)" }}
          />
        );
      })}

      {phase === "click" && (
        <button
          type="button"
          aria-label="cesta"
          onPointerDown={(e) => {
            e.preventDefault();
            play("click");
            setPhase("drag");
            show(FEEDBACK.yes, "success");
          }}
          className="absolute h-[170px] w-[170px] transition-transform hover:scale-110"
          style={{ left: 640, top: 300, transform: "translate(-50%, -50%)" }}
        >
          <img src={OBJECTS.basket} alt="" className="h-full w-full" draggable={false} />
        </button>
      )}
      {phase !== "click" && (
        <img
          src={OBJECTS.basket}
          alt=""
          className="pointer-events-none absolute h-[130px] w-[130px] opacity-90"
          style={{ left: 1080, top: 240, transform: "translate(-50%, -50%)" }}
        />
      )}

      {phase === "drag" &&
        FOODS.filter((f) => !placed.includes(f.id)).map((f) => (
          <DragItem
            key={f.id}
            image={f.image}
            start={f.start}
            size={SIZE}
            onPickup={() => play("pick")}
            onZoneChange={setOver}
            onDrop={(zone) => {
              setOver(null);
              if (zone === "blanket") {
                const next = [...placed, f.id];
                setPlaced(next);
                play("drop");
                if (next.length === FOODS.length) {
                  setPhase("walk");
                  show(FEEDBACK.did, "success");
                } else {
                  show(FEEDBACK.yes, "success");
                }
                return "stay";
              }
              show(FEEDBACK.almost, "gentle");
              return "return";
            }}
          />
        ))}

      <DraggableLeo
        start={{ x: 220, y: 620 }}
        size={150}
        state={phase === "done" ? "celebrating" : "neutral"}
        disabled={phase !== "walk"}
        onPickup={() => play("pick")}
        onDrop={(zone, pos) => {
          if (phase !== "walk") return "stay";
          if (zone === "blanket") {
            setPhase("done");
            play("celebrate");
            show(FEEDBACK.did, "success", 2400);
            return { x: blanket.x + 30, y: blanket.y + 120 };
          }
          show(FEEDBACK.almost, "gentle");
          return { x: pos.x, y: pos.y };
        }}
      />

      <SpeechBubble
        text={message}
        anchorX={200}
        anchorY={90}
        anchorWidth={0}
        side="right"
        width={380}
        tone={phase === "done" ? "cheer" : "normal"}
      />

      <FeedbackPopup message={feedback} />
      {phase === "done" && (
        <div className="absolute left-1/2 top-[650px] -translate-x-1/2">
          <GameButton onPress={onComplete}>SEGUIR</GameButton>
        </div>
      )}
    </SceneFrame>
  );
}
