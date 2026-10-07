import React from "react";
import { useCurrentFrame } from "remotion";
import { BRAND_DATA } from "../config/brand";
import { COPY } from "../config/copy";
import { latest, MARKET_DATA, SIP_DATA } from "../config/data";
import { EASE, fadeOut, mix, prog, riseIn } from "../lib/anim";
import { countTo, fmtNum, fmtPct } from "../lib/format";
import { monotoneFn } from "../lib/path";
import { rebasedMonthEndPath } from "../lib/series";
import { Absolute, Body, Display, Kicker, MaskReveal } from "../components/ui";

const C = BRAND_DATA.colors;
const SWITCH = 72; // focus moves from markets → participation

const PANEL_TOP = 360;
const PANEL_H = 540;
const PANEL_W = 790;

export const S07Contrast: React.FC = () => {
  const frame = useCurrentFrame();
  const nifty = MARKET_DATA.nifty;
  const sip = latest(SIP_DATA.monthly);

  const focus = prog(frame, SWITCH, 24, EASE.inOut); // 0 = left emphasised, 1 = right
  const leftDim = mix(1, 0.42, focus);
  const rightOpacity = mix(0.55, 1, focus);

  // Mini sparkline for markets: same rebased Nifty path as the main chart.
  const path = rebasedMonthEndPath(nifty, "nifty");
  const sx = (i: number) => 60 + (i / 3) * 360;
  const sy = (v: number) => 70 - v * 9;
  const f = monotoneFn(path.map((v, i) => ({ x: sx(i), y: sy(v) })));
  const draw = prog(frame, 14, 40, EASE.inOut);
  let spark = "";
  for (let i = 0; i <= 80; i++) {
    const x = mix(sx(0), mix(sx(0), sx(3), draw), i / 80);
    spark += `${i ? "L" : "M"}${x.toFixed(1)},${f(x).toFixed(1)}`;
  }

  return (
    <Absolute>
      {/* Headline swap */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center" }}>
        <div style={{ position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center", ...(frame >= SWITCH ? fadeOut(frame, SWITCH - 4, 14, -24) : {}) }}>
          <MaskReveal frame={frame} start={4} dur={26}>
            <Display size={92} weight={700} stretch={78}>
              {COPY.contrast.headlineA}
            </Display>
          </MaskReveal>
        </div>
        {frame >= SWITCH && (
          <div style={{ position: "absolute", left: 0, right: 0, top: -20 }}>
            {COPY.contrast.headlineB.map((l, i) => (
              <MaskReveal key={l} frame={frame} start={SWITCH + 6 + i * 7} dur={26} style={{ display: "flex", justifyContent: "center" }}>
                <Display size={76} weight={700} stretch={78} color={i === 1 ? C.greenOnDark : C.white} style={{ lineHeight: 1.05 }}>
                  {l}
                </Display>
              </MaskReveal>
            ))}
          </div>
        )}
      </div>

      {/* LEFT — markets */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: PANEL_TOP,
          width: PANEL_W,
          height: PANEL_H,
          background: "linear-gradient(180deg, rgba(217,112,95,0.07) 0%, rgba(217,112,95,0) 80%)",
          borderTop: `2px solid ${C.negative}`,
          opacity: leftDim * prog(frame, 6, 20),
          transform: `translateX(${(1 - prog(frame, 6, 26)) * -40}px)`,
        }}
      >
        <div style={{ padding: "44px 56px" }}>
          <Kicker size={24} color={C.white}>
            {COPY.contrast.leftLabel}
          </Kicker>
          <Display size={180} weight={700} stretch={74} color={C.negative} style={{ marginTop: 26 }}>
            {fmtPct(nifty.q3PriceReturn, countTo(nifty.q3PriceReturn.value, prog(frame, 12, 34), 2))}
          </Display>
          <Body size={24} style={{ marginTop: 18 }}>
            {COPY.contrast.leftSub}
          </Body>
        </div>
        <svg width={480} height={150} style={{ position: "absolute", right: 30, bottom: 30 }}>
          <path d={spark} fill="none" stroke={C.negative} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
        </svg>
      </div>

      {/* RIGHT — participation */}
      <div
        style={{
          position: "absolute",
          left: 1010,
          top: PANEL_TOP,
          width: PANEL_W,
          height: PANEL_H,
          background: "linear-gradient(180deg, rgba(93,187,99,0.08) 0%, rgba(93,187,99,0) 80%)",
          borderTop: `2px solid ${C.greenOnDark}`,
          opacity: rightOpacity * prog(frame, 6, 20),
          transform: `translateX(${(1 - prog(frame, 6, 26)) * 40}px)`,
        }}
      >
        <div style={{ padding: "44px 56px" }}>
          <Kicker size={24} color={C.white}>
            {COPY.contrast.rightLabel}
          </Kicker>
          <Display size={180} weight={700} stretch={74} color={C.greenOnDark} style={{ marginTop: 26 }}>
            ₹{fmtNum(countTo(sip.value, prog(frame, 12, 34), 0))}
            <span style={{ fontSize: "0.42em", fontWeight: 600, marginLeft: "0.18em", color: C.softGrey }}>Cr</span>
          </Display>
          <Body size={24} style={{ marginTop: 18 }}>
            {COPY.contrast.rightSub(`${sip.month.charAt(0)}${sip.month.slice(1).toLowerCase()} ${sip.year}`)}
          </Body>
        </div>
      </div>
    </Absolute>
  );
};
