'use client';
// Barra lateral del nefrón, con el mismo diseño que Médula Espinal 3D y
// Polígono de Willis 3D: arriba el selector fijo (aquí «Segmento»), debajo la
// ficha de lo elegido y al final la lista de la vista activa.

import { useMemo, useState, type ReactNode } from 'react';
import { CELULAS, CELULA_LIST } from '@/lib/data/nefron/celulas.ts';
import { SEGMENTOS, SEGMENTO_LIST, SEGMENTO_ORDEN } from '@/lib/data/nefron/segmentos.ts';
import { SUSTANCIAS } from '@/lib/data/nefron/sustancias.ts';
import { MECANISMOS, TRANSPORTADORES } from '@/lib/data/nefron/transportadores.ts';
import { HORMONA_LIST } from '@/lib/data/nefron/hormonas.ts';
import { FARMACO_LIST } from '@/lib/data/nefron/farmacos.ts';
import { SINDROME_LIST } from '@/lib/data/nefron/clinico.ts';
import { CAPA_LIST, esCapa } from '@/lib/data/nefron/barrera.ts';
import type {
  CelulaId, FarmacoId, HormonaId, NivelHormona, SegmentoId, SindromeId, SustanciaId, TransportadorId,
} from '@/lib/data/nefron/tipos.ts';
import {
  BotonLista, Buscador, Dot, Interruptor, Vacio, navegar, normal, useTecladoFicha, type Navegacion,
} from '@/components/laboratorio/FichaLab';
import type { Estado, Marca } from './engine/flujo';
import type { Opciones, Vista } from './Lienzo';
import type { PiezaId } from './EscenaCelula';
import { COLOR_MARCA, MiniGlifo, colorTransportador } from './Glifos';
import {
  Bola, FichaCapa, FichaCelula, FichaFarmaco, FichaHormona, FichaSegmento, FichaSindrome, FichaTransportador,
} from './Fichas';
import styles from '@/styles/medulaEspinal.module.css';
import ws from '@/styles/poligonoWillis.module.css';
import nf from '@/styles/nefron.module.css';

export const VISTAS: Array<{ key: Vista; label: string; desc: string }> = [
  { key: 'nefron', label: 'Nefrón', desc: 'Segmentos, zonas del riñón y el filtrado que corre por el túbulo' },
  { key: 'transporte', label: 'Transporte', desc: 'Dentro de cada célula: transportadores e iones en movimiento' },
  { key: 'hormonas', label: 'Hormonas', desc: 'ADH, aldosterona, angiotensina II, PTH y ANP: súbelas o bájalas' },
  { key: 'farmacos', label: 'Fármacos', desc: 'Diuréticos y otros: qué bloquean y qué cambia' },
  { key: 'clinico', label: 'Clínico', desc: 'Tubulopatías y trastornos hormonales' },
];

const CORTO_SEG: Record<SegmentoId, string> = {
  glomerulo: 'Glomérulo', proximal: 'Proximal', recto: 'Recto S3', descendente: 'Descend.', 'ascendente-delgada': 'Asc. delg.',
  gruesa: 'Rama gruesa', distal: 'Distal', conector: 'Conector', 'colector-cortical': 'Col. cortical', 'colector-medular': 'Col. medular',
};

const NIVEL_TXT: Array<{ v: NivelHormona; label: string; clase: string }> = [
  { v: -1, label: 'Baja', clase: nf.triBaja },
  { v: 0, label: 'Basal', clase: '' },
  { v: 1, label: 'Alta', clase: nf.triAlta },
];

const MARCA_TXT: Record<Marca, { texto: string; clase: string }> = {
  bloqueado: { texto: 'bloqueado', clase: nf.marcaBloqueado },
  activado: { texto: 'aumenta', clase: nf.marcaActivado },
  afectado: { texto: 'afectado', clase: nf.marcaAfectado },
  hormona: { texto: 'hormona', clase: nf.marcaHormona },
};

interface Props {
  vista: Vista;
  tramo: SegmentoId | null;
  celula: CelulaId | null;
  pieza: PiezaId | null;
  hormonas: Record<HormonaId, NivelHormona>;
  hormonaFicha: HormonaId | null;
  farmaco: FarmacoId | null;
  sindrome: SindromeId | null;
  estado: Estado;
  marcas: Map<string, Marca>;
  opciones: Opciones;
  onOpcion: (k: keyof Opciones) => void;
  onSegmento: (id: SegmentoId) => void;
  onCerrarSegmento: () => void;
  onEntrar: (c: CelulaId) => void;
  onPieza: (p: PiezaId | null) => void;
  onVerPieza: (t: TransportadorId) => void;
  onHormona: (h: HormonaId, n: NivelHormona) => void;
  onFichaHormona: (h: HormonaId | null) => void;
  onRestablecerHormonas: () => void;
  onFarmaco: (f: FarmacoId | null) => void;
  onSindrome: (s: SindromeId | null) => void;
  onVerFarmaco: (f: FarmacoId) => void;
  onVerSindrome: (s: SindromeId) => void;
  onSenalarCelula: (c: CelulaId | null) => void;
}

/** La orina que sale ahora, con lo que cambia respecto al estado basal. */
function OrinaAhora({ estado }: { estado: Estado }) {
  const o = estado.perfil.orina;
  const avisos: Array<{ texto: string; clase?: string }> = [];
  if (o.fe.glucosa > 0.05) avisos.push({ texto: 'Glucosa en orina', clase: nf.sube });
  if (o.fe.hco3 > 0.08) avisos.push({ texto: 'HCO₃⁻ en orina', clase: nf.sube });
  if (o.fe.ca > 0.06) avisos.push({ texto: 'Ca²⁺ urinario ↑', clase: nf.sube });
  if (o.fe.ca < 0.012) avisos.push({ texto: 'Ca²⁺ urinario ↓', clase: nf.baja });
  if (o.fe.k > 0.28) avisos.push({ texto: 'K⁺ urinario ↑', clase: nf.sube });
  if (o.fe.k < 0.15) avisos.push({ texto: 'K⁺ urinario ↓', clase: nf.baja });
  if (o.fe.fosfato > 0.35) avisos.push({ texto: 'Fosfaturia', clase: nf.sube });
  return (
    <div className={styles.listSection}>
      <div className={styles.listTitle}>La orina ahora</div>
      <div className={nf.orina}>
        <div className={nf.orinaDato}><strong>{o.mlMin.toFixed(o.mlMin < 10 ? 1 : 0).replace('.', ',')}</strong><span>mL/min</span></div>
        <div className={nf.orinaDato}><strong>{Math.round(o.osm / 10) * 10}</strong><span>mOsm/kg</span></div>
        <div className={nf.orinaDato}><strong>{(o.fe.na * 100).toFixed(o.fe.na < 0.1 ? 1 : 0).replace('.', ',')} %</strong><span>del Na⁺ filtrado</span></div>
      </div>
      {avisos.length > 0 && (
        <ul className={nf.tendencias} style={{ marginTop: 8 }}>
          {avisos.map((a) => <li key={a.texto} className={a.clase}>{a.texto}</li>)}
        </ul>
      )}
      <p className={styles.notaPie}>Basal ≈ 1,2 mL/min a ≈ 600 mOsm/kg. Cifras orientativas del modelo.</p>
    </div>
  );
}

function Seccion({ titulo, children, n }: { titulo: string; children: ReactNode; n?: number }) {
  return (
    <div className={styles.listSection}>
      <div className={styles.listTitle}>{titulo}{n !== undefined && <span className={ws.conteo}>{n}</span>}</div>
      <div className={styles.structureList}>{children}</div>
    </div>
  );
}

/** Las sustancias que se mueven en una célula, con su color (leyenda de las burbujas). */
function SustanciasDe({ celula }: { celula: CelulaId }) {
  const c = CELULAS[celula];
  const ss = new Set<SustanciaId>();
  for (const t of [...c.apical, ...c.basolateral]) for (const m of TRANSPORTADORES[t].mueve) ss.add(m.s);
  for (const s of c.paracelular?.sustancias ?? []) ss.add(s);
  if (celula === 'barrera') ['agua', 'na', 'glucosa', 'urea', 'k', 'aa', 'hco3', 'cl', 'albumina'].forEach((s) => ss.add(s as SustanciaId));
  return (
    <div className={styles.listSection}>
      <div className={styles.listTitle}>Qué es cada burbuja</div>
      <ul className={nf.mueve}>
        {[...ss].map((s) => <li key={s}><Bola s={s} /> {SUSTANCIAS[s].nombre}</li>)}
      </ul>
    </div>
  );
}

export default function ControlsPanel(props: Props) {
  const {
    vista, tramo, celula, pieza, hormonas, hormonaFicha, farmaco, sindrome, estado, marcas, opciones,
    onOpcion, onSegmento, onCerrarSegmento, onEntrar, onPieza, onVerPieza, onHormona, onFichaHormona,
    onRestablecerHormonas, onFarmaco, onSindrome, onVerFarmaco, onVerSindrome, onSenalarCelula,
  } = props;
  const [busca, setBusca] = useState('');

  let cabeza: ReactNode = null;
  let ficha: ReactNode = null;
  let lista: ReactNode = null;
  let nav: Navegacion | null = null;

  // Piezas de la célula abierta, en el orden en que se pintan.
  const piezas = useMemo<PiezaId[]>(() => {
    if (!celula) return [];
    if (celula === 'barrera') return CAPA_LIST.map((c) => c.id);
    const c = CELULAS[celula];
    return [...c.apical, ...c.basolateral, ...c.interior.filter((t) => !c.apical.includes(t) && !c.basolateral.includes(t))]
      .filter((t, i, a) => a.indexOf(t) === i);
  }, [celula]);

  const celulasOrden = useMemo(() => CELULA_LIST.map((c) => c.id), []);

  const leyendaMarcas = (tipos: Marca[]) => (
    <div className={styles.leyenda} aria-label="Leyenda de colores">
      {tipos.map((m) => (
        <span key={m} className={styles.leyendaItem}><Dot color={COLOR_MARCA[m]} /> {m === 'bloqueado' ? 'Bloqueado' : m === 'activado' ? 'Aumenta' : m === 'afectado' ? 'Afectado' : 'Cambia por hormona'}</span>
      ))}
    </div>
  );

  // ── Ficha y lista de la célula abierta (sirve a Transporte y como apoyo a las demás) ──
  const fichaCelula = (navCel: boolean): ReactNode => {
    if (!celula) return null;
    if (pieza && esCapa(pieza)) {
      nav = navegar<PiezaId>(piezas, pieza, (x) => onPieza(x), 'Capa', () => onPieza(null));
      return <FichaCapa id={pieza} nav={nav} />;
    }
    if (pieza) {
      nav = navegar<PiezaId>(piezas, pieza, (x) => onPieza(x), 'Transportador', () => onPieza(null));
      return <FichaTransportador id={pieza as TransportadorId} nav={nav} onVerFarmaco={onVerFarmaco} onVerSindrome={onVerSindrome} />;
    }
    const n = navegar<CelulaId>(celulasOrden, celula, onEntrar, 'Célula', null);
    if (navCel) nav = n;
    return <FichaCelula id={celula} nav={n} onVerPieza={(t) => onPieza(t)} onVerSegmento={onSegmento} />;
  };

  const listaPiezas = (): ReactNode => {
    if (!celula) return null;
    if (celula === 'barrera') {
      return (
        <>
          <Seccion titulo="Capas de la barrera" n={CAPA_LIST.length}>
            {CAPA_LIST.map((c) => (
              <BotonLista key={c.id} activo={pieza === c.id} onClick={() => onPieza(pieza === c.id ? null : c.id)}>
                <Dot color={c.color} />
                <span className={styles.structureName}>{c.nombre}</span>
              </BotonLista>
            ))}
          </Seccion>
          <SustanciasDe celula="barrera" />
        </>
      );
    }
    const c = CELULAS[celula];
    const boton = (t: TransportadorId) => {
      const m = marcas.get(`${celula}|${t}`);
      return (
        <BotonLista key={t} activo={pieza === t} onClick={() => onPieza(pieza === t ? null : t)}>
          <Dot color={colorTransportador(t)} />
          <span className={styles.structureName}>{TRANSPORTADORES[t].sigla} <span className={styles.structureDir}>{TRANSPORTADORES[t].nombre}</span></span>
          {m && <span className={`${nf.marca} ${MARCA_TXT[m].clase}`}>{MARCA_TXT[m].texto}</span>}
        </BotonLista>
      );
    };
    return (
      <>
        {c.apical.length > 0 && <Seccion titulo="Membrana apical (luz)" n={c.apical.length}>{c.apical.map(boton)}</Seccion>}
        {c.basolateral.length > 0 && <Seccion titulo="Membrana basolateral (sangre)" n={c.basolateral.length}>{c.basolateral.map(boton)}</Seccion>}
        {c.interior.length > 0 && <Seccion titulo="Dentro de la célula" n={c.interior.length}>{c.interior.map(boton)}</Seccion>}
        <SustanciasDe celula={celula} />
        <div className={styles.listSection}>
          <div className={styles.listTitle}>La forma dice el mecanismo</div>
          <ul className={nf.formas}>
            {MECANISMOS.map((m) => <li key={m.id} title={m.desc}><MiniGlifo m={m.id} /> {m.nombre}</li>)}
          </ul>
        </div>
      </>
    );
  };

  const listaCelulas = (): ReactNode => {
    const q = normal(busca.trim());
    const grupos = SEGMENTO_LIST.map((s) => ({
      s,
      cels: s.celulas.filter((c, i, a) => a.indexOf(c) === i && (!q || normal(`${CELULAS[c].nombre} ${s.nombre}`).includes(q))),
    })).filter((g) => g.cels.length);
    return (
      <>
        <Buscador valor={busca} onCambio={setBusca} placeholder="Buscar célula (principal, proximal…)" etiqueta="Buscar célula" />
        {grupos.map(({ s, cels }) => (
          <Seccion key={s.id} titulo={s.nombre}>
            {cels.map((c) => (
              <BotonLista key={c} activo={celula === c} onClick={() => onEntrar(c)} onEnter={() => onSenalarCelula(c)} onLeave={() => onSenalarCelula(null)}>
                <Dot color={s.color} />
                <span className={styles.structureName}>{CELULAS[c].nombre}</span>
              </BotonLista>
            ))}
          </Seccion>
        ))}
        {grupos.length === 0 && <p className={styles.notaPie}>Ninguna célula coincide con «{busca}».</p>}
      </>
    );
  };

  if (vista === 'nefron') {
    cabeza = (
      <div className={styles.leyenda} aria-label="Color del filtrado">
        <span className={styles.leyendaItem}><Dot color="#47c8ff" /> Diluido</span>
        <span className={styles.leyendaItem}><Dot color="#5cecaa" /> 300 mOsm/kg</span>
        <span className={styles.leyendaItem}><Dot color="#ff6046" /> Concentrado</span>
      </div>
    );
    if (tramo) {
      nav = navegar<SegmentoId>(SEGMENTO_ORDEN, tramo, onSegmento, 'Segmento', onCerrarSegmento);
      ficha = <FichaSegmento id={tramo} nav={nav} onVerPieza={onVerPieza} onEntrar={onEntrar} />;
    } else {
      ficha = <Vacio>Toca un segmento del nefrón o elígelo arriba. Acerca con la rueda hasta ver sus células y toca una para entrar.</Vacio>;
    }
    lista = (
      <>
        <OrinaAhora estado={estado} />
        <Seccion titulo="Segmentos, en el orden del filtrado" n={SEGMENTO_LIST.length}>
          {SEGMENTO_LIST.map((s) => (
            <BotonLista key={s.id} activo={tramo === s.id} onClick={() => (tramo === s.id ? onCerrarSegmento() : onSegmento(s.id))}>
              <Dot color={s.color} />
              <span className={styles.structureName}>{s.nombre}</span>
              <span className={styles.structureDir}>{s.agua === 'permeable' ? 'agua sí' : s.agua === 'impermeable' ? 'agua no' : 'agua: ADH'}</span>
            </BotonLista>
          ))}
        </Seccion>
        <span className={`${styles.grupoTitulo} ${ws.separado}`}>Mostrar en el modelo</span>
        <Interruptor activo={opciones.particulas} onCambio={() => onOpcion('particulas')} etiqueta="Filtrado en movimiento" detalle="Cada burbuja es una sustancia; se va de la luz al reabsorberse" />
        <Interruptor activo={opciones.gradiente} onCambio={() => onOpcion('gradiente')} etiqueta="Gradiente de la médula" color="#d64a28" />
        <Interruptor activo={opciones.vasos} onCambio={() => onOpcion('vasos')} etiqueta="Vasos" color="#d8453a" detalle="Arteriolas, capilares peritubulares y vasa recta" />
        <Interruptor activo={opciones.cortical} onCambio={() => onOpcion('cortical')} etiqueta="Nefrón cortical (asa corta)" color="#b09486" />
        <p className={styles.notaPie}>Modelo didáctico: un nefrón yuxtamedular de asa larga; las proporciones son aproximadas.</p>
      </>
    );
  }

  if (vista === 'transporte') {
    if (celula) {
      ficha = fichaCelula(true);
      lista = listaPiezas();
    } else {
      ficha = <Vacio>Elige una célula: verás su pared, con la luz arriba y la sangre abajo, y los iones cruzando en vivo por cada transportador.</Vacio>;
      lista = listaCelulas();
    }
  }

  if (vista === 'hormonas') {
    cabeza = leyendaMarcas(['hormona']);
    const h = hormonaFicha;
    if (celula && pieza) ficha = fichaCelula(false);
    else if (h) {
      nav = navegar<HormonaId>(HORMONA_LIST.map((x) => x.id), h, (x) => onFichaHormona(x), 'Hormona', () => onFichaHormona(null));
      ficha = <FichaHormona id={h} nav={nav} onEntrar={onEntrar} />;
    } else ficha = <Vacio>Sube o baja una hormona: los transportadores que cambia se marcan en ámbar y la orina cambia en vivo.</Vacio>;
    const cambiadas = HORMONA_LIST.filter((x) => hormonas[x.id] !== 0).length;
    lista = (
      <>
        <div className={styles.listSection}>
          <div className={styles.listTitle}>Nivel de cada hormona</div>
          {HORMONA_LIST.map((x) => (
            <div key={x.id} className={`${nf.hormona} ${hormonaFicha === x.id ? nf.hormonaActiva : ''}`}>
              <button type="button" className={nf.hormonaNombre} onClick={() => onFichaHormona(hormonaFicha === x.id ? null : x.id)}>
                <Dot color={x.color} />
                <span>{x.sigla}<small>{x.nombre.replace(/\s*\(.*\)$/, '')}</small></span>
              </button>
              <div className={nf.tri} role="radiogroup" aria-label={`Nivel de ${x.nombre}`}>
                {NIVEL_TXT.map((n) => (
                  <button
                    key={n.v}
                    type="button"
                    role="radio"
                    aria-checked={hormonas[x.id] === n.v}
                    className={`${hormonas[x.id] === n.v ? nf.triActivo : nf.triBtn} ${n.clase}`}
                    onClick={() => onHormona(x.id, n.v)}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {cambiadas > 0 && (
            <button type="button" className={`${styles.chip} ${ws.chipBoton}`} style={{ marginTop: 8 }} onClick={onRestablecerHormonas}>
              Volver todas a basal
            </button>
          )}
        </div>
        <OrinaAhora estado={estado} />
      </>
    );
  }

  if (vista === 'farmacos') {
    cabeza = leyendaMarcas(['bloqueado', 'activado']);
    if (celula && pieza) ficha = fichaCelula(false);
    else if (farmaco) {
      nav = navegar<FarmacoId>(FARMACO_LIST.map((x) => x.id), farmaco, (x) => onFarmaco(x), 'Fármaco', () => onFarmaco(null));
      ficha = <FichaFarmaco id={farmaco} nav={nav} onEntrar={onEntrar} onVerPieza={onVerPieza} />;
    } else ficha = <Vacio>Elige un fármaco: la vista viaja a su célula diana, el transportador se apaga y la orina cambia en vivo.</Vacio>;
    lista = (
      <>
        <OrinaAhora estado={estado} />
        <Seccion titulo="Fármacos" n={FARMACO_LIST.length}>
          {FARMACO_LIST.map((f) => (
            <BotonLista key={f.id} activo={farmaco === f.id} onClick={() => onFarmaco(farmaco === f.id ? null : f.id)}>
              <span className={styles.structureName}>{f.nombre}</span>
              <span className={styles.structureDir}>{SEGMENTOS[CELULAS[f.celula].segmento].corto}</span>
            </BotonLista>
          ))}
        </Seccion>
      </>
    );
  }

  if (vista === 'clinico') {
    cabeza = leyendaMarcas(['afectado']);
    if (celula && pieza) ficha = fichaCelula(false);
    else if (sindrome) {
      nav = navegar<SindromeId>(SINDROME_LIST.map((x) => x.id), sindrome, (x) => onSindrome(x), 'Síndrome', () => onSindrome(null));
      ficha = <FichaSindrome id={sindrome} nav={nav} onEntrar={onEntrar} onVerPieza={onVerPieza} />;
    } else ficha = <Vacio>Elige una tubulopatía o un trastorno hormonal: verás qué célula falla y cómo cambia la orina.</Vacio>;
    lista = (
      <>
        <OrinaAhora estado={estado} />
        {(['tubulopatia', 'hormonal'] as const).map((tipo) => (
          <Seccion key={tipo} titulo={tipo === 'tubulopatia' ? 'Tubulopatías' : 'Trastornos hormonales'}>
            {SINDROME_LIST.filter((s) => s.tipo === tipo).map((s) => (
              <BotonLista key={s.id} activo={sindrome === s.id} onClick={() => onSindrome(sindrome === s.id ? null : s.id)}>
                <span className={styles.structureName}>{s.nombre}</span>
                <span className={styles.structureDir}>{SEGMENTOS[CELULAS[s.celula].segmento].corto}</span>
              </BotonLista>
            ))}
          </Seccion>
        ))}
      </>
    );
  }

  useTecladoFicha(nav);

  return (
    <aside className={styles.panel} aria-label={`Panel de ${VISTAS.find((v) => v.key === vista)?.label ?? ''}`}>
      <div className={styles.panelNivel}>
        <span className={styles.grupoTitulo} id="nf-segmento">Segmento</span>
        <div className={nf.segmentos} role="group" aria-labelledby="nf-segmento">
          {SEGMENTO_LIST.map((s) => {
            const activo = tramo === s.id || (!!celula && CELULAS[celula].segmento === s.id);
            return (
              <button
                key={s.id}
                type="button"
                title={s.nombre}
                aria-pressed={activo}
                className={activo ? nf.segActivo : nf.seg}
                onClick={() => onSegmento(s.id)}
              >
                <span className={nf.segPunto} style={{ background: s.color }} aria-hidden />
                {CORTO_SEG[s.id]}
              </button>
            );
          })}
        </div>
      </div>
      {cabeza && <div className={styles.panelCabeza}>{cabeza}</div>}
      {ficha && <div className={styles.panelFicha}>{ficha}</div>}
      {lista && <div className={`${styles.panelLista} ${ws.listaHolgura}`}>{lista}</div>}
    </aside>
  );
}

