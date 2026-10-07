import React from "react";
import { useCurrentFrame } from "remotion";
import { BRAND_DATA } from "../config/brand";
import { COPY } from "../config/copy";
import { EASE, mix, prog, riseIn, tween } from "../lib/anim";
import { sampledPath } from "../lib/path";
import { Absolute, Display, Kicker, MaskReveal } from "../components/ui";

const C = BRAND_DATA.colors;
const RULE_Y = 640;
const RULE_W = 520;

/** Deterministic "market-like" wiggle (sum of sines) — decorative only. */
const wiggle = (t: number) =>
  Math.sin(t * 9.1) * 0.45 + Math.sin(t * 23.7 + 1.3) * 0.25 + Math.sin(t * 51.3 + 0.4) * 0.12 + (0.5 - t) * 0.6;

export const S01Opening: React.FC = () => {
  const frame = useCurrentFrame();

  // Line draw → flatten → contract into the title rule.
  const draw = prog(frame, 6, 52, EASE.inOut);
  const settle = prog(frame, 50, 30, EASE.inOut);
  const amp = mix(90, 0, settle);
  const x0 = mix(0, 960 - RULE_W / 2, settle);
  const x1 = mix(1920, 960 + RULE_W / 2, settle);
  const d = sampledPath((t) => {
    const tt = t * draw;
    return { x: mix(x0, x1, tt), y: RULE_Y + wiggle(tt) * amp };
  });
  const headT = draw;
  const head = { x: mix(x0, x1, headT), y: RULE_Y + wiggle(headT) * amp };
  const headOpacity = 1 - prog(frame, 64, 14);

  const drift = tween(frame, 0, 140, 0, 1, (t) => t);

  return (
    <Absolute>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="glow" filterUnits="userSpaceOnUse" x={0} y={0} width={1920} height={1080}>
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={d} fill="none" stroke={C.blueOnDark} strokeWidth={3} strokeLinecap="round" filter="url(#glow)" />
        <circle cx={head.x} cy={head.y} r={7} fill={C.white} opacity={headOpacity * (draw > 0 ? 1 : 0)} filter="url(#glow)" />
      </svg>

      {/* Title block — layered parallax: each line drifts at its own rate */}
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ ...riseIn(frame, 40, 26, 16), transform: `translateX(${drift * -6}px) ${riseIn(frame, 40, 26, 16).transform}` }}>
          <Kicker size={26} color={C.softGrey} style={{ letterSpacing: "0.42em" }}>
            {COPY.opening.kicker}
          </Kicker>
        </div>
        <MaskReveal frame={frame} start={50} dur={30} style={{ marginTop: 22, display: "flex", justifyContent: "center" }}>
          <div style={{ transform: `translateX(${drift * 4}px)` }}>
            <Display size={210} weight={800} stretch={72} style={{ letterSpacing: "-0.015em" }}>
              {COPY.opening.title}
            </Display>
          </div>
        </MaskReveal>
      </div>

      <div style={{ position: "absolute", top: RULE_Y + 30, left: 0, right: 0, textAlign: "center" }}>
        <MaskReveal frame={frame} start={66} dur={28} style={{ display: "flex", justifyContent: "center" }}>
          <Display size={58} weight={600} stretch={82} color={C.white} style={{ letterSpacing: "0.06em" }}>
            {COPY.opening.subtitle}
          </Display>
        </MaskReveal>
        <div style={{ marginTop: 34, ...riseIn(frame, 80, 24, 12) }}>
          <Kicker size={22} color={C.greenOnDark} style={{ letterSpacing: "0.34em" }}>
            {COPY.opening.months}
          </Kicker>
        </div>
      </div>
    </Absolute>
  );
};
