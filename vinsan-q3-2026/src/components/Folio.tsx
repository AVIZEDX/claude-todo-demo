import React from "react";
import { useCurrentFrame } from "remotion";
import { BRAND_DATA } from "../config/brand";
import { COPY } from "../config/copy";
import { sceneStart, TIMELINE, TRANSITION_FRAMES } from "../config/timeline";
import { EASE, tween } from "../lib/anim";

const C = BRAND_DATA.colors;
const F = BRAND_DATA.fonts;

/**
 * Magazine-style running folio (top edge) shown on the data scenes:
 * publication name on the left, page counter + progress hairline on the right.
 */
export const Folio: React.FC = () => {
  const frame = useCurrentFrame();
  const start = sceneStart("quarterView");
  const end = sceneStart("finalMessage");
  const opacity =
    tween(frame, start, start + TRANSITION_FRAMES + 10, 0, 1, EASE.inOut) *
    (1 - tween(frame, end - 4, end + TRANSITION_FRAMES, 0, 1, EASE.inOut));
  if (opacity <= 0) return null;

  const idx = Math.max(0, TIMELINE.findIndex((s, i) => frame >= s.from && (i === TIMELINE.length - 1 || frame < TIMELINE[i + 1].from)));
  const page = String(idx + 1).padStart(2, "0");
  const total = String(TIMELINE.length).padStart(2, "0");
  const progress = (frame - start) / (end - start);

  const text: React.CSSProperties = {
    fontFamily: F.text,
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: "0.24em",
    color: C.softGrey,
  };

  return (
    <div style={{ position: "absolute", left: 120, right: 120, top: 56, opacity }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={text}>
          {COPY.opening.kicker}
          <span style={{ color: C.blueOnDark, margin: "0 14px" }}>/</span>
          {COPY.opening.title}
        </div>
        <div style={{ ...text, fontVariantNumeric: "tabular-nums" }}>
          <span style={{ color: C.white }}>{page}</span>
          <span style={{ margin: "0 8px" }}>—</span>
          {total}
        </div>
      </div>
      <div style={{ marginTop: 18, height: 1, background: C.hairline, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: 1,
            width: `${Math.min(1, Math.max(0, progress)) * 100}%`,
            background: C.blueOnDark,
            opacity: 0.8,
          }}
        />
      </div>
    </div>
  );
};
