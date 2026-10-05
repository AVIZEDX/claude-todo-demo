---
name: cutline-style
description: Apply the CUTLINE motion-design system (ink canvas, one signal accent, Archivo Expanded + Instrument Serif italic accent word + JetBrains Mono HUD, playhead "cutline" transitions, beat-locked motion) to any HyperFrames video for this creator. Use when the user asks for a reel, showreel, promo, intro or any video "in my style", "in the CUTLINE style", or for @avishek.editz content.
---

# CUTLINE style

The system lives in `motion-system/` at the repo root. Read these before writing any composition:

1. `motion-system/frame.md`: the normative spec. Frontmatter tokens are brand truth (exact hex, fonts, sizes, eases, durations). The prose holds the composition, motion, text-animation and transition rules plus the 15 s pacing template.
2. `motion-system/REFERENCE_ANALYSIS.md`: why the system looks the way it does.
3. `motion-system/index.html`: a working style proof showing every component and the helper API in use.

## How to build with it

- Start a project by copying `cutline.css`, `cutline.js` and `assets/` (fonts + GSAP) next to the new `index.html`. Repeat the three `@font-face` rules inline in `index.html` (HyperFrames lint wants them in-file).
- Detect beats first (`npx hyperframes beats`) and place events on the grid: every beat something moves, every bar a scene event, the 1–2 strongest accents get the hero moments.
- Use the `Cutline.*` helpers (`rise`, `stretch`, `swap`, `typeOn`, `count`, `underline`, `chip`, `punch`, `drift`, `wipe`, `iris`, `whip`, `timecode`) on one paused GSAP timeline.
- Keep text out of the bottom 420 px and above 250 px; one accent colour; no fades between scenes; no hold over 2 beats.
- Never invent the creator's facts (names, numbers, clients). Ask for them.
- Run `npx hyperframes check` and render, then review frames before delivering.
