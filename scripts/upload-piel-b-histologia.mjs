/**
 * Práctica de Histología: Piel — Paso corto del GRUPO B (Neurología).
 *
 * Es el 4º cuadradito ("D") del selector del examen Piel (ph03): 5 preguntas
 * (4 con micrografía + 1 solo texto), tomadas del Post test del Grupo B
 * (Blackboard UPCH).
 *
 * 1) Re-encoda las 4 micrografías (.jpeg con la flecha/marca ya puesta) a WEBP
 *    q82, máx 1200px de ancho, y las sube al bucket PÚBLICO "examenes-img" bajo
 *    neurologia/piel-b/.
 * 2) Arma el JSON (5 preguntas) con las URLs públicas + dimensiones reales.
 *    La pregunta 5 no lleva imagen (es conceptual).
 * 3) Sube el JSON al bucket PRIVADO "examenes" como
 *    neurologia/piel-histologia-b.json
 *
 * Run: node scripts/upload-piel-b-histologia.mjs
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
  pacini:  [DL + 'histopielV4-1.jpeg', 'neurologia/piel-b/corpusculo-pacini.webp'],
  papila:  [DL + 'histopielV4-2.jpeg', 'neurologia/piel-b/papila-dermica-foliculo-piloso.webp'],
  sebacea: [DL + 'histopielV4-3.jpeg', 'neurologia/piel-b/glandula-sebacea.webp'],
  melano:  [DL + 'histopielV4-4.jpeg', 'neurologia/piel-b/melanocitos-biopsia.webp'],
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
  key: 'neurologia/piel-histologia-b',
  title: 'Histología de la Piel — Paso corto (Grupo B)',
  duration_min: null,
  questions: [
    {
      id: 'b-q1',
      stem: 'Si en una persona se altera la función de la estructura que se muestra, ubicada en dermis profunda, entonces presentará:',
      image: img.pacini.url,
      imageAlt: 'Estructura ovoide con capas lamelares concéntricas en "anillos de cebolla" en la dermis profunda, señalada por la flecha verde (H&E).',
      imageW: img.pacini.w,
      imageH: img.pacini.h,
      options: [
        opt('a', 'Infecciones a repetición.'),
        opt('b', 'Pérdida selectiva para percibir vibraciones de alta frecuencia.', true),
        opt('c', 'Despigmentación de la piel.'),
        opt('d', 'Pérdida selectiva del tacto fino.'),
      ],
      explanation:
        'La flecha señala un **corpúsculo de Pacini (laminar)**, mecanorreceptor de la dermis profunda con sus características capas concéntricas en "anillos de cebolla". Está especializado en detectar **vibraciones de alta frecuencia (≈200–300 Hz)** y presión profunda; si se altera, el paciente presenta **pérdida selectiva de la percepción de vibraciones de alta frecuencia**. El tacto fino depende de los corpúsculos de Meissner, la pigmentación de los melanocitos y la defensa frente a infecciones de las células de Langerhans.',
      tags: ['Corpúsculo de Pacini', 'Vibración', 'Dermis profunda'],
    },
    {
      id: 'b-q2',
      stem: '¿Cuál es la función principal de la estructura señalada por las flechas?',
      image: img.papila.url,
      imageAlt: 'Corte longitudinal de dos bulbos pilosos, con las flechas señalando la papila dérmica en la base de cada folículo (tricrómico).',
      imageW: img.papila.w,
      imageH: img.papila.h,
      options: [
        opt('a', 'Propiocepción.'),
        opt('b', 'Producción de queratina.'),
        opt('c', 'Nutrición de la matriz pilosa.', true),
        opt('d', 'Producción de melanina.'),
      ],
      explanation:
        'Las flechas señalan la **papila dérmica del folículo piloso**, en la base del bulbo. Es tejido conectivo con vasos sanguíneos que se invagina en el bulbo y se encarga de la **nutrición de la matriz pilosa** (las células que proliferan para formar el pelo). La queratina y la melanina las producen, respectivamente, las células de la matriz y los melanocitos del bulbo; la propiocepción no es función folicular.',
      tags: ['Papila dérmica', 'Folículo piloso', 'Matriz pilosa'],
    },
    {
      id: 'b-q3',
      stem: '¿Qué estructura es la señalada y cuál es su mecanismo de secreción?',
      image: img.sebacea.url,
      imageAlt: 'Lóbulos de células pálidas y vacuoladas (sebocitos) asociados a un folículo piloso, delimitados por la llave verde (H&E).',
      imageW: img.sebacea.w,
      imageH: img.sebacea.h,
      options: [
        opt('a', 'Glándula sudorípara - secreción apocrina.'),
        opt('b', 'Glándula sudorípara - secreción holocrina.'),
        opt('c', 'Glándula sebácea - secreción holocrina.', true),
        opt('d', 'Glándula sebácea - secreción ecrina.'),
      ],
      explanation:
        'La llave señala una **glándula sebácea**: lóbulos de sebocitos pálidos y vacuolados (repletos de lípidos) junto al folículo piloso. Su mecanismo es la **secreción holocrina**, en la que la célula entera se destruye para liberar el sebo: es el **único tipo de secreción holocrina de la piel**. Las glándulas sudoríparas usan secreción merocrina (ecrina) o apocrina, no holocrina.',
      tags: ['Glándula sebácea', 'Secreción holocrina'],
    },
    {
      id: 'b-q4',
      stem: 'En la siguiente imagen de una biopsia cutánea, las células señaladas corresponden a:',
      image: img.melano.url,
      imageAlt: 'Epidermis con células claras de halo perinuclear en la capa basal, señaladas por líneas verdes (H&E).',
      imageW: img.melano.w,
      imageH: img.melano.h,
      options: [
        opt('a', 'Células anucleadas.'),
        opt('b', 'Queratinocitos.'),
        opt('c', 'Células de Langerhans.'),
        opt('d', 'Melanocitos.', true),
      ],
      explanation:
        'Las líneas señalan **melanocitos**: células claras con un característico **halo perinuclear**, ubicadas en la **capa basal** de la epidermis, productoras de melanina. Las células anucleadas corresponden al estrato córneo, los queratinocitos son el tipo celular mayoritario (sin halo claro) y las células de Langerhans son las presentadoras de antígeno, no las de halo basal.',
      tags: ['Melanocitos', 'Capa basal', 'Melanina'],
    },
    {
      id: 'b-q5',
      stem: 'Son centinelas inmunológicos, encargadas de activar a los linfocitos ante una ruptura de la epidermis:',
      options: [
        opt('a', 'Células del corpúsculo de Pacini.'),
        opt('b', 'Queratinocitos.'),
        opt('c', 'Células de Langerhans.', true),
        opt('d', 'Células de Merkel.'),
      ],
      explanation:
        'Las **células de Langerhans** son las células presentadoras de antígeno de la epidermis: actúan como **centinelas inmunológicos** que captan antígenos y **activan a los linfocitos T** ante una ruptura de la barrera epidérmica. Los queratinocitos forman la barrera, las células de Merkel son mecanorreceptores y el corpúsculo de Pacini detecta vibraciones.',
      tags: ['Células de Langerhans', 'Inmunidad', 'Epidermis'],
    },
  ],
};

// ── Validación rápida: exactamente una correcta por pregunta ──
for (const q of exam.questions) {
  const n = q.options.filter(o => o.correct).length;
  if (n !== 1) { console.error(`Pregunta ${q.id}: ${n} opciones correctas (debe ser 1)`); process.exit(1); }
}

// ── Subida del JSON al bucket privado ──
const remoteJson = 'neurologia/piel-histologia-b.json';
const body = Buffer.from(JSON.stringify(exam, null, 2), 'utf8');
const { error: upErr } = await supabase.storage.from(EXAM_BUCKET).upload(remoteJson, body, {
  contentType: 'application/json',
  upsert: true,
  cacheControl: 'no-cache',
});
if (upErr) { console.error('upload json:', upErr.message); process.exit(1); }

console.log(`\nExamen subido: ${EXAM_BUCKET}/${remoteJson} (${exam.questions.length} preguntas, ${(body.length / 1024).toFixed(1)} KB)`);
