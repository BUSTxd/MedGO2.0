import type { Track } from '@/lib/plans';
import { CURSOS, LABORATORIOS, PRIORIDAD_LANZAMIENTO } from '@/lib/data/aportes';
import { HISTO_CURSOS } from '@/lib/data/histologia';
import { SILABOS } from '@/lib/data/silabos';
import { planDeActividad, type SlotEstado } from '@/lib/material-plan';
import type { AmbitoMarca, SlotMarca } from '@/lib/aportes-marcas';

/**
 * Inventario de todo lo que se puede marcar como aporte.
 *
 * Lo construye el servidor a partir de las mismas fuentes que el recuento de
 * cobertura (sílabos, `LABORATORIOS`, `HISTO_CURSOS`) y lo pasa **plano** al
 * componente cliente: sin ReactNode ni funciones, sólo texto e ids, porque
 * `HISTO_CURSOS` trae íconos JSX que no cruzan la frontera servidor→cliente.
 */

export interface SlotRegistro {
  slot: SlotMarca;
  /** Nombre tal como lo ve el alumno: «Resumen», «Propuestos», «Simulación». */
  label: string;
}

export interface ItemRegistro {
  id: string;
  codigo?: string;
  titulo: string;
  /** Unidad o semana del sílabo, para ubicar la fila. */
  bloque?: string;
  slots: SlotRegistro[];
}

export interface GrupoRegistro {
  ambito: AmbitoMarca;
  scopeId: string;
  nombre: string;
  track?: Track;
  /**
   * Posición en `PRIORIDAD_LANZAMIENTO`, o `null` si no bloquea el lanzamiento.
   * El selector la usa para que Física, Química y Biología salgan primero: son
   * los cursos donde marcar tiene consecuencias ahora, no dentro de un año.
   */
  prioridad?: number | null;
  items: ItemRegistro[];
}

/**
 * Sólo se marca lo que ya está publicado.
 *
 * Un círculo sobre material que todavía no existe no tiene dueño posible: la
 * fila invitaba a reclamar algo que nadie ha subido, y en el panel parecía que
 * ese material estaba en la web. Un hueco pendiente se ve en la cobertura de
 * arriba, no aquí.
 */
function marcable(estado: SlotEstado): boolean {
  return estado === 'listo';
}

export function getRegistroCursos(): GrupoRegistro[] {
  return CURSOS.map((meta) => {
    const items: ItemRegistro[] = [];

    for (const semana of SILABOS[meta.slug] ?? []) {
      for (const act of semana.actividades) {
        const plan = planDeActividad(meta.slug, act);
        if (plan.invitacion) continue;   // no va a tener material propio

        const slots: SlotRegistro[] = [];
        for (const s of [plan.resumen, plan.banqueo, plan.apoyo]) {
          if (marcable(s.estado)) slots.push({ slot: s.kind, label: s.label });
        }
        if (slots.length === 0) continue;

        items.push({
          id: plan.id,
          codigo: plan.codigo,
          titulo: plan.titulo,
          bloque: semana.titulo,
          slots,
        });
      }
    }

    const prioridad = PRIORIDAD_LANZAMIENTO.indexOf(meta.slug);

    return {
      ambito: 'curso' as const,
      scopeId: meta.slug,
      nombre: meta.nombre,
      track: meta.track,
      prioridad: prioridad === -1 ? null : prioridad,
      items,
    };
  })
    .filter((g) => g.items.length > 0)
    // Los prioritarios primero y en su orden declarado; detrás, el resto por
    // nombre. El selector los reparte luego en su columna por tramo.
    .sort((a, b) => {
      const pa = a.prioridad ?? Number.MAX_SAFE_INTEGER;
      const pb = b.prioridad ?? Number.MAX_SAFE_INTEGER;
      return pa !== pb ? pa - pb : a.nombre.localeCompare(b.nombre, 'es');
    });
}

/** Los laboratorios son piezas enteras: un solo círculo por lab. */
export function getRegistroLabs(): GrupoRegistro {
  return {
    ambito: 'laboratorio',
    scopeId: 'labs',
    nombre: 'Laboratorio virtual',
    items: LABORATORIOS.map((lab) => ({
      id: lab.slug,
      titulo: lab.nombre,
      bloque: lab.pesado ? 'Simulación 3D / interactiva' : 'Atlas o minijuego',
      slots: [{ slot: 'material' as const, label: 'Laboratorio' }],
    })),
  };
}

/** En histología se marca por clase: cada carpeta de láminas la subió alguien. */
export function getRegistroHistologia(): GrupoRegistro[] {
  return HISTO_CURSOS.map((curso) => ({
    ambito: 'histologia' as const,
    scopeId: curso.id,
    nombre: curso.badge,
    items: curso.clases.map((clase) => ({
      id: clase.slug,
      titulo: clase.titulo,
      slots: [{ slot: 'material' as const, label: 'Láminas' }],
    })),
  }));
}
