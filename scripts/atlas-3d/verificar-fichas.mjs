// Comprueba las fichas del atlas 3D contra el manifiesto extraído de cada región:
// que cada estructura tenga ficha, que su `tipo` sea el de su sistema, que no
// sobren fichas de piezas que no existen y que no falten campos obligatorios.
//
//   node scripts/atlas-3d/verificar-fichas.mjs [--region <id>]
//
// Lee scripts/atlas-3d/salida/<region>/manifiesto.json (lo que se publicó) y
// src/lib/data/atlas-3d/fichas/<region>.ts (Node ≥ 22.18 importa TypeScript).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(AQUI, '..', '..');
const i = process.argv.indexOf('--region');
const regiones = i > -1 ? [process.argv[i + 1]] : ['miembro-superior-derecho', 'miembro-inferior-derecho'];

const OBLIGATORIOS = {
  musculo: ['origen', 'insercion', 'inervacion', 'accion'],
  nervio: ['origen'],
  hueso: ['partes'],
  arteria: ['origen'],
  vena: ['origen', 'desemboca'],
  conectivo: ['funcion'],
};

let fallos = 0;
for (const region of regiones) {
  const man = JSON.parse(fs.readFileSync(path.join(AQUI, 'salida', region, 'manifiesto.json'), 'utf8'));
  const archivo = path.join(RAIZ, 'src', 'lib', 'data', 'atlas-3d', 'fichas', `${region}.ts`);
  if (!fs.existsSync(archivo)) { console.log(`✗ ${region}: falta ${path.relative(RAIZ, archivo)}`); fallos++; continue; }
  const { FICHAS } = await import(pathToFileURL(archivo).href);
  const piezas = new Map(man.piezas.map((p) => [p.nombreEn, p]));
  const problemas = [];
  for (const [en, p] of piezas) {
    const f = FICHAS[en];
    if (!f) { problemas.push(`sin ficha: ${en} (${p.sistema})`); continue; }
    if (f.tipo !== p.sistema) problemas.push(`tipo ${f.tipo} ≠ sistema ${p.sistema}: ${en}`);
    for (const c of OBLIGATORIOS[f.tipo] ?? []) {
      const v = f[c];
      if (!v || (Array.isArray(v) && !v.length)) problemas.push(`${en}: falta «${c}»`);
    }
  }
  for (const en of Object.keys(FICHAS)) if (!piezas.has(en)) problemas.push(`ficha de una pieza que no está en el manifiesto: ${en}`);
  const n = Object.keys(FICHAS).length;
  console.log(`${problemas.length ? '✗' : '✓'} ${region}: ${n} fichas para ${piezas.size} estructuras`);
  for (const p of problemas.slice(0, 80)) console.log(`   ${p}`);
  if (problemas.length > 80) console.log(`   … y ${problemas.length - 80} más`);
  fallos += problemas.length;
}
process.exit(fallos ? 1 : 0);
