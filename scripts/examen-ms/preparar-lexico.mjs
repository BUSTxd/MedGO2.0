/**
 * Fase 3 (paso 1): reparte las estructuras del catálogo en lotes para que los
 * generadores escriban el léxico (formas aceptadas de cada nombre).
 *
 *   node scripts/examen-ms/preparar-lexico.mjs
 *
 * Escribe docs/examen-ms/lexico/entrada-<lote>.json (gitignored).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const DOCS = path.join(AQUI, '..', '..', 'docs', 'examen-ms');
const { estructuras } = JSON.parse(fs.readFileSync(path.join(DOCS, 'catalogo_estructuras.json'), 'utf8'));

const LOTES = {
  huesos: ['hueso', 'accidente'],
  musculos: ['musculo'],
  'nervios-vasos': ['nervio', 'arteria', 'vena'],
};
const dir = path.join(DOCS, 'lexico');
fs.mkdirSync(dir, { recursive: true });
for (const [lote, cats] of Object.entries(LOTES)) {
  const l = estructuras.filter((e) => cats.includes(e.categoria) && !e.fueraDeMS).map((e) => ({
    nombre: e.nombre,
    categoria: e.categoria,
    ...(e.huesoPadre ? { huesoPadre: e.huesoPadre } : {}),
    sinonimosDelResumen: e.sinonimos,
    ...(e.modelo?.nombresModelo ? { nombreEnElModelo3D: e.modelo.nombresModelo } : {}),
    ...(e.grupo ? { grupo: true } : {}),
  }));
  fs.writeFileSync(path.join(dir, `entrada-${lote}.json`), JSON.stringify(l, null, 2));
  console.log(`${lote}: ${l.length} estructuras`);
}
