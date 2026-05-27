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

const SOURCE_DIR = 'C:\\Users\\BUST\\Downloads\\Clases Parasitología-20260525T154719Z-3-001\\Clases Parasitología';

const FILES = [
  {
    src: 'Generalidades de parasitología_compressed.pdf',
    dest: 'parasitologia/clase-12.pdf',
  },
  {
    src: 'Parásitos protozoos I - Metamonada_compressed.pdf',
    dest: 'parasitologia/clase-12.2.pdf',
  },
  {
    src: 'Parásitos protozoos II - Amoebozoa y Percolozoa_compressed.pdf',
    dest: 'parasitologia/clase-13.pdf',
  },
  {
    src: 'Parásitos protozoos II - Ciliophora_compressed.pdf',
    dest: 'parasitologia/clase-13.2.pdf',
  },
  {
    src: 'Parásitos protozoos intracelulares Alveolata - Coccidia_compressed.pdf',
    dest: 'parasitologia/clase-14.pdf',
  },
  {
    src: 'Parásitos protozoos intracelulares transmitidos por vectores_compressed.pdf',
    dest: 'parasitologia/clase-15.pdf',
  },
  {
    src: 'Parásitos helmintos - NEMÁTODOS_compressed.pdf',
    dest: 'parasitologia/clase-16.pdf',
  },
  {
    src: 'Parásitos helmintos - CÉSTODOS_compressed.pdf',
    dest: 'parasitologia/clase-17.pdf',
  },
  {
    src: 'Parásitos helmintos - TREMÁTODOS_compressed.pdf',
    dest: 'parasitologia/clase-17.2.pdf',
  },
  {
    src: 'ARTRPODOS_compressed.pdf',
    dest: 'parasitologia/clase-18.pdf',
  },
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
