/**
 * Sube las imagenes del atlas de micologia al bucket "micologia" de Supabase.
 * Run: node scripts/upload-micologia.mjs
 *
 * SRC_DIR puede sobreescribirse via env: SRC_DIR="C:\\ruta\\a\\carpeta" node scripts/upload-micologia.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { config } from './load-env.mjs';

const SRC_DIR = process.env.SRC_DIR || 'C:\\Users\\BUST\\Downloads\\imagenes labo cmico comprimidas-20260512T162845Z-3-001\\lab micologia';

const URL_ = config.NEXT_PUBLIC_SUPABASE_URL;
const KEY  = config.SUPABASE_SERVICE_ROLE_KEY;

if (!URL_ || !KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}
if (!existsSync(SRC_DIR)) {
  console.error(`Source dir not found: ${SRC_DIR}`);
  process.exit(1);
}

const supabase = createClient(URL_, KEY, { auth: { persistSession: false } });

// Limpia "Aspergillus flavus 0.2" -> "Aspergillus flavus", "Fusarium spp." -> "Fusarium spp"
const cleanName = (base) =>
  base.replace(/\s+\d+(\.\d+)?$/, '').replace(/\.+$/, '').trim();

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const files = readdirSync(SRC_DIR).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
const grouped = new Map();
for (const f of files) {
  const base = f.replace(/\.[^.]+$/, '');
  const slug = slugify(cleanName(base));
  if (!grouped.has(slug)) grouped.set(slug, []);
  grouped.get(slug).push(f);
}

let ok = 0, fail = 0;
for (const [slug, group] of grouped.entries()) {
  group.sort();
  for (let i = 0; i < group.length; i++) {
    const local = join(SRC_DIR, group[i]);
    const ext = extname(group[i]).toLowerCase().replace('jpeg', 'jpg');
    const remote = `${slug}/${i + 1}${ext}`;
    const buf = readFileSync(local);
    const { error } = await supabase.storage.from('micologia').upload(remote, buf, {
      contentType: ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg',
      upsert: true,
    });
    if (error) { console.error(`x ${remote}: ${error.message}`); fail++; }
    else      { console.log(`. ${remote}`); ok++; }
  }
}
console.log(`\nUploaded: ${ok}, failed: ${fail}, total files: ${files.length}`);
