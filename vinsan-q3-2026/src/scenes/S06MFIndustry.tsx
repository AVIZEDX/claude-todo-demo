import React from "react";
import { useCurrentFrame } from "remotion";
import { BRAND_DATA } from "../config/brand";
import { COPY } from "../config/copy";
import { latest, latestAmfiLabel, MF_DATA } from "../config/data";
import { EASE, prog, riseIn } from "../lib/anim";
import { countTo, fmtNum } from "../lib/format";
import { Absolute, Body, Display, Footnote, Kicker, MaskReveal } from "../components/ui";

const C = BRAND_DATA.colors;

const BASE_Y = 900;
const MAX_H = 470; // height of the largest bar; zero-based scale, so growth is NOT exaggerated
const BAR_W = 230;
const BAR_GAP = 90;
const BARS_LEFT = 200;
const FLOOR = 18; // architectural floor lines every N px

export const S06MFIndustry: React.FC = () => {
  const frame = useCurrentFrame();
  const aum = MF_DATA.aum.slice(-2);
  const maxV = Math.max(...aum.map((a) => a.value));
  const inflow = latest(MF_DATA.equityInflows);
  const streak = MF_DATA.positiveFlowStreak;

  return (
    <Absolute>
      <div style={{ position: "absolute", left: 120, top: 140, ...riseIn(frame, 0, 20, 10) }}>
        <Kicker>{COPY.mfIndustry.kicker}</Kicker>
      </div>

      {/* baseline */}
      <div style={{ position: "absolute", left: 160, top: BASE_Y, height: 1, width: 720 * prog(frame, 4, 28, EASE.inOut), background: C.hairlineStrong }} />

      {aum.map((a, i) => {
        const start = 12 + i * 22;
        const p = prog(frame, start, 36, EASE.out);
        const h = (a.value / maxV) * MAX_H * p;
        const left = BARS_LEFT + i * (BAR_W + BAR_GAP);
        const isLatest = i === aum.length - 1;
        const top = isLatest ? C.blueOnDark : `${C.blueOnDark}88`;
        const bottom = isLatest ? `${C.blueOnDark}55` : `${C.blueOnDark}26`;
        return (
          <React.Fragment key={a.month}>
            <div
              style={{
                position: "absolute",
                left,
                width: BAR_W,
                top: BASE_Y - h,
                height: h,
                background: `repeating-linear-gradient(0deg, transparent 0 ${FLOOR - 1}px, rgba(5,15,31,0.35) ${FLOOR - 1}px ${FLOOR}px), linear-gradient(180deg, ${top} 0%, ${bottom} 100%)`,
                borderTop: `2px solid ${isLatest ? C.white : C.softGrey}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: left - 40,
                width: BAR_W + 80,
                top: BASE_Y - (a.value / maxV) * MAX_H - 150,
                textAlign: "center",
                ...riseIn(frame, start + 18, 22, 14),
              }}
            >
              <Display size={72} weight={700} stretch={78} color={isLatest ? C.white : C.softGrey}>
                ₹{fmtNum(countTo(a.value, prog(frame, start, 36), 2), 2)}
              </Display>
              <Kicker size={18} color={C.softGrey} style={{ marginTop: 10 }}>
                Lakh Cr
              </Kicker>
            </div>
            <div style={{ position: "absolute", left, width: BAR_W, top: BASE_Y + 18, textAlign: "center", ...riseIn(frame, start + 10, 20, 8) }}>
              <Kicker size={20} color={isLatest ? C.white : C.softGrey}>
                {a.month} {COPY.mfIndustry.aumLabel}
              </Kicker>
            </div>
          </React.Fragment>
        );
      })}

      {/* Equity inflows */}
      <div style={{ position: "absolute", left: 1010, top: 360, width: 800 }}>
        <div style={riseIn(frame, 66, 24, 20)}>
          <Display size={150} weight={700} stretch={76} color={C.greenOnDark}>
            ₹{fmtNum(countTo(inflow.value, prog(frame, 66, 40), 0))}
            <span style={{ fontSize: "0.42em", fontWeight: 600, marginLeft: "0.18em", color: C.softGrey }}>Cr</span>
          </Display>
        </div>
        <MaskReveal frame={frame} start={74} dur={24} style={{ marginTop: 20 }}>
          <Kicker size={26} color={C.white}>
            {inflow.month} {COPY.mfIndustry.inflowLabel}
          </Kicker>
        </MaskReveal>
        <div style={{ marginTop: 40, height: 1, width: 640 * prog(frame, 88, 26, EASE.inOut), background: C.hairlineStrong }} />
        <div style={{ marginTop: 30, ...riseIn(frame, 96, 24, 12) }}>
          <Body size={30} color={C.white} weight={500}>
            {COPY.mfIndustry.streak(streak.consecutiveMonths)}
          </Body>
          <Body size={22} style={{ marginTop: 6 }}>
            as of {streak.month.charAt(0) + streak.month.slice(1).toLowerCase()} {streak.year}
          </Body>
        </div>
      </div>

      <Footnote opacity={prog(frame, 20, 20)}>{latestAmfiLabel()}</Footnote>
    </Absolute>
  );
};
