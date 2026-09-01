import { useState } from "react";
import { BACKGROUNDS, OBJECTS, UI } from "../assets";
import { Character } from "../components/Character";
import { GameButton } from "../components/GameButton";
import { SceneFrame } from "../components/SceneFrame";
import { SpeechBubble } from "../components/SpeechBubble";
import { useNarration } from "../hooks/useNarration";

/** Secondary synthesis: the skills stay visible, but Leo is the protagonist. */
const SUMMARY = [
  { icon: UI.gestureMove, label: "MOVER" },
  { icon: UI.gestureClick, label: "CLICAR" },
  { icon: UI.gestureDrag, label: "ARRASTAR" },
  { icon: UI.gestureDrop, label: "SOLTAR" },
];

const LINES = [
  "Você me ajudou em todos os desafios!",
  "Encontrou, clicou, arrastou e levou tudo ao lugar certo.",
  "Até a próxima brincadeira!",
];

/** Closing scene: picnic area, Leo big and in focus, then RECOMEÇAR. */
export function S12Ending({ onRestart }: { onRestart: () => void }) {
  const [finished, setFinished] = useState(false);
  const line = useNarration(LINES, !finished, () => setFinished(true));

  return (
    <SceneFrame background={BACKGROUNDS.picnic}>
      {/* The picnic Leo and the child prepared together */}
      <img
        src={OBJECTS.blanket}
        alt=""
        className="pointer-events-none absolute object-contain"
        style={{ left: 300, top: 610, width: 400, height: 230, transform: "translate(-50%, -50%) rotate(-3deg)" }}
      />
      <img
        src={OBJECTS.basket}
        alt=""
        className="pointer-events-none absolute object-contain"
        style={{ left: 165, top: 570, width: 150, height: 150, transform: "translate(-50%, -50%)" }}
      />

      <Character state="celebrating" x={370} y={620} height={400} bob />

      <h2 className="absolute left-[880px] top-[92px] -translate-x-1/2 text-center font-display text-[52px] text-[var(--primary-deep)] drop-shadow-[0_3px_0_rgba(255,255,255,0.9)]">
        Que passeio divertido!
      </h2>

      <SpeechBubble
        text={line ?? LINES[LINES.length - 1]!}
        anchorX={370}
        anchorY={250}
        anchorWidth={220}
        side="right"
        width={430}
        tone="cheer"
      />

      {/* Secondary strip: the skills learned, small and at the bottom */}
      <div className="absolute left-[880px] top-[470px] flex -translate-x-1/2 -translate-y-1/2 items-center gap-4 rounded-[30px] bg-card/85 px-6 py-3 shadow-[var(--shadow-soft)]">
        {SUMMARY.map((s) => (
          <div key={s.label} className="flex w-[92px] flex-col items-center gap-1">
            <img src={s.icon} alt="" className="h-[46px] w-[46px] object-contain" />
            <span className="font-display text-[16px] text-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="absolute left-[880px] top-[615px] -translate-x-1/2 -translate-y-1/2">
        <GameButton onPress={onRestart}>RECOMEÇAR</GameButton>
      </div>
    </SceneFrame>
  );
}
