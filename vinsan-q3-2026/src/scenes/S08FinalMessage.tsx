import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { BRAND_DATA } from "../config/brand";
import { COPY } from "../config/copy";
import { SOURCES } from "../config/data";
import { EASE, prog, riseIn } from "../lib/anim";
import { Absolute, Display, Kicker, MaskReveal } from "../components/ui";

const C = BRAND_DATA.colors;
const F = BRAND_DATA.fonts;

const LINE_B = 58; // the pause between the two statements
const BRAND_IN = 112;

export const S08FinalMessage: React.FC = () => {
  const frame = useCurrentFrame();
  const navyText = "#0A1C36";

  return (
    <Absolute>
      <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
        {COPY.finalMessage.lineA.map((l, i) => (
          <MaskReveal key={l} frame={frame} start={10 + i * 8} dur={30} style={{ display: "flex", justifyContent: "center" }}>
            <Display size={100} weight={700} stretch={78} color={navyText} style={{ lineHeight: 1.04 }}>
              {l}
            </Display>
          </MaskReveal>
        ))}
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center" }}>
        {COPY.finalMessage.lineB.map((l, i) => (
          <MaskReveal key={l} frame={frame} start={LINE_B + i * 8} dur={30} style={{ display: "flex", justifyContent: "center" }}>
            <Display size={100} weight={800} stretch={78} color={i === 1 ? BRAND_DATA.colors.blue : navyText} style={{ lineHeight: 1.04 }}>
              {l}
            </Display>
          </MaskReveal>
        ))}
      </div>

      {/* brand lockup */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 712, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 34 }}>
          <div style={{ height: 3, width: 70 * prog(frame, BRAND_IN - 10, 26, EASE.inOut), background: C.blue }} />
          <div style={{ height: 3, width: 30 * prog(frame, BRAND_IN - 4, 26, EASE.inOut), background: C.green }} />
        </div>
        <div style={riseIn(frame, BRAND_IN, 26, 14)}>
          {BRAND_DATA.logoSrc ? (
            <Img src={staticFile(BRAND_DATA.logoSrc)} style={{ height: BRAND_DATA.logoHeight, width: "auto", objectFit: "contain" }} />
          ) : (
            <div
              style={{
                fontFamily: F.text,
                fontWeight: 700,
                fontSize: 34,
                letterSpacing: "0.2em",
                color: navyText,
              }}
            >
              {BRAND_DATA.company}
            </div>
          )}
        </div>
        <div style={{ marginTop: 22, ...riseIn(frame, BRAND_IN + 12, 24, 10) }}>
          <Kicker size={22} color={C.green} style={{ letterSpacing: "0.3em" }}>
            {BRAND_DATA.tagline[0]}
            <span style={{ color: C.blue, marginLeft: "0.9em" }}>{BRAND_DATA.tagline[1]}</span>
          </Kicker>
        </div>
      </div>

      {COPY.showSources && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 52,
            textAlign: "center",
            fontFamily: F.text,
            fontSize: 19,
            fontWeight: 500,
            color: C.midGrey,
            opacity: prog(frame, BRAND_IN + 24, 20),
          }}
        >
          {SOURCES.line}
        </div>
      )}
    </Absolute>
  );
};
