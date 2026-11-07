import React, {useMemo} from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {COLORS, FPS, LINES, SAFE, SAFE_W} from "./config";
import {FONT} from "./fonts";

type Chunk = {text: string; start: number; end: number};

// Pecah tiap kalimat menjadi potongan ≤ 2 baris, durasi proporsional dengan jumlah huruf.
const buildChunks = (): Chunk[] => {
  const out: Chunk[] = [];
  LINES.forEach((ln) => {
    const words = ln.text.split(/\s+/);
    const groups: string[][] = [];
    let cur: string[] = [];
    words.forEach((w, i) => {
      cur.push(w);
      const len = cur.join(" ").length;
      const soft = /[,.?!…]$/.test(w) && cur.length >= 3;
      const next = words[i + 1];
      const wouldOverflow = next && len + 1 + next.length > 36;
      if (soft || wouldOverflow || len > 30) {
        groups.push(cur);
        cur = [];
      }
    });
    if (cur.length) {
      if (groups.length && cur.join(" ").length < 10) groups[groups.length - 1].push(...cur);
      else groups.push(cur);
    }
    const total = groups.reduce((s, g) => s + g.join(" ").length + 4, 0);
    const a = ln.start + 0.04;
    const b = ln.end - 0.04;
    let t = a;
    groups.forEach((g) => {
      const d = ((g.join(" ").length + 4) / total) * (b - a);
      out.push({text: g.join(" "), start: t, end: t + d});
      t += d;
    });
  });
  return out;
};

const KEY = /^(carnian|pluvial|episode|pangaea|wrangellia|karbon|dioksida|vulkanik|dinosaurus|hujan|jutaan|234|muson|superbenua|siklus|air)$/i;

export const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const chunks = useMemo(buildChunks, []);
  const c = chunks.find((x) => t >= x.start && t < x.end);
  if (!c) return null;
  const local = (t - c.start) * FPS;
  const o = interpolate(local, [0, 4], [0, 1], {extrapolateRight: "clamp"});
  const y = interpolate(local, [0, 6], [14, 0], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE_W,
          bottom: 1920 - 1490,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 58,
          lineHeight: 1.2,
          color: "#fff",
          opacity: o,
          transform: `translateY(${y}px)`,
          textShadow: "0 3px 16px rgba(0,0,0,.95), 0 0 3px rgba(0,0,0,1), 0 0 22px rgba(0,0,0,.7)",
        }}
      >
        {c.text.split(" ").map((w, i) => (
          <span key={i} style={{color: KEY.test(w.replace(/[^\p{L}\d]/gu, "")) ? COLORS.accent : "#fff"}}>
            {w}{" "}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
