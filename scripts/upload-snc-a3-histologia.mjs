/**
 * Práctica de Histología: SNC — Paso corto del GRUPO A3 (Neurología).
 *
 * Es el "Grupo B" del examen SNC (ph01): 9 preguntas con micrografía, tomadas
 * del post test de Histología (grupo A3) en Blackboard.
 *
 * 1) Re-encoda las 9 micrografías (.webp recortadas) a WEBP q82, máx 1200px de
 *    ancho, y las sube al bucket PÚBLICO "examenes-img" bajo neurologia/snc-a3/.
 * 2) Arma el JSON (9 preguntas) con las URLs públicas + dimensiones reales.
 * 3) Sube el JSON al bucket PRIVADO "examenes" como
 *    neurologia/snc-histologia-a3.json
 *
 * Run: node scripts/upload-snc-a3-histologia.mjs
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
  plexoPan:    [DL + 'snc-histogrupoA3.webp',    'neurologia/snc-a3/plexo-coroideo-panoramica.webp'],
  medula:      [DL + 'snc-histogrupoA3-2.webp',  'neurologia/snc-a3/medula-fisura-media-anterior.webp'],
  neuronas:    [DL + 'snc-histogrupoA3-3.webp',  'neurologia/snc-a3/neuronas-corticales-flechas.webp'],
  purkinje:    [DL + 'snc-histogrupoA3-34.webp', 'neurologia/snc-a3/celula-purkinje-cerebelo.webp'],
  plexoCap:    [DL + 'snc-histogrupoA3-5.webp',  'neurologia/snc-a3/plexo-coroideo-capilar.webp'],
  neurona:     [DL + 'snc-histogrupoA3-6.webp',  'neurologia/snc-a3/neurona-cortical-multipolar.webp'],
  mielina:     [DL + 'snc-histogrupoA3-7.webp',  'neurologia/snc-a3/sustancia-blanca-mielina.webp'],
  conducto:    [DL + 'snc-histogrupoA3-8.webp',  'neurologia/snc-a3/conducto-central-ependimo.webp'],
  granular:    [DL + 'snc-histogrupoA3-9.webp',  'neurologia/snc-a3/cerebelo-capa-granular.webp'],
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

// ── Construcción del examen (9 preguntas) ──
const opt = (id, text, correct = false) => ({ id, text, correct });

const exam = {
  version: 1,
  key: 'neurologia/snc-histologia-a3',
  title: 'Histología SNC — Paso corto (Grupo A3)',
  duration_min: null,
  questions: [
    {
      id: 'a3-q1',
      stem: 'Con respecto a la estructura señalada en la micrografía, marque la alternativa INCORRECTA:',
      image: img.plexoPan.url,
      imageAlt: 'Plexo coroideo en visión panorámica (H&E).',
      imageW: img.plexoPan.w,
      imageH: img.plexoPan.h,
      options: [
        opt('a', 'Se localiza en el techo del tercer y cuarto ventrículo y en las paredes de los ventrículos laterales.'),
        opt('b', 'Está formado por un eje de piamadre vascularizada cubierto por epéndimo cúbico modificado con microvellosidades apicales.'),
        opt('c', 'Sus capilares no son fenestrados y constituyen la barrera hematoencefálica.', true),
      ],
      explanation:
        'La estructura es el **plexo coroideo**. La alternativa INCORRECTA es la C: sus capilares **sí son fenestrados**, lo que permite la filtración de plasma para formar el LCR. La barrera que aquí existe es la **barrera sangre-LCR**, formada por las uniones estrechas del **epéndimo cúbico modificado**, no por los capilares ni por la barrera hematoencefálica. Las otras dos opciones describen correctamente su ubicación y estructura.',
      tags: ['Plexo coroideo', 'LCR', 'Barrera sangre-LCR'],
    },
    {
      id: 'a3-q2',
      stem: 'Con respecto a la estructura/espacio que se observa inmediatamente por fuera de la fisura media anterior, ¿cuál es su rol fisiológico principal?',
      image: img.medula.url,
      imageAlt: 'Médula espinal: fisura media anterior y espacio subaracnoideo (tricrómico).',
      imageW: img.medula.w,
      imageH: img.medula.h,
      options: [
        opt('a', 'Formar la barrera hematoencefálica.'),
        opt('b', 'Contener y permitir la circulación del líquido cefalorraquídeo (LCR) a lo largo de la médula espinal.', true),
        opt('c', 'El aporte de iones para la actividad neuronal.'),
      ],
      explanation:
        'Por fuera de la **fisura media anterior** se encuentra el **espacio subaracnoideo**, ocupado por el **líquido cefalorraquídeo (LCR)**. Su rol fisiológico principal es **contener y permitir la circulación del LCR** a lo largo de la médula espinal, brindando protección hidráulica y amortiguación. No forma la barrera hematoencefálica ni es la fuente de iones para la actividad neuronal.',
      tags: ['Médula espinal', 'Espacio subaracnoideo', 'LCR'],
    },
    {
      id: 'a3-q3',
      stem: '¿Cuál es la función principal de estas células señaladas con las flechas?',
      image: img.neuronas.url,
      imageAlt: 'Neuronas grandes señaladas con flechas amarillas (H&E).',
      imageW: img.neuronas.w,
      imageH: img.neuronas.h,
      options: [
        opt('a', 'Coordinar la actividad muscular del cuerpo desde la corteza del cerebelo.', true),
        opt('b', 'Regular el microambiente iónico de las sinapsis y amortiguar el K⁺ extracelular.'),
        opt('c', 'Producir la mielina que recubre los axones de la sustancia blanca cerebral.'),
      ],
      explanation:
        'Las células señaladas son **neuronas de proyección grandes de la corteza cerebelosa**, cuya función principal es **coordinar la actividad muscular del cuerpo** integrando la información que llega a los circuitos cerebelosos. La opción B describe la función de los **astrocitos** (amortiguación del K⁺), y la C la de los **oligodendrocitos** (mielinización): ambas son células gliales, no neuronas.',
      tags: ['Cerebelo', 'Neurona', 'Función motora'],
    },
    {
      id: 'a3-q4',
      stem: '¿Qué característica morfológica y de localización define a la célula señalada por la flecha amarilla en este corte?',
      image: img.purkinje.url,
      imageAlt: 'Célula de Purkinje señalada con flecha amarilla en la corteza cerebelosa (H&E).',
      imageW: img.purkinje.w,
      imageH: img.purkinje.h,
      options: [
        opt('a', 'Sus dendritas se ramifican ampliamente en la capa granular.'),
        opt('b', 'Es una neurona muy grande, ubicada en una capa media única de la corteza cerebelosa.', true),
        opt('c', 'Es una célula de la neuroglía encargada de producir la mielina del cerebelo.'),
      ],
      explanation:
        'Es la **célula de Purkinje**: una **neurona muy grande** dispuesta en una **única hilera (capa media)** de la corteza cerebelosa, entre la capa molecular y la granular. Sus dendritas se ramifican profusamente hacia la **capa molecular** (no la granular), por lo que la opción A es falsa. Es una neurona, no glía, así que tampoco produce mielina.',
      tags: ['Cerebelo', 'Célula de Purkinje'],
    },
    {
      id: 'a3-q5',
      stem: 'La estructura señalada cumple una función muy importante en la formación del líquido cefalorraquídeo. ¿Qué la caracteriza?',
      image: img.plexoCap.url,
      imageAlt: 'Capilar fenestrado del plexo coroideo señalado con flecha verde (H&E).',
      imageW: img.plexoCap.w,
      imageH: img.plexoCap.h,
      options: [
        opt('a', 'Pertenece a la médula espinal'),
        opt('b', 'Forma parte de las paquimeninges'),
        opt('c', 'Es un capilar fenestrado rodeado por tejido laxo', true),
        opt('d', 'Se le conoce como piamadre'),
      ],
      explanation:
        'La flecha señala un **capilar fenestrado** del eje conjuntivo del **plexo coroideo**, rodeado por **tejido conectivo laxo** (leptomeninge/piamadre vascularizada). Las fenestraciones permiten la filtración del plasma que, tras ser modificado por el epéndimo coroideo, origina el **LCR**. No pertenece a la médula espinal ni a las paquimeninges (duramadre), y no es la piamadre en sí misma.',
      tags: ['Plexo coroideo', 'Capilar fenestrado', 'LCR'],
    },
    {
      id: 'a3-q6',
      stem: 'Su morfología refleja alta actividad sintética necesaria para mantener prolongaciones largas y múltiples contactos sinápticos. La célula señalada corresponde a:',
      image: img.neurona.url,
      imageAlt: 'Neurona cortical multipolar señalada con flecha verde (H&E).',
      imageW: img.neurona.w,
      imageH: img.neurona.h,
      options: [
        opt('a', 'Oligodendrocito interfascicular'),
        opt('b', 'Astrocito fibroso de sustancia blanca'),
        opt('c', 'Neurona cortical multipolar', true),
      ],
      explanation:
        'La célula presenta un **soma grande**, núcleo eucromático con nucléolo prominente y abundante **sustancia de Nissl** (RER), signos de **alta actividad sintética** necesaria para sostener axones y dendritas largos con numerosos contactos sinápticos: es una **neurona cortical multipolar**. Los oligodendrocitos y astrocitos son células gliales, de menor tamaño y sin esta riqueza de Nissl.',
      tags: ['Neurona', 'Corteza cerebral', 'Sustancia de Nissl'],
    },
    {
      id: 'a3-q7',
      stem: '¿Qué estructura explica mejor el aspecto claro predominante en esta preparación histológica?',
      image: img.mielina.url,
      imageAlt: 'Sustancia blanca con espacios claros vacuolados (tinción para mielina).',
      imageW: img.mielina.w,
      imageH: img.mielina.h,
      options: [
        opt('a', 'Vainas de mielina extraídas durante el procesamiento tisular', true),
        opt('b', 'Cuerpos neuronales multipolares con abundante sustancia de Nissl'),
        opt('c', 'Células ependimarias que rodean el canal central'),
        opt('d', 'Dendritas ramificadas inmersas en abundante neurópilo'),
      ],
      explanation:
        'El predominio de espacios **claros y vacuolados** corresponde a las **vainas de mielina**, cuyo contenido lipídico se **disuelve durante el procesamiento histológico** rutinario, dejando los halos vacíos alrededor de los axones. Es el aspecto típico de la **sustancia blanca**. No corresponde a somas neuronales, epéndimo ni neurópilo dendrítico.',
      tags: ['Sustancia blanca', 'Mielina', 'Artefacto de procesamiento'],
    },
    {
      id: 'a3-q8',
      stem: 'La estructura señalada es importante porque deriva de la luz del tubo neural embrionario. Corresponde a:',
      image: img.conducto.url,
      imageAlt: 'Conducto central de la médula espinal señalado con flecha roja (tinción azul).',
      imageW: img.conducto.w,
      imageH: img.conducto.h,
      options: [
        opt('a', 'Seno venoso dural'),
        opt('b', 'Vaso sanguíneo de la piamadre'),
        opt('c', 'Conducto central revestido por ependimocitos', true),
        opt('d', 'Espacio subaracnoideo'),
      ],
      explanation:
        'La luz del **tubo neural** embrionario persiste como el **conducto central** de la médula espinal (y, en el encéfalo, como el sistema ventricular). Está **revestido por ependimocitos** (epéndimo). No es un seno venoso dural, un vaso de la piamadre ni el espacio subaracnoideo.',
      tags: ['Conducto central', 'Epéndimo', 'Tubo neural'],
    },
    {
      id: 'a3-q9',
      stem: 'Su organización permite una alta convergencia de señales hacia circuitos cerebelosos. La estructura señalada es:',
      image: img.granular.url,
      imageAlt: 'Capa granulosa de la corteza cerebelosa señalada con flecha verde (H&E).',
      imageW: img.granular.w,
      imageH: img.granular.h,
      options: [
        opt('a', 'Capa piramidal de la corteza cerebral'),
        opt('b', 'Capa granulosa cerebelosa', true),
        opt('c', 'Capa molecular cerebelosa'),
        opt('d', 'Sustancia gris del asta posterior'),
      ],
      explanation:
        'La densa población de pequeñas **células granulares** corresponde a la **capa granulosa cerebelosa**. Su enorme número de neuronas y la disposición de las fibras paralelas permiten una **alta convergencia y divergencia de señales** hacia los circuitos cerebelosos. La capa molecular es pálida y poco celular, y la corteza cerebral o el asta posterior tienen otra organización.',
      tags: ['Cerebelo', 'Capa granulosa'],
    },
  ],
};

// ── Validación rápida: exactamente una correcta por pregunta ──
for (const q of exam.questions) {
  const n = q.options.filter(o => o.correct).length;
  if (n !== 1) { console.error(`Pregunta ${q.id}: ${n} opciones correctas (debe ser 1)`); process.exit(1); }
}

// ── Subida del JSON al bucket privado ──
const remoteJson = 'neurologia/snc-histologia-a3.json';
const body = Buffer.from(JSON.stringify(exam, null, 2), 'utf8');
const { error: upErr } = await supabase.storage.from(EXAM_BUCKET).upload(remoteJson, body, {
  contentType: 'application/json',
  upsert: true,
});
if (upErr) { console.error('upload json:', upErr.message); process.exit(1); }

console.log(`\nExamen subido: ${EXAM_BUCKET}/${remoteJson} (${exam.questions.length} preguntas, ${(body.length / 1024).toFixed(1)} KB)`);
