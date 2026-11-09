/**
 * Sube las fotos de histología del laboratorio de Vasculitis (AVIF ya recortados, `<nombre>_vN.avif`)
 * al bucket público `laboratorio-img/vasculitis/fotos/`.
 *
 *   node scripts/vasculitis/subir-fotos.mjs --dir <carpeta con los .avif>
 *
 * Caché de un año: una foto cambiada es una versión nueva (nunca se pisa una).
 * Autor, licencia y fuente de cada foto van en `src/lib/data/vasculitis/fotos.ts`.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { config } from '../load-env.mjs';

const i = process.argv.indexOf('--dir');
const dir = i === -1 ? null : process.argv[i + 1];
if (!dir) { console.error('Uso: --dir <carpeta>'); process.exit(1); }

const supabase = createClient(config.NEXT_PUBLIC_SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
for (const f of readdirSync(dir).filter((f) => /_v\d+\.avif$/.test(f))) {
  const ruta = `vasculitis/fotos/${f}`;
  const buf = readFileSync(join(dir, f));
  const { error } = await supabase.storage.from('laboratorio-img').upload(ruta, buf, { contentType: 'image/avif', upsert: false, cacheControl: '31536000' });
  if (error) { console.error(`${ruta}: ${error.message}`); process.exit(1); }
  console.log(`subido ${ruta} (${(buf.length / 1024).toFixed(0)} KB)`);
}
