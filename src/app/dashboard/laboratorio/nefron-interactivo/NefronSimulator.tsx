'use client';
// Orquestador del lab «Nefrón interactivo» (rehecho de cero el 2026-11-15).
// Copia la arquitectura de Médula Espinal 3D y Polígono de Willis 3D: el
// dibujo ocupa toda la altura, las vistas flotan arriba a la izquierda, el menú
// ☰ arriba a la derecha, las migas y el rótulo bajo las vistas, la animación
// abajo a la izquierda y la barra lateral de 420 px a la derecha.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CELULAS, CELULA_LIST } from '@/lib/data/nefron/celulas.ts';
import { SEGMENTOS } from '@/lib/data/nefron/segmentos.ts';
import { TRANSPORTADORES, MECANISMOS } from '@/lib/data/nefron/transportadores.ts';
import { HORMONA_LIST } from '@/lib/data/nefron/hormonas.ts';
import { FARMACOS } from '@/lib/data/nefron/farmacos.ts';
import { SINDROMES } from '@/lib/data/nefron/clinico.ts';
import { CAPAS, esCapa } from '@/lib/data/nefron/barrera.ts';
import type {
  CelulaId, FarmacoId, HormonaId, NivelHormona, SegmentoId, SindromeId, TramoId, TransportadorId,
} from '@/lib/data/nefron/tipos.ts';
import {
  HORMONAS_BASALES, calcularEstado, celulasMarcadas, marcasDe, type Escenario, type Marca,
} from './engine/flujo';
import Lienzo, { type Destino, type Opciones, type Senal, type Vista } from './Lienzo';
import ControlsPanel, { VISTAS } from './ControlsPanel';
import { COLOR_MARCA } from './Glifos';
import type { Halo } from './EscenaNefron';
import type { PiezaId } from './EscenaCelula';
import styles from '@/styles/medulaEspinal.module.css';
import ws from '@/styles/poligonoWillis.module.css';
import nf from '@/styles/nefron.module.css';

const STORAGE_KEY = 'medgo:nefron:v2';
const VISTAS_VALIDAS = new Set<Vista>(['nefron', 'transporte', 'hormonas', 'farmacos', 'clinico']);

function cargarPrefs(): { vista?: Vista; opciones?: Partial<Opciones> } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    return { vista: VISTAS_VALIDAS.has(p.vista) ? p.vista : undefined, opciones: p.opciones ?? undefined };
  } catch {
    return null;
  }
}
function guardarPrefs(vista: Vista, opciones: Opciones) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ vista, opciones })); } catch { /* ignore */ }
}

/** En qué segmentos aparece una célula (la principal está en el conector y en el colector). */
function segmentosDe(c: CelulaId): SegmentoId[] {
  const out: SegmentoId[] = [];
  for (const s of Object.values(SEGMENTOS)) if (s.celulas.includes(c)) out.push(s.id);
  return out;
}

/** Célula donde mirar un transportador: la abierta si lo tiene; si no, la primera. */
function celulaCon(t: TransportadorId, preferida: CelulaId | null): CelulaId {
  const tiene = (c: CelulaId) => {
    const x = CELULAS[c];
    return [...x.apical, ...x.basolateral, ...x.interior].includes(t);
  };
  if (preferida && tiene(preferida)) return preferida;
  return CELULA_LIST.find((c) => tiene(c.id))?.id ?? 'proximal-s1';
}

function VistasEscena({ vista, onVista }: { vista: Vista; onVista: (v: Vista) => void }) {
  return (
    <div className={styles.vistas} role="group" aria-label="Vista">
      {VISTAS.map(({ key, label, desc }) => (
        <button
          key={key}
          type="button"
          title={desc}
          aria-pressed={vista === key}
          className={vista === key ? styles.vistaActiva : styles.vista}
          onClick={() => onVista(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Casilla({ on }: { on: boolean }) {
  return (
    <span className={`${styles.menuCasilla} ${on ? styles.menuCasillaOn : ''}`} aria-hidden>
      {on && (
        <svg width="12" height="12" viewBox="0 0 24 24">
          <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

/** Menú ☰ de la vista: restablecer y lo que se muestra en el dibujo. */
function MenuVista({ opciones, onOpcion, onRestablecer }: {
  opciones: Opciones;
  onOpcion: (k: keyof Opciones) => void;
  onRestablecer: () => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => { if (caja.current && !caja.current.contains(e.target as Node)) setAbierto(false); };
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') { setAbierto(false); boton.current?.focus(); } };
    document.addEventListener('pointerdown', fuera);
    document.addEventListener('keydown', tecla);
    return () => { document.removeEventListener('pointerdown', fuera); document.removeEventListener('keydown', tecla); };
  }, [abierto]);
  const casillas: Array<[keyof Opciones, string]> = [
    ['etiquetas', 'Etiquetas'],
    ['particulas', 'Filtrado en movimiento'],
    ['gradiente', 'Gradiente de la médula'],
    ['vasos', 'Vasos'],
    ['cortical', 'Nefrón cortical'],
  ];
  return (
    <div className={styles.menuVista} ref={caja}>
      <button
        ref={boton}
        type="button"
        className={`${styles.menuBtn} ${abierto ? styles.menuBtnAbierto : ''}`}
        aria-label="Opciones de la vista"
        aria-haspopup="menu"
        aria-expanded={abierto}
        onClick={() => setAbierto((v) => !v)}
      >
        <span className={styles.menuRayas} aria-hidden><span /><span /><span /></span>
      </button>
      {abierto && (
        <div className={styles.menu} role="menu" aria-label="Opciones de la vista">
          <button type="button" role="menuitem" className={styles.menuItem} onClick={() => { onRestablecer(); setAbierto(false); }}>
            <span className={styles.menuIcono} aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
                <path d="M4 4.5v4h4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="1.6" fill="currentColor" />
              </svg>
            </span>
            Ver el nefrón entero
          </button>
          {casillas.map(([k, t]) => (
            <button key={k} type="button" role="menuitemcheckbox" aria-checked={opciones[k]} className={styles.menuItem} onClick={() => onOpcion(k)}>
              <Casilla on={opciones[k]} />
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const NIVEL_TXT: Record<NivelHormona, string> = { [-1]: 'baja', 0: 'basal', 1: 'alta' } as Record<NivelHormona, string>;

export default function NefronSimulator() {
  const [vista, setVista] = useState<Vista>('nefron');
  const [tramo, setTramo] = useState<SegmentoId | null>(null);
  const [celula, setCelula] = useState<CelulaId | null>(null);
  const [pieza, setPieza] = useState<PiezaId | null>(null);
  const [hormonas, setHormonas] = useState<Record<HormonaId, NivelHormona>>(HORMONAS_BASALES);
  const [hormonaFicha, setHormonaFicha] = useState<HormonaId | null>(null);
  const [farmaco, setFarmaco] = useState<FarmacoId | null>(null);
  const [sindrome, setSindrome] = useState<SindromeId | null>(null);
  const [senalado, setSenalado] = useState<Senal>(null);
  const [opciones, setOpciones] = useState<Opciones>({ etiquetas: true, vasos: true, gradiente: true, particulas: true, cortical: true });
  const [pausa, setPausa] = useState(false);
  const [velocidad, setVelocidad] = useState(1);
  const [peticion, setPeticion] = useState<{ destino: Destino; n: number } | null>(null);
  const [reducido, setReducido] = useState(false);
  const [tactil, setTactil] = useState(false);
  const nPet = useRef(0);

  useEffect(() => {
    const p = cargarPrefs();
    if (p?.vista) setVista(p.vista);
    if (p?.opciones) setOpciones((o) => ({ ...o, ...p.opciones }));
    setReducido(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
    setTactil(window.matchMedia?.('(pointer: coarse)').matches ?? false);
  }, []);

  const pedir = useCallback((destino: Destino) => { nPet.current += 1; setPeticion({ destino, n: nPet.current }); }, []);

  const cambiarVista = useCallback((v: Vista) => {
    setVista(v);
    setSenalado(null);
  }, []);
  const cambiarOpcion = useCallback((k: keyof Opciones) => {
    setOpciones((o) => ({ ...o, [k]: !o[k] }));
  }, []);
  // Recordar vista y opciones (después de haber leído las guardadas).
  const listo = useRef(false);
  useEffect(() => {
    if (!listo.current) { listo.current = true; return; }
    guardarPrefs(vista, opciones);
  }, [vista, opciones]);

  // ── Escenario y estado fisiológico ──
  const farmacoEf = vista === 'farmacos' ? farmaco : null;
  const sindromeEf = vista === 'clinico' ? sindrome : null;
  const escenario = useMemo<Escenario>(() => ({ hormonas, farmaco: farmacoEf, sindrome: sindromeEf }), [hormonas, farmacoEf, sindromeEf]);
  const estado = useMemo(() => calcularEstado(escenario), [escenario]);
  const marcas = useMemo(
    () => marcasDe(escenario, vista === 'hormonas' || vista === 'farmacos' || vista === 'clinico' ? vista : 'otra'),
    [escenario, vista],
  );
  const celMarc = useMemo(() => celulasMarcadas(marcas), [marcas]);
  const claveMarcadas = useMemo(() => [...celMarc].sort().join(','), [celMarc]);
  const halosMarca = useMemo<Halo[]>(() => {
    const porTramo = new Map<TramoId, Marca>();
    for (const [k, m] of marcas) {
      const c = k.split('|')[0] as CelulaId;
      for (const s of segmentosDe(c)) {
        if (s === 'glomerulo') continue;
        if (!porTramo.has(s as TramoId) || m === 'bloqueado' || m === 'afectado') porTramo.set(s as TramoId, m);
      }
    }
    return [...porTramo].map(([tramo, m]) => ({ tramo, color: COLOR_MARCA[m], fuerte: false }));
  }, [marcas]);

  // ── Navegación ──
  const entrar = useCallback((c: CelulaId) => {
    setCelula(c);
    setPieza(null);
    setTramo(CELULAS[c].segmento);
    setVista((v) => (v === 'nefron' ? 'transporte' : v));
  }, []);
  const salir = useCallback(() => { setCelula(null); setPieza(null); }, []);
  const irSegmento = useCallback((id: SegmentoId) => {
    setTramo(id);
    setPieza(null);
    setCelula(null);
    pedir({ tipo: 'tramo', id });
  }, [pedir]);
  const alInicio = useCallback(() => {
    setCelula(null);
    setPieza(null);
    setTramo(null);
    pedir({ tipo: 'inicio' });
  }, [pedir]);
  const elegirPieza = useCallback((p: PiezaId | null) => {
    setPieza((prev) => (p && prev === p ? null : p));
  }, []);
  const verPieza = useCallback((t: TransportadorId) => {
    const c = celulaCon(t, celula);
    setCelula(c);
    setTramo(CELULAS[c].segmento);
    setPieza(t);
    setVista((v) => (v === 'nefron' ? 'transporte' : v));
  }, [celula]);
  const elegirFarmaco = useCallback((f: FarmacoId | null) => {
    setFarmaco(f);
    setPieza(null);
    if (f) { setCelula(FARMACOS[f].celula); setTramo(CELULAS[FARMACOS[f].celula].segmento); }
  }, []);
  const elegirSindrome = useCallback((s: SindromeId | null) => {
    setSindrome(s);
    setPieza(null);
    if (s) { setCelula(SINDROMES[s].celula); setTramo(CELULAS[SINDROMES[s].celula].segmento); }
  }, []);
  const verFarmaco = useCallback((f: FarmacoId) => { cambiarVista('farmacos'); elegirFarmaco(f); }, [cambiarVista, elegirFarmaco]);
  const verSindrome = useCallback((s: SindromeId) => { cambiarVista('clinico'); elegirSindrome(s); }, [cambiarVista, elegirSindrome]);
  const cambiarHormona = useCallback((h: HormonaId, n: NivelHormona) => {
    setHormonas((x) => ({ ...x, [h]: n }));
    setHormonaFicha(h);
  }, []);
  const deseleccionar = useCallback(() => { setPieza(null); }, []);

  const hormonasCambiadas = HORMONA_LIST.filter((h) => estado.niveles[h.id] !== 0);

  // ── Rótulo del lienzo: lo señalado manda; si no, lo activo de la vista ──
  const rotulo = useMemo(() => {
    const s = senalado;
    if (s?.kind === 'tramo') {
      const g = SEGMENTOS[s.id];
      return { color: g.color, titulo: g.nombre, sub: `${g.zona} · ${g.agua === 'permeable' ? 'permeable al agua' : g.agua === 'impermeable' ? 'impermeable al agua' : 'agua solo con ADH'}` };
    }
    if (s?.kind === 'celula') {
      const c = CELULAS[s.id];
      return { color: SEGMENTOS[c.segmento].color, titulo: c.nombre, sub: 'Toca para entrar a la célula' };
    }
    if (s?.kind === 'pieza') {
      if (esCapa(s.id)) return { color: CAPAS[s.id].color, titulo: CAPAS[s.id].nombre, sub: 'Barrera de filtración · toca para su ficha' };
      const t = TRANSPORTADORES[s.id as TransportadorId];
      const m = MECANISMOS.find((x) => x.id === t.mecanismo)!.nombre;
      return { color: '#3b9edd', titulo: `${t.sigla} · ${t.nombre}`, sub: `${m} · toca para su ficha` };
    }
    if (vista === 'farmacos' && farmaco) {
      return { color: COLOR_MARCA.bloqueado, titulo: FARMACOS[farmaco].nombre, sub: 'Rojo: lo que bloquea · verde: lo que aumenta' };
    }
    if (vista === 'clinico' && sindrome) {
      return { color: COLOR_MARCA.afectado, titulo: SINDROMES[sindrome].nombre, sub: 'Violeta: lo que falla' };
    }
    if (vista === 'hormonas' && hormonasCambiadas.length) {
      return {
        color: COLOR_MARCA.hormona,
        titulo: hormonasCambiadas.map((h) => `${h.sigla} ${NIVEL_TXT[estado.niveles[h.id]]}`).join(' · '),
        sub: 'Ámbar: lo que cambia por la hormona',
      };
    }
    return null;
  }, [senalado, vista, farmaco, sindrome, hormonasCambiadas, estado.niveles]);

  // ── Migas ──
  const segMiga = celula ? CELULAS[celula].segmento : tramo;
  const hayMigas = !!segMiga;

  const anuncio = useMemo(() => {
    const partes = [`Vista ${VISTAS.find((v) => v.key === vista)?.label ?? ''}`];
    if (celula) partes.push(`dentro de: ${CELULAS[celula].nombre}`);
    else if (tramo) partes.push(`segmento: ${SEGMENTOS[tramo].nombre}`);
    if (pieza) partes.push(`seleccionado: ${esCapa(pieza) ? CAPAS[pieza].nombre : TRANSPORTADORES[pieza as TransportadorId].nombre}`);
    if (vista === 'farmacos' && farmaco) partes.push(`fármaco: ${FARMACOS[farmaco].nombre}`);
    if (vista === 'clinico' && sindrome) partes.push(`síndrome: ${SINDROMES[sindrome].nombre}`);
    const o = estado.perfil.orina;
    partes.push(`orina ${o.mlMin.toFixed(1)} mililitros por minuto a ${Math.round(o.osm)} miliosmoles`);
    return partes.join(', ') + '.';
  }, [vista, celula, tramo, pieza, farmaco, sindrome, estado]);

  const ayuda = celula
    ? (tactil ? 'Toca un transportador · pellizca hacia dentro para salir' : 'Toca un transportador · rueda hacia atrás para salir')
    : (tactil ? 'Arrastra para mover · pellizca para acercar · toca una célula para entrar' : 'Arrastra para mover · rueda para acercar hasta las células · toca una para entrar');

  return (
    <div className={styles.lab}>
      <p className={styles.srOnly} aria-live="polite">{anuncio}</p>
      <div className={styles.escenario}>
        <Lienzo
          estado={estado}
          marcas={marcas}
          halosMarca={halosMarca}
          celulasMarcadas={claveMarcadas}
          tramoElegido={celula ? null : tramo}
          senalado={senalado}
          celula={celula}
          pieza={pieza}
          peticion={peticion}
          opciones={opciones}
          pausa={pausa}
          velocidad={velocidad}
          reducido={reducido}
          onTramo={(id) => { setTramo(id); setPieza(null); }}
          onEntrar={entrar}
          onSalir={salir}
          onPieza={(p) => { elegirPieza(p); if (vista === 'nefron') cambiarVista('transporte'); }}
          onSenalar={setSenalado}
          onVecina={(c) => { setCelula(c); setPieza(null); }}
          onFondo={deseleccionar}
        />

        {hayMigas && (
          <nav className={nf.migas} aria-label="Dónde estás">
            <button type="button" className={nf.miga} onClick={alInicio}>Nefrón</button>
            <span className={nf.migaSep} aria-hidden>›</span>
            {celula ? (
              <>
                <button type="button" className={nf.miga} onClick={() => irSegmento(segMiga!)}>{SEGMENTOS[segMiga!].corto}</button>
                <span className={nf.migaSep} aria-hidden>›</span>
                <span className={nf.migaActual} aria-current="page">
                  {CELULAS[celula].corto === SEGMENTOS[segMiga!].corto ? 'Célula' : CELULAS[celula].corto}
                </span>
              </>
            ) : (
              <span className={nf.migaActual} aria-current="page">{SEGMENTOS[segMiga!].corto}</span>
            )}
          </nav>
        )}

        {rotulo && (
          <div className={styles.structureTag} style={{ top: hayMigas ? 112 : undefined }} aria-hidden>
            <div className={styles.structureTagRow}>
              <span className={styles.structureTagDot} style={{ background: rotulo.color }} />
              <span className={styles.structureTagName}><strong>{rotulo.titulo}</strong></span>
            </div>
            <span className={styles.structureTagSub}>{rotulo.sub}</span>
          </div>
        )}

        <MenuVista opciones={opciones} onOpcion={cambiarOpcion} onRestablecer={alInicio} />
        <VistasEscena vista={vista} onVista={cambiarVista} />

        {/* Abajo a la izquierda: la animación (y, fuera de su vista, el aviso de hormonas cambiadas). */}
        <div className={ws.piso}>
          {!reducido && (
            <div className={ws.postura} role="group" aria-label="Animación">
              <button
                type="button"
                className={ws.posturaBtn}
                onClick={() => setPausa((v) => !v)}
                aria-label={pausa ? 'Reanudar la animación' : 'Pausar la animación'}
                title={pausa ? 'Reanudar' : 'Pausar'}
              >
                <span className={nf.reproducir}>
                  {pausa ? (
                    <svg className={nf.icono16} viewBox="0 0 24 24" aria-hidden><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" /></svg>
                  ) : (
                    <svg className={nf.icono16} viewBox="0 0 24 24" aria-hidden><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" /></svg>
                  )}
                  {pausa ? 'Seguir' : 'Pausa'}
                </span>
              </button>
              {[0.5, 1, 2].map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={velocidad === v}
                  className={velocidad === v ? ws.posturaActiva : ws.posturaBtn}
                  onClick={() => { setVelocidad(v); setPausa(false); }}
                  title={`Velocidad ${String(v).replace('.', ',')}×`}
                >
                  {String(v).replace('.', ',')}×
                </button>
              ))}
            </div>
          )}
          {vista !== 'hormonas' && hormonasCambiadas.length > 0 && (
            <span className={nf.avisoHormonas}>
              {hormonasCambiadas.map((h) => `${h.sigla} ${NIVEL_TXT[estado.niveles[h.id]]}`).join(' · ')}
              {hormonasCambiadas.some((h) => hormonas[h.id] !== 0) && (
                <button type="button" className={nf.avisoBtn} onClick={() => setHormonas(HORMONAS_BASALES)}>Basal</button>
              )}
            </span>
          )}
        </div>

        <span className={styles.zoomHint}>{ayuda}</span>
      </div>

      <ControlsPanel
        vista={vista}
        tramo={tramo}
        celula={celula}
        pieza={pieza}
        hormonas={hormonas}
        hormonaFicha={hormonaFicha}
        farmaco={farmaco}
        sindrome={sindrome}
        estado={estado}
        marcas={marcas}
        opciones={opciones}
        onOpcion={cambiarOpcion}
        onSegmento={irSegmento}
        onCerrarSegmento={() => setTramo(null)}
        onEntrar={entrar}
        onPieza={elegirPieza}
        onVerPieza={verPieza}
        onHormona={cambiarHormona}
        onFichaHormona={setHormonaFicha}
        onRestablecerHormonas={() => setHormonas(HORMONAS_BASALES)}
        onFarmaco={elegirFarmaco}
        onSindrome={elegirSindrome}
        onVerFarmaco={verFarmaco}
        onVerSindrome={verSindrome}
        onSenalarCelula={(c) => setSenalado(c ? { kind: 'celula', id: c } : null)}
      />
    </div>
  );
}

