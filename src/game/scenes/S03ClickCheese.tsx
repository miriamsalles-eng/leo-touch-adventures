import { useState } from "react";
import { ACTIVITIES, FEEDBACK } from "../data/activities";
import { BACKGROUNDS, OBJECTS } from "../assets";
import { Character } from "../components/Character";
import { RoundBadge } from "../components/RoundBadge";
import { SceneFrame } from "../components/SceneFrame";
import { SpeechBubble } from "../components/SpeechBubble";
import { FeedbackPopup, useFeedback } from "../components/FeedbackPopup";
import { useAudio } from "../hooks/useAudio";

const A = ACTIVITIES[2]!;
const SIZE = A.params!["itemSize"] as number;

type Item = { id: string; image: string; x: number; y: number; correct: boolean };
type Round = { hint: string; items: Item[] };

/** Four rounds: move, position and click. Objects change place every round. */
const ROUNDS: Round[] = [
  {
    hint: "Clique no queijo!",
    items: [
      { id: "apple", image: OBJECTS.apple, x: 480, y: 300, correct: false },
      { id: "cheese", image: OBJECTS.cheese, x: 760, y: 300, correct: true },
      { id: "ball", image: OBJECTS.ball, x: 620, y: 500, correct: false },
    ],
  },
  {
    hint: "Clique na bola!",
    items: [
      { id: "ball", image: OBJECTS.ball, x: 470, y: 470, correct: true },
      { id: "cheese", image: OBJECTS.cheese, x: 700, y: 290, correct: false },
      { id: "apple", image: OBJECTS.apple, x: 880, y: 470, correct: false },
    ],
  },
  {
    hint: "Clique na maçã!",
    items: [
      { id: "ball", image: OBJECTS.ball, x: 460, y: 320, correct: false },
      { id: "apple", image: OBJECTS.apple, x: 880, y: 320, correct: true },
      { id: "cheese", image: OBJECTS.cheese, x: 660, y: 500, correct: false },
    ],
  },
  {
    hint: "Clique na banana!",
    items: [
      { id: "banana", image: OBJECTS.banana, x: 640, y: 300, correct: true },
      { id: "ball", image: OBJECTS.ball, x: 900, y: 480, correct: false },
      { id: "apple", image: OBJECTS.apple, x: 440, y: 480, correct: false },
    ],
  },
];

export function S03ClickCheese({
  onComplete,
  progress,
}: {
  onComplete: () => void;
  progress: { total: number; current: number };
}) {
  const [round, setRound] = useState(0);
  const [done, setDone] = useState(false);
  const { feedback, show } = useFeedback();
  const { play } = useAudio();

  const r = ROUNDS[round]!;

  const press = (item: Item) => {
    if (done) return;
    if (!item.correct) {
      play("oops");
      show(FEEDBACK.almost, "gentle");
      return;
    }
    play("success");
    if (round < ROUNDS.length - 1) {
      show(FEEDBACK.yes, "success", 1300);
      setRound((n) => n + 1);
    } else {
      setDone(true);
    }
  };

  return (
    <SceneFrame
      background={BACKGROUNDS.bedroom}
      progress={progress}
      onNext={done ? onComplete : undefined}
    >
      <Character state={done ? "celebrating" : "pointing"} x={175} y={700} height={265} bob={!done} />
      <SpeechBubble
        text={done ? "Muito bem! Você clicou muito bem!" : r.hint}
        anchorX={185}
        anchorY={435}
        anchorWidth={200}
        side="above"
        width={330}
        tone={done ? "cheer" : "normal"}
      />

      {!done &&
        r.items.map((item) => (
          <button
            key={`${round}-${item.id}`}
            type="button"
            aria-label={item.id}
            onPointerDown={(e) => {
              e.preventDefault();
              press(item);
            }}
            className="absolute animate-pop-in rounded-full transition-transform duration-150 hover:scale-110 focus-visible:outline-4"
            style={{ left: item.x, top: item.y, width: SIZE, height: SIZE, transform: "translate(-50%, -50%)" }}
          >
            <img
              src={item.image}
              alt=""
              draggable={false}
              className="h-full w-full object-contain drop-shadow-[0_10px_14px_rgba(20,60,80,0.25)]"
            />
          </button>
        ))}

      <RoundBadge current={done ? ROUNDS.length : round} total={ROUNDS.length} />
      <FeedbackPopup message={feedback} />
    </SceneFrame>
  );
}
