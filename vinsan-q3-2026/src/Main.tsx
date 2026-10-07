import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Background } from "./components/Background";
import { Folio } from "./components/Folio";
import { SceneShell } from "./components/SceneShell";
import { AUDIO } from "./config/audio";
import { type SceneId, TIMELINE, TRANSITION_FRAMES } from "./config/timeline";
import { S01Opening } from "./scenes/S01Opening";
import { S02QuarterView } from "./scenes/S02QuarterView";
import { S03MarketPerformance } from "./scenes/S03MarketPerformance";
import { S04MonthlyMovement } from "./scenes/S04MonthlyMovement";
import { S05Participation } from "./scenes/S05Participation";
import { S06MFIndustry } from "./scenes/S06MFIndustry";
import { S07Contrast } from "./scenes/S07Contrast";
import { S08FinalMessage } from "./scenes/S08FinalMessage";

const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  opening: S01Opening,
  quarterView: S02QuarterView,
  marketPerformance: S03MarketPerformance,
  monthlyMovement: S04MonthlyMovement,
  participation: S05Participation,
  mfIndustry: S06MFIndustry,
  contrast: S07Contrast,
  finalMessage: S08FinalMessage,
};

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#050F1F" }}>
      <Background />
      {TIMELINE.map((s, i) => {
        const Comp = SCENE_COMPONENTS[s.id];
        const isFirst = i === 0;
        const isLast = i === TIMELINE.length - 1;
        return (
          <Sequence
            key={s.id}
            name={s.id}
            from={s.from}
            durationInFrames={s.duration + (isLast ? 0 : TRANSITION_FRAMES)}
          >
            <SceneShell duration={s.duration} enter={!isFirst} exit={!isLast} push={isLast ? 0.012 : 0.02}>
              <Comp />
            </SceneShell>
          </Sequence>
        );
      })}
      <Folio />
      {AUDIO.music && (
        <Audio
          src={staticFile(AUDIO.music)}
          volume={AUDIO.voiceover ? AUDIO.musicVolumeUnderVoice : AUDIO.musicVolume}
        />
      )}
      {AUDIO.voiceover && <Audio src={staticFile(AUDIO.voiceover)} volume={AUDIO.voiceoverVolume} />}
    </AbsoluteFill>
  );
};
