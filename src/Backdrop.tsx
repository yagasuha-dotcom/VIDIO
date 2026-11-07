import React, {useMemo} from "react";
import {AbsoluteFill, interpolate, interpolateColors, random} from "remotion";
import {FPS, H, W} from "./config";
import {useAbsFrame} from "./util";

/* ───────────── LANGIT ───────────── */
export const Sky: React.FC<{wet: number; sun?: boolean}> = ({wet, sun = true}) => {
  const top = interpolateColors(wet, [0, 1], ["#40344a", "#05090c"]);
  const mid = interpolateColors(wet, [0, 1], ["#c47a4b", "#15272b"]);
  const bot = interpolateColors(wet, [0, 1], ["#f3bd72", "#3b5654"]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${top} 0%, ${mid} 52%, ${bot} 84%)`}} />
      {sun && (
        <AbsoluteFill
          style={{
            opacity: Math.max(0, 1 - wet * 1.4),
            background: "radial-gradient(circle at 28% 40%, rgba(255,236,190,.95) 0%, rgba(255,190,110,.45) 14%, rgba(255,150,80,0) 42%)",
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/* ───────────── PEGUNUNGAN BERLAPIS ───────────── */
const ridge = (seed: number, base: number, amp: number) => {
  let d = `M -50 1920 L -50 ${base}`;
  for (let x = -50; x <= 1130; x += 30) {
    const n =
      Math.sin(x * 0.006 + seed) * 0.5 +
      Math.sin(x * 0.017 + seed * 2.1) * 0.3 +
      Math.sin(x * 0.043 + seed * 3.7) * 0.2 +
      (random(`m${seed}-${x}`) - 0.5) * 0.12;
    d += ` L ${x} ${base - amp * (0.55 + 0.45 * n)}`;
  }
  return d + " L 1130 1920 Z";
};

export const Mountains: React.FC<{wet: number}> = ({wet}) => {
  const f = useAbsFrame();
  const layers = useMemo(
    () => [
      {d: ridge(1.2, 1040, 200), dry: "#a8654a", wet: "#35504f", par: 0.3},
      {d: ridge(2.7, 1130, 150), dry: "#86503b", wet: "#27403f", par: 0.6},
      {d: ridge(4.1, 1230, 120), dry: "#613b2c", wet: "#1a2f31", par: 1},
      {d: ridge(5.6, 1330, 90), dry: "#40271f", wet: "#0f1e21", par: 1.5},
    ],
    []
  );
  return (
    <svg width={W} height={H} style={{position: "absolute", inset: 0}}>
      {layers.map((l, i) => (
        <path
          key={i}
          d={l.d}
          fill={interpolateColors(wet, [0, 1], [l.dry, l.wet])}
          transform={`translate(${Math.sin(f * 0.004) * 14 * l.par},0)`}
        />
      ))}
    </svg>
  );
};

/* ───────────── AWAN VOLUMETRIK (turbulensi fraktal) ───────────── */
export const CloudBank: React.FC<{
  id: string;
  y: number;
  h: number;
  wet: number;
  cover?: number;
  speed?: number;
  scale?: number;
  opacity?: number;
}> = ({id, y, h, wet, cover, speed = 0.12, scale = 1, opacity = 1}) => {
  const f = useAbsFrame();
  const c = cover ?? 0.35 + 0.65 * wet;
  const r = interpolate(wet, [0, 1], [0.98, 0.26]);
  const g = interpolate(wet, [0, 1], [0.86, 0.32]);
  const b = interpolate(wet, [0, 1], [0.76, 0.36]);
  const off = -1.2 + 0.62 * c;
  const mask = "linear-gradient(to bottom, transparent 0%, #000 30%, #000 70%, transparent 100%)";
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: y,
        width: W,
        height: h,
        overflow: "hidden",
        opacity,
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    >
      <svg width={3200} height={h} style={{position: "absolute", left: -700 - f * speed, top: 0}}>
        <filter id={id} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency={`${0.0022 * scale} ${0.0068 * scale}`} numOctaves={5} seed={7} />
          <feColorMatrix type="matrix" values={`0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  2.3 0 0 0 ${off}`} />
        </filter>
        <rect width={3200} height={h} filter={`url(#${id})`} />
      </svg>
    </div>
  );
};

/* ───────────── HUJAN ───────────── */
export const Rain: React.FC<{amount: number; wind?: number; opacity?: number; speed?: number}> = ({
  amount,
  wind = 0.18,
  opacity = 1,
  speed = 1,
}) => {
  const f = useAbsFrame();
  const drops = useMemo(
    () =>
      Array.from({length: 300}, (_, i) => ({
        x: random(`rx${i}`) * 1500 - 200,
        o: random(`ro${i}`),
        s: 30 + random(`rs${i}`) * 28,
        l: 34 + random(`rl${i}`) * 70,
        w: 0.9 + random(`rw${i}`) * 2.2,
        a: 0.15 + random(`ra${i}`) * 0.4,
      })),
    []
  );
  const n = Math.floor(drops.length * Math.min(1, Math.max(0, amount)));
  if (n <= 0) return null;
  return (
    <svg width={W} height={H} style={{position: "absolute", inset: 0, opacity}}>
      {drops.slice(0, n).map((d, i) => {
        const y = ((f * d.s * speed + d.o * 2400) % 2300) - 200;
        const x = d.x - y * wind;
        return (
          <line
            key={i}
            x1={x}
            y1={y}
            x2={x - wind * d.l}
            y2={y + d.l}
            stroke={`rgba(205,228,240,${d.a})`}
            strokeWidth={d.w}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

/* ───────────── KILAT ───────────── */
export const Lightning: React.FC<{times: number[]}> = ({times}) => {
  const f = useAbsFrame();
  let flash = 0;
  let boltIdx = -1;
  times.forEach((t, k) => {
    const local = f - Math.round(t * FPS);
    if (local >= 0 && local < 14) {
      flash = Math.max(flash, interpolate(local, [0, 1, 3, 4, 6, 8, 13], [0, 0.85, 0.2, 0.7, 0.15, 0.3, 0]));
      if (local < 9) boltIdx = k;
    }
  });
  const bolt = useMemo(() => {
    return times.map((_, k) => {
      let x = 130 + random(`bx${k}`) * 300;
      let y = -20;
      const pts = [`${x},${y}`];
      while (y < 900) {
        y += 55 + random(`by${k}-${y}`) * 40;
        x += (random(`bz${k}-${y}`) - 0.5) * 110;
        pts.push(`${x},${y}`);
      }
      return pts.join(" ");
    });
  }, [times]);
  if (flash <= 0) return null;
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <AbsoluteFill style={{background: "#cfe4ff", opacity: flash * 0.45}} />
      {boltIdx >= 0 && (
        <svg width={W} height={H} style={{position: "absolute", inset: 0, opacity: flash, filter: "drop-shadow(0 0 14px #9cc8ff)"}}>
          <polyline points={bolt[boltIdx]} fill="none" stroke="#fff" strokeWidth={5} strokeLinejoin="round" />
        </svg>
      )}
    </AbsoluteFill>
  );
};

/* ───────────── SINAR MATAHARI ───────────── */
export const SunRays: React.FC<{amount: number}> = ({amount}) => {
  const f = useAbsFrame();
  if (amount <= 0) return null;
  return (
    <svg width={W} height={H} style={{position: "absolute", inset: 0, opacity: amount * 0.7, mixBlendMode: "screen", filter: "blur(10px)"}}>
      {Array.from({length: 7}, (_, i) => {
        const a = 0.55 + i * 0.16 + Math.sin(f * 0.01 + i) * 0.03;
        const w = 0.05 + (i % 3) * 0.02;
        const L = 2400;
        const x0 = 230, y0 = 120;
        return (
          <polygon
            key={i}
            points={`${x0},${y0} ${x0 + Math.cos(a - w) * L},${y0 + Math.sin(a - w) * L} ${x0 + Math.cos(a + w) * L},${y0 + Math.sin(a + w) * L}`}
            fill={`rgba(255,226,170,${0.16 + (i % 2) * 0.08})`}
          />
        );
      })}
    </svg>
  );
};

/* ───────────── PAKET LANSKAP LENGKAP ───────────── */
export const Landscape: React.FC<{
  id: string;
  wet: number;
  rain?: number;
  zoom?: number;
  origin?: string;
  cloudCover?: number;
}> = ({id, wet, rain, zoom = 1, origin = "50% 45%", cloudCover}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: origin}}>
      <Sky wet={wet} />
      <CloudBank id={`${id}a`} y={120} h={640} wet={wet} cover={cloudCover} speed={0.14} />
      <CloudBank id={`${id}b`} y={420} h={560} wet={wet} cover={cloudCover} speed={0.22} scale={1.3} opacity={0.8} />
      <Mountains wet={wet} />
    </AbsoluteFill>
    <Rain amount={rain ?? Math.max(0, (wet - 0.35) / 0.65)} />
  </AbsoluteFill>
);
