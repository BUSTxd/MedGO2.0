// Abdomen 3D, paso 2: arma las piezas de la región a partir de la caché de Z-Anatomy.
//
//   node scripts/atlas-3d/abdomen/construir.mjs
//
// Lee scripts/atlas-3d/salida/abdomen/fuente.json (fuente.mjs) y deja piezas.json
// (a resolución completa, para vista.mjs y empaquetar.mjs). Aquí se parte lo que la
// fuente trae junto (yeyuno e íleon, porciones del duodeno, partes del páncreas,
// lóbulo cuadrado) y se modela lo que no trae (ver operaciones.mjs).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PIEZAS } from './piezas.mjs';
import { OPERACIONES } from './operaciones.mjs';
import { caja, nTri } from './geometria.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(AQUI, '../salida/abdomen');
const fuente = JSON.parse(fs.readFileSync(path.join(DIR, 'fuente.json'), 'utf8'));

const hechas = new Map();
const ctx = {
  fuente: (n) => { const m = fuente[n]; if (!m) throw new Error(`No está en la fuente: ${n}`); return m; },
  /** Operaciones que dan varias piezas a la vez se calculan una vez. */
  una: (clave, fn) => { if (!hechas.has(clave)) hechas.set(clave, fn()); return hechas.get(clave); },
};

const salida = [];
for (const p of PIEZAS) {
  let m;
  if (p.de.startsWith('op:')) {
    const op = OPERACIONES[p.de.slice(3)];
    if (!op) throw new Error(`Operación sin definir: ${p.de}`);
    m = op(ctx);
  } else m = ctx.fuente(p.de);
  if (!m || !m.f.length) throw new Error(`Pieza vacía: ${p.en}`);
  salida.push({ ...p, v: m.v, f: m.f });
}

fs.writeFileSync(path.join(DIR, 'piezas.json'), JSON.stringify(salida));
const tri = salida.reduce((n, p) => n + nTri(p), 0);
console.log(`✓ ${salida.length} piezas · ${Math.round(tri / 1000)}k triángulos → piezas.json`);
if (process.argv.includes('--cajas')) for (const p of salida) { const c = caja(p); console.log(p.en.padEnd(48), c.min.map((x) => x.toFixed(3)).join(','), '|', c.max.map((x) => x.toFixed(3)).join(',')); }
