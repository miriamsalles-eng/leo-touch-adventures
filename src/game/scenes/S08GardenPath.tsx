import { ACTIVITIES } from "../data/activities";
import { BACKGROUNDS } from "../assets";
import { PathScene } from "./PathScene";

const A = ACTIVITIES[7]!;

/** Activity 7 — wide, organic garden path. */
export function S08GardenPath({ onComplete, progress }: { onComplete: () => void; progress: { total: number; current: number } }) {
  return (
    <PathScene
      background={BACKGROUNDS.garden}
      points={[
        { x: 180, y: 560 },
        { x: 340, y: 520 },
        { x: 500, y: 430 },
        { x: 680, y: 400 },
        { x: 860, y: 460 },
        { x: 1040, y: 400 },
      ]}
      corridorWidth={A.params!["corridorWidth"] as number}
      leoSize={A.params!["leoSize"] as number}
      hint="Me leve pelo caminho!"
      intro="Vamos controlar melhor o movimento!"
      successText="Chegamos! Você conseguiu!"
      onComplete={onComplete}
      progress={progress}
    />
  );
}
