import type { Track } from '@/lib/plans';
import { CURSOS, LABORATORIOS } from '@/lib/data/aportes';
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
  estado: SlotEstado;
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
  items: ItemRegistro[];
}

/**
 * Un slot se puede marcar cuando la tarjeta existe para esa actividad. Lo que
 * «no aplica» no se ofrece —no hay nada que subir ahí— y el vídeo tampoco, que
 * es material a futuro; una simulación ya publicada sí, porque es trabajo real
 * hecho por alguien.
 */
function marcable(estado: SlotEstado, kind: SlotMarca): boolean {
  if (estado === 'no-aplica') return false;
  if (kind === 'apoyo') return estado === 'listo';
  return true;
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
          if (marcable(s.estado, s.kind)) {
            slots.push({ slot: s.kind, label: s.label, estado: s.estado });
          }
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

    return {
      ambito: 'curso' as const,
      scopeId: meta.slug,
      nombre: meta.nombre,
      track: meta.track,
      items,
    };
  }).filter((g) => g.items.length > 0);
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
      slots: [{ slot: 'material' as const, label: 'Laboratorio', estado: 'listo' as const }],
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
      slots: [{ slot: 'material' as const, label: 'Láminas', estado: 'listo' as const }],
    })),
  }));
}
