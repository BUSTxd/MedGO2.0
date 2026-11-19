// Abdomen 3D: pinta el modelo sin navegador (rasterizado por software con
// z-buffer, proyección ortográfica) para revisar lo partido y lo modelado.
//
//   node scripts/atlas-3d/abdomen/vista.mjs --vista anterior [--solo <regex>] [--resaltar <regex>]
//        [--translucido] [--centro x,y,z --ancho 0.2] [--px 900] [--salida archivo.png]
//
// Lee scripts/atlas-3d/salida/abdomen/piezas.json (lo deja construir.mjs).
// `--translucido`: todo lo no resaltado al 25 %, como en el examen.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const AQUI = path.dirname(fileURLToPath(import.meta.url));

/** Dirección hacia la que mira la cámara (de la cámara al objeto) y su «arriba». +X = izquierda del cuerpo, +Z = anterior. */
export const VISTAS = {
  anterior: { dir: [0, 0, -1], up: [0, 1, 0] },
  posterior: { dir: [0, 0, 1], up: [0, 1, 0] },
  derecha: { dir: [1, 0, 0], up: [0, 1, 0] },
  izquierda: { dir: [-1, 0, 0], up: [0, 1, 0] },
  inferior: { dir: [0, 1, -0.35], up: [0, 0.35, 1] },
  superior: { dir: [0, -1, -0.2], up: [0, 0.2, -1] },
  oblicua: { dir: [-0.45, -0.25, -1], up: [0, 1, 0] },
};

const norm = (v) => { const l = Math.hypot(...v) || 1; return v.map((x) => x / l); };
const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));

/**
 * piezas: [{ v: number[], f: number[], color: '#rrggbb', alfa?: 0-1 }]
 * Devuelve un PNG (Buffer).
 */
export async function pintar(piezas, { vista = 'anterior', centro, ancho, px = 900 } = {}) {
  const { dir, up } = VISTAS[vista];
  const d = norm(dir);
  const r = norm(cruz(d, up)); // derecha de la imagen
  const u = cruz(r, d);
  // Caja de lo que se pinta → encuadre.
  let mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
  for (const p of piezas) for (let i = 0; i < p.v.length; i += 3) for (let a = 0; a < 3; a++) { mn[a] = Math.min(mn[a], p.v[i + a]); mx[a] = Math.max(mx[a], p.v[i + a]); }
  const c = centro ?? mn.map((x, a) => (x + mx[a]) / 2);
  const tam = ancho ?? Math.max(mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]) * 1.05;
  const W = px, H = px;
  const esc = W / tam;
  const zbuf = new Float32Array(W * H).fill(Infinity);
  const img = new Float32Array(W * H * 3).fill(1);
  for (let i = 0; i < W * H; i++) { img[i * 3] = 0.96; img[i * 3 + 1] = 0.95; img[i * 3 + 2] = 0.93; }
  const luz = norm([-0.3 * r[0] + 0.5 * u[0] - d[0], -0.3 * r[1] + 0.5 * u[1] - d[1], -0.3 * r[2] + 0.5 * u[2] - d[2]]);
  const proy = (x, y, z) => {
    const q = [x - c[0], y - c[1], z - c[2]];
    return [W / 2 + (q[0] * r[0] + q[1] * r[1] + q[2] * r[2]) * esc, H / 2 - (q[0] * u[0] + q[1] * u[1] + q[2] * u[2]) * esc, q[0] * d[0] + q[1] * d[1] + q[2] * d[2]];
  };
  // Opacas primero (z-buffer), translúcidas después sin escribir profundidad.
  const orden = [...piezas].sort((a, b) => (a.alfa ?? 1) < 1 ? 1 : (b.alfa ?? 1) < 1 ? -1 : 0);
  for (const p of orden) {
    const col = hex(p.color).map((x) => x / 255);
    const alfa = p.alfa ?? 1;
    const V = [];
    for (let i = 0; i < p.v.length; i += 3) V.push(proy(p.v[i], p.v[i + 1], p.v[i + 2]));
    for (let t = 0; t < p.f.length; t += 3) {
      const A = V[p.f[t]], B = V[p.f[t + 1]], Cc = V[p.f[t + 2]];
      // Normal en el mundo para el sombreado (dos caras).
      const ia = p.f[t] * 3, ib = p.f[t + 1] * 3, ic = p.f[t + 2] * 3;
      const e1 = [p.v[ib] - p.v[ia], p.v[ib + 1] - p.v[ia + 1], p.v[ib + 2] - p.v[ia + 2]];
      const e2 = [p.v[ic] - p.v[ia], p.v[ic + 1] - p.v[ia + 1], p.v[ic + 2] - p.v[ia + 2]];
      let n = norm(cruz(e1, e2));
      if (n[0] * d[0] + n[1] * d[1] + n[2] * d[2] > 0) n = n.map((x) => -x);
      const k = 0.35 + 0.65 * Math.max(0, n[0] * luz[0] + n[1] * luz[1] + n[2] * luz[2]);
      const x0 = Math.max(0, Math.floor(Math.min(A[0], B[0], Cc[0]))), x1 = Math.min(W - 1, Math.ceil(Math.max(A[0], B[0], Cc[0])));
      const y0 = Math.max(0, Math.floor(Math.min(A[1], B[1], Cc[1]))), y1 = Math.min(H - 1, Math.ceil(Math.max(A[1], B[1], Cc[1])));
      if (x0 > x1 || y0 > y1) continue;
      const area = (B[0] - A[0]) * (Cc[1] - A[1]) - (B[1] - A[1]) * (Cc[0] - A[0]);
      if (Math.abs(area) < 1e-9) continue;
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        const px_ = x + 0.5, py = y + 0.5;
        const w0 = ((B[0] - px_) * (Cc[1] - py) - (B[1] - py) * (Cc[0] - px_)) / area;
        const w1 = ((Cc[0] - px_) * (A[1] - py) - (Cc[1] - py) * (A[0] - px_)) / area;
        const w2 = 1 - w0 - w1;
        if (w0 < 0 || w1 < 0 || w2 < 0) continue;
        const z = w0 * A[2] + w1 * B[2] + w2 * Cc[2];
        const j = y * W + x;
        if (z >= zbuf[j]) continue;
        if (alfa >= 1) zbuf[j] = z;
        for (let a = 0; a < 3; a++) img[j * 3 + a] = img[j * 3 + a] * (1 - alfa) + col[a] * k * alfa;
      }
    }
  }
  const buf = Buffer.alloc(W * H * 3);
  for (let i = 0; i < buf.length; i++) buf[i] = Math.max(0, Math.min(255, Math.round(img[i] * 255)));
  return sharp(buf, { raw: { width: W, height: H, channels: 3 } }).png().toBuffer();
}

/** Decodifica un paquete del atlas (formato 2) como lo hace el navegador. */
export async function leerPaquete(dir) {
  const { MeshoptDecoder } = await import('meshoptimizer');
  await MeshoptDecoder.ready;
  const m = JSON.parse(fs.readFileSync(path.join(dir, 'manifiesto.json'), 'utf8'));
  const zlib = await import('node:zlib');
  const buf = zlib.gunzipSync(fs.readFileSync(path.join(dir, 'geometria.bin.gz')));
  if (buf.length !== m.bytes) throw new Error('El paquete no cuadra con su manifiesto');
  return m.piezas.map((p) => {
    const vb = new Uint8Array(p.v * 8);
    MeshoptDecoder.decodeVertexBuffer(vb, p.v, 8, new Uint8Array(buf.buffer, buf.byteOffset + p.vb, p.vbn));
    const q = new Uint16Array(vb.buffer);
    const v = [];
    for (let i = 0; i < p.v; i++) for (let a = 0; a < 3; a++) v.push(m.min[a] + q[i * 4 + a] * m.paso[a]);
    const tam = p.idx32 ? 4 : 2;
    const ib = new Uint8Array(p.i * tam);
    MeshoptDecoder.decodeIndexBuffer(ib, p.i, tam, new Uint8Array(buf.buffer, buf.byteOffset + p.ib, p.ibn));
    const f = [...(p.idx32 ? new Uint32Array(ib.buffer) : new Uint16Array(ib.buffer))];
    return { en: p.nombreEn, sistema: p.sistema, color: p.color, v, f };
  });
}

// ─── CLI ─────────────────────────────────────────────────────────────────────
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const arg = (n, def) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : def; };
  // `--paquete`: lo que se publica (manifiesto + geometría codificada), no las piezas a resolución completa.
  const datos = process.argv.includes('--paquete') ? await leerPaquete(path.join(AQUI, '../salida/abdomen')) : JSON.parse(fs.readFileSync(arg('piezas', path.join(AQUI, '../salida/abdomen/piezas.json')), 'utf8'));
  const solo = arg('solo') ? new RegExp(arg('solo'), 'i') : null;
  const resaltar = arg('resaltar') ? new RegExp(arg('resaltar'), 'i') : null;
  const translucido = process.argv.includes('--translucido');
  const COLORES = { hueso: '#e4d9bb', musculo: '#b2574b', arteria: '#d0382e', vena: '#3d6db3', organo: '#c98a7a', peritoneo: '#efd8a6' };
  const piezas = datos
    .filter((p) => !solo || solo.test(p.en) || (resaltar && resaltar.test(p.en)))
    .map((p) => {
      const res = resaltar?.test(p.en);
      return { v: p.v, f: p.f, color: res ? '#0a84ff' : p.color ?? COLORES[p.sistema], alfa: translucido && !res && p.sistema !== 'hueso' ? 0.22 : 1 };
    });
  const centro = arg('centro')?.split(',').map(Number);
  const png = await pintar(piezas, { vista: arg('vista', 'anterior'), centro, ancho: arg('ancho') ? +arg('ancho') : undefined, px: +arg('px', 900) });
  const salida = arg('salida', path.join(AQUI, '../salida/abdomen/vista.png'));
  fs.writeFileSync(salida, png);
  console.log(`✓ ${piezas.length} piezas → ${salida}`);
}
