/**
 * Render QA stills at key moments of every scene → out/stills/*.png
 *   npm run stills              (default key frames)
 *   npm run stills -- 120 480   (specific frames)
 */
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { TIMELINE } from "../src/config/timeline";

const browserExecutable = process.env.REMOTION_CHROME || undefined;

async function main() {
  const args = process.argv.slice(2).map(Number).filter((n) => !Number.isNaN(n));
  const frames = args.length
    ? args
    : TIMELINE.flatMap((s) => [s.from + Math.round(s.duration * 0.45), s.from + s.duration - 6]);
  const serveUrl = await bundle({ entryPoint: join(__dirname, "..", "src", "index.ts") });
  const composition = await selectComposition({ serveUrl, id: "VinsanQ3Glance", browserExecutable });
  const outDir = join(__dirname, "..", "out", "stills");
  mkdirSync(outDir, { recursive: true });
  for (const frame of frames) {
    const output = join(outDir, `f${String(frame).padStart(4, "0")}.png`);
    await renderStill({ composition, serveUrl, frame, output, browserExecutable });
    console.log("still", output);
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
