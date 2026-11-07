import React from "react";
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import {FLASHES, FPS, LE, LS, PART2_START, PULSES, TOTAL_FRAMES, sf, wetAt} from "./config";
import {Guides} from "./Hud";
import {Subtitles} from "./Subtitles";
import {Scene} from "./util";
import {EndingScene, FactorsScene, Finale, Intro, LifeScene, MonsoonScene, MythScene, PangaeaScene, PulsesScene, TitleScene, VolcanoA, WaterCycle} from "./scenes/Scenes";

const span = (a: number, b: number, first = false, last = false) => ({
  from: first ? 0 : sf(LS(a)) - 8,
  to: last ? TOTAL_FRAMES : sf(LE(b)) + 8,
});

const Grade: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{background: "linear-gradient(to top, rgba(0,0,0,.6) 0%, rgba(0,0,0,0) 28%)", pointerEvents: "none"}} />
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 46% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)", pointerEvents: "none"}} />
      <AbsoluteFill style={{mixBlendMode: "overlay", opacity: 0.12, pointerEvents: "none"}}>
        <svg width={1080} height={1920}>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 7} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width={1080} height={1920} filter="url(#grain)" />
        </svg>
      </AbsoluteFill>
    </>
  );
};

export const Main: React.FC<{showGuides: boolean}> = ({showGuides}) => {
  const f = useCurrentFrame();
  const titleBoom = LS(5) + (LE(5) - LS(5)) * 0.52;
  const booms = [titleBoom, LS(11) + 0.6, ...PULSES, LS(52) + 0.6];
  return (
    <AbsoluteFill style={{background: "#000", filter: "contrast(1.06) saturate(1.08)"}}>
      <Scene {...span(0, 2, true)}><Intro /></Scene>
      <Scene {...span(3, 7)}><TitleScene /></Scene>
      <Scene {...span(8, 9)}><PangaeaScene /></Scene>
      <Scene {...span(10, 15)}><VolcanoA /></Scene>
      <Scene {...span(16, 24)}><WaterCycle /></Scene>
      <Scene {...span(25, 27)}><MonsoonScene /></Scene>
      <Scene {...span(28, 31)}><MythScene /></Scene>
      <Scene {...span(32, 36)}><PulsesScene /></Scene>
      <Scene {...span(37, 42)}><LifeScene /></Scene>
      <Scene {...span(43, 44)}><FactorsScene /></Scene>
      <Scene {...span(45, 46)}><EndingScene /></Scene>
      <Scene {...span(47, 52, false, true)}><Finale /></Scene>

      <Grade />
      <Subtitles />
      {showGuides && <Guides />}
      <AbsoluteFill style={{background: "#000", opacity: interpolate(f, [TOTAL_FRAMES - 40, TOTAL_FRAMES - 2], [0, 1], {extrapolateLeft: "clamp"}), pointerEvents: "none"}} />

      {/* ── Narasi (dua file voice) ── */}
      <Sequence from={0} durationInFrames={PART2_START}>
        <Audio src={staticFile("voice_1.mp3")} />
      </Sequence>
      <Sequence from={PART2_START}>
        <Audio src={staticFile("voice_2.mp3")} />
      </Sequence>

      {/* ── Suasana: hujan, drone, petir, dentuman ── */}
      <Audio
        src={staticFile("sfx/rain.mp3")}
        loop
        volume={(fr) => Math.min(1, fr / 60) * (0.03 + 0.2 * wetAt(fr / FPS))}
      />
      <Audio src={staticFile("sfx/drone.mp3")} loop volume={(fr) => Math.min(1, fr / 90) * 0.16} />
      {FLASHES.map((t, i) => (
        <Sequence key={`th${i}`} from={sf(t) + 8} durationInFrames={150}>
          <Audio src={staticFile("sfx/thunder.mp3")} volume={0.45} />
        </Sequence>
      ))}
      {booms.map((t, i) => (
        <Sequence key={`bm${i}`} from={sf(t)} durationInFrames={90}>
          <Audio src={staticFile("sfx/boom.mp3")} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
