import { Config } from "@remotion/cli/config";

// Deterministic, high-quality H.264 output.
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setCodec("h264");
Config.setCrf(16);
Config.setPixelFormat("yuv420p");
Config.setOverwriteOutput(true);
Config.setConcurrency(4);

// Use a pre-installed Chromium when one is provided (e.g. offline CI / cloud containers).
if (process.env.REMOTION_CHROME) {
  Config.setBrowserExecutable(process.env.REMOTION_CHROME);
}
