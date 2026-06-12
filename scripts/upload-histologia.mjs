/**
 * Sube las imágenes de histología al bucket "histologia" de Supabase.
 * Run: node scripts/upload-histologia.mjs
 *
 * Estructura esperada de la carpeta fuente:
 *   SRC_DIR/{curso}/{clase}/*.jpg
 *   ej.  .../cardiovascular/miocardio/glomerulo-he-40x.jpg
 * Se sube a:  histologia/{curso}/{clase}/{nombre-original}
 *
 * El nombre de archivo alimenta las facetas del atlas filtrable: la tinción
 * (he, masson, pas, plata, gram, giemsa…) y el aumento (4x, 10x, 40x) se
 * detectan como tokens; el resto es el título. Son opcionales.
 *
 * SRC_DIR puede sobreescribirse via env:
 *   SRC_DIR="C:\\ruta\\a\\histologia" node scripts/upload-histologia.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, extname } from 'path';
import { config } from './load-env.mjs';

const SRC_DIR = process.env.SRC_DIR || 'C:\\Users\\BUST\\Downloads\\histologia';

const URL_ = config.NEXT_PUBLIC_SUPABASE_URL;
const KEY  = config.SUPABASE_SERVICE_ROLE_KEY;

if (!URL_ || !KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}
if (!existsSync(SRC_DIR)) {
  console.error(`Source dir not found: ${SRC_DIR}`);
  process.exit(1);
}

const supabase = createClient(URL_, KEY, { auth: { persistSession: false } });

const isImg = (f) => /\.(jpe?g|png|webp)$/i.test(f);
const isDir = (p) => { try { return statSync(p).isDirectory(); } catch { return false; } };

let ok = 0, fail = 0, total = 0;

for (const curso of readdirSync(SRC_DIR)) {
  const cursoPath = join(SRC_DIR, curso);
  if (!isDir(cursoPath)) continue;

  for (const clase of readdirSync(cursoPath)) {
    const clasePath = join(cursoPath, clase);
    if (!isDir(clasePath)) continue;

    const files = readdirSync(clasePath).filter(isImg).sort();
    total += files.length;

    for (let i = 0; i < files.length; i++) {
      const local = join(clasePath, files[i]);
      const ext = extname(files[i]).toLowerCase().replace('.jpeg', '.jpg');
      // Conserva el nombre original (alimenta tinción/aumento del atlas), solo
      // saneado para una ruta segura. Si dos archivos colisionan, añade índice.
      const stem = files[i]
        .slice(0, -extname(files[i]).length)
        .toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '') // sin tildes
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `foto-${i + 1}`;
      const remote = `${curso}/${clase}/${stem}${ext}`;
      const buf = readFileSync(local);
      const { error } = await supabase.storage.from('histologia').upload(remote, buf, {
        contentType: ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg',
        upsert: true,
        // 1 año immutable: si cambia el contenido cambia la ruta. Visitas
        // repetidas a la galería = 0 bytes.
        cacheControl: '31536000',
      });
      if (error) { console.error(`x ${remote}: ${error.message}`); fail++; }
      else       { console.log(`. ${remote}`); ok++; }
    }
  }
}

console.log(`\nUploaded: ${ok}, failed: ${fail}, total files: ${total}`);
