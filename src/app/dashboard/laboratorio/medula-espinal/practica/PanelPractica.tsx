'use client';
// Panel de la práctica (a la derecha del lienzo): elegir qué practicar, seguir
// la ronda y ver los resultados. La pregunta en sí va en la tarjeta del lienzo.

import { CATEGORIAS_MP, TIPOS_MP, type TipoMP } from '@/lib/medula-practica/tipos';
import { PREGUNTAS_POR_RONDA, progreso } from '@/lib/medula-practica/sesion';
import type { Practica } from './usePractica';
import { pistaDe, textoRespuesta } from './texto';
import s from '@/styles/medulaPractica.module.css';

const OPCIONES_TIPO: Array<{ label: string; tipos: TipoMP[] }> = [
  { label: 'Ambas', tipos: ['teorica', 'caso'] },
  ...TIPOS_MP.map((t) => ({ label: t.label, tipos: [t.id] })),
];

export default function PanelPractica({ pr, onSalir }: { pr: Practica; onSalir: () => void }) {
  const { fase } = pr;

  if (fase === 'cargando') {
    return (
      <aside className={s.panel} aria-busy>
        <div className={s.estado}><span className={s.spinner} aria-hidden />Preparando las preguntas…</div>
      </aside>
    );
  }

  if (fase === 'error') {
    return (
      <aside className={s.panel}>
        <div className={s.estado} role="alert">
          <strong>No se pudo abrir la práctica.</strong>
          <span>{pr.error}</span>
          <button type="button" className={s.cta} onClick={pr.reintentar}>Reintentar</button>
          <button type="button" className={s.secundario} onClick={onSalir}>Volver al modelo</button>
        </div>
      </aside>
    );
  }

  if (fase === 'jugando') {
    const ok = pr.respuestas.filter((r) => r?.ok).length;
    const p = pr.actual;
    const puedePista = !!p && pr.paso === 'responder' && !pr.pistaVista;
    return (
      <aside className={s.panel}>
        <div className={s.bloque}>
          <span className={s.titulo}>Ronda en curso</span>
          <ol className={s.puntos} aria-label="Avance de la ronda">
            {pr.ronda.map((q, k) => {
              const r = pr.respuestas[k];
              const cls = r ? (r.ok ? s.puntoOk : s.puntoMal) : k === pr.i ? s.puntoActual : '';
              return <li key={q.id} className={`${s.punto} ${cls}`} aria-label={`Pregunta ${k + 1}${r ? (r.ok ? ', correcta' : ', incorrecta') : ''}`} />;
            })}
          </ol>
          <p className={s.marcador}><strong>{ok}</strong> correctas de {pr.respuestas.filter(Boolean).length} respondidas</p>
        </div>

        {/* ── Pista: orienta sin dar la respuesta ── */}
        {p && (
          <div className={s.bloque}>
            {pr.pistaVista ? (
              <p className={s.pista} role="status">
                <IconoPista />
                <span><strong>Pista.</strong> {pistaDe(p)}</span>
              </p>
            ) : (
              <button type="button" className={s.pistaBtn} disabled={!puedePista} onClick={pr.verPista}>
                <IconoPista />
                <span>
                  <strong>Ver pista</strong>
                  <small>{p.forma === 'senalar' ? 'Te dice en qué zona del corte está' : 'Tacha una alternativa incorrecta'}</small>
                </span>
              </button>
            )}
          </div>
        )}

        {/* ── Repaso: las 10 de la ronda; las respondidas se despliegan ── */}
        <div className={s.lista}>
          <span className={s.etiqueta}>Esta ronda</span>
          <ol className={s.repaso}>
            {pr.ronda.map((q, k) => {
              const r = pr.respuestas[k];
              const actual = k === pr.i && pr.paso !== 'corregida';
              const estado = r ? (r.ok ? s.circuloOk : s.circuloMal) : actual ? s.circuloActual : s.circuloPendiente;
              const icono = r ? (r.ok ? <IconoBien /> : <IconoMal />) : k + 1;
              const titulo = <span className={s.repasoTitulo}>{q.enunciado}</span>;
              return (
                <li key={q.id}>
                  {r ? (
                    <details className={s.repasoItem}>
                      <summary>
                        <span className={`${s.circulo} ${estado}`} aria-label={r.ok ? 'Correcta' : 'Incorrecta'}>{icono}</span>
                        {titulo}
                        {r.pista && <span className={s.conPista} title="Respondida con pista"><IconoPista /></span>}
                      </summary>
                      <div className={s.repasoDetalle}>
                        <p><strong>Respuesta:</strong> {textoRespuesta(q)}</p>
                        <p>{q.explicacion}</p>
                      </div>
                    </details>
                  ) : (
                    <div className={`${s.repasoItem} ${s.repasoFila} ${actual ? s.repasoActual : ''}`} aria-current={actual ? 'step' : undefined}>
                      <span className={`${s.circulo} ${estado}`}>{icono}</span>
                      {actual ? titulo : <span className={s.repasoTitulo}>Pregunta {k + 1}</span>}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div className={s.pie}>
          <button type="button" className={s.secundario} onClick={pr.alInicio}>Terminar la ronda</button>
        </div>
      </aside>
    );
  }

  if (fase === 'resultados') {
    const ok = pr.respuestas.filter((r) => r?.ok).length;
    const total = pr.respuestas.length;
    const pct = total ? Math.round((100 * ok) / total) : 0;
    const falladas = pr.respuestas.filter((r) => r && !r.ok);
    return (
      <aside className={s.panel}>
        <div className={s.bloque}>
          <span className={s.titulo}>Resultado</span>
          <p className={s.nota}><strong>{ok}</strong>/{total}<small>{pct} %</small></p>
          <p className={s.ayuda}>
            {pct >= 90 ? 'Excelente: dominas este bloque.' : pct >= 70 ? 'Bien. Repasa las falladas para afianzar.' : 'Vuelve a las fichas del modelo y repite las falladas.'}
          </p>
        </div>
        {falladas.length > 0 && (
          <div className={s.lista}>
            <span className={s.titulo}>Para repasar</span>
            <ul className={s.falladas}>
              {falladas.map((r) => (
                <li key={r.pregunta.id}>
                  <strong>{r.pregunta.enunciado}</strong>
                  <span>{r.pregunta.explicacion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className={s.pie}>
          <button type="button" className={s.cta} onClick={() => pr.empezar()}>Otra ronda</button>
          {falladas.length > 0 && <button type="button" className={s.secundario} onClick={() => pr.empezar(true)}>Repetir las falladas</button>}
          <button type="button" className={s.secundario} onClick={pr.alInicio}>Cambiar lo que practico</button>
        </div>
      </aside>
    );
  }

  // ── Inicio: qué practicar ──
  const { filtro, prog, banco, avance } = pr;
  const tipoActivo = OPCIONES_TIPO.find((o) => o.tipos.length === filtro.tipos.length && o.tipos.every((t) => filtro.tipos.includes(t)))?.label;
  return (
    <aside className={s.panel}>
      <div className={s.bloque}>
        <span className={s.titulo}>Practica con el corte</span>
        <p className={s.ayuda}>
          Rondas de {PREGUNTAS_POR_RONDA} preguntas. En unas eliges la alternativa; en otras tocas la estructura en el corte.
        </p>
      </div>

      <div className={s.bloque}>
        <span className={s.etiqueta}>Categorías</span>
        <div className={s.categorias}>
          {CATEGORIAS_MP.map((c) => {
            const activa = filtro.categorias.includes(c.id);
            const pc = banco ? progreso(banco.preguntas.filter((p) => p.categoria === c.id && filtro.tipos.includes(p.tipo)), avance) : null;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={activa}
                className={`${s.categoria} ${activa ? s.categoriaActiva : ''}`}
                onClick={() => pr.alternarCategoria(c.id)}
              >
                <span className={s.casilla} aria-hidden>{activa && <svg width="12" height="12" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}</span>
                <span className={s.categoriaTexto}>
                  <strong>{c.label}</strong>
                  <small>{c.desc}</small>
                </span>
                {pc && <span className={s.cuenta}>{pc.vistas}/{pc.total}</span>}
                {pc && pc.total > 0 && (
                  <span className={s.barra} aria-hidden>
                    <span className={s.barraOk} style={{ width: `${(100 * pc.aciertos) / pc.total}%` }} />
                    <span className={s.barraMal} style={{ width: `${(100 * pc.falladas) / pc.total}%` }} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className={s.bloque}>
        <span className={s.etiqueta}>Tipo de pregunta</span>
        <div className={s.segmentado} role="group" aria-label="Tipo de pregunta">
          {OPCIONES_TIPO.map((o) => (
            <button
              key={o.label}
              type="button"
              aria-pressed={tipoActivo === o.label}
              className={`${s.segBtn} ${tipoActivo === o.label ? s.segActivo : ''}`}
              onClick={() => pr.elegirTipos(o.tipos)}
            >
              {o.label}
            </button>
          ))}
        </div>
        <p className={s.resumen}>
          {prog.total} preguntas · {prog.vistas} respondidas · <span className={s.verde}>{prog.aciertos} bien</span> · <span className={s.rojo}>{prog.falladas} mal</span>
        </p>
      </div>

      <div className={s.pie}>
        <button type="button" className={s.cta} disabled={!prog.total} onClick={() => pr.empezar()}>
          Empezar · {Math.min(PREGUNTAS_POR_RONDA, prog.total)} preguntas
        </button>
        {prog.falladas > 0 && (
          <button type="button" className={s.secundario} onClick={() => pr.empezar(true)}>
            Repasar las falladas ({prog.falladas})
          </button>
        )}
      </div>
    </aside>
  );
}

// ── Íconos ──────────────────────────────────────────────────────────────────
function IconoPista() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2V17h5v-1.2c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconoBien() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconoMal() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 7l10 10M17 7 7 17" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
