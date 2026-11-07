import {interpolate} from "remotion";
import timing from "./timing.json";

// ───────── FORMAT TIKTOK ─────────
export const W = 1080;
export const H = 1920;
export const FPS = 30;

// ───────── SAFE ZONE TIKTOK (piksel) ─────────
// Atas   : 0–190    → username / tab "Mengikuti | Untuk Anda"
// Kanan  : 940–1080 → ikon profil, like, komentar, simpan, share
// Bawah  : 1500–1920→ caption, nama akun, musik, navigasi bawah
// Semua objek penting berada di dalam kotak SAFE.
export const SAFE = {left: 60, right: 940, top: 190, bottom: 1500};
export const SAFE_W = SAFE.right - SAFE.left; // 880
export const CX = (SAFE.left + SAFE.right) / 2; // 500 → pusat horizontal visual
// Area fokus visual utama (di atas subtitle)
export const FOCUS = {top: 230, bottom: 1190, cx: CX, cy: 710};
// Area subtitle (di dalam SAFE, di atas zona caption TikTok)
export const SUB = {top: 1240, bottom: 1490};

// ───────── TIMING NARASI ─────────
export const LINES = timing.lines as {text: string; start: number; end: number}[];
export const LS = (i: number) => LINES[i].start;
export const LE = (i: number) => LINES[i].end;
export const sf = (sec: number) => Math.round(sec * FPS);

export const PART2_START = Math.ceil(timing.part1 * FPS);
export const VOICE2_FRAMES = Math.ceil(timing.part2 * FPS);
export const TOTAL_FRAMES = PART2_START + VOICE2_FRAMES + 45;

export const COLORS = {
  accent: "#ffbf5e",
  cyan: "#8fe3ff",
  ink: "#f7f2e8",
  lava: "#ff6a1c",
  green: "#8fd694",
};

// Tingkat "kebasahan" dunia sepanjang cerita (0 = kering, 1 = hujan lebat)
export const wetAt = (t: number) =>
  interpolate(
    t,
    [0, LS(3) - 0.3, LS(3), LS(4), LE(4), LS(16), LE(27), LE(42), LS(45), LE(46), TOTAL_FRAMES / FPS],
    [0.95, 0.95, 0.12, 0.15, 0.7, 0.2, 1, 1, 0.85, 0.25, 0.5],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );

// Waktu kilat (detik) – dipakai visual (Lightning) dan audio petir
export const FLASHES = [LS(1) + 1.8, LS(2) + 0.2, LS(4) + 3.5, LS(22) + 1.0, LS(30) + 1.5, LS(38) + 1.0];

// Letusan berulang (empat fase vulkanik) – dipakai visual 3D dan audio
export const PULSE_T0 = LS(33) + 0.8;
export const PULSE_S = (LE(35) - LS(33) - 1.6) / 3;
export const PULSES = [0, 1, 2, 3].map((k) => PULSE_T0 + k * PULSE_S);
