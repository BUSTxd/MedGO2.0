// Comprueba un paquete publicado contra la extracción local, leyendo lo que
// sirve el bucket con la misma decodificación que src/lib/atlas-3d/cargar.ts.
// Sirve para cualquier fuente (extraer-o3d.mjs); verificar.mjs además compara
// contra el atlas original de BodyParts3D.
//
//   node scripts/atlas-3d/verificar-paquete.mjs --region miembro-superior-derecho --version v5
//
// Caza: subida distinta de lo extraído, archivo incompleto, offsets
// desalineados, índices fuera de rango, piezas sin nombre/zona/sistema, ids repetidos.

import crypto from 'node:crypto';
import dns from 'node:dns';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { config } from '../load-env.mjs';

// En esta máquina el fetch de Node por IPv6 al CDN de Supabase se corta (ECONNRESET).
dns.setDefaultResultOrder('ipv4first');

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const arg = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const REGION = arg('region');
const VERSION = arg('version');
if (!REGION || !VERSION) throw new Error('Uso: --region <id> --version v<N>');

const base = `${config.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/laboratorio-img/atlas-3d/${REGION}/${VERSION}`;
const bajar = async (n) => Buffer.from(await (await fetch(`${base}/${n}`)).arrayBuffer());
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');

const errores = [];
const falla = (t) => errores.push(t);

const local = path.join(AQUI, 'salida', REGION);
for (const n of ['manifiesto.json', 'geometria.bin.gz']) {
  const remoto = await bajar(n);
  if (sha(remoto) !== sha(fs.readFileSync(path.join(local, n)))) falla(`${n}: lo publicado no es lo extraído`);
}

const m = JSON.parse((await bajar('manifiesto.json')).toString('utf8'));
const gz = await bajar('geometria.bin.gz');
const bin = gz[0] === 0x1f && gz[1] === 0x8b ? zlib.gunzipSync(gz) : gz;
if (m.formato !== 1) falla(`formato ${m.formato}`);
if (bin.length !== m.bytes) falla(`geometría: ${bin.length} bytes, el manifiesto dice ${m.bytes}`);
const buf = bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength);

const SISTEMAS = new Set(['hueso', 'musculo', 'arteria', 'vena', 'nervio', 'conectivo']);
const ids = new Set();
let triangulos = 0;
for (const p of m.piezas) {
  if (ids.has(p.id)) falla(`${p.id}: repetida`);
  ids.add(p.id);
  if (!p.nombre) falla(`${p.id}: sin nombre`);
  if (!p.zona) falla(`${p.id}: sin zona`);
  if (!SISTEMAS.has(p.sistema)) falla(`${p.id}: sistema «${p.sistema}»`);
  if (p.pos % 4 || p.nor % 4 || p.idx % 4) falla(`${p.id}: offset desalineado`);
  if (p.idx + p.i * (p.idx32 ? 4 : 2) > bin.length) { falla(`${p.id}: se sale del archivo`); continue; }
  if (p.i % 3) falla(`${p.id}: ${p.i} índices no es múltiplo de 3`);
  const idx = p.idx32 ? new Uint32Array(buf, p.idx, p.i) : new Uint16Array(buf, p.idx, p.i);
  for (const i of idx) if (i >= p.v) { falla(`${p.id}: índice ${i} ≥ ${p.v} vértices`); break; }
  triangulos += p.i / 3;
}
if (triangulos !== m.triangulos) falla(`triángulos: ${triangulos} contados, el manifiesto dice ${m.triangulos}`);

if (errores.length) {
  console.error(`✗ ${REGION}/${VERSION}: ${errores.length} problemas`);
  for (const e of errores.slice(0, 30)) console.error('  ' + e);
  process.exit(1);
}
console.log(`✓ ${REGION}/${VERSION}: ${m.piezas.length} piezas · ${Math.round(triangulos / 1000)}k triángulos · idéntico a lo extraído`);
