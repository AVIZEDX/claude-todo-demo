// Frame-accurate renderer: seeks the GSAP timeline frame by frame in headless
// Chromium and pipes screenshots into ffmpeg.
//
//   node render.mjs                     → out/portfolio-reel.mp4 (1080×1920, 30 fps)
//   node render.mjs --stills 2,5,12     → out/still-<t>.png only (quick checks)
//   node render.mjs --audio music.mp3   → mux a soundtrack (trimmed + faded)
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); }
catch { ({ chromium } = require(require.resolve("playwright", { paths: [process.env.NODE_PATH || "", "/opt/node-tools/node_modules", "/usr/local/lib/node_modules"] }))); }

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const FPS = Number(opt("--fps") || 30);
const W = 1080, H = 1920;
const outDir = resolve(here, "out");
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required", "--allow-file-access-from-files"] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.error("page error:", e.message));
await page.goto(pathToFileURL(resolve(here, "index.html")).href);
await page.evaluate(() => window.__ready);
const duration = await page.evaluate(() => window.__duration);

if (opt("--stills")) {
  for (const t of opt("--stills").split(",").map(Number)) {
    // play up to t in frame steps so callbacks and function-based values resolve as in the real render
    await page.evaluate(async (t) => { await window.__seek(t); }, t);
    await page.screenshot({ path: resolve(outDir, `still-${t}.png`) });
    console.log("still", t);
  }
  await browser.close();
  process.exit(0);
}

const out = resolve(outDir, opt("--out") || "portfolio-reel.mp4");
const audio = opt("--audio");
const ff = spawn("ffmpeg", [
  "-y", "-loglevel", "error",
  "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "png", "-i", "-",
  ...(audio ? ["-i", audio, "-af", `afade=t=out:st=${(duration - 1.2).toFixed(2)}:d=1.2`, "-c:a", "aac", "-b:a", "192k", "-shortest"] : []),
  "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", "-r", String(FPS),
  "-movflags", "+faststart", out,
], { stdio: ["pipe", "inherit", "inherit"] });

const frames = Math.round(duration * FPS);
const t0 = Date.now();
for (let f = 0; f < frames; f++) {
  await page.evaluate((t) => window.__seek(t), f / FPS);
  const buf = await page.screenshot({ type: "png" });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  if (f % 60 === 0) console.log(`frame ${f}/${frames}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
ff.stdin.end();
await new Promise((r) => ff.on("close", r));
await browser.close();
console.log("wrote", out);
