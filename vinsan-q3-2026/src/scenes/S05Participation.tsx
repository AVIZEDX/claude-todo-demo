import React from "react";
import { useCurrentFrame } from "remotion";
import { BRAND_DATA } from "../config/brand";
import { COPY } from "../config/copy";
import { latest, latestAmfiLabel, previous, SIP_DATA } from "../config/data";
import { EASE, fadeOut, mix, prog, riseIn, tween } from "../lib/anim";
import { countTo, fmtNum } from "../lib/format";
import { sampledPath } from "../lib/path";
import { Absolute, Body, Display, Footnote, Kicker, MaskReveal } from "../components/ui";

const C = BRAND_DATA.colors;

const PHASE_B = 64; // hero → comparison
const PHASE_C = 132; // comparison → accounts + message

export const S05Participation: React.FC = () => {
  const frame = useCurrentFrame();
  const cur = latest(SIP_DATA.monthly);
  const prev = previous(SIP_DATA.monthly);
  const acc = SIP_DATA.accounts;

  // Hero number: counts up, drifts gently upward, then docks into the comparison row.
  const count = countTo(cur.value, prog(frame, 8, 46, EASE.out), 0);
  const dock = prog(frame, PHASE_B, 26, EASE.inOut);
  const heroScale = mix(1, 0.62, dock);
  const heroX = mix(0, 380, dock);
  const heroY = mix(-tween(frame, 0, PHASE_B, 0, 18, (t) => t), 30, dock);
  const phaseBOut = frame >= PHASE_C ? fadeOut(frame, PHASE_C, 16, -30) : { opacity: 1 };

  // Rising participation line (decorative, enters from below as the market chart leaves)
  const rise = tween(frame, 0, 60, 0, 1, EASE.inOut);
  const riseLine = sampledPath((t) => {
    const tt = t * rise;
    return { x: mix(0, 1920, tt), y: 980 - tt * 210 + Math.sin(tt * 18) * 8 };
  }, 160);

  return (
    <Absolute>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 0.55 * (1 - prog(frame, PHASE_C, 20)) }}>
        <path d={riseLine} fill="none" stroke={C.greenOnDark} strokeWidth={2.5} strokeLinecap="round" />
      </svg>

      {/* PHASE A + B */}
      <div style={{ ...phaseBOut, position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", opacity: 1 - prog(frame, PHASE_B, 14) }}>
          <div style={riseIn(frame, 4, 22, 12)}>
            <Kicker size={26} color={C.greenOnDark}>
              {cur.month} {COPY.participation.headlineLabel}
            </Kicker>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 370,
            display: "flex",
            justifyContent: "center",
            transform: `translate(${heroX}px, ${heroY}px) scale(${heroScale})`,
            transformOrigin: "50% 0%",
            opacity: prog(frame, 6, 16),
          }}
        >
          <Display size={230} weight={700} stretch={76}>
            ₹{fmtNum(count)}
            <span style={{ fontSize: "0.42em", fontWeight: 600, marginLeft: "0.18em", color: C.softGrey }}>Cr</span>
          </Display>
        </div>

        {/* labels under docked hero */}
        <div style={{ position: "absolute", left: 960 + 380 - 300, width: 600, top: 560, textAlign: "center", ...riseIn(frame, PHASE_B + 18, 20, 10) }}>
          <Kicker size={24} color={C.greenOnDark}>
            {cur.month}
          </Kicker>
        </div>

        {/* previous month */}
        <div style={{ position: "absolute", left: 960 - 380 - 300, width: 600, top: 400, textAlign: "center", ...riseIn(frame, PHASE_B + 8, 24, 18) }}>
          <Display size={230 * 0.62} weight={700} stretch={76} color={C.softGrey}>
            ₹{fmtNum(prev.value)}
            <span style={{ fontSize: "0.42em", fontWeight: 600, marginLeft: "0.18em" }}>Cr</span>
          </Display>
          <Kicker size={24} color={C.softGrey} style={{ marginTop: 20 }}>
            {prev.month}
          </Kicker>
        </div>

        {/* arrow */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {(() => {
            const p = prog(frame, PHASE_B + 18, 22, EASE.inOut);
            const x0 = 975;
            const x1 = x0 + 50 * p;
            return (
              <g opacity={p > 0 ? 1 : 0} stroke={C.greenOnDark} strokeWidth={3} fill="none" strokeLinecap="round">
                <line x1={x0 - 25} x2={x1 - 25} y1={470} y2={470} />
                {p > 0.6 && <polyline points={`${x1 - 37},${458} ${x1 - 25},${470} ${x1 - 37},${482}`} />}
              </g>
            );
          })()}
        </svg>
      </div>

      {/* PHASE C — accounts + message */}
      {frame >= PHASE_C && (
        <>
          <div style={{ position: "absolute", left: 160, top: 330, width: 640, ...riseIn(frame, PHASE_C + 6, 26, 24) }}>
            <Display size={190} weight={700} stretch={76}>
              {fmtNum(countTo(acc.value, prog(frame, PHASE_C + 6, 36), acc.decimals), acc.decimals)}
              <span style={{ fontSize: "0.42em", fontWeight: 600, marginLeft: "0.18em", color: C.softGrey }}>Cr</span>
            </Display>
            <Kicker size={24} color={C.greenOnDark} style={{ marginTop: 26 }}>
              {COPY.participation.accountsLabel}
            </Kicker>
            <Body size={22} style={{ marginTop: 8 }}>
              {titleCase(acc.month)} {acc.year} · {COPY.participation.accountsNote}
            </Body>
          </div>
          <div
            style={{
              position: "absolute",
              left: 880,
              top: 320,
              width: 1,
              height: 330 * prog(frame, PHASE_C + 10, 26, EASE.inOut),
              background: C.hairlineStrong,
            }}
          />
          <div style={{ position: "absolute", left: 960, top: 330 }}>
            {COPY.participation.message.map((l, i) => (
              <MaskReveal key={l} frame={frame} start={PHASE_C + 16 + i * 8} dur={26}>
                <Display size={86} weight={700} stretch={78} color={i === 2 ? C.greenOnDark : C.white} style={{ lineHeight: 1.08 }}>
                  {l}
                </Display>
              </MaskReveal>
            ))}
          </div>
        </>
      )}

      <Footnote opacity={prog(frame, 20, 20)}>{latestAmfiLabel()}</Footnote>
    </Absolute>
  );
};

const titleCase = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();
