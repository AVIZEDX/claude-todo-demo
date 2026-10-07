import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./config/timeline";
import "./fonts";

export const RemotionRoot: React.FC = () => (
  <>
    {/* 16:9 master — 1920×1080. A 9:16 variant (1080×1920) can be registered
        here later with its own per-scene layouts; data/copy/timing are shared. */}
    <Composition
      id="VinsanQ3Glance"
      component={Main}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);
