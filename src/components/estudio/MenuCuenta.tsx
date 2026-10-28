'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CORREO, WHATSAPP_TEL, WHATSAPP_URL } from '@/lib/contacto';
import { PLANES_NUEVOS } from '@/lib/plans';
import { soles } from '@/components/planes/oferta';
import { useCuenta } from './CuentaContext';
import { cx, Icono } from './Icono';

// Las tarjetas (y con ellas el SDK de Mercado Pago) sólo bajan si alguien pulsa «Elegir mi plan».
const ElegirPlan = dynamic(() => import('@/components/planes/ElegirPlan'), { ssr: false });

const DESDE = `Desde S/ ${soles(Math.min(...PLANES_NUEVOS.map((p) => p.amount)))} al mes`;

/**
 * El círculo de la cuenta y su menú: sustituye a «Mi cuenta» y «Contacto» de la
 * sidebar del dashboard. La barra superior recorta lo que se le sale (su luz),
 * así que el panel no cuelga de ella: va a su lado, `position: fixed` bajo el
 * círculo, dentro del `.wrapper` para heredar colores y fuente.
 */
export default function MenuCuenta() {
  const cuenta = useCuenta();
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const [pos, setPos] = useState({ top: 72, right: 16 });
  const [elegir, setElegir] = useState(false);
  const boton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const inicial = (cuenta.nombre.trim()[0] ?? 'M').toUpperCase();
  const nuevas = cuenta.respuestasNuevas ?? 0;

  // Bajo el círculo, alineado a su borde derecho; se recoloca si cambia la ventana.
  useLayoutEffect(() => {
    if (!abierto) return;
    const colocar = () => {
      const r = boton.current?.getBoundingClientRect();
      if (r) setPos({ top: r.bottom + 10, right: Math.max(12, window.innerWidth - r.right) });
    };
    colocar();
    window.addEventListener('resize', colocar);
    return () => window.removeEventListener('resize', colocar);
  }, [abierto]);

  // Se cierra con un clic fuera, con Esc (sin que la tecla llegue a la interfaz) y al navegar.
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panel.current?.contains(t) && !boton.current?.contains(t)) setAbierto(false);
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopImmediatePropagation();
      setAbierto(false);
      boton.current?.focus();
    };
    document.addEventListener('pointerdown', fuera);
    window.addEventListener('keydown', tecla, true);
    panel.current?.querySelector<HTMLElement>('a, button')?.focus();
    return () => { document.removeEventListener('pointerdown', fuera); window.removeEventListener('keydown', tecla, true); };
  }, [abierto]);
  useEffect(() => { setAbierto(false); }, [pathname]);

  const salir = async () => {
    await createClient().auth.signOut();
    // Navegación completa: el siguiente request lleva las cookies limpias.
    window.location.assign('/auth/login');
  };
  const abrirPlanes = () => { setAbierto(false); setElegir(true); };

  return (
    <>
      <button
        ref={boton}
        type="button"
        className={cx('avatar avatar-boton', abierto && 'is-abierto')}
        aria-label={`Tu cuenta: ${cuenta.nombre}`}
        aria-haspopup="menu"
        aria-expanded={abierto}
        title={cuenta.nombre}
        onClick={() => setAbierto((v) => !v)}
      >
        {inicial}
        {nuevas > 0 && <span className={cx('avatar-aviso')} aria-hidden="true" />}
      </button>
      {abierto && (
        <div ref={panel} className={cx('cuenta-panel')} role="menu" aria-label="Tu cuenta" style={{ top: pos.top, right: pos.right }}>
          <div className={cx('cuenta-cabecera')}>
            <span className={cx('avatar cuenta-avatar')} aria-hidden="true">{inicial}</span>
            <div className={cx('cuenta-quien')}>
              <strong>{cuenta.nombre}</strong>
              {cuenta.correo && <small>{cuenta.correo}</small>}
            </div>
          </div>
          <span className={cx('cuenta-plan', cuenta.planActivo && 'is-activo')}>
            {cuenta.planActivo && <Icono n="star" />}{cuenta.planLabel}
          </span>

          <div className={cx('cuenta-lista')}>
            <Link href="/estudio/cuenta" role="menuitem" className={cx('cuenta-item')}>
              <Icono n="user" /><span>Mi cuenta<small>Suscripción y dispositivos</small></span>
            </Link>
            {!cuenta.planActivo && (
              <button type="button" role="menuitem" className={cx('cuenta-item is-destacado')} onClick={abrirPlanes}>
                <Icono n="star" /><span>Elegir mi plan<small>{DESDE} · Visitante, Residente o Especialista</small></span>
              </button>
            )}
            {cuenta.verAportes && (
              <Link href="/estudio/aportes" role="menuitem" className={cx('cuenta-item')}>
                <Icono n="chart" /><span>Avance y aportes</span>
              </Link>
            )}
            {cuenta.isAdmin && (
              <>
                <Link href={nuevas ? '/estudio/admin#mensajes' : '/estudio/admin'} role="menuitem" className={cx('cuenta-item')}>
                  <Icono n="target" /><span>Panel de administración</span>
                  {nuevas > 0 && <span className={cx('cuenta-contador')} aria-label={`${nuevas} ${nuevas === 1 ? 'respuesta nueva' : 'respuestas nuevas'}`}>{nuevas}</span>}
                </Link>
                <Link href="/estudio/modelado" role="menuitem" className={cx('cuenta-item')}>
                  <Icono n="cube" /><span>Modelado 3D</span>
                </Link>
              </>
            )}
            <Link href="/dashboard/home" role="menuitem" className={cx('cuenta-item')}>
              <Icono n="grid" /><span>Dashboard clásico<small>La vista anterior de MedGO</small></span>
            </Link>
          </div>

          <div className={cx('cuenta-contacto')}>
            <div className={cx('eyebrow')}>Contacto</div>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener" role="menuitem" className={cx('cuenta-item')}>
              <Icono n="chat" /><span>WhatsApp<small>{WHATSAPP_TEL}</small></span>
            </a>
            <a href={`mailto:${CORREO}`} role="menuitem" className={cx('cuenta-item')}>
              <Icono n="mail" /><span>Correo<small>{CORREO}</small></span>
            </a>
          </div>

          <button type="button" role="menuitem" className={cx('cuenta-item cuenta-salir')} onClick={salir}>
            <Icono n="logout" /><span>Cerrar sesión</span>
          </button>
        </div>
      )}
      {elegir && <ElegirPlan onClose={() => setElegir(false)} />}
    </>
  );
}
