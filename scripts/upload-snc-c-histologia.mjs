/**
 * Práctica de Histología: SNC — Paso corto del GRUPO C (Neurología).
 *
 * Es el tercer grupo del examen SNC (ph01): 4 preguntas (3 con micrografía + 1
 * solo texto sobre la barrera hematoencefálica), tomadas del cuestionario de
 * Histología en Blackboard.
 *
 * 1) Re-encoda las 3 micrografías (.webp) a WEBP q82, máx 1200px de ancho, y las
 *    sube al bucket PÚBLICO "examenes-img" bajo neurologia/snc-c/.
 * 2) Arma el JSON (4 preguntas) con las URLs públicas + dimensiones reales.
 * 3) Sube el JSON al bucket PRIVADO "examenes" como neurologia/snc-histologia-c.json
 *
 * Run: node scripts/upload-snc-c-histologia.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import sharp from 'sharp';
import { config } from './load-env.mjs';

const URL_ = config.NEXT_PUBLIC_SUPABASE_URL;
const KEY  = config.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_ || !KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(URL_, KEY, { auth: { persistSession: false } });
const IMG_BUCKET = 'examenes-img';
const EXAM_BUCKET = 'examenes';
const DL = 'C:\\Users\\BUST\\Downloads\\';
const MAX_W = 1200;

// id lógico → [archivo local, ruta remota .webp]
const IMAGES = {
  cerebelo: [DL + 'snc-histogrupoB-3.webp', 'neurologia/snc-c/cerebelo-purkinje-capa-media.webp'],
  medula:   [DL + 'snc-histogrupoB-2.webp', 'neurologia/snc-c/medula-asta-anterior-motoras.webp'],
  corteza:  [DL + 'snc-histogrupoB-1.webp', 'neurologia/snc-c/corteza-microglia.webp'],
};

// ── Subida de imágenes (resize → webp → upload), devolviendo url + dims ──
async function uploadImage(local, remote) {
  const src = readFileSync(local);
  const pipeline = sharp(src).resize({ width: MAX_W, withoutEnlargement: true }).webp({ quality: 82 });
  const buf = await pipeline.toBuffer();
  const meta = await sharp(buf).metadata();
  const { error } = await supabase.storage.from(IMG_BUCKET).upload(remote, buf, {
    contentType: 'image/webp',
    upsert: true,
    cacheControl: '31536000',
  });
  if (error) throw new Error(`upload ${remote}: ${error.message}`);
  const { data } = supabase.storage.from(IMG_BUCKET).getPublicUrl(remote);
  console.log(`. ${remote}  ${meta.width}x${meta.height}  (${(buf.length / 1024).toFixed(0)} KB)`);
  return { url: data.publicUrl, w: meta.width, h: meta.height };
}

const img = {};
for (const [id, [local, remote]] of Object.entries(IMAGES)) {
  img[id] = await uploadImage(local, remote);
}

// ── Construcción del examen (4 preguntas) ──
const opt = (id, text, correct = false) => ({ id, text, correct });

const exam = {
  version: 1,
  key: 'neurologia/snc-histologia-c',
  title: 'Histología SNC — Paso corto (Grupo C)',
  duration_min: null,
  questions: [
    {
      id: 'c-q1',
      stem: 'En la siguiente imagen, el área señalada corresponde a:',
      image: img.cerebelo.url,
      imageAlt: 'Corteza cerebelosa con la capa media (de Purkinje) señalada (H&E).',
      imageW: img.cerebelo.w,
      imageH: img.cerebelo.h,
      options: [
        opt('a', 'Cerebelo - capa media - células de Purkinje', true),
        opt('b', 'Cerebro - capa media - células granulosas'),
        opt('c', 'Cerebro - capa media - células de Purkinje'),
        opt('d', 'Cerebelo - capa interna - células granulosas'),
      ],
      explanation:
        'El corte corresponde a **corteza cerebelosa**. El trazo señala la **capa media**, una hilera única donde se alinean las **células de Purkinje**, entre la capa molecular (externa, pálida) y la granular (interna, muy basófila). Por eso la respuesta es **cerebelo · capa media · células de Purkinje**.',
      tags: ['Cerebelo', 'Célula de Purkinje'],
    },
    {
      id: 'c-q2',
      stem: 'En la siguiente imagen de médula espinal, las células señaladas corresponden a:',
      image: img.medula.url,
      imageAlt: 'Asta anterior de la médula espinal con neuronas motoras señaladas (H&E).',
      imageW: img.medula.w,
      imageH: img.medula.h,
      options: [
        opt('a', 'Asta posterior - neuronas motoras'),
        opt('b', 'Asta anterior - neuronas motoras', true),
        opt('c', 'Asta anterior - neuronas sensitivas'),
        opt('d', 'Asta posterior - neuronas sensitivas'),
      ],
      explanation:
        'Las células señaladas son **neuronas multipolares grandes** ubicadas en el **asta anterior** de la sustancia gris medular: las **motoneuronas** cuyos axones salen por la raíz ventral hacia el músculo esquelético. El asta posterior, en cambio, recibe información sensitiva.',
      tags: ['Médula espinal', 'Asta anterior', 'Motoneurona'],
    },
    {
      id: 'c-q3',
      stem: 'De la siguiente imagen de corteza cerebral, la célula señalada por las flechas participa principalmente en:',
      image: img.corteza.url,
      imageAlt: 'Microglía señalada con flechas en la corteza cerebral (H&E).',
      imageW: img.corteza.w,
      imageH: img.corteza.h,
      options: [
        opt('a', 'Producción de mielina.'),
        opt('b', 'Producción de LCR.'),
        opt('c', 'Soporte metabólico neuronal.'),
        opt('d', 'Defensa inmunológica y fagocitosis.', true),
      ],
      explanation:
        'Las flechas señalan **microglía**: células de núcleo pequeño, alargado y denso (en bastón). Es la célula inmunitaria residente del SNC y su función principal es la **defensa inmunológica y la fagocitosis**. La producción de mielina corresponde a los oligodendrocitos, la del LCR al plexo coroideo y el soporte metabólico neuronal a los astrocitos.',
      tags: ['Microglía', 'Defensa inmunológica'],
    },
    {
      id: 'c-q4',
      stem: 'La barrera hematoencefálica está constituida por:',
      options: [
        opt('a', 'Endotelio - lámina basal - pies terminales de los oligodendrocitos'),
        opt('b', 'Endotelio - lámina basal - pies terminales de los astrocitos', true),
        opt('c', 'Endotelio fenestrado - lámina basal - pies terminales de microglías'),
        opt('d', 'Endotelio fenestrado - lámina basal - pies terminales de los astrocitos'),
      ],
      explanation:
        'La **barrera hematoencefálica** la forman: **endotelio continuo NO fenestrado** (con uniones estrechas), su **lámina basal** y los **pies terminales perivasculares de los astrocitos**. Por eso las opciones con endotelio *fenestrado* (C y D) son falsas, y los pies son de astrocitos, no de oligodendrocitos (A).',
      tags: ['Barrera hematoencefálica', 'Astrocitos'],
    },
  ],
};

// ── Validación rápida: exactamente una correcta por pregunta ──
for (const q of exam.questions) {
  const n = q.options.filter(o => o.correct).length;
  if (n !== 1) { console.error(`Pregunta ${q.id}: ${n} opciones correctas (debe ser 1)`); process.exit(1); }
}

// ── Subida del JSON al bucket privado ──
const remoteJson = 'neurologia/snc-histologia-c.json';
const body = Buffer.from(JSON.stringify(exam, null, 2), 'utf8');
const { error: upErr } = await supabase.storage.from(EXAM_BUCKET).upload(remoteJson, body, {
  contentType: 'application/json',
  upsert: true,
});
if (upErr) { console.error('upload json:', upErr.message); process.exit(1); }

console.log(`\nExamen subido: ${EXAM_BUCKET}/${remoteJson} (${exam.questions.length} preguntas, ${(body.length / 1024).toFixed(1)} KB)`);
