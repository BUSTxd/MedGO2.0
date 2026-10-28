'use client';

import { useRef, useState, useTransition } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ProfilePlan } from '@/lib/plans';
import type { CatalogoExamenes, SesionExamen, TemaExamen } from '@/lib/estudio/examenes';
import { alternarMateria } from '@/lib/estudio/seleccion-examenes';
import { cx, Icono } from './Icono';
import { norm } from './texto';
import Desplegable from './Desplegable';

const PracticaEncib = dynamic(() => import('@/components/cursos/encib/QuizEncib').then((m) => m.PracticaEncib), {
  loading: () => <p role="status">Preparando tus preguntas…</p>,
});

export default function ExamenesEstudio({ catalogo, sesion, planState, isAuthed }: {
  catalogo: CatalogoExamenes;
  sesion: SesionExamen | null;
  planState: { plan: ProfilePlan; isActive: boolean; allAccess?: boolean };
  isAuthed: boolean;
}) {
  const router = useRouter();
  const [modo, setModo] = useState<'todas' | 'temas'>(sesion?.codigos.length ? 'temas' : 'todas');
  const [anio, setAnio] = useState(sesion?.anios.length === 1 ? String(sesion.anios[0]) : 'todos');
  const [elegidos, setElegidos] = useState<string[]>(sesion?.codigos ?? []);
  const [busqueda, setBusqueda] = useState('');
  const [pendiente, empezar] = useTransition();
  const buscador = useRef<HTMLInputElement>(null);
  const anios = anio === 'todos' ? catalogo.anios : [Number(anio)];
  const contar = (t: TemaExamen) => anios.reduce((n, y) => n + (t.porAnio[y] ?? 0), 0);
  const temas = catalogo.areas.flatMap((a) => a.temas);
  const disponibles = temas.filter((t) => contar(t) > 0);
  const materias = catalogo.areas.map((a) => ({ ...a, temas: a.temas.filter((t) => contar(t) > 0) }));
  const seleccionados = disponibles.filter((t) => elegidos.includes(t.codigo));
  const seleccion = modo === 'todas' ? disponibles : seleccionados;
  const total = seleccion.reduce((n, t) => n + contar(t), 0);
  const totalBanco = temas.reduce((n, t) => n + Object.values(t.porAnio).reduce((s, v) => s + v, 0), 0);
  const consulta = norm(busqueda);
  const visibles = catalogo.areas.map((a) => ({ ...a, temas: a.temas.filter((t) => contar(t) > 0 && norm(`${a.nombre} ${t.nombre} ${t.codigo}`).includes(consulta)) }))
    .filter((a) => a.temas.length > 0);
  const marcar = (codigo: string) => setElegidos((prev) => prev.includes(codigo) ? prev.filter((c) => c !== codigo) : [...prev, codigo]);
  const iniciar = () => {
    if (!total || pendiente) return;
    const params = new URLSearchParams({ iniciar: '1', anios: anio, temas: modo === 'todas' ? 'todos' : seleccionados.map((t) => t.codigo).sort().join(',') });
    empezar(() => router.push(`/estudio/examenes?${params}`));
  };

  if (sesion) {
    const cantidad = temas.filter((t) => !sesion.codigos.length || sesion.codigos.includes(t.codigo))
      .reduce((n, t) => n + sesion.anios.reduce((s, y) => s + (t.porAnio[y] ?? 0), 0), 0);
    return (
      <div className={cx('examenes')}>
        <Link href="/estudio/examenes" className={cx('examenes-volver')}><Icono n="arrowLeft" />Cambiar selección</Link>
        <header className={cx('examenes-cabecera')}>
          <span className={cx('examenes-etiqueta')}>Exámenes · ENCIB</span>
          <h1>{sesion.codigos.length ? 'Practica por temas' : 'Banqueo general'}</h1>
          <p>{cantidad} preguntas · {sesion.anios.join(', ')} · {sesion.codigos.length ? `${sesion.codigos.length} temas elegidos` : 'Todos los temas'}</p>
        </header>
        <p className={cx('examenes-ayuda')}><Icono n="bookmark" />Tu avance se guarda en este navegador. Puedes salir y retomar la misma selección.</p>
        <PracticaEncib key={`${sesion.anios.join(',')}:${sesion.codigos.join(',')}`} sesion={sesion}
          areas={catalogo.areas.map(({ codigo, nombre, color }) => ({ codigo, nombre, color }))}
          planState={planState} isAuthed={isAuthed} requiredPlan="interno" />
      </div>
    );
  }

  return (
    <div className={cx('examenes', modo === 'temas' && total > 0 && 'examenes-con-seleccion')}>
      <header className={cx('examenes-cabecera')}>
        <span className={cx('examenes-etiqueta')}><Icono n="quiz" />Banco de exámenes</span>
        <h1>Practica para el ENCIB</h1>
        <p>Preguntas de exámenes anteriores, reunidas en un solo lugar. Elige qué quieres practicar.</p>
        <div className={cx('examenes-datos')}><span>{totalBanco} preguntas</span><span>{catalogo.anios.length} exámenes</span><span>Con explicaciones</span></div>
      </header>

      <div className={cx('examenes-distribucion')}>
        <div>
          <fieldset className={cx('examenes-modos')}>
            <legend>¿Cómo quieres practicar?</legend>
            {([
              ['todas', 'layers', 'Todas las preguntas', 'Combina todos los temas en un banqueo general.'],
              ['temas', 'target', 'Por temas', 'Elige uno o varios temas para reforzarlos.'],
            ] as const).map(([valor, icono, titulo, desc]) => (
              <label key={valor} className={cx('examenes-modo', modo === valor && 'is-elegido')}>
                <input type="radio" name="modo-examen" value={valor} checked={modo === valor} onChange={() => setModo(valor)} />
                <Icono n={icono} /><strong>{titulo}</strong><span>{desc}</span>
              </label>
            ))}
          </fieldset>

          <div className={cx('examenes-anio')}>
            <label htmlFor="examen-anio">Preguntas de</label>
            <Desplegable id="examen-anio" etiqueta="Preguntas de" variante="campo" icono="quiz" valor={anio} onCambiar={setAnio}
              opciones={[
                { value: 'todos', label: 'Todos los años', descripcion: catalogo.anios.join(' · '), simbolo: 'layers', etiqueta: `${totalBanco} preg.` },
                ...catalogo.anios.map((y) => ({ value: String(y), label: `ENCIB ${y}`, descripcion: y === 2021 ? 'Cuadernillo piloto' : 'Cuadernillo oficial', simbolo: 'quiz' as const,
                  etiqueta: `${temas.reduce((n, t) => n + (t.porAnio[y] ?? 0), 0)} preg.` })),
              ]} />
          </div>

          {modo === 'temas' && (
            <section className={cx('examenes-temas')} aria-labelledby="examen-temas-titulo">
              <div className={cx('examenes-temas-cabecera')}>
                <h2 id="examen-temas-titulo">Elige materias o temas</h2>
                <button type="button" onClick={() => setElegidos([])} disabled={!elegidos.length}>Limpiar selección</button>
              </div>
              <p>Selecciona una materia completa con un clic, o elige sus temas uno por uno.</p>
              <div className={cx('examenes-materias')} role="group" aria-label="Seleccionar materias completas">
                {materias.map((a) => {
                  const codigos = a.temas.map((t) => t.codigo);
                  const marcados = codigos.filter((codigo) => elegidos.includes(codigo)).length;
                  const completa = codigos.length > 0 && marcados === codigos.length;
                  const parcial = marcados > 0 && !completa;
                  const cantidad = a.temas.reduce((n, t) => n + contar(t), 0);
                  return (
                    <button key={a.codigo} type="button" className={cx('examenes-materia', completa && 'is-elegida', parcial && 'is-parcial')}
                      disabled={!cantidad} aria-pressed={parcial ? 'mixed' : completa} aria-label={cantidad ? `${a.nombre}: ${cantidad} preguntas. ${completa ? 'Desmarcar' : 'Seleccionar'} materia completa` : `${a.nombre}: sin preguntas en los años elegidos`}
                      onClick={() => setElegidos((prev) => alternarMateria(prev, codigos))}>
                      <span className={cx('examenes-materia-sigla')} aria-hidden="true">{a.codigo}</span>
                      <span className={cx('examenes-materia-texto')}><strong>{a.nombre}</strong><small>{cantidad ? `${cantidad} preguntas · ${a.temas.length} temas${parcial ? ` · ${marcados} elegidos` : ''}` : 'Sin preguntas en los años elegidos'}</small></span>
                      <span className={cx('examenes-casilla')} aria-hidden="true">{completa ? <Icono n="check" /> : parcial ? <span /> : null}</span>
                    </button>
                  );
                })}
              </div>
              <div className={cx('examenes-detalle-titulo')}><Icono n="search" /><h3>O elige temas individuales</h3></div>
              <div className={cx('examenes-buscar')}><Icono n="search" />
                <input ref={buscador} type="search" aria-label="Buscar tema o materia" placeholder="Buscar tema o materia…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                {busqueda && <button type="button" className={cx('campo-limpiar')} aria-label="Limpiar búsqueda de temas" onClick={() => { setBusqueda(''); buscador.current?.focus(); }}><Icono n="close" /></button>}
              </div>
              <div className={cx('examenes-lista')}>
                {visibles.map((a) => (
                  <fieldset key={a.codigo} className={cx('examenes-area')}>
                    <legend>{a.nombre}</legend>
                    {a.temas.map((t) => (
                      <label key={t.codigo} className={cx('examenes-tema', elegidos.includes(t.codigo) && 'is-elegido')}>
                        <input type="checkbox" checked={elegidos.includes(t.codigo)} onChange={() => marcar(t.codigo)} />
                        <span>{t.nombre}<small>{t.codigo}</small></span>
                        <span className={cx('examenes-conteo')}>{contar(t)} <span>preg.</span></span>
                      </label>
                    ))}
                  </fieldset>
                ))}
                {!visibles.length && <div className={cx('examenes-vacio')}><p>No hay temas que coincidan con “{busqueda}”.</p><button type="button" onClick={() => { setBusqueda(''); buscador.current?.focus(); }}>Limpiar búsqueda</button></div>}
              </div>
            </section>
          )}
        </div>

        <aside className={cx('examenes-resumen')} aria-labelledby="examen-resumen-titulo">
          <span className={cx('examenes-etiqueta')}>Tu práctica</span>
          <h2 id="examen-resumen-titulo">{modo === 'todas' ? 'Banqueo general' : 'Selección por temas'}</h2>
          <div className={cx('examenes-total')} role="status" aria-live="polite" aria-atomic="true"><strong>{total}</strong><span>preguntas para resolver</span></div>
          <dl><div><dt>Temas</dt><dd>{modo === 'todas' ? 'Todos' : seleccionados.length}</dd></div><div><dt>Exámenes</dt><dd>{anio === 'todos' ? catalogo.anios.join(', ') : anio}</dd></div><div><dt>Modalidad</dt><dd>A tu ritmo</dd></div></dl>
          <p className={cx('examenes-ayuda')}><Icono n="info" />Verás la explicación después de responder cada pregunta.</p>
          {modo === 'temas' && !total && <p id="examen-seleccion-ayuda" className={cx('examenes-aviso')}>Selecciona al menos un tema para empezar.</p>}
          <button type="button" className={cx('examenes-empezar')} disabled={!total || pendiente} aria-busy={pendiente || undefined} aria-describedby={modo === 'temas' && !total ? 'examen-seleccion-ayuda' : undefined} onClick={iniciar}>
            {pendiente ? 'Preparando…' : 'Empezar práctica'}<Icono n="arrow" />
          </button>
          <p className={cx('examenes-nota')}>Tu avance se guarda en este navegador.</p>
        </aside>
      </div>

      {modo === 'temas' && total > 0 && (
        <div className={cx('examenes-acciones-movil')}>
          <span><strong>{total} preguntas</strong><small>{seleccionados.length} temas elegidos</small></span>
          <button type="button" className={cx('examenes-empezar')} aria-label="Practicar selección" disabled={pendiente} aria-busy={pendiente || undefined} onClick={iniciar}>{pendiente ? 'Preparando…' : 'Practicar'}<Icono n="arrow" /></button>
        </div>
      )}
      <details className={cx('examenes-preguntas')}><summary>¿En qué se diferencia del banqueo de cada tema?</summary><p>En Estudiar practicas el contenido de la clase o tema que tienes abierto. Aquí reúnes preguntas de exámenes anteriores y puedes combinar distintos temas y años en una misma práctica.</p></details>
    </div>
  );
}
