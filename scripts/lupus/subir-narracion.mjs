/**
 * Sube la narración del laboratorio «Lupus» (lo que deja `preparar-narracion.mjs`)
 * al bucket público `laboratorio-img/lupus/narracion-<cap>_<versión>.{webm,mp3}` y
 * regenera `src/lib/data/lupus/narracion.ts` (marcas, duración y peso por capítulo).
 *
 *   node scripts/lupus/subir-narracion.mjs --dir <salida de preparar-narracion> --version v1 [--caps 3,4]
 *
 * Caché de un año: una grabación nueva es una versión nueva (nunca se pisa una).
 * Con `--caps` solo sube esos capítulos; los demás conservan la versión que ya
 * tenían en `narracion.ts`.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { config } from '../load-env.mjs';

const arg = (k) => { const i = process.argv.indexOf(`--${k}`); return i === -1 ? null : process.argv[i + 1]; };
const dir = arg('dir'), version = arg('version');
if (!dir || !version) { console.error('Uso: --dir <carpeta> --version vN [--caps 0,1]'); process.exit(1); }
const datos = JSON.parse(readFileSync(join(dir, 'narracion.json'), 'utf8'));
const caps = arg('caps') ? arg('caps').split(',').map(Number) : datos.map((d) => d.cap);

const SALIDA = 'src/lib/data/lupus/narracion.ts';
// Versión de cada capítulo ya publicada (para no perderla al subir solo algunos).
const previas = {};
if (existsSync(SALIDA)) {
  for (const m of readFileSync(SALIDA, 'utf8').matchAll(/cap: (\d+), version: '(v\d+)'/g)) previas[m[1]] = m[2];
}

const supabase = createClient(config.NEXT_PUBLIC_SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
for (const cap of caps) {
  for (const [ext, tipo] of [['webm', 'audio/webm'], ['mp3', 'audio/mpeg']]) {
    const ruta = `lupus/narracion-${cap}_${version}.${ext}`;
    const buf = readFileSync(join(dir, `lupus-${cap}.${ext}`));
    const { error } = await supabase.storage.from('laboratorio-img').upload(ruta, buf, { contentType: tipo, upsert: false, cacheControl: '31536000' });
    if (error) { console.error(`${ruta}: ${error.message}`); process.exit(1); }
    console.log(`subido ${ruta} (${(buf.length / 1024).toFixed(0)} KB)`);
  }
  previas[cap] = version;
}

const filas = datos.map((d) => `  { cap: ${d.cap}, version: '${previas[d.cap] ?? version}', duracion: ${d.duracion}, kb: { webm: ${d.webmKB}, mp3: ${d.mp3KB} }, marcas: [${d.marcas.join(', ')}] },`);
writeFileSync(SALIDA, `// GENERADO por scripts/lupus/subir-narracion.mjs — no editar a mano.
// Voz de Cristian Cornejo (ElevenLabs v4): un audio por capítulo, unido de los
// bloques A/B. \`marcas\` = segundo en que empieza la frase de cada paso (de las
// pausas del audio); \`duracion\` = largo del audio (s). Cada paso dura lo que su
// frase: marcas[i + 1] − marcas[i], y el último hasta \`duracion\`.

import type { Narracion } from './tipos';

const BASE = \`\${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/laboratorio-img/lupus/narracion-\`;

const CAPITULOS = [
${filas.join('\n')}
] as const;

export const NARRACION: Narracion[] = CAPITULOS.map((c) => ({
  webm: \`\${BASE}\${c.cap}_\${c.version}.webm\`,
  mp3: \`\${BASE}\${c.cap}_\${c.version}.mp3\`,
  marcas: [...c.marcas],
  duracion: c.duracion,
  kb: c.kb,
}));
`);
console.log(`escrito ${SALIDA}`);
