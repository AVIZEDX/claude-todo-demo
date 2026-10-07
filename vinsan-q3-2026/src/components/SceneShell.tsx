import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TRANSITION_FRAMES } from "../config/timeline";
import { EASE, tween } from "../lib/anim";

/**
 * Wraps a scene with the shared page-to-page transition:
 *  - dissolve in over TRANSITION_FRAMES
 *  - very slow controlled push-in (≤ 2 %)
 *  - dissolve out (with a touch of blur) while the next scene dissolves in
 *
 * `duration` is the scene's own length; the Sequence around it is
 * TRANSITION_FRAMES longer so the exit overlaps the next scene's entry.
 */
export const SceneShell: React.FC<{
  duration: number;
  children: React.ReactNode;
  enter?: boolean;
  exit?: boolean;
  push?: number;
}> = ({ duration, children, enter = true, exit = true, push = 0.02 }) => {
  const frame = useCurrentFrame();
  const inP = enter ? tween(frame, 0, TRANSITION_FRAMES, 0, 1, EASE.inOut) : 1;
  const outP = exit ? tween(frame, duration - 2, duration + Math.round(TRANSITION_FRAMES * 0.6), 0, 1, EASE.out) : 0;
  const scale = 1 + tween(frame, 0, duration + TRANSITION_FRAMES, 0, push, (t) => t);

  return (
    <AbsoluteFill
      style={{
        opacity: inP * (1 - outP),
        transform: `scale(${scale})`,
        filter: outP > 0 ? `blur(${outP * 6}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
