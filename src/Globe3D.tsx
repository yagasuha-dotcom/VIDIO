import React, {useMemo} from "react";
import * as THREE from "three";
import "@react-three/fiber";
import {ThreeCanvas} from "@remotion/three";
import {random} from "remotion";
import {H, W} from "./config";
import {useAbsFrame} from "./util";

// Konversi piksel layar → unit dunia (kamera z=10, fov=35)
const UNIT = (2 * 10 * Math.tan((17.5 * Math.PI) / 180)) / H;
const GX = (500 - 540) * UNIT; // pusat visual x=500 (safe zone)
const GY = (960 - 700) * UNIT; // pusat visual y=700

/* ───────────── TEKSTUR PROSEDURAL PANGAEA ───────────── */
const PATHS: {pts: [number, number][]; r: number}[] = [
  {pts: [[980, 240], [1040, 300], [1080, 380], [1070, 470], [1040, 560], [990, 640], [950, 720], [960, 790]], r: 95},
  {pts: [[900, 330], [850, 420], [880, 520], [920, 600]], r: 80},
  {pts: [[1130, 280], [1190, 300]], r: 62},
  {pts: [[1100, 640], [1170, 690]], r: 62},
  {pts: [[780, 300], [740, 360]], r: 40},
];

const forEachBlob = (cb: (x: number, y: number, r: number, k: number) => void) => {
  let k = 0;
  PATHS.forEach((p, pi) => {
    for (let i = 0; i < p.pts.length - 1; i++) {
      const [x0, y0] = p.pts[i];
      const [x1, y1] = p.pts[i + 1];
      const len = Math.hypot(x1 - x0, y1 - y0);
      const steps = Math.max(2, Math.floor(len / 16));
      for (let s = 0; s < steps; s++) {
        const u = s / steps;
        const jx = (random(`jx${pi}-${i}-${s}`) - 0.5) * 50;
        const jy = (random(`jy${pi}-${i}-${s}`) - 0.5) * 50;
        const rr = p.r * (0.7 + 0.55 * random(`jr${pi}-${i}-${s}`));
        cb(x0 + (x1 - x0) * u + jx, y0 + (y1 - y0) * u + jy, rr, k++);
      }
    }
  });
};

const makeEarthTex = (wet: boolean) => {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 1024;
  const g = c.getContext("2d")!;
  const og = g.createLinearGradient(0, 0, 0, 1024);
  og.addColorStop(0, "#0b2c52");
  og.addColorStop(0.5, "#0f4a7a");
  og.addColorStop(1, "#0a2a4c");
  g.fillStyle = og;
  g.fillRect(0, 0, 2048, 1024);
  for (let i = 0; i < 500; i++) {
    g.fillStyle = `rgba(120,190,230,${0.02 + random(`oa${i}`) * 0.04})`;
    g.beginPath();
    g.arc(random(`ox${i}`) * 2048, random(`oy${i}`) * 1024, 20 + random(`or${i}`) * 80, 0, Math.PI * 2);
    g.fill();
  }
  // perairan dangkal
  forEachBlob((x, y, r) => {
    g.fillStyle = "rgba(48,150,170,.35)";
    g.beginPath();
    g.arc(x, y, r + 26, 0, Math.PI * 2);
    g.fill();
  });
  const base = wet ? "#3d7a47" : "#b98a58";
  const hi = wet ? "#5f9d55" : "#d9ac75";
  const lo = wet ? "#24502f" : "#8a5d3a";
  forEachBlob((x, y, r, k) => {
    g.fillStyle = base;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
    for (let j = 0; j < 14; j++) {
      const a = random(`sa${k}-${j}`) * Math.PI * 2;
      const d = random(`sd${k}-${j}`) * r * 0.9;
      g.fillStyle = (j % 2 ? hi : lo) + "aa";
      g.beginPath();
      g.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, 6 + random(`ss${k}-${j}`) * 22, 0, Math.PI * 2);
      g.fill();
    }
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

const makeBumpTex = () => {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 1024;
  const g = c.getContext("2d")!;
  g.fillStyle = "#000";
  g.fillRect(0, 0, 2048, 1024);
  g.filter = "blur(10px)";
  g.fillStyle = "#fff";
  forEachBlob((x, y, r) => {
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  });
  return new THREE.CanvasTexture(c);
};

const makeCloudTex = () => {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 1024;
  const g = c.getContext("2d")!;
  for (let i = 0; i < 420; i++) {
    const band = random(`cb${i}`);
    const y = 120 + (band < 0.5 ? 200 + random(`cy${i}`) * 220 : 520 + random(`cy2${i}`) * 300);
    const x = random(`cx${i}`) * 2048;
    const r = 40 + random(`cr${i}`) * 130;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, "rgba(255,255,255,.26)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(x - r, y - r, r * 2, r * 2);
    // sambung sisi tekstur agar mulus
    if (x < r) g.fillRect(x - r + 2048, y - r, r * 2, r * 2);
    if (x > 2048 - r) g.fillRect(x - r - 2048, y - r, r * 2, r * 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

/* ───────────── BINTANG LATAR ───────────── */
const Stars: React.FC = () => {
  const arr = useMemo(() => {
    const a = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      const th = random(`st${i}`) * Math.PI * 2;
      const ph = Math.acos(2 * random(`sp${i}`) - 1);
      const R = 40 + random(`sr${i}`) * 20;
      a[i * 3] = R * Math.sin(ph) * Math.cos(th);
      a[i * 3 + 1] = R * Math.sin(ph) * Math.sin(th);
      a[i * 3 + 2] = -Math.abs(R * Math.cos(ph)) - 5;
    }
    return a;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[arr, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.09} color="#dfeaff" sizeAttenuation transparent opacity={0.85} />
    </points>
  );
};

/* ───────────── ANGIN MUSON ───────────── */
const sph = (lat: number, lon: number, r: number): [number, number, number] => [
  r * Math.cos(lat) * Math.sin(lon),
  r * Math.sin(lat),
  r * Math.cos(lat) * Math.cos(lon),
];

const Wind: React.FC<{f: number; amount: number}> = ({f, amount}) => {
  const ps = useMemo(
    () =>
      Array.from({length: 44}, (_, i) => ({
        lat0: (random(`wl${i}`) - 0.5) * 1.5,
        lon0: -0.9 + random(`wo${i}`) * 0.4,
        dl: 0.9 + random(`wd${i}`) * 0.7,
        ph: random(`wp${i}`),
        sp: 0.004 + random(`ws${i}`) * 0.004,
      })),
    []
  );
  if (amount <= 0.01) return null;
  return (
    <group>
      {ps.map((p, i) =>
        [0, 1, 2, 3].map((tr) => {
          const u = (((f * p.sp + p.ph - tr * 0.012) % 1) + 1) % 1;
          const lon = p.lon0 + u * p.dl;
          const lat = p.lat0 + 0.22 * Math.sin(u * Math.PI * 2 + i);
          const pos = sph(lat, lon, 1.375);
          const vis = Math.sin(u * Math.PI);
          return (
            <mesh key={`${i}-${tr}`} position={pos}>
              <sphereGeometry args={[0.016 - tr * 0.002, 8, 8]} />
              <meshBasicMaterial color="#a8ecff" transparent opacity={amount * vis * (1 - tr * 0.25)} depthWrite={false} />
            </mesh>
          );
        })
      )}
    </group>
  );
};

/* ───────────── SCENE GLOBE ───────────── */
export const GlobeScene: React.FC<{
  wetMix: number; // 0 = Pangaea gersang, 1 = hijau lembap
  clouds: number; // 0..1
  wind?: number; // 0..1 angin muson
  zoom?: number;
  tilt?: number;
}> = ({wetMix, clouds, wind = 0, zoom = 1, tilt = 0}) => {
  const f = useAbsFrame();
  const dry = useMemo(() => makeEarthTex(false), []);
  const wetT = useMemo(() => makeEarthTex(true), []);
  const bump = useMemo(() => makeBumpTex(), []);
  const cloud = useMemo(() => makeCloudTex(), []);
  const spin = -Math.PI / 2 + f * 0.0042;

  return (
    <ThreeCanvas width={W} height={H} style={{position: "absolute", inset: 0}} camera={{position: [0, 0, 10], fov: 35}}>
      <ambientLight intensity={0.28} />
      <directionalLight position={[6, 2.5, 6]} intensity={2.7} color="#ffe2bd" />
      <directionalLight position={[-6, 1, -4]} intensity={1.0} color="#5aa8ff" />
      <Stars />
      <group position={[GX, GY, 0]} scale={zoom} rotation={[tilt, 0, -0.38]}>
        <mesh rotation={[0, spin, 0]}>
          <sphereGeometry args={[1.3, 128, 128]} />
          <meshStandardMaterial map={dry} bumpMap={bump} bumpScale={0.04} roughness={0.92} metalness={0} />
        </mesh>
        <mesh rotation={[0, spin, 0]}>
          <sphereGeometry args={[1.3015, 128, 128]} />
          <meshStandardMaterial map={wetT} roughness={0.92} transparent opacity={wetMix} depthWrite={false} />
        </mesh>
        <mesh rotation={[0, spin * 1.35 + 0.8, 0]}>
          <sphereGeometry args={[1.332, 96, 96]} />
          <meshStandardMaterial map={cloud} transparent opacity={clouds} depthWrite={false} roughness={1} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.43, 64, 64]} />
          <meshBasicMaterial color="#7cc4ff" transparent opacity={0.2} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <Wind f={f} amount={wind} />
      </group>
    </ThreeCanvas>
  );
};
