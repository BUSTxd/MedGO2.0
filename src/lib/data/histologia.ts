import type { ReactNode } from 'react';
import { createElement } from 'react';
import HeartIcon from '@/components/icons/HeartIcon';
import BrainIcon from '@/components/icons/BrainIcon';
import KidneyIcon from '@/components/icons/KidneyIcon';

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
];

export const getHistoCurso = (id: string): HistoCurso | undefined =>
  HISTO_CURSOS.find((c) => c.id === id);
