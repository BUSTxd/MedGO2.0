// Saca una región del atlas de human-atlas (BodyParts3D 4.0, CC BY 4.0) y la
// empaqueta para el visor `laboratorio/atlas-3d`.
//
//   node scripts/atlas-3d/extraer-region.mjs --region miembro-superior-derecho \
//        [--atlas C:/Users/BUST/OneDrive/Desktop/human-atlas]
//
// Deja en scripts/atlas-3d/salida/<region>/:
//   manifiesto.json   piezas (nombre en español, sistema, zona, lado, offsets)
//   geometria.bin.gz  posiciones Uint16 cuantizadas a la caja de la región,
//                     normales Int16 normalizadas, índices Uint16 (Uint32 si la
//                     pieza pasa de 65 536 vértices), todo alineado a 4 bytes.
//
// Las coordenadas se conservan (metros, +Y arriba, +X = izquierda del cuerpo):
// el manifiesto guarda `min` y `paso` para deshacer la cuantización, así que
// dos regiones cualesquiera encajan en el visor sin ajustes. Error máximo de
// la cuantización: medio paso (~0,006 mm en esta región).

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { REGIONES, CORRECCIONES, DESPEGAR } from './regiones.mjs';
import { despegar } from './despegar.mjs';
import { NOMBRES } from './traducciones.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const arg = (n, def) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 ? process.argv[i + 1] : def;
};
const REGION = arg('region');
const ATLAS = arg('atlas', 'C:/Users/BUST/OneDrive/Desktop/human-atlas');

const def = REGIONES[REGION];
if (!def) throw new Error(`Región desconocida: ${REGION}. Hay: ${Object.keys(REGIONES).join(', ')}`);

const SISTEMA = {
  skeletal: 'hueso',
  muscular: 'musculo',
  arterial: 'arteria',
  venous: 'vena',
  nervous: 'nervio',
  connective: 'conectivo',
};

const modelos = path.join(ATLAS, 'public', 'models');
const atlas = JSON.parse(fs.readFileSync(path.join(modelos, 'atlas.json'), 'utf8'));
const chunks = atlas.chunks.map((c) => fs.readFileSync(path.join(modelos, path.basename(c.url))));

const piezas = atlas.parts.filter((p) => def.incluir(p));
if (!piezas.length) throw new Error('La región no tiene piezas.');

// ─── Nombres, sistema, lado ──────────────────────────────────────────────────
const faltan = [];
const meta = piezas.map((p) => {
  const c = CORRECCIONES[p.id] ?? {};
  const nombreEn = c.nombreEn ?? p.name;
  const sistemaEn = c.sistema ?? p.system;
  const sistema = SISTEMA[sistemaEn];
  if (!sistema) throw new Error(`${p.id} (${nombreEn}): sistema «${sistemaEn}» sin equivalente.`);
  const nombre = NOMBRES[nombreEn];
  if (!nombre) faltan.push(nombreEn);
  const x = (p.bounds[0][0] + p.bounds[1][0]) / 2;
  const lado = /\bright\b/i.test(nombreEn) ? 'derecho' : /\bleft\b/i.test(nombreEn) ? 'izquierdo' : def.lado ?? (x < 0 ? 'derecho' : 'izquierdo');
  return { id: p.id, nombre, nombreEn, sistema, zona: def.zona(p), lado };
});
if (faltan.length) {
  throw new Error(`Sin traducción en traducciones.mjs:\n  ${[...new Set(faltan)].join('\n  ')}`);
}

// ─── Geometría (con los vasos sacados de dentro del hueso) ──────────────────
const vistaDe = (p) => {
  const b = chunks[p.chunk];
  return {
    pos: new Float32Array(b.buffer, b.byteOffset + p.positions, p.vertexCount * 3),
    nor: new Int16Array(b.buffer, b.byteOffset + p.normals, p.vertexCount * 3),
    idx: new Uint32Array(b.buffer, b.byteOffset + p.indices, p.indexCount),
  };
};
const porId = new Map(atlas.parts.map((p) => [p.id, p]));
const posiciones = new Map();
for (const p of piezas) {
  const hueso = DESPEGAR[p.id];
  if (!hueso) continue;
  let pos = vistaDe(p).pos;
  let antes = null, despues = 1;
  // Suavizar reparte el empujón y puede dejar algún vértice rozando: se repite.
  for (let ronda = 0; ronda < 4 && despues > 0.01; ronda++) {
    const r = despegar({ pos }, vistaDe(porId.get(hueso)));
    antes ??= r.antes;
    ({ pos, despues } = r);
  }
  posiciones.set(p.id, pos);
  console.log(`  ${p.id} ${p.name}: ${(antes * 100).toFixed(0)} % dentro de ${hueso} → ${(despues * 100).toFixed(1)} %`);
}
const cajaDe = (p) => {
  const pos = posiciones.get(p.id);
  if (!pos) return p.bounds;
  const a = [Infinity, Infinity, Infinity], b = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < pos.length; i++) {
    a[i % 3] = Math.min(a[i % 3], pos[i]);
    b[i % 3] = Math.max(b[i % 3], pos[i]);
  }
  return [a, b];
};

// ─── Caja de la región y cuantización ───────────────────────────────────────
const min = [Infinity, Infinity, Infinity];
const max = [-Infinity, -Infinity, -Infinity];
for (const p of piezas) {
  const caja = cajaDe(p);
  for (let a = 0; a < 3; a++) {
    min[a] = Math.min(min[a], caja[0][a]);
    max[a] = Math.max(max[a], caja[1][a]);
  }
}
const paso = min.map((m, a) => (max[a] - m) / 65535);

// ─── Empaquetado ─────────────────────────────────────────────────────────────
const segmentos = [];
let bytes = 0;
const anexar = (vista) => {
  const relleno = (4 - (bytes % 4)) % 4;
  if (relleno) {
    segmentos.push(Buffer.alloc(relleno));
    bytes += relleno;
  }
  const inicio = bytes;
  const b = Buffer.from(vista.buffer, vista.byteOffset, vista.byteLength);
  segmentos.push(b);
  bytes += b.length;
  return inicio;
};

let triangulos = 0;
let errorMax = 0;
const salida = piezas.map((p, n) => {
  const { nor, idx, pos: original } = vistaDe(p);
  const pos = posiciones.get(p.id) ?? original;

  const q = new Uint16Array(pos.length);
  for (let i = 0; i < pos.length; i++) {
    const a = i % 3;
    const v = Math.round((pos[i] - min[a]) / paso[a]);
    q[i] = Math.min(65535, Math.max(0, v));
    errorMax = Math.max(errorMax, Math.abs(min[a] + q[i] * paso[a] - pos[i]));
  }
  const idx32 = p.vertexCount > 65536;
  const indices = idx32 ? Uint32Array.from(idx) : Uint16Array.from(idx);
  triangulos += p.indexCount / 3;

  return {
    ...meta[n],
    v: p.vertexCount,
    i: p.indexCount,
    pos: anexar(q),
    nor: anexar(Int16Array.from(nor)),
    idx: anexar(indices),
    ...(idx32 ? { idx32: true } : {}),
    caja: cajaDe(p).map((v) => v.map((x) => Math.round(x * 1e5) / 1e5)),
  };
});

const crudo = Buffer.concat(segmentos);
const gz = zlib.gzipSync(crudo, { level: 9 });

const manifiesto = {
  formato: 1,
  region: REGION,
  nombre: def.nombre,
  fuente: {
    modelo: 'BodyParts3D 4.0',
    autor: 'The Database Center for Life Science (DBCLS)',
    licencia: 'CC BY 4.0',
    url: 'https://dbarchive.biosciencedbc.jp/en/bodyparts3d/',
    adaptacion: 'Simplificado (meshoptimizer, 0,2 %), extraído por región y traducido al español.',
  },
  unidades: 'm',
  // Sin redondear: con `min` a la micra, la v1 quedó 0,001 mm corrida.
  min,
  paso,
  bytes: crudo.length,
  gzipBytes: gz.length,
  triangulos,
  piezas: salida,
};

const dir = path.join(AQUI, 'salida', REGION);
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'manifiesto.json'), JSON.stringify(manifiesto));
fs.writeFileSync(path.join(dir, 'geometria.bin.gz'), gz);

const cuenta = {};
for (const p of salida) cuenta[p.sistema] = (cuenta[p.sistema] ?? 0) + 1;
const zonas = {};
for (const p of salida) zonas[p.zona] = (zonas[p.zona] ?? 0) + 1;
console.log(`✓ ${REGION}: ${salida.length} piezas · ${Math.round(triangulos / 1000)}k triángulos`);
console.log(`  geometría ${(crudo.length / 1e6).toFixed(2)} MB → ${(gz.length / 1e6).toFixed(2)} MB gzip · manifiesto ${(fs.statSync(path.join(dir, 'manifiesto.json')).size / 1e3).toFixed(1)} kB`);
console.log(`  error de cuantización máx. ${(errorMax * 1000).toFixed(4)} mm`);
console.log('  sistemas', cuenta);
console.log('  zonas', zonas);
