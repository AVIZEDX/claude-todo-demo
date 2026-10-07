/**
 * Pre-render data-integrity QA.  Run: npm run qa
 * Fails (exit 1) on hard errors; prints warnings for things an editor should know.
 */
import { BRAND_DATA } from "../src/config/brand";
import { COPY } from "../src/config/copy";
import { MARKET_DATA, MF_DATA, SIP_DATA, SOURCES, latestAmfiLabel } from "../src/config/data";
import { FPS, TOTAL_FRAMES } from "../src/config/timeline";

const errors: string[] = [];
const warnings: string[] = [];
const ok: string[] = [];

// 1. Quarter price returns must match the verified start/end levels.
for (const key of ["nifty", "sensex"] as const) {
  const idx = MARKET_DATA[key];
  const computed = (idx.end.level / idx.start.level - 1) * 100;
  const stated = idx.q3PriceReturn.value;
  const rounded = Number(computed.toFixed(idx.q3PriceReturn.decimals));
  if (rounded !== stated) {
    errors.push(`${idx.name}: stated Q3 return ${stated}% but levels imply ${computed.toFixed(3)}%`);
  } else {
    ok.push(`${idx.name}: ${idx.start.level} → ${idx.end.level} = ${computed.toFixed(3)}% (displays ${stated}%)`);
  }
}

// 2. Monthly returns compounded vs. quarter return (informational).
for (const key of ["nifty", "sensex"] as const) {
  const idx = MARKET_DATA[key];
  const chain = MARKET_DATA.monthly.reduce((a, m) => a * (1 + m[key].value / 100), 1);
  const chainPct = (chain - 1) * 100;
  const gap = Math.abs(chainPct - idx.q3PriceReturn.value);
  const [jul, aug] = MARKET_DATA.monthly;
  const augEnd = idx.start.level * (1 + jul[key].value / 100) * (1 + aug[key].value / 100);
  const impliedSep = (idx.end.level / augEnd - 1) * 100;
  const msg = `${idx.name}: monthly returns compound to ${chainPct.toFixed(2)}% vs verified Q3 ${idx.q3PriceReturn.value}% (gap ${gap.toFixed(2)} pp). Implied September from levels: ${impliedSep.toFixed(2)}% vs supplied ≈${MARKET_DATA.monthly[2][key].value}%.`;
  (gap > 0.1 ? warnings : ok).push(msg);
}

// 3. AMFI data: September must not appear unless explicitly added.
const months = [
  ...SIP_DATA.monthly.map((m) => m.month),
  ...MF_DATA.aum.map((m) => m.month),
  ...MF_DATA.equityInflows.map((m) => m.month),
];
if (months.includes("SEPTEMBER")) {
  warnings.push("September AMFI data present — confirm it is from the official AMFI release.");
} else {
  ok.push(`AMFI data stops at August; footer reads: "${latestAmfiLabel()}"`);
}

// 4. Duration 30–50 s.
const secs = TOTAL_FRAMES / FPS;
if (secs < 30 || secs > 50) errors.push(`Duration ${secs}s is outside 30–50s`);
else ok.push(`Duration ${secs.toFixed(2)}s (${TOTAL_FRAMES} frames @ ${FPS}fps)`);

// 5. Placeholder text scan.
const allText = JSON.stringify({ COPY, SOURCES, BRAND_DATA });
const bad = allText.match(/lorem|ipsum|placeholder|TODO|TBD|XXX/gi);
if (bad) errors.push(`Placeholder text found: ${[...new Set(bad)].join(", ")}`);
else ok.push("No placeholder text in copy");

// 6. Logo.
if (!BRAND_DATA.logoSrc) warnings.push("No logo file set (BRAND_DATA.logoSrc) — end card shows company name in plain type.");

console.log("\n== Vinsan Q3 2026 — data QA ==\n");
ok.forEach((m) => console.log("  ✓ " + m));
warnings.forEach((m) => console.log("  ! " + m));
errors.forEach((m) => console.log("  ✗ " + m));
console.log("");
if (errors.length) process.exit(1);
