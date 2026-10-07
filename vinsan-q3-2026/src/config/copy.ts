/**
 * All on-screen words (except numbers, which come from data.ts).
 * Edit text here — scenes never contain literal copy.
 */
export const COPY = {
  showSources: true,

  opening: {
    kicker: "VINSAN QUARTERLY",
    title: "Q3 2026",
    subtitle: "THE QUARTER AT A GLANCE",
    months: "JULY  •  AUGUST  •  SEPTEMBER",
  },

  quarterView: {
    kicker: "THE QUARTER IN ONE VIEW",
    caption: "Illustrative of market mood — not to scale",
  },

  marketPerformance: {
    kicker: "Q3 2026",
    axisLabel: "% change since 30 Jun",
    footer: "Q3 2026 price return",
    chartNote:
      "Simplified editorial visualisation: month-end path derived from monthly price returns; not daily data.",
  },

  monthlyMovement: {
    headline: "THE MARKET MOOD SHIFTED",
    footer: "Nifty 50 monthly price return · August and September figures approximate",
  },

  participation: {
    headlineLabel: "SIP CONTRIBUTION",
    accountsLabel: "SIP ACCOUNTS",
    accountsNote: "approx.",
    message: ["MARKET VOLATILITY", "DID NOT STOP", "SYSTEMATIC INVESTING."],
  },

  mfIndustry: {
    kicker: "MUTUAL FUND INDUSTRY",
    aumLabel: "AUM",
    inflowLabel: "EQUITY MF INFLOWS",
    streak: (n: number) => `${ordinal(n)} consecutive month of positive equity MF flows`,
  },

  contrast: {
    leftLabel: "MARKETS",
    leftSub: "Nifty 50 · Q3 2026 price return",
    rightLabel: "INVESTOR PARTICIPATION",
    rightSub: (month: string) => `Monthly SIP contribution · ${month}`,
    headlineA: "MARKETS WEAKENED.",
    headlineB: ["INVESTOR PARTICIPATION", "REMAINED RESILIENT."],
  },

  finalMessage: {
    lineA: ["THE MARKET'S MOOD", "CAN CHANGE IN WEEKS."],
    lineB: ["YOUR FINANCIAL GOALS", "USUALLY DON'T."],
  },

  /** Voiceover script (for a human or AI narrator). Not rendered as text. */
  narration: [
    "Q3 2026 brought three very different market moods.",
    "July saw recovery. August brought rotation. And September delivered renewed volatility.",
    "The Nifty 50 ended the quarter down 5.22 percent.",
    "Yet investor participation remained resilient.",
    "SIP contributions reached 32,297 crore in August.",
    "The message for investors is simple:",
    "Markets can change in weeks. Your financial goals usually don't.",
  ],
};

export function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
