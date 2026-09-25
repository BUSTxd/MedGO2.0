// Sprites de la célula madre del panel «Tu esfuerzo» (home). Dos tiras de 16
// fotogramas de 32x32 (512x32) salidas del mismo dibujo:
//   · con sombra → la que se ve en el home y en la tarjeta (lossless, a ×6).
//   · sin sombra → el puntero del mouse. Se ve a 32 px, así que va con paleta
//     reducida (no a máxima calidad) para que pese lo mínimo.
// Los nombres llevan versión (_v1) porque /assets/esfuerzo/* se sirve como
// immutable (next.config.mjs): si cambias el dibujo, sube la versión aquí y en
// src/lib/esfuerzo.ts, o los navegadores seguirán con la vieja un año.
//
//   node scripts/esfuerzo/generar_celula.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdirSync, statSync } from 'node:fs';

const DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../../public/assets/esfuerzo');
const SALIDA_SOMBRA = resolve(DIR, 'celula_sombra_v1.png');
const SALIDA_PUNTERO = resolve(DIR, 'celula_puntero_v1.png');
const COLORES_PUNTERO = 24;

// Célula madre 32x32 levitando — pintada pixel por pixel, sin contornos negros.
// Optimizada para fondo BLANCO. createStemCell({ shadow: true | false })
// renderFrame(t, F) devuelve RGBA (32*32*4). t = frame actual, F = total de frames (16 recomendado).
function createStemCell(opts) {
  const SHOW_SHADOW = opts?.shadow ?? true;
  const W = 32, H = 32, R = 10.8, BASE_X = 16, BASE_Y = 14;
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

  // Rampas de color (oscuro -> claro). Ninguna llega al negro.
  const CYTO = ['#2a1d57', '#33337a', '#3c4f9c', '#3f7bb8', '#4db3cf', '#88e6dc', '#d4fff2'];
  const NUC  = ['#431656', '#6e1f79', '#a02b92', '#d4429f', '#f472b6', '#ffb9da', '#fff2f8'];
  const LAV  = ['#4a2f86', '#6d4bb8', '#a07de6', '#d9c6ff'];
  const SHADOW = ['#ebe6f7', '#d6cdf0', '#bcaee4', '#a594d9']; // sombra lavanda suave para fondo blanco
  const WHITE = '#ffffff';

  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const hash = (x, y, s) => {
    let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };

  // Rampa con transición en damero solo en la franja media (dithering limpio)
  function ramp(arr, v, x, y) {
    const f = Math.max(0, Math.min(0.9999, v)) * (arr.length - 1);
    let i = Math.floor(f);
    const fr = f - i;
    if (fr > 0.68) i++;
    else if (fr > 0.36 && ((x + y) & 1)) i++;
    return arr[Math.min(i, arr.length - 1)];
  }

  const L = (() => { const v = [-0.55, -0.68, 0.55]; const m = Math.hypot(...v); return v.map(a => a / m); })();

  // Curva de flotación: desplazamiento vertical en pixeles (suave, con pausa arriba y abajo)
  const bob = (t, F) => Math.round(-2 * Math.sin((t / F) * Math.PI * 2));

  // Semillas de la textura celular (relativas al centro)
  const r1 = rng(7);
  const seeds = [];
  while (seeds.length < 18) {
    const a = r1() * Math.PI * 2, d = Math.sqrt(r1()) * (R - 1.5);
    seeds.push({ x: Math.cos(a) * d, y: Math.sin(a) * d, p: r1() * Math.PI * 2 });
  }

  // Partículas que se desprenden
  const r2 = rng(42);
  const PCOL = [NUC[4], NUC[3], CYTO[5], CYTO[4], LAV[2], LAV[3], NUC[5]];
  const parts = [];
  for (let i = 0; i < 40; i++) {
    let a = r2() * Math.PI * 2;
    if (r2() < 0.45) a = (r2() < 0.5 ? 3.9 : 0.8) + (r2() - 0.5) * 1.4;
    parts.push({ a, r0: R + 0.4 + r2() * 1.4, ph: r2(), sp: 2 + r2() * 1.8, c: PCOL[Math.floor(r2() * PCOL.length)], spin: (r2() - 0.5) * 0.35 });
  }

  // Chispas de energía que suben desde la sombra hacia la célula
  const r3 = rng(99);
  const motes = [];
  for (let i = 0; i < 7; i++) motes.push({ x: 11 + Math.floor(r3() * 11), ph: r3(), c: [CYTO[5], NUC[4], LAV[3], CYTO[4]][i % 4] });

  // Orgánulos (relativos al centro)
  const organelles = [[4, -6, NUC[3]], [-7, 2, NUC[2]], [6, 4, LAV[2]], [-4, 7, NUC[3]], [3, 8, CYTO[5]], [-8, -3, LAV[3]], [8, -1, NUC[4]]];

  // Destellos
  const sparkles = [{ x: 3, y: 3, ph: 0 }, { x: 28, y: 5, ph: 6 }, { x: 29, y: 21, ph: 11 }, { x: 3, y: 20, ph: 3 }];

  function renderFrame(t, F) {
    F = F || 16;
    t = ((t % F) + F) % F;
    const phase = t / F;
    const ang = phase * Math.PI * 2;
    const pulse = Math.sin(ang * 2) * 0.5 + 0.5;       // el núcleo late 2 veces por ciclo
    const yOff = bob(t, F);
    const lagOff = bob(t - 2, F);                        // el núcleo va con retraso (inercia)
    const CX = BASE_X, CY = BASE_Y + yOff;
    const lift = -yOff;                                  // + = más alto

    const buf = new Array(W * H).fill(null);
    const put = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) buf[y * W + x] = c; };
    const inCell = (x, y) => Math.hypot(x + 0.5 - CX, y + 0.5 - CY) <= R;

    // 0) Sombra suave en el suelo: se achica y se aclara cuando la célula sube
    if (SHOW_SHADOW) {
      const SY = 29.5, sw = 6.8 - lift * 0.8, sh = 1.8 - lift * 0.15;
      const k = lift >= 1 ? 1 : 0; // más alto = un tono más claro
      for (let y = 26; y < H; y++) for (let x = 0; x < W; x++) {
        const e = Math.pow((x + 0.5 - 16) / sw, 2) + Math.pow((y + 0.5 - SY) / sh, 2);
        if (e <= 0.3) put(x, y, SHADOW[3 - k]);
        else if (e <= 0.62) put(x, y, SHADOW[2 - k]);
        else if (e <= 1) put(x, y, SHADOW[1 - k]);
        else if (e <= 1.4 && k === 0 && ((x + y) & 1)) put(x, y, SHADOW[0]);
      }
    }

    // Chispas que suben
    for (const m of motes) {
      const f = (m.ph + phase * 2) % 1;
      const y = Math.round(29 - f * 7);
      const x = m.x + (f > 0.5 ? ((m.x & 1) ? 1 : -1) : 0);
      if (SHOW_SHADOW && f < 0.85 && !inCell(x, y)) put(x, y, f > 0.55 ? LAV[3] : m.c);
    }

    // Semillas que "respiran"
    const S = seeds.map(s => ({ x: CX + s.x + Math.cos(s.p + ang) * 0.7, y: CY + s.y + Math.sin(s.p + ang) * 0.7 }));

    // Núcleo (con retraso de 2 frames respecto a la membrana)
    const NX = CX - 0.7, NY = BASE_Y + lagOff - 0.5;
    const nucR = a => 5.0 + 0.6 * Math.sin(3 * a + 1) + 0.4 * Math.sin(5 * a + 2) + pulse * 0.3;

    // 2) Partículas a la deriva (siguen a la célula)
    for (const p of parts) {
      const f = (p.ph + phase) % 1;
      if (f > 0.82) continue;
      const rr = p.r0 + f * p.sp, aa = p.a + f * p.spin;
      const x = Math.floor(CX + Math.cos(aa) * rr), y = Math.floor(CY + Math.sin(aa) * rr);
      if (inCell(x, y)) continue;
      put(x, y, f > 0.6 ? LAV[3] : p.c);
    }

    // 3) Célula
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const px = x + 0.5, py = y + 0.5;
      const dx = px - CX, dy = py - CY, d = Math.hypot(dx, dy);
      if (d > R) continue;
      const nx = dx / R, ny = dy / R, nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
      const lam = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
      const rim2 = (dx * L[0] + dy * L[1]) / (d || 1);

      if (d > R - 1.15) {
        let c;
        if (rim2 > 0.05) c = CYTO[5];
        else if (rim2 > -0.45) c = CYTO[4];
        else if (rim2 > -0.88) c = CYTO[3];
        else c = ((x + y) & 1) ? CYTO[4] : CYTO[3];
        put(x, y, c); continue;
      }
      if (d > R - 2.1) { put(x, y, rim2 > 0.3 ? CYTO[3] : (rim2 < -0.6 ? CYTO[2] : CYTO[1])); continue; }

      const ndx = px - NX, ndy = py - NY, nd = Math.hypot(ndx, ndy);
      const NR = nucR(Math.atan2(ndy, ndx));
      if (nd <= NR) {
        const q = nd / NR;
        const nnx = ndx / NR, nny = ndy / NR, nnz = Math.sqrt(Math.max(0, 1 - nnx * nnx - nny * nny));
        const nl = Math.max(0, nnx * L[0] + nny * L[1] + nnz * L[2]);
        let v = 0.18 + 0.38 * nl + 0.28 * (1 - q) + pulse * 0.1;
        v += (hash((x >> 1), ((y - Math.round(NY)) >> 1), 11) - 0.5) * 0.22; // cromatina pegada al núcleo
        if (q > 0.86) v = Math.min(v, 0.22 + 0.2 * nl);
        let c = ramp(NUC, v, x, y);
        const nu = Math.hypot(px - (NX - 1), py - (NY - 1.4));
        if (nu < 1.0) c = NUC[6];
        else if (nu < 1.8) c = pulse > 0.5 ? NUC[5] : NUC[4];
        put(x, y, c); continue;
      }

      let d1 = 1e9, d2 = 1e9;
      for (const s of S) { const e = Math.hypot(px - s.x, py - s.y); if (e < d1) { d2 = d1; d1 = e; } else if (e < d2) d2 = e; }
      const fres = Math.pow(1 - nz, 2);
      let v = 0.16 + 0.44 * lam + 0.3 * fres;
      if (d2 - d1 < 1.05) v += 0.17; else v -= 0.07;
      if (nd < NR + 1.5) v -= 0.14;
      let c = ramp(CYTO, v, x, y);
      if (nd < NR + 1.2 && ((x + y) & 1) && rim2 < 0.7) c = NUC[1];
      put(x, y, c);
    }

    // Orgánulos (también con un poco de inercia)
    const oy0 = Math.round(BASE_Y + (yOff + lagOff) / 2);
    for (const [ox, oy, oc] of organelles) {
      const x = CX + ox, y = oy0 + oy;
      if (Math.hypot(x + 0.5 - CX, y + 0.5 - CY) < R - 2.2 && Math.hypot(x + 0.5 - NX, y + 0.5 - NY) > 6.3) put(x, y, oc);
    }

    // Brillo especular (pegado a la membrana)
    const hx = CX - 6, hy = CY - 7;
    put(hx, hy, WHITE); put(hx + 1, hy, CYTO[6]); put(hx, hy + 1, CYTO[6]); put(hx - 1, hy + 1, CYTO[5]); put(hx + 1, hy - 1, CYTO[5]);
    put(hx - 2, hy + 3, CYTO[6]); put(hx - 1, hy - 1, CYTO[5]);
    put(CX + 5, CY + 7, CYTO[5]); put(CX + 6, CY + 6, CYTO[5]);

    // 4) Destellos (5 estados en cada ciclo)
    for (const s of sparkles) {
      const k = (t + s.ph) % F;
      if (k === 0 || k === 5) put(s.x, s.y, LAV[2]);
      else if (k === 1 || k === 4) { put(s.x, s.y, NUC[4]); for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) put(s.x + a, s.y + b, CYTO[4]); }
      else if (k === 2 || k === 3) {
        put(s.x, s.y, NUC[4]);
        for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { put(s.x + a, s.y + b, CYTO[4]); put(s.x + 2 * a, s.y + 2 * b, LAV[2]); }
      }
    }

    const out = new Uint8ClampedArray(W * H * 4);
    buf.forEach((c, i) => { if (c) { const [r, g, b] = hex(c); out.set([r, g, b, 255], i * 4); } });
    return out;
  }

  return { W, H, FRAMES: 16, renderFrame };
}

function tira(shadow) {
  const { W, H, FRAMES, renderFrame } = createStemCell({ shadow });
  const buf = Buffer.alloc(W * FRAMES * H * 4);
  for (let f = 0; f < FRAMES; f++) {
    const px = renderFrame(f, FRAMES);
    for (let y = 0; y < H; y++) {
      Buffer.from(px.buffer, y * W * 4, W * 4).copy(buf, (y * W * FRAMES + f * W) * 4);
    }
  }
  return sharp(buf, { raw: { width: W * FRAMES, height: H, channels: 4 } });
}

mkdirSync(DIR, { recursive: true });
await tira(true).png({ compressionLevel: 9, effort: 10 }).toFile(SALIDA_SOMBRA);
await tira(false)
  .png({ palette: true, colors: COLORES_PUNTERO, dither: 0, compressionLevel: 9, effort: 10 })
  .toFile(SALIDA_PUNTERO);
for (const p of [SALIDA_SOMBRA, SALIDA_PUNTERO]) console.log(p, statSync(p).size, 'B');
