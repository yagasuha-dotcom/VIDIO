import React, {useMemo} from "react";
import {AbsoluteFill, interpolate, random} from "remotion";
import {COLORS, FLASHES, FPS, LE, LS, PULSES, SAFE, SAFE_W, wetAt} from "../config";
import {FONT} from "../fonts";
import {Chip, ChipBox, Co2, Icon, Row, Thermometer} from "../Hud";
import {CloudBank, Landscape, Lightning, Rain, Sky, SunRays} from "../Backdrop";
import {Forest, Prosauropod, Theropod} from "../Dinos";
import {GlobeScene} from "../Globe3D";
import {VolcanoScene} from "../Volcano3D";
import {Glass, Txt, lin, rev, useAbsFrame, useT, win} from "../util";

const SPACE = "radial-gradient(ellipse at 45% 40%, #0d1830 0%, #050a16 55%, #010206 100%)";

/* ═════════ 1. INTRO – dunia yang diguyur hujan (baris 0–2) ═════════ */
const Ripples: React.FC = () => {
  const f = useAbsFrame();
  return (
    <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
      <rect x={0} y={1330} width={1080} height={590} fill="rgba(6,14,18,.85)" />
      {Array.from({length: 22}, (_, i) => {
        const life = ((f * 0.03 + random(`rp${i}`) * 5) % 1);
        const x = random(`rpx${i}`) * 1080;
        const y = 1350 + random(`rpy${i}`) * 130;
        const r = life * 70;
        return <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.28} fill="none" stroke={`rgba(190,220,235,${(1 - life) * 0.5})`} strokeWidth={2} />;
      })}
    </svg>
  );
};

export const Intro: React.FC = () => {
  const f = useAbsFrame();
  const t = f / FPS;
  const d = (LE(1) - LS(1)) / 3;
  const st = [LS(1), LS(1) + d, LS(1) + 2 * d];
  const labels = ["BEBERAPA HARI", "BEBERAPA BULAN", "BEBERAPA TAHUN"];
  return (
    <AbsoluteFill>
      <Landscape id="in" wet={0.95} rain={1} zoom={1 + f * 0.00025} origin="50% 38%" />
      <Ripples />
      <Lightning times={FLASHES} />
      {labels.map((l, i) => (
        <Txt key={i} y={640} size={74} color="#e9f3f7" opacity={win(t, st[i], i < 2 ? st[i + 1] : LE(1), 0.35)} shift={(1 - rev(t, st[i], 0.5)) * 24}>
          {l}
        </Txt>
      ))}
      <Txt y={540} size={118} weight={900} color={COLORS.accent} opacity={win(t, LS(2), LE(2) + 0.6, 0.5)} scale={1 + 0.05 * rev(t, LS(2), 1.2)}>
        JUTAAN
      </Txt>
      <Txt y={675} size={118} weight={900} color={COLORS.accent} opacity={win(t, LS(2) + 0.4, LE(2) + 0.6, 0.5)} scale={1 + 0.05 * rev(t, LS(2) + 0.4, 1.2)}>
        TAHUN
      </Txt>
      <AbsoluteFill style={{background: "#000", opacity: interpolate(f, [0, 45], [1, 0], {extrapolateRight: "clamp"})}} />
    </AbsoluteFill>
  );
};

/* ═════════ 2. JUDUL – 234 juta tahun & Carnian Pluvial Episode (baris 3–7) ═════════ */
export const TitleScene: React.FC = () => {
  const f = useAbsFrame();
  const t = f / FPS;
  const wet = wetAt(t);
  const n = Math.round(lin(t, LS(3) + 0.2, LS(3) + 2.8, 0, 234));
  const tA = LS(5) + (LE(5) - LS(5)) * 0.52;
  const words = ["CARNIAN", "PLUVIAL", "EPISODE"];
  const flash = interpolate(t, [tA - 0.05, tA, tA + 0.35], [0, 0.5, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const bar = lin(t, LS(7) + 0.6, LE(7) - 0.2, 0, 1);
  return (
    <AbsoluteFill>
      <Landscape id="ti" wet={wet} zoom={1 + (f - LS(3) * FPS) * 0.00012} />
      <Lightning times={FLASHES} />
      {/* 234 juta tahun */}
      <Txt y={360} size={300} weight={900} color={COLORS.accent} opacity={win(t, LS(3) + 0.1, LE(4) - 0.1)} scale={0.92 + 0.08 * rev(t, LS(3) + 0.1, 1)}>
        {n}
      </Txt>
      <Txt y={690} size={54} opacity={win(t, LS(3) + 0.8, LE(4) - 0.1)}>JUTA TAHUN YANG LALU</Txt>
      <Txt y={770} size={34} weight={500} spacing={6} color="#e8d9c2" opacity={win(t, LS(3) + 1.2, LE(4) - 0.1)}>TRIAS AKHIR · PANGAEA</Txt>
      <Chip y={900} o={win(t, LS(4) + 3, LE(4) - 0.1)} color={COLORS.cyan} title="CURAH HUJAN MENINGKAT" icon={<Icon kind="drop" color={COLORS.cyan} />} />
      {/* judul */}
      {words.map((w, i) => (
        <Txt key={w} y={340 + i * 160} size={150} weight={900} spacing={4} color={i === 1 ? COLORS.cyan : "#fff"} opacity={win(t, tA + i * 0.35, LE(6) + 0.3)} shift={(1 - rev(t, tA + i * 0.35, 0.7)) * 40}>
          {w}
        </Txt>
      ))}
      <Txt y={840} size={34} weight={500} spacing={8} color="#e8d9c2" opacity={win(t, tA + 1.2, LE(6) + 0.3)}>PERISTIWA IKLIM PURBA</Txt>
      <AbsoluteFill style={{background: "#fff", opacity: flash}} />
      {/* durasi */}
      <Txt y={330} size={250} weight={900} color={COLORS.accent} opacity={win(t, LS(7), LE(7) + 0.5)} scale={0.92 + 0.08 * rev(t, LS(7), 1)}>1 – 2</Txt>
      <Txt y={620} size={62} opacity={win(t, LS(7) + 0.3, LE(7) + 0.5)}>JUTA TAHUN</Txt>
      <div style={{position: "absolute", left: 130, top: 780, width: 740, opacity: win(t, LS(7) + 0.5, LE(7) + 0.5)}}>
        <div style={{height: 22, borderRadius: 11, background: "rgba(255,255,255,.2)", overflow: "hidden", border: "1px solid rgba(255,255,255,.3)"}}>
          <div style={{width: `${bar * 100}%`, height: "100%", background: `linear-gradient(90deg, ${COLORS.cyan}, #3b8dff)`}} />
        </div>
        <div style={{fontFamily: FONT, fontWeight: 500, fontSize: 30, marginTop: 16, textAlign: "center", color: "#fff", letterSpacing: 3}}>DURASI IKLIM BASAH</div>
      </div>
    </AbsoluteFill>
  );
};

/* ═════════ 3. PANGAEA 3D (baris 8–9) ═════════ */
export const PangaeaScene: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{background: SPACE}}>
      <GlobeScene wetMix={0} clouds={0.18} zoom={lin(t, LS(8), LE(9), 0.88, 0.96)} />
      <Chip y={215} o={win(t, LE(8) - 2.6, LE(9))} title="SUPERBENUA PANGAEA" sub="satu daratan raksasa" icon={<Icon kind="leaf" color={COLORS.accent} />} />
      <Row y={1105} o={win(t, LS(9) + 0.4, LE(9) + 0.2)}>
        <ChipBox color="#ff9a5c" title="PANAS" icon={<Icon kind="temp" color="#ff9a5c" size={48} />} />
        <ChipBox color="#e5c28a" title="KERING" icon={<Icon kind="volcano" color="#e5c28a" size={48} />} />
      </Row>
    </AbsoluteFill>
  );
};

/* ═════════ 4. GUNUNG BERAPI WRANGELLIA (baris 10–15) ═════════ */
const AshSky: React.FC<{heat: number}> = ({heat}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: `linear-gradient(180deg, #0c0608 0%, #2a110f 45%, ${heat > 0.5 ? "#8a3a1e" : "#5a2a1c"} 78%, #b5642f 100%)`}} />
    <CloudBank id="vs1" y={100} h={620} wet={1} cover={0.7} speed={0.2} opacity={0.75} />
  </AbsoluteFill>
);

export const VolcanoA: React.FC = () => {
  const f = useAbsFrame();
  const t = f / FPS;
  const act = interpolate(t, [LS(10), LS(11) + 1, LE(12), LE(15)], [0.05, 0.55, 1, 0.9], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const shake = lin(t, LS(10), LS(11), 0.3, 1.1);
  const co2 = Array.from({length: 9}, (_, i) => i);
  const co2On = win(t, LS(13) - 0.2, LE(15) + 0.5, 0.6);
  const thermo = lin(t, LS(15), LE(15) + 1.5, 0.22, 0.92);
  return (
    <AbsoluteFill>
      <AshSky heat={act} />
      <VolcanoScene act={act} shake={shake} orbit={0.32} />
      <Txt y={250} size={44} weight={700} spacing={4} color="#ffd8b0" opacity={win(t, LS(10) + 0.3, LE(10))}>JAUH DI DALAM KERAK BUMI</Txt>
      <Chip y={240} o={win(t, LS(12) + (LE(12) - LS(12)) * 0.3, LE(12) + 0.3)} color="#ffb070" title="WRANGELLIA" sub="British Columbia & Alaska (kini)" icon={<Icon kind="volcano" color="#ffb070" />} />
      {/* CO2 naik */}
      {co2.map((i) => {
        const u = (t * 0.32 + i / 9) % 1;
        const x = 340 + ((i * 97) % 300);
        return <Co2 key={i} x={x} y={620 - u * 360} o={co2On * Math.sin(Math.PI * u)} s={0.8 + 0.3 * random(`co${i}`)} />;
      })}
      {/* lapisan gas rumah kaca */}
      <div
        style={{
          position: "absolute", left: SAFE.left, width: SAFE_W, top: 300, height: 110,
          opacity: win(t, LS(14) + 0.8, LE(15) + 1.5), borderRadius: 30,
          background: "linear-gradient(180deg, rgba(255,150,70,0), rgba(255,150,70,.42), rgba(255,150,70,0))",
          display: "flex", alignItems: "center", justifyContent: "space-around",
          fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#fff", letterSpacing: 3,
        }}
      >
        <span>CO₂</span><span>CO₂</span><span>CO₂</span><span>CO₂</span>
      </div>
      <Chip y={430} o={win(t, LS(14) + 1.2, LE(14) + 0.8)} color="#ffcf8a" title="EFEK RUMAH KACA" size={34} />
      <Thermometer x={SAFE.left + 10} y={560} level={thermo} o={win(t, LS(15) - 0.2, LE(15) + 1.6)} />
      <Chip x={SAFE.left + 190} y={660} o={win(t, LS(15) + 0.2, LE(15) + 1.6)} color="#ff7a5a" title="SUHU BUMI" sub="meningkat" icon={<Icon kind="up" color="#ff7a5a" size={52} />} />
    </AbsoluteFill>
  );
};

/* ═════════ 5. SIKLUS AIR (baris 16–24) ═════════ */
export const WaterCycle: React.FC = () => {
  const f = useAbsFrame();
  const t = f / FPS;
  const wet = lin(t, LS(16), LE(24), 0.2, 0.9);
  const cover = lin(t, LS(20) + 1, LS(22) + 0.5, 0.12, 0.95);
  const rain = lin(t, LS(22) + 0.8, LS(22) + 4, 0, 1) * (t > LS(24) ? 1.0 : 1);
  const vap = rev(t, LS(20), 1);
  const wave = (base: number, amp: number, fr: number, sp: number, ph: number) => {
    let d = `M 0 1920 L 0 ${base}`;
    for (let x = 0; x <= 1080; x += 20) d += ` L ${x} ${base + amp * Math.sin(x * fr + f * sp + ph)}`;
    return d + " L 1080 1920 Z";
  };
  const parts = useMemo(
    () => Array.from({length: 60}, (_, i) => ({x: 70 + random(`vx${i}`) * 470, o: random(`vo${i}`), r: 6 + random(`vr${i}`) * 11, s: 0.005 + random(`vs${i}`) * 0.004})),
    []
  );
  const hot = lin(t, LS(16), LS(19), 0.3, 1);
  return (
    <AbsoluteFill>
      <Sky wet={wet} />
      <AbsoluteFill style={{background: `radial-gradient(circle at 20% 24%, rgba(255,230,170,${0.55 * hot}), rgba(255,200,120,0) 38%)`}} />
      <CloudBank id="wc1" y={190} h={560} wet={wet} cover={cover} speed={0.2} />
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        <path d="M 560 1920 L 560 1010 Q 660 830 790 870 Q 930 780 1130 900 L 1130 1920 Z" fill={`rgb(${40 - wet * 18},${58 + wet * 12},${46})`} />
        <path d={wave(930, 10, 0.012, 0.06, 0)} fill="#0f5877" />
        <path d={wave(975, 12, 0.017, 0.08, 2)} fill="#0b4663" />
        <path d={wave(1030, 14, 0.011, 0.05, 4)} fill="#073250" />
        <path d="M 230 920 C 230 740 320 600 520 500" fill="none" stroke="rgba(255,255,255,.75)" strokeWidth={5} strokeDasharray="16 14" strokeDashoffset={-f * 0.9} opacity={vap} />
        <path d="M 700 600 L 700 790" fill="none" stroke="rgba(160,215,255,.8)" strokeWidth={5} strokeDasharray="14 12" strokeDashoffset={-f * 1.4} opacity={rev(t, LS(22) + 0.6, 0.8)} />
      </svg>
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0, filter: "blur(3px)", opacity: vap}}>
        {parts.map((p, i) => {
          const u = (f * p.s + p.o) % 1;
          return <circle key={i} cx={p.x + u * u * 280} cy={915 - u * 450} r={p.r} fill={`rgba(255,255,255,${Math.sin(Math.PI * u) * 0.7})`} />;
        })}
      </svg>
      <div style={{position: "absolute", inset: 0, clipPath: "inset(0 0 0 520px)"}}>
        <Rain amount={rain} />
      </div>
      <Lightning times={FLASHES} />
      <Chip y={235} o={win(t, LS(17) + 0.4, LE(17))} color="#ffb070" title="PEMANASAN GLOBAL" icon={<Icon kind="temp" color="#ffb070" />} />
      <Chip y={235} o={win(t, LS(18) + 0.2, LE(18) + 0.2)} color={COLORS.cyan} title="CARA AIR BERGERAK BERUBAH" size={32} icon={<Icon kind="drop" color={COLORS.cyan} size={52} />} />
      <Chip y={1000} o={win(t, LS(19) + 0.3, LE(19) + 0.3)} color="#ffb070" title="LAUTAN MEMANAS" icon={<Icon kind="temp" color="#ffb070" />} />
      <Chip x={SAFE.left} y={740} o={win(t, LS(20) + 0.4, LE(20) + 0.4)} color="#fff" title="PENGUAPAN" icon={<Icon kind="up" size={52} />} />
      <Chip y={235} o={win(t, LS(21) + 0.4, LE(21) + 0.2)} color="#dfe9ee" title="KONDENSASI → AWAN" size={34} />
      <Chip y={1060} o={win(t, LS(22) + 0.6, LE(22) + 0.4)} color={COLORS.cyan} title="HUJAN TURUN" icon={<Icon kind="drop" color={COLORS.cyan} />} />
      <Chip y={235} o={win(t, LS(23) + 0.6, LE(23) + 0.2)} color="#fff" title="SIKLUS AIR" sub="sudah ada sejak miliaran tahun" />
      <Chip y={235} o={win(t, LS(24) + 0.2, LE(24) + 0.2)} color={COLORS.accent} title="JAUH LEBIH INTENS" icon={<Icon kind="up" color={COLORS.accent} size={52} />} />
    </AbsoluteFill>
  );
};

/* ═════════ 6. ANGIN MUSON PANGAEA (baris 25–27) ═════════ */
export const MonsoonScene: React.FC = () => {
  const t = useT();
  const mix = lin(t, LS(25), LE(27), 0, 1);
  return (
    <AbsoluteFill style={{background: SPACE}}>
      <GlobeScene wetMix={mix} clouds={lin(t, LS(25), LE(27), 0.25, 0.9)} wind={rev(t, LS(25) + 1.2, 1.5)} zoom={0.92} />
      <Chip y={215} o={win(t, LS(25) + (LE(25) - LS(25)) * 0.45, LE(25) + 0.2)} color={COLORS.cyan} title="ANGIN MUSON KUAT" sub="pola Pangaea" />
      <Txt y={235} size={90} weight={900} color={COLORS.accent} opacity={win(t, LS(26), LE(26) + 0.3, 0.2)}>HASILNYA?</Txt>
      <Row y={1105} o={win(t, LS(27) + 0.5, LE(27))}>
        <ChipBox color={COLORS.cyan} title="HUJAN ↑" icon={<Icon kind="drop" color={COLORS.cyan} size={48} />} />
        <ChipBox color={COLORS.green} title="LEMBAP" icon={<Icon kind="leaf" color={COLORS.green} size={48} />} />
      </Row>
    </AbsoluteFill>
  );
};

/* ═════════ 7. MITOS: HUJAN TANPA HENTI? (baris 28–31) ═════════ */
export const MythScene: React.FC = () => {
  const f = useAbsFrame();
  const t = f / FPS;
  const bars = useMemo(() => Array.from({length: 40}, (_, i) => 0.25 + 0.75 * Math.abs(Math.sin(i * 0.55) * 0.6 + random(`bar${i}`) * 0.5)), []);
  const p = lin(t, LS(30) + 0.4, LE(31) - 0.2, 0, 1);
  const idx = Math.min(39, Math.floor(p * 40));
  const rain = t < LS(30) ? 0.9 : 0.25 + 0.75 * Math.min(1, bars[idx]);
  const chart = win(t, LS(30) + 0.3, LE(31) + 0.3);
  return (
    <AbsoluteFill>
      <Landscape id="my" wet={0.8} rain={rain} />
      <Lightning times={FLASHES} />
      <Txt y={330} size={92} weight={900} opacity={win(t, LS(28) + 0.2, LE(28) + 0.2)}>HUJAN TANPA</Txt>
      <Txt y={440} size={92} weight={900} opacity={win(t, LS(28) + 0.4, LE(28) + 0.2)}>HENTI SELAMA</Txt>
      <Txt y={550} size={92} weight={900} color={COLORS.cyan} opacity={win(t, LS(28) + 0.6, LE(28) + 0.2)}>2 JUTA TAHUN?</Txt>
      <Txt y={400} size={110} weight={900} color={COLORS.accent} opacity={win(t, LS(29), LE(29) + 0.9, 0.3)} scale={1 + 0.06 * rev(t, LS(29), 0.5)}>TIDAK</Txt>
      <Txt y={530} size={110} weight={900} color={COLORS.accent} opacity={win(t, LS(29) + 0.15, LE(29) + 0.9, 0.3)} scale={1 + 0.06 * rev(t, LS(29) + 0.15, 0.5)}>SEPENUHNYA</Txt>
      <div style={{position: "absolute", left: SAFE.left, width: SAFE_W, top: 340, opacity: chart}}>
        <Glass style={{padding: "26px 30px 22px"}}>
          <div style={{fontWeight: 700, fontSize: 30, letterSpacing: 3, textAlign: "center", marginBottom: 12}}>INTENSITAS HUJAN (ILUSTRASI)</div>
          <svg width={820} height={300} viewBox="0 0 820 300">
            <line x1={0} y1={290} x2={820} y2={290} stroke="rgba(255,255,255,.5)" strokeWidth={3} />
            {bars.map((b, i) => {
              const on = i / 40 <= p;
              return <rect key={i} x={i * 20.5 + 3} y={290 - b * 270} width={14} height={b * 270} rx={5} fill={on ? COLORS.cyan : "rgba(255,255,255,.12)"} opacity={on ? 0.95 : 1} />;
            })}
          </svg>
          <div style={{display: "flex", justifyContent: "space-between", fontSize: 26, fontWeight: 500, opacity: 0.9, marginTop: 8}}>
            <span>awal</span><span>± 1–2 juta tahun</span>
          </div>
        </Glass>
      </div>
      <Chip y={900} o={win(t, LS(30) + 1.5, LE(31) + 0.3)} color={COLORS.cyan} title="IKLIM BASAH ≠ HUJAN TERUS" size={32} />
    </AbsoluteFill>
  );
};

/* ═════════ 8. EMPAT FASE VULKANIK (baris 32–36) ═════════ */
export const PulsesScene: React.FC = () => {
  const f = useAbsFrame();
  const t = f / FPS;
  let env = 0;
  let count = 0;
  PULSES.forEach((pt) => {
    const dt = t - pt;
    if (dt >= 0) count += 1;
    env = Math.max(env, dt < 0 ? Math.exp(-Math.pow(dt / 0.5, 2)) : Math.exp(-dt / 1.4));
  });
  const act = 0.22 + 0.78 * env;
  const thermo = 0.3 + 0.15 * count;
  return (
    <AbsoluteFill>
      <AshSky heat={act} />
      <VolcanoScene act={act} shake={env * 1.4} orbit={0.4} />
      <Rain amount={count / 4 * 0.9} opacity={0.8} />
      <Txt y={240} size={36} weight={700} spacing={5} color="#ffd8b0" opacity={win(t, LS(32) + 0.3, LE(32))}>BEBERAPA FASE</Txt>
      <div style={{position: "absolute", top: 240, left: SAFE.left, width: SAFE_W, display: "flex", justifyContent: "center", gap: 26, opacity: win(t, LS(33) - 0.2, LE(36), 0.5)}}>
        {[0, 1, 2, 3].map((k) => {
          const on = t >= PULSES[k];
          return (
            <div key={k} style={{width: 74, height: 74, borderRadius: 37, border: "3px solid rgba(255,255,255,.7)", background: on ? COLORS.lava : "rgba(10,14,18,.55)", boxShadow: on ? "0 0 30px #ff6a1c" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#fff"}}>
              {k + 1}
            </div>
          );
        })}
      </div>
      <Txt y={335} size={34} weight={700} spacing={4} color={COLORS.accent} opacity={win(t, LS(33) - 0.2, LE(36), 0.5)}>EPISODE VULKANIK</Txt>
      <Thermometer x={SAFE.left + 10} y={560} level={thermo} o={win(t, LS(34), LE(36))} />
      <Chip x={SAFE.left + 190} y={600} o={win(t, LS(34) + 0.6, LE(35) + 0.4)} color={COLORS.cyan} title="CO₂ ↑ → HUJAN ↑" size={32} />
      <Chip y={1100} o={win(t, LS(36) + 1.5, LE(36))} color="#fff" title="SKALA WAKTU GEOLOGIS" size={32} />
    </AbsoluteFill>
  );
};

/* ═════════ 9. KEHIDUPAN & DINOSAURUS (baris 37–42) ═════════ */
export const LifeScene: React.FC = () => {
  const f = useAbsFrame();
  const t = f / FPS;
  const e1 = lin(t, LS(41) + 0.8, LE(42), 0, 1);
  const px = interpolate(e1, [0, 1], [-560, 70]);
  const tx = interpolate(e1, [0, 1], [1150, 520]);
  return (
    <AbsoluteFill>
      <Landscape id="li" wet={0.85} rain={0.55} />
      <Lightning times={FLASHES} />
      <div style={{position: "absolute", inset: 0, transform: `translateX(${-(f - LS(37) * FPS) * 0.05}px)`}}>
        <Forest wet={0.85} />
      </div>
      <Theropod x={tx} y={925} scale={0.9} flip speed={0.24} phase={1} />
      <Prosauropod x={px} y={880} scale={0.88} speed={0.13} />
      <Txt y={270} size={64} weight={900} spacing={6} opacity={win(t, LS(37) + 0.2, LE(37) + 0.3)}>KONSEKUENSI</Txt>
      <Chip y={250} o={win(t, LS(38) + 0.3, LE(38))} color={COLORS.green} title="HABITAT BERUBAH" icon={<Icon kind="leaf" color={COLORS.green} />} />
      <Chip y={250} o={win(t, LS(39) + 0.2, LE(39))} color="#ff8a7a" title="SULIT BERADAPTASI" icon={<Icon kind="down" color="#ff8a7a" />} />
      <Chip y={250} o={win(t, LS(40) + 0.2, LE(40) + 0.2)} color={COLORS.green} title="SPESIES BERKEMBANG" icon={<Icon kind="up" color={COLORS.green} />} />
      <Chip y={250} o={win(t, LS(41) + 0.4, LE(41) + 0.2)} color="#e8d9c2" title="DARAT & LAUT BERUBAH" size={32} />
      <Chip y={250} o={win(t, LS(42) + 0.2, LE(42) + 0.4)} color={COLORS.accent} title="DIVERSIFIKASI DINOSAURUS" size={30} />
    </AbsoluteFill>
  );
};

/* ═════════ 10. BUKAN HANYA HUJAN (baris 43–44) ═════════ */
export const FactorsScene: React.FC = () => {
  const f = useAbsFrame();
  const t = f / FPS;
  const d = LE(44) - LS(44);
  const cards = [
    {k: "temp" as const, a: LS(44) + 0.2, title: "SUHU", sub: "pemanasan global", c: "#ff9a5c"},
    {k: "volcano" as const, a: LS(44) + d * 0.38, title: "AKTIVITAS VULKANIK", sub: "gas rumah kaca", c: "#ff7a3a"},
    {k: "leaf" as const, a: LS(44) + d * 0.72, title: "GANGGUAN EKOSISTEM", sub: "habitat & spesies", c: COLORS.green},
  ];
  return (
    <AbsoluteFill>
      <Landscape id="fa" wet={0.8} rain={0.5} zoom={1.05} />
      <AbsoluteFill style={{background: "rgba(0,0,0,.35)"}} />
      <Txt y={400} size={84} weight={900} opacity={win(t, LS(43) + 0.2, LE(43) + 0.2)}>HUJAN BUKAN</Txt>
      <Txt y={505} size={84} weight={900} color={COLORS.accent} opacity={win(t, LS(43) + 0.4, LE(43) + 0.2)}>SATU-SATUNYA</Txt>
      {cards.map((c, i) => {
        const o = rev(t, c.a, 0.7);
        return (
          <div key={i} style={{position: "absolute", left: SAFE.left, width: SAFE_W, top: 340 + i * 210, opacity: o, transform: `translateX(${(1 - o) * -60}px)`}}>
            <Glass style={{display: "flex", alignItems: "center", gap: 28, padding: "28px 36px"}}>
              <Icon kind={c.k} color={c.c} size={92} />
              <div>
                <div style={{fontWeight: 800, fontSize: 44, letterSpacing: 2, color: c.c}}>{c.title}</div>
                <div style={{fontWeight: 500, fontSize: 30, opacity: 0.85}}>{c.sub}</div>
              </div>
            </Glass>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ═════════ 11. BERAKHIR (baris 45–46) ═════════ */
export const EndingScene: React.FC = () => {
  const f = useAbsFrame();
  const t = f / FPS;
  const wet = wetAt(t);
  const p = lin(t, LS(45) + 0.3, LE(45) - 0.4, 0, 1);
  return (
    <AbsoluteFill>
      <Landscape id="en" wet={wet} zoom={1.02} />
      <SunRays amount={lin(t, LS(45) + 2, LE(46), 0, 1)} />
      <div style={{position: "absolute", left: 130, top: 520, width: 740, opacity: win(t, LS(45), LE(46) - 1)}}>
        <div style={{height: 26, borderRadius: 13, background: "rgba(255,255,255,.2)", overflow: "hidden", border: "1px solid rgba(255,255,255,.3)"}}>
          <div style={{width: `${p * 100}%`, height: "100%", background: `linear-gradient(90deg, ${COLORS.cyan}, #ffd27a)`}} />
        </div>
        <div style={{display: "flex", justifyContent: "space-between", fontFamily: FONT, fontWeight: 700, fontSize: 30, marginTop: 16, color: "#fff", letterSpacing: 2}}>
          <span>IKLIM BASAH</span><span style={{color: COLORS.accent}}>BERAKHIR</span>
        </div>
      </div>
      <Txt y={300} size={74} weight={900} opacity={win(t, LS(45) + 0.3, LE(45))}>± 1–2 JUTA TAHUN</Txt>
      <Txt y={700} size={66} weight={900} color={COLORS.accent} opacity={win(t, LS(46) + 0.3, LE(46) + 0.3)}>BUMI BERUBAH</Txt>
      <Txt y={785} size={66} weight={900} color={COLORS.accent} opacity={win(t, LS(46) + 0.5, LE(46) + 0.3)}>KEMBALI</Txt>
    </AbsoluteFill>
  );
};

/* ═════════ 12. PENUTUP – Bumi dari angkasa (baris 47–52) ═════════ */
export const Finale: React.FC = () => {
  const f = useAbsFrame();
  const t = f / FPS;
  const zoom = interpolate(t, [LS(47), LS(52)], [1.0, 0.74], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const drop = win(t, LS(49) + 0.3, LS(50) + 0.6, 0.6);
  return (
    <AbsoluteFill style={{background: SPACE}}>
      <GlobeScene wetMix={0.55} clouds={0.6} zoom={zoom} wind={0.5} />
      <Chip y={215} o={win(t, LS(47) + 0.3, LE(47))} color={COLORS.accent} title="PELAJARAN PENTING" />
      <Txt y={225} size={58} weight={900} opacity={win(t, LS(48) + 0.2, LE(48) + 0.2)}>IKLIM PLANET</Txt>
      <Txt y={300} size={58} weight={900} color={COLORS.cyan} opacity={win(t, LS(48) + 0.4, LE(48) + 0.2)}>BISA BERUBAH DRASTIS</Txt>
      <div style={{position: "absolute", left: CXLEFT, top: 560, opacity: drop, transform: `scale(${0.7 + 0.3 * rev(t, LS(49) + 0.3, 0.8)})`, filter: "drop-shadow(0 0 40px rgba(140,210,255,.8))"}}>
        <Icon kind="drop" color="#d8f2ff" size={280} />
      </div>
      <Txt y={225} size={50} weight={900} opacity={win(t, LS(50) + 0.3, LE(50) + 0.2)}>SALAH SATU PERUBAHAN</Txt>
      <Txt y={290} size={50} weight={900} color={COLORS.accent} opacity={win(t, LS(50) + 0.5, LE(50) + 0.2)}>PALING LUAR BIASA</Txt>
      <Txt y={225} size={50} weight={900} opacity={win(t, LS(51) + 0.2, LE(51) + 0.2)}>JAUH SEBELUM MANUSIA</Txt>
      <Txt y={290} size={50} weight={900} color={COLORS.cyan} opacity={win(t, LS(51) + 0.4, LE(51) + 0.2)}>MENGENAL HUJAN</Txt>
      <Txt y={215} size={32} weight={500} spacing={7} color="#e8d9c2" opacity={rev(t, LS(52) + 0.2, 1)}>CARNIAN PLUVIAL EPISODE</Txt>
      <Txt y={1010} size={84} weight={900} opacity={rev(t, LS(52) + 0.6, 1.2)} shift={(1 - rev(t, LS(52) + 0.6, 1.2)) * 30}>AIR MENGUBAH</Txt>
      <Txt y={1100} size={84} weight={900} color={COLORS.cyan} opacity={rev(t, LS(52) + 1.1, 1.2)} shift={(1 - rev(t, LS(52) + 1.1, 1.2)) * 30}>WAJAH DUNIA</Txt>
    </AbsoluteFill>
  );
};

const CXLEFT = 500 - 140; // ikon tetes air 280px, pusat x = 500
