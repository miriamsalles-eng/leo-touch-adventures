import { BACKGROUNDS } from "../assets";
import { GameButton } from "../components/GameButton";
import { SceneFrame } from "../components/SceneFrame";

/**
 * Cover — uses the official "Leo em Movimento" artwork (title, Leo and the
 * four gestures are part of the illustration, so nothing is drawn on top of
 * Leo). Only the big COMEÇAR button is added.
 */
export function S01Opening({ onComplete }: { onComplete: () => void }) {
  return (
    <SceneFrame background={BACKGROUNDS.cover} plain>
      <h1 className="sr-only">Leo em Movimento — vamos aprender a controlar a setinha?</h1>
      <div className="absolute left-[760px] top-[646px] -translate-x-1/2 -translate-y-1/2 animate-pop-in">
        <GameButton onPress={onComplete}>COMEÇAR</GameButton>
      </div>
    </SceneFrame>
  );
}
