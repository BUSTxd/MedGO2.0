
/**
 * Lo que pinta el escenario de Cursos: el carrusel de exámenes y la franja de
 * materias. Las imágenes llevan versión en el nombre (se sirven `immutable`):
 * cambiar un dibujo obliga a subirla aquí y en su script.
 *   - fondo y materias: `scripts/cursos-hub/preparar-imagenes.mjs`
 *   - tarjetas: `scripts/cursos-hub/preparar-tarjetas.mjs` (los dibujos de BUST)
 */

/** Las tarjetas llevan su propia versión (`V` de preparar-tarjetas.mjs). */
const T = (nombre: string) => `/assets/cursos/${nombre}_v3.avif`;

export const IMG_HUB = {
  /** El fondo lleva su propia versión (`V_FONDO` de preparar-imagenes.mjs). */
  fondo: '/assets/cursos/fondo_v2.avif',
} as const;

/** Caja dentro de la tarjeta, en % de su ancho/alto. */
export interface Caja { x: number; y: number; w: number; h: number }
const caja = (x0: number, y0: number, x1: number, y1: number, W: number, H: number): Caja => ({
  x: (x0 / W) * 100, y: (y0 / H) * 100, w: ((x1 - x0) / W) * 100, h: ((y1 - y0) / H) * 100,
});

export interface TarjetaExamen {
  slug: 'encib' | 'ciencias-basicas' | 'examen-ciencias-basicas';
  imagen: string;
  /** El título, la descripción y el botón ya vienen impresos en la imagen. */
  alt: string;
  ancho: number;
  alto: number;
  /** Sin `href`, sobre el botón impreso va uno «Próximamente». */
  href?: string;
  /** Dónde está el botón impreso (para el enlace o para taparlo). */
  boton: Caja;
  /** Dónde hay un chip de días impreso: lo tapa el contador real. Hoy ninguna lo trae. */
  chip?: Caja;
}

/** Orden del carrusel: el ENCIB primero (su punto es el primero); a su derecha
 *  la de las materias (libros) y a su izquierda la del microscopio. Las cajas
 *  van en píxeles de cada dibujo. */
export const TARJETAS_EXAMEN: TarjetaExamen[] = [
  {
    slug: 'encib', imagen: T('tarjeta-encib'), ancho: 640, alto: 768,
    alt: 'ENCIB 2026: 300 preguntas oficiales analizadas.', href: '/dashboard/cursos/examen/encib',
    boton: caja(97, 649, 543, 736, 640, 768),
  },
  {
    slug: 'ciencias-basicas', imagen: T('tarjeta-ciencias-basicas'), ancho: 619, alto: 732,
    alt: 'Exámenes de Ciencias Básicas: practica Anatomía, Fisiología, Bioquímica y más con preguntas diseñadas para reforzar tu base médica.',
    boton: caja(94, 612, 525, 694, 619, 732),
  },
  {
    slug: 'examen-ciencias-basicas', imagen: T('tarjeta-examen-ciencias-basicas'), ancho: 621, alto: 746,
    alt: 'Exámenes de Ciencias Básicas: simulacros por materia básica. Refuerza tus fundamentos.',
    boton: caja(94, 630, 528, 714, 621, 746),
  },
];

export const TARJETA_INICIAL = TARJETAS_EXAMEN.findIndex((t) => t.slug === 'encib');

export interface Materia {
  slug: string;
  nombre: string;
  imagen: string;
  ancho: number;
  alto: number;
}

/** Las imágenes son solo el icono: `nombre` se pinta debajo. */
const SIN_IMAGEN: Omit<Materia, 'imagen'>[] = [
  { slug: 'anatomia', nombre: 'Anatomía', ancho: 200, alto: 200 },
  { slug: 'fisiologia', nombre: 'Fisiología', ancho: 200, alto: 200 },
  { slug: 'bioquimica', nombre: 'Bioquímica', ancho: 200, alto: 200 },
  { slug: 'histologia', nombre: 'Histología', ancho: 200, alto: 200 },
  { slug: 'embriologia', nombre: 'Embriología', ancho: 200, alto: 200 },
  { slug: 'genetica', nombre: 'Genética', ancho: 200, alto: 200 },
  { slug: 'microbiologia', nombre: 'Microbiología', ancho: 200, alto: 200 },
  { slug: 'parasitologia', nombre: 'Parasitología', ancho: 200, alto: 200 },
  { slug: 'inmunologia', nombre: 'Inmunología', ancho: 200, alto: 200 },
  { slug: 'farmacologia', nombre: 'Farmacología', ancho: 200, alto: 200 },
  { slug: 'patologia', nombre: 'Patología', ancho: 200, alto: 200 },
];

/** Las materias llevan su propia versión (`V_MATERIAS` del script). */
export const MATERIAS: Materia[] = SIN_IMAGEN.map((m) => ({
  ...m,
  imagen: `/assets/cursos/materia-${m.slug}_v6.avif`,
}));
