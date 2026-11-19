/**
 * Sube las fotos del laboratorio «VIH y sífilis» (histología y clínica) al bucket público
 * `laboratorio-img/vih-sifilis/fotos/`.
 *
 *   node --experimental-strip-types --no-warnings scripts/vih-sifilis/subir-fotos.mjs --dir <carpeta con los .avif> [--ver]
 *
 * Los .avif son los que BUST optimiza a mano con medgo-imgflow a partir de `para-optimizar/`
 * (`scripts/vih-sifilis/preparar-fotos.mjs`) y se llaman `<id>_<versión>.avif`.
 * Antes de subir nada comprueba que cada archivo es una foto de `src/lib/data/vih-sifilis/fotos.ts` y que su
 * versión es la que ese archivo declara (si no, la lámina pediría una URL que no existe), y avisa de las
 * fotos que faltan. `--ver` solo lo comprueba, sin subir.
 *
 * Caché de un año: una foto cambiada es una versión nueva (`_v2`), nunca se pisa una (`upsert: false`).
 * Autor, licencia y fuente de cada foto van en `fotos.ts`.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { config } from '../load-env.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const { FOTOS } = await import(pathToFileURL(join(RAIZ, 'src/lib/data/vih-sifilis/fotos.ts')).href);

const i = process.argv.indexOf('--dir');
const dir = i === -1 ? null : process.argv[i + 1];
if (!dir) { console.error('Uso: --dir <carpeta con los .avif> [--ver]'); process.exit(1); }
const soloVer = process.argv.includes('--ver');

const archivos = readdirSync(dir).filter((f) => /\.avif$/i.test(f));
const problemas = [];
for (const f of archivos) {
  const m = f.match(/^([a-z0-9-]+)_(v\d+)\.avif$/);
  if (!m) { problemas.push(`${f}: el nombre debe ser <id>_<versión>.avif`); continue; }
  const [, id, version] = m;
  if (!FOTOS[id]) problemas.push(`${f}: «${id}» no es una foto de fotos.ts`);
  else if (FOTOS[id].version !== version) problemas.push(`${f}: fotos.ts declara ${FOTOS[id].version} para «${id}»`);
}
const presentes = new Set(archivos.map((f) => f.replace(/\.avif$/i, '')));
const faltan = Object.entries(FOTOS).filter(([id, f]) => !presentes.has(`${id}_${f.version}`)).map(([id, f]) => `${id}_${f.version}.avif`);
if (faltan.length) console.log(`Faltan ${faltan.length} foto(s) de fotos.ts en la carpeta:\n  ${faltan.join('\n  ')}`);
if (problemas.length) { console.error(`\n${problemas.length} problema(s):\n  ${problemas.join('\n  ')}`); process.exit(1); }
if (soloVer) { console.log(`\n${archivos.length} archivo(s) correctos (no se ha subido nada).`); process.exit(0); }

const supabase = createClient(config.NEXT_PUBLIC_SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
for (const f of archivos) {
  const ruta = `vih-sifilis/fotos/${f}`;
  const buf = readFileSync(join(dir, f));
  const { error } = await supabase.storage.from('laboratorio-img').upload(ruta, buf, { contentType: 'image/avif', upsert: false, cacheControl: '31536000' });
  if (error) { console.error(`${ruta}: ${error.message}`); process.exit(1); }
  console.log(`subido ${ruta} (${(buf.length / 1024).toFixed(0)} KB)`);
}
