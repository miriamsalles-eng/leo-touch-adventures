import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";

/** Fixed 16:9 design space. Every scene uses these coordinates. */
export const STAGE_W = 1280;
export const STAGE_H = 720;

type StageCtx = {
  scale: number;
  stageRef: RefObject<HTMLDivElement | null>;
  /** Converts a client (screen) point into stage coordinates. */
  toStage: (clientX: number, clientY: number) => { x: number; y: number };
};

const Ctx = createContext<StageCtx | null>(null);

export function useStage() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStage must be used inside <Stage>");
  return ctx;
}

export function Stage({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const outerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const compute = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      setScale(Math.min(width / STAGE_W, height / STAGE_H));
    };
    compute();
    // ResizeObserver also catches iframe/container resizes that never fire
    // a window resize event.
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener("resize", compute);
    window.addEventListener("orientationchange", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
      window.removeEventListener("orientationchange", compute);
    };
  }, []);


  const toStage = useCallback((clientX: number, clientY: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: ((clientX - rect.left) / rect.width) * STAGE_W,
      y: ((clientY - rect.top) / rect.height) * STAGE_H,
    };
  }, []);

  return (
    <Ctx.Provider value={{ scale, stageRef, toStage }}>
      <div
        ref={outerRef}
        className="fixed inset-0 flex items-center justify-center overflow-hidden bg-[var(--letterbox)]"
      >
        <div
          ref={stageRef}
          className="relative overflow-hidden rounded-[var(--stage-radius)] bg-background shadow-[var(--shadow-stage)]"
          style={{
            width: STAGE_W,
            height: STAGE_H,
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            touchAction: "none",
          }}
        >
          {children}
        </div>
      </div>
    </Ctx.Provider>
  );
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
