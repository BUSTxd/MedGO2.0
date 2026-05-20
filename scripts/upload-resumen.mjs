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
  console.error('Uso: node scripts/upload-resumen.mjs <archivo-local.pdf> <carpeta/nombre.pdf>');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const BUCKET = 'resumenes';

const body = readFileSync(localPath);
console.log(`Subiendo ${localPath} (${(body.length / 1024).toFixed(1)} KB) a ${BUCKET}/${storagePath}...`);

const { error: upErr } = await supabase.storage.from(BUCKET).upload(storagePath, body, {
  contentType: 'application/pdf',
  upsert: true,
});
if (upErr) { console.error('upload:', upErr.message); process.exit(1); }

console.log('Upload OK.');

const { data: signed, error: sErr } = await supabase.storage
  .from(BUCKET)
  .createSignedUrl(storagePath, 60);
if (sErr) { console.error('createSignedUrl:', sErr.message); process.exit(1); }
console.log('Signed URL (1 min) para verificación:\n', signed.signedUrl);
