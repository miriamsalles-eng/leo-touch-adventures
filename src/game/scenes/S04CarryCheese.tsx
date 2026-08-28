import { useState } from "react";
import { ACTIVITIES, FEEDBACK } from "../data/activities";
import { BACKGROUNDS, OBJECTS, UI } from "../assets";
import { Character } from "../components/Character";
import { DragItem } from "../components/DragItem";
import { DropZone } from "../components/DropZone";
import { RoundBadge } from "../components/RoundBadge";
import { SkillIntro } from "../components/SkillIntro";
import { SceneFrame } from "../components/SceneFrame";
import { SpeechBubble } from "../components/SpeechBubble";
import { FeedbackPopup, useFeedback } from "../components/FeedbackPopup";
import { useAudio } from "../hooks/useAudio";

const A = ACTIVITIES[3]!;
const SIZE = A.params!["itemSize"] as number;
const PADDING = A.params!["zonePadding"] as number;

/** Four rounds, one per direction: right, left, up and down. */
const ROUNDS = [
  { item: { x: 300, y: 520 }, leo: { x: 1000, y: 620 }, hint: "Arraste o queijo até mim!" },
  { item: { x: 1010, y: 520 }, leo: { x: 300, y: 620 }, hint: "Agora arraste para a esquerda!" },
  { item: { x: 660, y: 620 }, leo: { x: 660, y: 340 }, hint: "Agora arraste para cima!" },
  { item: { x: 660, y: 250 }, leo: { x: 660, y: 690 }, hint: "Agora arraste para baixo!" },
];

type Step = "idle" | "holding" | "over" | "round-done";

export function S04CarryCheese({
  onComplete,
  progress,
}: {
  onComplete: () => void;
  progress: { total: number; current: number };
}) {
  const [round, setRound] = useState(0);
  const [step, setStep] = useState<Step>("idle");
  const [done, setDone] = useState(false);
  const { feedback, show } = useFeedback();
  const { play } = useAudio();

  const r = ROUNDS[round]!;
  const target = { x: r.leo.x, y: r.leo.y - 150 };

  const bubble =
    done
      ? "Muito bem! Você arrastou e soltou!"
      : step === "holding"
        ? "Segure e traga até mim."
        : step === "over"
          ? "Agora solte aqui!"
          : r.hint;

  return (
    <SceneFrame
      background={BACKGROUNDS.bedroom}
      progress={progress}
      onNext={done ? onComplete : undefined}
    >
      <Character
        state={done ? "celebrating" : step === "over" ? "happy" : "pointing"}
        x={r.leo.x}
        y={r.leo.y}
        height={320}
        bob={step === "idle"}
      />

      <DropZone
        id="leo"
        x={target.x}
        y={target.y}
        w={230}
        h={230}
        tolerance="overlap"
        padding={PADDING}
        enabled={!done}
        active={step === "over"}
        showTarget={!done}
      />

      {!done && (
        <DragItem
          key={round}
          image={OBJECTS.cheese}
          start={r.item}
          size={SIZE}
          label="queijo"
          onPickup={() => {
            play("pick");
            setStep("holding");
          }}
          onZoneChange={(zone) => setStep(zone === "leo" ? "over" : "holding")}
          onDrop={(zone) => {
            if (zone !== "leo") {
              show(FEEDBACK.holding, "gentle");
              setStep("idle");
              return "return";
            }
            play("success");
            if (round < ROUNDS.length - 1) {
              show(round === 0 ? "Muito bem! Você arrastou!" : "Isso! Você soltou no lugar certo!", "success", 1300);
              setStep("idle");
              setRound((n) => n + 1);
              return "return";
            }
            setStep("round-done");
            setDone(true);
            return { x: target.x, y: target.y };
          }}
        />
      )}

      <SpeechBubble
        text={bubble}
        anchorX={r.leo.x}
        anchorY={r.leo.y - 300}
        anchorWidth={230}
        side="auto"
        tone={done || step === "over" ? "cheer" : "normal"}
      />
      <SkillIntro
        steps={[
          { text: "Agora vamos aprender a arrastar!", icon: UI.gestureDrag },
          { text: "E soltar no lugar certo!", icon: UI.gestureDrop },
        ]}
      />
      <RoundBadge current={done ? ROUNDS.length : round} total={ROUNDS.length} y={40} x={200} />
      <FeedbackPopup message={feedback} />
    </SceneFrame>
  );
}
