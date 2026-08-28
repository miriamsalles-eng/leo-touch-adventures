import { useEffect, useRef, useState } from "react";
import { ACTIVITIES, FEEDBACK } from "../data/activities";
import { OBJECTS, UI } from "../assets";
import { Character } from "../components/Character";
import { DragItem } from "../components/DragItem";
import { DropZone } from "../components/DropZone";
import { GameButton } from "../components/GameButton";
import { RoundBadge } from "../components/RoundBadge";
import { SceneFrame } from "../components/SceneFrame";
import { SkillIntro } from "../components/SkillIntro";
import { SpeechBubble } from "../components/SpeechBubble";
import { FeedbackPopup, useFeedback } from "../components/FeedbackPopup";
import { useAudio } from "../hooks/useAudio";

const A = ACTIVITIES[9]!;
const SIZE = A.params!["itemSize"] as number;
const PADDING = A.params!["zonePadding"] as number;

type Phase = "mute" | "unmute" | "file" | "done";

/**
 * Activity 9 — real digital behaviours: turn the sound off, turn it back on
 * and then drag a picture file into a folder.
 */
export function S10Computer({ onComplete, progress }: { onComplete: () => void; progress: { total: number; current: number } }) {
  const folder = { x: 800, y: 380 };
  const [phase, setPhase] = useState<Phase>("mute");
  const [over, setOver] = useState(false);
  const { feedback, show } = useFeedback();
  const { play, muted } = useAudio();
  const prevMuted = useRef(muted);

  /* The sound button in the frame is the actual control for rounds 1 and 2. */
  useEffect(() => {
    if (prevMuted.current === muted) return;
    prevMuted.current = muted;
    if (phase === "mute" && muted) {
      show("Isso! Você desligou o som.", "success", 1500);
      setPhase("unmute");
    } else if (phase === "unmute" && !muted) {
      show("Muito bem! Você ligou o som.", "success", 1500);
      play("success");
      setPhase("file");
    }
  }, [muted, phase, show, play]);

  const bubble =
    phase === "mute"
      ? "O som está ligado. Clique para desligar."
      : phase === "unmute"
        ? "Agora ligue o som novamente!"
        : phase === "file"
          ? "Leve a imagem para a pasta!"
          : "Muito bem! Tudo organizado!";

  const roundIndex = phase === "mute" ? 0 : phase === "unmute" ? 1 : phase === "file" ? 2 : 3;

  return (
    <SceneFrame
      gradient="linear-gradient(160deg, var(--desk-1), var(--desk-2) 55%, var(--desk-3))"
      progress={progress}
      highlightAudio={phase === "mute" || phase === "unmute"}
    >
      <div className="pointer-events-none absolute inset-x-[70px] top-[70px] h-[560px] rounded-[44px] border-[10px] border-card bg-white/45" />

      {(phase === "file" || phase === "done") && (
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
          enabled={phase === "file"}
          showTarget={phase === "file"}
        />
      )}

      {phase === "done" && (
        <img
          src={OBJECTS.imagefile}
          alt=""
          className="pointer-events-none absolute h-[86px] w-[86px] animate-pop-in"
          style={{ left: folder.x, top: folder.y + 20, transform: "translate(-50%, -50%)" }}
        />
      )}

      <Character state={phase === "done" ? "happy" : "laptop"} x={1105} y={620} height={215} bob={phase === "done"} />
      <SpeechBubble
        text={bubble}
        anchorX={1105}
        anchorY={400}
        anchorWidth={200}
        side="above"
        width={300}
        tone={phase === "done" ? "cheer" : "normal"}
      />

      {phase === "file" && (
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
              setPhase("done");
              play("success");
              return "stay";
            }
            show(FEEDBACK.holding, "gentle");
            return "return";
          }}
        />
      )}

      {(phase === "mute" || phase === "unmute") && (
        <SkillIntro steps={[{ text: "Agora vamos aprender a controlar o som!", icon: UI.soundOn }]} />
      )}
      {phase === "file" && (
        <SkillIntro steps={[{ text: "Vamos usar o que aprendemos no computador!", icon: UI.gestureDrag }]} />
      )}
      <RoundBadge current={roundIndex} total={3} x={200} y={40} />
      <FeedbackPopup message={feedback} />
      {phase === "done" && (
        <div className="absolute right-8 top-[618px] z-40">
          <GameButton onPress={onComplete}>SEGUIR</GameButton>
        </div>
      )}
    </SceneFrame>
  );
}
