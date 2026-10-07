/**
 * ============================================================================
 *  VINSAN QUARTERLY — Q3 2026 — VERIFIED DATA (single source of truth)
 * ============================================================================
 *
 *  Every number that appears on screen is read from this file.
 *  Never hard-code a figure inside a scene.
 *
 *  `approx: true` marks figures supplied as "approximately"; scenes add an
 *  "approx." note in the footer wherever such a figure is shown.
 *
 *  TO ADD SEPTEMBER 2026 AMFI DATA (once officially published):
 *    1. Append a `{ month: "SEPTEMBER", ... }` entry to SIP_DATA.monthly,
 *       MF_DATA.aum and MF_DATA.equityInflows.
 *    2. Update SIP_DATA.accounts and MF_DATA.positiveFlowStreak if needed.
 *    3. The SIP / MF / contrast scenes always use the LAST entry of each
 *       array as the "latest" figure, and the footer label is derived from
 *       it automatically ("Latest verified AMFI data — <Month> 2026").
 *    4. Run `npm run qa` before rendering.
 * ============================================================================
 */

export type Pct = {
  /** Percentage value, e.g. -5.22 means −5.22 % */
  value: number;
  /** Decimals to display — matches the precision of the verified source */
  decimals: number;
  approx: boolean;
};

export type IndexLevel = { date: string; shortDate: string; level: number };

export type IndexData = {
  name: string;
  start: IndexLevel;
  end: IndexLevel;
  /** Q3 2026 PRICE return (not total return) */
  q3PriceReturn: Pct;
};

export const DATA_PERIOD = {
  quarter: "Q3 2026",
  months: ["JULY", "AUGUST", "SEPTEMBER"] as const,
  returnBasis: "price return",
  dataThrough: "September 2026",
};

// ---------------------------------------------------------------------------
// MARKET DATA — NSE / BSE
// ---------------------------------------------------------------------------
export const MARKET_DATA = {
  nifty: {
    name: "NIFTY 50",
    start: { date: "30 June 2026", shortDate: "30 JUN", level: 23865.75 },
    end: { date: "30 September 2026", shortDate: "30 SEP", level: 22620.45 },
    q3PriceReturn: { value: -5.22, decimals: 2, approx: true },
  } satisfies IndexData,

  sensex: {
    name: "SENSEX",
    start: { date: "30 June 2026", shortDate: "30 JUN", level: 76478.67 },
    end: { date: "30 September 2026", shortDate: "30 SEP", level: 72480.29 },
    q3PriceReturn: { value: -5.23, decimals: 2, approx: true },
  } satisfies IndexData,

  /** Monthly PRICE returns. Order matters: July → August → September. */
  monthly: [
    {
      month: "JULY",
      short: "JUL",
      monthEnd: "31 JUL",
      mood: "RECOVERY",
      nifty: { value: 2.36, decimals: 2, approx: false },
      sensex: { value: 2.11, decimals: 2, approx: false },
    },
    {
      month: "AUGUST",
      short: "AUG",
      monthEnd: "31 AUG",
      mood: "ROTATION",
      nifty: { value: -1.24, decimals: 2, approx: true },
      sensex: { value: -1.46, decimals: 2, approx: true },
    },
    {
      month: "SEPTEMBER",
      short: "SEP",
      monthEnd: "30 SEP",
      mood: "VOLATILITY",
      nifty: { value: -6.1, decimals: 1, approx: true },
      sensex: { value: -5.8, decimals: 1, approx: true },
    },
  ],
};

// ---------------------------------------------------------------------------
// SIP DATA — AMFI  (values in ₹ crore)
// ---------------------------------------------------------------------------
export const SIP_DATA = {
  monthly: [
    { month: "JULY", year: 2026, value: 31961 },
    { month: "AUGUST", year: 2026, value: 32297 },
    // { month: "SEPTEMBER", year: 2026, value: ????? },  ← add only when verified
  ],
  accounts: {
    month: "AUGUST",
    year: 2026,
    /** in crore accounts */
    value: 10.02,
    decimals: 2,
    approx: true,
  },
};

// ---------------------------------------------------------------------------
// MUTUAL FUND INDUSTRY DATA — AMFI
// ---------------------------------------------------------------------------
export const MF_DATA = {
  /** Industry AUM, ₹ lakh crore, month-end */
  aum: [
    { month: "JULY", year: 2026, date: "31 July 2026", value: 85.76 },
    { month: "AUGUST", year: 2026, date: "31 August 2026", value: 87.08 },
  ],
  /** Net equity MF inflows, ₹ crore */
  equityInflows: [
    { month: "JULY", year: 2026, value: 24697 },
    { month: "AUGUST", year: 2026, value: 29329 },
  ],
  positiveFlowStreak: { month: "AUGUST", year: 2026, consecutiveMonths: 66 },
};

// ---------------------------------------------------------------------------
// SOURCES (shown on the final frame; can be disabled in COPY.showSources)
// ---------------------------------------------------------------------------
export const SOURCES = {
  line: "Sources: NSE, BSE, AMFI, Reuters; data through September 2026.",
};

/** Helper: latest verified entry of a monthly series */
export const latest = <T,>(arr: readonly T[]): T => arr[arr.length - 1];
export const previous = <T,>(arr: readonly T[]): T => arr[arr.length - 2];

const titleCase = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

/** "Latest verified AMFI data — August 2026" — derived, never typed by hand */
export const latestAmfiLabel = () => {
  const l = latest(SIP_DATA.monthly);
  return `Latest verified AMFI data — ${titleCase(l.month)} ${l.year}`;
};
