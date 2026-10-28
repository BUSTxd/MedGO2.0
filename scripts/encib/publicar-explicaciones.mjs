/** Inspección remota por defecto; --publicar actualiza solo explicaciones, con respaldo y lectura posterior. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createClient } from '@supabase/supabase-js';
import { config } from '../load-env.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
execFileSync(process.execPath, [path.join(raiz, 'scripts/encib/actualizar-explicaciones.mjs'), '--comprobar'], { stdio: 'inherit' });
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? config.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? config.SUPABASE_SERVICE_ROLE_KEY;
assert.ok(url && key, 'Faltan las credenciales del proyecto en el entorno local.');
const cliente = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const bucket = cliente.storage.from('examenes');
const { data: metadatos, error: errorBucket } = await cliente.storage.getBucket('examenes');
assert.ok(!errorBucket && metadatos && !metadatos.public, 'El banco debe mantenerse en un bucket privado.');
const sha = (s) => createHash('sha256').update(s).digest('hex');
const identidad = (q) => ({ id: q.id, n: q.n, codigo: q.codigo, stem: q.stem, options: q.options });

const bancos = await Promise.all([2021, 2024, 2025].map(async (anio) => {
  const ruta = `encib/${anio}.json`;
  const { data, error } = await bucket.download(ruta);
  if (error || !data) throw new Error(`${ruta}: ${error?.message ?? 'Sin contenido'}`);
  const original = await data.text();
  const remoto = JSON.parse(original);
  const local = JSON.parse(fs.readFileSync(path.join(raiz, 'data/encib', `${anio}.json`), 'utf8'));
  assert.equal(remoto.questions.length, 100);
  const porId = new Map(local.questions.map((q) => [q.id, q]));
  for (const q of remoto.questions) {
    const nueva = porId.get(q.id);
    assert.ok(nueva, `${ruta}/${q.id}: identidad desconocida`);
    assert.deepEqual(identidad(q), identidad(nueva), `${ruta}/${q.id}: el contenido remoto difiere; revisar antes de publicar`);
    q.explanation = nueva.explanation;
    q.explanationDetail = nueva.explanationDetail;
    if (nueva.reviewNote) q.reviewNote = nueva.reviewNote;
  }
  remoto.explanationRevision = '2026-10-23';
  const cuerpo = `${JSON.stringify(remoto, null, 2)}\n`;
  console.log(`${ruta}: 100 identidades y claves coinciden; ${Buffer.byteLength(cuerpo)} bytes preparados.`);
  return { anio, ruta, original, remoto, cuerpo };
}));

if (!process.argv.includes('--publicar')) {
  console.log('Inspección completada. Usa --publicar para actualizar los tres archivos privados.');
} else {
  const fecha = new Date().toISOString().replace(/[:.]/g, '-');
  const respaldo = path.join(raiz, 'data/encib', `respaldo-remoto-${fecha}`);
  fs.mkdirSync(respaldo, { recursive: true });
  for (const b of bancos) fs.writeFileSync(path.join(respaldo, `${b.anio}.json`), b.original);
  for (const b of bancos) {
    const { error } = await bucket.upload(b.ruta, b.cuerpo, { contentType: 'application/json', cacheControl: '0', upsert: true });
    if (error) throw new Error(`${b.ruta}: ${error.message}. Los originales están en ${respaldo}`);
    const { data, error: firmaError } = await bucket.createSignedUrl(b.ruta, 60);
    if (firmaError || !data?.signedUrl) throw new Error(`${b.ruta}: no se pudo verificar la publicación`);
    const firmada = new URL(data.signedUrl);
    firmada.searchParams.set('revision', sha(b.cuerpo).slice(0, 16));
    const respuesta = await fetch(firmada, { cache: 'no-store' });
    assert.ok(respuesta.ok, `${b.ruta}: lectura posterior HTTP ${respuesta.status}`);
    const leido = await respuesta.text();
    assert.equal(sha(leido), sha(b.cuerpo), `${b.ruta}: el contenido servido no coincide`);
    assert.deepEqual(JSON.parse(leido), b.remoto);
    console.log(`${b.ruta}: publicado y verificado por URL firmada (${sha(leido).slice(0, 12)}).`);
  }
  console.log('Publicadas 300 explicaciones. Respaldo privado local conservado; no se modificaron accesos ni claves.');
}
