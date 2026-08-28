import { ACTIVITIES } from "../data/activities";
import { BACKGROUNDS, OBJECTS } from "../assets";
import { PathScene } from "./PathScene";

const A = ACTIVITIES[8]!;

/** Activity 8 — friendly forest trail: left/right curves, up and down moves. */
export function S09Forest({ onComplete, progress }: { onComplete: () => void; progress: { total: number; current: number } }) {
  return (
    <PathScene
      background={BACKGROUNDS.forest}
      points={[
        { x: 170, y: 250 },
        { x: 330, y: 250 },
        { x: 420, y: 400 },
        { x: 420, y: 560 },
        { x: 620, y: 600 },
        { x: 760, y: 470 },
        { x: 900, y: 330 },
        { x: 1080, y: 330 },
      ]}
      corridorWidth={A.params!["corridorWidth"] as number}
      leoSize={A.params!["leoSize"] as number}
      goalImage={OBJECTS.cheese}
      hint="Me leve até o final!"
      intro="Agora o caminho tem mais curvas!"
      successText="Que trilha bem feita!"
      onComplete={onComplete}
      progress={progress}
    />
  );
}
