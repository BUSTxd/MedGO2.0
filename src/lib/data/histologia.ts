import type { ReactNode } from 'react';
import { createElement } from 'react';
import HeartIcon from '@/components/icons/HeartIcon';
import BrainIcon from '@/components/icons/BrainIcon';
import KidneyIcon from '@/components/icons/KidneyIcon';
import MuscleIcon from '@/components/icons/MuscleIcon';
import ImmuneIcon from '@/components/icons/ImmuneIcon';
import StomachIcon from '@/components/icons/StomachIcon';
import ReproductiveIcon from '@/components/icons/ReproductiveIcon';

/**
 * Fuente única de los cursos y clases del apartado Histología.
 *
 * Las fotos viven en el bucket público de Supabase `histologia`, con la ruta
 * `{cursoId}/{claseSlug}/{archivo}`. La UI NO navega carpetas: cada curso es un
 * atlas filtrable. La `clase` sale de la carpeta; la `tinción` y el `aumento`
 * se derivan del nombre de archivo (tokens reconocidos en el API):
 *   `glomerulo-he-40x.jpg` → título "Glomérulo", tinción "H&E", aumento "40x".
 * Tokens de tinción: he/hye, masson/tricromico, pas, plata/jones, gram, giemsa…
 * Tokens de aumento: cualquier `<n>x` (4x, 10x, 40x). El orden no importa y son
 * opcionales: sin token, esa faceta simplemente no aparece como chip.
 */

export type HistoClase = {
  slug: string;
  titulo: string;
};

export type HistoCurso = {
  id: string;
  nombre: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  /** ícono blanco para el recuadro de color del header */
  icon: ReactNode;
  /** ícono a color para la tarjeta del listado */
  iconColor: ReactNode;
  clases: HistoClase[];
};

export const HISTO_CURSOS: HistoCurso[] = [
  {
    id: 'neurologia',
    nombre: 'Neurología | UPCH',
    badge: 'Neurología',
    badgeColor: '#d44a4a',
    badgeBg: 'rgba(212, 74, 74, 0.12)',
    icon: createElement(BrainIcon, { size: 26, white: true }),
    iconColor: createElement(BrainIcon, { size: 24 }),
    clases: [
      { slug: 'medula-espinal', titulo: 'Médula espinal' },
      { slug: 'corteza-cerebral', titulo: 'Corteza cerebral y cerebelo' },
      { slug: 'nervio-periferico', titulo: 'Nervio periférico y ganglios' },
    ],
  },
  {
    id: 'cardiovascular',
    nombre: 'Cardiovascular | UPCH',
    badge: 'Cardiovascular',
    badgeColor: '#d44a4a',
    badgeBg: 'rgba(212, 74, 74, 0.12)',
    icon: createElement(HeartIcon, { size: 26, white: true }),
    iconColor: createElement(HeartIcon, { size: 24 }),
    clases: [
      { slug: 'miocardio', titulo: 'Miocardio y endocardio' },
      { slug: 'arterias-venas', titulo: 'Arterias y venas' },
      { slug: 'microcirculacion', titulo: 'Capilares y microcirculación' },
    ],
  },
  {
    id: 'excretor',
    nombre: 'Excretor | UPCH',
    badge: 'Excretor',
    badgeColor: '#d44a4a',
    badgeBg: 'rgba(212, 74, 74, 0.12)',
    icon: createElement(KidneyIcon, { size: 26, white: true }),
    iconColor: createElement(KidneyIcon, { size: 24 }),
    clases: [
      { slug: 'corteza-renal', titulo: 'Corteza renal y glomérulo' },
      { slug: 'tubulos-renales', titulo: 'Túbulos renales y médula' },
      { slug: 'via-urinaria', titulo: 'Uréter y vejiga' },
    ],
  },
  {
    id: 'aparato-locomotor',
    nombre: 'Aparato Locomotor | UPCH',
    badge: 'Locomotor',
    badgeColor: '#c9a227',
    badgeBg: 'rgba(201, 162, 39, 0.12)',
    icon: createElement(MuscleIcon, { size: 26, white: true }),
    iconColor: createElement(MuscleIcon, { size: 24 }),
    clases: [
      { slug: 'hueso', titulo: 'Tejido óseo' },
      { slug: 'cartilago', titulo: 'Cartílago' },
      { slug: 'musculo-esqueletico', titulo: 'Músculo esquelético' },
    ],
  },
  {
    id: 'inmunologia',
    nombre: 'Inmunología | UPCH',
    badge: 'Inmunología',
    badgeColor: '#c9a227',
    badgeBg: 'rgba(201, 162, 39, 0.12)',
    icon: createElement(ImmuneIcon, { size: 26, white: true }),
    iconColor: createElement(ImmuneIcon, { size: 24 }),
    clases: [
      { slug: 'timo', titulo: 'Timo' },
      { slug: 'ganglio-linfatico', titulo: 'Ganglio linfático' },
      { slug: 'bazo', titulo: 'Bazo' },
    ],
  },
  {
    id: 'digestivo',
    nombre: 'Sistema Digestivo | UPCH',
    badge: 'Digestivo',
    badgeColor: '#c9a227',
    badgeBg: 'rgba(201, 162, 39, 0.12)',
    icon: createElement(StomachIcon, { size: 26, white: true }),
    iconColor: createElement(StomachIcon, { size: 24 }),
    clases: [
      { slug: 'esofago-estomago', titulo: 'Esófago y estómago' },
      { slug: 'intestino', titulo: 'Intestino delgado y grueso' },
      { slug: 'higado-pancreas', titulo: 'Hígado y páncreas' },
    ],
  },
  {
    id: 'endocrino-reproductor',
    nombre: 'Sistema Endocrino y Reproductor | UPCH',
    badge: 'Endocrino y Reproductor',
    badgeColor: '#c9a227',
    badgeBg: 'rgba(201, 162, 39, 0.12)',
    icon: createElement(ReproductiveIcon, { size: 26, white: true }),
    iconColor: createElement(ReproductiveIcon, { size: 24 }),
    clases: [
      { slug: 'tiroides-suprarrenal', titulo: 'Tiroides y suprarrenal' },
      { slug: 'ovario-testiculo', titulo: 'Ovario y testículo' },
      { slug: 'utero-prostata', titulo: 'Útero y próstata' },
    ],
  },
];

export const getHistoCurso = (id: string): HistoCurso | undefined =>
  HISTO_CURSOS.find((c) => c.id === id);
