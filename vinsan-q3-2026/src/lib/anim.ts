import { Easing, interpolate } from "remotion";

/** Signature easing curves — calm, "expensive" deceleration. */
export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // expo-ish out
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  soft: Easing.bezier(0.33, 1, 0.68, 1),
};

/** Clamped interpolate with easing: tween(frame, 10, 40, 0, 1) */
export const tween = (
  frame: number,
  start: number,
  end: number,
  from = 0,
  to = 1,
  easing: (t: number) => number = EASE.out,
) =>
  interpolate(frame, [start, end], [from, to], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** 0→1 progress between two frames */
export const prog = (frame: number, start: number, dur: number, easing = EASE.out) =>
  tween(frame, start, start + dur, 0, 1, easing);

/** Standard "rise in" style: opacity + translateY + slight blur (restrained motion blur). */
export const riseIn = (frame: number, start: number, dur = 24, distance = 28) => {
  const p = prog(frame, start, dur);
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * distance}px)`,
    filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined,
  } as const;
};

/** Fade/lift out */
export const fadeOut = (frame: number, start: number, dur = 16, distance = -16) => {
  const p = prog(frame, start, dur, EASE.in);
  return {
    opacity: 1 - p,
    transform: `translateY(${p * distance}px)`,
    filter: p > 0 ? `blur(${p * 5}px)` : undefined,
  } as const;
};

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
