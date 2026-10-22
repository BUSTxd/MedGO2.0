import 'server-only';
import { LAB_TOPICS } from '@/lib/data/laboratorio-catalogo';
import { labEsGratis, labTieneVistazo, requiredPlanDeCurso, requiredPlanDeLab, tieneAccesoA, trackDeCurso, trackDelUsuario } from '@/lib/acceso';
import type { PlanState } from '@/lib/plans';
import { iconoDe } from './cursos';
import { rutaEnEstudio } from './rutas';
import type { TarjetaLab, TipoLab } from './tipos';

type Plan = Pick<PlanState, 'plan' | 'isActive' | 'allAccess'>;

/** Qué es cada laboratorio, para los filtros. Lo que no está aquí es una simulación. */
const TIPO: Record<string, TipoLab> = {
  'atlas-micologia': 'Atlas',
  'atlas-parasitologia': 'Atlas',
  'atlas-microbiologia': 'Atlas',
  'morfologia-globulos-rojos': 'Atlas',
  'atlas-3d': 'Modelo 3D',
  'poligono-willis': 'Modelo 3D',
  'tronco-encefalico': 'Modelo 3D',
  'medula-espinal': 'Modelo 3D',
  'biomecanica-extraocular': 'Modelo 3D',
  'parametro-sangre-orina': 'Práctica',
  'eva-2': 'Práctica',
  'eva-3': 'Práctica',
};

const LAB = '/dashboard/laboratorio/';

/**
 * Las tarjetas del Laboratorio: los laboratorios publicados del catálogo (los
 * que tienen `href`), una vez cada uno aunque los compartan dos cursos, más
 * Investigación. Primero los del tramo del alumno, como en el dashboard.
 * Física es un curso de Cayetano: sin cuenta de Cayetano no aparece.
 */
export function tarjetasLaboratorio(plan: Plan, deCayetano: boolean): TarjetaLab[] {
  const propio = trackDelUsuario(plan);
  const porHref = new Map<string, TarjetaLab & { track: string }>();

  for (const tema of LAB_TOPICS) {
    if (tema.id === 'fisica-medicina' && !deCayetano) continue;
    const curso = tema.title.replace(/\s*\|.*$/, '');
    for (const exp of tema.experiments) {
      if (!exp.href) continue;
      const href = rutaEnEstudio(exp.href);
      if (!href) continue;
      const previa = porHref.get(href);
      if (previa) { previa.cursos.push(curso); continue; }

      const slug = exp.href.startsWith(LAB) ? exp.href.slice(LAB.length).split('?')[0] : null;
      const required = slug ? requiredPlanDeLab(slug) : requiredPlanDeCurso(tema.id);
      const abierto = tieneAccesoA(plan, required);
      const acceso: TarjetaLab['acceso'] = abierto ? 'abierto'
        : slug && labEsGratis(slug) ? 'gratis'
        : slug && labTieneVistazo(slug) ? 'vistazo'
        : exp.prueba ? 'prueba'
        : 'plan';
      porHref.set(href, {
        id: href,
        nombre: exp.name,
        desc: exp.desc,
        materia: curso,
        cursos: [curso],
        tipo: (slug && TIPO[slug]) || 'Simulación',
        // Quien no tiene el plan pero sí la prueba gratis entra directo a ella.
        href: acceso === 'prueba' && exp.prueba ? rutaEnEstudio(exp.prueba) ?? href : href,
        icono: iconoDe(tema.id),
        acceso,
        track: trackDeCurso(tema.id),
      });
    }
  }

  const labs = [...porHref.values()]
    .sort((a, b) => (propio === null ? 0 : (a.track === propio ? 0 : 1) - (b.track === propio ? 0 : 1)))
    .map(({ track: _t, ...t }) => t); // eslint-disable-line @typescript-eslint/no-unused-vars

  const investigacion: TarjetaLab = {
    id: '/estudio/laboratorio/investigacion',
    nombre: 'Investigación',
    desc: 'El curso de investigación como juego: 14 niveles con lecturas, minijuegos y un reto final por tema.',
    materia: 'Investigación',
    cursos: ['Investigación'],
    tipo: 'Investigación',
    href: '/estudio/laboratorio/investigacion',
    icono: null,
    acceso: tieneAccesoA(plan, 'interno') ? 'abierto' : 'plan',
  };
  return [investigacion, ...labs];
}
