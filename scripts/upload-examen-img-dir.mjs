/**
 * Sube una CARPETA de imágenes de examen al bucket público `examenes-img`.
 *
 *   node scripts/upload-examen-img-dir.mjs --dir <carpeta> --prefix <ruta/en/bucket> [--dry]
 *
 * Se separa de `upload-examen-img.mjs` (que lleva su lista histórica escrita a
 * mano) porque un banqueo entero llega como una carpeta ya recortada: enumerar
 * a mano diez o cuarenta archivos sólo invita a que uno se quede fuera.
 *
 * Un .avif o .webp de origen se sube TAL CUAL — recomprimirlo sería una segunda
 * pérdida sobre un formato lossy; los .png/.jpg sí pasan por sharp a WEBP q82.
 * Imprime al final el mapa `archivo → { url, w, h }` en JSON, que es lo que se
 * pega en el examen (las medidas evitan el layout shift al cambiar de pregunta).
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { extname, join, basename } from 'path';
import sharp from 'sharp';
import { config } from './load-env.mjs';

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? null : args[i + 1];
};

const DIR = flag('--dir');
const PREFIX = (flag('--prefix') ?? '').replace(/^\/|\/$/g, '');
const DRY = args.includes('--dry');

if (!DIR || !PREFIX) {
  console.error('Uso: node scripts/upload-examen-img-dir.mjs --dir <carpeta> --prefix <ruta/en/bucket> [--dry]');
  process.exit(1);
}

const URL_ = config.NEXT_PUBLIC_SUPABASE_URL;
const KEY = config.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_ || !KEY) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

const supabase = createClient(URL_, KEY, { auth: { persistSession: false } });
const BUCKET = 'examenes-img';

const MIME = { '.avif': 'image/avif', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
const SIN_RECOMPRIMIR = new Set(['.avif', '.webp']);

const archivos = readdirSync(DIR)
  .filter((f) => MIME[extname(f).toLowerCase()])
  .sort();

if (archivos.length === 0) {
  console.error(`No hay imágenes en ${DIR}`);
  process.exit(1);
}

const mapa = {};

for (const nombre of archivos) {
  const local = join(DIR, nombre);
  const ext = extname(nombre).toLowerCase();
  const src = readFileSync(local);

  const recomprime = !SIN_RECOMPRIMIR.has(ext);
  const buf = recomprime ? await sharp(src).webp({ quality: 82 }).toBuffer() : src;
  const extFinal = recomprime ? '.webp' : ext;
  const remoto = `${PREFIX}/${basename(nombre, ext)}${extFinal}`;

  const meta = await sharp(buf).metadata();

  if (!DRY) {
    const { error } = await supabase.storage.from(BUCKET).upload(remoto, buf, {
      contentType: MIME[extFinal],
      upsert: true,
      cacheControl: '31536000',
    });
    if (error) {
      console.error(`x ${remoto}: ${error.message}`);
      continue;
    }
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(remoto);
  mapa[basename(nombre, ext)] = { url: data.publicUrl, w: meta.width, h: meta.height };
  console.log(
    `${DRY ? '·' : '.'} ${remoto}  ${meta.width}x${meta.height}  ${(buf.length / 1024).toFixed(0)} KB` +
      (recomprime ? '  (convertido a webp)' : '  (tal cual)'),
  );
}

console.log('\n--- mapa para el JSON del examen ---');
console.log(JSON.stringify(mapa, null, 2));
