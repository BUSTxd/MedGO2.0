/**
 * Recorta de las figuras de Robbins (cap. 6, figs. 6-13 a 6-20) las células y
 * las microfotografías del laboratorio «Hipersensibilidad».
 *
 *   node scripts/hipersensibilidad/recortar-robbins.mjs --dir <carpeta assets de Robbins>
 *
 * Células: quita el fondo del panel por RELLENO DESDE EL BORDE con tolerancia
 * (no por color global: el interior de una célula puede repetir el color del
 * panel), se queda con la pieza más grande (fuera flechas y rótulos sueltos),
 * suaviza el borde y lleva el lado mayor a 420 px. Con `circulo` se recorta solo
 * el cuerpo de la célula (sin receptores ni anticuerpos dibujados: esos los pone
 * la animación con código).
 *
 * Láminas (microfotografías): rectángulo tal cual, lado mayor ≤ 900 px; los
 * restos de flechas en inglés se tapan con `parches` (copia de un trozo vecino)
 * y los rótulos se ponen en español con SVG.
 *
 * Salida: `~/Downloads/hipersensibilidad-img/<id>.png` (para que BUST las pase a
 * AVIF) + `indice.html` (hoja de contactos), copia en `public/lab-hipersensibilidad/`
 * (fuera de git, para verlo en local) y `src/lib/data/hipersensibilidad/imagenes.ts`
 * regenerado con BASE local. Paso final: `subir-imagenes.mjs`.
 */

import sharp from 'sharp';
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const i = process.argv.indexOf('--dir');
if (i === -1) { console.error('Falta --dir <carpeta assets de Robbins>'); process.exit(1); }
const DIR = process.argv[i + 1];
const DESCARGAS = path.join(os.homedir(), 'Downloads', 'hipersensibilidad-img');
const PUBLICO = path.join(RAIZ, 'public', 'lab-hipersensibilidad');
mkdirSync(DESCARGAS, { recursive: true });
mkdirSync(PUBLICO, { recursive: true });

const F = {
  '6-13B': 'pagina-02_figura-6-13_B.png',
  '6-13C': 'pagina-02_figura-6-13_C.png',
  '6-14': 'pagina-03_figura-6-14.png',
  '6-16A': 'pagina-06_figura-6-16_A.png',
  '6-16B': 'pagina-06_figura-6-16_B.png',
  '6-16C': 'pagina-06_figura-6-16_C.png',
  '6-18A': 'pagina-10_figura-6-18_A.png',
  '6-18B': 'pagina-10_figura-6-18_B.png',
  '6-19A': 'pagina-11_figura-6-19_A.png',
  '6-19B': 'pagina-11_figura-6-19_B.png',
  '6-20': 'pagina-11_figura-6-20.png',
};

// caja: [x, y, w, h] en px de la figura. circulo: [cx, cy, r] en px de la figura.
// parches: [x, y, w, h, dx, dy] en px de la figura (se copia el trozo desplazado).
// borrar: [x, y, w, h] en px de la figura (se vuelve transparente: flechas pegadas).
// quitarColor: [r, g, b, tol] (fuera los píxeles de ese color: receptores dibujados).
const RECORTES = [
  // Fig. 6-14 — secuencia de la hipersensibilidad tipo I
  { id: 'alergeno', fig: '6-14', caja: [388, 952, 66, 74], circulo: [421, 990, 31], desc: 'Grano de polen (alérgeno)' },
  { id: 'dendritica', fig: '6-14', caja: [383, 192, 168, 165], borrar: [[383, 256, 28, 30], [543, 250, 10, 40]], desc: 'Célula dendrítica con el alérgeno' },
  { id: 't_naive', fig: '6-14', caja: [548, 218, 118, 142], desc: 'Linfocito T CD4 naive' },
  { id: 'th2', fig: '6-14', caja: [543, 381, 127, 150], desc: 'Linfocito Th2' },
  { id: 'linfocito_b', fig: '6-14', caja: [380, 370, 168, 175], borrar: [[380, 370, 22, 62], [537, 448, 12, 28]], desc: 'Linfocito B con su BCR' },
  { id: 'plasmocito_ige', fig: '6-14', caja: [413, 581, 142, 126], desc: 'Célula plasmática secretora de IgE' },
  { id: 'mastocito', fig: '6-14', caja: [495, 750, 128, 128], circulo: [558, 812, 60], quitarColor: [240, 190, 40, 95], desc: 'Mastocito (cuerpo, sin receptores)' },
  { id: 'mastocito_activo', fig: '6-14', caja: [495, 1130, 136, 130], circulo: [563, 1195, 64], quitarColor: [240, 190, 40, 95], desc: 'Mastocito desgranulando (cuerpo)' },
  // Fig. 6-16 — tipo II
  { id: 'celula_opsonizada', fig: '6-16A', caja: [180, 78, 134, 136], circulo: [246, 146, 63], desc: 'Célula opsonizada (C3b en la membrana)' },
  { id: 'fagocito', fig: '6-16A', caja: [340, 70, 155, 170], borrar: [[338, 68, 12, 48]], desc: 'Fagocito con receptores Fc y de C3b' },
  { id: 'fagocito_engullendo', fig: '6-16A', caja: [660, 68, 162, 172], borrar: [[660, 150, 16, 26]], desc: 'Fagocito engullendo la célula' },
  { id: 'terminal_nerviosa', fig: '6-16C', caja: [170, 38, 310, 160], desc: 'Terminal nerviosa motora con vesículas de ACh' },
  { id: 'tirocito', fig: '6-16C', caja: [962, 162, 122, 116], desc: 'Célula epitelial tiroidea' },
  // Fig. 6-18 — tipo IV
  { id: 'apc', fig: '6-18A', caja: [88, 70, 168, 168], desc: 'Célula presentadora con antígeno de tejido' },
  { id: 't_cd4', fig: '6-18A', caja: [283, 56, 130, 152], desc: 'Linfocito T CD4+' },
  { id: 'neutrofilo', fig: '6-18A', caja: [848, 90, 132, 128], desc: 'Neutrófilo' },
  { id: 'macrofago', fig: '6-18A', caja: [982, 96, 126, 132], desc: 'Macrófago' },
  { id: 'tejido_sano', fig: '6-18A', caja: [558, 310, 214, 104], desc: 'Epitelio sano' },
  { id: 'tejido_danado', fig: '6-18A', caja: [870, 307, 216, 108], desc: 'Epitelio dañado' },
  { id: 't_cd8', fig: '6-18B', caja: [298, 50, 132, 156], desc: 'Linfocito T CD8+ citotóxico' },
  // Microfotografías
  { id: 'lamina_inmediata', fig: '6-13B', lamina: true, caja: [262, 30, 329, 195], parches: [[262, 110, 26, 16, 0, -24], [370, 205, 24, 20, 30, 0]], desc: 'Fase inmediata: mastocitos, edema y congestión' },
  { id: 'lamina_tardia', fig: '6-13C', lamina: true, caja: [0, 0, 327, 248], desc: 'Fase tardía: infiltrado rico en eosinófilos' },
  { id: 'lamina_dth', fig: '6-19A', lamina: true, caja: [0, 0, 375, 524], desc: 'Hipersensibilidad retardada: manguito perivascular' },
  { id: 'lamina_dth_cd4', fig: '6-19B', lamina: true, caja: [0, 0, 333, 524], desc: 'Hipersensibilidad retardada: inmunoperoxidasa anti-CD4' },
  { id: 'lamina_granuloma', fig: '6-20', lamina: true, caja: [0, 0, 741, 483], desc: 'Inflamación granulomatosa en un ganglio' },
];

// Solo algunos: --solo id1,id2
const j = process.argv.indexOf('--solo');
const SOLO = j === -1 ? null : new Set(process.argv[j + 1].split(','));

const dist = (d, k, c) => Math.hypot(d[k] - c[0], d[k + 1] - c[1], d[k + 2] - c[2]);

function quitarFondo(data, w, h, r) {
  const tol = r.tol ?? 34;
  // Color del panel: mediana del borde.
  const borde = [];
  for (let x = 0; x < w; x++) { borde.push(x, x + (h - 1) * w); }
  for (let y = 0; y < h; y++) { borde.push(y * w, y * w + w - 1); }
  const canal = (c) => borde.map((p) => data[p * 4 + c]).sort((a, b) => a - b)[borde.length >> 1];
  const bg = [canal(0), canal(1), canal(2)];

  const fondo = new Uint8Array(w * h);
  // Máscara circular: lo de fuera es fondo.
  for (const [bx, by, bw, bh] of r.borrar ?? []) {
    for (let y = Math.max(0, by - r.caja[1]); y < Math.min(h, by - r.caja[1] + bh); y++) for (let x = Math.max(0, bx - r.caja[0]); x < Math.min(w, bx - r.caja[0] + bw); x++) fondo[y * w + x] = 1;
  }
  if (r.quitarColor) {
    const [cr, cg, cb, ct] = r.quitarColor;
    for (let p = 0; p < w * h; p++) if (dist(data, p * 4, [cr, cg, cb]) < ct) fondo[p] = 1;
  }
  if (r.circulo) {
    const [cx, cy, rr] = r.circulo;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (Math.hypot(x + r.caja[0] - cx, y + r.caja[1] - cy) > rr) fondo[y * w + x] = 1;
  }
  // Relleno desde el borde (y desde el exterior del círculo).
  const cola = [];
  for (let p = 0; p < w * h; p++) {
    const x = p % w, y = (p / w) | 0;
    if ((x === 0 || y === 0 || x === w - 1 || y === h - 1 || fondo[p]) && dist(data, p * 4, bg) < tol) { fondo[p] = 1; cola.push(p); }
  }
  for (let q = 0; q < cola.length; q++) {
    const p = cola[q], x = p % w, y = (p / w) | 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const n = ny * w + nx;
      if (!fondo[n] && dist(data, n * 4, bg) < tol) { fondo[n] = 1; cola.push(n); }
    }
  }
  // Piezas sueltas (flechas, rótulos): se queda la más grande y lo que mida
  // al menos una quinta parte de ella.
  const comp = new Int32Array(w * h).fill(-1);
  const areas = [];
  for (let p = 0; p < w * h; p++) {
    if (fondo[p] || comp[p] !== -1) continue;
    const id = areas.length;
    let area = 0;
    const pila = [p];
    comp[p] = id;
    while (pila.length) {
      const c = pila.pop(); area++;
      const x = c % w, y = (c / w) | 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const n = ny * w + nx;
        if (!fondo[n] && comp[n] === -1) { comp[n] = id; pila.push(n); }
      }
    }
    areas.push(area);
  }
  const mayor = Math.max(...areas);
  const vale = areas.map((a) => r.todas ? a > 12 : a >= mayor * 0.2);

  const out = Buffer.alloc(w * h * 4);
  for (let p = 0; p < w * h; p++) {
    data.copy(out, p * 4, p * 4, p * 4 + 3);
    if (fondo[p] || !vale[comp[p]]) { out[p * 4 + 3] = 0; continue; }
    // Borde suave: un píxel del contorno parecido al panel se vuelve translúcido.
    const x = p % w, y = (p / w) | 0;
    let contorno = false;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h || fondo[ny * w + nx]) { contorno = true; break; }
    }
    let a = 255;
    if (contorno) a = Math.round(Math.min(1, Math.max(0.25, dist(data, p * 4, bg) / 110)) * 255);
    if (r.circulo) {
      const d = r.circulo[2] - Math.hypot(x + r.caja[0] - r.circulo[0], y + r.caja[1] - r.circulo[1]);
      if (d < 1.5) a = Math.min(a, Math.round(Math.max(0, d / 1.5) * 255));
    }
    out[p * 4 + 3] = a;
  }
  return out;
}

const medidas = {};
const filas = [];
for (const r of RECORTES) {
  if (SOLO && !SOLO.has(r.id)) continue;
  const [x, y, w, h] = r.caja;
  const src = path.join(DIR, F[r.fig]);
  const { data, info } = await sharp(src).ensureAlpha().extract({ left: x, top: y, width: w, height: h }).raw().toBuffer({ resolveWithObject: true });
  let buf = Buffer.from(data);
  {
    if (r.parches) {
      const fuente = Buffer.from(data);
      for (const [px, py, pw, ph, dx, dy] of r.parches) {
        for (let yy = 0; yy < ph; yy++) for (let xx = 0; xx < pw; xx++) {
          const tx = px - x + xx, ty = py - y + yy, sx = tx + dx, sy = ty + dy;
          if (tx < 0 || ty < 0 || tx >= w || ty >= h || sx < 0 || sy < 0 || sx >= w || sy >= h) continue;
          fuente.copy(buf, (ty * w + tx) * 4, (sy * w + sx) * 4, (sy * w + sx) * 4 + 4);
        }
      }
    }
  }
  if (!r.lamina) buf = quitarFondo(buf, info.width, info.height, r);
  let img = sharp(buf, { raw: { width: info.width, height: info.height, channels: 4 } });
  if (!r.lamina) img = sharp(await img.png().toBuffer()).trim({ threshold: 1 });
  const lado = r.lamina ? 900 : 420;
  const { data: png, info: fin } = await sharp(await img.png().toBuffer())
    .resize(lado, lado, { fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toBuffer({ resolveWithObject: true });
  writeFileSync(path.join(DESCARGAS, `${r.id}.png`), png);
  copyFileSync(path.join(DESCARGAS, `${r.id}.png`), path.join(PUBLICO, `${r.id}.png`));
  medidas[r.id] = { w: fin.width, h: fin.height, desc: r.desc, fig: r.fig };
  console.log(`  ${r.id.padEnd(22)} ${String(fin.width).padStart(4)}×${String(fin.height).padEnd(4)} ${(png.length / 1024).toFixed(0).padStart(4)} KB  fig. ${r.fig}`);
}

if (SOLO) { console.log('\n(--solo: imagenes.ts e indice.html sin regenerar)'); process.exit(0); }

for (const [id, m] of Object.entries(medidas)) filas.push(`  ${id}: { w: ${m.w}, h: ${m.h} }, // ${m.desc} — Robbins, fig. ${m.fig}`);
writeFileSync(path.join(RAIZ, 'src', 'lib', 'data', 'hipersensibilidad', 'imagenes.ts'), `// GENERADO por scripts/hipersensibilidad/recortar-robbins.mjs — no editar a mano.
// Recortes de las figuras 6-13 a 6-20 de Robbins (Patología humana, cap. 6).
// Medidas en px del recorte.
//
// Mientras BUST no las optimice, se sirven en local desde public/lab-hipersensibilidad/
// (fuera de git). Al subirlas al bucket (subir-imagenes.mjs) cambian BASE y EXT.

export const BASE = '/lab-hipersensibilidad';
export const EXT = 'png';

export const IMAGENES: Record<string, { w: number; h: number }> = {
${filas.join('\n')}
};

export const srcPropia = (id: string) => (IMAGENES[id] ? \`\${BASE}/\${id}.\${EXT}\` : null);
`);

const tarjetas = Object.entries(medidas).map(([id, m]) => `<figure><div><img src="${id}.png" alt=""></div><figcaption><b>${id}.png</b><br>${m.w}×${m.h} · fig. ${m.fig}<br>${m.desc}</figcaption></figure>`).join('\n');
writeFileSync(path.join(DESCARGAS, 'indice.html'), `<!doctype html><meta charset="utf-8"><title>Recortes · Hipersensibilidad</title>
<style>body{font-family:system-ui;margin:24px;background:#f4f5f7}h1{font-size:20px}p{color:#555}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}
figure{margin:0;background:#fff;border-radius:12px;padding:10px;box-shadow:0 1px 3px #0002}
figure div{height:180px;display:grid;place-items:center;background:repeating-conic-gradient(#eee 0 25%,#fff 0 50%) 0 0/16px 16px;border-radius:8px}
img{max-width:100%;max-height:180px}figcaption{font-size:12px;margin-top:8px;color:#333}</style>
<h1>Recortes para el laboratorio «Hipersensibilidad»</h1>
<p>Pásalos a AVIF con el MISMO nombre (alfa conservado en las células) y luego: <code>node scripts/hipersensibilidad/subir-imagenes.mjs --dir &lt;carpeta con los .avif&gt;</code></p>
<main>${tarjetas}</main>`);

console.log(`\n${Object.keys(medidas).length} recortes en ${DESCARGAS} (+ indice.html) · copia en public/lab-hipersensibilidad/ · imagenes.ts regenerado.`);
