// Banco de preguntas de la EVA 3 (anatomía — identificación de estructuras).
//
// Mismo formato y motor que la EVA 2 (ver src/components/AnatExam.tsx). Cada
// pregunta tiene dos partes encadenadas:
//   • Pregunta A → nombrar la estructura señalada. Debe responderse correctamente
//     para desbloquear la Pregunta B (regla del examen).
//   • Pregunta B → detalle clínico/funcional. Se evalúa por "conceptos clave":
//     cada concepto se da por acertado si la respuesta incluye alguno de sus
//     sinónimos (comparación normalizada sin tildes ni puntuación).

import type { Question } from '@/components/AnatExam';
export type { Concept, Question } from '@/components/AnatExam';

export const QUESTIONS: Question[] = [
  {
    id: 'surco-posterolateral',
    region: 'Tronco encefálico · Bulbo raquídeo',
    image: 'https://dabrwqwzvvnosdnmvlrp.supabase.co/storage/v1/object/public/examenes-img/neurologia/eva3/surco-retroolivar.avif',
    imageCitation: 'Neurosurgery Vajira. (s.f.). 002 Surgical anatomy of the brain [Presentación de diapositivas]. SlideShare. https://es.slideshare.net/slideshow/002-surgical-anatomy-of-the-brain/66958641',
    promptA: 'Nombre de la estructura señalada',
    answerA: {
      label: 'Surco posterolateral (retroolivar)',
      accept: ['surco posterolateral', 'retroolivar', 'retro olivar', 'posterolateral', 'surco retroolivar', 'surco retro olivar'],
    },
    promptB: 'Indique las estructuras que allí se originan',
    conceptsB: [
      {
        label: 'IX par craneal (glosofaríngeo)',
        accept: [
          'ix', '9 par', 'noveno par', 'ix par', 'par ix', 'par 9',
          'glosofaringeo', 'glosofaring', 'nervio 9', 'nervio ix', 'glossofaringeo',
        ],
      },
      {
        label: 'X par craneal (vago)',
        accept: [
          'x par', 'par x', '10 par', 'par 10', 'decimo par',
          'vago', 'neumogastrico', 'nervio vago', 'nervio 10', 'nervio x', 'x',
        ],
      },
      {
        label: 'XI par craneal (accesorio espinal)',
        accept: [
          'xi', 'xi par', 'par xi', '11 par', 'par 11', 'undecimo par',
          'accesorio', 'espinal', 'accesorio espinal', 'nervio 11', 'nervio xi',
          'nervio accesorio', 'espinal accesorio',
        ],
      },
    ],
    modelB: 'Del surco posterolateral emergen las raíces del IX (glosofaríngeo), X (vago) y XI (accesorio espinal) par craneal.',
  },
  {
    id: 'lobulillo-paracentral',
    region: 'Corteza cerebral · Lóbulo parietal',
    image: 'https://dabrwqwzvvnosdnmvlrp.supabase.co/storage/v1/object/public/examenes-img/neurologia/eva3/lobulillo-paracentral.avif',
    imageOverlay: 'https://dabrwqwzvvnosdnmvlrp.supabase.co/storage/v1/object/public/examenes-img/neurologia/eva3/lobulillo-paracentral-flechas.webp',
    imageDarkBg: true,
    imageCaption: 'Lóbulo paracentral (PCL): tipo continuo (las circunvoluciones precentral y postcentral son continuas o no están completamente separadas por surcos), presente en el 95,2% de los casos; CA: comisura anterior; CP: comisura posterior; SCe: surco central, parte medial; SPc: surco precentral; SCi: surco cingulado subfrontal; SCi: surco cingulado marginal. Hemisferio izquierdo. Orientación: A: anterior; P: posterior; S: superior; I: inferior.',
    imageCitation: 'Vásquez, X., & Zapata, M. (s.f.). Paracentral lobule (PCL) — continuous type [Figura 2]. ResearchGate. https://www.researchgate.net/figure/Paracentral-lobule-PCL-continuous-type-precentral-and-postcentral-gyri-are-continuous_fig2_237084946',
    promptA: 'Nombre de la estructura señalada',
    answerA: {
      label: 'Lobulillo paracentral',
      accept: ['lobulillo paracentral', 'lobulo paracentral', 'paracentral'],
    },
    promptB: 'Indique las áreas corticales que allí se encuentran',
    conceptsB: [
      {
        label: 'Área 4 (corteza motora primaria)',
        accept: [
          'area 4', '4', 'motora primaria', 'corteza motora', 'area motora primaria',
          'motor primaria', 'corteza motora primaria',
        ],
      },
      {
        label: 'Áreas 3, 1 y 2 (corteza somatosensorial primaria)',
        accept: [
          'area 3', 'area 1', 'area 2', '3 1 2', '3, 1 y 2', '3 y 1', '1 y 2',
          'somatosensorial', 'somatosensitiva', 'corteza sensitiva', 'sensitiva primaria',
          'areas 3 1 2', 'areas 3,1,2',
        ],
      },
    ],
    modelB: 'En el lobulillo paracentral se ubican el área 4 (corteza motora primaria) y las áreas 3, 1 y 2 (corteza somatosensorial primaria).',
  },
  {
    id: 'culmen',
    region: 'Cerebelo · Vermis',
    image: 'https://dabrwqwzvvnosdnmvlrp.supabase.co/storage/v1/object/public/examenes-img/neurologia/eva3/culmen.avif',
    imageCitation: 'Baran, O., Baydin, S., Mirkhasilova, M., Bayramli, N., Bilgin, B., Middlebrooks, E., Ozlen, F., & Tanriover, N. (2022). Microsurgical anatomy and surgical exposure of the cerebellar peduncles [Figura 1]. Neurosurgical Review, 45(3), 2095–2117. https://doi.org/10.1007/s10143-021-01701-3',
    promptA: 'Nombre de la estructura señalada',
    answerA: {
      label: 'Culmen',
      accept: ['culmen'],
    },
    promptB: 'Indique la subdivisión filogenética y funcional a la que pertenece',
    conceptsB: [
      {
        label: 'Paleocerebelo (filogenético)',
        accept: [
          'paleocerebelo', 'paleo cerebelo', 'paleocerebellum',
        ],
      },
      {
        label: 'Cerebeloespinal / espinocerebelo (funcional)',
        accept: [
          'cerebeloespinal', 'cerebelo espinal', 'espinocerebelo',
          'espino cerebeloso', 'espinocerebeloso', 'espinal',
        ],
      },
    ],
    modelB: 'El culmen pertenece filogenéticamente al paleocerebelo y funcionalmente al cerebeloespinal (espinocerebelo).',
  },
  {
    id: 'sustancia-negra',
    region: 'Mesencéfalo · Ganglios basales',
    image: 'https://dabrwqwzvvnosdnmvlrp.supabase.co/storage/v1/object/public/examenes-img/neurologia/eva3/sustancia-negra.avif',
    imageCitation: 'Duke University School of Medicine, Department of Pathology. (2017). Nervous system pathology — Case 543 [Recurso educativo]. https://pathology.oit.duke.edu/siteParts/old_websites/nervous/nervous-1_2017.html',
    promptA: 'Nombre de la estructura señalada',
    answerA: {
      label: 'Sustancia negra (locus niger)',
      accept: [
        'sustancia negra', 'locus niger', 'locus nigger', 'substantia nigra',
        'locus negro', 'sustancia nigra',
      ],
    },
    promptB: 'Indique el neurotransmisor que produce',
    conceptsB: [
      {
        label: 'Dopamina',
        accept: ['dopamina', 'dopaminergico', 'neurotransmisor dopaminergico', 'dopamine'],
      },
    ],
    modelB: 'La sustancia negra produce dopamina (neuronas dopaminérgicas de la vía nigroestriatal).',
  },
  {
    id: 'comunicante-posterior',
    region: 'Vascularización cerebral · Polígono de Willis',
    image: 'https://dabrwqwzvvnosdnmvlrp.supabase.co/storage/v1/object/public/examenes-img/neurologia/eva3/comunicante-posterior.avif',
    imageOverlay: 'https://dabrwqwzvvnosdnmvlrp.supabase.co/storage/v1/object/public/examenes-img/neurologia/eva3/comunicante-posterior-overlay.avif',
    overlayTrigger: 'bChecked',
    overlayHideBase: true,
    imageCitation: 'Sheikh, M. I. (s.f.). Arteria comunicante posterior [Imagen anatómica]. Medizzy. https://medizzy.com/feed/5850486',
    promptA: 'Nombre de la estructura señalada',
    answerA: {
      label: 'Arteria comunicante posterior',
      accept: [
        'arteria comunicante posterior', 'comunicante posterior', 'a comunicante posterior',
        'a. comunicante posterior', 'com post', 'comunicante post',
      ],
    },
    promptB: 'Indique su origen y su anastomosis',
    conceptsB: [
      {
        label: 'Origen: arteria carótida interna',
        accept: [
          'carotida interna', 'carotida', 'arteria carotida interna',
          'a carotida interna', 'aci', 'carotida int',
        ],
      },
      {
        label: 'Anastomosis: arteria cerebral posterior',
        accept: [
          'cerebral posterior', 'arteria cerebral posterior', 'a cerebral posterior',
          'a. cerebral posterior', 'cerebral post', 'acp',
        ],
      },
    ],
    modelB: 'Origen: arteria carótida interna. Anastomosis: con la arteria cerebral posterior (formando parte del polígono de Willis).',
  },
  {
    id: 'tienda-cerebelo',
    region: 'Meninges · Duramadre',
    image: 'https://dabrwqwzvvnosdnmvlrp.supabase.co/storage/v1/object/public/examenes-img/neurologia/eva3/tienda-cerebelo.avif',
    imageOverlay: 'https://dabrwqwzvvnosdnmvlrp.supabase.co/storage/v1/object/public/examenes-img/neurologia/eva3/tienda-cerebelo-overlay.avif',
    overlayHideBase: true,
    imageCaption: 'El tentorio o tienda del cerebelo es una invaginación (reflexión) de la duramadre que separa los lóbulos occipital y temporal de los hemisferios cerebrales del cerebelo y el tronco encefálico. Esta lámina se extiende en el plano transverso sobre la fosa craneal posterior, divide la cavidad craneal en los compartimentos supratentorial e infratentorial y cubre el cerebelo como una tienda de campaña (de donde recibe su nombre).',
    imageCitation: 'Rai, R., Iwanaga, J., Shokouhi, G., Oskouian, R. J., & Tubbs, R. S. (2018). The tentorium cerebelli: A comprehensive review. Cureus. https://doi.org/10.7759/cureus.3079 — Serrano, C. (2025). Tienda del cerebelo (tentorio). Kenhub. https://www.kenhub.com/es/library/anatomia-es/tentorio-del-cerebelo',
    promptA: 'Nombre de la estructura señalada (sombreada)',
    answerA: {
      label: 'Tienda del cerebelo (tentorio)',
      accept: [
        'tienda del cerebelo', 'tentorio', 'tentorium', 'tienda cerebelosa',
        'tienda cerebelo', 'tentorium cerebelli',
      ],
    },
    promptB: 'Indique su inervación sensitiva',
    conceptsB: [
      {
        label: 'Rama meníngea (tentorial) del nervio oftálmico (V1)',
        accept: [
          'rama meningea', 'rama tentorial', 'nervio tentorial', 'tentorial',
          'v1', 'oftalmico', 'n oftalmico', 'nervio oftalmico',
          'primera rama del trigemino', 'v1 trigemino',
          'recurrente tentorial', 'recurrente meningeo', 'rama recurrente',
        ],
      },
    ],
    modelB: 'La inervación sensitiva de la tienda del cerebelo proviene de la rama meníngea (tentorial) del nervio oftálmico (V1, primera rama del trigémino).',
  },
  {
    id: 'acueducto-cerebral',
    region: 'Sistema ventricular · Mesencéfalo',
    image: 'https://dabrwqwzvvnosdnmvlrp.supabase.co/storage/v1/object/public/examenes-img/neurologia/eva3/acueducto-cerebral.avif',
    imageCaption: 'Acueducto de Silvio (acueducto cerebral / mesencefálico). Comunica el tercer con el cuarto ventrículo y permite la circulación del líquido cefalorraquídeo (LCR) entre ambos. Su obstrucción produce hidrocefalia no comunicante.',
    imageCitation: 'Brogna, C., Lavrador, J. P., Kandeel, H. S., Beyh, A., Ribas, E. C., Vergani, F., & Tolias, C. M. (2020). Midline sagittal view of the brainstem and cerebellum [Ilustración]. Wikimedia Commons (CC BY 4.0). https://commons.wikimedia.org/wiki/File:Midline_sagittal_view_of_the_brainstem_and_cerebellum.png',
    promptA: 'Nombre de la estructura señalada',
    answerA: {
      label: 'Acueducto cerebral (mesencefálico / de Silvio)',
      accept: [
        'acueducto cerebral', 'acueducto mesencefalico', 'acueducto de silvio',
        'acueducto silvio', 'silvio', 'acueducto', 'aqueducto cerebral',
        'acueducto mesencefalico de silvio',
      ],
    },
    promptB: 'Indique los espacios que comunica',
    conceptsB: [
      {
        label: 'Tercer ventrículo',
        accept: [
          'tercer ventriculo', '3er ventriculo', '3 ventriculo', 'iii ventriculo',
          'ventriculo iii', 'ventriculo 3',
        ],
        acceptAll: ['tercer', 'ventriculo'],
      },
      {
        label: 'Cuarto ventrículo',
        accept: [
          'cuarto ventriculo', '4to ventriculo', '4 ventriculo', 'iv ventriculo',
          'ventriculo iv', 'ventriculo 4',
        ],
        acceptAll: ['cuarto', 'ventriculo'],
      },
    ],
    modelB: 'El acueducto cerebral (de Silvio) comunica el tercer ventrículo con el cuarto ventrículo.',
  },
  {
    id: 'cintilla-optica',
    region: 'Vía óptica',
    image: 'https://dabrwqwzvvnosdnmvlrp.supabase.co/storage/v1/object/public/examenes-img/neurologia/eva3/cintilla-optica.avif',
    imageCaption: 'Cintilla óptica (tracto óptico): continuación de las fibras visuales tras el quiasma óptico. Conduce los impulsos visuales de la retina contralateral hacia el cuerpo geniculado lateral del tálamo, donde hace sinapsis. Desde allí, las radiaciones ópticas proyectan a la corteza visual primaria (área 17, lóbulo occipital).',
    imageCitation: 'Párraga, R. G., Possatti, L. L., Alves, R. V., Ribas, G. C., Türe, U., & de Oliveira, E. (2016). Microsurgical anatomy and internal architecture of the brainstem in 3D images: Surgical considerations [Figura 1]. Journal of Neurosurgery, 124(5), 1377–1395. https://doi.org/10.3171/2015.4.JNS132778',
    promptA: 'Nombre de la estructura señalada',
    answerA: {
      label: 'Cintilla óptica (tracto óptico)',
      accept: [
        'cintilla optica', 'tracto optico', 'tractus opticus',
        'cintilla', 'tracto optico cintilla', 'bandeleta optica',
      ],
    },
    promptB: '¿Dónde terminan haciendo sinapsis?',
    conceptsB: [
      {
        label: 'Cuerpo geniculado lateral (tálamo)',
        accept: [
          'cuerpo geniculado lateral', 'geniculado lateral', 'nucleo geniculado lateral',
          'cgl', 'cuerpo geniculado', 'geniculado lat', 'cuerpo geniculado lat',
        ],
      },
    ],
    modelB: 'Las fibras de la cintilla óptica terminan haciendo sinapsis en el cuerpo geniculado lateral del tálamo.',
  },
  {
    id: 'brazo-anterior-capsula',
    region: 'Sustancia blanca · Cápsula interna',
    image: 'https://dabrwqwzvvnosdnmvlrp.supabase.co/storage/v1/object/public/examenes-img/neurologia/eva3/brazo-anterior-capsula.avif',
    imageOverlay: 'https://dabrwqwzvvnosdnmvlrp.supabase.co/storage/v1/object/public/examenes-img/neurologia/eva3/brazo-anterior-capsula-overlay.avif',
    overlayHideBase: true,
    imageCaption: 'Cerebro humano fijado con formalina de un varón de mediana edad, hemisferio izquierdo, sección coronal 2 mm anterior a la AC. El brazo anterior de la cápsula interna (5) es una lámina de sustancia blanca compuesta por fibras de proyección que conectan la corteza frontal con el tálamo (fibras frontopontinas y tálamo-corticales). Separa el núcleo caudado del putamen.',
    imageCaptionList: [
      'Núcleo accumbens',
      'Cabeza de alfiler: punto objetivo del electrodo para estimulación cerebral profunda del núcleo accumbens',
      'Núcleo caudado (cabeza)',
      'Putamen',
      { text: 'Cápsula interna (brazo anterior)', bold: true },
      'Cápsula externa',
      'Claustro',
      'Cápsula extrema',
      'Plano AC-PC',
      'Cuerpo calloso',
      'Septum pellucidum',
      'Ventrículo lateral (cuerno frontal)',
    ],
    imageCitation: 'Mavridis, I. N., & Anagnostopoulou, S. (2013). Formalin-fixated human brain3 [Imagen digital]. Wikimedia Commons (CC BY 3.0). https://commons.wikimedia.org/wiki/File:Formalin-fixated_human_brain3.jpg',
    promptA: 'Nombre de la estructura señalada',
    answerA: {
      label: 'Brazo anterior de la cápsula interna',
      accept: [
        'brazo anterior', 'brazo anterior de la capsula interna',
        'brazo anterior capsula interna', 'pierna anterior capsula interna',
        'pierna anterior', 'segmento anterior capsula interna',
        'lenticulofrontal', 'pedunculo frontal',
      ],
    },
    promptB: 'Indique el tipo de fibras de sustancia blanca que representa',
    conceptsB: [
      {
        label: 'Fibras de proyección',
        accept: [
          'fibras de proyeccion', 'proyeccion', 'fibras proyeccion',
          'fibras de proyeccion cortical', 'fibra de proyeccion',
        ],
      },
    ],
    modelB: 'El brazo anterior de la cápsula interna representa fibras de proyección (conectan corteza con estructuras subcorticales/espinales).',
  },
  {
    id: 'putamen',
    region: 'Ganglios basales · Telencéfalo',
    image: 'https://dabrwqwzvvnosdnmvlrp.supabase.co/storage/v1/object/public/examenes-img/neurologia/eva3/putamen.avif',
    imageOverlay: 'https://dabrwqwzvvnosdnmvlrp.supabase.co/storage/v1/object/public/examenes-img/neurologia/eva3/putamen-overlay.avif',
    overlayHideBase: true,
    imageCaption: 'Cerebro humano fijado con formalina de un varón de mediana edad, hemisferio izquierdo, sección coronal 2 mm anterior a la AC. El putamen (4) es el núcleo más lateral del neoestriado. Junto al núcleo caudado forma el estriado dorsal. Participa en el control motor automático y el aprendizaje de hábitos motores a través de los circuitos de los ganglios basales.',
    imageCaptionList: [
      'Núcleo accumbens',
      'Cabeza de alfiler: punto objetivo del electrodo para estimulación cerebral profunda del núcleo accumbens',
      'Núcleo caudado (cabeza)',
      { text: 'Putamen', bold: true },
      'Cápsula interna (brazo anterior)',
      'Cápsula externa',
      'Claustro',
      'Cápsula extrema',
      'Plano AC-PC',
      'Cuerpo calloso',
      'Septum pellucidum',
      'Ventrículo lateral (cuerno frontal)',
    ],
    imageCitation: 'Mavridis, I. N., & Anagnostopoulou, S. (2013). Formalin-fixated human brain3 [Imagen digital]. Wikimedia Commons (CC BY 3.0). https://commons.wikimedia.org/wiki/File:Formalin-fixated_human_brain3.jpg',
    promptA: 'Nombre de la estructura señalada',
    answerA: {
      label: 'Putamen',
      accept: ['putamen'],
    },
    promptB: 'Indique la división filogenética a la que pertenece',
    conceptsB: [
      {
        label: 'Neoestriado (Estriado / Neostriatum)',
        accept: [
          'neoestriado', 'neo estriado', 'neostriatum', 'neostriado',
          'estriado', 'cuerpo estriado', 'striatum',
          'estriado dorsal', 'neocuerpo estriado',
        ],
      },
    ],
    modelB: 'El putamen pertenece al neoestriado (estriado), junto al núcleo caudado. Filogenéticamente es la parte más nueva del cuerpo estriado.',
  },
];
