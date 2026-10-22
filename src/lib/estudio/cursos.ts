import 'server-only';
import { SILABOS } from '@/lib/data/silabos';
import { CURSOS } from '@/lib/data/aportes';
import { puedeVerResumen } from '@/lib/acceso-resumen';
import { cursoEsGratis, planDeTrack, requiredPlanDeCurso, tieneAccesoA, trackDelUsuario } from '@/lib/acceso';
import type { PlanState } from '@/lib/plans';
import type { ClaseEstudio, CursoEstudio, CursoListado, FormatoResumen, ResumenEstudio } from './tipos';

type Plan = Pick<PlanState, 'plan' | 'isActive' | 'allAccess'>;

/**
 * Icono de cada curso: las materias del ENCIB (`/assets/cursos/materia-*_v6.avif`).
 * Los que no casan con ninguna van con el provisional hasta que tengan el suyo.
 */
const MATERIA: Record<string, string> = {
  'microbiologia': 'microbiologia',
  'farmacologia': 'farmacologia',
  'inmunologia': 'inmunologia',
  'patologia': 'patologia',
  'hematologia': 'histologia',
  'biologia-celular': 'genetica',
  'quimica-organica': 'bioquimica',
  'aparato-locomotor': 'anatomia',
  'neurologia': 'anatomia',
  'digestivo': 'anatomia',
  'cardiovascular': 'fisiologia',
  'respiratorio': 'fisiologia',
  'excretor': 'fisiologia',
  'endocrino-reproductor': 'embriologia',
};

export const iconoDe = (slug: string) => (MATERIA[slug] ? `/assets/cursos/materia-${MATERIA[slug]}_v6.avif` : null);

const TIPO: Record<string, string> = {
  MAGISTRAL: 'Magistral', TEORIA: 'Teoría', TEMA: 'Tema', LAB: 'Laboratorio', 'LAB-ANAT': 'Lab. anatomía',
  'LAB-HISTO': 'Lab. histología', ANATOMIA: 'Anatomía', HISTOLOGIA: 'Histología', TALLER: 'Taller',
  'TALLER-FIS': 'Taller', 'TALLER-INT': 'Taller', TBL: 'TBL', ABP: 'ABP', SGP: 'SGP', ACP: 'ACP',
  INVERTIDA: 'Clase invertida', PRACTICA: 'Práctica', PD: 'Práctica dirigida', SEMINARIO: 'Seminario',
  PC: 'Práctica calificada', PASO: 'Paso', 'PASO-CORTO': 'Paso corto', EXAMEN: 'Examen', 'EXAMEN-T': 'Examen teórico',
  'EXAMEN-P': 'Examen práctico', 'EXAMEN-L': 'Examen de laboratorio', 'EXAM-PARC': 'Examen parcial',
  'EXAM-FINAL': 'Examen final', 'EXAM-ANAT': 'Examen de anatomía', SUSTIT: 'Sustitutorio', REPASO: 'Repaso',
};
const etiquetaTipo = (t: string) => TIPO[t] ?? t.charAt(0) + t.slice(1).toLowerCase().replace(/-/g, ' ');

interface ActCruda {
  id: string; tipo: string; titulo: string; fecha?: string; hora?: string; subtemas?: string[];
  docentes?: string[]; nota?: string;
  resumen?: { formato?: FormatoResumen; opciones?: { id: string; label?: string; formato?: FormatoResumen }[] };
}

function resumenesDe(a: ActCruda): ResumenEstudio[] {
  if (!a.resumen) return [];
  const base = a.resumen.formato ?? 'pdf';
  if (!a.resumen.opciones?.length) return [{ id: a.id, label: 'Resumen', formato: base }];
  return a.resumen.opciones.map((o) => ({ id: o.id, label: o.label ?? 'Resumen', formato: o.formato ?? base }));
}

function clase(a: ActCruda, plan: Plan): ClaseEstudio {
  const resumenes = resumenesDe(a);
  return {
    id: a.id,
    title: a.titulo,
    tipo: etiquetaTipo(a.tipo),
    ...(a.fecha ? { fecha: a.fecha } : {}),
    ...(a.hora ? { hora: a.hora } : {}),
    subtemas: a.subtemas ?? [],
    docentes: a.docentes ?? [],
    ...(a.nota ? { nota: a.nota } : {}),
    resumenes,
    bloqueada: resumenes.length > 0 && !resumenes.some((r) => puedeVerResumen(plan, r.id)),
  };
}

const ORDEN_TRAMO = { basico: 0, medicina: 1 } as const;

/** Los cursos con sílabo: primero los del tramo del alumno; sin plan, en el orden de la carrera. */
export function cursosListados(plan: Plan): CursoListado[] {
  const suyo = trackDelUsuario(plan);
  return CURSOS
    .filter((c) => SILABOS[c.slug])
    .map((c) => ({
      id: c.slug,
      name: c.nombre,
      track: c.track,
      bloqueado: !cursoEsGratis(c.slug) && !tieneAccesoA(plan, requiredPlanDeCurso(c.slug)),
      icono: iconoDe(c.slug),
    }))
    .sort((a, b) => {
      const pa = a.track === suyo ? -1 : ORDEN_TRAMO[a.track];
      const pb = b.track === suyo ? -1 : ORDEN_TRAMO[b.track];
      return pa - pb;
    });
}

export function cursoEstudio(slug: string, plan: Plan): CursoEstudio | null {
  const meta = CURSOS.find((c) => c.slug === slug);
  const semanas = SILABOS[slug];
  if (!meta || !semanas) return null;
  return {
    id: slug,
    name: meta.nombre,
    icono: iconoDe(slug),
    track: meta.track,
    planRequerido: planDeTrack(meta.track) as 'ufbi' | 'interno',
    groups: semanas
      .map((s, i) => ({
        id: `sem-${i + 1}`,
        title: s.titulo,
        lessons: (s.actividades as unknown as ActCruda[]).map((a) => clase(a, plan)),
      }))
      .filter((g) => g.lessons.length),
  };
}
