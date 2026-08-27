import { useCallback, useEffect, useState } from "react";
import { DragDropProvider } from "./dragdrop";
import { Stage } from "./stage";
import { AudioProvider } from "./hooks/useAudio";
import { TOTAL_STEPS } from "./data/activities";
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

/** The only persisted value: which step the child stopped at. No profiles. */
const STORAGE_KEY = "aventuras-touchpad:etapa";

export function GameShell() {
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem(STORAGE_KEY));
      if (Number.isFinite(saved) && saved > 0 && saved < TOTAL_STEPS) setStep(saved);
    } catch {
      /* storage unavailable */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, String(step));
    } catch {
      /* storage unavailable */
    }
  }, [step, ready]);

  const next = useCallback(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)), []);
  const restart = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
    setStep(0);
  }, []);

  const progress = { total: TOTAL_STEPS - 2, current: Math.max(0, step - 1) };

  const scene = (() => {
    switch (step) {
      case 0:
        return <S01Opening onComplete={next} />;
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
    <AudioProvider>
      <DragDropProvider>
        <Stage>{ready ? scene : null}</Stage>
      </DragDropProvider>
    </AudioProvider>
  );
}
