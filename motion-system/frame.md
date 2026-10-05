---
version: 1.0
name: CUTLINE — editor's motion system
description: >
  A reusable, vertical-first motion-design system for an editor/motion designer's social content.
  The concept is the editor's own tool: a single accent playhead line (the "Cutline") that draws,
  sweeps, splits and frames every scene, plus a timecode HUD that makes every frame feel cut on
  purpose. Ink canvas, one electric accent, wide grotesk display, an italic serif for the emphasis
  word, and mono for the HUD. Every move is locked to the music's beat grid.
unit: the frame — 1080×1920 (9:16) primary; 1080×1350 (4:5) and 1920×1080 documented
principle: one accent · one axis · every change on a beat · no cut without a reason

colors:
  ink: "#0B0B0D"          # canvas
  ink-2: "#16161A"        # raised surfaces, card backs
  paper: "#F3F0EA"        # primary text on ink, light-mode canvas
  mute: "#8C8A86"         # secondary text, HUD labels
  hairline: "rgba(243,240,234,0.14)"
  glass: "rgba(243,240,234,0.07)"
  glass-edge: "rgba(243,240,234,0.22)"
  signal: "#D7FF3A"       # THE accent (swappable per brand); used only for emphasis
  signal-ink: "#0B0B0D"   # text placed on signal
  rec: "#FF3B30"          # REC dot only; never used for type

typography:
  display:   { fontFamily: "Archivo", weight: 800, wdth: 125, upper: true, px: 168, lineHeight: 0.88, tracking: "-0.02em" }
  display-xl:{ fontFamily: "Archivo", weight: 900, wdth: 125, upper: true, px: 260, lineHeight: 0.84, tracking: "-0.03em" }
  headline:  { fontFamily: "Archivo", weight: 800, wdth: 112, upper: true, px: 104, lineHeight: 0.92, tracking: "-0.01em" }
  accent:    { fontFamily: "Instrument Serif", style: italic, weight: 400, px: "1.08× the display size it sits in", tracking: "-0.01em", case: lower }
  body:      { fontFamily: "Archivo", weight: 500, wdth: 100, px: 40, lineHeight: 1.25 }
  label:     { fontFamily: "JetBrains Mono", weight: 500, px: 26, tracking: "0.14em", upper: true }
  hud:       { fontFamily: "JetBrains Mono", weight: 400, px: 24, tracking: "0.08em", upper: true }

spacing:
  safe-top: 250px       # Instagram top chrome
  safe-bottom: 420px    # caption, buttons, audio label
  safe-side: 72px
  grid: "6 columns, 24px gutter, inside safe-side"
  gap-sm: 16px
  gap-md: 32px
  gap-lg: 64px

components:
  cutline:
    description: "The signature. A 6px signal-coloured line (the playhead). Present in every scene. It underlines, wipes, splits, frames and points. Never decorative-only: it always performs the scene change."
    stroke: "6px {colors.signal}"
    caps: square
  hud:
    description: "Editor chrome at the safe-top edge: running timecode (real frame count), REC dot, a scene label, and four corner crop marks. Thin, mono, mute colour. Makes the frame feel like it's on a monitor."
    typography: "{typography.hud}"
    color: "{colors.mute}"
  chip:
    description: "Satellite micro-info (years, clients, views, a service). Glass pill, mono label, optional signal dot. Pops in with overshoot and a slight tilt; at most 2 on screen."
    background: "{colors.glass}"
    border: "1.5px solid {colors.glass-edge}"
    rounded: 9999px
    padding: "14px 26px"
    blur: 18px
    typography: "{typography.label}"
  card:
    description: "A framed clip. 9:16 or 4:5, radius 28px, 1.5px hairline border, deep shadow. Cards are windows: the camera can push through one into full-bleed."
    rounded: 28px
    border: "1.5px solid {colors.hairline}"
    shadow: "0 40px 80px rgba(0,0,0,0.55)"
  cta:
    description: "Signal-filled pill with ink text, mono keyword. One per piece, final scene only."
    background: "{colors.signal}"
    color: "{colors.signal-ink}"
    rounded: 9999px
    padding: "26px 48px"

motion:
  bpm: "from the track; fallback 120"
  beat: "60 / bpm seconds; ALL durations below are in beats at 120 BPM (0.5 s)"
  eases:
    snap:   "expo.out"          # text and element entrances
    settle: "back.out(1.7)"     # chips, badges, small objects (overshoot)
    push:   "power4.inOut"      # camera, whips, full-frame moves
    drift:  "sine.inOut"        # idle float, never stops
    draw:   "power2.inOut"      # cutline draws and wipes
    cut:    "none + 2-frame flash"  # smash cut on a downbeat
  durations:
    micro: 0.18s      # chip settle tail, flash
    enter: 0.42s      # word rise, chip pop
    move:  0.60s      # cutline wipe, card slide
    push:  0.80s      # camera punch-in / pull-out
    hold-max: "2 beats"
  stagger:
    words: 0.06s
    letters: 0.025s
    chips: "1 beat"
---

# CUTLINE

## Overview

CUTLINE turns the editor's own tool into the brand. In an edit suite the **playhead**, the thin line that says "this frame, now", decides everything. In CUTLINE that line becomes a visible actor. It draws under the key word, sweeps across to wipe one scene into the next, splits the frame for a before/after, outlines a card before the camera pushes through it, and finally underlines the handle. A quiet **timecode HUD** runs in the corner like a monitor overlay, so the viewer feels every frame was placed on purpose.

The reference's lessons, kept in spirit: one accent, two-tone headlines, satellite chips, a camera punch-in on the biggest beat, transitions that are designed moves rather than cuts, and an ending that loops back to the opening. See `REFERENCE_ANALYSIS.md` for the full breakdown. What changes: the look moves from soft app-glass to **editorial cinema**: ink, one electric accent, wide grotesk display, and an italic serif accent word.

## The Frame

- **Canvas:** ink by default. Use paper (light) only as a deliberate contrast scene, at most once per piece, typically the before/after or the end card.
- **Layers, back to front (parallax: back slowest, front fastest):**
  1. *Back*: subtle grain (3% noise) plus a very slow radial signal glow (8% opacity) that drifts. Never flat black.
  2. *Mid*: content (type, clips, cards).
  3. *Front*: HUD, chips, cutline.
- **Safe zones (Instagram 9:16):** keep text inside `safe-side` 72px, below `safe-top` 250px and above `safe-bottom` 420px. Full-bleed video may ignore safe zones; text may not, except at a punch-in peak, where display type is *meant* to run off the side edges.
- **Axis:** one centred vertical axis. Off-axis placement is allowed only for chips (anchored to a hero's corner) and the HUD.

## Typography rules

- Display is **Archivo Expanded (wdth 125), uppercase, 800–900**. It is the voice: big, wide, confident.
- **The emphasis word swaps to Instrument Serif Italic, lowercase**, often in signal colour. Example: `MOTION` *that* `MOVES`. This is the two-tone rule, done with a typeface change instead of only a colour change.
- Labels, HUD and chips use **JetBrains Mono uppercase**, tracked 0.08–0.14em.
- At most **3 lines** of display on screen. At most **6 words** per beat-moment.
- Minimum size on a 1080-wide frame is 24px (HUD). Body text is at least 40px.

## Composition Rules

1. **Hierarchy stack:** label (mono) → display → accent word → chip(s) → CTA. Never more than 4 levels visible.
2. **Work is the hero.** Best clips run full-bleed. Cards are used for comparison (2-up), sequence, or as a window the camera pushes into.
3. **Density rhythm:** alternate *sparse* (one word, lots of ink) and *dense* (clips, chips, HUD) scenes. Never two sparse scenes in a row.
4. **One accent:** signal colour covers no more than ~8% of any frame, except the CTA end card and one optional full-signal flash frame.
5. **Bookend:** the last frame rhymes with the first (same word, same position, or same cutline gesture), so the reel loops cleanly.

## Motion Rules

1. **Beat grid first.** Detect the beats (`npx hyperframes beats`), then place events:
   - every beat: something moves (a word, a chip, the HUD timecode tick, drift);
   - every bar (4 beats): a scene-level event (transition, punch-in, category change);
   - the strongest 1–2 accents in the track: the **hero moments** (camera punch-in with overflow type, smash cut, before/after split).
2. **Never static.** Every scene carries an idle drift: scale 1.00 → 1.03 or y ±8px on `drift` over the scene length. A hold longer than 2 beats is a bug.
3. **Small things overshoot, big things glide.** Chips and badges use `settle`. The camera, whips and full-frame moves use `push`. Text entrances use `snap`.
4. **Everything that enters must leave on purpose.** It exits through the transition (wiped by the cutline, pushed through, or smashed). Nothing simply fades out unless it's the final frame.
5. **Motion blur on speed.** Any move faster than one frame-width per 0.3 s gets directional blur (8–24px) at its fastest point.

## Text animation set

| Name | Use | Spec |
|---|---|---|
| **Rise** | default display entrance | each word in a mask; y 105% → 0, `snap`, 0.42 s, stagger 0.06 s |
| **Stretch** | hero word, punch-in moment | font-variation `wdth` 62 → 125 with letter-spacing -0.08em → -0.02em, `push`, 0.6 s |
| **Swap** | emphasis word | the sans word cross-dissolves to Instrument Serif Italic in signal colour, 0.3 s, with a 4px y-nudge |
| **Type-on** | HUD, labels, chips | mono characters at 0.025 s each, with a block cursor that blinks 2× then disappears |
| **Count** | stats (views, clients, years) | number rolls from 0 on `snap` over 0.8 s, then the chip settles |
| **Underline** | after any key word lands | cutline draws left → right under the word, `draw`, 0.35 s |

## Transition set (use 2–3 types per piece, plus smash cuts)

| Name | What happens | When |
|---|---|---|
| **Cutline Wipe** | A vertical 6px signal line sweeps across the frame on `draw`. The next scene is revealed behind it (clip-path) with a 1-frame signal edge glow. | Default scene change on a bar line |
| **Split** | The cutline drops vertically through the centre and holds. The left side is RAW, the right side EDIT. Then the line slides to reveal the full edit. | Before/after proof |
| **Push-Through** | The cutline traces a card's border; the camera scales into the card (`push`, 0.8 s) until the card becomes full-bleed. | Entering a hero clip |
| **Whip** | Content slides out at 1.2× frame width with 24px x-blur; the next scene enters from the opposite side, 0.35 s, `push`. | Energy bursts between work clips |
| **Iris** | A signal disc expands from a point (an element, a dot, the REC light) to fill the frame, then the next scene is revealed inside it. | Act changes (hook → identity, work → end) |
| **Smash** | A hard cut on a strong downbeat with a 2-frame signal or paper flash. | The hero accents only (max 2) |

## Pacing template (15 s, about 120 BPM = 30 beats)

| Beats | Time | Act | Energy |
|---|---|---|---|
| 1–3 | 0.0 – 1.5 s | **Hook**: open *on motion* (a full-bleed hero clip, or one huge word that stretches) | 9/10 |
| 4–7 | 1.5 – 3.5 s | **Identity**: name lockup, accent-word swap, handle chip | 6/10 |
| 8–21 | 3.5 – 10.5 s | **Work**: 4–6 clips, full-bleed/card alternation, category HUD labels, 1–2 stat chips | 8 → 10/10 |
| 22–25 | 10.5 – 12.5 s | **Proof**: raw vs edit split | 7/10 |
| 26–30 | 12.5 – 15.0 s | **End**: iris or push-through into the profile lockup, CTA, cutline underline, loop rhyme | 5/10 |

## Do's and Don'ts

- Do let the work carry the piece; graphics frame it, they don't bury it.
- Do lock every scene change to the beat grid.
- Do keep the HUD timecode honest (frame-accurate to the composition time).
- Don't use more than one accent colour, gradients on type, or drop-shadowed text.
- Don't use stock "glitch" or "light leak" overlays. Energy comes from timing, not effects.
- Don't fade between scenes. Wipe, split, push, whip, iris or smash.
- Don't put text in the bottom 420px.

## Reusing the system

1. Copy `motion-system/` into a new project (or point a HyperFrames project's `frame.md` at it).
2. Swap `colors.signal` for the client's accent if needed; everything else holds.
3. Re-time to the new track: `npx hyperframes beats`, then map acts to bars using the pacing template.
4. Build scenes from the components in `cutline.css` and the helpers in `cutline.js`.
