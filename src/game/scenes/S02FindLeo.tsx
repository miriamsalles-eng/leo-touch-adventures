import { useEffect, useRef, useState } from "react";
import { ACTIVITIES, FEEDBACK } from "../data/activities";
import { BACKGROUNDS } from "../assets";
import { Character } from "../components/Character";
import { GameButton } from "../components/GameButton";
import { SceneFrame } from "../components/SceneFrame";
import { SpeechBubble } from "../components/SpeechBubble";
import { FeedbackPopup, useFeedback } from "../components/FeedbackPopup";
import { distance, usePointerTracking } from "../hooks/usePointerTracking";
import { useAudio } from "../hooks/useAudio";

const A = ACTIVITIES[1]!;
const HOVER_RADIUS = A.params!["hoverRadius"] as number;
const DWELL_MS = A.params!["dwellMs"] as number;

/** Activity 1 — move only, no click. Success after dwelling ~800ms on Leo. */
export function S02FindLeo({ onComplete, progress }: { onComplete: () => void; progress: { total: number; current: number } }) {
  const leo = { x: 880, y: 420 };
  const { point } = usePointerTracking();
  const [hover, setHover] = useState(false);
  const [done, setDone] = useState(false);
  const { feedback, show } = useFeedback();
  const { play } = useAudio();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const near = !!point && distance(point, leo) < HOVER_RADIUS;

  useEffect(() => {
    setHover(near);
    if (done) return;
    if (near) {
      timer.current = setTimeout(() => {
        setDone(true);
        play("success");
        show(FEEDBACK.did, "success", 2200);
      }, DWELL_MS);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [near, done, play, show]);

  return (
    <SceneFrame background={BACKGROUNDS.bedroom} progress={progress}>
      {hover && !done && (
        <div
          className="pointer-events-none absolute rounded-full bg-[var(--highlight-soft)] blur-xl"
          style={{ left: leo.x - 130, top: leo.y - 110, width: 260, height: 300 }}
        />
      )}
      <Character
        state={done ? "happy" : hover ? "looking-up" : "neutral"}
        x={leo.x}
        y={leo.y + 210}
        height={330}
        bob={hover || done}
      />
      <SpeechBubble
        text={done ? "Você me encontrou!" : "Leve a setinha até mim."}
        anchorX={leo.x}
        anchorY={leo.y - 90}
        anchorWidth={280}
        tone={done ? "cheer" : "normal"}
      />
      <FeedbackPopup message={feedback} />
      {done && (
        <div className="absolute left-1/2 top-[620px] -translate-x-1/2">
          <GameButton onPress={onComplete}>SEGUIR</GameButton>
        </div>
      )}
    </SceneFrame>
  );
}
