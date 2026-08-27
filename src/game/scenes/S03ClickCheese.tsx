import { useState } from "react";
import { ACTIVITIES, FEEDBACK } from "../data/activities";
import { BACKGROUNDS, OBJECTS } from "../assets";
import { Character } from "../components/Character";
import { GameButton } from "../components/GameButton";
import { SceneFrame } from "../components/SceneFrame";
import { SpeechBubble } from "../components/SpeechBubble";
import { FeedbackPopup, useFeedback } from "../components/FeedbackPopup";
import { useAudio } from "../hooks/useAudio";

const A = ACTIVITIES[2]!;
const SIZE = A.params!["itemSize"] as number;

const ITEMS = [
  { id: "ball", image: OBJECTS.ball, x: 430, y: 400, label: "bola" },
  { id: "cheese", image: OBJECTS.cheese, x: 660, y: 400, label: "queijo" },
  { id: "apple", image: OBJECTS.apple, x: 890, y: 400, label: "maçã" },
];

/** Activity 2 — clicking. Wrong picks give a kind hint and allow retry. */
export function S03ClickCheese({ onComplete, progress }: { onComplete: () => void; progress: { total: number; current: number } }) {
  const [done, setDone] = useState(false);
  const [wrong, setWrong] = useState<string | null>(null);
  const { feedback, show } = useFeedback();
  const { play } = useAudio();

  const pick = (id: string) => {
    if (done) return;
    if (id === "cheese") {
      setDone(true);
      play("success");
      show(FEEDBACK.yes, "success", 2200);
    } else {
      setWrong(id);
      play("oops");
      show(FEEDBACK.almost, "gentle");
      setTimeout(() => setWrong(null), 600);
    }
  };

  return (
    <SceneFrame background={BACKGROUNDS.garden} progress={progress}>
      <Character state={done ? "happy" : "pointing"} x={175} y={680} height={300} bob={done} />
      <SpeechBubble
        text={done ? "Isso! Esse é o queijo." : "Clique no queijo!"}
        anchorX={175}
        anchorY={400}
        anchorWidth={200}
        side="right"
        width={320}
        tone={done ? "cheer" : "normal"}
      />

      {ITEMS.map((it) => (
        <button
          key={it.id}
          type="button"
          aria-label={it.label}
          onPointerDown={(e) => {
            e.preventDefault();
            pick(it.id);
          }}
          className={`absolute rounded-full transition-transform duration-200 hover:scale-110 ${
            wrong === it.id ? "animate-wiggle" : ""
          } ${done && it.id === "cheese" ? "scale-110" : ""}`}
          style={{ left: it.x, top: it.y, width: SIZE, height: SIZE, transform: "translate(-50%, -50%)" }}
        >
          <img src={it.image} alt="" draggable={false} className="h-full w-full drop-shadow-[0_10px_14px_rgba(20,60,80,0.25)]" />
        </button>
      ))}

      <FeedbackPopup message={feedback} />
      {done && (
        <div className="absolute left-1/2 top-[620px] -translate-x-1/2">
          <GameButton onPress={onComplete}>SEGUIR</GameButton>
        </div>
      )}
    </SceneFrame>
  );
}
