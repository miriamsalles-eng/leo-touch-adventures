import { BACKGROUNDS, EFFECTS, OBJECTS, UI } from "../assets";
import { Character } from "../components/Character";
import { GameButton } from "../components/GameButton";
import { SceneFrame } from "../components/SceneFrame";
import { SpeechBubble } from "../components/SpeechBubble";

const SUMMARY = [
  { label: "MOVER", icon: UI.cursor },
  { label: "CLICAR", icon: OBJECTS.cheese },
  { label: "ARRASTAR", icon: UI.arrow },
  { label: "SOLTAR", icon: OBJECTS.folder },
];

export function S12Ending({ onReplay, onRestart }: { onReplay: () => void; onRestart: () => void }) {
  return (
    <SceneFrame background={BACKGROUNDS.garden}>
      <img
        src={EFFECTS.confetti}
        alt=""
        className="pointer-events-none absolute left-[120px] top-[90px] h-[110px] w-[110px]"
      />
      <img
        src={EFFECTS.sparkle}
        alt=""
        className="pointer-events-none absolute right-[130px] top-[110px] h-[100px] w-[100px]"
      />

      <h2 className="absolute left-1/2 top-[70px] -translate-x-1/2 font-display text-[62px] text-[var(--primary-deep)] drop-shadow-[0_4px_0_rgba(255,255,255,0.9)]">
        VOCÊ CONSEGUIU!
      </h2>

      <div className="absolute left-[800px] top-[380px] flex -translate-x-1/2 gap-5">
        {SUMMARY.map((s) => (
          <div
            key={s.label}
            className="flex h-[170px] w-[172px] flex-col items-center justify-center gap-2 rounded-[36px] border-4 border-card bg-card/90 shadow-[var(--shadow-soft)]"
          >
            <img src={s.icon} alt="" className="h-[86px] w-[86px]" />
            <span className="font-display text-[26px] text-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      <Character state="celebrating" x={185} y={690} height={300} bob />
      <SpeechBubble text="Agora você guia a setinha!" anchorX={185} anchorY={400} anchorWidth={220} side="above" width={300} tone="cheer" />

      <div className="absolute left-[800px] top-[590px] flex -translate-x-1/2 gap-6">
        <GameButton onPress={onReplay}>JOGAR DE NOVO</GameButton>
        <GameButton variant="secondary" onPress={onRestart}>
          RECOMEÇAR
        </GameButton>
      </div>
    </SceneFrame>
  );
}
