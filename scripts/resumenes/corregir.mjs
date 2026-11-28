/**
 * Corrige un resumen ya publicado en el bucket privado `resumenes`, con respaldo.
 * Es la fase 1 de docs/labs/ESTRUCTURA-GUION.md: el resumen se corrige ANTES de
 * escribir el guion de un lab, para que el error no pase al laboratorio.
 *
 *   node scripts/resumenes/corregir.mjs bajar  patologia/pat-acp-12
 *   (editar <carpeta>/pat-acp-12.html; leer pat-acp-12.txt)
 *   node scripts/resumenes/corregir.mjs subir  patologia/pat-acp-12
 *
 * Carpeta: C:\Users\BUST\Downloads\resumenes-corregidos\ (fuera del repo: son de pago).
 *   <id>.original.html   lo publicado al bajar (no se pisa si ya existe)
 *   <id>.html            la copia que se edita
 *   <id>.txt             texto plano para leerlo (encabezados, listas y tablas)
 *   <id>.corregido.html  lo que se subió
 *   <id>.cambios.md      la lista de correcciones (la escribe quien corrige)
 *
 * Sube con upsert, `text/html` y `cacheControl: 300`, como upload-resumen-doc.mjs:
 * de la caché se encarga el ETag de la route.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { createClient } from '@supabase/supabase-js';
import { config } from '../load-env.mjs';

const [accion, ruta] = process.argv.slice(2);
if (!['bajar', 'subir'].includes(accion) || !ruta || !ruta.includes('/')) {
  console.error('Uso: node scripts/resumenes/corregir.mjs bajar|subir <curso>/<id>');
  process.exit(1);
}
const objeto = ruta.endsWith('.html') ? ruta : `${ruta}.html`;
const id = objeto.split('/').pop().replace(/\.html$/, '');
const CARPETA = join(homedir(), 'Downloads', 'resumenes-corregidos');
mkdirSync(CARPETA, { recursive: true });
const f = (sufijo) => join(CARPETA, `${id}${sufijo}`);

if (!config.NEXT_PUBLIC_SUPABASE_URL || !config.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}
const sb = createClient(config.NEXT_PUBLIC_SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', rarr: '→', hellip: '…' };
const aTexto = (html) => html
  .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
  .replace(/<h([1-6])[^>]*>/gi, (_, n) => `\n${'#'.repeat(+n)} `)
  .replace(/<\/(p|div|li|tr|h[1-6]|table|figure|figcaption)>/gi, '\n')
  .replace(/<li[^>]*>/gi, '- ')
  .replace(/<\/t[dh]>/gi, ' | ')
  .replace(/<img[^>]*?(?:alt="([^"]*)")?[^>]*>/gi, (_, alt) => `[FIGURA${alt ? `: ${alt}` : ''}]`)
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<[^>]+>/g, '')
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
  .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m)
  .replace(/\n\s*\n+/g, '\n\n');

if (accion === 'bajar') {
  const { data, error } = await sb.storage.from('resumenes').download(objeto);
  if (error) { console.error(`No se pudo bajar ${objeto}:`, error.message); process.exit(1); }
  const html = Buffer.from(await data.arrayBuffer()).toString('utf8');
  if (existsSync(f('.original.html'))) console.log(`Ya había respaldo original: no se pisa (${f('.original.html')})`);
  else writeFileSync(f('.original.html'), html);
  writeFileSync(f('.html'), html);
  writeFileSync(f('.txt'), aTexto(html));
  console.log(`Bajado ${objeto} (${html.length} caracteres)\n  editar: ${f('.html')}\n  leer:   ${f('.txt')}`);
} else {
  if (!existsSync(f('.original.html'))) { console.error('No hay respaldo original: primero «bajar».'); process.exit(1); }
  if (!existsSync(f('.cambios.md'))) { console.error(`Falta la lista de correcciones: ${f('.cambios.md')}`); process.exit(1); }
  const html = readFileSync(f('.html'), 'utf8');
  if (html === readFileSync(f('.original.html'), 'utf8')) { console.error('La copia es igual al original: nada que subir.'); process.exit(1); }
  const { error } = await sb.storage.from('resumenes').upload(objeto, Buffer.from(html, 'utf8'), {
    contentType: 'text/html',
    cacheControl: '300',
    upsert: true,
  });
  if (error) { console.error(`No se pudo subir ${objeto}:`, error.message); process.exit(1); }
  copyFileSync(f('.html'), f('.corregido.html'));
  writeFileSync(f('.txt'), aTexto(html));
  console.log(`Subido ${objeto} (${html.length} caracteres); copia en ${f('.corregido.html')}`);
}
