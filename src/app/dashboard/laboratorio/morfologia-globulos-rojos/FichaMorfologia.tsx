'use client';
/**
 * Ficha de una morfología: lo que el material de referencia dice de ella.
 *
 * Cada bloque tiene forma propia según lo que contiene (regla del proyecto:
 * no todo es la misma tarjeta gris). El orden reproduce el del material:
 * característica → por qué → asociación clínica, y después los añadidos de
 * sus secciones 3, 4 y 5 (mecanismo, cascada, ruta de estudio).
 */
import type { Clase, Ficha } from '@/lib/data/morfologia-gr';
import { ETIQUETA_CLASE } from '@/lib/data/morfologia-gr';
import s from '@/styles/morfologiaGr.module.css';

/** Renderiza los `**énfasis**` del material sin arrastrar un parser markdown. */
export function Enfasis({ texto }: { texto: string }) {
  return (
    <>
      {texto.split('**').map((parte, i) =>
        i % 2 ? <strong key={i}>{parte}</strong> : <span key={i}>{parte}</span>,
      )}
    </>
  );
}

export default function FichaMorfologia({
  nombre, clase, ficha,
}: {
  nombre: string;
  clase: Clase;
  ficha: Ficha;
}) {
  return (
    <article className={s.ficha}>
      <header className={s.fichaHead}>
        <h3 className={s.fichaNombre}>{nombre}</h3>
        <span className={s.fichaClase}>{ETIQUETA_CLASE[clase]}</span>
      </header>

      {/* Característica — lo que se ve. Va en destacado porque es el criterio
          con el que se reconoce la célula en el frotis. */}
      <div className={s.destacado}>
        <span className={s.destacadoLabel}>Característica</span>
        <p className={s.destacadoTexto}>
          <Enfasis texto={ficha.caracteristica} />
        </p>
      </div>

      <section className={s.bloque}>
        <h4 className={s.bloqueTitulo}>¿Por qué adquiere esa forma?</h4>
        <p className={s.parrafo}>
          <Enfasis texto={ficha.porQue} />
        </p>
      </section>

      <section className={s.bloque}>
        <h4 className={s.bloqueTitulo}>Asociación / importancia clínica</h4>
        <p className={s.parrafo}>
          <Enfasis texto={ficha.asociacion} />
        </p>
      </section>

      {ficha.mecanismo && (
        <p className={s.mecanismo}>
          <span className={s.mecanismoGrupo}>{ficha.mecanismo.grupo}</span>
          <span className={s.mecanismoFrase}>{ficha.mecanismo.frase}</span>
        </p>
      )}

      {ficha.contraste && (
        <div className={s.contraste}>
          <span className={s.contrasteLabel}>Diferencia importante</span>
          <p className={s.contrasteTexto}>
            <Enfasis texto={ficha.contraste} />
          </p>
        </div>
      )}

      {/* Ruta de estudio: cadena horizontal, es una secuencia corta. */}
      {ficha.ruta && (
        <div className={s.ruta}>
          <span className={s.rutaLabel}>Morfología → Mecanismo → Enfermedad → Consecuencia</span>
          <ol className={s.rutaPasos}>
            {ficha.ruta.map((paso, i) => (
              <li key={paso} className={i === 0 ? s.rutaPasoIni : s.rutaPaso}>
                {paso}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Cascada: vertical, porque son eslabones causales encadenados y el
          material la escribe así (una consecuencia bajo la anterior). */}
      {ficha.cascada && (
        <div className={s.cascada}>
          <span className={s.cascadaLabel}>Del déficit de G6PD a la hemólisis</span>
          <ol className={s.cascadaPasos}>
            {ficha.cascada.map((paso) => (
              <li key={paso}>{paso}</li>
            ))}
          </ol>
        </div>
      )}
    </article>
  );
}
