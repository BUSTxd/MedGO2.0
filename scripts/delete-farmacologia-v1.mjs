import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dabrwqwzvvnosdnmvlrp.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('Falta SUPABASE_SERVICE_ROLE_KEY en el entorno.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// PDFs viejos rotos (v1) — reemplazados por .v2.pdf
const PATHS = [
  'farmacologia/clase-14.pdf',
  'farmacologia/clase-16.pdf',
  'farmacologia/clase-17.pdf',
  'farmacologia/clase-18.pdf',
  'farmacologia/clase-19.pdf',
  'farmacologia/clase-19.2.pdf',
  'farmacologia/clase-23.pdf',
  'farmacologia/clase-24.pdf',
  'farmacologia/clase-25.pdf',
];

const { data, error } = await supabase.storage.from('resumenes').remove(PATHS);

if (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

console.log(`Borrados ${data?.length ?? 0} PDFs viejos:`);
for (const obj of data ?? []) console.log(`  ok ${obj.name}`);
