import { useEffect, useRef, useState } from "react";
import { ACTIVITIES, FEEDBACK } from "../data/activities";
import { OBJECTS, UI } from "../assets";
import { Character } from "../components/Character";
import { DragItem } from "../components/DragItem";
import { DropZone } from "../components/DropZone";
import { RoundBadge } from "../components/RoundBadge";
import { SceneFrame } from "../components/SceneFrame";
import { SkillIntro } from "../components/SkillIntro";
import { SpeechBubble } from "../components/SpeechBubble";
import { FeedbackPopup, useFeedback } from "../components/FeedbackPopup";
import { useNarration } from "../hooks/useNarration";
import { useInstructionSpeech } from "../hooks/useInstructionSpeech";
import { useAudio } from "../hooks/useAudio";

const A = ACTIVITIES[9]!;
const SIZE = A.params!["itemSize"] as number;
const PADDING = A.params!["zonePadding"] as number;

const HELLO = ["Vamos guardar as fotos do passeio?"];
const OUTRO = ["Tudo organizado!", "Agora vamos fazer um piquenique?"];

type Phase = "mute" | "unmute" | "file" | "done";

/**
 * Activity 9 — real digital behaviours: turn the sound off, turn it back on
 * and then drag a picture file into a folder.
 */
export function S10Computer({ onComplete, progress }: { onComplete: () => void; progress: { total: number; current: number } }) {
  const folder = { x: 800, y: 380 };
  const [phase, setPhase] = useState<Phase>("mute");
  const [over, setOver] = useState(false);
  const { feedback, show, isBusy } = useFeedback();
  const { play, muted } = useAudio();
  const prevMuted = useRef(muted);
  const [greeted, setGreeted] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [fileIntroDone, setFileIntroDone] = useState(false);
  const hello = useNarration(HELLO, !greeted, () => setGreeted(true));
  const outro = useNarration(OUTRO, phase === "done", onComplete);

  /* The sound button in the frame is the actual control for rounds 1 and 2. */
  useEffect(() => {
    if (prevMuted.current === muted) return;
    prevMuted.current = muted;
    if (phase === "mute" && muted) {
      /* The voice is off now: this feedback is mostly visual, but it still
         respects the minimum reading time before the next step. */
      show("Você desligou o som.", "success", undefined, () => setPhase("unmute"));
    } else if (phase === "unmute" && !muted) {
      play("success");
      show("O som está ligado novamente.", "success", undefined, () => setPhase("file"));
    }
  }, [muted, phase, show, play]);

  const bubble =
    hello ??
    outro ??
    (phase === "mute"
      ? "O som está ligado. Clique para desligar."
      : phase === "unmute"
        ? "Agora ligue o som novamente!"
        : phase === "file"
        ? "Leve a imagem para a pasta!"
        : "Tudo organizado!");

  /* Each step speaks its own instruction, once, after the banner ended. */
  useInstructionSpeech(
    phase === "mute" ? "O som está ligado. Clique para desligar." : phase === "unmute" ? "Agora ligue o som novamente!" : null,
    greeted && introDone && !isBusy,
    phase,
  );
  useInstructionSpeech("Leve a imagem para a pasta!", phase === "file" && fileIntroDone && !isBusy, "file");

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

      {greeted && (phase === "mute" || phase === "unmute") && (
        <SkillIntro
          steps={[{ label: "Aprendendo: controlar o som", text: "Vamos aprender a controlar o som!", icon: UI.soundOn }]}
          onComplete={() => setIntroDone(true)}
        />
      )}
      {phase === "file" && (
        <SkillIntro
          steps={[{ label: "Usando o que aprendemos", text: "Vamos usar o que aprendemos!", icon: UI.gestureDrag }]}
          onComplete={() => setFileIntroDone(true)}
        />
      )}
      <RoundBadge current={roundIndex} total={3} x={200} y={40} />
      <FeedbackPopup message={feedback} />
    </SceneFrame>
  );
}
