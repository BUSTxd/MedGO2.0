// Compara el corte transversal del lab Médula Espinal 3D con su referencia,
// Gray's Anatomy fig. 666 (dominio público), sin navegador.
//
//   npm run vista:medula [-- --salida <carpeta>] [--nivel cervical]
//
// Por nivel escribe <salida>/<nivel>.png con cuatro paneles:
//   referencia | modelo en gris | superposición (contornos del modelo sobre
//   la referencia) | láminas y tractos
// e imprime cuánto calzan (IoU de la silueta y de la sustancia gris).
// Además comprueba que cada tracto quede dentro de la blanca y fuera del gris
// y de la fisura; si algo falla, sale con código 1.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import {
  contornoMedula, contornoGris, createGrayRegions, createTracts, canalCentral, septoPosterior,
} from '../../src/app/dashboard/laboratorio/medula-espinal/engine/geometry.ts';
import { LEVELS, LAMINA_GROUP_LIST } from '../../src/app/dashboard/laboratorio/medula-espinal/engine/anatomy.ts';

const args = process.argv.slice(2);
const arg = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const SALIDA = arg('--salida', path.join(os.tmpdir(), 'medula-vista'));
const SOLO = arg('--nivel', null);
fs.mkdirSync(SALIDA, { recursive: true });

// ── Referencia ──────────────────────────────────────────────────────────────
const URL_GRAY = 'https://upload.wikimedia.org/wikipedia/commons/1/11/Gray666.png';
const GRAY = path.join(SALIDA, 'Gray666.png');
// Recortes de cada nivel en la lámina original (142×600 px).
const RECORTES = {
  cervical: { rotulo: 'C5', left: 6, top: 138, width: 88, height: 67 },
  toracico: { rotulo: 'Th8', left: 20, top: 335, width: 57, height: 52 },
  lumbar: { rotulo: 'L3', left: 20, top: 443, width: 61, height: 58 },
  sacro: { rotulo: 'S2', left: 23, top: 507, width: 52, height: 49 },
};
const ESC = 6; // aumento del recorte

if (!fs.existsSync(GRAY)) {
  const r = await fetch(URL_GRAY, { headers: { 'User-Agent': 'medgo-vista/1.0' } });
  if (!r.ok) throw new Error(`No se pudo bajar Gray 666: ${r.status}`);
  fs.writeFileSync(GRAY, Buffer.from(await r.arrayBuffer()));
}

async function referencia(nivel) {
  const c = RECORTES[nivel];
  const W = c.width * ESC;
  const H = c.height * ESC;
  const png = await sharp(GRAY).extract(c).resize(W, H, { kernel: 'lanczos3' }).greyscale().png().toBuffer();
  const { data } = await sharp(png).blur(2).extractChannel(0).raw().toBuffer({ resolveWithObject: true });
  // Caja del corte (contorno negro) para alinear.
  let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (data[y * W + x] < 120) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  }
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const hw = (x1 - x0) / 2;
  // Máscara de sustancia gris: oscuridad media en una ventana grande.
  const { data: suave } = await sharp(png).blur(7).extractChannel(0).raw().toBuffer({ resolveWithObject: true });
  return { png, W, H, cx, cy, hw, data, suave };
}

// ── Geometría → SVG ─────────────────────────────────────────────────────────
const LAM = Object.fromEntries(LAMINA_GROUP_LIST.map((g) => [g.id, g.color]));

function shapePts(shape) { return shape.getPoints(1).map((p) => ({ x: p.x, y: p.y })); }

function trazo(pts, tx) {
  return pts.map((p, i) => `${i ? 'L' : 'M'}${tx(p).join(',')}`).join('') + 'Z';
}

function modelo(nivel, ref) {
  const rx = LEVELS[nivel].corte.rx;
  // escena → píxeles de la referencia
  const tx = (p) => [(ref.cx + (p.x / rx) * ref.hw).toFixed(1), (ref.cy - (p.y / rx) * ref.hw).toFixed(1)];
  const cord = contornoMedula(nivel);
  const gris = contornoGris(nivel);
  const canal = canalCentral(nivel);
  const [s0, s1] = septoPosterior(nivel);
  const regiones = createGrayRegions(nivel);
  const tractos = createTracts(nivel);
  const cc = tx(canal);
  const canalR = (canal.r / rx) * ref.hw;
  const sep = `<path d="M${tx(s0).join(',')}L${tx(s1).join(',')}" stroke="#555" stroke-width="2"/>`;

  const enGris = `
    <path d="${trazo(cord, tx)}" fill="#f1eef7" stroke="#222" stroke-width="5"/>
    <path d="${trazo(gris, tx)}" fill="#6b6778"/>
    ${sep}
    <circle cx="${cc[0]}" cy="${cc[1]}" r="${canalR}" fill="#fff"/>`;

  const encima = `
    <path d="${trazo(cord, tx)}" fill="none" stroke="#e0322e" stroke-width="3"/>
    <path d="${trazo(gris, tx)}" fill="#2e86de" fill-opacity="0.28" stroke="#2e86de" stroke-width="2.5"/>`;

  let color = `<path d="${trazo(cord, tx)}" fill="#f1eef7" stroke="#999" stroke-width="2"/>`;
  for (const t of tractos) for (const p of t.pieces) {
    color += `<path d="${trazo(shapePts(p.shape), tx)}" fill="${t.color}" fill-opacity="${0.95 - p.shade * 0.5}"/>`;
  }
  for (const [id, shapes] of regiones) for (const s of shapes) {
    color += `<path d="${trazo(shapePts(s), tx)}" fill="${LAM[id]}" stroke="#fff" stroke-width="0.8"/>`;
  }
  color += `<circle cx="${cc[0]}" cy="${cc[1]}" r="${canalR}" fill="#3a3550"/>`;

  return { enGris, encima, color, cord, gris, tractos, tx };
}

// ── Medidas ─────────────────────────────────────────────────────────────────
function dentro(pts, x, y) {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i], b = pts[j];
    if ((a.y > y) !== (b.y > y) && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) c = !c;
  }
  return c;
}

/** IoU entre la silueta del modelo y la de la referencia (en píxeles). */
function iou(ref, mod, umbralGris) {
  const rx = mod.rx;
  let interC = 0, uniC = 0, interG = 0, uniG = 0;
  // Silueta de la referencia: dentro del contorno negro, por filas.
  for (let y = 0; y < ref.H; y += 2) {
    let xa = -1, xb = -1;
    for (let x = 0; x < ref.W; x++) if (ref.data[y * ref.W + x] < 120) { if (xa < 0) xa = x; xb = x; }
    for (let x = 0; x < ref.W; x += 2) {
      const sx = ((x - ref.cx) / ref.hw) * rx;
      const sy = ((ref.cy - y) / ref.hw) * rx;
      const enRef = xa >= 0 && x >= xa && x <= xb;
      const enMod = dentro(mod.cord, sx, sy);
      if (enRef && enMod) interC++;
      if (enRef || enMod) uniC++;
      const gRef = enRef && ref.suave[y * ref.W + x] < umbralGris && Math.abs(x - xa) > 14 && Math.abs(x - xb) > 14;
      const gMod = dentro(mod.gris, sx, sy);
      if (gRef && gMod) interG++;
      if (gRef || gMod) uniG++;
    }
  }
  return { silueta: interC / uniC, gris: interG / uniG };
}

// ── Chequeo de tractos ──────────────────────────────────────────────────────
function centroide(pts) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const f = pts[j].x * pts[i].y - pts[i].x * pts[j].y;
    a += f; cx += (pts[j].x + pts[i].x) * f; cy += (pts[j].y + pts[i].y) * f;
  }
  return { x: cx / (3 * a), y: cy / (3 * a) };
}

function chequear(nivel, mod) {
  const fallos = [];
  for (const t of mod.tractos) {
    t.pieces.forEach((p, i) => {
      if (i % 2) return; // basta el lado derecho
      const pts = p.pts;
      const fuera = pts.filter((q) => !dentro(mod.cord, q.x, q.y)).length;
      if (fuera > pts.length * 0.08) fallos.push(`${t.id}${p.layer ? `/${p.layer}` : ''}: ${fuera}/${pts.length} puntos fuera de la médula o en la fisura`);
      // Centroide; si cae fuera de la propia pieza (media luna), un punto
      // interior: el medio entre el arco exterior y el interior.
      let c = centroide(pts);
      if (!dentro(pts, c.x, c.y)) {
        const a = pts[Math.floor(pts.length / 4)];
        const b = pts[pts.length - 1 - Math.floor(pts.length / 4)];
        c = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      }
      if (dentro(mod.gris, c.x, c.y)) fallos.push(`${t.id}${p.layer ? `/${p.layer}` : ''}: el centro cae en la sustancia gris`);
    });
  }
  return fallos;
}

// ── Composición ─────────────────────────────────────────────────────────────
let hayFallos = false;
const niveles = SOLO ? [SOLO] : Object.keys(RECORTES);
for (const nivel of niveles) {
  const ref = await referencia(nivel);
  const m = modelo(nivel, ref);
  const svg = (cuerpo, fondo = '#fff') => Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${ref.W}" height="${ref.H}"><rect width="100%" height="100%" fill="${fondo}"/>${cuerpo}</svg>`);
  const svgSinFondo = (cuerpo) => Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${ref.W}" height="${ref.H}">${cuerpo}</svg>`);

  const pGris = await sharp(svg(m.enGris)).png().toBuffer();
  const pEncima = await sharp(ref.png).composite([{ input: await sharp(svgSinFondo(m.encima)).png().toBuffer() }]).png().toBuffer();
  const pColor = await sharp(svg(m.color)).png().toBuffer();

  const pad = 16, top = 40;
  const ancho = ref.W * 4 + pad * 5;
  const rot = ['Gray 666 · ' + RECORTES[nivel].rotulo, 'Modelo', 'Superposición', 'Láminas y tractos'];
  const titulos = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${top}">${
    rot.map((r, i) => `<text x="${pad + i * (ref.W + pad) + ref.W / 2}" y="27" font-family="Arial" font-size="20" text-anchor="middle">${r}</text>`).join('')}</svg>`);
  const out = path.join(SALIDA, `${nivel}.png`);
  await sharp({ create: { width: ancho, height: ref.H + top + pad, channels: 3, background: '#ffffff' } })
    .composite([
      { input: titulos, left: 0, top: 0 },
      { input: ref.png, left: pad, top },
      { input: pGris, left: pad * 2 + ref.W, top },
      { input: pEncima, left: pad * 3 + ref.W * 2, top },
      { input: pColor, left: pad * 4 + ref.W * 3, top },
    ])
    .png().toFile(out);

  const medida = iou(ref, { ...m, rx: LEVELS[nivel].corte.rx }, 150);
  const fallos = chequear(nivel, m);
  console.log(`${nivel.padEnd(9)} silueta ${(medida.silueta * 100).toFixed(1)} %  gris ${(medida.gris * 100).toFixed(1)} %  → ${out}`);
  for (const f of fallos) console.log(`   ✗ ${f}`);
  if (fallos.length) hayFallos = true;
}

// ── Hoja de tractos contra la lámina de Polarlys ────────────────────────────
// «Medulla spinalis - tracts - English» (Commons, CC BY-SA 3.0): motores a la
// izquierda (rojo) y sensitivos a la derecha (azul). Se usa solo para comparar.
if (!SOLO) {
  const URL_TR = 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Medulla_spinalis_-_tracts_-_English.svg';
  const SVG_TR = path.join(SALIDA, 'Polarlys-tracts.svg');
  if (!fs.existsSync(SVG_TR)) {
    const r = await fetch(URL_TR, { headers: { 'User-Agent': 'medgo-vista/1.0' } });
    if (!r.ok) throw new Error(`No se pudo bajar la lámina de tractos: ${r.status}`);
    fs.writeFileSync(SVG_TR, Buffer.from(await r.arrayBuffer()));
  }
  // Recorte del dibujo (sin la leyenda) en el render a 150 ppp y caja del corte.
  const REC = { left: 150, top: 20, width: 1020, height: 880 };
  const CAJA = { x0: 203, x1: 1113, y0: 118, y1: 860 };
  const cxP = (CAJA.x0 + CAJA.x1) / 2 - REC.left;
  const cyP = (CAJA.y0 + CAJA.y1) / 2 - REC.top;
  const hwP = (CAJA.x1 - CAJA.x0) / 2;
  const hhP = (CAJA.y1 - CAJA.y0) / 2;
  const lamina = await sharp(SVG_TR, { density: 150 }).flatten({ background: '#fff' }).extract(REC).png().toBuffer();

  const ROJO = '#e8102a';
  const AZUL = '#0b8fe0';
  const dibujo = (nivel, tx, soloContornos) => {
    const cord = contornoMedula(nivel);
    const gris = contornoGris(nivel);
    let s = soloContornos
      ? `<path d="${trazo(cord, tx)}" fill="none" stroke="#111" stroke-width="2.5" stroke-dasharray="8 5"/>
         <path d="${trazo(gris, tx)}" fill="none" stroke="#111" stroke-width="2.5" stroke-dasharray="8 5"/>`
      : `<path d="${trazo(cord, tx)}" fill="#fff" stroke="#222" stroke-width="2.5"/>
         <path d="${trazo(gris, tx)}" fill="#a0a0a0" stroke="#333" stroke-width="2"/>`;
    for (const t of createTracts(nivel)) {
      const color = t.direction === 'descendente' ? ROJO : AZUL;
      for (const p of t.pieces) {
        s += soloContornos
          ? `<path d="${trazo(shapePts(p.shape), tx)}" fill="none" stroke="#111" stroke-width="2.5"/>`
          : `<path d="${trazo(shapePts(p.shape), tx)}" fill="${color}" fill-opacity="${(1 - p.shade * 0.6).toFixed(2)}" stroke="#fff" stroke-width="0.6"/>`;
      }
    }
    return s;
  };
  const panel = async (cuerpo, fondo) => {
    const svgB = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${REC.width}" height="${REC.height}">${cuerpo}</svg>`);
    const base = fondo ?? await sharp({ create: { width: REC.width, height: REC.height, channels: 3, background: '#ffffff' } }).png().toBuffer();
    return sharp(base).composite([{ input: await sharp(svgB).png().toBuffer() }]).png().toBuffer();
  };
  // Modelo en su propia proporción; superposición por caja (el óvalo de cada
  // nivel se estira a la caja de la lámina).
  const txPropio = (nivel) => (p) => {
    const rx = LEVELS[nivel].corte.rx;
    return [(cxP + (p.x / rx) * hwP).toFixed(1), (cyP - (p.y / rx) * hwP).toFixed(1)];
  };
  const txCaja = (nivel) => (p) => {
    const { rx, ry } = LEVELS[nivel].corte;
    return [(cxP + (p.x / rx) * hwP).toFixed(1), (cyP - (p.y / rx / ry) * hhP).toFixed(1)];
  };
  const celdas = [
    ['Polarlys · tractos', lamina],
    ['C5 encima de Polarlys', await panel(dibujo('cervical', txCaja('cervical'), true), lamina)],
    ['Modelo C5', await panel(dibujo('cervical', txPropio('cervical'), false))],
    ['Modelo Th8', await panel(dibujo('toracico', txPropio('toracico'), false))],
    ['Modelo L3', await panel(dibujo('lumbar', txPropio('lumbar'), false))],
    ['Modelo S2', await panel(dibujo('sacro', txPropio('sacro'), false))],
  ];
  const esc = 0.55;
  const cw = Math.round(REC.width * esc);
  const ch = Math.round(REC.height * esc);
  const pad = 14, top = 34;
  const capas = [];
  for (let i = 0; i < celdas.length; i++) {
    const [rot, buf] = celdas[i];
    const x = pad + (i % 3) * (cw + pad);
    const y = Math.floor(i / 3) * (ch + top + pad);
    capas.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${top}"><text x="${cw / 2}" y="24" font-family="Arial" font-size="20" text-anchor="middle">${rot}</text></svg>`), left: x, top: y });
    capas.push({ input: await sharp(buf).resize(cw, ch).png().toBuffer(), left: x, top: y + top });
  }
  const outT = path.join(SALIDA, 'tractos.png');
  await sharp({ create: { width: pad + 3 * (cw + pad), height: 2 * (ch + top + pad), channels: 3, background: '#ffffff' } })
    .composite(capas).png().toFile(outT);
  console.log(`tractos   → ${outT}`);
}

process.exit(hayFallos ? 1 : 0);
