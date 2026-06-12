/**
 * Sube las imágenes embebidas en preguntas de examen al bucket PÚBLICO
 * "examenes-img" de Supabase, convirtiéndolas a WEBP, y devuelve sus URLs.
 *
 * Run: node scripts/upload-examen-img.mjs
 *
 * Convierte cada fuente a WEBP con sharp (los .webp ya existentes pasan tal
 * cual). Sube a rutas `.webp`. Público (no signed URL) porque son micrografías
 * de referencia, no sensibles. cacheControl 1 año immutable.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { extname } from 'path';
import sharp from 'sharp';
import { config } from './load-env.mjs';

const URL_ = config.NEXT_PUBLIC_SUPABASE_URL;
const KEY  = config.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_ || !KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(URL_, KEY, { auth: { persistSession: false } });
const BUCKET = 'examenes-img';
const DL = 'C:\\Users\\BUST\\Downloads\\';

// local → ruta remota (todas .webp). Las fuentes pueden ser .png o .webp.
const FILES = [
  // ── Grupo A ──
  [DL + 'histo-snp1.png', 'neurologia/snp/nervio-longitudinal-ranvier.webp'],
  [DL + 'histo-snp2.png', 'neurologia/snp/ganglio-sensitivo-nl.webp'],
  [DL + 'histo-snp3.webp', 'neurologia/snp/ganglio-autonomo-lipofuscina.webp'],
  [DL + 'histo-snp4.png', 'neurologia/snp/nervio-endoneuro.webp'],
  // ── Grupo B ──
  [DL + 'histo-snp-parte2.2.png', 'neurologia/snp/b/ganglio-raiz-dorsal.webp'],
  [DL + 'histo-snp-parte2.1.png', 'neurologia/snp/b/ganglio-celulas-satelite.webp'],
  [DL + 'histo-snp-parte2.3.png', 'neurologia/snp/b/nervio-corte-schwann.webp'],
  [DL + 'histo-snp-parte2.4.png', 'neurologia/snp/b/ganglio-simpatico-lipofuscina.webp'],
  [DL + 'histo-snp-parte2.5.png', 'neurologia/snp/b/ganglio-parasimpatico.webp'],
  [DL + 'histo-snp-parte2.6.png', 'neurologia/snp/b/nervio-perineuro-fasciculos.webp'],
  [DL + 'histo-snp-parte2.8.png', 'neurologia/snp/b/nervio-epineuro-masson.webp'],
  [DL + 'histo-snp-parte2.7.png', 'neurologia/snp/b/ganglio-somas-multipolares.webp'],
  [DL + 'histo-snp-parte2.9.png', 'neurologia/snp/b/ganglio-dorsal-satelite.webp'],
];

// rutas .png viejas a borrar tras subir las .webp
const OLD_PNG = FILES.map(([, remote]) => remote.replace(/\.webp$/, '.png'));

const { data: buckets, error: lbErr } = await supabase.storage.listBuckets();
if (lbErr) { console.error('listBuckets:', lbErr); process.exit(1); }
if (!buckets.find((b) => b.name === BUCKET)) {
  console.log(`Bucket "${BUCKET}" no existe, creando (público)...`);
  const { error: cbErr } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
  });
  if (cbErr) { console.error('createBucket:', cbErr); process.exit(1); }
  console.log('Bucket creado.');
} else {
  console.log(`Bucket "${BUCKET}" ya existe.`);
}

for (const [local, remote] of FILES) {
  const src = readFileSync(local);
  const webp = extname(local).toLowerCase() === '.webp'
    ? src
    : await sharp(src).webp({ quality: 82 }).toBuffer();
  const { error } = await supabase.storage.from(BUCKET).upload(remote, webp, {
    contentType: 'image/webp',
    upsert: true,
    cacheControl: '31536000',
  });
  if (error) { console.error(`x ${remote}: ${error.message}`); continue; }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(remote);
  console.log(`. ${remote}  (${(webp.length / 1024).toFixed(0)} KB)\n  ${data.publicUrl}`);
}

// Limpieza de los .png reemplazados
const { data: removed, error: rmErr } = await supabase.storage.from(BUCKET).remove(OLD_PNG);
if (rmErr) console.error('remove .png:', rmErr.message);
else console.log(`\nBorrados ${removed?.length ?? 0} .png viejos.`);
