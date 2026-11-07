# Carnian Pluvial Episode – Video Dokumenter TikTok (Remotion)

1080×1920 · 9:16 · 30 FPS · MP4 (H.264) · ±4 menit 02 detik (dua file voice digabung otomatis).

## Menjalankan
```bash
npm install
npm run dev              # buka Remotion Studio untuk preview
npm run render           # hasil: out/carnian-pluvial-episode.mp4
npm run render:guides    # preview setengah resolusi + overlay safe zone (merah = area tertutup UI TikTok)
```
Jika muncul error "version mismatch" antar paket remotion: `npx remotion upgrade`.
Font Montserrat diunduh otomatis lewat @remotion/google-fonts (butuh internet saat render pertama).

## Safe zone (src/config.ts)
Tanpa screenshot, memakai ukuran umum TikTok: atas 190 px, kanan 140 px (x > 940), bawah 420 px (y > 1500).
Semua objek penting berada di kotak x 60–940, y 190–1500. Visual utama di y 230–1190, subtitle di y 1240–1490.
Jika screenshot Anda berbeda, ubah `SAFE`, `FOCUS`, `SUB` di `src/config.ts`.

## Sinkronisasi narasi
`src/timing.json` berisi waktu mulai/akhir tiap kalimat. Nilainya diperkirakan dari jeda audio
(`tools/align.py`), jadi bisa meleset beberapa detik. Cek di Studio, lalu koreksi angka `start`/`end`
di file itu – semua scene, subtitle, dan SFX mengikuti otomatis.

## Isi
- 3D (three.js): bumi Pangaea (tekstur prosedural, awan, angin muson) dan gunung berapi (lava, abu, lontaran).
- 2D sinematik: awan volumetrik, hujan, kilat, siklus air, grafik, dinosaurus, hutan purba.
- Audio: voice + hujan, drone, petir, dentuman (disintesis, ada di public/sfx).
