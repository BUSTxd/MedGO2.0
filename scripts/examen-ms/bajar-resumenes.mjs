/**
 * Baja (solo lectura) los resúmenes de anatomía del miembro superior del bucket
 * privado `resumenes` y los deja en texto plano para los extractores del examen 3D.
 *
 *   node scripts/examen-ms/bajar-resumenes.mjs
 *
 * Salida en docs/examen-ms/fuentes/ (gitignored: son resúmenes de pago):
 *   <id>.html  el fragmento tal cual está publicado
 *   <id>.txt   texto con los encabezados (#, ##, ###), listas y tablas conservados,
 *              y cada figura marcada en su sitio
 *   img/<id>/fNN.png  las figuras (mucha información vive solo en ellas)
 */

import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { config } from '../load-env.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SALIDA = join(ROOT, 'docs', 'examen-ms', 'fuentes');

// Anatomía del miembro superior (las prácticas anat-1..3 heredan estos mismos).
const RESUMENES = ['loc-clase-2', 'loc-clase-2-osteo', 'loc-clase-3', 'loc-clase-5', 'loc-sgp-2'];

const URL = config.NEXT_PUBLIC_SUPABASE_URL;
const KEY = config.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}
const sb = createClient(URL, KEY, { auth: { persistSession: false } });

const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', rarr: '→', larr: '←', deg: '°', middot: '·', hellip: '…' };
const decodificar = (s) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
  .replace(/&([a-z]+);/gi, (m, n) => ENTIDADES[n.toLowerCase()] ?? m);

// Cada <img> queda en el texto como «[FIGURA fNN → img/<id>/fNN.png]» en su sitio,
// para que el extractor sepa bajo qué encabezado está y la mire.
function aTexto(html, id, figuras) {
  let t = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
    .replace(/<img[^>]*>/gi, (tag) => {
      const src = tag.match(/src="([^"]+)"/)?.[1];
      if (!src) return '\n';
      const n = `f${String(figuras.length + 1).padStart(2, '0')}`;
      figuras.push({ n, src });
      const alt = tag.match(/alt="([^"]*)"/)?.[1];
      return `\n[FIGURA ${n} → img/${id}/${n}.png${alt ? ` · ${alt}` : ''}]\n`;
    })
    .replace(/<h1[^>]*>/gi, '\n\n# ').replace(/<h2[^>]*>/gi, '\n\n## ').replace(/<h3[^>]*>/gi, '\n\n### ').replace(/<h4[^>]*>/gi, '\n\n#### ')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<tr[^>]*>/gi, '\n| ').replace(/<\/t[dh]>/gi, ' | ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|ul|ol|table|blockquote|figure|details|summary)>/gi, '\n')
    .replace(/<[^>]+>/g, '');
  t = decodificar(t)
    .split('\n').map((l) => l.replace(/[ \t]+/g, ' ').trim()).join('\n')
    .replace(/\n{3,}/g, '\n\n');
  return t.trim() + '\n';
}

mkdirSync(SALIDA, { recursive: true });
for (const id of RESUMENES) {
  const { data, error } = await sb.storage.from('resumenes').download(`aparato-locomotor/${id}.html`);
  if (error) { console.error(`✗ ${id}: ${error.message}`); process.exitCode = 1; continue; }
  const html = await data.text();
  const figuras = [];
  const texto = aTexto(html, id, figuras);
  writeFileSync(join(SALIDA, `${id}.html`), html);
  writeFileSync(join(SALIDA, `${id}.txt`), texto);
  // Figuras (bucket público resumenes-img) a PNG: el lector de imágenes no abre AVIF.
  const dirImg = join(SALIDA, 'img', id);
  mkdirSync(dirImg, { recursive: true });
  let bajadas = 0;
  for (const { n, src } of figuras) {
    const res = await fetch(src);
    if (!res.ok) { console.error(`  ✗ ${n}: ${res.status} ${src}`); process.exitCode = 1; continue; }
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).resize({ width: 1600, withoutEnlargement: true }).png().toFile(join(dirImg, `${n}.png`));
    bajadas++;
  }
  const encabezados = texto.split('\n').filter((l) => /^#{1,4} /.test(l)).length;
  console.log(`✓ ${id}: ${(html.length / 1024).toFixed(0)} KB html → ${(texto.length / 1024).toFixed(0)} KB texto, ${encabezados} encabezados, ${bajadas}/${figuras.length} figuras`);
}
