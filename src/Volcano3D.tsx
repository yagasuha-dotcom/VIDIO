import React, {useMemo} from "react";
import * as THREE from "three";
import "@react-three/fiber";
import {ThreeCanvas} from "@remotion/three";
import {random} from "remotion";
import {H, W} from "./config";
import {useAbsFrame} from "./util";

// Kamera: z=18, fov=35 → ±169 px per unit. Kawah (y≈3.0) ditempatkan di y layar ≈ 700.
const GROUP_X = -0.24;
const GROUP_Y = -1.46;
const CRATER_Y = 3.0;

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const buildTerrain = () => {
  const size = 70;
  const seg = 180;
  const g = new THREE.PlaneGeometry(size, size, seg, seg);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const col = new Float32Array(pos.count * 3);
  const lava = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const d = Math.hypot(x, y);
    const ang = Math.atan2(y, x);
    const n =
      0.22 * Math.sin(x * 1.1 + Math.sin(y * 0.7) * 2) +
      0.12 * Math.sin(x * 2.7 - y * 2.1) +
      0.06 * Math.sin(x * 6.1 + y * 5.3);
    let h = 3.8 * Math.pow(Math.max(0, 1 - d / 6.8), 1.55);
    h += n * (0.35 + Math.min(d, 8) * 0.12);
    h -= 0.9 * Math.exp(-(d * d) / 0.28);
    const hills = Math.max(0, Math.sin(x * 0.21 + 1.3) * Math.cos(y * 0.17));
    h += hills * 1.6 * smooth(6, 14, d);
    const ravine = Math.pow(Math.abs(Math.sin(ang * 9 + d * 0.4)), 8) * smooth(0.8, 3, d) * (1 - smooth(5, 6.8, d));
    h -= 0.25 * ravine;
    pos.setZ(i, h);

    const k = Math.min(1, Math.max(0, h / 3.8));
    const ash = smooth(2, 7, d) * 0.5;
    const r = 0.14 + 0.2 * k + ash * 0.12;
    const gg = 0.11 + 0.15 * k + ash * 0.1;
    const b = 0.1 + 0.12 * k + ash * 0.09;
    col[i * 3] = r;
    col[i * 3 + 1] = gg;
    col[i * 3 + 2] = b;

    const streak = Math.pow(Math.max(0, Math.sin(ang * 7 + Math.sin(d * 2) * 2)), 5) * smooth(0.55, 1.2, d) * (1 - smooth(2.2, 4.4, d));
    const rim = Math.exp(-Math.pow((d - 0.85) / 0.35, 2)) * 0.8;
    const l = Math.min(1, streak + rim);
    lava[i * 3] = l * 1.0;
    lava[i * 3 + 1] = l * 0.36;
    lava[i * 3 + 2] = l * 0.06;
  }
  g.rotateX(-Math.PI / 2);
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals();
  const lg = g.clone();
  lg.setAttribute("color", new THREE.BufferAttribute(lava, 3));
  return {g, lg};
};

const makeSmokeTex = () => {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.5, "rgba(255,255,255,.55)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 18; i++) {
    const x = 20 + random(`sx${i}`) * 88;
    const y = 20 + random(`sy${i}`) * 88;
    const r = 10 + random(`sr${i}`) * 26;
    const q = g.createRadialGradient(x, y, 0, x, y, r);
    q.addColorStop(0, "rgba(255,255,255,.3)");
    q.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = q;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  return new THREE.CanvasTexture(c);
};

const ORANGE = new THREE.Color("#ff7a22");
const GRAY = new THREE.Color("#3a3230");

export const VolcanoScene: React.FC<{act: number; orbit?: number; shake?: number}> = ({act, orbit = 0.3, shake = 0}) => {
  const f = useAbsFrame();
  const {g, lg} = useMemo(buildTerrain, []);
  const smoke = useMemo(makeSmokeTex, []);
  const ash = useMemo(
    () =>
      Array.from({length: 90}, (_, i) => ({
        o: random(`a${i}`),
        sx: (random(`ax${i}`) - 0.5) * 2,
        sz: (random(`az${i}`) - 0.5) * 2,
        s: 0.6 + random(`as${i}`) * 0.9,
      })),
    []
  );
  const bombs = useMemo(
    () =>
      Array.from({length: 28}, (_, i) => ({
        o: random(`b${i}`),
        vx: (random(`bx${i}`) - 0.5) * 2.6,
        vz: (random(`bz${i}`) - 0.5) * 2.6,
        vy: 3.2 + random(`by${i}`) * 2.8,
      })),
    []
  );
  const flick = 0.85 + 0.15 * Math.sin(f * 0.9) * Math.sin(f * 0.37);
  const sx = Math.sin(f * 1.7) * 0.03 * shake;
  const sy = Math.cos(f * 2.3) * 0.03 * shake;
  const A = Math.min(1, Math.max(0, act));

  return (
    <ThreeCanvas width={W} height={H} style={{position: "absolute", inset: 0}} camera={{position: [0, 0, 18], fov: 35}}>
      <fog attach="fog" args={["#2b1a16", 15, 44]} />
      <ambientLight intensity={0.5} color="#a07868" />
      <directionalLight position={[-6, 5, 4]} intensity={1.2} color="#ff9a60" />
      <pointLight position={[0, CRATER_Y + 0.6, 0]} color="#ff6a1c" intensity={(30 + A * 260) * flick} distance={18} decay={1.5} />
      <group position={[GROUP_X + sx, GROUP_Y + sy, 0]} rotation={[0.1, Math.sin(f * 0.004) * orbit, 0]}>
        <mesh geometry={g}>
          <meshStandardMaterial vertexColors roughness={1} metalness={0} />
        </mesh>
        <mesh geometry={lg} position={[0, 0.02, 0]}>
          <meshBasicMaterial vertexColors transparent opacity={0.3 + 0.7 * A} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        {/* kilau magma di kawah */}
        <sprite position={[0, CRATER_Y + 0.2, 0]} scale={[2.2 + A * 2.2, 2.2 + A * 2.2, 1]}>
          <spriteMaterial map={smoke} color="#ff7a22" transparent opacity={(0.25 + 0.6 * A) * flick} blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>
        {/* kolom abu */}
        {ash.map((p, i) => {
          const life = (f * 0.0075 + p.o) % 1;
          const y = CRATER_Y + 0.3 + life * 2.2 * (0.6 + A * 0.6);
          const spread = Math.pow(life, 0.7) * 2.6;
          const x = p.sx * spread + life * life * 1.6;
          const z = p.sz * spread * 0.6;
          const size = (0.5 + life * 2.0) * p.s * (0.5 + A * 0.7);
          const op = (1 - life) * Math.min(1, life * 6) * 0.6 * Math.sqrt(A);
          const c = ORANGE.clone().lerp(GRAY, Math.min(1, life * 2.5));
          return (
            <sprite key={i} position={[x, y, z]} scale={[size, size, 1]}>
              <spriteMaterial map={smoke} color={c} transparent opacity={op} depthWrite={false} />
            </sprite>
          );
        })}
        {/* lontaran lava */}
        {bombs.map((b, i) => {
          const tt = ((f + b.o * 48) % 48) / 48;
          const T = tt * 1.7;
          const x = b.vx * T;
          const z = b.vz * T;
          const y = CRATER_Y + 0.3 + b.vy * T * 0.55 - 4.2 * T * T;
          if (A < 0.25 || y < CRATER_Y - 0.6) return null;
          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[0.05 + b.o * 0.05, 8, 8]} />
              <meshBasicMaterial color="#ff9040" transparent opacity={A} />
            </mesh>
          );
        })}
      </group>
    </ThreeCanvas>
  );
};
