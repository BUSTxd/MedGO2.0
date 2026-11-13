// Mide dónde está cada tracto en la lámina «Medulla spinalis - tracts - English»
// de Polarlys (Commons, CC BY-SA 3.0), para ubicar los tractos del lab
// Médula Espinal 3D. No copia trazos: imprime ángulos y radios.
//
//   node scripts/medula-espinal/medir-tractos.mjs [--salida <carpeta>]
//
// Para cada mancha de color (rojo = motor, lado izquierdo; azul = sensitivo,
// lado derecho) da, con el ángulo desde dorsal:
//   r   = radio como fracción del contorno en ese ángulo (para óvalos), y
//   b   = posición en la banda blanca entre el gris y la superficie (para
//         sectores), con el mismo borde suavizado que usa engine/geometry.ts.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { suavizarPiso } from '../../src/app/dashboard/laboratorio/medula-espinal/engine/geometry.ts';

const args = process.argv.slice(2);
const SALIDA = (() => { const i = args.indexOf('--salida'); return i >= 0 ? args[i + 1] : path.join(os.tmpdir(), 'medula-vista'); })();
fs.mkdirSync(SALIDA, { recursive: true });
const SVG = path.join(SALIDA, 'Polarlys-tracts.svg');
if (!fs.existsSync(SVG)) {
  const r = await fetch('https://upload.wikimedia.org/wikipedia/commons/f/fe/Medulla_spinalis_-_tracts_-_English.svg',
    { headers: { 'User-Agent': 'medgo-vista/1.0' } });
  if (!r.ok) throw new Error(`No se pudo bajar la lámina: ${r.status}`);
  fs.writeFileSync(SVG, Buffer.from(await r.arrayBuffer()));
}

const { data, info } = await sharp(SVG, { density: 150 }).flatten({ background: '#fff' }).removeAlpha().raw()
  .toBuffer({ resolveWithObject: true });
const W = info.width;
const C = info.channels;
const X0 = 150, X1 = 1200, Y0 = 112, Y1 = 880; // zona del dibujo (sin leyenda)
const cls = (x, y) => {
  const i = (y * W + x) * C;
  const r = data[i], g = data[i + 1], b = data[i + 2];
  if (r > 200 && g < 60 && b < 80) return 'R';
  if (r < 60 && g > 100 && g < 180 && b > 200) return 'B';
  if (Math.abs(r - 160) < 25 && Math.abs(g - 160) < 25 && Math.abs(b - 160) < 25) return 'G';
  if (r < 90 && g < 90 && b < 90) return 'K';
  return 'W';
};

// Caja del corte.
let bx0 = 1e9, bx1 = -1, by0 = 1e9, by1 = -1;
for (let y = Y0; y < Y1; y++) for (let x = X0; x < X1; x++) {
  if (cls(x, y) !== 'W') { bx0 = Math.min(bx0, x); bx1 = Math.max(bx1, x); by0 = Math.min(by0, y); by1 = Math.max(by1, y); }
}
const cx = (bx0 + bx1) / 2, cy = (by0 + by1) / 2, hw = (bx1 - bx0) / 2, hh = (by1 - by0) / 2;
console.log(`caja ${bx0}-${bx1} × ${by0}-${by1}  ancho/alto ${(hw / hh).toFixed(3)}`);

// Rayos: contorno y salida del gris, por lado (der = ángulos 0-180 a la derecha).
function rayo(lado, ang) {
  const t = (ang * Math.PI) / 180;
  // El borde antialiasado del contorno negro sale gris medio: solo cuenta como
  // sustancia gris una racha de varios píxeles grises seguidos.
  let out = 0, gris = 0, racha = 0;
  for (let d = 0; d < hw * 1.3; d += 0.5) {
    const x = Math.round(cx + lado * d * Math.sin(t)), y = Math.round(cy - d * Math.cos(t));
    if (x < X0 || y < Y0 || x >= X1 || y >= Y1) break;
    const c = cls(x, y);
    if (c !== 'W') out = d;
    racha = c === 'G' ? racha + 1 : 0;
    if (racha >= 8) gris = d;
  }
  return { out, gris };
}
const perfil = {};
for (const lado of [-1, 1]) {
  const crudo = [];
  for (let a = 0; a <= 180; a++) { const r = rayo(lado, a); crudo.push(r.gris > 0 ? r.gris / r.out : 0); }
  perfil[lado] = { piso: suavizarPiso(crudo), out: Array.from({ length: 181 }, (_, a) => rayo(lado, a).out) };
}

// Manchas de color.
const lab = new Int32Array(W * Y1).fill(-1);
const manchas = [];
for (let y = Y0; y < Y1; y++) for (let x = X0; x < X1; x++) {
  const c = cls(x, y);
  if ((c !== 'R' && c !== 'B') || lab[y * W + x] >= 0) continue;
  const id = manchas.length, pila = [[x, y]], pts = [];
  lab[y * W + x] = id;
  while (pila.length) {
    const [a, b] = pila.pop();
    pts.push([a, b]);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const u = a + dx, v = b + dy;
      if (u < X0 || v < Y0 || u >= X1 || v >= Y1 || lab[v * W + u] >= 0 || cls(u, v) !== c) continue;
      lab[v * W + u] = id; pila.push([u, v]);
    }
  }
  if (pts.length > 300) manchas.push({ c, pts });
}

const pct = (arr, p) => { const s = [...arr].sort((m, n) => m - n); return s[Math.floor(p * (s.length - 1))]; };
for (const m of manchas) {
  const angs = [], rs = [], bs = [];
  let sx = 0, sy = 0, mx0 = 1e9, mx1 = -1, my0 = 1e9, my1 = -1;
  for (const [x, y] of m.pts) {
    sx += x; sy += y;
    mx0 = Math.min(mx0, x); mx1 = Math.max(mx1, x); my0 = Math.min(my0, y); my1 = Math.max(my1, y);
    const lado = x < cx ? -1 : 1;
    const dx = Math.abs(x - cx), dy = cy - y;
    const a = Math.round((Math.atan2(dx, dy) * 180) / Math.PI);
    const out = perfil[lado].out[a] || 1;
    const r = Math.hypot(dx, dy) / out;
    const g = perfil[lado].piso[a];
    angs.push(a); rs.push(r); bs.push((r - g) / (1 - g));
  }
  const mxp = sx / m.pts.length, myp = sy / m.pts.length;
  const ac = (Math.atan2(Math.abs(mxp - cx), cy - myp) * 180) / Math.PI;
  console.log(
    `${m.c === 'R' ? 'motor    ' : 'sensitivo'} centro x=${(Math.abs(mxp - cx) / hw).toFixed(3)} y=${((cy - myp) / hh).toFixed(3)} (caja)`
    + `  ang ${ac.toFixed(0)}° [${pct(angs, 0.05)}-${pct(angs, 0.95)}]`
    + `  r ${pct(rs, 0.5).toFixed(2)} [${pct(rs, 0.05).toFixed(2)}-${pct(rs, 0.95).toFixed(2)}]`
    + `  b [${pct(bs, 0.05).toFixed(2)}-${pct(bs, 0.95).toFixed(2)}]`
    + `  semiejes ${((mx1 - mx0) / 2 / hw).toFixed(3)} × ${((my1 - my0) / 2 / hw).toFixed(3)}`,
  );
}
