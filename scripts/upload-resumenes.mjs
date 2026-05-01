/**
 * One-time script: uploads PDFs from private/pdfs/ to Supabase Storage bucket "resumenes".
 * Run with: node scripts/upload-resumenes.mjs
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from './load-env.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const URL_  = config.NEXT_PUBLIC_SUPABASE_URL;
const KEY   = config.SUPABASE_SERVICE_ROLE_KEY;

if (!URL_ || !KEY) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(URL_, KEY, {
  auth: { persistSession: false },
});

// Add more entries here as you add PDFs
const FILES = [
  { local: join(ROOT, 'private', 'pdfs', 'clase-4.pdf'), remote: 'clase-4.pdf' },
];

for (const { local, remote } of FILES) {
  if (!existsSync(local)) {
    console.warn(`⚠  Skipping ${remote} — file not found at ${local}`);
    continue;
  }

  const buffer = readFileSync(local);

  const { error } = await supabase.storage
    .from('resumenes')
    .upload(remote, buffer, {
      contentType: 'application/pdf',
      upsert: true,          // overwrite if already exists
    });

  if (error) {
    console.error(`❌  Error uploading ${remote}:`, error.message);
  } else {
    console.log(`✓  Uploaded → resumenes/${remote}`);
  }
}
