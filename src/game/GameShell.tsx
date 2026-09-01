import { useCallback, useEffect, useState } from "react";
import { DragDropProvider } from "./dragdrop";
import { Stage } from "./stage";
import { AudioProvider, useAudio } from "./hooks/useAudio";
import { TOTAL_STEPS } from "./data/activities";
import { speech } from "./speech";
import { S01Opening } from "./scenes/S01Opening";
import { S02FindLeo } from "./scenes/S02FindLeo";
import { S03ClickCheese } from "./scenes/S03ClickCheese";
import { S04CarryCheese } from "./scenes/S04CarryCheese";
import { S05Backpack } from "./scenes/S05Backpack";
import { S06Sorting } from "./scenes/S06Sorting";
import { S07Puzzle } from "./scenes/S07Puzzle";
import { S08GardenPath } from "./scenes/S08GardenPath";
import { S09Forest } from "./scenes/S09Forest";
import { S10Computer } from "./scenes/S10Computer";
import { S11Picnic } from "./scenes/S11Picnic";
import { S12Ending } from "./scenes/S12Ending";

/**
 * No progress is persisted anywhere (no localStorage, sessionStorage, URL or
 * query params): every reload starts a brand new session at the cover.
 */
function Flow() {
  const [step, setStep] = useState(0);
  /** Remounts every scene on RECOMEÇAR, clearing all internal round state. */
  const [session, setSession] = useState(0);
  const { start, setMuted } = useAudio();

  /* The old voice is cancelled BEFORE the new scene mounts its own lines, so
     no post-render effect can ever cut the first sentence of a new scene. */
  const next = useCallback(() => {
    speech.cancel();
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }, []);
  const begin = useCallback(() => {
    start();
    next();
  }, [start, next]);

  const restart = useCallback(() => {
    speech.cancel();
    setMuted(false);
    setSession((s) => s + 1);
    setStep(0);
  }, [setMuted]);

  const progress = { total: TOTAL_STEPS - 2, current: Math.max(0, step - 1) };

  const scene = (() => {
    switch (step) {
      case 0:
        return <S01Opening onComplete={begin} />;
      case 1:
        return <S02FindLeo onComplete={next} progress={progress} />;
      case 2:
        return <S03ClickCheese onComplete={next} progress={progress} />;
      case 3:
        return <S04CarryCheese onComplete={next} progress={progress} />;
      case 4:
        return <S05Backpack onComplete={next} progress={progress} />;
      case 5:
        return <S06Sorting onComplete={next} progress={progress} />;
      case 6:
        return <S07Puzzle onComplete={next} progress={progress} />;
      case 7:
        return <S08GardenPath onComplete={next} progress={progress} />;
      case 8:
        return <S09Forest onComplete={next} progress={progress} />;
      case 9:
        return <S10Computer onComplete={next} progress={progress} />;
      case 10:
        return <S11Picnic onComplete={next} progress={progress} />;
      default:
        return <S12Ending onRestart={restart} />;
    }
  })();

  return (
    <DragDropProvider>
      <Stage>
        <div key={`${session}-${step}`} className="absolute inset-0">
          {scene}
        </div>
      </Stage>
    </DragDropProvider>
  );
}

export function GameShell() {
  return (
    <AudioProvider>
      <Flow />
    </AudioProvider>
  );
}
