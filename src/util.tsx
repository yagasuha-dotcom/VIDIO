import React, {createContext, useContext} from "react";
import {AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame} from "remotion";
import {FPS, SAFE, SAFE_W} from "./config";
import {FONT} from "./fonts";

const OffsetCtx = createContext(0);

/** Frame absolut komposisi (bukan frame lokal Sequence). */
export const useAbsFrame = () => useCurrentFrame() + useContext(OffsetCtx);
/** Waktu absolut dalam detik – sinkron dengan narasi. */
export const useT = () => useAbsFrame() / FPS;

export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const C = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

/** 0→1 mulai detik a selama d detik, easing keluar halus. */
export const rev = (t: number, a: number, d = 0.7) =>
  interpolate(t, [a, a + d], [0, 1], {...C, easing: OUT});
/** Terlihat dari detik a sampai b (fade in & fade out). */
export const win = (t: number, a: number, b: number, d = 0.5) => rev(t, a, d) * (1 - rev(t, b, d));
export const lin = (t: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(t, [a, b], [from, to], C);

const FadeIn: React.FC<{fade: number; children: React.ReactNode}> = ({fade, children}) => {
  const f = useCurrentFrame();
  const o = fade > 0 ? interpolate(f, [0, fade], [0, 1], {extrapolateRight: "clamp"}) : 1;
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

/** Pembungkus scene: dissolve masuk, menyediakan waktu absolut. */
export const Scene: React.FC<{from: number; to: number; fade?: number; children: React.ReactNode}> = ({
  from,
  to,
  fade = 16,
  children,
}) => (
  <Sequence from={from} durationInFrames={Math.max(1, to - from)}>
    <OffsetCtx.Provider value={from}>
      <FadeIn fade={from === 0 ? 0 : fade}>{children}</FadeIn>
    </OffsetCtx.Provider>
  </Sequence>
);

/** Teks rata tengah di dalam safe zone. */
export const Txt: React.FC<{
  y: number;
  size?: number;
  weight?: number;
  color?: string;
  opacity?: number;
  scale?: number;
  spacing?: number;
  shift?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({y, size = 60, weight = 800, color = "#fff", opacity = 1, scale = 1, spacing = 2, shift = 0, children, style}) => (
  <div
    style={{
      position: "absolute",
      left: SAFE.left,
      width: SAFE_W,
      top: y,
      textAlign: "center",
      fontFamily: FONT,
      fontWeight: weight,
      fontSize: size,
      lineHeight: 1.05,
      letterSpacing: spacing,
      color,
      opacity,
      transform: `translateY(${shift}px) scale(${scale})`,
      textShadow: "0 6px 30px rgba(0,0,0,.7), 0 1px 3px rgba(0,0,0,.8)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Glass: React.FC<{style?: React.CSSProperties; children: React.ReactNode}> = ({style, children}) => (
  <div
    style={{
      background: "linear-gradient(180deg, rgba(16,22,28,.66), rgba(8,12,16,.56))",
      border: "1px solid rgba(255,255,255,.18)",
      borderRadius: 28,
      backdropFilter: "blur(16px)",
      boxShadow: "0 18px 50px rgba(0,0,0,.45)",
      padding: "20px 32px",
      color: "#fff",
      fontFamily: FONT,
      ...style,
    }}
  >
    {children}
  </div>
);
