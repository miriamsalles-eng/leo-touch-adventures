import { useState } from "react";
import { ACTIVITIES, FEEDBACK } from "../data/activities";
import { OBJECTS } from "../assets";
import { Character } from "../components/Character";
import { DragItem } from "../components/DragItem";
import { DropZone } from "../components/DropZone";
import { GameButton } from "../components/GameButton";
import { SceneFrame } from "../components/SceneFrame";
import { SpeechBubble } from "../components/SpeechBubble";
import { FeedbackPopup, useFeedback } from "../components/FeedbackPopup";
import { useAudio } from "../hooks/useAudio";

const A = ACTIVITIES[9]!;
const SIZE = A.params!["itemSize"] as number;
const PADDING = A.params!["zonePadding"] as number;

/** Activity 9 — abstract kid desktop: drag a picture file into a big folder. */
export function S10Computer({ onComplete, progress }: { onComplete: () => void; progress: { total: number; current: number } }) {
  const folder = { x: 800, y: 380 };
  const [done, setDone] = useState(false);
  const [over, setOver] = useState(false);
  const { feedback, show } = useFeedback();
  const { play } = useAudio();

  return (
    <SceneFrame
      gradient="linear-gradient(160deg, var(--desk-1), var(--desk-2) 55%, var(--desk-3))"
      progress={progress}
    >
      <div className="pointer-events-none absolute inset-x-[70px] top-[70px] h-[560px] rounded-[44px] border-[10px] border-card bg-white/45" />

      <DropZone
        id="folder"
        x={folder.x}
        y={folder.y}
        w={300}
        h={260}
        tolerance="overlap"
        padding={PADDING}
        active={over}
        image={OBJECTS.folder}
        label="Minhas fotos"
        enabled={!done}
        showTarget={!done}
      />

      {done && (
        <img
          src={OBJECTS.imagefile}
          alt=""
          className="pointer-events-none absolute h-[86px] w-[86px] animate-pop-in"
          style={{ left: folder.x, top: folder.y + 20, transform: "translate(-50%, -50%)" }}
        />
      )}

      <Character state={done ? "happy" : "laptop"} x={1120} y={690} height={250} bob={done} />
      <SpeechBubble
        text={done ? "Muito bem! Guardado na pasta!" : "Arraste a foto para a pasta."}
        anchorX={1120}
        anchorY={440}
        anchorWidth={200}
        side="above"
        width={300}
        tone={done ? "cheer" : "normal"}
      />

      {!done && (
        <DragItem
          image={OBJECTS.imagefile}
          start={{ x: 300, y: 380 }}
          size={SIZE}
          label="foto"
          onPickup={() => play("pick")}
          onZoneChange={(z) => setOver(z === "folder")}
          onDrop={(zone) => {
            setOver(false);
            if (zone === "folder") {
              setDone(true);
              play("success");
              return "stay";
            }
            show(FEEDBACK.holding, "gentle");
            return "return";
          }}
        />
      )}

      <FeedbackPopup message={feedback} />
      {done && (
        <div className="absolute right-8 top-[618px] z-40">
          <GameButton onPress={onComplete}>SEGUIR</GameButton>
        </div>
      )}
    </SceneFrame>
  );
}
