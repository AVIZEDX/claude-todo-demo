import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND_DATA } from "../config/brand";
import { sceneStart, TRANSITION_FRAMES } from "../config/timeline";
import { EASE, prog, tween } from "../lib/anim";

const C = BRAND_DATA.colors;

/**
 * Persistent stage behind every scene: deep navy, a fine financial grid with
 * slow parallax drift, soft blue light, vignette and fixed film grain.
 * Cross-fades to a paper-white stage for the final message.
 */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const gridIn = tween(frame, 4, 44, 0, 1, EASE.inOut);
  const finalStart = sceneStart("finalMessage");
  const light = prog(frame, finalStart, TRANSITION_FRAMES + 16, EASE.inOut);

  // Two grid layers at different drift speeds = subtle parallax.
  const driftA = (frame * 0.18) % 120;
  const driftB = (frame * 0.07) % 24;

  // Soft light slowly wanders across the stage.
  const gx = 30 + Math.sin(frame / 160) * 12;
  const gy = 36 + Math.cos(frame / 210) * 8;

  return (
    <AbsoluteFill style={{ background: C.navyDeep }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 80% at ${gx}% ${gy}%, ${C.navyPanel} 0%, ${C.navy} 45%, ${C.navyDeep} 100%)`,
        }}
      />
      {/* fine minor grid */}
      <AbsoluteFill style={{ opacity: gridIn * 0.5 }}>
        <svg width={width} height={height}>
          <defs>
            <pattern id="minor" width="24" height="24" patternUnits="userSpaceOnUse" x={-driftB} y={0}>
              <path d="M24 0H0V24" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
            </pattern>
            <pattern id="major" width="120" height="120" patternUnits="userSpaceOnUse" x={-driftA} y={0}>
              <path d="M120 0H0V120" fill="none" stroke="rgba(120,160,220,0.09)" strokeWidth="1" />
            </pattern>
            <radialGradient id="gridFade" cx="50%" cy="45%" r="70%">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <mask id="gridMask">
              <rect width={width} height={height} fill="url(#gridFade)" />
            </mask>
          </defs>
          <g mask="url(#gridMask)">
            <rect width={width} height={height} fill="url(#minor)" />
            <rect width={width} height={height} fill="url(#major)" />
          </g>
        </svg>
      </AbsoluteFill>
      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 85% 85% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)",
        }}
      />
      {/* paper stage for the final message */}
      <AbsoluteFill
        style={{
          opacity: light,
          background: `radial-gradient(ellipse 90% 90% at 50% 40%, #FFFFFF 0%, ${C.paper} 60%, #E9EDF3 100%)`,
        }}
      />
      {/* fixed film grain — deterministic (static seed) */}
      <AbsoluteFill style={{ opacity: 0.06, mixBlendMode: "overlay" }}>
        <svg width={width} height={height}>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width={width} height={height} filter="url(#grain)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
