/**
 * Sube las imágenes del lab «Tronco encefálico» al bucket PÚBLICO "examenes-img"
 * de Supabase, convirtiéndolas a WEBP, y devuelve sus URLs.
 *
 * Run: node scripts/upload-tronco-encefalico.mjs
 *
 * Lado izquierdo (cadáver): vistas posterior y lateral del cadáver.
 * Lado derecho (maqueta 3D): 4 perspectivas (frontal, lateral der., posterior, lateral izq.).
 * Fuentes .avif → WEBP con sharp (q82). Público (no signed URL). cacheControl 1 año immutable.
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

// local → ruta remota (todas .webp).
const FILES = [
  // ── Lado izquierdo: cadáver ──
  [DL + 'vista desde atras cadaver.avif', 'neurologia/tronco-encefalico/cadaver/posterior.webp'],
  [DL + 'vista lateral cadaver.avif',     'neurologia/tronco-encefalico/cadaver/lateral.webp'],
  // ── Lado derecho: maqueta 3D (orden de rotación a la derecha) ──
  [DL + 'frontal (1).avif',               'neurologia/tronco-encefalico/maqueta/frontal.webp'],
  [DL + 'lateral derecha (1).avif',       'neurologia/tronco-encefalico/maqueta/lateral-derecha.webp'],
  [DL + 'atras.avif',                     'neurologia/tronco-encefalico/maqueta/posterior.webp'],
  [DL + 'lateral izquierda (1).avif',     'neurologia/tronco-encefalico/maqueta/lateral-izquierda.webp'],
];

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
