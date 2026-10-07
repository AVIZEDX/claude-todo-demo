import React from "react";
import { BRAND_DATA } from "../config/brand";
import { EASE, prog } from "../lib/anim";

const C = BRAND_DATA.colors;
const F = BRAND_DATA.fonts;

/** Small tracked uppercase label. */
export const Kicker: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, color = C.softGrey, size = 22, style }) => (
  <div
    style={{
      fontFamily: F.text,
      fontWeight: 600,
      fontSize: size,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Condensed display type for headlines + hero numbers. */
export const Display: React.FC<{
  children: React.ReactNode;
  size: number;
  color?: string;
  weight?: number;
  stretch?: number;
  style?: React.CSSProperties;
}> = ({ children, size, color = C.white, weight = 700, stretch = 78, style }) => (
  <div
    style={{
      fontFamily: F.display,
      fontWeight: weight,
      fontStretch: `${stretch}%`,
      fontSize: size,
      lineHeight: 0.95,
      letterSpacing: "-0.01em",
      color,
      fontVariantNumeric: "tabular-nums lining-nums",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Body / supporting text */
export const Body: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 26, color = C.softGrey, weight = 450, style }) => (
  <div
    style={{
      fontFamily: F.text,
      fontWeight: weight,
      fontSize: size,
      lineHeight: 1.3,
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * Line-mask reveal: the content slides up from behind an invisible edge.
 * Classic editorial kinetic type.
 */
export const MaskReveal: React.FC<{
  frame: number;
  start: number;
  dur?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ frame, start, dur = 26, children, style }) => {
  const p = prog(frame, start, dur, EASE.out);
  return (
    <div style={{ overflow: "hidden", paddingBottom: "0.08em", ...style }}>
      <div style={{ transform: `translateY(${(1 - p) * 105}%)`, opacity: p > 0 ? 1 : 0 }}>
        {children}
      </div>
    </div>
  );
};

/** Animated horizontal hairline that draws from left. */
export const Rule: React.FC<{
  frame: number;
  start: number;
  dur?: number;
  width: number;
  color?: string;
  thickness?: number;
  style?: React.CSSProperties;
}> = ({ frame, start, dur = 30, width, color = C.blueOnDark, thickness = 2, style }) => {
  const p = prog(frame, start, dur, EASE.inOut);
  return (
    <div
      style={{
        width: width * p,
        height: thickness,
        background: color,
        ...style,
      }}
    />
  );
};

/** Small source / methodology note, bottom-left of a scene. */
export const Footnote: React.FC<{ children: React.ReactNode; opacity?: number; color?: string }> = ({
  children,
  opacity = 1,
  color = C.midGrey,
}) => (
  <div
    style={{
      position: "absolute",
      left: 120,
      bottom: 64,
      fontFamily: F.text,
      fontSize: 20,
      fontWeight: 500,
      letterSpacing: "0.02em",
      color,
      opacity,
    }}
  >
    {children}
  </div>
);

export const Absolute: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => <div style={{ position: "absolute", inset: 0, ...style }}>{children}</div>;
