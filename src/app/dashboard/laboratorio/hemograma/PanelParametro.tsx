'use client';
/**
 * Panel lateral con la ficha educativa de un parámetro: qué mide, causas de
 * valor alto y bajo, y el dato clínico. Se abre al pulsar cualquier fila del
 * reporte y se cierra con Esc, con el botón o pulsando fuera.
 */
import {
  estadoDe,
  rangoDe,
  formatear,
  GLIFO,
  PALABRA,
  type InfoParametro,
  type Parametro,
  type Sexo,
} from '@/lib/data/hemograma';
import s from '@/styles/hemograma.module.css';

export default function PanelParametro({
  p, info, valor, sexo, simple, onClose,
}: {
  p: Parametro;
  info: InfoParametro;
  valor: number;
  sexo: Sexo;
  simple: boolean;
  onClose: () => void;
}) {
  const estado = estadoDe(valor, p, sexo);
  const r = rangoDe(p, sexo);
  const claseValor = estado === 'bajo' ? s.vBajo : estado === 'alto' ? s.vAlto : s.vNormal;

  return (
    <>
      <div className={s.panelBack} onClick={onClose} aria-hidden />
      <aside className={s.panel} role="dialog" aria-modal="true" aria-label={p.nombre}>
        <button type="button" className={s.panelClose} onClick={onClose} aria-label="Cerrar">
          ×
        </button>

        <span className={s.panelAbrev}>{p.abrev}</span>
        <h3 className={s.panelTitulo}>{p.nombre}</h3>

        <div className={s.panelCifras}>
          <div className={s.panelCifra}>
            <span className={s.panelCifraLabel}>Valor</span>
            <span className={`${s.panelCifraValor} ${claseValor}`}>
              {formatear(valor, p)} <small>{p.unidad}</small>
            </span>
          </div>
          <div className={s.panelCifra}>
            <span className={s.panelCifraLabel}>Referencia</span>
            <span className={s.panelCifraValor}>
              {p.ceroEsNormal ? '0' : `${formatear(r.min, p)} – ${formatear(r.max, p)}`}
            </span>
          </div>
          <div className={s.panelCifra}>
            <span className={s.panelCifraLabel}>Estado</span>
            <span className={`${s.panelCifraValor} ${claseValor}`}>
              <span aria-hidden>{GLIFO[estado]}</span> {PALABRA[estado]}
            </span>
          </div>
        </div>

        {p.formula && (
          <div className={s.panelBloque}>
            <p className={`${s.panelBloqueTitulo} ${s.tNeutro}`}>Se calcula así</p>
            <p className={s.panelTexto}><code>{p.formula}</code></p>
          </div>
        )}

        <div className={s.panelBloque}>
          <p className={`${s.panelBloqueTitulo} ${s.tNeutro}`}>Qué mide</p>
          <p className={s.panelTexto}>{simple ? info.simple : info.queMide}</p>
        </div>

        <div className={s.panelBloque}>
          <p className={`${s.panelBloqueTitulo} ${s.tAlto}`}>
            <span aria-hidden>▲</span> Causas de valor alto
          </p>
          <ul className={s.panelLista}>
            {info.alto.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>

        <div className={s.panelBloque}>
          <p className={`${s.panelBloqueTitulo} ${s.tBajo}`}>
            <span aria-hidden>▼</span> Causas de valor bajo
          </p>
          <ul className={s.panelLista}>
            {info.bajo.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>

        <div className={s.panelDato}>
          <span className={s.panelDatoLabel}>Dato clínico</span>
          {info.dato}
        </div>
      </aside>
    </>
  );
}
