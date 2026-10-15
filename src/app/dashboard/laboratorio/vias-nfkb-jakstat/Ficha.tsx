'use client';
// Ficha de proteína (panel flotante sobre la escena) e inventario de todas las
// piezas y alteraciones del laboratorio.

import { useMemo, useState } from 'react';
import type { ActorDecl, Escenario, ViaId } from '@/lib/data/vias-nfkb/tipos';
import PROTEINAS from '@/lib/data/vias-nfkb/proteinas';
import { ALTERACIONES } from '@/lib/data/vias-nfkb/alteraciones';
import { COLOR_VIA, ROJO_ALTERACION } from '@/lib/data/vias-nfkb/colores';
import { imagen } from '@/lib/data/ciclo-celular/familias';
import { VIAS } from '@/lib/vias-nfkb/registro';
import { NOMBRE_VIA, textoPlano } from './Escena';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/viasNfkb.module.css';

export type Destino = { via: ViaId; paso: string; actor?: string };

/** Miniatura dibujada (la misma forma que en la escena, en pequeño). */
export function Mini({ decl, grande }: { decl: Pick<ActorDecl, 'forma' | 'color' | 'img' | 'label'>; grande?: boolean }) {
  const col = decl.color ?? '#B9C3D3';
  const W = grande ? 76 : 40;
  if (decl.forma === 'imagen') {
    const src = imagen(decl.img ?? 'proteasoma').src;
    return src ? <img src={src} alt="" width={W} height={W} className={s.miniImg} /> : null;
  }
  return (
    <svg viewBox="0 0 40 40" width={W} height={W} aria-hidden className={s.mini}>
      {decl.forma === 'receptor' || decl.forma === 'multipaso'
        ? <rect x={14} y={3} width={12} height={34} rx={5} fill={col} stroke="rgba(0,0,0,.25)" />
        : decl.forma === 'ligando'
          ? <g fill={col} stroke="rgba(0,0,0,.25)"><circle cx={13} cy={24} r={8} /><circle cx={27} cy={24} r={8} /><circle cx={20} cy={13} r={8} /></g>
          : decl.forma === 'adn'
            ? <g fill="none" strokeWidth={2.5}><path d="M2,20 Q11,6 20,20 T38,20" stroke="#5B8CFF" /><path d="M2,20 Q11,34 20,20 T38,20" stroke="#B48CE0" /></g>
            : decl.forma === 'producto'
              ? <rect x={3} y={12} width={34} height={16} rx={8} fill={col} stroke="rgba(0,0,0,.25)" />
              : <g><ellipse cx={20} cy={20} rx={18} ry={11} fill={col} stroke="rgba(0,0,0,.25)" /><ellipse cx={15} cy={15} rx={7} ry={3} fill="#fff" opacity={0.45} /></g>}
    </svg>
  );
}

/** Dónde aparece por primera vez una ficha en una vía (para «Ver en la vía»). */
export function dondeAparece(via: Escenario, info: string): { actor: string; paso: string } | null {
  const keys = Object.entries(via.actores).filter(([k, d]) => (d.info ?? k) === info).map(([k]) => k);
  if (!keys.length) return null;
  for (const p of via.pasos) {
    for (const a of p.acciones) {
      const k = 'actor' in a ? a.actor : a.tipo === 'transcribe' ? a.product : a.tipo === 'process' ? a.into : null;
      if (k && keys.includes(k)) return { actor: k, paso: p.id };
    }
  }
  return null;
}

function Cuerpo({ id, decl, viaActual, onIr }: { id: string; decl: Pick<ActorDecl, 'forma' | 'color' | 'img' | 'label'>; viaActual?: ViaId | null; onIr?: (d: Destino) => void }) {
  const info = PROTEINAS[id];
  const otras = VIAS.filter((v) => v.id !== viaActual).map((v) => ({ v, d: dondeAparece(v, id) })).filter((x) => x.d);
  const porVia = info ? (viaActual ? [[viaActual, info.porVia[viaActual]] as const] : (Object.entries(info.porVia) as [ViaId, string][])) : [];
  return (
    <>
      <div className={c.fichaCab}>
        <div className={c.fichaImg} style={{ ['--fam' as string]: decl.color ?? '#B9C3D3' }}><Mini decl={decl} grande /></div>
        <div className={c.fichaCabTxt}>
          <h3 className={c.fichaNombre}>{info?.nombre ?? textoPlano(decl.label)}</h3>
          <p className={c.fichaMeta}>
            {info?.gen && <><span>gen <em>{info.gen}</em></span> · </>}
            <span>{info?.familia}</span>
          </p>
        </div>
      </div>
      {info && (
        <>
          <p className={c.fichaTexto}>{info.queEs}</p>
          <div className={c.fichaBloque}>
            <p className={c.fichaRotulo}>De dónde proviene</p>
            <p className={c.fichaTexto}>{info.origen}</p>
          </div>
          {info.activaCon && (
            <div className={c.fichaBloque}>
              <p className={c.fichaRotulo}>Se activa con</p>
              <p className={c.fichaTexto}>{info.activaCon}</p>
            </div>
          )}
          {porVia.filter(([, t]) => t).map(([v, t]) => (
            <div key={v} className={c.fichaBloque}>
              <p className={c.fichaRotulo} style={{ color: COLOR_VIA[v] }}>{viaActual ? 'En esta vía' : NOMBRE_VIA[v]}</p>
              <p className={c.fichaTexto}>{t}</p>
            </div>
          ))}
          {info.hodgkin && (
            <div className={s.fichaHodgkin}>
              <p className={c.fichaRotulo} style={{ color: ROJO_ALTERACION }}>Linfoma de Hodgkin clásico</p>
              <p className={c.fichaTexto}>{info.hodgkin}</p>
            </div>
          )}
          {info.clinica && info.clinica.length > 0 && (
            <div className={c.clinica}>
              <p className={c.fichaRotulo}>Correlación clínica</p>
              {info.clinica.map((t, i) => <p key={i}>{t}</p>)}
            </div>
          )}
        </>
      )}
      {onIr && otras.length > 0 && (
        <div className={c.fichaBloque}>
          <p className={c.fichaRotulo}>{viaActual ? 'También aparece en' : 'Ver en la vía'}</p>
          <div className={c.fichaOtros}>
            {otras.map(({ v, d }) => (
              <button key={v.id} type="button" className={c.chip} onClick={() => onIr({ via: v.id, paso: d!.paso, actor: d!.actor })}>{v.nombreCorto}</button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export function FichaProteina({ escenario, actor, viaActual, onCerrar, onIr }: {
  escenario: Escenario;
  actor: string;
  viaActual?: ViaId | null;
  onCerrar: () => void;
  onIr?: (d: Destino) => void;
}) {
  const decl = escenario.actores[actor];
  if (!decl) return null;
  const id = decl.info ?? actor;
  return (
    <aside className={c.ficha} role="dialog" aria-label={`Ficha de ${textoPlano(decl.label)}`}>
      <button type="button" className={c.fichaCerrar} onClick={onCerrar} aria-label="Cerrar ficha">
        <svg viewBox="0 0 16 16" aria-hidden><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
      </button>
      <Cuerpo id={id} decl={decl} viaActual={viaActual} onIr={onIr} />
    </aside>
  );
}

// ─── Inventario ───────────────────────────────────────────────────────────────

type Item = { id: string; decl: ActorDecl };

/** Piezas de una vía en el orden en que aparecen, una por ficha. */
function piezasDe(via: Escenario): Item[] {
  const vistos = new Set<string>();
  const out: Item[] = [];
  for (const p of via.pasos) {
    for (const a of p.acciones) {
      const k = 'actor' in a ? a.actor : a.tipo === 'transcribe' ? a.product : a.tipo === 'process' ? a.into : null;
      if (!k || !via.actores[k]) continue;
      const id = via.actores[k].info ?? k;
      if (vistos.has(id) || !PROTEINAS[id]) continue;
      vistos.add(id);
      out.push({ id, decl: via.actores[k] });
    }
  }
  return out;
}

export function Inventario({ onCerrar, onIr }: { onCerrar: () => void; onIr: (d: Destino) => void }) {
  const grupos = useMemo(() => VIAS.map((v) => ({ v, items: piezasDe(v) })), []);
  const [sel, setSel] = useState<Item | null>(null);
  return (
    <div className={c.velo} role="dialog" aria-label="Proteínas y alteraciones" data-bloquea-esc onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className={s.inventario}>
        <div className={c.listaCab}>
          <h3>Proteínas y alteraciones</h3>
          <button type="button" className={c.btnSec} onClick={onCerrar}>Cerrar</button>
        </div>
        <div className={s.invCuerpo}>
          <div className={s.invLista}>
            {grupos.map(({ v, items }) => (
              <section key={v.id} className={s.invGrupo}>
                <h4 style={{ color: v.color }}>{v.nombre}</h4>
                <ul>
                  {items.map((it) => {
                    const info = PROTEINAS[it.id];
                    return (
                      <li key={it.id}>
                        <button type="button" className={`${s.invItem} ${sel?.id === it.id ? s.invItemSel : ''}`} onClick={() => setSel(it)}>
                          <Mini decl={it.decl} />
                          <span className={s.invNombre}>{info.nombre}</span>
                          {info.hodgkin && <span className={s.invRojo} title="Alterada en el linfoma de Hodgkin" aria-label="Alterada en el linfoma de Hodgkin" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
            <section className={s.invGrupo}>
              <h4 style={{ color: ROJO_ALTERACION }}>Alteraciones del linfoma de Hodgkin clásico</h4>
              <table className={s.invTabla}>
                <thead><tr><th>Gen</th><th>Alteración</th><th>%</th><th>Consecuencia</th></tr></thead>
                <tbody>
                  {ALTERACIONES.map((al) => (
                    <tr key={al.gen}>
                      <td><button type="button" className={s.invGen} onClick={() => onIr({ via: al.via, paso: al.paso })}>{al.gen}</button></td>
                      <td>{al.descripcion}</td>
                      <td className={s.invPct}>{al.pct}</td>
                      <td>{al.consecuencia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className={s.invFuente}>Porcentajes: Küppers R. J Clin Invest. 2012;122(10):3439-47. Toca un gen para verlo animado.</p>
            </section>
          </div>
          <div className={s.invFicha}>
            {sel
              ? <div className={c.ficha}><Cuerpo id={sel.id} decl={sel.decl} onIr={onIr} /></div>
              : <p className={s.invVacio}>Elige una proteína para ver qué es, de dónde proviene, con qué se activa y qué le pasa en el linfoma de Hodgkin.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
