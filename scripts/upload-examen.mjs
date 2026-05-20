import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Faltan env vars NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const [, , localPath, storagePath] = process.argv;
if (!localPath || !storagePath) {
  console.error('Uso: node scripts/upload-examen.mjs <archivo-local> <path-en-bucket>');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const BUCKET = 'examenes';

const { data: buckets, error: lbErr } = await supabase.storage.listBuckets();
if (lbErr) { console.error('listBuckets:', lbErr); process.exit(1); }
const exists = buckets.find(b => b.name === BUCKET);

if (!exists) {
  console.log(`Bucket "${BUCKET}" no existe, creando (privado)...`);
  const { error: cbErr } = await supabase.storage.createBucket(BUCKET, {
    public: false,
    fileSizeLimit: 1024 * 1024,
    allowedMimeTypes: ['application/json'],
  });
  if (cbErr) { console.error('createBucket:', cbErr); process.exit(1); }
  console.log('Bucket creado.');
} else {
  console.log(`Bucket "${BUCKET}" ya existe (public=${exists.public}).`);
}

const body = readFileSync(localPath);
console.log(`Subiendo ${localPath} (${body.length} bytes) a ${BUCKET}/${storagePath}...`);

const { error: upErr } = await supabase.storage.from(BUCKET).upload(storagePath, body, {
  contentType: 'application/json',
  upsert: true,
});
if (upErr) { console.error('upload:', upErr); process.exit(1); }

console.log('Upload OK.');

const { data: signed, error: sErr } = await supabase.storage
  .from(BUCKET)
  .createSignedUrl(storagePath, 60);
if (sErr) { console.error('createSignedUrl:', sErr); process.exit(1); }
console.log('Signed URL (1 min) para verificación:\n', signed.signedUrl);
