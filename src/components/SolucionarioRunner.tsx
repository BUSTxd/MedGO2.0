'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import type { Bloque, Solucionario } from '@/lib/data/solucionarios';
import SolucionarioEsquema from './SolucionarioEsquema';
import styles from '@/styles/solucionario.module.css';

const PdfViewer = dynamic(() => import('./PdfViewer'), {
  ssr: false,
  loading: () => <div className={styles.pdfLoading}>Cargando enunciado…</div>,
});

/*
 * 100% = el ancho útil del panel (el widthOverride ya descuenta su padding), así
 * que arranca ahí: llena la columna sin desbordar. Por encima el canvas crece de
 * verdad y aparece scroll horizontal — necesario en un panel de media pantalla
 * para leer los diagramas de orbitales.
 */
const ZOOM_LEVELS = [0.6, 0.75, 0.9, 1, 1.25, 1.5, 2, 2.5, 3];
const DEFAULT_ZOOM_INDEX = 3; // 100%

interface Props {
  solucionario: Solucionario;
  /** Ruta de la clase, para el botón «Volver». */
  backHref: string;
}

const FlechaIcon = ({ atras = false }: { atras?: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    style={atras ? { transform: 'scaleX(-1)' } : undefined}
  >
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Color del rótulo de una opción. No todas las preguntas se responden con
 * «Cierto/Falso»: hay «Sí participa» / «No participa» y opciones simplemente
 * descartables, que no son falsas pero tampoco la respuesta.
 */
function tonoVeredicto(veredicto: string): string {
  const t = veredicto.trim().toLowerCase();
  if (/^(cier|verdad|correct|sí|válid)/.test(t)) return styles.veredictoCierto;
  if (/^(fals|no |incorrect|inválid)/.test(t)) return styles.veredictoFalso;
  return styles.veredictoNeutro;
}

/** Renderiza un bloque según su forma. El índice alimenta el escalonado de entrada. */
function BloqueView({ bloque, idx }: { bloque: Bloque; idx: number }) {
  const style = { '--i': idx } as React.CSSProperties;

  switch (bloque.tipo) {
    case 'parrafo':
      if (bloque.titulo) {
        return (
          <div style={style}>
            <p className={styles.bloqueTitulo}>{bloque.titulo}</p>
            <p className={styles.parrafo}>{bloque.texto}</p>
          </div>
        );
      }
      return (
        <p className={styles.parrafo} style={style}>
          {bloque.texto}
        </p>
      );

    case 'mapeo':
      return (
        <div className={styles.mapeo} style={style}>
          {bloque.titulo && <p className={styles.bloqueTitulo}>{bloque.titulo}</p>}
          <ul className={styles.mapeoLista}>
            {bloque.items.map((item) => (
              <li key={item.marca} className={styles.mapeoItem}>
                <span className={styles.mapeoMarca}>{item.marca}</span>
                <div className={styles.mapeoCuerpo}>
                  <p className={styles.mapeoSenala}>
                    Señala {item.senala}
                  </p>
                  <p className={styles.mapeoConclusion}>{item.conclusion}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'datos':
      return (
        <div className={styles.datos} style={style}>
          {bloque.titulo && <p className={styles.bloqueTitulo}>{bloque.titulo}</p>}
          <ul className={styles.datosLista}>
            {bloque.items.map((item) => (
              <li key={item.etiqueta} className={styles.datoItem}>
                <span className={styles.datoEtiqueta}>{item.etiqueta}</span>
                <div className={styles.datoCuerpo}>
                  <p className={styles.datoValor}>{item.valor}</p>
                  {item.detalle && <p className={styles.datoDetalle}>{item.detalle}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'contraste':
      return (
        <div className={styles.contraste} style={style}>
          {(bloque.etiqueta || bloque.titulo) && (
            <div className={styles.contrasteHead}>
              {bloque.etiqueta && (
                <span className={styles.contrasteEtiqueta}>{bloque.etiqueta}</span>
              )}
              {bloque.titulo && <p className={styles.bloqueTitulo}>{bloque.titulo}</p>}
            </div>
          )}
          <div className={styles.contrasteGrid}>
            {bloque.lados.map((lado) => (
              <div key={lado.titulo} className={styles.contrasteLado}>
                <p className={styles.contrasteLadoTitulo}>{lado.titulo}</p>
                <ul className={styles.contrasteItems}>
                  {lado.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
                {lado.nota && <p className={styles.contrasteNota}>{lado.nota}</p>}
              </div>
            ))}
          </div>
        </div>
      );

    case 'tabla':
      return (
        <div className={styles.tablaWrap} style={style}>
          {bloque.titulo && <p className={styles.bloqueTitulo}>{bloque.titulo}</p>}
          <div className={styles.tablaScroll}>
            <table className={styles.tabla}>
              <thead>
                <tr>
                  {bloque.encabezados.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bloque.filas.map((fila) => (
                  <tr key={fila[0]}>
                    {fila.map((celda, c) => (
                      <td key={c} className={c === 0 ? styles.tablaPrimera : undefined}>
                        {celda}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case 'opciones':
      return (
        <div className={styles.opciones} style={style}>
          {bloque.titulo && <p className={styles.bloqueTitulo}>{bloque.titulo}</p>}
          <ul className={styles.opcionesLista}>
            {bloque.items.map((op) => (
              <li
                key={op.letra}
                className={`${styles.opcion} ${op.esRespuesta ? styles.opcionMarcada : ''}`}
              >
                <span className={styles.opcionLetra}>{op.letra})</span>
                <p className={styles.opcionTexto}>{op.texto}</p>
                {op.veredicto && (
                  <span
                    className={`${styles.opcionVeredicto} ${tonoVeredicto(op.veredicto)}`}
                  >
                    {op.veredicto}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      );

    case 'esquema':
      return (
        <figure className={styles.esquema} style={style}>
          {bloque.titulo && <p className={styles.bloqueTitulo}>{bloque.titulo}</p>}
          <SolucionarioEsquema grafico={bloque.grafico} />
          {bloque.pie && <figcaption className={styles.esquemaPie}>{bloque.pie}</figcaption>}
        </figure>
      );

    case 'clave':
      return (
        <p className={styles.clave} style={style}>
          <span className={styles.claveCheck} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12.5l5.5 5.5L20 7"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {bloque.texto}
        </p>
      );

    case 'nota':
      return (
        <aside className={styles.nota} style={style}>
          {bloque.titulo && <p className={styles.notaTitulo}>{bloque.titulo}</p>}
          <p className={styles.notaTexto}>{bloque.texto}</p>
        </aside>
      );
  }
}

export default function SolucionarioRunner({ solucionario, backHref }: Props) {
  const router = useRouter();
  const { pasos } = solucionario;
  const total = pasos.length;

  const [indice, setIndice] = useState(0);
  const [direccion, setDireccion] = useState<'adelante' | 'atras'>('adelante');
  // Solo relevante en pantallas angostas, donde los dos paneles no caben a la vez.
  const [vistaMovil, setVistaMovil] = useState<'enunciado' | 'solucion'>('solucion');
  const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [pdfWidth, setPdfWidth] = useState(0);

  const pdfPaneRef = useRef<HTMLDivElement>(null);
  const solScrollRef = useRef<HTMLDivElement>(null);

  const paso = pasos[indice];
  const esUltimo = indice === total - 1;

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  // Oculta la sidebar y bloquea el scroll del documento mientras el
  // solucionario ocupa la pantalla (mismo mecanismo que el visor de PDF).
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('pdf-fullscreen-active');
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove('pdf-fullscreen-active');
    };
  }, []);

  // El ancho del PDF se mide sobre su propio panel, no sobre la ventana: el
  // panel es una fracción del split y cambia al redimensionar o al alternar
  // vista en móvil.
  useEffect(() => {
    const el = pdfPaneRef.current;
    if (!el) return;
    const medir = () => setPdfWidth(Math.max(el.clientWidth - 48, 240));
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [portalTarget, vistaMovil]);

  const cerrar = useCallback(() => {
    router.push(backHref);
  }, [router, backHref]);

  const ir = useCallback(
    (delta: number) => {
      const siguiente = Math.min(Math.max(indice + delta, 0), total - 1);
      if (siguiente === indice) return;
      setDireccion(delta > 0 ? 'adelante' : 'atras');
      setIndice(siguiente);
      // Cada paso empieza desde arriba, aunque el anterior quedara scrolleado.
      solScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [indice, total],
  );

  const saltarA = useCallback(
    (n: number) => {
      setDireccion(n > indice ? 'adelante' : 'atras');
      setIndice(n);
      solScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [indice],
  );

  // Teclado: flechas para navegar, Esc para salir.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar();
      else if (e.key === 'ArrowRight') ir(1);
      else if (e.key === 'ArrowLeft') ir(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [cerrar, ir]);

  const zoomIn = useCallback(
    () => setZoomIndex((i) => Math.min(i + 1, ZOOM_LEVELS.length - 1)),
    [],
  );
  const zoomOut = useCallback(() => setZoomIndex((i) => Math.max(i - 1, 0)), []);

  if (!portalTarget) return null;

  const escala = ZOOM_LEVELS[zoomIndex];
  const progreso = ((indice + 1) / total) * 100;

  const capa = (
    <div className={styles.overlay} data-vista={vistaMovil}>
      {/* ── Barra superior ── */}
      <header className={styles.topbar}>
        <button className={styles.volver} onClick={cerrar}>
          <FlechaIcon atras />
          <span>Volver</span>
        </button>

        <div className={styles.tituloBox}>
          <p className={styles.titulo}>{solucionario.titulo}</p>
          {solucionario.subtitulo && (
            <p className={styles.subtitulo}>{solucionario.subtitulo}</p>
          )}
        </div>

        <div className={styles.contador}>
          <span className={styles.contadorActual}>{indice + 1}</span>
          <span className={styles.contadorTotal}>/ {total}</span>
        </div>
      </header>

      <div className={styles.barraProgreso}>
        <div className={styles.barraProgresoFill} style={{ width: `${progreso}%` }} />
      </div>

      {/* ── Alternador de panel (solo pantallas angostas) ── */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${vistaMovil === 'enunciado' ? styles.tabActivo : ''}`}
          onClick={() => setVistaMovil('enunciado')}
        >
          Enunciado
        </button>
        <button
          className={`${styles.tab} ${vistaMovil === 'solucion' ? styles.tabActivo : ''}`}
          onClick={() => setVistaMovil('solucion')}
        >
          Solución
        </button>
      </div>

      <div className={styles.split}>
        {/* ── Panel izquierdo: el enunciado en PDF ── */}
        <section className={styles.paneEnunciado} aria-label="Enunciado de la práctica">
          <div className={styles.pdfToolbar}>
            <span className={styles.pdfLabel}>Enunciado</span>
            <div className={styles.pdfSpacer} />
            <div className={styles.zoomGroup}>
              <button
                className={styles.zoomBtn}
                onClick={zoomOut}
                disabled={zoomIndex === 0}
                aria-label="Reducir zoom"
              >
                −
              </button>
              <span className={styles.zoomValor}>{Math.round(escala * 100)}%</span>
              <button
                className={styles.zoomBtn}
                onClick={zoomIn}
                disabled={zoomIndex === ZOOM_LEVELS.length - 1}
                aria-label="Ampliar zoom"
              >
                +
              </button>
            </div>
          </div>

          <div className={styles.pdfScroll} ref={pdfPaneRef}>
            {pdfWidth > 0 && (
              <PdfViewer
                claseId={solucionario.pdfId}
                widthOverride={pdfWidth}
                scale={escala}
                className={styles.pdfViewer}
                loadingClass={styles.pdfLoading}
                pageWrapClass={styles.pdfPageWrap}
              />
            )}
          </div>
        </section>

        {/* ── Panel derecho: un paso a la vez, centrado ── */}
        <section className={styles.paneSolucion} aria-label="Solución paso a paso">
          <div className={styles.solScroll} ref={solScrollRef}>
            <article
              key={indice}
              className={styles.paso}
              data-dir={direccion}
              aria-live="polite"
            >
              <div className={styles.pasoHead}>
                <div className={styles.pasoMeta}>
                  <span className={styles.pasoNumero}>Pregunta {paso.n}</span>
                  {paso.parte && <span className={styles.pasoParte}>{paso.parte}</span>}
                </div>
                <h2 className={styles.pasoTitulo}>{paso.titulo}</h2>
                {paso.enunciado && <p className={styles.pasoEnunciado}>{paso.enunciado}</p>}
              </div>

              <div className={styles.pasoBloques}>
                {paso.bloques.map((bloque, b) => (
                  <BloqueView key={b} bloque={bloque} idx={b} />
                ))}
              </div>
            </article>
          </div>

          {/* ── Navegación ── */}
          <nav className={styles.nav}>
            <button
              className={styles.navBtn}
              onClick={() => ir(-1)}
              disabled={indice === 0}
              aria-label="Pregunta anterior"
            >
              <FlechaIcon atras />
            </button>

            <div className={styles.puntos}>
              {pasos.map((p, n) => (
                <button
                  key={p.n}
                  className={`${styles.punto} ${n === indice ? styles.puntoActivo : ''} ${
                    n < indice ? styles.puntoVisto : ''
                  }`}
                  onClick={() => saltarA(n)}
                  aria-label={`Ir a la pregunta ${p.n}`}
                  aria-current={n === indice ? 'step' : undefined}
                />
              ))}
            </div>

            {esUltimo ? (
              <button className={styles.navFin} onClick={cerrar}>
                Terminar
              </button>
            ) : (
              <button
                className={`${styles.navBtn} ${styles.navBtnPrimario}`}
                onClick={() => ir(1)}
                aria-label="Siguiente pregunta"
              >
                <FlechaIcon />
              </button>
            )}
          </nav>
        </section>
      </div>
    </div>
  );

  return createPortal(capa, portalTarget);
}
