'use client';
import { useEffect, useRef, useState } from 'react';
import Mascota from '@/components/landing-nueva/Mascota';
import { ASISTENTE } from '@/components/landing-nueva/datos';
import s from '@/styles/estudio/grimi.module.css';

/**
 * GRIMI, la mascota de la landing, abajo a la derecha de la interfaz de estudio: la
 * puerta a MedGO IA. Es la misma `Mascota` en modo cursor (sigue al puntero, parpadea,
 * echa un vistazo si el puntero se queda quieto y se alegra al pulsarla). Mientras la
 * IA no esté conectada aquí, pulsarla abre un globo que lo cuenta.
 */
export default function Grimi({ subir = false, sobreBarra = false }: {
  /** El aviso de respuestas del admin ocupa la esquina: GRIMI sube encima. */
  subir?: boolean;
  /** Exámenes en el teléfono: hay una barra fija abajo. */
  sobreBarra?: boolean;
}) {
  const [globo, setGlobo] = useState(false);
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!globo) return;
    const fuera = (e: PointerEvent) => { if (!caja.current?.contains(e.target as Node)) setGlobo(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setGlobo(false); };
    document.addEventListener('pointerdown', fuera);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('pointerdown', fuera);
      document.removeEventListener('keydown', esc);
    };
  }, [globo]);

  return (
    <div ref={caja} className={`${s.caja} ${subir ? s.subir : ''} ${sobreBarra ? s.sobreBarra : ''}`}>
      {globo && (
        <div className={s.globo} role="status">
          <strong>Hola, soy {ASISTENTE}</strong>
          <p>La IA de MedGO. Estoy aprendiendo: muy pronto te explicaré tus resúmenes, sus figuras y cada mecanismo, y te ayudaré a armar tu ruta de estudio.</p>
        </div>
      )}
      <button
        type="button"
        className={s.boton}
        onClick={() => setGlobo((g) => !g)}
        aria-expanded={globo}
        aria-label={`${ASISTENTE}, la IA de MedGO`}
      >
        <Mascota pausado={false} cls={s.mascota} detalle={1} />
      </button>
    </div>
  );
}
