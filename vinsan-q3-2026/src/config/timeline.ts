/**
 * Scene durations (seconds). Edit freely — total length, scene start times,
 * and the soundtrack cue points are all derived from this list.
 * Keep the total between 30 and 50 seconds (checked by `npm run qa`).
 */
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** Cross-dissolve overlap between consecutive scenes (frames). */
export const TRANSITION_FRAMES = 14;

export const SCENES = [
  { id: "opening", seconds: 4 },
  { id: "quarterView", seconds: 5 },
  { id: "marketPerformance", seconds: 7 },
  { id: "monthlyMovement", seconds: 5 },
  { id: "participation", seconds: 7 },
  { id: "mfIndustry", seconds: 5.5 },
  { id: "contrast", seconds: 5 },
  { id: "finalMessage", seconds: 6.5 },
] as const;

export type SceneId = (typeof SCENES)[number]["id"];

export type SceneTiming = { id: SceneId; from: number; duration: number };

export const TIMELINE: SceneTiming[] = (() => {
  let cursor = 0;
  return SCENES.map((s) => {
    const duration = Math.round(s.seconds * FPS);
    const t = { id: s.id, from: cursor, duration };
    cursor += duration;
    return t;
  });
})();

export const TOTAL_FRAMES = TIMELINE.reduce((a, s) => a + s.duration, 0);

export const sceneStart = (id: SceneId) => TIMELINE.find((s) => s.id === id)!.from;
