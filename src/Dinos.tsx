import React from "react";
import {random} from "remotion";
import {useAbsFrame} from "./util";

/** Dinosaurus theropoda awal (mirip Eoraptor/Herrerasaurus), siluet bercahaya tepi. */
export const Theropod: React.FC<{x: number; y: number; scale?: number; flip?: boolean; color?: string; phase?: number; speed?: number}> = ({
  x, y, scale = 1, flip = false, color = "#10181a", phase = 0, speed = 0.22,
}) => {
  const f = useAbsFrame();
  const s = Math.sin(f * speed + phase);
  const c = Math.cos(f * speed + phase);
  const bob = Math.abs(c) * 4;
  const leg = (a: number) => (
    <g transform={`translate(170 150) rotate(${a})`}>
      <polyline points="0,0 16,46 -8,88 26,98" fill="none" stroke={color} strokeWidth={17} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
  return (
    <svg
      width={400 * scale}
      height={260 * scale}
      viewBox="0 0 400 260"
      style={{position: "absolute", left: x, top: y, transform: flip ? "scaleX(-1)" : undefined, filter: "drop-shadow(0 0 5px rgba(255,205,150,.35))"}}
    >
      <g transform={`translate(0 ${bob})`}>
        {leg(s * 24)}
        {leg(-s * 24)}
        <path d="M128 104 C90 112 50 130 8 158 C55 150 95 150 135 142 Z" fill={color} />
        <ellipse cx="190" cy="122" rx="72" ry="38" transform="rotate(-8 190 122)" fill={color} />
        <path d="M235 100 C260 80 275 60 290 52 L304 66 C292 78 280 98 262 124 Z" fill={color} />
        <path d="M284 44 C310 34 338 40 358 56 L352 66 L318 63 L300 78 Z" fill={color} />
        <polyline points="244,128 262,142 276,136" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" />
        <circle cx="312" cy="52" r="3" fill="#ffd9a0" />
      </g>
    </svg>
  );
};

/** Prosauropoda berleher panjang (mirip Plateosaurus) */
export const Prosauropod: React.FC<{x: number; y: number; scale?: number; flip?: boolean; color?: string; phase?: number; speed?: number}> = ({
  x, y, scale = 1, flip = false, color = "#0d1517", phase = 0, speed = 0.12,
}) => {
  const f = useAbsFrame();
  const s = Math.sin(f * speed + phase);
  const bob = Math.abs(Math.cos(f * speed + phase)) * 3;
  const leg = (hx: number, a: number) => (
    <g transform={`translate(${hx} 176) rotate(${a})`}>
      <polyline points="0,0 6,44 0,84" fill="none" stroke={color} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
  return (
    <svg
      width={560 * scale}
      height={330 * scale}
      viewBox="0 0 560 330"
      style={{position: "absolute", left: x, top: y, transform: flip ? "scaleX(-1)" : undefined, filter: "drop-shadow(0 0 5px rgba(255,205,150,.3))"}}
    >
      <g transform={`translate(0 ${bob})`}>
        {leg(150, -s * 14)}
        {leg(330, s * 14)}
        <path d="M120 150 C80 170 40 200 4 238 C60 214 110 200 150 196 Z" fill={color} />
        <ellipse cx="250" cy="150" rx="140" ry="62" fill={color} />
        <path d="M340 120 C390 96 408 52 424 30 L446 40 C436 74 424 120 396 166 Z" fill={color} />
        <path d="M416 18 C436 10 462 14 482 28 L474 40 L440 38 Z" fill={color} />
        {leg(180, s * 14)}
        {leg(300, -s * 14)}
        <circle cx="448" cy="24" r="3" fill="#ffd9a0" />
      </g>
    </svg>
  );
};

/* ───────────── TUMBUHAN PURBA ───────────── */
const Conifer: React.FC<{x: number; y: number; s: number; c1: string; c2: string; sway: number}> = ({x, y, s, c1, c2, sway}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${sway})`}>
    <rect x={-6} y={-30} width={12} height={34} fill={c2} />
    <polygon points="0,-300 -64,-130 64,-130" fill={c1} />
    <polygon points="0,-240 -84,-80 84,-80" fill={c1} />
    <polygon points="0,-170 -104,-20 104,-20" fill={c2} />
  </g>
);

const Cycad: React.FC<{x: number; y: number; s: number; c1: string; sway: number}> = ({x, y, s, c1, sway}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-12 0 Q-8 -60 -14 -120 L14 -120 Q8 -60 12 0 Z" fill={c1} />
    {Array.from({length: 11}, (_, i) => {
      const a = -160 + i * 32 + sway * 4;
      return (
        <g key={i} transform={`translate(0 -120) rotate(${a})`}>
          <path d="M0 0 Q70 -30 150 10" fill="none" stroke={c1} strokeWidth={9} strokeLinecap="round" />
          <path d="M20 -6 Q75 -50 150 10" fill="none" stroke={c1} strokeWidth={5} strokeLinecap="round" />
        </g>
      );
    })}
  </g>
);

export const Forest: React.FC<{wet: number}> = ({wet}) => {
  const f = useAbsFrame();
  const col = (d: string, w: string) => (wet > 0.5 ? w : d);
  const layers = [
    {y: 1200, s: 0.5, c1: "#1d3a36", c2: "#142a29", n: 9},
    {y: 1290, s: 0.8, c1: "#12292a", c2: "#0c1d1f", n: 7},
    {y: 1400, s: 1.15, c1: "#0a1a1b", c2: "#071314", n: 5},
  ];
  return (
    <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
      {layers.map((L, li) =>
        Array.from({length: L.n}, (_, i) => {
          const x = (i / L.n) * 1300 - 120 + random(`fx${li}${i}`) * 90;
          const sway = Math.sin(f * 0.03 + i * 1.7 + li) * 1.2;
          return (i + li) % 3 === 0 ? (
            <Cycad key={`${li}-${i}`} x={x} y={L.y} s={L.s * (0.9 + random(`fs${li}${i}`) * 0.5)} c1={L.c2} sway={sway} />
          ) : (
            <Conifer key={`${li}-${i}`} x={x} y={L.y} s={L.s * (0.8 + random(`fs${li}${i}`) * 0.6)} c1={L.c1} c2={L.c2} sway={sway} />
          );
        })
      )}
      <rect x={0} y={1380} width={1080} height={540} fill="#050c0d" />
    </svg>
  );
};
