'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Mascota, { type OrdenMascota } from '@/components/landing-nueva/Mascota';
import { ASISTENTE } from '@/components/landing-nueva/datos';
import s from '@/styles/estudio/grimi.module.css';

/**
 * GRIMI, la mascota de la landing, abajo a la derecha de la interfaz de estudio: la
 * puerta a MedGO IA. Es la misma `Mascota` en modo cursor, con ratos libres (de vez en
 * cuando hace lo suyo en vez de seguir al puntero). Al pulsarla saluda un rato a su aire
 * y abre su globo, donde el texto sale como si lo dijera él (letra a letra, con pausas en
 * las comas y los puntos) mientras asiente; el globo entra y sale con animación.
 * Mientras la IA no esté conectada aquí, el globo cuenta que viene en camino.
 */

const SALUDO = `¡Hola! Soy ${ASISTENTE}, la IA de MedGO.`;
const MENSAJE = 'Todavía estoy aprendiendo. Muy pronto te explicaré tus resúmenes, sus figuras y cada mecanismo, y te ayudaré a armar tu ruta de estudio.';
const TEXTO = `${SALUDO}\n${MENSAJE}`;

/** Lo que tarda en «decir» cada letra: una pausa tras la coma y otra más larga tras el punto. */
const pausaTras = (letra: string) => (letra === ',' ? 150 : '.!?'.includes(letra) ? 340 : letra === '\n' ? 260 : 24);

type Fase = 'cerrado' | 'abierto' | 'saliendo';

export default function Grimi({ subir = false, sobreBarra = false }: {
  /** El aviso de respuestas del admin ocupa la esquina: GRIMI sube encima. */
  subir?: boolean;
  /** Exámenes en el teléfono: hay una barra fija abajo. */
  sobreBarra?: boolean;
}) {
  const [fase, setFase] = useState<Fase>('cerrado');
  const [letras, setLetras] = useState(0);
  const [orden, setOrden] = useState<OrdenMascota>({ n: 0, tipo: 'saludo' });
  const caja = useRef<HTMLDivElement>(null);
  const reducido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  const cerrar = useCallback(() => {
    setOrden((o) => ({ n: o.n + 1, tipo: 'adios' }));
    setFase(reducido() ? 'cerrado' : 'saliendo');
  }, []);
  const abrir = () => {
    setOrden((o) => ({ n: o.n + 1, tipo: 'saludo' }));
    setLetras(reducido() ? TEXTO.length : 0);
    setFase('abierto');
  };

  // El texto sale letra a letra, como si lo dijera.
  useEffect(() => {
    if (fase !== 'abierto' || letras >= TEXTO.length) return;
    const t = window.setTimeout(() => setLetras((n) => n + 1), letras ? pausaTras(TEXTO[letras - 1]) : 380);
    return () => clearTimeout(t);
  }, [fase, letras]);

  useEffect(() => {
    if (fase !== 'abierto') return;
    const fuera = (e: PointerEvent) => { if (!caja.current?.contains(e.target as Node)) cerrar(); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') cerrar(); };
    document.addEventListener('pointerdown', fuera);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('pointerdown', fuera);
      document.removeEventListener('keydown', esc);
    };
  }, [fase, cerrar]);

  const hablando = fase === 'abierto' && letras < TEXTO.length;
  // Cada letra re-renderiza el globo: la mascota sólo cuando cambia lo que se le pide.
  const mascota = useMemo(
    () => <Mascota pausado={false} cls={s.mascota} detalle={1} ratos orden={orden} hablando={hablando} />,
    [orden, hablando],
  );
  // Lo ya dicho en tinta y el resto invisible: el globo tiene su tamaño final desde el principio.
  const parte = (desde: number, texto: string) => {
    const dichas = Math.max(0, Math.min(texto.length, letras - desde));
    return (<>{texto.slice(0, dichas)}<span className={s.porDecir}>{texto.slice(dichas)}</span></>);
  };

  return (
    <div ref={caja} className={`${s.caja} ${subir ? s.subir : ''} ${sobreBarra ? s.sobreBarra : ''}`}>
      {fase !== 'cerrado' && (
        <div
          className={`${s.globo} ${fase === 'saliendo' ? s.globoSale : ''}`}
          onAnimationEnd={(e) => { if (e.target === e.currentTarget && fase === 'saliendo') setFase('cerrado'); }}
        >
          <div className={s.cabecera}>
            <span className={s.nombre}>{ASISTENTE}</span>
            <span className={s.chip}>IA · en camino</span>
            <button type="button" className={s.cerrar} onClick={cerrar} aria-label="Cerrar">
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            </button>
          </div>
          <div aria-hidden="true">
            <p className={s.saludo}>{parte(0, SALUDO)}</p>
            <p className={s.mensaje}>{parte(SALUDO.length + 1, MENSAJE)}</p>
          </div>
          <p className={s.soloLector} role="status">{fase === 'abierto' ? `${SALUDO} ${MENSAJE}` : ''}</p>
        </div>
      )}
      <button
        type="button"
        className={s.boton}
        onClick={() => (fase === 'abierto' ? cerrar() : abrir())}
        aria-expanded={fase === 'abierto'}
        aria-label={`${ASISTENTE}, la IA de MedGO`}
      >
        {mascota}
      </button>
    </div>
  );
}
