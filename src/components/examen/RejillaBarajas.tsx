'use client';

import { NIVELES_BARAJA, type NivelBaraja } from '@/lib/barajas';
import s from '@/styles/rejillaBarajas.module.css';

/**
 * Las barajas agrupadas por nivel, cada una como un mazo teñido: hecha (verde,
 * cheque y nota), la siguiente (aro con onda), bloqueada (candado) o gratis.
 * La comparten el examen 3D (`ExamenMS`) y sus tarjetas (`TarjetasRunner`).
 */

export interface ItemBaraja {
  firma: string;
  numero: number;
  nivel: NivelBaraja;
  /** Si está hecha, su último resultado («16/20»). */
  nota?: string | null;
  bloqueada?: boolean;
  /** Abierta en la prueba gratis (solo se rotula a quien no tiene el plan). */
  gratis?: boolean;
}

const TINTE: Record<NivelBaraja, string> = { oficial: s.tinteOficial, muy_probable: s.tinteProbable, posible: s.tintePosible };

export default function RejillaBarajas({ items, sugerida, pie, onElegir, porNivel = true }: {
  items: ItemBaraja[];
  /** Firma de la siguiente que toca. */
  sugerida?: string | null;
  /** Lo que se lee bajo el número de una baraja pendiente («10 preg.»). */
  pie: string;
  onElegir: (item: ItemBaraja) => void;
  /**
   * Agrupadas y teñidas por nivel (examen 3D). Sin esto, una sola lista en orden
   * y de un solo color: el número ya dice cuál es más probable (tarjetas de 30,
   * donde casi todas las barajas caerían en «Posibles»).
   */
  porNivel?: boolean;
}) {
  const grupos = porNivel
    ? NIVELES_BARAJA.map(({ nivel, titulo }) => ({ clave: nivel, titulo, lista: items.filter((b) => b.nivel === nivel) }))
    : [{ clave: 'todas', titulo: null, lista: items }];
  return (
    <div className={s.rejilla}>
      {grupos.map(({ clave, titulo, lista: delNivel }) => {
        if (!delNivel.length) return null;
        return (
          <div key={clave} className={s.grupo}>
            {titulo && <p className={s.grupoTitulo}>{titulo}</p>}
            <div className={s.lista}>
              {delNivel.map((b) => {
                const hecha = !b.bloqueada && !!b.nota;
                const esSugerida = b.firma === sugerida;
                const clases = [
                  s.baraja,
                  porNivel ? TINTE[b.nivel] : s.tinteProbable,
                  hecha ? s.hecha : '',
                  esSugerida ? s.sugerida : '',
                  b.bloqueada ? s.bloqueada : '',
                ].join(' ');
                return (
                  <button
                    key={b.firma}
                    type="button"
                    className={clases}
                    onClick={() => onElegir(b)}
                    title={b.bloqueada ? `La baraja ${b.numero} es parte del plan` : hecha ? `Repetir la baraja ${b.numero}` : `Hacer la baraja ${b.numero}`}
                    aria-label={
                      b.bloqueada ? `Baraja ${b.numero}, bloqueada. Ver el plan.`
                        : hecha ? `Baraja ${b.numero}, hecha: ${b.nota}. Repetir.`
                          : `Baraja ${b.numero}${esSugerida ? ', la siguiente' : ''}`
                    }
                  >
                    {hecha && (
                      <span className={s.cheque} aria-hidden>
                        <svg width="10" height="10" viewBox="0 0 24 24"><path d="M5 12.5 10 17.5 19 7" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                    )}
                    {b.gratis && !hecha && <span className={s.gratis}>Gratis</span>}
                    <span className={s.numero}>{b.numero}</span>
                    {b.bloqueada ? (
                      <svg className={s.candado} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <rect x="4" y="11" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2.4" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                      </svg>
                    ) : hecha ? <span className={s.nota}>{b.nota}</span>
                      : esSugerida ? <span className={s.sigue}>Sigue</span>
                        : <span className={s.pie}>{pie}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
