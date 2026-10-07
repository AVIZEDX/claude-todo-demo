import React from "react";
import { useCurrentFrame } from "remotion";
import { BRAND_DATA } from "../config/brand";
import { COPY } from "../config/copy";
import { MARKET_DATA } from "../config/data";
import { EASE, prog, riseIn, tween } from "../lib/anim";
import { sampledPath } from "../lib/path";
import { Absolute, Display, Footnote, Kicker, MaskReveal } from "../components/ui";

const C = BRAND_DATA.colors;
const L = 120;
const R = 1800;
const COL_W = (R - L) / 3;
const ACCENTS = [C.greenOnDark, C.blueOnDark, C.negative];

const smooth = (s: number) => s * s * (3 - 2 * s);

/**
 * Illustrative mood line (NOT data): rises through July, moves sideways
 * through August, drops through September.
 */
const moodY = (t: number) => {
  if (t <= 1 / 3) {
    const s = t * 3;
    return 830 - 230 * smooth(s) + Math.sin(s * 14) * 10 * (1 - s);
  }
  if (t <= 2 / 3) {
    const s = (t - 1 / 3) * 3;
    return 600 + 28 * Math.sin(s * Math.PI * 3);
  }
  const s = (t - 2 / 3) * 3;
  return 600 + 290 * s * s + Math.sin(s * 34) * 26 * Math.sin(s * Math.PI);
};

export const S02QuarterView: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = tween(frame, 16, 112, 0, 1, EASE.inOut);
  const d = sampledPath((t) => {
    const tt = t * draw;
    return { x: L + (R - L) * tt, y: moodY(tt) };
  }, 240);
  const head = { x: L + (R - L) * draw, y: moodY(draw) };
  const activeCol = Math.min(2, Math.floor(draw * 3 - 1e-6));

  return (
    <Absolute>
      <div style={{ position: "absolute", left: L, top: 150, ...riseIn(frame, 4, 22, 10) }}>
        <Kicker color={C.softGrey}>{COPY.quarterView.kicker}</Kicker>
      </div>

      {MARKET_DATA.monthly.map((m, i) => {
        const start = 10 + i * 30;
        const x = L + i * COL_W;
        const isActive = draw > 0 && activeCol === i;
        const glow = isActive ? 1 : 0.0;
        return (
          <div key={m.month} style={{ position: "absolute", left: x, top: 210, width: COL_W, height: 740 }}>
            {/* column panel */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(180deg, rgba(77,143,224,${0.07 * glow}) 0%, rgba(77,143,224,0) 70%)`,
                opacity: prog(frame, start, 20),
              }}
            />
            {/* divider */}
            {i > 0 && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 1,
                  height: 740 * prog(frame, start - 4, 34, EASE.inOut),
                  background: C.hairlineStrong,
                }}
              />
            )}
            <div style={{ position: "absolute", left: i === 0 ? 0 : 48, top: 48 }}>
              <div style={riseIn(frame, start, 22, 12)}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 28, height: 3, background: ACCENTS[i] }} />
                  <Kicker size={24} color={C.white}>
                    {m.month}
                  </Kicker>
                </div>
              </div>
              <MaskReveal frame={frame} start={start + 6} dur={28} style={{ marginTop: 22 }}>
                <Display size={104} weight={700} stretch={74}>
                  {m.mood}
                </Display>
              </MaskReveal>
            </div>
          </div>
        );
      })}

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="moodStroke" x1={L} x2={R} y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={C.greenOnDark} />
            <stop offset="45%" stopColor={C.blueOnDark} />
            <stop offset="70%" stopColor={C.blueOnDark} />
            <stop offset="100%" stopColor={C.negative} />
          </linearGradient>
          <filter id="glow2" x="-10%" y="-30%" width="120%" height="160%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={d} fill="none" stroke="url(#moodStroke)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" filter="url(#glow2)" />
        {draw > 0 && draw < 1 && <circle cx={head.x} cy={head.y} r={7} fill={C.white} filter="url(#glow2)" />}
        {draw >= 1 && <circle cx={head.x} cy={head.y} r={7} fill={C.negative} />}
      </svg>

      <Footnote opacity={prog(frame, 60, 20)}>{COPY.quarterView.caption}</Footnote>
    </Absolute>
  );
};
