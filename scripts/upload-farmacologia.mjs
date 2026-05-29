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

const SOURCE_DIR = 'C:\\Users\\BUST\\Downloads\\farmaco-compressed';

// v2 = fix de imágenes blancas. El compresor antiguo dejaba /Filter en JPXDecode
// tras reemplazar con JPEG, así que pdfjs renderizaba garbage. Cache es immutable
// 1 año → usamos paths nuevos para invalidar instantáneamente en todos los clientes.
const FILES = [
  { src: 'colinergicos_compressed.pdf',         dest: 'farmacologia/clase-14.v2.pdf'   },
  { src: 'nicotinicos_ganglio_compressed.pdf',  dest: 'farmacologia/clase-16.v2.pdf'   },
  { src: 'nicotinico_muscular_compressed.pdf',  dest: 'farmacologia/clase-17.v2.pdf'   },
  { src: 'histamina_compressed.pdf',            dest: 'farmacologia/clase-18.v2.pdf'   },
  { src: 'biologicos_compressed.pdf',           dest: 'farmacologia/clase-19.v2.pdf'   },
  { src: 'terapia_genica_compressed.pdf',       dest: 'farmacologia/clase-19.2.v2.pdf' },
  { src: 'b_lactamicos_compressed.pdf',         dest: 'farmacologia/clase-23.v2.pdf'   },
  { src: 'fluroquinolonas_compressed.pdf',      dest: 'farmacologia/clase-24.v2.pdf'   },
  { src: 'clindamicina_compressed.pdf',         dest: 'farmacologia/clase-25.v2.pdf'   },
];

async function upload() {
  console.log(`Subiendo ${FILES.length} PDFs al bucket "resumenes/farmacologia/"...\n`);

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
      console.error(`  x ${dest} -- ${error.message}`);
    } else {
      console.log(`  ok ${dest}`);
    }
  }

  console.log('\nListo.');
}

upload();
