'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { rutaEnEstudio } from '@/lib/estudio/rutas';
import panel from '@/styles/dashboardLayout.module.css';
import { cx } from './Icono';
import BarraSuperior, { type Pagina } from './BarraSuperior';

/**
 * Un laboratorio (o Mi cuenta) dentro de la interfaz de estudio: la barra marina arriba y,
 * debajo, el mismo panel blanco del dashboard (`.panel`, con su modo oscuro).
 *
 * El laboratorio va FUERA del `.wrapper` de la interfaz a propósito: ese
 * contenedor devuelve los márgenes del navegador que `globals.css` borra, y los
 * laboratorios están maquetados contando con el reset del dashboard.
 *
 * Sus enlaces internos siguen apuntando al dashboard («← Laboratorio virtual»,
 * los niveles de Investigación, los módulos de Física). En vez de tocar cada
 * laboratorio, el marco los intercepta en la fase de captura —antes de que el
 * <Link> de Next los procese— y navega a la misma pieza dentro de /estudio.
 */
export default function MarcoLab({ children, pagina = 'labs' }: { children: React.ReactNode; pagina?: Pagina | null }) {
  const router = useRouter();
  const main = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = main.current;
    if (!el) return;
    const alClic = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest?.('a');
      const href = a?.getAttribute('href');
      if (!a || !href || a.target === '_blank') return;
      const destino = rutaEnEstudio(href);
      if (!destino) return;
      e.preventDefault();
      e.stopPropagation();
      router.push(destino);
    };
    el.addEventListener('click', alClic, true);
    return () => el.removeEventListener('click', alClic, true);
  }, [router]);

  return (
    <>
      <div className={cx('wrapper')} data-palette="pearl">
        <BarraSuperior page={pagina} />
      </div>
      <main ref={main} className={cx('lab-main')}>
        <div className={`${panel.panel} ${cx('lab-panel')}`}>{children}</div>
      </main>
    </>
  );
}
