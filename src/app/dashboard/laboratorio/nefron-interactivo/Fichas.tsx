'use client';
// Fichas de la barra lateral del nefrón, con el patrón de Willis: cabecera fija
// (‹ › ✕), resumen, «Lo esencial», perla «Para el examen» y «Más detalle».

import { useState, type ReactNode } from 'react';
import { CELULAS } from '@/lib/data/nefron/celulas.ts';
import { SEGMENTOS } from '@/lib/data/nefron/segmentos.ts';
import { SUSTANCIAS } from '@/lib/data/nefron/sustancias.ts';
import { MECANISMOS, TRANSPORTADORES } from '@/lib/data/nefron/transportadores.ts';
import { HORMONAS } from '@/lib/data/nefron/hormonas.ts';
import { FARMACOS } from '@/lib/data/nefron/farmacos.ts';
import { SINDROMES } from '@/lib/data/nefron/clinico.ts';
import { CAPAS, type CapaId } from '@/lib/data/nefron/barrera.ts';
import type {
  CelulaId, Consecuencias, FarmacoId, HormonaId, SegmentoId, SindromeId, SustanciaId, TransportadorId,
} from '@/lib/data/nefron/tipos.ts';
import {
  Apartado, CabezaFicha, Esencial, Pestanas, Perla, type Navegacion,
} from '@/components/laboratorio/FichaLab';
import { colorTransportador } from './Glifos';
import styles from '@/styles/medulaEspinal.module.css';
import ws from '@/styles/poligonoWillis.module.css';
import nf from '@/styles/nefron.module.css';

const AGUA: Record<string, string> = {
  permeable: 'Permeable al agua',
  impermeable: 'Impermeable al agua',
  'segun ADH': 'Agua solo con ADH',
};

/** Bolita de una sustancia con su símbolo. */
export function Bola({ s }: { s: SustanciaId }) {
  const su = SUSTANCIAS[s];
  return (
    <span className={`${nf.bola} ${su.textoOscuro ? nf.bolaOscura : ''}`} style={{ background: su.color }} aria-hidden>
      {su.simbolo.replace(/[⁺⁻²³]/g, '').slice(0, 4)}
    </span>
  );
}

function Insignia({ color }: { color: string }) {
  return <span className={ws.insigniaColor} style={{ background: color }} aria-hidden />;
}

/** Enlaces en línea a varias fichas («NHE3 · SGLT2 · …»). */
function Enlaces<T extends string>({ ids, nombre, onVer }: { ids: T[]; nombre: (id: T) => string; onVer: (id: T) => void }) {
  return (
    <span className={ws.enlaces}>
      {ids.map((id, k) => (
        <span key={id}>
          {k > 0 && <span className={ws.enlacesSep} aria-hidden> · </span>}
          <button type="button" className={ws.enlaceTerr} onClick={() => onVer(id)}>{nombre(id)}</button>
        </span>
      ))}
    </span>
  );
}

export const sigla = (t: TransportadorId) => TRANSPORTADORES[t].sigla;

// ─────────────────────────── Segmento ───────────────────────────
type PestSeg = 'reabsorbe' | 'histologia' | 'clinica';

export function FichaSegmento({ id, nav, onVerPieza, onEntrar }: {
  id: SegmentoId;
  nav: Navegacion;
  onVerPieza: (t: TransportadorId) => void;
  onEntrar: (c: CelulaId) => void;
}) {
  const s = SEGMENTOS[id];
  const [pest, setPest] = useState<PestSeg>('reabsorbe');
  return (
    <div className={styles.info} role="region" aria-label={s.nombre}>
      <CabezaFicha insignia={<Insignia color={s.color} />} titulo={s.nombre} meta={<>{s.zona} · {AGUA[s.agua]}</>} nav={nav} />
      <p className={ws.fichaLead}>{s.resumen}</p>
      <Esencial filas={[
        { rotulo: 'Función', valor: s.esencial.funcion },
        ...(s.esencial.claves.length ? [{ rotulo: 'Claves', valor: <Enlaces ids={s.esencial.claves} nombre={sigla} onVer={onVerPieza} /> }] : []),
        { rotulo: 'Si falla', valor: s.esencial.siFalla },
      ]} />
      <Perla>{s.esencial.perla}</Perla>
      <ul className={styles.chips} aria-label="Entrar a sus células">
        {s.celulas.map((c) => (
          <li key={c}>
            <button type="button" className={`${styles.chip} ${ws.chipBoton}`} onClick={() => onEntrar(c)}>
              Ver {c === 'barrera' ? 'la barrera de filtración' : `la célula: ${CELULAS[c].corto}`} →
            </button>
          </li>
        ))}
      </ul>
      <h4 className={ws.detalleTitulo}>Más detalle</h4>
      <Pestanas<PestSeg>
        pestanas={[{ key: 'reabsorbe', label: id === 'glomerulo' ? 'Filtra' : 'Reabsorbe' }, { key: 'histologia', label: 'Histología' }, { key: 'clinica', label: 'Clínica' }]}
        activa={pest}
        onCambio={setPest}
      />
      {pest === 'reabsorbe' && (
        <div className={ws.cuerpo} role="tabpanel">
          <table className={nf.tabla}>
            <thead><tr><th scope="col">Qué</th><th scope="col">Cuánto</th><th scope="col">Cómo</th></tr></thead>
            <tbody>
              {s.reabsorbe.map((r) => (
                <tr key={r.s + r.cuanto}>
                  <th scope="row"><Bola s={r.s} /> {SUSTANCIAS[r.s].nombre}</th>
                  <td>{r.cuanto}</td>
                  <td>{r.como}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.notaPie}>Porcentajes de lo filtrado; rangos orientativos.</p>
        </div>
      )}
      {pest === 'histologia' && <div className={ws.cuerpo} role="tabpanel"><p className={styles.infoDesc}>{s.histologia}</p></div>}
      {pest === 'clinica' && <div className={ws.cuerpo} role="tabpanel"><p className={styles.infoDesc}>{s.clinica}</p></div>}
    </div>
  );
}

// ─────────────────────────── Célula ───────────────────────────
export function FichaCelula({ id, nav, onVerPieza, onVerSegmento }: {
  id: CelulaId;
  nav: Navegacion;
  onVerPieza: (t: TransportadorId) => void;
  onVerSegmento: (s: SegmentoId) => void;
}) {
  const c = CELULAS[id];
  const seg = SEGMENTOS[c.segmento];
  const forma = { plana: 'Epitelio plano', cubica: 'Epitelio cúbico', cilindrica: 'Epitelio cilíndrico' }[c.forma];
  return (
    <div className={styles.info} role="region" aria-label={c.nombre}>
      <CabezaFicha
        insignia={<Insignia color={seg.color} />}
        titulo={c.nombre}
        meta={<><button type="button" className={ws.enlaceTerr} onClick={() => onVerSegmento(c.segmento)}>{seg.corto}</button> · {forma}</>}
        nav={nav}
      />
      <p className={ws.fichaLead}>{c.resumen}</p>
      <Esencial filas={[
        { rotulo: 'Función', valor: c.esencial.funcion },
        ...(c.apical.length ? [{ rotulo: 'Luz (apical)', valor: <Enlaces ids={c.apical} nombre={sigla} onVer={onVerPieza} /> }] : []),
        ...(c.basolateral.length ? [{ rotulo: 'Sangre (base)', valor: <Enlaces ids={c.basolateral} nombre={sigla} onVer={onVerPieza} /> }] : []),
        ...(c.interior.length ? [{ rotulo: 'Dentro', valor: <Enlaces ids={c.interior} nombre={sigla} onVer={onVerPieza} /> }] : []),
        { rotulo: 'Si falla', valor: c.esencial.siFalla },
      ]} />
      <Perla>{c.esencial.perla}</Perla>
      {(c.paracelular || c.reacciones || c.senal) && (
        <>
          <h4 className={ws.detalleTitulo}>Más detalle</h4>
          <div className={ws.cuerpo}>
            {c.paracelular && (
              <Apartado titulo="Entre las células">
                <p className={styles.infoDesc}>{c.paracelular.via}</p>
              </Apartado>
            )}
            {c.reacciones && (
              <Apartado titulo="Reacciones">
                <ul className={nf.listaCorta}>
                  {c.reacciones.map((r) => <li key={r.texto}>{r.texto}{r.enzima ? ` (${r.enzima}, en ${r.donde === 'luz' ? 'la luz' : 'el citosol'})` : ''}</li>)}
                </ul>
              </Apartado>
            )}
            {c.senal && <Apartado titulo="Qué señal manda"><p className={styles.infoDesc}>{c.senal}</p></Apartado>}
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────── Transportador ───────────────────────────
export function FichaTransportador({ id, nav, onVerFarmaco, onVerSindrome }: {
  id: TransportadorId;
  nav: Navegacion;
  onVerFarmaco: (f: FarmacoId) => void;
  onVerSindrome: (s: SindromeId) => void;
}) {
  const t = TRANSPORTADORES[id];
  const mec = MECANISMOS.find((m) => m.id === t.mecanismo)!;
  return (
    <div className={styles.info} role="region" aria-label={t.nombre}>
      <CabezaFicha
        insignia={<span className={ws.sigla} style={{ background: colorTransportador(id) }}>{t.sigla}</span>}
        titulo={t.nombre}
        meta={<>{mec.nombre}{t.gen ? <> · gen {t.gen}</> : null}</>}
        nav={nav}
      />
      <p className={ws.fichaLead}>{t.resumen}</p>
      <Esencial filas={[
        { rotulo: 'Hace', valor: t.esencial.hace },
        ...(t.mueve.length ? [{
          rotulo: 'Mueve',
          valor: (
            <ul className={nf.mueve}>
              {t.mueve.map((m, i) => (
                <li key={i}>
                  <Bola s={m.s} /> {m.n && m.n > 1 ? `${m.n} ` : ''}{SUSTANCIAS[m.s].simbolo} {m.hacia === 'adentro' ? 'entra a la célula' : 'sale de la célula'}
                </li>
              ))}
            </ul>
          ),
        }] : []),
        { rotulo: 'Energía', valor: t.energia },
        { rotulo: 'Si falla', valor: t.esencial.siFalla },
      ]} />
      <Perla>{t.esencial.perla}</Perla>
      {(t.regulacion || t.farmacos?.length || t.sindromes?.length) && (
        <>
          <h4 className={ws.detalleTitulo}>Más detalle</h4>
          <div className={ws.cuerpo}>
            {t.regulacion && <Apartado titulo="Regulación"><p className={styles.infoDesc}>{t.regulacion}</p></Apartado>}
            {!!t.farmacos?.length && (
              <Apartado titulo="Fármacos">
                <p className={styles.infoDesc}><Enlaces ids={t.farmacos} nombre={(f) => FARMACOS[f].nombre} onVer={onVerFarmaco} /></p>
              </Apartado>
            )}
            {!!t.sindromes?.length && (
              <Apartado titulo="Enfermedades">
                <p className={styles.infoDesc}><Enlaces ids={t.sindromes} nombre={(s) => SINDROMES[s].corto} onVer={onVerSindrome} /></p>
              </Apartado>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function FichaCapa({ id, nav }: { id: CapaId; nav: Navegacion }) {
  const c = CAPAS[id];
  return (
    <div className={styles.info} role="region" aria-label={c.nombre}>
      <CabezaFicha insignia={<Insignia color={c.color} />} titulo={c.nombre} meta={<>Barrera de filtración glomerular</>} nav={nav} />
      <p className={ws.fichaLead}>{c.resumen}</p>
      <Esencial filas={[
        { rotulo: 'Función', valor: c.esencial.funcion },
        { rotulo: 'Si falla', valor: c.esencial.siFalla },
      ]} />
      <Perla>{c.esencial.perla}</Perla>
      <h4 className={ws.detalleTitulo}>Más detalle</h4>
      <div className={ws.cuerpo}><p className={styles.infoDesc}>{c.detalle}</p></div>
    </div>
  );
}

// ─────────────────────────── Consecuencias ───────────────────────────
const FLECHA = { sube: '↑', baja: '↓', igual: '=' } as const;

function Tendencias({ c }: { c: Consecuencias }) {
  const items: Array<{ texto: string; clase?: string }> = [
    { texto: `K⁺ ${FLECHA[c.potasio]}`, clase: c.potasio === 'sube' ? nf.sube : c.potasio === 'baja' ? nf.baja : undefined },
    { texto: c.acidoBase === 'acidosis' ? 'Acidosis' : c.acidoBase === 'alcalosis' ? 'Alcalosis' : 'pH sin cambio', clase: c.acidoBase === 'acidosis' ? nf.sube : c.acidoBase === 'alcalosis' ? nf.baja : undefined },
    { texto: `Volumen ${FLECHA[c.volumen]}` },
  ];
  return (
    <ul className={nf.tendencias} aria-label="En la sangre">
      {items.map((i) => <li key={i.texto} className={i.clase}>{i.texto}</li>)}
    </ul>
  );
}

function Lista({ items }: { items: string[] }) {
  return <ul className={nf.listaCorta}>{items.map((x) => <li key={x}>{x}</li>)}</ul>;
}

// ─────────────────────────── Hormona ───────────────────────────
export function FichaHormona({ id, nav, onEntrar }: { id: HormonaId; nav: Navegacion; onEntrar: (c: CelulaId) => void }) {
  const h = HORMONAS[id];
  return (
    <div className={styles.info} role="region" aria-label={h.nombre}>
      <CabezaFicha insignia={<span className={ws.sigla} style={{ background: h.color }}>{h.sigla}</span>} titulo={h.nombre} meta={<>Receptor: {h.receptor}</>} nav={nav} />
      <p className={ws.fichaLead}>{h.resumen}</p>
      <Esencial filas={[
        { rotulo: 'Se libera por', valor: h.estimulo },
        { rotulo: 'Actúa en', valor: <Enlaces ids={h.celulas} nombre={(c) => CELULAS[c].corto} onVer={onEntrar} /> },
        { rotulo: 'Efecto', valor: h.esencial.efecto },
        { rotulo: 'Si sobra', valor: h.esencial.siSobra },
        { rotulo: 'Si falta', valor: h.esencial.siFalta },
      ]} />
      <Perla>{h.esencial.perla}</Perla>
      <h4 className={ws.detalleTitulo}>Más detalle</h4>
      <div className={ws.cuerpo}>
        <Apartado titulo="De dónde sale"><p className={styles.infoDesc}>{h.origen}</p></Apartado>
        <Apartado titulo="Mecanismo"><p className={styles.infoDesc}>{h.mecanismo}</p></Apartado>
      </div>
    </div>
  );
}

// ─────────────────────────── Fármaco ───────────────────────────
type PestFar = 'usos' | 'adversos' | 'orina';

export function FichaFarmaco({ id, nav, onEntrar, onVerPieza }: {
  id: FarmacoId;
  nav: Navegacion;
  onEntrar: (c: CelulaId) => void;
  onVerPieza: (t: TransportadorId) => void;
}) {
  const f = FARMACOS[id];
  const [pest, setPest] = useState<PestFar>('orina');
  const bloquea = f.dianas.filter((d) => d.factor < 1).map((d) => d.t);
  const activa = f.dianas.filter((d) => d.factor > 1).map((d) => d.t);
  return (
    <div className={styles.info} role="region" aria-label={f.nombre}>
      <CabezaFicha titulo={f.nombre} meta={<>{f.clase}</>} nav={nav} />
      <p className={ws.fichaLead}>{f.resumen}</p>
      <Esencial filas={[
        { rotulo: 'Actúa en', valor: <button type="button" className={ws.enlaceTerr} onClick={() => onEntrar(f.celula)}>{CELULAS[f.celula].corto}</button> },
        { rotulo: 'Frena', valor: <Enlaces ids={[...new Set(bloquea)]} nombre={sigla} onVer={onVerPieza} /> },
        ...(activa.length ? [{ rotulo: 'Aumenta', valor: <Enlaces ids={[...new Set(activa)]} nombre={sigla} onVer={onVerPieza} /> }] : []),
        { rotulo: 'Efecto', valor: f.esencial.efecto },
        { rotulo: 'En sangre', valor: <Tendencias c={f.consecuencias} /> },
      ]} />
      <Perla>{f.esencial.perla}</Perla>
      <h4 className={ws.detalleTitulo}>Más detalle</h4>
      <Pestanas<PestFar>
        pestanas={[{ key: 'orina', label: 'Orina y sangre' }, { key: 'usos', label: 'Usos' }, { key: 'adversos', label: 'Adversos' }]}
        activa={pest}
        onCambio={setPest}
      />
      <div className={ws.cuerpo} role="tabpanel">
        {pest === 'orina' && (
          <>
            <Apartado titulo="En la orina"><Lista items={f.consecuencias.orina} /></Apartado>
            <Apartado titulo="En la sangre"><Lista items={f.consecuencias.sangre} /></Apartado>
          </>
        )}
        {pest === 'usos' && (
          <>
            <Apartado titulo="Ejemplos"><p className={styles.infoDesc}>{f.ejemplos}</p></Apartado>
            <Apartado titulo="Se usa en"><Lista items={f.usos} /></Apartado>
          </>
        )}
        {pest === 'adversos' && <Apartado titulo="Efectos adversos"><Lista items={f.adversos} /></Apartado>}
      </div>
    </div>
  );
}

// ─────────────────────────── Síndrome ───────────────────────────
type PestSin = 'orina' | 'causas' | 'tratamiento';

export function FichaSindrome({ id, nav, onEntrar, onVerPieza }: {
  id: SindromeId;
  nav: Navegacion;
  onEntrar: (c: CelulaId) => void;
  onVerPieza: (t: TransportadorId) => void;
}) {
  const s = SINDROMES[id];
  const [pest, setPest] = useState<PestSin>('orina');
  const afecta = [...new Set(s.dianas.map((d) => d.t))];
  const filas: Array<{ rotulo: string; valor: ReactNode }> = [
    { rotulo: 'Defecto', valor: s.esencial.defecto },
    { rotulo: 'Dónde', valor: <button type="button" className={ws.enlaceTerr} onClick={() => onEntrar(s.celula)}>{CELULAS[s.celula].corto}</button> },
    ...(afecta.length ? [{ rotulo: 'Afecta', valor: <Enlaces ids={afecta} nombre={sigla} onVer={onVerPieza} /> }] : []),
    { rotulo: 'Signo clave', valor: s.esencial.signo },
    ...(s.esencial.imita ? [{ rotulo: 'Se parece a', valor: s.esencial.imita }] : []),
    { rotulo: 'En sangre', valor: <Tendencias c={s.consecuencias} /> },
  ];
  return (
    <div className={styles.info} role="region" aria-label={s.nombre}>
      <CabezaFicha
        insignia={<span className={s.tipo === 'hormonal' ? ws.insigniaIctus : ws.insigniaAneurisma}>{s.tipo === 'hormonal' ? 'Hormonal' : 'Tubular'}</span>}
        titulo={s.nombre}
        meta={<>{SEGMENTOS[CELULAS[s.celula].segmento].corto}</>}
        nav={nav}
      />
      <p className={ws.fichaLead}>{s.resumen}</p>
      <Esencial filas={filas} />
      <Perla>{s.esencial.perla}</Perla>
      <h4 className={ws.detalleTitulo}>Más detalle</h4>
      <Pestanas<PestSin>
        pestanas={[{ key: 'orina', label: 'Orina y sangre' }, { key: 'causas', label: 'Causas' }, { key: 'tratamiento', label: 'Tratamiento' }]}
        activa={pest}
        onCambio={setPest}
      />
      <div className={ws.cuerpo} role="tabpanel">
        {pest === 'orina' && (
          <>
            <Apartado titulo="En la orina"><Lista items={s.consecuencias.orina} /></Apartado>
            <Apartado titulo="En la sangre"><Lista items={s.consecuencias.sangre} /></Apartado>
          </>
        )}
        {pest === 'causas' && <Apartado titulo="Causas"><Lista items={s.causas} /></Apartado>}
        {pest === 'tratamiento' && <Apartado titulo="Tratamiento"><p className={styles.infoDesc}>{s.tratamiento}</p></Apartado>}
      </div>
    </div>
  );
}
