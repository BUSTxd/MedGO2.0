/**
 * Práctica de Histología: Piel — Paso corto del GRUPO A4 (Neurología).
 *
 * Es el 3er cuadradito ("C") del selector del examen Piel (ph03): 5 preguntas
 * con micrografía, tomadas del Post test 3 — Grupo A4 (Blackboard).
 *
 * 1) Re-encoda las 5 micrografías (.jpeg con la flecha ya marcada) a WEBP q82,
 *    máx 1200px de ancho, y las sube al bucket PÚBLICO "examenes-img" bajo
 *    neurologia/piel-c/.
 * 2) Arma el JSON (5 preguntas) con las URLs públicas + dimensiones reales.
 * 3) Sube el JSON al bucket PRIVADO "examenes" como
 *    neurologia/piel-histologia-c.json
 *
 * Run: node scripts/upload-piel-c-histologia.mjs
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
  meissner:      [DL + 'histopielV3-1.jpeg',        'neurologia/piel-c/corpusculo-meissner.webp'],
  pielgruesa:    [DL + 'histopielV3-2.jpeg',        'neurologia/piel-c/piel-gruesa.webp'],
  laminar:       [DL + 'histopielV3-3.jpeg',        'neurologia/piel-c/corpusculo-laminar-pacini.webp'],
  basal:         [DL + 'histopielV3-4.jpeg',        'neurologia/piel-c/estrato-basal.webp'],
  sebacea:       [DL + 'histopielV3-5.jpeg',        'neurologia/piel-c/glandula-sebacea.webp'],
  pielgruesaRef: [DL + 'piel gruesa (1).avif',      'neurologia/piel-c/piel-gruesa-referencia.webp'],
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

// ── Construcción del examen (5 preguntas) ──
const opt = (id, text, correct = false) => ({ id, text, correct });

const exam = {
  version: 1,
  key: 'neurologia/piel-histologia-c',
  title: 'Histología de la Piel — Paso corto (Grupo A4)',
  duration_min: null,
  questions: [
    {
      id: 'c-q1',
      stem: '¿Cuál es la función de la estructura señalada?',
      image: img.meissner.url,
      imageAlt: 'Corpúsculo ovoide encapsulado en una papila dérmica, justo debajo de la epidermis, señalado por la flecha (H&E).',
      imageW: img.meissner.w,
      imageH: img.meissner.h,
      options: [
        opt('a', 'Detectar presión sostenida y vibración de alta frecuencia en dermis profunda e hipodermis.'),
        opt('b', 'Mediar el tacto fino y los estímulos de baja frecuencia.', true),
        opt('c', 'Funcionar como receptor tónico para el tacto sostenido y la percepción de la textura de un objeto.'),
        opt('d', 'Responder a la distensión y torsión de la piel mediante una cápsula fusiforme anclada al tejido conectivo.'),
      ],
      explanation:
        'La flecha señala un **corpúsculo de Meissner**: receptor encapsulado ovoide ubicado en las **papilas dérmicas**, justo debajo de la epidermis, con células de Schwann apiladas en patrón laminar. Es un mecanorreceptor de **adaptación rápida** que media el **tacto fino, discriminativo y las vibraciones de baja frecuencia** (~30 Hz). Las otras opciones describen el corpúsculo de Pacini (alta frecuencia, dermis profunda), el disco de Merkel (receptor tónico de adaptación lenta) y la terminación de Ruffini (cápsula fusiforme, distensión).',
      tags: ['Corpúsculo de Meissner', 'Tacto fino', 'Papila dérmica'],
    },
    {
      id: 'c-q2',
      stem: 'Observa la microfotografía. Indicar qué característica le corresponde.',
      image: img.pielgruesa.url,
      imageAlt: 'Piel gruesa con epidermis de crestas interdigitadas y estrato córneo grueso, sin folículos pilosos (H&E).',
      imageW: img.pielgruesa.w,
      imageH: img.pielgruesa.h,
      options: [
        opt('a', 'Presenta un estrato córneo notablemente más grueso (hasta 30 capas).'),
        opt('b', 'Su espesor epidérmico total puede alcanzar 600 µm.'),
        opt('c', 'Posee una densidad de melanocitos aproximadamente 4 veces mayor.', true),
        opt('d', 'Carece de folículos pilosos y glándulas sebáceas.'),
      ],
      explanation:
        'Es una lámina de **piel delgada**, la podemos distinguir por su estrato córneo delgado y su epidermis delgada. Es muy probable que la cifra "x4" provenga de la **relación melanocito/queratinocito** en el estrato basal, o de la comparación entre zonas extremas del cuerpo.\n\n**Relación en el estrato basal:** En zonas muy expuestas o muy pigmentadas como la cara (mejillas), la proporción es de aproximadamente **1 melanocito por cada 4 queratinocitos (1:4)**.\n\n**En otras zonas:** En la piel de las extremidades (brazos o piernas), la proporción cae a cerca de **1:10 o 1:12**.\n\n**El número total de melanocitos es prácticamente el mismo en todas las etnias.** Las diferencias en el color de la piel se deben a la **tasa de síntesis de melanina**, el **tamaño de los melanosomas** y la **velocidad de su degradación** dentro de los queratinocitos.',
      explanationImage: img.pielgruesaRef.url,
      explanationImageAlt: 'Corte histológico de piel gruesa mostrando todos sus estratos epidérmicos (H&E).',
      explanationImageCaption: 'Lámina de piel gruesa (estrato córneo grueso)',
      reviewNote: 'MedGO revisó esta pregunta y creemos que la respuesta no es del todo precisa porque varía mucho dependiendo de la zona, sin embargo, las demás corresponden a piel gruesa.',
      tags: ['Piel gruesa', 'Melanocitos', 'Epidermis'],
    },
    {
      id: 'c-q3',
      stem: 'Observar la microfotografía, ¿a qué corresponde la estructura señalada?',
      image: img.laminar.url,
      imageAlt: 'Estructura ovoide con múltiples capas lamelares concéntricas en "anillos de cebolla" y centro pálido, en la dermis (H&E).',
      imageW: img.laminar.w,
      imageH: img.laminar.h,
      options: [
        opt('a', 'Corpúsculo laminar.', true),
        opt('b', 'Corpúsculo de Ruffini.'),
        opt('c', 'Corpúsculo de Meissner.'),
        opt('d', 'Bulbo de Krause.'),
      ],
      explanation:
        'La imagen muestra una estructura grande con múltiples **capas lamelares concéntricas en "anillos de cebolla"** y centro pálido: la morfología inconfundible del **corpúsculo de Pacini** (nombre histológico: **corpúsculo laminar**). Se ubica en la dermis profunda e hipodermis y detecta vibraciones de alta frecuencia (~250 Hz) y presión profunda. El de Ruffini es fusiforme con colágeno interno; el de Meissner es pequeño y papilar; y el bulbo de Krause es esférico y pequeño, propio de mucosas.',
      tags: ['Corpúsculo laminar', 'Corpúsculo de Pacini', 'Vibración'],
    },
    {
      id: 'c-q4',
      stem: '¿Cuál es la función principal de la capa señalada por la flecha?',
      image: img.basal.url,
      imageAlt: 'Epidermis con la flecha señalando la capa más profunda (estrato basal), una hilera de células cilíndricas sobre la membrana basal (H&E).',
      imageW: img.basal.w,
      imageH: img.basal.h,
      options: [
        opt('a', 'Formar tonofibrillas y desmosomas abundantes que dan el aspecto "espinoso" característico.'),
        opt('b', 'Sintetizar gránulos laminares que generan la barrera lipídica impermeable de la epidermis.'),
        opt('c', 'Constituir la capa progenitora de la epidermis, con actividad mitótica activa que sostiene su renovación continua.', true),
        opt('d', 'Originar las escamas anucleadas que se descaman en la superficie cutánea.'),
      ],
      explanation:
        'La flecha señala el **estrato basal (germinativo)**, la capa más profunda de la epidermis (células cilíndricas en hilera única sobre la membrana basal). Su función principal es **constituir la capa progenitora con actividad mitótica activa** que sostiene la renovación continua de la epidermis; contiene células madre epidérmicas, melanocitos y células de Merkel. Las otras opciones describen el estrato espinoso (tonofibrillas y desmosomas), el granuloso (gránulos laminares y barrera lipídica) y el córneo (escamas anucleadas).',
      tags: ['Estrato basal', 'Epidermis', 'Mitosis'],
    },
    {
      id: 'c-q5',
      stem: 'Observa la microfotografía e identifica la estructura señalada. ¿Cuál es su función?',
      image: img.sebacea.url,
      imageAlt: 'Lóbulos de células pálidas y vacuoladas (sebocitos) adyacentes a un folículo piloso, señalados por la flecha (H&E).',
      imageW: img.sebacea.w,
      imageH: img.sebacea.h,
      options: [
        opt('a', 'Sintetizar sebo mediante secreción holocrina y liberarlo hacia el folículo piloso, lubricando e impermeabilizando la piel y el tallo piloso.', true),
        opt('b', 'Secretar una sustancia viscosa rica en proteínas, con posible función feromonal, activa solo después de la pubertad.'),
        opt('c', 'Generar nuevos queratinocitos que constituyen la matriz proliferativa del pelo.'),
        opt('d', 'Sintetizar sebo mediante secreción merocrina y liberarlo hacia el folículo piloso, lubricando e impermeabilizando la piel y el tallo piloso.'),
      ],
      explanation:
        'La flecha señala una **glándula sebácea**: lóbulos de células pálidas y vacuoladas (sebocitos repletos de lípidos) adyacentes al folículo piloso. Sintetiza **sebo mediante secreción holocrina** (la célula entera se destruye y libera su contenido) y lo vierte hacia el folículo piloso, lubricando e impermeabilizando la piel y el tallo. La opción D es incorrecta porque la secreción NO es merocrina (esa es propia de las ecrinas); la B describe glándulas apocrinas y la C, el bulbo/matriz del pelo.',
      tags: ['Glándula sebácea', 'Secreción holocrina', 'Folículo piloso'],
    },
  ],
};

// ── Validación rápida: exactamente una correcta por pregunta ──
for (const q of exam.questions) {
  const n = q.options.filter(o => o.correct).length;
  if (n !== 1) { console.error(`Pregunta ${q.id}: ${n} opciones correctas (debe ser 1)`); process.exit(1); }
}

// ── Subida del JSON al bucket privado ──
const remoteJson = 'neurologia/piel-histologia-c.json';
const body = Buffer.from(JSON.stringify(exam, null, 2), 'utf8');
const { error: upErr } = await supabase.storage.from(EXAM_BUCKET).upload(remoteJson, body, {
  contentType: 'application/json',
  upsert: true,
  cacheControl: 'no-cache',
});
if (upErr) { console.error('upload json:', upErr.message); process.exit(1); }

console.log(`\nExamen subido: ${EXAM_BUCKET}/${remoteJson} (${exam.questions.length} preguntas, ${(body.length / 1024).toFixed(1)} KB)`);
