'use client';
import { c } from './estilos';

/** Un icono del sprite de la página (`<symbol id="i-…">` en `SimbolosSvg`). */
export function Ico({ id, cls }: { id: string; cls?: string }) {
  return <svg className={c('icon', cls)} aria-hidden="true"><use href={`#${id}`} /></svg>;
}

/** Flechas, Inicio y Fin entre pestañas (el `wireTabs` del prototipo). */
export function teclasDePestanas<T>(e: React.KeyboardEvent, ids: T[], actual: T, elegir: (t: T) => void) {
  const i = ids.indexOf(actual);
  let sig: number;
  if (e.key === 'ArrowRight') sig = (i + 1) % ids.length;
  else if (e.key === 'ArrowLeft') sig = (i - 1 + ids.length) % ids.length;
  else if (e.key === 'Home') sig = 0;
  else if (e.key === 'End') sig = ids.length - 1;
  else return;
  e.preventDefault();
  elegir(ids[sig]);
  const lista = (e.currentTarget as HTMLElement).parentElement;
  requestAnimationFrame(() => lista?.querySelectorAll<HTMLElement>('[role="tab"]')[sig]?.focus());
}
