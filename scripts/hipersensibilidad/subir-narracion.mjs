/**
 * Sube la narración de un capítulo del laboratorio «Hipersensibilidad» al
 * bucket público `laboratorio-img/hipersensibilidad/narracion-<parte>_<versión>.{webm,mp3}`.
 *
 *   node scripts/hipersensibilidad/subir-narracion.mjs --parte tipo-2 --version v1 --webm <archivo.webm> [--mp3 <archivo.mp3>]
 *
 * WebM con Opus (el que se usa) y MP3 de respaldo para el navegador que no lea
 * Opus. Se sirve con caché de un año: una grabación nueva es una versión nueva
 * (nunca se pisa una), y luego se cambia `narracion` en el capítulo.
 */

import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { config } from '../load-env.mjs';

const arg = (k) => { const i = process.argv.indexOf(`--${k}`); return i === -1 ? null : process.argv[i + 1]; };
const parte = arg('parte'), version = arg('version');
const archivos = [['webm', arg('webm'), 'audio/webm'], ['mp3', arg('mp3'), 'audio/mpeg']].filter(([, f]) => f);
if (!parte || !version || !archivos.length) {
  console.error('Uso: --parte <id> --version vN --webm <archivo> [--mp3 <archivo>]');
  process.exit(1);
}

const supabase = createClient(config.NEXT_PUBLIC_SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
for (const [ext, f, tipo] of archivos) {
  const ruta = `hipersensibilidad/narracion-${parte}_${version}.${ext}`;
  const buf = readFileSync(f);
  const { error } = await supabase.storage.from('laboratorio-img').upload(ruta, buf, { contentType: tipo, upsert: false, cacheControl: '31536000' });
  if (error) { console.error(`${ruta}: ${error.message}`); process.exit(1); }
  console.log(`subido ${ruta} (${(buf.length / 1024).toFixed(0)} KB)`);
}
