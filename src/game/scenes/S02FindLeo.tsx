import { useEffect, useRef, useState } from "react";
import { ACTIVITIES } from "../data/activities";
import { BACKGROUNDS, UI } from "../assets";
import { Character } from "../components/Character";
import { RoundBadge } from "../components/RoundBadge";
import { SkillIntro } from "../components/SkillIntro";
import { SceneFrame } from "../components/SceneFrame";
import { SpeechBubble } from "../components/SpeechBubble";
import { FeedbackPopup, useFeedback } from "../components/FeedbackPopup";
import { distance, usePointerTracking } from "../hooks/usePointerTracking";
import { useAudio } from "../hooks/useAudio";

const A = ACTIVITIES[1]!;
const RADIUS = A.params!["hoverRadius"] as number;
const DWELL = A.params!["dwellMs"] as number;

/**
 * Four short rounds using validated safe positions (never over the bubble,
 * buttons or progress bar). Leo only moves AFTER the child reaches him.
 */
const ROUNDS = [
  { x: 640, y: 540, hint: "Leve a setinha até mim!" },
  { x: 300, y: 520, hint: "Agora me encontre aqui!" },
  { x: 990, y: 540, hint: "Agora me encontre aqui!" },
  { x: 640, y: 400, hint: "Agora me encontre aqui!" },
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
        show("Isso! Você moveu a setinha!", "success", 1300);
        setRound((r) => r + 1);
        setHover(false);
      } else {
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
        text={done ? "Muito bem! Você me encontrou!" : hover ? "Isso!" : spot.hint}
        anchorX={spot.x}
        anchorY={spot.y - 300}
        anchorWidth={230}
        side="auto"
        tone={hover || done ? "cheer" : "normal"}
      />
      <SkillIntro steps={[{ text: "Agora vamos aprender a mover a setinha!", icon: UI.gestureMove }]} />
      <RoundBadge current={done ? ROUNDS.length : round} total={ROUNDS.length} />
      <FeedbackPopup message={feedback} />
    </SceneFrame>
  );
}
