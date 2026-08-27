import { useEffect, useRef, useState } from "react";
import { ACTIVITIES, FEEDBACK } from "../data/activities";
import { BACKGROUNDS } from "../assets";
import { Character } from "../components/Character";
import { SceneFrame } from "../components/SceneFrame";
import { SpeechBubble } from "../components/SpeechBubble";
import { FeedbackPopup, useFeedback } from "../components/FeedbackPopup";
import { distance, usePointerTracking } from "../hooks/usePointerTracking";
import { useAudio } from "../hooks/useAudio";

const A = ACTIVITIES[1]!;
const RADIUS = A.params!["hoverRadius"] as number;
const DWELL = A.params!["dwellMs"] as number;

/** Three short rounds: Leo appears in a different spot each time. */
const ROUNDS = [
  { x: 940, y: 560, hint: "Leve a setinha até o Leo." },
  { x: 300, y: 520, hint: "Agora o Leo está aqui!" },
  { x: 660, y: 460, hint: "Mais uma vez: até o Leo." },
];

export function S02FindLeo({
  onComplete,
  progress,
}: {
  onComplete: () => void;
  progress: { total: number; current: number };
}) {
  const [round, setRound] = useState(0);
  const [hover, setHover] = useState(false);
  const [done, setDone] = useState(false);
  const { point } = usePointerTracking(!done);
  const { feedback, show } = useFeedback();
  const { play } = useAudio();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const spot = ROUNDS[round]!;

  useEffect(() => {
    if (done) return;
    const near = point ? distance(point, { x: spot.x, y: spot.y - 130 }) < RADIUS : false;
    setHover(near);
    if (!near) {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
      return;
    }
    if (timer.current) return;
    timer.current = setTimeout(() => {
      play("success");
      if (round < ROUNDS.length - 1) {
        show(FEEDBACK.yes, "success");
        setRound((r) => r + 1);
        setHover(false);
      } else {
        show(FEEDBACK.did, "success");
        setDone(true);
      }
      timer.current = null;
    }, DWELL);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
    };
  }, [point, done, round, spot.x, spot.y, play, show]);

  return (
    <SceneFrame
      background={BACKGROUNDS.bedroom}
      progress={progress}
      onNext={done ? onComplete : undefined}
    >
      <Character
        state={done ? "celebrating" : hover ? "happy" : "neutral"}
        x={spot.x}
        y={spot.y}
        height={330}
        bob={!hover}
        glow={hover}
      />
      <SpeechBubble
        text={done ? "Você conseguiu mover a setinha!" : hover ? FEEDBACK.yes : spot.hint}
        anchorX={spot.x}
        anchorY={spot.y - 300}
        anchorWidth={230}
        side="auto"
        tone={hover || done ? "cheer" : "normal"}
      />
      <FeedbackPopup message={feedback} />
    </SceneFrame>
  );
}
