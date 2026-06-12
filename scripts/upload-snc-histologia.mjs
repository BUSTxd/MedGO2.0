/**
 * Práctica de Histología: SNC (Sistema Nervioso Central) — Neurología.
 *
 * 1) Convierte las 5 micrografías a WEBP redimensionadas a un máximo de 1200px
 *    de ancho (la versión "completa"; next/image luego sirve la variante exacta
 *    por dispositivo) y las sube al bucket PÚBLICO "examenes-img".
 * 2) Arma el JSON del examen (5 preguntas) con las URLs públicas + las
 *    dimensiones reales de cada imagen (para evitar layout shift en el cliente).
 * 3) Sube el JSON al bucket PRIVADO "examenes" como neurologia/snc-histologia.json
 *
 * Run: node scripts/upload-snc-histologia.mjs
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
  cerebelo:    [DL + 'snc-histo1.png', 'neurologia/snc/cerebelo-capa-molecular.webp'],
  ependimo:    [DL + 'snc-histo2.png', 'neurologia/snc/ependimo-conducto-central.webp'],
  medula:      [DL + 'snc-histo3.png', 'neurologia/snc/medula-espinal-corte-transversal.webp'],
  microglia:   [DL + 'snc-histo4.png', 'neurologia/snc/microglia-origen-embrionario.webp'],
  astrocitos:  [DL + 'snc-histo5.png', 'neurologia/snc/astrocitos-pies-perivasculares.webp'],
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
  key: 'neurologia/snc-histologia',
  title: 'Práctica de Histología: SNC',
  duration_min: null,
  questions: [
    {
      id: 'snc-q1',
      stem: 'La zona señalada con la flecha corresponde a la capa:',
      image: img.cerebelo.url,
      imageAlt: 'Corteza cerebelosa con flecha señalando la capa molecular (H&E).',
      imageW: img.cerebelo.w,
      imageH: img.cerebelo.h,
      options: [
        opt('a', 'Capa de células de Purkinje'),
        opt('b', 'Capa molecular', true),
        opt('c', 'Capa granulosa'),
        opt('d', 'Sustancia blanca'),
      ],
      explanation:
        'El cerebelo presenta tres capas: **molecular** (externa, pobre en núcleos y eosinófila), **de células de Purkinje** (una sola hilera) y **granular** (interna, densamente basófila por sus pequeñas neuronas granulares). La flecha señala la capa molecular, de aspecto pálido por su escasa celularidad.',
      tags: ['Cerebelo', 'Corteza cerebelosa'],
    },
    {
      id: 'snc-q2',
      stem: 'Respecto a las células que tapizan la cavidad señalada (epéndimo), ¿qué característica es correcta?',
      image: img.ependimo.url,
      imageAlt: 'Conducto ependimario tapizado por epéndimo, con flecha (H&E).',
      imageW: img.ependimo.w,
      imageH: img.ependimo.h,
      options: [
        opt('a', 'Forman una capa estratificada'),
        opt('b', 'Ausencia de cilios en la superficie apical'),
        opt('c', 'Carecen de membrana basal', true),
        opt('d', 'Poseen queratinización superficial'),
      ],
      explanation:
        'El **epéndimo** es un epitelio simple cúbico/cilíndrico ciliado que tapiza los ventrículos y el conducto ependimario. A diferencia de los epitelios típicos, **carece de membrana basal**: sus células se apoyan directamente sobre la neuroglia. Sí poseen cilios y microvellosidades en su superficie apical, y no se queratinizan.',
      tags: ['Epéndimo', 'Neuroglia'],
    },
    {
      id: 'snc-q3',
      stem: 'El corte transversal corresponde a la médula espinal. ¿Qué característica la distingue?',
      image: img.medula.url,
      imageAlt: 'Corte transversal de médula espinal (inmunohistoquímica).',
      imageW: img.medula.w,
      imageH: img.medula.h,
      options: [
        opt('a', 'Distribución periférica de somas y dendritas'),
        opt('b', 'Fibras nerviosas centrales'),
        opt('c', 'Sustancia gris periférica'),
        opt('d', 'Sustancia gris central en forma de H', true),
      ],
      explanation:
        'En la **médula espinal** la sustancia gris se dispone **centralmente, en forma de H o mariposa** (astas anteriores y posteriores), rodeada por la sustancia blanca periférica. Esto la diferencia de la corteza cerebral y cerebelosa, donde la sustancia gris es periférica.',
      tags: ['Médula espinal', 'Sustancia gris'],
    },
    {
      id: 'snc-q4',
      stem: '¿Cuál es el origen embriológico de la célula señalada con la flecha?',
      image: img.microglia.url,
      imageAlt: 'Microglía señalada con flecha en el neuropilo (H&E).',
      imageW: img.microglia.w,
      imageH: img.microglia.h,
      options: [
        opt('a', 'Mesodermo', true),
        opt('b', 'Cresta neural'),
        opt('c', 'Endodermo'),
        opt('d', 'Neuroectodermo'),
      ],
      explanation:
        'La **microglía** es la única neuroglia que NO deriva del neuroectodermo: proviene del **mesodermo** (sistema mononuclear fagocítico, precursores de origen mieloide del saco vitelino/médula ósea). Su núcleo es pequeño, alargado y denso. El resto de la glía (astrocitos, oligodendrocitos, epéndimo) y las neuronas derivan del neuroectodermo; la glía del SNP (Schwann, satélite) deriva de la cresta neural.',
      tags: ['Microglía', 'Embriología'],
    },
    {
      id: 'snc-q5',
      stem: '¿Qué estructuras específicas de los astrocitos se observan envolviendo a los capilares continuos?',
      image: img.astrocitos.url,
      imageAlt: 'Astrocitos con pies perivasculares alrededor de un capilar (H&E).',
      imageW: img.astrocitos.w,
      imageH: img.astrocitos.h,
      options: [
        opt('a', 'Complejos de unión apicales'),
        opt('b', 'Pies perineurales'),
        opt('c', 'Pies subpiales'),
        opt('d', 'Pies perivasculares', true),
      ],
      explanation:
        'Los astrocitos emiten prolongaciones que terminan en expansiones llamadas **pies o pedicelos perivasculares**, los cuales rodean los capilares y participan en la **barrera hematoencefálica**. Los pies subpiales, en cambio, contactan la piamadre formando la membrana glial limitante, no los capilares.',
      tags: ['Astrocitos', 'Barrera hematoencefálica'],
    },
  ],
};

// ── Subida del JSON al bucket privado ──
const remoteJson = 'neurologia/snc-histologia.json';
const body = Buffer.from(JSON.stringify(exam, null, 2), 'utf8');
const { error: upErr } = await supabase.storage.from(EXAM_BUCKET).upload(remoteJson, body, {
  contentType: 'application/json',
  upsert: true,
});
if (upErr) { console.error('upload json:', upErr.message); process.exit(1); }

console.log(`\nExamen subido: ${EXAM_BUCKET}/${remoteJson} (${exam.questions.length} preguntas, ${(body.length / 1024).toFixed(1)} KB)`);
