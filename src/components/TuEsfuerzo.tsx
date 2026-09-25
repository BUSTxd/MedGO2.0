'use client';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import panel from '@/styles/dashboardPages.module.css';
import styles from '@/styles/tuEsfuerzo.module.css';
import { RACHA_INVOCAR, SPRITE_CIRCULO, SPRITE_CELULA } from '@/lib/esfuerzo';
import { useEsAdmin } from './EsAdminContext';
import { setCursorCelula, useCursorCelula } from './CursorCelula';

// La tarjeta solo la descarga quien ya puede invocar (se precarga al aparecer el botón).
const cargarFelicidades = () => import('./FelicidadesEsfuerzo');
const FelicidadesEsfuerzo = dynamic(cargarFelicidades, { ssr: false });

// reposo → iluminando (el círculo se carga de luz y el POST viaja a la vez)
// → revelando (destello que se apaga sobre la célula) → celebrando (tarjeta).
type Fase = 'reposo' | 'iluminando' | 'revelando' | 'celebrando';

const DURACION_ILUMINAR = 1600;
const DURACION_REVELAR = 900;

const espera = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * `invocado` en null mientras el perfil no ha llegado: no se pinta ningún
 * sprite hasta saberlo, para no bajar el círculo a quien ya tiene la célula.
 */
export default function TuEsfuerzo({
  streak,
  invocado,
  onInvocado,
}: {
  streak: number | null;
  invocado: boolean | null;
  onInvocado: () => void;
}) {
  const esAdmin = useEsAdmin();
  const [fase, setFase] = useState<Fase>('reposo');
  const [error, setError] = useState(false);
  // Modo prueba (solo admin): pinta el panel como si tuviera la racha y aún no
  // hubiera invocado, y la invocación no llama a la API ni toca la DB.
  const [prueba, setPrueba] = useState(false);
  const enCurso = useRef(false);
  const cursorActivo = useCursorCelula();

  const invocadoVisto = prueba ? false : invocado;
  const listo = prueba || (invocado === false && (streak ?? 0) >= RACHA_INVOCAR);
  const muestraCelula = invocadoVisto === true || fase === 'revelando' || fase === 'celebrando';

  // Célula y tarjeta solo se bajan cuando ya se puede invocar (racha ≥ 20 o
  // prueba del admin), y antes del clic: así están listas al apagarse el destello.
  useEffect(() => {
    if (!listo) return;
    const img = new window.Image();
    img.src = SPRITE_CELULA;
    void cargarFelicidades();
  }, [listo]);

  async function invocar() {
    if (enCurso.current) return;
    enCurso.current = true;
    setError(false);
    setFase('iluminando');
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const peticion = prueba
      ? Promise.resolve(true)
      : fetch('/api/esfuerzo/invocar', { method: 'POST' })
          .then((r) => r.ok)
          .catch(() => false);
    const [ok] = await Promise.all([peticion, espera(reducido ? 0 : DURACION_ILUMINAR)]);

    if (!ok) {
      setFase('reposo');
      setError(true);
      enCurso.current = false;
      return;
    }
    setFase('revelando');
    await espera(reducido ? 0 : DURACION_REVELAR);
    setFase('celebrando');
  }

  function cerrar() {
    setFase('reposo');
    enCurso.current = false;
    // La prueba se deshace al cerrar: el panel vuelve a tu estado real.
    if (prueba) setPrueba(false);
    else onInvocado();
  }

  const texto = muestraCelula ? 'Tu esfuerzo se materializó' : 'Tu esfuerzo está invocando algo';
  const pista = muestraCelula
    ? 'Sigue mejorando para que evolucione junto a ti'
    : `Se terminará de invocar al nivel ${RACHA_INVOCAR} de racha en MedGO`;

  return (
    <div className={`${panel.dashboardPanel} ${styles.panel}`}>
      <h3 className={panel.dashboardPanelTitle}>Tu esfuerzo</h3>
      {esAdmin && fase === 'reposo' && (
        <button
          type="button"
          className={styles.probar}
          onClick={() => { setError(false); setPrueba((p) => !p); }}
        >
          {prueba ? 'Salir de la prueba' : 'Probar'}
        </button>
      )}
      <div className={styles.linea}>
        <p className={styles.texto}>{texto}</p>
        <span className={styles.ayuda} tabIndex={0} aria-describedby="esfuerzo-pista">
          ?
        </span>
        <span id="esfuerzo-pista" role="tooltip" className={styles.pista}>
          {pista}
        </span>
      </div>

      <div className={styles.escena} data-fase={fase}>
        {invocadoVisto !== null && (
          <div
            className={muestraCelula ? styles.spriteCelula : styles.spriteCirculo}
            style={{ backgroundImage: `url('${muestraCelula ? SPRITE_CELULA : SPRITE_CIRCULO}')` }}
            aria-hidden="true"
          />
        )}
        {(fase === 'iluminando' || fase === 'revelando') && (
          <div className={styles.luz} aria-hidden="true" />
        )}
        {listo && fase === 'reposo' && (
          <button type="button" className={styles.invocar} onClick={invocar}>
            Invocar
          </button>
        )}
        {/* También si el puntero quedó puesto desde una prueba del admin: así
            siempre hay por dónde quitarlo. */}
        {fase === 'reposo' && (invocadoVisto === true || cursorActivo) && (
          <button
            type="button"
            className={styles.punteroChip}
            aria-pressed={cursorActivo}
            onClick={() => setCursorCelula(!cursorActivo)}
          >
            {cursorActivo ? 'Quitar puntero' : 'Usar como puntero'}
          </button>
        )}
      </div>
      {error && <p className={styles.error}>No se pudo invocar. Inténtalo de nuevo.</p>}

      {fase === 'celebrando' && <FelicidadesEsfuerzo onCerrar={cerrar} />}
    </div>
  );
}
