import 'server-only';
import type { ExamenRef } from '@/lib/data/examen';
import type { TarjetasRef } from '@/lib/data/tarjetas';
import { findBanco } from '@/lib/data/banco';
import { findSolucionario } from '@/lib/data/solucionarios';
import { banqueoLabelDe } from '@/lib/material-plan';
import { puedeVerResumen } from '@/lib/acceso-resumen';
import type { PlanState } from '@/lib/plans';
import type { FormatoResumen, PracticaEstudio, TipoPractica } from './tipos';

type Plan = Pick<PlanState, 'plan' | 'isActive' | 'allAccess'>;

/**
 * La página de clase del dashboard que monta cada runner con `?<tipo>=1`. La
 * interfaz la reutiliza tal cual (velo, plan, aviso de suscripción, muestra…):
 * así un banqueo se comporta igual en los dos sitios. Un curso que estrene
 * runner tiene que entrar aquí, o su banqueo no sale en la pestaña «Práctica».
 */
type PaginaDeClase = (p: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string>>;
}) => Promise<React.ReactNode>;

export const PAGINA_DE_CLASE: Record<string, () => Promise<{ default: PaginaDeClase }>> = {
  'aparato-locomotor': () => import('@/app/dashboard/cursos/aparato-locomotor/[id]/page'),
  'epidemiologia': () => import('@/app/dashboard/cursos/epidemiologia/[id]/page'),
  'excretor': () => import('@/app/dashboard/cursos/excretor/[id]/page'),
  'inmunologia': () => import('@/app/dashboard/cursos/inmunologia/[id]/page'),
  'neurologia': () => import('@/app/dashboard/cursos/neurologia/[id]/page'),
  'patologia': () => import('@/app/dashboard/cursos/patologia/[id]/page'),
  'psicologia-medica': () => import('@/app/dashboard/cursos/psicologia-medica/[id]/page'),
  'quimica-organica': () => import('@/app/dashboard/cursos/quimica-organica/[id]/page'),
} as unknown as Record<string, () => Promise<{ default: PaginaDeClase }>>;

/** Los que abren un runner (el resto, los propuestos, se leen en el visor). */
export const esRunner = (t: string): t is Exclude<TipoPractica, 'propuestos'> =>
  t === 'examen' || t === 'banco' || t === 'tarjetas' || t === 'solucionario';

export interface ActPractica {
  id: string;
  tipo: string;
  examen?: ExamenRef;
  tarjetas?: TarjetasRef;
  propuestos?: {
    tipo?: string; claseId?: string; desc?: string; formato?: FormatoResumen;
    opciones?: { id: string; label?: string; formato?: FormatoResumen }[];
  };
}

/** «2024 · 2020», en el orden del selector del runner (como la tarjeta del dashboard). */
const aniosDe = (e: ExamenRef) =>
  [e.key, ...(e.groups ?? [])].map((k) => e.labels?.[k]).filter((a): a is string => !!a);

/**
 * Los banqueos de una clase, con la misma precedencia que la tarjeta «Banqueo» de
 * `StudyMaterialSection` pero sin quedarse con uno solo: aquí caben todos.
 */
export function practicaDeClase(curso: string, a: ActPractica, plan: Plan): PracticaEstudio[] {
  const conRunner = curso in PAGINA_DE_CLASE;
  const etiqueta = banqueoLabelDe(curso, a.tipo);
  const lista: PracticaEstudio[] = [];

  if (conRunner && a.examen) {
    const anios = aniosDe(a.examen);
    lista.push({
      tipo: 'examen',
      titulo: etiqueta,
      desc: anios.length > 1
        ? `${anios.length} banqueos de exámenes anteriores, con su explicación`
        : 'Preguntas tipo examen, con la explicación de cada una',
      chips: [...anios, ...(a.examen.porTemas ? ['Por temas'] : [])],
    });
  }

  const banco = conRunner && curso === 'patologia' ? findBanco(a.id) : null;
  if (banco) {
    lista.push({
      tipo: 'banco',
      titulo: 'Banco de preguntas',
      desc: `${banco.tandas.length} exámenes con explicación, uno por pregunta`,
      chips: [],
    });
  }

  if (conRunner && curso === 'quimica-organica' && findSolucionario(a.id)) {
    lista.push({
      tipo: 'solucionario',
      titulo: 'Solucionario paso a paso',
      desc: 'La práctica resuelta, con el enunciado al lado',
      chips: [],
    });
  }

  if (conRunner && a.tarjetas) {
    lista.push({
      tipo: 'tarjetas',
      titulo: 'Tarjetas de repaso',
      desc: a.tarjetas.desc ?? 'Memoriza con tarjetas o respóndelas como alternativas',
      chips: [],
    });
  }

  if (a.propuestos?.tipo === 'pdf') {
    const p = a.propuestos;
    const base = p.formato ?? 'pdf';
    const opciones = p.opciones?.length ? p.opciones : [{ id: p.claseId ?? `${a.id}-prop`, label: 'Propuestos' }];
    lista.push({
      tipo: 'propuestos',
      titulo: etiqueta === 'Banqueo' ? 'Propuestos' : etiqueta,
      desc: p.desc ?? (curso === 'quimica-organica' ? 'Prácticas calificadas de años anteriores' : 'Problemas propuestos, con su resolución'),
      chips: [],
      documentos: opciones.map((o) => ({
        id: o.id,
        label: o.label ?? 'Propuestos',
        formato: o.formato ?? base,
        bloqueado: !puedeVerResumen(plan, o.id),
      })),
    });
  }

  return lista;
}
