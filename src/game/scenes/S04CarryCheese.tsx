import { useState } from "react";
import { ACTIVITIES, FEEDBACK } from "../data/activities";
import { BACKGROUNDS, OBJECTS } from "../assets";
import { Character } from "../components/Character";
import { DragItem } from "../components/DragItem";
import { DropZone } from "../components/DropZone";
import { GameButton } from "../components/GameButton";
import { SceneFrame } from "../components/SceneFrame";
import { SpeechBubble } from "../components/SpeechBubble";
import { FeedbackPopup, useFeedback } from "../components/FeedbackPopup";
import { useAudio } from "../hooks/useAudio";

const A = ACTIVITIES[3]!;
const SIZE = A.params!["itemSize"] as number;
const PADDING = A.params!["zonePadding"] as number;

type Step = "idle" | "holding" | "over" | "done";

/** Activity 3 — drag with explicit micro-steps: pick up, carry, release. */
export function S04CarryCheese({ onComplete, progress }: { onComplete: () => void; progress: { total: number; current: number } }) {
  const leo = { x: 950, y: 430 };
  const [step, setStep] = useState<Step>("idle");
  const { feedback, show } = useFeedback();
  const { play } = useAudio();

  const message =
    step === "idle"
      ? "Arraste o queijo até o Leo."
      : step === "holding"
        ? "Agora leve até Leo sem soltar."
        : step === "over"
          ? "Agora solte!"
          : "Obrigado! Que delícia!";

  return (
    <SceneFrame background={BACKGROUNDS.garden} progress={progress}>
      <DropZone
        id="leo"
        x={leo.x}
        y={leo.y}
        w={230}
        h={230}
        tolerance="overlap"
        padding={PADDING}
        enabled={step !== "done"}
        active={step === "over"}
        showTarget={step !== "done"}
      />
      <Character state={step === "done" ? "with-cheese" : "pointing"} x={leo.x} y={leo.y + 250} height={330} bob={step === "done"} />
      <SpeechBubble
        text={message}
        anchorX={leo.x}
        anchorY={leo.y - 120}
        anchorWidth={280}
        side="left"
        width={360}
        tone={step === "done" ? "cheer" : "normal"}
      />

      {step !== "done" && (
        <DragItem
          image={OBJECTS.cheese}
          start={{ x: 280, y: 470 }}
          size={SIZE}
          label="queijo"
          onPickup={() => {
            setStep("holding");
            play("pick");
          }}
          onZoneChange={(z) => setStep(z ? "over" : "holding")}
          onDrop={(zone) => {
            if (zone === "leo") {
              setStep("done");
              play("success");
              show(FEEDBACK.did, "success", 2200);
              return { x: leo.x - 40, y: leo.y + 40 };
            }
            setStep("idle");
            show(FEEDBACK.holding, "gentle");
            return "return";
          }}
        />
      )}

      <FeedbackPopup message={feedback} />
      {step === "done" && (
        <div className="absolute left-[300px] top-[620px] -translate-x-1/2">
          <GameButton onPress={onComplete}>SEGUIR</GameButton>
        </div>
      )}
    </SceneFrame>
  );
}
