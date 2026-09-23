'use client';
// Piezas de apoyo del escenario: ficha de proteína (cajón), leyenda de
// conectores, vista en lista (alternativa textual de la vía) y la gráfica de
// ciclinas de la intro.

import type { Checkpoint, CheckpointId, Escenario, Paso } from '@/lib/data/ciclo-celular/tipos';
import PROTEINAS from '@/lib/data/ciclo-celular/proteinas';
import { imagen } from '@/lib/data/ciclo-celular/familias';
import { CHECKPOINTS } from '@/lib/ciclo-celular/registro';
import { TextoSvg } from './Escena';
import { etiquetaTexto } from './texto';
import s from '@/styles/cicloCelular.module.css';

// ─── Ficha de proteína ────────────────────────────────────────────────────────

export type Destino = { cp: CheckpointId; paso: string; actor: string };

/** Primer paso de un checkpoint donde aparece un actor con esa imagen/ficha. */
function dondeAparece(cp: Checkpoint, id: string): { actor: string; paso: string } | null {
  const keys = Object.entries(cp.actores).filter(([, d]) => (d.info ?? d.img) === id).map(([k]) => k);
  if (!keys.length) return null;
  for (const p of cp.pasos) {
    for (const a of p.acciones) {
      const k = 'actor' in a ? a.actor : a.tipo === 'transcribe' ? a.product : null;
      if (k && keys.includes(k)) return { actor: k, paso: p.id };
    }
  }
  return { actor: keys[0], paso: cp.pasos[0].id };
}

export function FichaProteina({ escenario, actor, onCerrar, onIr }: {
  escenario: Escenario;
  actor: string;
  onCerrar: () => void;
  onIr: (d: Destino) => void;
}) {
  const decl = escenario.actores[actor];
  if (!decl) return null;
  const id = decl.info ?? decl.img;
  const info = PROTEINAS[id];
  const img = imagen(decl.img);
  const otros = CHECKPOINTS.filter((c) => c.id !== escenario.id).map((c) => ({ c, d: dondeAparece(c, id) })).filter((x) => x.d);
  const aqui = info?.porCheckpoint[escenario.id as CheckpointId];
  return (
    <aside className={s.ficha} role="dialog" aria-label={`Ficha de ${etiquetaTexto(decl.label)}`}>
      <button type="button" className={s.fichaCerrar} onClick={onCerrar} aria-label="Cerrar ficha">
        <svg viewBox="0 0 16 16" aria-hidden><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
      </button>
      <div className={s.fichaImg} style={{ ['--fam' as string]: img.color }}>
        {img.src ? <img src={img.src} alt="" /> : <span className={s.fichaSinImg}>{id}</span>}
      </div>
      <h3 className={s.fichaNombre}>{info?.nombre ?? etiquetaTexto(decl.label)}</h3>
      <p className={s.fichaMeta}>
        {info?.gen && <><span>gen <em>{info.gen}</em></span> · </>}
        <span>{info?.familia}</span>
      </p>
      {info && <p className={s.fichaTexto}>{info.funcionGeneral}</p>}
      {aqui && (
        <div className={s.fichaBloque}>
          <p className={s.fichaRotulo}>En este checkpoint</p>
          <p className={s.fichaTexto}>{aqui}</p>
        </div>
      )}
      {otros.length > 0 && (
        <div className={s.fichaBloque}>
          <p className={s.fichaRotulo}>También aparece en</p>
          <div className={s.fichaOtros}>
            {otros.map(({ c, d }) => (
              <button key={c.id} type="button" className={s.chip} onClick={() => onIr({ cp: c.id, paso: d!.paso, actor: d!.actor })}>
                {c.nombreCorto}
              </button>
            ))}
          </div>
        </div>
      )}
      {info?.clinica && info.clinica.length > 0 && (
        <div className={s.clinica}>
          <p className={s.fichaRotulo}>Correlación clínica</p>
          {info.clinica.map((t, i) => <p key={i}>{t}</p>)}
        </div>
      )}
    </aside>
  );
}

// ─── Leyenda ──────────────────────────────────────────────────────────────────

const LEYENDA: { tipo: string; nombre: string }[] = [
  { tipo: 'activa', nombre: 'Activa' },
  { tipo: 'inhibe', nombre: 'Inhibe' },
  { tipo: 'fosforila', nombre: 'Fosforila' },
  { tipo: 'desfosforila', nombre: 'Desfosforila' },
  { tipo: 'transcribe', nombre: 'Transcripción' },
  { tipo: 'degrada', nombre: 'Degradación' },
  { tipo: 'dano', nombre: 'Daño al ADN' },
  { tipo: 'retroalimentacion', nombre: 'Retroalimentación' },
  { tipo: 'transloca', nombre: 'Cambia de compartimento' },
];

function MuestraConector({ tipo }: { tipo: string }) {
  const col: Record<string, string> = {
    activa: 'var(--fitc)', inhibe: 'var(--rodamina)', fosforila: 'var(--fosfato)', desfosforila: 'var(--cian)',
    transcribe: '#B48CE0', degrada: '#8A97AB', dano: 'var(--cy3)', retroalimentacion: 'var(--fitc)', transloca: 'var(--texto-2)',
  };
  const c = col[tipo];
  const dash = tipo === 'fosforila' || tipo === 'desfosforila' ? '5 4' : tipo === 'degrada' ? '1.5 4' : undefined;
  return (
    <svg viewBox="0 0 54 16" className={s.leyendaMuestra} aria-hidden>
      {tipo === 'dano'
        ? <path d="M2,8 Q6,2 10,8 T18,8 T26,8 T34,8 T42,8" fill="none" stroke={c} strokeWidth={2.5} />
        : tipo === 'retroalimentacion'
          ? <path d="M4,12 Q27,-4 46,11" fill="none" stroke={c} strokeWidth={2.5} />
          : <line x1={2} y1={8} x2={44} y2={8} stroke={c} strokeWidth={tipo === 'activa' || tipo === 'inhibe' ? 3 : 2.2} strokeDasharray={dash} />}
      {tipo === 'inhibe'
        ? <line x1={46} y1={2} x2={46} y2={14} stroke={c} strokeWidth={3} strokeLinecap="round" />
        : tipo === 'transcribe' || tipo === 'degrada' || tipo === 'transloca'
          ? <path d="M42,3 L50,8 L42,13" fill="none" stroke={c} strokeWidth={2} />
          : <path d="M52,8 L42,2.5 L44,8 L42,13.5 Z" fill={c} />}
    </svg>
  );
}

export function Leyenda() {
  return (
    <div className={s.leyenda}>
      <p className={s.lateralRotulo}>Leyenda</p>
      <ul>
        {LEYENDA.map((l) => (
          <li key={l.tipo}><MuestraConector tipo={l.tipo} /><span>{l.nombre}</span></li>
        ))}
        <li>
          <svg viewBox="0 0 54 16" className={s.leyendaMuestra} aria-hidden>
            <circle cx={10} cy={8} r={7} fill="var(--fosfato)" stroke="#B8860B" strokeWidth={1} />
            <text x={10} y={8} dy="0.35em" textAnchor="middle" fontSize={9} fontWeight={800} fill="#3A2A00">P</text>
          </svg>
          <span>Grupo fosfato</span>
        </li>
        <li>
          <svg viewBox="0 0 54 16" className={s.leyendaMuestra} aria-hidden>
            {[0, 1, 2].map((i) => <circle key={i} cx={8 + i * 10} cy={i % 2 ? 5 : 11} r={4} fill="var(--ubiquitina)" />)}
          </svg>
          <span>Ubiquitina</span>
        </li>
        <li>
          <svg viewBox="0 0 54 16" className={s.leyendaMuestra} aria-hidden>
            <circle cx={10} cy={8} r={7} fill="var(--rodamina)" />
            <rect x={6.5} y={4.5} width={2.4} height={7} fill="#fff" /><rect x={11} y={4.5} width={2.4} height={7} fill="#fff" />
          </svg>
          <span>Inhibida (gris + pausa)</span>
        </li>
      </ul>
    </div>
  );
}

// ─── Vista en lista ───────────────────────────────────────────────────────────

function frasesDe(esc: Escenario, p: Paso): string[] {
  const L = (k: string) => etiquetaTexto(esc.actores[k]?.label ?? k);
  const out: string[] = [];
  for (const a of p.acciones) {
    switch (a.tipo) {
      case 'phosphorylate': out.push(a.kinase === a.target ? `${L(a.kinase)} → se autofosforila${a.label ? ` (${a.label})` : ''}` : `${L(a.kinase)} → fosforila → ${L(a.target)}${a.label ? ` (${a.label})` : ''}`); break;
      case 'dephosphorylate': out.push(a.phosphatase ? `${L(a.phosphatase)} → desfosforila → ${L(a.target)}` : `${L(a.target)} pierde sus fosfatos`); break;
      case 'inhibit': out.push(`${L(a.inhibitor)} ⊣ inhibe → ${L(a.target)}`); break;
      case 'activate': out.push(`${L(a.actor)} se activa`); break;
      case 'bind': out.push(`${L(a.actor)} se une a ${L(a.target)}`); break;
      case 'release': out.push(`${L(a.actor)} se separa de ${L(a.from)}`); break;
      case 'transcribe': out.push(`${L(a.tf)} → transcribe → ${L(a.product)}`); break;
      case 'ubiquitinate': out.push(`${L(a.ligase)} → ubiquitina → ${L(a.target)}`); break;
      case 'degrade': out.push(`${L(a.target)} → degradado en el proteasoma`); break;
      case 'sequester': out.push(`${L(a.actor)} → secuestra → ${L(a.target)}`); break;
      case 'translocate': out.push(`${L(a.actor)} → pasa al ${a.compartment === 'nucleo' ? 'núcleo' : a.compartment === 'nucleolo' ? 'nucléolo' : a.compartment}`); break;
      case 'damage': out.push(`Daño al ADN (${a.kind === 'doble' ? 'rotura de doble cadena' : a.kind === 'simple' ? 'cadena simple expuesta' : 'dímero de pirimidina'})`); break;
      case 'feedback_loop': out.push(`${L(a.from)} ↻ ${L(a.to)} (retroalimentación ${a.sign === '+' ? 'positiva' : 'negativa'})`); break;
      case 'connect': out.push(`${L(a.from)} → ${a.type === 'activa' ? 'activa' : a.type === 'inhibe' ? 'inhibe' : a.type} → ${L(a.to)}${a.label ? ` (${a.label})` : ''}`); break;
      case 'outcome': out.push(`Desenlace: ${a.texto ?? a.kind.replace('_', ' ')}`); break;
    }
  }
  return out;
}

export function VistaLista({ escenario, onCerrar, onIr }: { escenario: Escenario; onCerrar: () => void; onIr: (i: number) => void }) {
  return (
    <div className={s.velo} onClick={onCerrar}>
      <div className={s.lista} role="dialog" aria-label={`${escenario.nombre} como lista`} onClick={(e) => e.stopPropagation()}>
        <div className={s.listaCab}>
          <h3>{escenario.nombre}</h3>
          <button type="button" className={s.btnIcono} onClick={onCerrar} aria-label="Cerrar lista">
            <svg viewBox="0 0 16 16" aria-hidden><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
        <ol className={s.listaPasos}>
          {escenario.pasos.map((p, i) => (
            <li key={p.id}>
              <button type="button" className={s.listaTitulo} onClick={() => onIr(i)}>
                {p.orden === 0 ? 'Contexto' : `Paso ${p.orden}`} · {p.titulo}
              </button>
              {p.lateral && <p className={s.listaLateral}>{p.lateral}</p>}
              <p>{p.texto}</p>
              <ul>{frasesDe(escenario, p).map((f, j) => <li key={j}>{f}</li>)}</ul>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// ─── Gráfica de ciclinas (intro) ─────────────────────────────────────────────

/** Concentración esquemática de cada ciclina a lo largo del ciclo. */
export function GraficaCiclinas() {
  const X0 = 250, X1 = 1350, Y0 = 960, H = 170;
  // Fracciones del ciclo iguales a las del anillo: G1 45 %, S 30 %, G2 17 %, M 8 %.
  const fx = (f: number) => X0 + (X1 - X0) * f;
  const curvas: { nombre: string; color: string; puntos: [number, number][] }[] = [
    { nombre: 'Ciclina D', color: '#2FB7A6', puntos: [[0, 0.1], [0.12, 0.55], [0.3, 0.62], [0.6, 0.6], [0.9, 0.55], [1, 0.5]] },
    { nombre: 'Ciclina E', color: '#FF7A66', puntos: [[0, 0], [0.3, 0.05], [0.45, 0.9], [0.55, 0.3], [0.65, 0], [1, 0]] },
    { nombre: 'Ciclina A', color: '#F2C94C', puntos: [[0, 0], [0.42, 0.02], [0.6, 0.55], [0.85, 0.9], [0.93, 0.3], [0.96, 0], [1, 0]] },
    { nombre: 'Ciclina B', color: '#9B6DFF', puntos: [[0, 0], [0.65, 0.02], [0.85, 0.6], [0.95, 1], [0.97, 0.1], [1, 0]] },
  ];
  const d = (pts: [number, number][]) => pts.map(([f, v], i) => `${i ? 'L' : 'M'}${fx(f).toFixed(0)},${(Y0 - v * H).toFixed(0)}`).join(' ');
  const fases: [string, number, number][] = [['G₁', 0, 0.45], ['S', 0.45, 0.75], ['G₂', 0.75, 0.92], ['M', 0.92, 1]];
  return (
    <g className={s.grafica} aria-label="Concentración de ciclinas a lo largo del ciclo">
      <rect x={X0 - 30} y={Y0 - H - 50} width={X1 - X0 + 60} height={H + 90} rx={16} className={s.graficaFondo} />
      {fases.map(([n, a, b]) => (
        <g key={n}>
          <line x1={fx(a)} y1={Y0 - H - 10} x2={fx(a)} y2={Y0} className={s.graficaDiv} />
          <text x={(fx(a) + fx(b)) / 2} y={Y0 + 26} textAnchor="middle" className={s.graficaFase}>{n}</text>
        </g>
      ))}
      <line x1={X0} y1={Y0} x2={X1} y2={Y0} className={s.graficaEje} />
      {curvas.map((c, i) => (
        <g key={c.nombre}>
          <path d={d(c.puntos)} fill="none" stroke={c.color} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
          <circle cx={X0 + 20 + i * 190} cy={Y0 - H - 26} r={7} fill={c.color} />
          <text x={X0 + 34 + i * 190} y={Y0 - H - 26} dy="0.35em" className={s.graficaLeyenda}><TextoSvg texto={c.nombre} /></text>
        </g>
      ))}
    </g>
  );
}
