import React from "react";
import { useCurrentFrame } from "remotion";
import { BRAND_DATA } from "../config/brand";
import { COPY } from "../config/copy";
import { MARKET_DATA } from "../config/data";
import { EASE, fadeOut, mix, prog, riseIn, tween } from "../lib/anim";
import { countTo, fmtNum, fmtPct } from "../lib/format";
import { monotoneFn } from "../lib/path";
import { rebasedMonthEndPath } from "../lib/series";
import { Absolute, Body, Display, Footnote, Kicker, MaskReveal } from "../components/ui";

const C = BRAND_DATA.colors;
const F = BRAND_DATA.fonts;
const { nifty, sensex } = MARKET_DATA;

// Plot area
const PX0 = 230;
const PX1 = 1130;
const PY0 = 300; // top
const PY1 = 820; // bottom
const Y_MAX = 4;
const Y_MIN = -7.5;
const GRID = [2.5, 0, -2.5, -5];
const yOf = (pct: number) => PY0 + ((Y_MAX - pct) / (Y_MAX - Y_MIN)) * (PY1 - PY0);
const X_LABELS = ["30 JUN", ...MARKET_DATA.monthly.map((m) => m.monthEnd)];
const xOf = (i: number) => PX0 + (i / (X_LABELS.length - 1)) * (PX1 - PX0);

// Timing (scene-local frames)
const DRAW_START = 18;
const DRAW_END = 98;
const RETURN_IN = 104;
const SWAP = 146; // Nifty → Sensex
const SWAP_DUR = 26;

export const S03MarketPerformance: React.FC = () => {
  const frame = useCurrentFrame();

  const niftyPath = rebasedMonthEndPath(nifty, "nifty");
  const sensexPath = rebasedMonthEndPath(sensex, "sensex");
  const morph = prog(frame, SWAP, SWAP_DUR, EASE.inOut);
  const values = niftyPath.map((v, i) => mix(v, sensexPath[i], morph));
  const pts = values.map((v, i) => ({ x: xOf(i), y: yOf(v) }));
  const yFn = monotoneFn(pts);

  const draw = tween(frame, DRAW_START, DRAW_END, 0, 1, EASE.inOut);
  const headX = mix(PX0, PX1, draw);
  let line = "";
  const N = 220;
  for (let i = 0; i <= N; i++) {
    const x = mix(PX0, headX, i / N);
    line += `${i ? "L" : "M"}${x.toFixed(2)},${yFn(x).toFixed(2)}`;
  }
  const area = `${line}L${headX.toFixed(2)},${PY1}L${PX0},${PY1}Z`;

  const isSensex = frame >= SWAP + SWAP_DUR / 2;
  const idx = isSensex ? sensex : nifty;
  // label crossfade around the swap
  const labelOpacity = 1 - prog(frame, SWAP - 4, 12) + prog(frame, SWAP + SWAP_DUR / 2, 14);

  const startLabelIn = prog(frame, DRAW_START - 6, 18);
  const endLabelIn = prog(frame, DRAW_END - 6, 18);

  // Big return figure
  const niftyCount = countTo(nifty.q3PriceReturn.value, prog(frame, RETURN_IN, 30, EASE.out), 2);

  return (
    <Absolute>
      {/* Header */}
      <div style={{ position: "absolute", left: 120, top: 140 }}>
        <div style={riseIn(frame, 0, 20, 10)}>
          <Kicker>{COPY.marketPerformance.kicker}</Kicker>
        </div>
        <div style={{ position: "relative", height: 84, marginTop: 14 }}>
          <div style={{ position: "absolute", ...(frame < SWAP + SWAP_DUR / 2 ? fadeOut(frame, SWAP, 12) : { opacity: 0 }) }}>
            <MaskReveal frame={frame} start={4} dur={24}>
              <Display size={76} weight={700} stretch={80}>
                {nifty.name}
              </Display>
            </MaskReveal>
          </div>
          {isSensex && (
            <div style={{ position: "absolute" }}>
              <MaskReveal frame={frame} start={SWAP + SWAP_DUR / 2} dur={22}>
                <Display size={76} weight={700} stretch={80}>
                  {sensex.name}
                </Display>
              </MaskReveal>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="areaFill" x1="0" x2="0" y1={PY0} y2={PY1} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={C.blueOnDark} stopOpacity="0.28" />
            <stop offset="100%" stopColor={C.blueOnDark} stopOpacity="0" />
          </linearGradient>
          <filter id="glow3" x="-10%" y="-30%" width="120%" height="160%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* grid + y labels */}
        {GRID.map((g, i) => {
          const o = prog(frame, 4 + i * 3, 20);
          const y = yOf(g);
          return (
            <g key={g} opacity={o}>
              <line x1={PX0} x2={PX0 + (PX1 - PX0) * o} y1={y} y2={y} stroke={g === 0 ? C.hairlineStrong : C.hairline} strokeWidth={1} strokeDasharray={g === 0 ? undefined : "2 6"} />
              <text x={PX0 - 22} y={y + 7} textAnchor="end" fill={C.midGrey} fontFamily={F.text} fontSize={20} fontWeight={500}>
                {g > 0 ? "+" : g < 0 ? "−" : ""}
                {Math.abs(g)}%
              </text>
            </g>
          );
        })}
        <text x={PX1} y={yOf(GRID[0]) - 16} textAnchor="end" fill={C.midGrey} fontFamily={F.text} fontSize={17} fontWeight={500} opacity={prog(frame, 8, 20)} letterSpacing="0.04em">
          {COPY.marketPerformance.axisLabel}
        </text>

        {/* x labels */}
        {X_LABELS.map((l, i) => (
          <g key={l} opacity={prog(frame, 6 + i * 3, 20)}>
            <line x1={xOf(i)} x2={xOf(i)} y1={PY1} y2={PY1 + 10} stroke={C.hairlineStrong} />
            <text x={xOf(i)} y={PY1 + 42} textAnchor="middle" fill={C.softGrey} fontFamily={F.text} fontSize={20} fontWeight={600} letterSpacing="0.12em">
              {l}
            </text>
          </g>
        ))}
        <line x1={PX0} x2={PX1} y1={PY1} y2={PY1} stroke={C.hairlineStrong} opacity={prog(frame, 4, 20)} />

        {/* series */}
        <path d={area} fill="url(#areaFill)" opacity={draw > 0 ? 1 : 0} />
        <path d={line} fill="none" stroke={C.blueOnDark} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" filter="url(#glow3)" opacity={draw > 0 ? 1 : 0} />

        {/* start point (verified) */}
        <circle cx={pts[0].x} cy={pts[0].y} r={7} fill={C.white} opacity={startLabelIn} />
        {/* head / end point (verified) */}
        {draw > 0 && (
          <circle cx={headX} cy={yFn(headX)} r={draw >= 1 ? 8 : 6} fill={draw >= 1 ? C.negative : C.white} filter="url(#glow3)" />
        )}
      </svg>

      {/* Start label */}
      <div style={{ position: "absolute", left: pts[0].x + 18, top: pts[0].y + 22, opacity: startLabelIn * labelOpacity }}>
        <Kicker size={18} color={C.softGrey}>
          {idx.start.shortDate}
        </Kicker>
        <Display size={44} weight={600} stretch={86} style={{ marginTop: 6 }}>
          {fmtNum(idx.start.level, 2)}
        </Display>
      </div>

      {/* End label */}
      <div
        style={{
          position: "absolute",
          left: pts[3].x - 20,
          top: pts[3].y + 26,
          transform: "translateX(-100%)",
          textAlign: "right",
          opacity: endLabelIn * labelOpacity,
        }}
      >
        <Kicker size={18} color={C.softGrey}>
          {idx.end.shortDate}
        </Kicker>
        <Display size={44} weight={600} stretch={86} style={{ marginTop: 6 }}>
          {fmtNum(idx.end.level, 2)}
        </Display>
      </div>

      {/* Right panel: Q3 return */}
      <div style={{ position: "absolute", left: 1280, top: 360, width: 540 }}>
        <div style={{ position: "absolute", top: 0, ...(frame < SWAP ? riseIn(frame, RETURN_IN, 24, 20) : fadeOut(frame, SWAP, 14, -40)) }}>
          <Kicker size={22} color={C.softGrey}>
            {nifty.name}
          </Kicker>
          <Display size={176} weight={700} stretch={74} color={C.negative} style={{ marginTop: 18 }}>
            {fmtPct(nifty.q3PriceReturn, niftyCount)}
          </Display>
        </div>
        {frame >= SWAP + 6 && (
          <div style={{ position: "absolute", top: 0, ...riseIn(frame, SWAP + 6, 24, 40) }}>
            <Kicker size={22} color={C.softGrey}>
              {sensex.name}
            </Kicker>
            <Display size={176} weight={700} stretch={74} color={C.negative} style={{ marginTop: 18 }}>
              {fmtPct(sensex.q3PriceReturn)}
            </Display>
          </div>
        )}
        <div style={{ position: "absolute", top: 250, ...riseIn(frame, RETURN_IN + 14, 22, 10) }}>
          <div style={{ width: 64, height: 2, background: C.blueOnDark, marginBottom: 20 }} />
          <Body size={26} color={C.white} weight={500}>
            {COPY.marketPerformance.footer}
          </Body>
          <Body size={22} style={{ marginTop: 6 }}>
            {nifty.start.date} – {nifty.end.date}
          </Body>
        </div>
      </div>

      <Footnote opacity={prog(frame, DRAW_END, 20)}>{COPY.marketPerformance.chartNote}</Footnote>
    </Absolute>
  );
};
