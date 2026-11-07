import React from "react";
import {Composition} from "remotion";
import {FPS, H, TOTAL_FRAMES, W} from "./config";
import {Main} from "./Main";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="TikTokDoc"
    component={Main}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={W}
    height={H}
    defaultProps={{showGuides: false}}
  />
);
