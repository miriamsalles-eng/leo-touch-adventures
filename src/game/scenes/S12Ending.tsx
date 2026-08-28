import { BACKGROUNDS, UI } from "../assets";
import { Character } from "../components/Character";
import { GameButton } from "../components/GameButton";
import { SceneFrame } from "../components/SceneFrame";

const SUMMARY = [
  { icon: UI.gestureMove, label: "MOVER" },
  { icon: UI.gestureClick, label: "CLICAR" },
  { icon: UI.gestureDrag, label: "ARRASTAR" },
  { icon: UI.gestureDrop, label: "SOLTAR" },
];

/** Closing screen: celebration, visual summary and a single RECOMEÇAR button. */
export function S12Ending({ onRestart }: { onRestart: () => void }) {
  return (
    <SceneFrame background={BACKGROUNDS.garden}>
      <Character state="celebrating" x={220} y={660} height={380} bob />

      <h2 className="absolute left-[790px] top-[110px] -translate-x-1/2 font-display text-[58px] text-[var(--primary-deep)] drop-shadow-[0_3px_0_rgba(255,255,255,0.9)]">
        Você conseguiu!
      </h2>

      <div className="absolute left-[790px] top-[350px] flex -translate-x-1/2 -translate-y-1/2 gap-6">
        {SUMMARY.map((s) => (
          <div
            key={s.label}
            className="flex h-[190px] w-[150px] flex-col items-center justify-center gap-3 rounded-[32px] border-4 border-card bg-card/95 shadow-[var(--shadow-soft)]"
          >
            <img src={s.icon} alt="" className="h-[86px] w-[86px] object-contain" />
            <span className="font-display text-[22px] text-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      <p className="absolute left-[790px] top-[500px] -translate-x-1/2 font-display text-[30px] text-foreground">
        Agora você sabe mover, clicar, arrastar e soltar!
      </p>

      <div className="absolute left-[790px] top-[610px] -translate-x-1/2 -translate-y-1/2">
        <GameButton onPress={onRestart}>RECOMEÇAR</GameButton>
      </div>
    </SceneFrame>
  );
}
