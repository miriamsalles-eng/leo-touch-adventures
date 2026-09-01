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
import { useNarration } from "../hooks/useNarration";
import { useInstructionSpeech } from "../hooks/useInstructionSpeech";
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

/** Contextual success line for each intermediate round. */
const SUCCESS = ["Você me encontrou!", "Conseguiu de novo!", "Achou onde eu estava!"];

/** Leo introduces himself before the very first practice. */
const HELLO = ["Oi! Eu sou o Leo! Vamos brincar?", "Eu vou mudar de lugar. Leve a setinha até mim!"];
/** Narrative bridge to the clicking activity — no extra screen, no extra click. */
const OUTRO = ["Nossa! Você me encontrou todas as vezes!", "Agora vou pedir um objeto. Quando encontrar, clique nele!"];

export function S02FindLeo({
  onComplete,
  progress,
}: {
  onComplete: () => void;
  progress: { total: number; current: number };
}) {
  const [started, setStarted] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [round, setRound] = useState(0);
  const [hover, setHover] = useState(false);
  const [done, setDone] = useState(false);
  const { feedback, show, isBusy } = useFeedback();
  const ready = started && introDone && !isBusy;
  const { point } = usePointerTracking(ready && !done);
  const { play } = useAudio();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hello = useNarration(HELLO, !started, () => setStarted(true));
  const outro = useNarration(OUTRO, done, onComplete);

  const spot = ROUNDS[round]!;
  /* The instruction speaks again on every new round, same text or not. */
  useInstructionSpeech(spot.hint, ready && !done, round);

  useEffect(() => {
    if (done || !ready) return;
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
        /* The next round only starts after the feedback finished talking. */
        show(SUCCESS[round] ?? SUCCESS[0]!, "success", undefined, () => {
          setRound((r) => r + 1);
          setHover(false);
        });
      } else {
        setDone(true);
      }
      timer.current = null;
    }, DWELL);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
    };
  }, [point, done, ready, round, spot.x, spot.y, play, show]);

  const bubble = hello ?? outro ?? spot.hint;

  return (
    <SceneFrame background={BACKGROUNDS.bedroom} progress={progress}>
      <Character
        state={done ? "celebrating" : hover ? "happy" : "neutral"}
        x={spot.x}
        y={spot.y}
        height={330}
        bob={!hover}
        glow={hover}
      />
      <SpeechBubble
        text={bubble}
        anchorX={spot.x}
        anchorY={spot.y - 300}
        anchorWidth={230}
        side="auto"
        tone={hover || done ? "cheer" : "normal"}
      />
      {started && (
        <SkillIntro
          steps={[{ label: "Aprendendo: mover", text: "Agora vamos aprender a mover a setinha!", icon: UI.gestureMove }]}
          onComplete={() => setIntroDone(true)}
        />
      )}
      <RoundBadge current={done ? ROUNDS.length : round} total={ROUNDS.length} />
      <FeedbackPopup message={feedback} />
    </SceneFrame>
  );
}
