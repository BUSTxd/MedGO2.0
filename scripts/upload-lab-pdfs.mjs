/**
 * Uploads labomicro PDFs to the Supabase `resumenes` bucket.
 * Run from the project root: node scripts/upload-lab-pdfs.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Parse .env.local manually (no dotenv dependency needed)
const envPath = resolve(process.cwd(), '.env.local');
const envText = readFileSync(envPath, 'utf8');
for (const line of envText.split('\n')) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const FILES = [
  {
    src: 'C:\\Users\\BUST\\Downloads\\Labomicro1.pdf',
    dest: 'practica-1.pdf',
    label: 'Práctica 1 (Taller Bioseguridad)',
  },
  {
    src: 'C:\\Users\\BUST\\Downloads\\Labo2.pdf',
    dest: 'practica-2-3.pdf',
    label: 'Prácticas 2 y 3 (Esterilización / Desinfección)',
  },
];

for (const { src, dest, label } of FILES) {
  console.log(`Uploading ${label}…`);
  const buffer = await readFile(src);

  const { error } = await supabase.storage
    .from('resumenes')
    .upload(dest, buffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) {
    console.error(`  ✗ ${dest}: ${error.message}`);
  } else {
    console.log(`  ✓ ${dest} uploaded`);
  }
}

console.log('\nDone.');
