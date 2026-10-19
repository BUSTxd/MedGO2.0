/**
 * Sube al bucket los recortes del laboratorio «Hipersensibilidad» ya
 * optimizados por BUST en AVIF, y regenera la tabla de medidas.
 *
 *   node scripts/hipersensibilidad/subir-imagenes.mjs --dir <carpeta con <id>.avif>
 *
 * Paso final después de `recortar-robbins.mjs` (que deja los PNG en
 * ~/Downloads/hipersensibilidad-img) y de que BUST los pase a AVIF con el mismo
 * nombre. Los AVIF se suben TAL CUAL (no se recomprimen) al bucket público
 * `laboratorio-img` bajo `hipersensibilidad/<id>.avif`, con caché de un año:
 * cambiar un recorte obliga a subirlo con otro nombre. Regenera
 * `src/lib/data/hipersensibilidad/imagenes.ts` con las medidas reales de cada
 * AVIF (conservando la descripción de cada recorte) y BASE apuntando al bucket.
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
const PREFIX = 'hipersensibilidad';
const TABLA = path.join(RAIZ, 'src', 'lib', 'data', 'hipersensibilidad', 'imagenes.ts');

// Descripción de cada recorte (el comentario de la tabla actual).
const DESC = Object.fromEntries([...readFileSync(TABLA, 'utf8').matchAll(/^\s+([a-z_0-9]+): \{[^}]*\}, \/\/ (.*)$/gm)].map((m) => [m[1], m[2]]));

const archivos = readdirSync(DIR).filter((f) => f.toLowerCase().endsWith('.avif')).sort();
if (!archivos.length) { console.error(`No hay .avif en ${DIR}`); process.exit(1); }
const faltan = Object.keys(DESC).filter((id) => !archivos.includes(`${id}.avif`));
if (faltan.length) console.log(`Aviso: faltan en AVIF ${faltan.join(', ')} (se dejarían de ver).`);

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
  console.log(`  ✓ ${id.padEnd(22)} ${width}×${height}  ${(buf.length / 1024).toFixed(1)} KB`);
}

const filas = Object.entries(medidas).map(([id, m]) => `  ${id}: { w: ${m.w}, h: ${m.h} },${DESC[id] ? ` // ${DESC[id]}` : ''}`).join('\n');
writeFileSync(TABLA, `// GENERADO por scripts/hipersensibilidad/subir-imagenes.mjs — no editar a mano.
// Recortes de las figuras 6-13 a 6-20 de Robbins (Patología humana, cap. 6),
// optimizados a AVIF por BUST y servidos desde el bucket público
// \`laboratorio-img/hipersensibilidad/\` (caché de un año: un recorte nuevo va
// con otro nombre). Medidas en px.

export const BASE = \`\${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/laboratorio-img/hipersensibilidad\`;
export const EXT = 'avif';

export const IMAGENES: Record<string, { w: number; h: number }> = {
${filas}
};

export const srcPropia = (id: string) => (IMAGENES[id] ? \`\${BASE}/\${id}.\${EXT}\` : null);
`);
console.log(`\n${archivos.length} AVIF en ${BUCKET}/${PREFIX}/ · imagenes.ts regenerado.`);
