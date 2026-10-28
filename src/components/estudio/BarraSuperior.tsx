'use client';
import { useRouter } from 'next/navigation';
import { useDarkMode } from '@/components/DarkModeContext';
import { ultimaClase } from '@/lib/estudio/rutas';
import { cx, Icono } from './Icono';
import MenuCuenta from './MenuCuenta';

export type Pagina = 'study' | 'exams' | 'labs' | 'progress';

/** Tono de la luna elegido en el prototipo (`?luna=blue`). */
const LUNA = '#245b8f';

/**
 * La barra marina de arriba. Dentro de un curso, Estudiar y Mi progreso cambian
 * de vista sin salir de la página (`onPagina`); fuera (el Laboratorio), cada
 * botón navega: a la última clase abierta, a su progreso o al Laboratorio.
 */
export default function BarraSuperior({ page, onPagina, onBuscar }: {
  /** La pestaña marcada; `null` en las páginas que no son de ninguna (Mi cuenta). */
  page: Pagina | null;
  onPagina?: (p: Pagina) => void;
  onBuscar?: () => void;
}) {
  const router = useRouter();
  const { darkMode, toggleDark } = useDarkMode();
  const ir = (p: Pagina) => {
    if (p === 'exams') { if (page !== 'exams') router.push('/estudio/examenes'); return; }
    if (p === 'labs') { if (page !== 'labs' || !onPagina) router.push('/estudio/laboratorio'); return; }
    if (onPagina) { onPagina(p); return; }
    router.push(p === 'progress' ? `${ultimaClase()}#progress` : ultimaClase());
  };
  const buscar = onBuscar ?? (() => router.push(`${ultimaClase()}#buscar`));
  const enlace = (p: Pagina, label: string, icon: 'book' | 'quiz' | 'flask' | 'chart') => (
    <button className={cx('nav-link', page === p && 'active')} data-page={p} aria-label={label} title={label} aria-current={page === p ? 'page' : undefined} onClick={() => ir(p)}>
      <Icono n={icon} /><span>{label}</span>
    </button>
  );
  const etiquetaLuna = darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  return (
    <header className={cx('topbar')}>
      <button className={cx('brand')} aria-label="MedGO, ir a Estudiar" onClick={() => ir('study')}><span className={cx('brand-lockup')} aria-hidden="true" /></button>
      <nav className={cx('main-nav')} aria-label="Navegación principal">
        {enlace('study', 'Estudiar', 'book')}{enlace('exams', 'Exámenes', 'quiz')}{enlace('labs', 'Laboratorio virtual', 'flask')}{enlace('progress', 'Mi progreso', 'chart')}
      </nav>
      <div className={cx('top-tools')}>
        <button className={cx('search-launch')} aria-label="Buscar una clase o tema" onClick={buscar}>
          <Icono n="search" /><span>Buscar una clase o tema...</span><kbd>Ctrl K</kbd>
        </button>
        <div className={cx('top-account')}>
          <button className={cx('icon-button moon-toggle')} aria-label={etiquetaLuna} title={etiquetaLuna} aria-pressed={darkMode} onClick={toggleDark} style={{ '--moon-color': LUNA } as React.CSSProperties}>
            <Icono n="moon" />
          </button>
          <MenuCuenta />
        </div>
      </div>
    </header>
  );
}
