# Portfolio reel — Avishek

A 9:16 portfolio reel (1080×1920, 30 fps, ~28.5 s) built in HTML and GSAP, and rendered to MP4 by seeking it frame by frame in headless Chromium.

**Output:** `out/portfolio-reel.mp4`

## Scenes
| Time | Scene |
|---|---|
| 0.0–1.6 s | Red orbit world, glass tile with "Looking For **Video Editor**", hand-drawn underline |
| 1.25–1.8 s | White bloom transition |
| 1.6–7.9 s | Portrait, "Hello, **I'm Avishek**", role line typing on, "See My Work" CTA, camera punch-in, "2+ years" card, "Premium-quality edits" chip, cursor click |
| 7.9–8.7 s | Hand-drawn arrow whip to white |
| 8.7–23.9 s | Continuous carousel. The heading retypes in place: Talking Head, Event Video, Festival Reels, Cinematic Reels |
| 23.9–24.5 s | Scatter-zoom and flash |
| 24.4–28.5 s | "Level Up Your **Content**" and a pulsing "DM **NOW**" pill |

## Edit
All text and clips live in the `CONFIG` block at the top of the `<script>` in `index.html`.

### Add your real clips
1. Put vertical clips in `assets/clips/`. Use WebM (VP9), because headless Chromium has no H.264 support:
   `ffmpeg -i talking1.mp4 -vf scale=720:-2 -c:v libvpx-vp9 -b:v 3M -an assets/clips/talking-1.webm`
2. List the clips under each category, e.g. `clips: ["assets/clips/talking-1.webm", ...]`.
   A category with no clips shows 4 designed placeholder cards.

## Render
```bash
node render.mjs                        # full MP4 → out/portfolio-reel.mp4
node render.mjs --stills 2,5,12        # quick PNG checks
node render.mjs --audio music.mp3      # add a soundtrack, with a fade-out
```
Requires Node 22+, ffmpeg and Playwright (`npm i playwright`). In this cloud environment, prefix the command with `NODE_PATH=/opt/node-tools/node_modules`.

Preview in a browser: open `index.html?play` from a local server.
