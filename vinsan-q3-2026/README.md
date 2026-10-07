# Vinsan Quarterly — Q3 2026 · *The Quarter at a Glance*

A 45-second editorial motion graphic for the Vinsan Quarterly Q3 2026 newsletter, built in **React + Remotion**. The animation is deterministic, so the same inputs always render the same frames.

* **Output:** 1920 × 1080, 30 fps, H.264 MP4 with AAC audio
* **Draft preview:** `preview/vinsan-q3-2026-glance-DRAFT.mp4` (rendered without the official logo and without voiceover)

## Quick start

```bash
cd vinsan-q3-2026
npm install
npm run studio        # live preview / scrub timeline in the browser
npm run render        # QA → soundtrack → out/vinsan-q3-2026-glance.mp4
```

Offline or in a container with a pre-installed Chromium, point Remotion at it:

```bash
REMOTION_CHROME=/path/to/chrome-headless-shell npm run render
```

Other scripts:

| Script | What it does |
| --- | --- |
| `npm run qa` | Data-integrity checks: returns vs. index levels, monthly compounding, September AMFI guard, duration 30–50 s, placeholder scan, logo presence |
| `npm run soundtrack` | Synthesises the original music bed and SFX → `public/audio/soundtrack.wav`. Cues follow the scene timeline. |
| `npm run stills [frames…]` | Renders QA stills → `out/stills/` |
| `npm run typecheck` | TypeScript check |

## Where to edit

| Want to change… | Edit |
| --- | --- |
| Any number | `src/config/data.ts` — `MARKET_DATA`, `SIP_DATA`, `MF_DATA`, `SOURCES` |
| Any on-screen words / narration script | `src/config/copy.ts` |
| Colours, fonts, company name, tagline, **logo** | `src/config/brand.ts` (`BRAND_DATA`) |
| Scene lengths / total duration / transition length | `src/config/timeline.ts` |
| Music / voiceover files and levels | `src/config/audio.ts` |

### Adding the logo
Put the file in `public/brand/` (transparent PNG or SVG). Then set `BRAND_DATA.logoSrc = "brand/<file>"` and adjust `logoHeight` if needed. The logo is never redrawn. Until a file is supplied, the end card shows the company name in plain type.

### Adding September 2026 AMFI data
Once official figures are out, add a `SEPTEMBER` entry to `SIP_DATA.monthly`, `MF_DATA.aum` and `MF_DATA.equityInflows`. Each scene uses the last entry as the "latest" figure, and the footer label "Latest verified AMFI data — <Month> 2026" updates itself. Run `npm run qa` afterwards.

### Adding a voiceover
Drop the file in `public/audio/` and set `AUDIO.voiceover`. The music then ducks automatically to `musicVolumeUnderVoice`. The narration script is in `COPY.narration`.

## Scene map (default timing)

| # | Scene | Time |
| --- | --- | --- |
| 01 | Opening: the line draw turns into the title | 0–4 s |
| 02 | The quarter in one view: Recovery / Rotation / Volatility | 4–9 s |
| 03 | Nifty 50 chart → −5.22 %, then morphs to Sensex −5.23 % | 9–16 s |
| 04 | Monthly movement bars (shared zero-based scale) | 16–21 s |
| 05 | SIP: ₹32,297 Cr → Jul vs Aug → 10.02 Cr accounts | 21–28 s |
| 06 | MF industry: AUM columns (zero-based) + equity inflows + 66th month | 28–33.5 s |
| 07 | Contrast: Markets weakened / participation remained resilient | 33.5–38.5 s |
| 08 | Final message + brand lockup + sources | 38.5–45 s |

## Data-integrity notes

* All figures come from `data.ts`. Scenes never contain literal numbers.
* Returns are labelled **price return** and come with their dates.
* **Chart (scene 03):** only the verified 30 Jun and 30 Sep levels are printed. The month-end shape comes from the supplied monthly returns, and the chart is labelled *"Simplified editorial visualisation … not daily data."* The end point is the verified 30 Sep level, not a derived one.
* **Bars:** both the monthly bars and the AUM columns start at zero on a shared scale, so the AUM growth is not exaggerated.
* **AMFI figures stop at August 2026.** Every SIP / MF scene carries the footer "Latest verified AMFI data — August 2026".
* **Mood line (scene 02):** illustrative only, and labelled "Illustrative of market mood — not to scale".
* **Supplied-data inconsistency:** `npm run qa` flags that the Nifty monthly figures (+2.36 %, ≈−1.24 %, ≈−6.1 %) compound to −5.08 %. The verified start and end levels give −5.22 %, which implies a September return of about −6.24 %. The video shows the figures exactly as supplied. Please confirm with the source.

## Adapting to 9:16

Data, copy, timing, brand tokens, background, transitions and the soundtrack do not depend on resolution. To make a 1080 × 1920 cut, register a second `<Composition>` in `src/Root.tsx` and give each scene a portrait layout, for example by stacking the split-screen and chart panels vertically. The scene logic stays the same.
