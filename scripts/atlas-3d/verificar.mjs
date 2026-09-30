// Comprueba una región publicada contra el atlas original, leyendo lo que
// sirve el bucket (no la copia local), con la misma decodificación que
// src/lib/atlas-3d/cargar.ts:
//
//   node scripts/atlas-3d/verificar.mjs --region miembro-superior-derecho --version v1 \
//        [--atlas C:/Users/BUST/OneDrive/Desktop/human-atlas]
//
// Caza: archivo incompleto, offsets desalineados, índices fuera de rango,
// posiciones que no vuelven a las originales, piezas sin nombre o sin zona.

import dns from 'node:dns';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { config } from '../load-env.mjs';
import { DESPEGAR } from './regiones.mjs';

// En esta máquina el fetch de Node por IPv6 al CDN de Supabase se corta (ECONNRESET).
dns.setDefaultResultOrder('ipv4first');

const arg = (n, def) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 ? process.argv[i + 1] : def;
};
const REGION = arg('region');
const VERSION = arg('version');
const ATLAS = arg('atlas', 'C:/Users/BUST/OneDrive/Desktop/human-atlas');
if (!REGION || !VERSION) throw new Error('Uso: --region <id> --version v<N>');

const base = `${config.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/laboratorio-img/atlas-3d/${REGION}/${VERSION}`;
const m = await (await fetch(`${base}/manifiesto.json`)).json();
const gz = Buffer.from(await (await fetch(`${base}/geometria.bin.gz`)).arrayBuffer());
const bin = gz[0] === 0x1f && gz[1] === 0x8b ? zlib.gunzipSync(gz) : gz;

const errores = [];
const falla = (t) => errores.push(t);
if (bin.length !== m.bytes) falla(`geometría: ${bin.length} bytes, el manifiesto dice ${m.bytes}`);
const buf = bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength);

const modelos = path.join(ATLAS, 'public', 'models');
const atlas = JSON.parse(fs.readFileSync(path.join(modelos, 'atlas.json'), 'utf8'));
const chunks = atlas.chunks.map((c) => fs.readFileSync(path.join(modelos, path.basename(c.url))));
const original = new Map(atlas.parts.map((p) => [p.id, p]));

// Medio paso de cuantización, más la micra a la que la v1 redondeó `min`.
const tolerancia = Math.max(...m.paso) * 0.51 + 1e-6;
let peor = 0;
const ids = new Set();
for (const p of m.piezas) {
  if (ids.has(p.id)) falla(`${p.id}: repetida`);
  ids.add(p.id);
  if (!p.nombre) falla(`${p.id}: sin nombre`);
  if (!p.zona) falla(`${p.id}: sin zona`);
  if (p.pos % 4 || p.nor % 4 || p.idx % 4) falla(`${p.id}: offset desalineado`);
  if (p.idx + p.i * (p.idx32 ? 4 : 2) > bin.length) {
    falla(`${p.id}: se sale del archivo`);
    continue;
  }
  const idx = p.idx32 ? new Uint32Array(buf, p.idx, p.i) : new Uint16Array(buf, p.idx, p.i);
  if (p.i % 3) falla(`${p.id}: ${p.i} índices no es múltiplo de 3`);
  for (const i of idx) if (i >= p.v) { falla(`${p.id}: índice ${i} ≥ ${p.v} vértices`); break; }

  const o = original.get(p.id);
  if (!o) { falla(`${p.id}: no está en el atlas`); continue; }
  if (o.vertexCount !== p.v || o.indexCount !== p.i) falla(`${p.id}: cuentas distintas al original`);
  const q = new Uint16Array(buf, p.pos, p.v * 3);
  const c = chunks[o.chunk];
  const pos = new Float32Array(c.buffer, c.byteOffset + o.positions, o.vertexCount * 3);
  // Los vasos sacados del hueso se movieron a propósito: sus posiciones no se comparan.
  if (!DESPEGAR[p.id]) {
    for (let i = 0; i < pos.length; i++) {
      const d = Math.abs(m.min[i % 3] + q[i] * m.paso[i % 3] - pos[i]);
      peor = Math.max(peor, d);
    }
  }
  const oi = new Uint32Array(c.buffer, c.byteOffset + o.indices, o.indexCount);
  for (let i = 0; i < oi.length; i++) if (oi[i] !== idx[i]) { falla(`${p.id}: índices distintos al original`); break; }
}
if (peor > tolerancia) falla(`posición: error ${(peor * 1000).toFixed(4)} mm > medio paso`);

if (errores.length) {
  console.error(`✗ ${REGION}/${VERSION}: ${errores.length} problemas`);
  for (const e of errores.slice(0, 30)) console.error('  ' + e);
  process.exit(1);
}
console.log(`✓ ${REGION}/${VERSION}: ${m.piezas.length} piezas en orden · error de posición máx. ${(peor * 1000).toFixed(4)} mm`);
