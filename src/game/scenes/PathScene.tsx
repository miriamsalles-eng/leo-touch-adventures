import { useRef, useState } from "react";
import { FEEDBACK } from "../data/activities";
import { OBJECTS, UI } from "../assets";
import { DraggableLeo } from "../components/DraggableLeo";
import { SceneFrame } from "../components/SceneFrame";
import { SkillIntro } from "../components/SkillIntro";
import { SpeechBubble } from "../components/SpeechBubble";
import { FeedbackPopup, useFeedback } from "../components/FeedbackPopup";
import { useNarration } from "../hooks/useNarration";
import { useAudio } from "../hooks/useAudio";

export type Point = { x: number; y: number };

export type PathSceneProps = {
  background: string;
  /** Waypoints of the walkable corridor (drawn as a wide organic trail). */
  points: Point[];
  /** Corridor width in stage px — the tolerance of the activity. */
  corridorWidth: number;
  leoSize: number;
  goalImage?: string | undefined;
  hint: string;
  /** Short one-time sentence naming what this trail practises. */
  intro?: string | undefined;
  /** Tiny skill tag shown above the intro sentence ("Praticando: arrastar"). */
  introLabel?: string | undefined;
  /** Leo lines said before the trail starts (story reason to walk it). */
  prelude?: string[] | undefined;
  /** Leo lines said after arriving, bridging to the next activity. */
  outro?: string[] | undefined;
  successText: string;
  onComplete: () => void;
  progress: { total: number; current: number };
};

function distToSegment(p: Point, a: Point, b: Point) {
  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const len2 = vx * vx + vy * vy || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.y - a.y) * vy) / len2));
  return Math.hypot(p.x - (a.x + t * vx), p.y - (a.y + t * vy));
}

function distToPath(p: Point, pts: Point[]) {
  let best = Infinity;
  for (let i = 0; i < pts.length - 1; i++) best = Math.min(best, distToSegment(p, pts[i]!, pts[i + 1]!));
  return best;
}

/**
 * Shared engine for the "walk Leo along a wide path" activities.
 * Leaving the corridor is never a failure: Leo simply hops back to the last
 * safe point and the activity continues.
 */
export function PathScene({
  background,
  points,
  corridorWidth,
  leoSize,
  goalImage = OBJECTS.cheese,
  hint,
  intro,
  introLabel,
  prelude = [],
  outro = [],
  successText,
  onComplete,
  progress,
}: PathSceneProps) {
  const start = points[0]!;
  const goal = points[points.length - 1]!;
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(prelude.length === 0);
  const safe = useRef<Point>(start);
  const { feedback, show } = useFeedback();
  const { play } = useAudio();
  const preludeLine = useNarration(prelude, !ready, () => setReady(true));
  const outroLine = useNarration(outro, done, onComplete);

  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <SceneFrame background={background} progress={progress}>
      {intro && ready && <SkillIntro steps={[{ label: introLabel, text: intro, icon: UI.gestureDrag }]} />}
      <svg className="pointer-events-none absolute inset-0" width={1280} height={720} aria-hidden="true">
        <path
          d={d}
          fill="none"
          stroke="rgba(255,252,235,0.55)"
          strokeWidth={corridorWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={d}
          fill="none"
          stroke="rgba(255,255,255,0.75)"
          strokeWidth={corridorWidth - 26}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 34"
        />
      </svg>

      <img
        src={goalImage}
        alt=""
        className="pointer-events-none absolute h-[150px] w-[150px]"
        style={{ left: goal.x, top: goal.y, transform: "translate(-50%, -50%)" }}
      />

      <DraggableLeo
        start={start}
        size={leoSize}
        state={done ? "celebrating" : "neutral"}
        disabled={done || !ready}
        onPickup={() => play("pick")}
        onMove={(p, _z, setPos) => {
          if (done) return;
          if (distToPath(p, points) <= corridorWidth / 2) {
            safe.current = p;
            if (Math.hypot(p.x - goal.x, p.y - goal.y) < 70) {
              setDone(true);
              play("success");
            }
          } else {
            setPos(safe.current);
            show(FEEDBACK.keepOnPath, "gentle", 1200);
          }
        }}
        onDrop={() => (done ? "stay" : { x: safe.current.x, y: safe.current.y })}
      />

      <SpeechBubble
        text={preludeLine ?? outroLine ?? (done ? successText : hint)}
        anchorX={start.x}
        anchorY={Math.max(start.y - leoSize, 150)}
        anchorWidth={leoSize}
        side="above"
        width={340}
        tone={done ? "cheer" : "normal"}
      />

      <FeedbackPopup message={feedback} />
    </SceneFrame>
  );
}
