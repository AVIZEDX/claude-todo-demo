import React from "react";
import { useCurrentFrame } from "remotion";
import { BRAND_DATA } from "../config/brand";
import { COPY } from "../config/copy";
import { MARKET_DATA } from "../config/data";
import { EASE, prog, riseIn } from "../lib/anim";
import { countTo, fmtPct } from "../lib/format";
import { Absolute, Display, Footnote, Kicker, MaskReveal } from "../components/ui";

const C = BRAND_DATA.colors;

const BASE_Y = 575; // zero line
const PX_PER_PCT = 40; // one shared scale → bars are directly comparable
const COL_CENTERS = [420, 960, 1500];
const BAR_W = 150;
const MOOD_COLORS = [C.greenOnDark, C.blueOnDark, C.negative];

/** Per-month motion character: rise / settle / sharp drop. */
const MOTION = [
  { start: 22, dur: 34, ease: EASE.out },
  { start: 52, dur: 40, ease: EASE.inOut },
  { start: 82, dur: 22, ease: EASE.in },
];

export const S04MonthlyMovement: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Absolute>
      <div style={{ position: "absolute", left: 0, right: 0, top: 136, display: "flex", justifyContent: "center" }}>
        <MaskReveal frame={frame} start={2} dur={26}>
          <Display size={84} weight={700} stretch={78} style={{ letterSpacing: "0.01em" }}>
            {COPY.monthlyMovement.headline}
          </Display>
        </MaskReveal>
      </div>

      {/* zero baseline */}
      <div
        style={{
          position: "absolute",
          left: 200,
          top: BASE_Y,
          height: 1,
          width: 1520 * prog(frame, 8, 30, EASE.inOut),
          background: C.hairlineStrong,
        }}
      />

      {MARKET_DATA.monthly.map((m, i) => {
        const mo = MOTION[i];
        const p = prog(frame, mo.start, mo.dur, mo.ease);
        const v = m.nifty.value;
        const h = Math.abs(v) * PX_PER_PCT * p;
        const up = v >= 0;
        const color = up ? C.greenOnDark : C.negative;
        const cx = COL_CENTERS[i];
        const label = fmtPct(m.nifty, countTo(v, p, m.nifty.decimals));
        // August "rotation": the mood word turns in on its X axis
        const flip = i === 1 ? (1 - prog(frame, mo.start - 6, 30, EASE.out)) * 90 : 0;

        return (
          <React.Fragment key={m.month}>
            <div style={{ position: "absolute", left: cx - 220, width: 440, top: 262, textAlign: "center", ...riseIn(frame, mo.start - 10, 22, 12) }}>
              <Kicker size={26} color={C.white}>
                {m.month}
              </Kicker>
              <div style={{ perspective: 600, marginTop: 10 }}>
                <div style={{ transform: `rotateX(${flip}deg)`, transformOrigin: "50% 50%" }}>
                  <Kicker size={20} color={MOOD_COLORS[i]} style={{ letterSpacing: "0.3em" }}>
                    {m.mood}
                  </Kicker>
                </div>
              </div>
            </div>

            {/* bar */}
            <div
              style={{
                position: "absolute",
                left: cx - BAR_W / 2,
                width: BAR_W,
                top: up ? BASE_Y - h : BASE_Y + 1,
                height: h,
                background: up
                  ? `linear-gradient(0deg, ${color}33 0%, ${color} 100%)`
                  : `linear-gradient(180deg, ${color}33 0%, ${color} 100%)`,
                boxShadow: `0 0 30px ${color}22`,
              }}
            />

            {/* value */}
            <div
              style={{
                position: "absolute",
                left: cx - 220,
                width: 440,
                textAlign: "center",
                top: up ? BASE_Y - h - 108 : BASE_Y + h + 18,
                opacity: prog(frame, mo.start, 10),
              }}
            >
              <Display size={88} weight={700} stretch={80} color={color} style={{ display: "inline-block" }}>
                {label}
              </Display>
            </div>
          </React.Fragment>
        );
      })}

      <Footnote opacity={prog(frame, 96, 20)}>{COPY.monthlyMovement.footer}</Footnote>
    </Absolute>
  );
};
