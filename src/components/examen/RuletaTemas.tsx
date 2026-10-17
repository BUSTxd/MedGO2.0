'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { IconoCandado } from './CortePremium';
import styles from '@/styles/ruletaTemas.module.css';

export interface TemaRuleta {
  id: string;
  label: string;
  total: number;
  /** Preguntas que puede hacer sin plan (la muestra). */
  gratis: number;
}

interface Props {
  temas: TemaRuleta[];
  /** Con el plan del curso todo tema se puede elegir; sin él, solo los de muestra. */
  acceso: boolean;
  onEmpezar: (tema: TemaRuleta) => void;
  onPagar: () => void;
}

const R = 250; // radio del disco en unidades del viewBox (500 × 500)
const GIRO_MS = 4200;

/** Dos renglones de ≤ 17 caracteres: lo que cabe a lo largo de un sector. */
function renglones(label: string): string[] {
  const corto = label.split(':')[0];
  const palabras = corto.split(' ');
  const lineas: string[] = [''];
  for (const p of palabras) {
    const actual = lineas[lineas.length - 1];
    if (!actual) lineas[lineas.length - 1] = p;
    else if ((actual + ' ' + p).length <= 17) lineas[lineas.length - 1] = actual + ' ' + p;
    else if (lineas.length < 2) lineas.push(p);
    else { lineas[1] = lineas[1].replace(/…?$/, '…'); break; }
  }
  return lineas;
}

const puntoEn = (ang: number, r: number) => {
  const a = (ang - 90) * (Math.PI / 180);
  return [250 + r * Math.cos(a), 250 + r * Math.sin(a)];
};

/**
 * Ruleta de temas del modo «por temas». El disco gira con `transform` (sin
 * estado por fotograma): «Girar» lo lanza con varias vueltas y frena sobre un
 * tema al azar; también se arrastra con el dedo/ratón y, al soltar, encaja en
 * el sector más cercano; o se toca un sector para ir directo a él. El puntero
 * está arriba: el tema elegido es el sector que queda bajo él.
 */
export default function RuletaTemas({ temas, acceso, onEmpezar, onPagar }: Props) {
  const n = temas.length;
  const paso = 360 / n;
  const discoRef = useRef<SVGGElement>(null);
  const giro = useRef(0);          // rotación acumulada del disco, en grados
  const arrastre = useRef<{ x0: number; y0: number; a0: number; g0: number; movio: boolean } | null>(null);
  const [elegido, setElegido] = useState<number | null>(null);
  const [girando, setGirando] = useState(false);

  const disponible = useCallback((i: number) => acceso || temas[i].gratis > 0, [acceso, temas]);

  const aplicar = (grados: number, ms: number) => {
    const g = discoRef.current;
    if (!g) return;
    g.style.transition = ms ? `transform ${ms}ms cubic-bezier(0.15, 0.7, 0.12, 1)` : 'none';
    g.style.transform = `rotate(${grados}deg)`;
    giro.current = grados;
  };

  /** Sector bajo el puntero con el disco girado `grados`. */
  const sectorEn = (grados: number) => {
    const bajo = ((-grados % 360) + 360) % 360; // ángulo del disco que queda arriba
    return Math.floor((bajo + paso / 2) / paso) % n;
  };

  const irA = (i: number, vueltas: number, ms: number) => {
    const actual = giro.current;
    const objetivoMod = (-(i * paso)) % 360;
    let destino = actual - (((actual - objetivoMod) % 360) + 360) % 360; // el más cercano hacia atrás
    destino -= vueltas * 360;
    if (vueltas === 0 && actual - destino > 180) destino += 360;
    const reducido = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dur = reducido ? 0 : ms;
    setGirando(dur > 0);
    setElegido(null);
    aplicar(destino, dur);
    window.setTimeout(() => { setGirando(false); setElegido(i); }, dur + 30);
  };

  const girar = () => {
    if (girando) return;
    const posibles = temas.map((_, i) => i).filter(disponible);
    if (!posibles.length) return;
    // Los temas que más salen pesan más: la suerte se inclina hacia lo probable.
    const pesos = posibles.map((i) => Math.sqrt(temas[i].total));
    let r = Math.random() * pesos.reduce((a, b) => a + b, 0);
    let k = 0;
    while (r > pesos[k]) { r -= pesos[k]; k++; }
    irA(posibles[Math.min(k, posibles.length - 1)], 5, GIRO_MS);
  };

  // Arrastre: el ángulo del puntero respecto al centro mueve el disco 1:1.
  const angulo = (e: React.PointerEvent, svg: SVGSVGElement) => {
    const b = svg.getBoundingClientRect();
    return Math.atan2(e.clientY - (b.top + b.height / 2), e.clientX - (b.left + b.width / 2)) * (180 / Math.PI);
  };
  const onDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (girando) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    arrastre.current = { x0: e.clientX, y0: e.clientY, a0: angulo(e, e.currentTarget), g0: giro.current, movio: false };
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const a = arrastre.current;
    if (!a) return;
    if (!a.movio && Math.hypot(e.clientX - a.x0, e.clientY - a.y0) < 6) return;
    a.movio = true;
    setElegido(null);
    aplicar(a.g0 + angulo(e, e.currentTarget) - a.a0, 0);
  };
  const onUp = (e: React.PointerEvent<SVGSVGElement>) => {
    const a = arrastre.current;
    arrastre.current = null;
    if (!a) return;
    if (a.movio) { irA(sectorEn(giro.current), 0, 420); return; }
    // Un toque sin arrastre: el sector tocado viene al puntero.
    const sector = (e.target as Element).closest('[data-sector]')?.getAttribute('data-sector');
    if (sector != null) irA(Number(sector), 0, 700);
  };

  useEffect(() => { aplicar(0, 0); }, []);

  const t = elegido != null ? temas[elegido] : null;
  const tDisponible = elegido != null && disponible(elegido);

  return (
    <div className={styles.escena}>
      <p className={styles.kicker}>Modo por temas</p>
      <h2 className={styles.titulo}>Gira la ruleta o elige tu tema</h2>
      <p className={styles.sub}>Ordenados de los que más salen en los exámenes a los que menos. Arrastra el disco o toca un sector para escoger a mano.</p>

      <div className={`${styles.ruleta} ${girando ? styles.ruletaGirando : ''}`}>
        <div className={styles.puntero} aria-hidden />
        <svg
          viewBox="0 0 500 500"
          className={styles.svg}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={() => { arrastre.current = null; }}
          role="listbox"
          aria-label="Ruleta de temas"
        >
          <g ref={discoRef} className={styles.disco}>
            {temas.map((tema, i) => {
              const a0 = i * paso - paso / 2;
              const a1 = a0 + paso;
              const [x0, y0] = puntoEn(a0, R);
              const [x1, y1] = puntoEn(a1, R);
              const libre = disponible(i);
              const lineas = renglones(tema.label);
              return (
                <g key={tema.id} data-sector={i} className={libre ? styles.sector : styles.sectorCerrado}
                   style={{ '--h': Math.round((i * 360) / n) } as React.CSSProperties}
                   role="option" aria-selected={elegido === i} aria-label={tema.label}>
                  <path d={`M250 250 L${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1} Z`} className={styles.cuna} />
                  <g transform={`rotate(${i * paso} 250 250)`}>
                    <text x="250" y="62" className={styles.rotulo} textAnchor="middle">
                      {lineas.map((l, k) => (
                        <tspan key={k} x="250" dy={k === 0 ? 0 : 15}>{l}</tspan>
                      ))}
                    </text>
                    {libre ? (
                      <text x="250" y="122" className={styles.cifra} textAnchor="middle">{tema.total}</text>
                    ) : (
                      <g transform="translate(243 104)" className={styles.candado}>
                        <rect x="0" y="7" width="14" height="10" rx="2.2" />
                        <path d="M3.2 7V5a3.8 3.8 0 0 1 7.6 0v2" fill="none" strokeWidth="2" />
                      </g>
                    )}
                  </g>
                </g>
              );
            })}
          </g>
          <circle cx="250" cy="250" r="62" className={styles.eje} />
        </svg>
        <button type="button" className={styles.botonGirar} onClick={girar} disabled={girando}>
          {girando ? '…' : 'Girar'}
        </button>
      </div>

      <div className={styles.resultado} aria-live="polite">
        {t ? (
          <div key={t.id} className={styles.tarjeta}>
            <span className={styles.tarjetaKicker}>Te tocó</span>
            <strong className={styles.tarjetaTema}>{t.label}</strong>
            <span className={styles.tarjetaCifra}>
              {tDisponible
                ? `${acceso ? t.total : t.gratis} pregunta${(acceso ? t.total : t.gratis) === 1 ? '' : 's'}${!acceso && t.gratis < t.total ? ` de ${t.total} · el resto con el plan` : ''}`
                : `${t.total} preguntas con el plan`}
            </span>
            <div className={styles.tarjetaBotones}>
              {tDisponible ? (
                <button type="button" className={styles.empezar} onClick={() => onEmpezar(t)}>Empezar</button>
              ) : (
                <button type="button" className={styles.pagar} onClick={onPagar}><IconoCandado size={13} /> Desbloquear</button>
              )}
              <button type="button" className={styles.otraVez} onClick={girar}>Girar otra vez</button>
            </div>
          </div>
        ) : (
          <p className={styles.espera}>{girando ? 'Girando…' : 'Pulsa «Girar» para dejarlo a la suerte.'}</p>
        )}
      </div>
    </div>
  );
}
