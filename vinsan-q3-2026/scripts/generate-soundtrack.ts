/**
 * Original, deterministic soundtrack synthesised from scratch (no samples,
 * no licensing). Cue points are derived from the scene timeline, so the music
 * follows any change to scene durations.
 *
 *   npm run soundtrack   →  public/audio/soundtrack.wav
 *
 * Layers: warm minor-key pad · deep sub pulse (from scene 2) · soft piano-like
 * plucks · faint data ticks during chart draws · air whooshes on transitions ·
 * a restrained low impact + resolve on the final statement.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { FPS, sceneStart, TIMELINE, TOTAL_FRAMES } from "../src/config/timeline";

const SR = 48000;
const DUR = TOTAL_FRAMES / FPS + 0.5;
const N = Math.ceil(DUR * SR);
const L = new Float32Array(N);
const R = new Float32Array(N);

const sec = (frames: number) => frames / FPS;
const at = (id: Parameters<typeof sceneStart>[0], localFrame = 0) => sec(sceneStart(id) + localFrame);

// deterministic PRNG
let seed = 1234567;
const rand = () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);
const TAU = Math.PI * 2;

function add(i: number, l: number, r: number) {
  if (i >= 0 && i < N) {
    L[i] += l;
    R[i] += r;
  }
}

// ---------------------------------------------------------------- PAD
// Chords (MIDI) per scene: D minor world, lifting to F/Bb major for the
// resilience section and resolving on D-major-ish colour at the end.
const CHORDS: Record<string, number[]> = {
  opening: [50, 57, 62, 65, 69], // Dm9-ish
  quarterView: [46, 53, 58, 62, 65], // Bb
  marketPerformance: [50, 57, 60, 65, 69], // Dm7
  monthlyMovement: [43, 50, 55, 58, 62], // Gm
  participation: [41, 48, 57, 60, 64], // Fmaj7
  mfIndustry: [46, 53, 57, 62, 65], // Bbmaj7
  contrast: [48, 55, 60, 64, 67], // C
  finalMessage: [50, 57, 62, 66, 69], // D (Picardy lift)
};

function pad() {
  TIMELINE.forEach((s, idx) => {
    const t0 = sec(s.from) - (idx === 0 ? 0 : 0.6);
    const t1 = sec(s.from + s.duration) + 0.9;
    const chord = CHORDS[s.id];
    const a = 0.9; // attack
    const rel = 1.2;
    for (let i = Math.max(0, Math.floor(t0 * SR)); i < Math.min(N, Math.floor((t1 + rel) * SR)); i++) {
      const t = i / SR;
      let env = Math.min(1, (t - t0) / a);
      if (t > t1) env *= Math.max(0, 1 - (t - t1) / rel);
      env = Math.max(0, env);
      if (env <= 0) continue;
      let l = 0;
      let r = 0;
      chord.forEach((n, k) => {
        const f = midi(n);
        const lfo = 1 + 0.002 * Math.sin(TAU * 0.13 * t + k);
        // soft "analog" voice: fundamental + gentle 2nd/3rd partials, detuned L/R
        const vl = Math.sin(TAU * f * 0.9985 * lfo * t) + 0.28 * Math.sin(TAU * 2 * f * t + k) + 0.08 * Math.sin(TAU * 3 * f * 1.001 * t);
        const vr = Math.sin(TAU * f * 1.0015 * lfo * t + 0.5) + 0.28 * Math.sin(TAU * 2 * f * t + k + 0.3) + 0.08 * Math.sin(TAU * 3 * f * 0.999 * t);
        const g = k === 0 ? 0.9 : 0.55;
        l += vl * g;
        r += vr * g;
      });
      const g = 0.03 * env;
      add(i, l * g, r * g);
    }
  });
}

// ---------------------------------------------------------------- SUB PULSE
const BPM = 96;
const BEAT = 60 / BPM;
function pulse() {
  const start = at("quarterView");
  const end = at("finalMessage", 50);
  for (let t = start; t < end; t += BEAT) {
    // gradual build: pulse gets slightly stronger through the piece
    const build = 0.55 + 0.45 * ((t - start) / (end - start));
    const i0 = Math.floor(t * SR);
    const len = Math.floor(0.45 * SR);
    for (let j = 0; j < len; j++) {
      const tt = j / SR;
      const f = 42 + 26 * Math.exp(-tt * 28);
      const env = Math.exp(-tt * 7) * Math.min(1, tt * 400);
      const v = Math.sin(TAU * f * tt) * env * 0.2 * build;
      add(i0 + j, v, v);
    }
    // off-beat soft "digital pulse" (filtered click)
    const off = Math.floor((t + BEAT / 2) * SR);
    let lp = 0;
    for (let j = 0; j < 0.06 * SR; j++) {
      const env = Math.exp(-(j / SR) * 70);
      lp += 0.25 * ((rand() * 2 - 1) - lp);
      const v = lp * env * 0.03 * build;
      add(off + j, v * 0.8, v);
    }
  }
}

// ---------------------------------------------------------------- PLUCKS
function pluck(t: number, note: number, gain = 0.09, pan = 0) {
  const f = midi(note);
  const i0 = Math.floor(t * SR);
  const len = Math.floor(3.5 * SR);
  for (let j = 0; j < len; j++) {
    const tt = j / SR;
    const env = Math.exp(-tt * 1.6) * Math.min(1, tt * 300);
    const v =
      (Math.sin(TAU * f * tt) + 0.35 * Math.sin(TAU * 2 * f * tt) * Math.exp(-tt * 3) + 0.12 * Math.sin(TAU * 3 * f * tt) * Math.exp(-tt * 5)) *
      env *
      gain;
    add(i0 + j, v * (1 - pan) , v * (1 + pan));
  }
}

function plucks() {
  // opening motif
  [69, 72, 74, 77].forEach((n, k) => pluck(at("opening", 8 + k * 14), n, 0.07, k % 2 ? 0.25 : -0.25));
  // a note on each month in the quarter view
  [74, 72, 69].forEach((n, k) => pluck(at("quarterView", 16 + k * 30), n, 0.06, (k - 1) * 0.3));
  // monthly bars: up / sideways / down
  [76, 74, 67].forEach((n, k) => pluck(at("monthlyMovement", [22, 52, 82][k]), n, 0.06, (k - 1) * 0.35));
  // participation — rising
  [65, 69, 72].forEach((n, k) => pluck(at("participation", 8 + k * 60), n, 0.06, 0));
  // contrast switch
  pluck(at("contrast", 72), 72, 0.07, 0);
  pluck(at("contrast", 80), 76, 0.05, 0.2);
  // final statements
  pluck(at("finalMessage", 10), 74, 0.07, -0.15);
  pluck(at("finalMessage", 58), 78, 0.07, 0.15);
  [62, 66, 69, 74].forEach((n, k) => pluck(at("finalMessage", 112 + k * 4), n, 0.05, (k - 1.5) * 0.2));
}

// ---------------------------------------------------------------- DATA TICKS
function ticks(fromSec: number, toSec: number, rate = 12, gain = 0.035) {
  for (let t = fromSec; t < toSec; t += 1 / rate) {
    const i0 = Math.floor(t * SR);
    const f = 2600 + rand() * 900;
    for (let j = 0; j < 0.012 * SR; j++) {
      const tt = j / SR;
      const v = Math.sin(TAU * f * tt) * Math.exp(-tt * 500) * gain;
      add(i0 + j, v * (0.7 + rand() * 0.3), v * (0.7 + rand() * 0.3));
    }
  }
}

// ---------------------------------------------------------------- WHOOSH
function whoosh(center: number, dur = 0.9, gain = 0.09) {
  const i0 = Math.floor((center - dur * 0.6) * SR);
  const len = Math.floor(dur * SR);
  let lpL = 0;
  let lpR = 0;
  for (let j = 0; j < len; j++) {
    const x = j / len;
    const env = Math.pow(Math.sin(Math.PI * x), 2);
    const cutoff = 0.01 + 0.12 * Math.sin(Math.PI * x);
    lpL += cutoff * ((rand() * 2 - 1) - lpL);
    lpR += cutoff * ((rand() * 2 - 1) - lpR);
    add(i0 + j, lpL * env * gain * 2.5, lpR * env * gain * 2.5);
  }
}

// ---------------------------------------------------------------- IMPACT
function impact(t: number, gain = 0.28) {
  const i0 = Math.floor(t * SR);
  for (let j = 0; j < 2.5 * SR; j++) {
    const tt = j / SR;
    const f = 38 + 30 * Math.exp(-tt * 10);
    const v = Math.sin(TAU * f * tt) * Math.exp(-tt * 2.2) * Math.min(1, tt * 200) * gain;
    add(i0 + j, v, v);
  }
}

pad();
pulse();
plucks();
// chart-draw ticks
ticks(at("opening", 6), at("opening", 58), 10, 0.025);
ticks(at("marketPerformance", 18), at("marketPerformance", 98), 12, 0.03);
ticks(at("participation", 8), at("participation", 54), 14, 0.025);
ticks(at("mfIndustry", 12), at("mfIndustry", 60), 12, 0.022);
// transitions
TIMELINE.slice(1).forEach((s) => whoosh(sec(s.from) + 0.25, 0.9, s.id === "finalMessage" ? 0.12 : 0.07));
// key editorial moments
impact(at("contrast", 72), 0.18);
impact(at("finalMessage", 58), 0.24);

// ---------------------------------------------------------------- MASTER
// gentle global fade in/out, soft-clip, normalise to -3 dBFS
const fadeIn = 0.8 * SR;
const fadeOut = 2.2 * SR;
const endSample = Math.floor((TOTAL_FRAMES / FPS) * SR);
let peak = 0;
for (let i = 0; i < N; i++) {
  let g = 1;
  if (i < fadeIn) g *= i / fadeIn;
  if (i > endSample - fadeOut) g *= Math.max(0, (endSample - i) / fadeOut);
  L[i] = Math.tanh(L[i] * 1.2) * g;
  R[i] = Math.tanh(R[i] * 1.2) * g;
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const norm = peak > 0 ? 0.708 / peak : 1;

const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + N * 4, 4);
buf.write("WAVE", 8);
buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * norm)) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * norm)) * 32767), 46 + i * 4);
}
const out = join(__dirname, "..", "public", "audio", "soundtrack.wav");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, buf);
console.log(`Soundtrack written: ${out} (${DUR.toFixed(1)}s, ${SR} Hz stereo)`);
