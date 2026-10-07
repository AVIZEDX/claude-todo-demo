/**
 * VINSAN — brand tokens. Change colours / fonts / logo here only.
 */
export const BRAND_DATA = {
  company: "VINSAN FINANCIAL SERVICES PVT. LTD.",
  shortName: "VINSAN",
  publication: "VINSAN QUARTERLY",
  tagline: ["SIMPLIFYING MONEY.", "BUILDING CONFIDENCE."],

  /**
   * Official logo. Put the file in /public/brand/ and set e.g.
   *   logoSrc: "brand/vinsan-logo.png"
   * While null, the end card shows the company name in plain type
   * (the logo is NEVER redrawn or approximated).
   */
  logoSrc: null as string | null,
  /** Logo height on the end card, in px at 1080p. Width follows aspect ratio. */
  logoHeight: 120,

  colors: {
    blue: "#0A4EA3", // primary
    green: "#2E9B35", // secondary
    // Lifted tints of the brand colours for legibility on deep navy.
    blueOnDark: "#4D8FE0",
    greenOnDark: "#5DBB63",
    navyDeep: "#050F1F",
    navy: "#0A1C36",
    navyPanel: "#0E2547",
    white: "#FFFFFF",
    paper: "#F5F7FA",
    softGrey: "#A9B4C4",
    midGrey: "#6B7A90",
    charcoal: "#1C2430",
    hairline: "rgba(255,255,255,0.08)",
    hairlineStrong: "rgba(255,255,255,0.18)",
    /** Functional data colour, used ONLY for negative returns. Muted on purpose. */
    negative: "#D9705F",
  },

  fonts: {
    /** Headlines + numbers: variable width axis used for the condensed look */
    display: "'Archivo Variable', 'Archivo', 'Helvetica Neue', Arial, sans-serif",
    /** Labels + small text */
    text: "'Inter Tight Variable', 'Inter Tight', 'Helvetica Neue', Arial, sans-serif",
  },
};

export type Colors = typeof BRAND_DATA.colors;
