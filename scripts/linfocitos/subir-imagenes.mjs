/**
 * Sube al bucket las ilustraciones del laboratorio «Maduración de linfocitos»
 * ya optimizadas por BUST en AVIF, y regenera la tabla de medidas.
 *
 *   node scripts/linfocitos/subir-imagenes.mjs --dir <carpeta con <id>.avif>
 *
 * Paso final después de `preparar-imagenes.mjs` (que recorta los PNG de
 * Servier) y de que BUST los pase a AVIF con el mismo nombre. Los AVIF se suben
 * TAL CUAL (no se recomprimen) al bucket público `laboratorio-img` bajo
 * `linfocitos/<id>.avif`, con caché de un año: cambiar un dibujo obliga a
 * subir otro nombre. Regenera `src/lib/data/linfocitos/imagenes.ts` con las
 * medidas reales de cada AVIF y BASE apuntando al bucket.
 */

import sharp from 'sharp';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { config } from '../load-env.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const i = process.argv.indexOf('--dir');
if (i === -1) { console.error('Falta --dir <carpeta>'); process.exit(1); }
const DIR = process.argv[i + 1];
const BUCKET = 'laboratorio-img';
const PREFIX = 'linfocitos';

// id → fuente (Wikimedia Commons, serie «Smart-Servier»), para el comentario.
const FUENTE = {
  hsc: 'Cardiovascular system - Lymphopoiesis - Hematopoietic stem cell',
  pluripotente: 'Cardiovascular system - Lymphopoiesis - Pluripotent stem cell',
  progenitor_linfoide: 'Cardiovascular system - Lymphopoiesis - Lymphoid stem cell',
  nk: 'Cardiovascular system - Lymphopoiesis - NK cell',
  mieloide: 'Cardiovascular system - Myelopoiesis - Myeloid stem cell',
  timo: 'Glands - Thymus',
  ganglio: 'Lymphatic system - Lymph node 2',
  anticuerpo_2: 'Immunology and haematology - Antibody 3',
  linfocito_1: 'Cardiovascular system - Lymphocyte 1',
  linfocito_2: 'Cardiovascular system - Lymphocyte 2',
};

const archivos = readdirSync(DIR).filter((f) => f.toLowerCase().endsWith('.avif')).sort();
if (!archivos.length) { console.error(`No hay .avif en ${DIR}`); process.exit(1); }

const supabase = createClient(config.NEXT_PUBLIC_SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const medidas = {};
for (const f of archivos) {
  const id = path.basename(f, path.extname(f));
  const buf = readFileSync(path.join(DIR, f));
  const { width, height } = await sharp(buf).metadata();
  for (let intento = 1; ; intento++) {
    try {
      const { error } = await supabase.storage.from(BUCKET).upload(`${PREFIX}/${id}.avif`, buf, {
        contentType: 'image/avif', upsert: true, cacheControl: '31536000',
      });
      if (error) throw new Error(error.message);
      break;
    } catch (e) {
      if (intento >= 4) throw new Error(`${id}: ${e.message}`);
      await new Promise((r) => setTimeout(r, 800 * intento));
    }
  }
  medidas[id] = { w: width, h: height };
  console.log(`  ✓ ${id.padEnd(20)} ${width}×${height}  ${(buf.length / 1024).toFixed(1)} KB`);
}

const filas = Object.entries(medidas)
  .map(([id, m]) => `  ${id}: { w: ${m.w}, h: ${m.h} },${FUENTE[id] ? ` // ${FUENTE[id]} -- Smart-Servier` : ''}`)
  .join('\n');
writeFileSync(path.join(RAIZ, 'src', 'lib', 'data', 'linfocitos', 'imagenes.ts'), `// GENERADO por scripts/linfocitos/subir-imagenes.mjs — no editar a mano.
// Ilustraciones de Servier Medical Art (smart.servier.com), CC BY-SA 3.0, vía
// Wikimedia Commons: recortadas con preparar-imagenes.mjs, optimizadas a AVIF
// por BUST y servidas desde el bucket público \`laboratorio-img/linfocitos/\`
// (caché de un año: un dibujo nuevo va con otro nombre). Medidas en px.

export const BASE = \`\${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/laboratorio-img/linfocitos\`;
export const EXT = 'avif';

export const IMAGENES: Record<string, { w: number; h: number }> = {
${filas}
};

export const srcImagen = (id: string) => (IMAGENES[id] ? \`\${BASE}/\${id}.\${EXT}\` : null);
`);
console.log(`\n${archivos.length} AVIF en ${BUCKET}/${PREFIX}/ · imagenes.ts regenerado.`);
