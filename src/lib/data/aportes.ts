import type { Track } from '@/lib/plans';

/**
 * Registro de aportes del equipo.
 *
 * Existe para que el reparto de ganancias se apoye en unidades publicadas y
 * verificables, no en percepciones. La parte variable del acuerdo se recalcula
 * cada ciclo a partir de lo que este archivo declara + lo que hay realmente
 * publicado en los sílabos (ver `aportes-stats.ts`).
 *
 * ⚠️ Reemplazar los nombres placeholder de las dos colaboradoras de UFBI.
 */

export type Colaborador = 'bust' | 'sofia' | 'ufbi-1' | 'ufbi-2';

export interface ColaboradorMeta {
  nombre: string;
  rol: string;
  color: string;
  /** Tramos en cuyo reparto participa. */
  pools: Track[];
}

export const COLABORADORES: Record<Colaborador, ColaboradorMeta> = {
  bust: {
    nombre: 'BUST',
    rol: 'Plataforma, banqueo, laboratorios 3D, costos y redes',
    color: '#3b9edd',
    pools: ['basico', 'medicina'],
  },
  sofia: {
    nombre: 'Sofía',
    rol: 'Material de Facultad (2.º–3.er año)',
    color: '#8b5cf6',
    pools: ['medicina'],
  },
  'ufbi-1': {
    nombre: 'Colaboradora 1',   // ← poner nombre real
    rol: 'Material de UFBI (1.er año)',
    color: '#2DC99A',
    pools: ['basico'],
  },
  'ufbi-2': {
    nombre: 'Colaboradora 2',   // ← poner nombre real
    rol: 'Material de UFBI (1.er año)',
    color: '#F5A623',
    pools: ['basico'],
  },
};

export interface CursoMeta {
  /** Slug de la ruta en /dashboard/cursos/<slug>. */
  slug: string;
  nombre: string;
  track: Track;
  /** Quién aportó el material base (resúmenes, PPT, prácticas) del curso. */
  materialDe: Colaborador[];
}

/**
 * Cursos que tienen que estar completos para lanzar la web, en orden. El resto
 * se sigue midiendo, pero aparte: su avance no bloquea el lanzamiento.
 */
export const PRIORIDAD_LANZAMIENTO: readonly string[] = [
  // UFBI · 1.er año
  'fisica-medicina',
  'quimica-organica',
  'biologia-celular',
  // Facultad de Medicina
  'hematologia',
  'aparato-locomotor',
  'inmunologia',
  'digestivo',
];

/**
 * El banqueo y los laboratorios NO se declaran aquí: siempre son de `bust`, y
 * se cuentan directamente de los sílabos para que el número no se pueda
 * desalinear de lo realmente publicado.
 */
export const CURSOS: CursoMeta[] = [
  // ── Facultad de Medicina (2.º–7.º año) ──
  { slug: 'microbiologia',         nombre: 'Microbiología',              track: 'medicina', materialDe: ['sofia'] },
  { slug: 'farmacologia',          nombre: 'Farmacología',               track: 'medicina', materialDe: ['sofia'] },
  { slug: 'cardiovascular',        nombre: 'Cardiovascular',             track: 'medicina', materialDe: ['sofia'] },
  { slug: 'neurologia',            nombre: 'Neurología',                 track: 'medicina', materialDe: ['sofia'] },
  { slug: 'excretor',              nombre: 'Aparato Excretor',           track: 'medicina', materialDe: ['sofia'] },
  { slug: 'hematologia',           nombre: 'Hematología',                track: 'medicina', materialDe: ['sofia'] },
  { slug: 'aparato-locomotor',     nombre: 'Aparato Locomotor',          track: 'medicina', materialDe: ['sofia'] },
  { slug: 'inmunologia',           nombre: 'Inmunología',                track: 'medicina', materialDe: ['sofia'] },
  { slug: 'digestivo',             nombre: 'Sistema Digestivo',          track: 'medicina', materialDe: ['sofia'] },
  { slug: 'endocrino-reproductor', nombre: 'Endocrino y Reproductor',    track: 'medicina', materialDe: ['sofia'] },

  // ── UFBI · Ciencias Básicas (1.er año) ──
  { slug: 'biologia-celular',        nombre: 'Biología Celular',      track: 'basico', materialDe: ['ufbi-1', 'ufbi-2'] },
  { slug: 'ciencias-sociales',       nombre: 'Ciencias Sociales',     track: 'basico', materialDe: ['ufbi-1', 'ufbi-2'] },
  { slug: 'fisica-medicina',         nombre: 'Física',                track: 'basico', materialDe: ['ufbi-1', 'ufbi-2'] },
  { slug: 'quimica-organica',        nombre: 'Química Orgánica',      track: 'basico', materialDe: ['ufbi-1', 'ufbi-2'] },
  { slug: 'comunicacion-redaccion-ii', nombre: 'Comunicación y Redacción II', track: 'basico', materialDe: ['ufbi-1', 'ufbi-2'] },
  { slug: 'cultura-ambiental',       nombre: 'Cultura Ambiental',     track: 'basico', materialDe: ['ufbi-1', 'ufbi-2'] },
];

/**
 * Excepciones: material de un curso aportado por alguien distinto al default.
 * Clave = id de la actividad (`hem-7`, `qor-s-1`, …).
 */
export const APORTE_OVERRIDE: Record<string, Colaborador> = {};

export interface LaboratorioMeta {
  slug: string;
  nombre: string;
  track: Track;
  autor: Colaborador;
  /** Simulación 3D/interactiva pesada, no un atlas de imágenes. */
  pesado?: boolean;
}

/** Laboratorios y simuladores publicados en /dashboard/laboratorio. */
export const LABORATORIOS: LaboratorioMeta[] = [
  { slug: 'frotis-sanguineo',        nombre: 'Frotis sanguíneo (3D)',        track: 'medicina', autor: 'bust', pesado: true },
  { slug: 'microscopio-hematologia', nombre: 'Microscopio virtual',          track: 'medicina', autor: 'bust', pesado: true },
  { slug: 'nefron-interactivo',      nombre: 'Nefrón interactivo',           track: 'medicina', autor: 'bust', pesado: true },
  { slug: 'electrocardiograma',      nombre: 'Simulador EKG',                track: 'medicina', autor: 'bust', pesado: true },
  { slug: 'eva-2',                   nombre: 'EVA 2 — Anatomía',             track: 'medicina', autor: 'bust', pesado: true },
  { slug: 'eva-3',                   nombre: 'EVA 3 — Anatomía',             track: 'medicina', autor: 'bust', pesado: true },
  { slug: 'parametro-sangre-orina',  nombre: 'Sangre vs. orina',             track: 'medicina', autor: 'bust' },
  { slug: 'atlas-microbiologia',     nombre: 'Atlas Microbiología',          track: 'medicina', autor: 'bust' },
  { slug: 'atlas-parasitologia',     nombre: 'Atlas Parasitología',          track: 'medicina', autor: 'bust' },
  { slug: 'atlas-micologia',         nombre: 'Atlas Micología',              track: 'medicina', autor: 'bust' },
  { slug: 'microscopio',             nombre: 'Microscopio',                  track: 'medicina', autor: 'bust' },
  { slug: 'medula-espinal',          nombre: 'Médula espinal',               track: 'medicina', autor: 'bust' },
  { slug: 'tronco-encefalico',       nombre: 'Tronco encefálico',            track: 'medicina', autor: 'bust' },
  { slug: 'poligono-willis',         nombre: 'Polígono de Willis',           track: 'medicina', autor: 'bust' },
  { slug: 'biomecanica-extraocular', nombre: 'Biomecánica extraocular',      track: 'medicina', autor: 'bust' },
];
