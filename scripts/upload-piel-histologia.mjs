/**
 * Práctica de Histología: Piel — Paso corto del GRUPO A2 (Neurología).
 *
 * Es el examen de la actividad ph03 (Práctica de Histología: Piel): 5 preguntas
 * con micrografía, tomadas del cuestionario de Histología de Piel en Blackboard.
 *
 * 1) Sube las 5 micrografías .avif TAL CUAL (sin re-encodear; el AVIF ya está
 *    mejor comprimido que WEBP) al bucket PÚBLICO "examenes-img" bajo
 *    neurologia/piel/, leyendo sus dimensiones con sharp solo para los metadatos.
 * 2) Arma el JSON (5 preguntas) con las URLs públicas + dimensiones reales.
 * 3) Sube el JSON al bucket PRIVADO "examenes" como neurologia/piel-histologia.json
 *
 * Run: node scripts/upload-piel-histologia.mjs
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

// id lógico → [archivo local, ruta remota .avif]
const IMAGES = {
  sebacea:      [DL + 'histopiel1.avif', 'neurologia/piel/glandula-sebacea-secrecion.avif'],
  basal:        [DL + 'histopiel3.avif', 'neurologia/piel/capa-basal-melanocitos.avif'],
  meissner:     [DL + 'histopiel4.avif', 'neurologia/piel/corpusculo-meissner-papila.avif'],
  ecrinas:      [DL + 'histopiel5.avif', 'neurologia/piel/glandulas-ecrinas-dermis-profunda.avif'],
  queratinocito:[DL + 'histopiel2.avif', 'neurologia/piel/epidermis-queratinocitos.avif'],
};

// .webp viejos (subida anterior) a borrar tras reemplazar por .avif
const OLD_WEBP = Object.values(IMAGES).map(([, r]) => r.replace(/\.avif$/, '.webp'));

// El bucket existe con un whitelist de MIME types que no incluía image/avif.
// Lo ampliamos para aceptar AVIF (no-op si ya estaba permitido).
{
  const { error } = await supabase.storage.updateBucket(IMG_BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/avif'],
  });
  if (error) console.error(`updateBucket: ${error.message}`);
  else console.log(`Bucket "${IMG_BUCKET}" actualizado (admite image/avif).`);
}

// ── Subida de imágenes AVIF tal cual (solo se leen dims con sharp) ──
async function uploadImage(local, remote) {
  const buf = readFileSync(local);
  const meta = await sharp(buf).metadata();
  const { error } = await supabase.storage.from(IMG_BUCKET).upload(remote, buf, {
    contentType: 'image/avif',
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
  key: 'neurologia/piel-histologia',
  title: 'Histología de la Piel — Paso corto (Grupo A2)',
  duration_min: null,
  questions: [
    {
      id: 'q1',
      stem: 'En la imagen señalada, ¿cuál es el tipo de secreción y su función?',
      image: img.sebacea.url,
      imageAlt: 'Glándula sebácea asociada a folículo piloso, con la flecha señalando sus sebocitos (H&E).',
      imageW: img.sebacea.w,
      imageH: img.sebacea.h,
      options: [
        opt('a', 'Secreción endocrina; los lípidos sintetizados difunden directamente hacia los capilares sanguíneos de la dermis circundante.'),
        opt('b', 'Secreción holocrina; las células acumulan lípidos en su citoplasma, programan su apoptosis y se desintegran por completo para convertirse en la secreción.', true),
        opt('c', 'Secreción apocrina; una porción del citoplasma apical de la célula se desprende junto con las gotas de lípidos.'),
        opt('d', 'Secreción merocrina; las células liberan lípidos mediante exocitosis sin sufrir daño celular.'),
      ],
      explanation:
        'La flecha señala una **glándula sebácea**, cuyos sebocitos se cargan de lípidos (citoplasma claro y vacuolado), entran en apoptosis y se desintegran por completo: la propia célula muerta *es* la secreción (sebo). Ese mecanismo es la **secreción holocrina**. En la merocrina (ecrina) se libera por exocitosis sin daño celular; en la apocrina se desprende solo el ápice citoplasmático; y no existe una vía endocrina hacia los capilares para el sebo.',
      tags: ['Glándula sebácea', 'Secreción holocrina'],
    },
    {
      id: 'q2',
      stem: 'Las células localizadas en la capa basal de la epidermis tienen como función principal:',
      image: img.basal.url,
      imageAlt: 'Capa basal de la epidermis con melanocitos cargados de pigmento pardo (melanina) (H&E).',
      imageW: img.basal.w,
      imageH: img.basal.h,
      options: [
        opt('a', 'Sintetizar queratina para formar la barrera epidérmica.'),
        opt('b', 'Sintetizar melanina para proteger el ADN de la radiación ultravioleta.', true),
        opt('c', 'Producir colágeno tipo I para sostén dérmico.'),
        opt('d', 'Presentar antígenos a los linfocitos T.'),
      ],
      explanation:
        'En la capa basal, entre los queratinocitos, se ubican los **melanocitos**: células dendríticas que sintetizan **melanina** (el pigmento pardo visible en la imagen). La melanina se transfiere a los queratinocitos vecinos y se dispone como un capuchón sobre su núcleo para **proteger el ADN de la radiación ultravioleta**. El colágeno tipo I lo producen los fibroblastos de la dermis y la presentación de antígenos corresponde a las células de Langerhans.',
      tags: ['Capa basal', 'Melanocitos', 'Melanina'],
    },
    {
      id: 'q3',
      stem: 'En la imagen señalada, ¿qué estructura es?',
      image: img.meissner.url,
      imageAlt: 'Corpúsculo de Meissner en una papila dérmica, justo por debajo de la epidermis (H&E).',
      imageW: img.meissner.w,
      imageH: img.meissner.h,
      options: [
        opt('a', 'Corpúsculos de Meissner', true),
        opt('b', 'Corpúsculos de Pacini'),
        opt('c', 'Célula de Merkel'),
        opt('d', 'Corpúsculo de Ruffini'),
      ],
      explanation:
        'La flecha apunta a un **corpúsculo de Meissner**: receptor del tacto fino ubicado en las **papilas dérmicas**, justo debajo de la epidermis, con sus células laminares apiladas transversalmente. Los corpúsculos de Pacini y de Ruffini se localizan en la dermis profunda/hipodermis (Pacini con su aspecto laminar "en cebolla"), y la célula de Merkel es una célula epidérmica de la capa basal, no un corpúsculo en la papila.',
      tags: ['Corpúsculo de Meissner', 'Tacto', 'Papila dérmica'],
    },
    {
      id: 'q4',
      stem: 'Según la imagen histológica, observe las estructuras localizadas en la dermis profunda. ¿Cuál de las siguientes afirmaciones relaciona correctamente la estructura observada con su función fisiológica principal?',
      image: img.ecrinas.url,
      imageAlt: 'Ovillos de glándulas sudoríparas ecrinas en la dermis profunda (H&E).',
      imageW: img.ecrinas.w,
      imageH: img.ecrinas.h,
      options: [
        opt('a', 'Corresponden a glándulas mucosas cuya secreción protege la epidermis de la radiación ultravioleta.'),
        opt('b', 'Corresponden a glándulas sebáceas cuya secreción holocrina participa en la lubricación de la piel.'),
        opt('c', 'Corresponden a glándulas sudoríparas ecrinas que producen una secreción acuosa importante para la termorregulación corporal.', true),
        opt('d', 'Corresponden a glándulas apocrinas que desembocan directamente en la superficie epidérmica y regulan la temperatura corporal.'),
      ],
      explanation:
        'Los ovillos tubulares en la **dermis profunda**, formados por un epitelio cúbico/cilíndrico simple, corresponden a **glándulas sudoríparas ecrinas**. Producen una secreción **acuosa (sudor)** por mecanismo merocrino que, al evaporarse en la superficie, es clave para la **termorregulación**. Las sebáceas son holocrinas y se asocian al folículo piloso; las apocrinas desembocan en el folículo (no directamente en la superficie) y se ubican en regiones específicas.',
      tags: ['Glándula sudorípara ecrina', 'Termorregulación', 'Dermis profunda'],
    },
    {
      id: 'q5',
      stem: 'Las células señaladas constituyen el tipo celular más abundante de la epidermis. ¿Cuál es su función principal?',
      image: img.queratinocito.url,
      imageAlt: 'Epidermis con sus queratinocitos, el tipo celular más abundante (H&E).',
      imageW: img.queratinocito.w,
      imageH: img.queratinocito.h,
      options: [
        opt('a', 'Producción de melanina para protección UV'),
        opt('b', 'Presentación de antígenos a linfocitos T'),
        opt('c', 'Formación de una barrera resistente a la abrasión mecánica', true),
        opt('d', 'Producción de neurotransmisores táctiles'),
      ],
      explanation:
        'El tipo celular más abundante de la epidermis es el **queratinocito**. Al ascender desde la capa basal se llena de queratina y forma uniones intercelulares (desmosomas), constituyendo una **barrera resistente a la abrasión mecánica** (y a la deshidratación). La producción de melanina corresponde a los melanocitos, la presentación de antígenos a las células de Langerhans y la mecanorrecepción táctil a las células de Merkel.',
      tags: ['Queratinocito', 'Barrera epidérmica'],
    },
  ],
};

// ── Validación rápida: exactamente una correcta por pregunta ──
for (const q of exam.questions) {
  const n = q.options.filter(o => o.correct).length;
  if (n !== 1) { console.error(`Pregunta ${q.id}: ${n} opciones correctas (debe ser 1)`); process.exit(1); }
}

// ── Subida del JSON al bucket privado ──
const remoteJson = 'neurologia/piel-histologia.json';
const body = Buffer.from(JSON.stringify(exam, null, 2), 'utf8');
const { error: upErr } = await supabase.storage.from(EXAM_BUCKET).upload(remoteJson, body, {
  contentType: 'application/json',
  upsert: true,
});
if (upErr) { console.error('upload json:', upErr.message); process.exit(1); }

console.log(`\nExamen subido: ${EXAM_BUCKET}/${remoteJson} (${exam.questions.length} preguntas, ${(body.length / 1024).toFixed(1)} KB)`);

// ── Limpieza de los .webp de la subida anterior ──
const { data: removed, error: rmErr } = await supabase.storage.from(IMG_BUCKET).remove(OLD_WEBP);
if (rmErr) console.error('remove .webp:', rmErr.message);
else console.log(`Borrados ${removed?.length ?? 0} .webp viejos.`);
