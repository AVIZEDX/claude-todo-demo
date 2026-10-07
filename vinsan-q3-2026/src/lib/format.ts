import type { Pct } from "../config/data";

const MINUS = "−"; // typographic minus

/** Indian digit grouping, fixed decimals: 23865.75 → "23,865.75" */
export const fmtNum = (v: number, decimals = 0) =>
  v.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/** Signed percentage with typographic minus: −5.22% / +2.36% */
export const fmtPct = (p: Pct | { value: number; decimals: number }, valueOverride?: number) => {
  const v = valueOverride ?? p.value;
  const abs = Math.abs(v).toFixed(p.decimals);
  if (Number(abs) === 0) return `${abs}%`;
  return `${v < 0 ? MINUS : "+"}${abs}%`;
};

/** ₹32,297 Cr */
export const fmtCrore = (v: number) => `₹${fmtNum(v)} Cr`;

/** ₹87.08 Lakh Cr */
export const fmtLakhCrore = (v: number) => `₹${fmtNum(v, 2)} Lakh Cr`;

/**
 * Counter helper: interpolated value rounded to the target precision, so a
 * counter always LANDS on exactly the verified figure.
 */
export const countTo = (target: number, progress: number, decimals: number) => {
  const f = 10 ** decimals;
  const p = Math.max(0, Math.min(1, progress));
  return p >= 1 ? target : Math.round(target * p * f) / f;
};
