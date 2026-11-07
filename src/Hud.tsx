import React from "react";
import {COLORS, SAFE, SAFE_W} from "./config";
import {FONT} from "./fonts";
import {Glass} from "./util";

export const ChipBox: React.FC<{color?: string; title: string; sub?: string; icon?: React.ReactNode; size?: number}> = ({
  color = COLORS.accent, title, sub, icon, size = 38,
}) => (
  <Glass style={{display: "flex", alignItems: "center", gap: 18, padding: "16px 26px"}}>
    {icon}
    <div>
      <div style={{fontWeight: 800, fontSize: size, letterSpacing: 2, color}}>{title}</div>
      {sub && <div style={{fontWeight: 500, fontSize: 28, opacity: 0.85, marginTop: 4}}>{sub}</div>}
    </div>
  </Glass>
);

/** Chip kaca. Tanpa x → otomatis di tengah safe zone. */
export const Chip: React.FC<{
  y: number;
  o: number;
  x?: number;
  color?: string;
  title: string;
  sub?: string;
  shift?: number;
  size?: number;
  icon?: React.ReactNode;
}> = ({x, y, o, color, title, sub, shift = 18, size, icon}) => {
  const base: React.CSSProperties = {position: "absolute", top: y, opacity: o, transform: `translateY(${(1 - o) * shift}px)`};
  const inner = <ChipBox color={color} title={title} sub={sub} icon={icon} size={size} />;
  return x === undefined ? (
    <div style={{...base, left: SAFE.left, width: SAFE_W, display: "flex", justifyContent: "center"}}>{inner}</div>
  ) : (
    <div style={{...base, left: x}}>{inner}</div>
  );
};

/** Baris tengah untuk beberapa chip. */
export const Row: React.FC<{y: number; o: number; gap?: number; children: React.ReactNode}> = ({y, o, gap = 20, children}) => (
  <div style={{position: "absolute", top: y, left: SAFE.left, width: SAFE_W, display: "flex", justifyContent: "center", gap, opacity: o, transform: `translateY(${(1 - o) * 18}px)`}}>
    {children}
  </div>
);

export const Thermometer: React.FC<{x: number; y: number; level: number; o: number}> = ({x, y, level, o}) => (
  <svg width={150} height={470} viewBox="0 0 150 470" style={{position: "absolute", left: x, top: y, opacity: o}}>
    <rect x={55} y={10} width={40} height={360} rx={20} fill="rgba(10,16,20,.65)" stroke="rgba(255,255,255,.45)" strokeWidth={3} />
    <circle cx={75} cy={400} r={50} fill="rgba(10,16,20,.65)" stroke="rgba(255,255,255,.45)" strokeWidth={3} />
    <circle cx={75} cy={400} r={38} fill="#ff5a3a" />
    <rect x={64} y={370 - 340 * level} width={22} height={40 + 340 * level} rx={11} fill="#ff5a3a" />
    {[0, 1, 2, 3, 4].map((i) => (
      <line key={i} x1={100} x2={118} y1={40 + i * 70} y2={40 + i * 70} stroke="rgba(255,255,255,.5)" strokeWidth={3} />
    ))}
  </svg>
);

export const Co2: React.FC<{x: number; y: number; s?: number; o: number}> = ({x, y, s = 1, o}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      opacity: o,
      transform: `scale(${s})`,
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: 44,
      color: "#fff",
      background: "rgba(255,150,70,.35)",
      border: "2px solid rgba(255,200,140,.8)",
      borderRadius: 40,
      padding: "6px 22px",
      textShadow: "0 2px 8px rgba(0,0,0,.6)",
    }}
  >
    CO₂
  </div>
);

export const Icon: React.FC<{kind: "temp" | "volcano" | "leaf" | "drop" | "up" | "down"; color?: string; size?: number}> = ({kind, color = "#fff", size = 64}) => {
  const p = {width: size, height: size, viewBox: "0 0 64 64", fill: "none", stroke: color, strokeWidth: 4, strokeLinecap: "round", strokeLinejoin: "round"} as const;
  if (kind === "temp")
    return (
      <svg {...p}>
        <path d="M26 8h12v30a14 14 0 1 1-12 0z" />
        <path d="M32 24v22" />
      </svg>
    );
  if (kind === "volcano")
    return (
      <svg {...p}>
        <path d="M6 56 24 24h16l18 32z" />
        <path d="M26 14l-4-8M32 12V4M38 14l4-8" />
      </svg>
    );
  if (kind === "leaf")
    return (
      <svg {...p}>
        <path d="M10 54C10 24 30 8 56 8c0 26-14 46-40 46" />
        <path d="M10 54 38 26" />
      </svg>
    );
  if (kind === "drop")
    return (
      <svg {...p}>
        <path d="M32 6C20 24 14 32 14 42a18 18 0 0 0 36 0c0-10-6-18-18-36z" />
      </svg>
    );
  if (kind === "up")
    return (
      <svg {...p}>
        <path d="M32 54V10M14 28l18-18 18 18" />
      </svg>
    );
  return (
    <svg {...p}>
      <path d="M32 10v44M14 36l18 18 18-18" />
    </svg>
  );
};

/** Overlay panduan safe zone (aktifkan dengan props showGuides=true). */
export const Guides: React.FC = () => (
  <svg width={1080} height={1920} style={{position: "absolute", inset: 0, pointerEvents: "none"}}>
    <rect x={0} y={0} width={1080} height={SAFE.top} fill="rgba(255,0,0,.28)" />
    <rect x={0} y={SAFE.bottom} width={1080} height={1920 - SAFE.bottom} fill="rgba(255,0,0,.28)" />
    <rect x={SAFE.right} y={SAFE.top} width={1080 - SAFE.right} height={SAFE.bottom - SAFE.top} fill="rgba(255,0,0,.28)" />
    <rect x={0} y={SAFE.top} width={SAFE.left} height={SAFE.bottom - SAFE.top} fill="rgba(255,0,0,.18)" />
    <rect x={SAFE.left} y={SAFE.top} width={SAFE_W} height={SAFE.bottom - SAFE.top} fill="none" stroke="#3dff7a" strokeWidth={3} strokeDasharray="14 10" />
    <rect x={SAFE.left} y={1240} width={SAFE_W} height={250} fill="none" stroke="#ffd53d" strokeWidth={3} strokeDasharray="8 8" />
    <text x={SAFE.left + 12} y={SAFE.top + 34} fill="#3dff7a" fontSize={26} fontFamily="monospace">SAFE ZONE</text>
    <text x={SAFE.left + 12} y={1236} fill="#ffd53d" fontSize={24} fontFamily="monospace">SUBTITLE</text>
  </svg>
);
