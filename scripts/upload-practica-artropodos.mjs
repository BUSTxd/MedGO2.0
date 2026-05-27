import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const SUPABASE_URL = 'https://dabrwqwzvvnosdnmvlrp.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('Falta SUPABASE_SERVICE_ROLE_KEY en el entorno.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const SOURCE_DIR = 'C:\\Users\\BUST\\Downloads';

const FILES = [
  { src: 'PRÁCTICA 8 - DIAGNÓSTICO PARASITOLÓGICO.pdf', dest: 'parasitologia/practica-8.pdf'  },
  { src: 'PRÁCTICA  9.pdf',                              dest: 'parasitologia/practica-9.pdf'  },
  { src: 'PRÁCTICA 10.pdf',                              dest: 'parasitologia/practica-10.pdf' },
  { src: 'PRÁCTICA 11.pdf',                              dest: 'parasitologia/practica-11.pdf' },
  { src: 'PRÁCTICA 12.pdf',                              dest: 'parasitologia/practica-12.pdf' },
  { src: 'PRÁCTICA 13.pdf',                              dest: 'parasitologia/practica-13.pdf' },
];

async function upload() {
  console.log(`Subiendo ${FILES.length} PDFs al bucket "resumenes/parasitologia/"...\n`);

  for (const { src, dest } of FILES) {
    const filePath = join(SOURCE_DIR, src);
    const buffer = readFileSync(filePath);

    const { error } = await supabase.storage
      .from('resumenes')
      .upload(dest, buffer, {
        contentType: 'application/pdf',
        cacheControl: '31536000',
        upsert: true,
      });

    if (error) {
      console.error(`  ✗ ${dest} — ${error.message}`);
    } else {
      console.log(`  ✓ ${dest}`);
    }
  }

  console.log('\nListo.');
}

upload();
