import 'server-only';
import { LAB_TOPICS } from '@/lib/data/laboratorio-catalogo';
import { labEsGratis, labTieneVistazo, requiredPlanDeCurso, requisitoDeLab, tieneAccesoA, trackDeCurso, trackDelUsuario } from '@/lib/acceso';
import type { PlanState } from '@/lib/plans';
import { claveDePortada } from '@/components/estudio/PortadaLab';
import { iconoDe } from './cursos';
import { rutaEnEstudio } from './rutas';
import type { LabRecomendado, TarjetaLab, TipoLab } from './tipos';

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
const sinQuery = (href: string) => href.split(/[?#]/)[0];

/**
 * El laboratorio que el sílabo enlaza a una clase: `simulacion.href` (la
 * Evaluación 1 de Locomotor → el examen 3D, las prácticas de Hematología).
 * Nombre y descripción salen del catálogo; la descripción del sílabo, si la
 * trae, manda porque habla de esa clase.
 */
export function laboratorioDeClase(
  curso: string,
  act: { id: string; simulacion?: { href?: string; desc?: string } },
): LabRecomendado | undefined {
  const deDashboard = act.simulacion?.href ?? null;
  const href = deDashboard ? rutaEnEstudio(deDashboard) : null;
  if (!deDashboard || !href) return undefined;
  const exp = LAB_TOPICS.flatMap((t) => t.experiments).find((e) => e.href && sinQuery(e.href) === sinQuery(deDashboard));
  const slug = deDashboard.startsWith(LAB) ? sinQuery(deDashboard).slice(LAB.length) : null;
  return {
    titulo: exp?.name ?? 'Laboratorio virtual',
    desc: act.simulacion?.desc ?? exp?.desc ?? '',
    etiqueta: /[?&]examen=1/.test(deDashboard) ? 'Examen práctico 3D' : (slug && TIPO[slug]) || 'Simulación',
    href,
    icono: iconoDe(curso),
    portada: claveDePortada(deDashboard),
    ...(slug === 'citopenias-autoinmunes' ? { animacion: 'citopenias' as const } : {}),
  };
}

/** Los mejores laboratorios, que abren el índice en este orden (el `href` del catálogo). */
const DESTACADOS = [
  'vias-nfkb-jakstat',
  'citopenias-autoinmunes',
  'hipersensibilidad',
  'lupus',
  'atlas-3d?region=miembro-superior-derecho',
  'atlas-3d?region=miembro-inferior-derecho',
  'gramnegativas',
  'biomecanica-extraocular',
  'cascada-coagulacion',
].map((s) => LAB + s);
const puesto = (href: string) => {
  const i = DESTACADOS.indexOf(href);
  return i === -1 ? DESTACADOS.length : i;
};

/**
 * Las tarjetas del Laboratorio: los laboratorios publicados del catálogo (los
 * que tienen `href`), una vez cada uno aunque los compartan dos cursos, y al
 * final Investigación. Primero los `DESTACADOS`; después, los del tramo del
 * alumno, como en el dashboard.
 */
export function tarjetasLaboratorio(plan: Plan): TarjetaLab[] {
  const propio = trackDelUsuario(plan);
  const porHref = new Map<string, TarjetaLab & { track: string; puesto: number }>();

  for (const tema of LAB_TOPICS) {
    const curso = tema.title.replace(/\s*\|.*$/, '');
    for (const exp of tema.experiments) {
      if (!exp.href) continue;
      const href = rutaEnEstudio(exp.href);
      if (!href) continue;
      const previa = porHref.get(href);
      if (previa) { previa.cursos.push(curso); continue; }

      const slug = exp.href.startsWith(LAB) ? exp.href.slice(LAB.length).split('?')[0] : null;
      // Un laboratorio es nivel completo; lo que no cuelga de `laboratorio/` es material del curso.
      const required = slug ? requisitoDeLab(slug) : requiredPlanDeCurso(tema.id);
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
        portada: claveDePortada(exp.href),
        acceso,
        track: trackDeCurso(tema.id),
        puesto: puesto(exp.href),
      });
    }
  }

  const delTramo = (t: { track: string }) => (propio === null || t.track === propio ? 0 : 1);
  const labs = [...porHref.values()]
    .sort((a, b) => a.puesto - b.puesto || delTramo(a) - delTramo(b))
    .map(({ track: _t, puesto: _p, ...t }) => t); // eslint-disable-line @typescript-eslint/no-unused-vars

  const investigacion: TarjetaLab = {
    id: '/estudio/laboratorio/investigacion',
    nombre: 'Investigación',
    desc: 'El curso de investigación como juego: 14 niveles con lecturas, minijuegos y un reto final por tema.',
    materia: 'Investigación',
    cursos: ['Investigación'],
    tipo: 'Investigación',
    href: '/estudio/laboratorio/investigacion',
    icono: null,
    portada: 'investigacion',
    acceso: tieneAccesoA(plan, 'interno') ? 'abierto' : 'plan',
  };
  return [...labs, investigacion];
}
