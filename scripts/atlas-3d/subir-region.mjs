// Sube una región ya extraída al bucket público `laboratorio-img`:
//
//   node scripts/atlas-3d/subir-region.mjs --region miembro-superior-derecho --version v1
//
// Ruta: laboratorio-img/atlas-3d/<region>/<version>/{manifiesto.json, geometria.bin.gz}
// Se cachea un año (`immutable` de hecho): para cambiar la geometría se sube
// una versión nueva y se cambia `version` en src/lib/data/atlas-3d/regiones.ts,
// nunca se pisa la misma.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { config } from '../load-env.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const arg = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const REGION = arg('region');
const VERSION = arg('version');
if (!REGION || !/^v\d+$/.test(VERSION ?? '')) throw new Error('Uso: --region <id> --version v<N>');

const BUCKET = 'laboratorio-img';
const PREFIX = `atlas-3d/${REGION}/${VERSION}`;
const dir = path.join(AQUI, 'salida', REGION);

const supabase = createClient(config.NEXT_PUBLIC_SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// Una versión publicada no se pisa: el navegador la guarda un año.
const { data: existentes } = await supabase.storage.from(BUCKET).list(PREFIX);
if (existentes?.length) throw new Error(`${PREFIX} ya existe. Sube una versión nueva.`);

const ARCHIVOS = [
  ['manifiesto.json', 'application/json'],
  // Sin Content-Encoding: el visor lo descomprime con DecompressionStream.
  ['geometria.bin.gz', 'application/gzip'],
];

for (const [nombre, tipo] of ARCHIVOS) {
  const cuerpo = fs.readFileSync(path.join(dir, nombre));
  for (let intento = 1; ; intento++) {
    try {
      const { error } = await supabase.storage.from(BUCKET).upload(`${PREFIX}/${nombre}`, cuerpo, {
        contentType: tipo,
        cacheControl: '31536000',
        upsert: false,
      });
      if (error) throw new Error(error.message);
      break;
    } catch (e) {
      if (intento >= 4) throw new Error(`${nombre}: ${e.message}`);
      await new Promise((r) => setTimeout(r, 800 * intento));
    }
  }
  console.log(`↑ ${BUCKET}/${PREFIX}/${nombre} (${(cuerpo.length / 1e3).toFixed(0)} kB)`);
}

const { data } = supabase.storage.from(BUCKET).getPublicUrl(PREFIX);
console.log(`✓ ${data.publicUrl}`);
