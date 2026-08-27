import { BACKGROUNDS } from "../assets";
import { Character } from "../components/Character";
import { GameButton } from "../components/GameButton";
import { SceneFrame } from "../components/SceneFrame";
import { SpeechBubble } from "../components/SpeechBubble";

export function S01Opening({ onComplete }: { onComplete: () => void }) {
  return (
    <SceneFrame background={BACKGROUNDS.bedroom}>
      <div className="absolute left-1/2 top-[92px] w-[900px] -translate-x-1/2 text-center">
        <h1 className="font-display text-[74px] leading-none text-[var(--primary-deep)] drop-shadow-[0_4px_0_rgba(255,255,255,0.9)]">
          AVENTURAS NO TOUCHPAD
        </h1>
      </div>

      <Character state="pointing" x={905} y={648} height={360} bob />
      <SpeechBubble
        text="Vamos aprender a controlar a setinha?"
        anchorX={905}
        anchorY={330}
        anchorWidth={280}
        side="left"
        width={380}
      />

      <div className="absolute left-[400px] top-[540px] -translate-x-1/2">
        <GameButton onPress={onComplete}>COMEÇAR</GameButton>
      </div>
    </SceneFrame>
  );
}
