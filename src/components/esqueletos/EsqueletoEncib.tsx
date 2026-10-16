import Hueso, { Esqueleto } from './Hueso';
import e from '@/styles/esqueletos.module.css';
import s from '@/styles/encib.module.css';

/** Anchos de las tres barras (tabla oficial, 2024, 2025) de cada área, en %. */
const PESOS = [
  [62, 70, 58], [27, 22, 30], [35, 40, 31], [35, 28, 38],
  [62, 55, 66], [62, 68, 60], [62, 74, 57], [43, 38, 47],
];

/** Tramos de una barra apilada (menor / mediana / mayor), en flex-grow. */
const APILADAS = [[70, 22, 8], [72, 20, 8], [55, 30, 15]];

/** La cabecera en degradado: sus líneas van claras, no en gris. */
function LineaHero({ w, h, mb, r }: { w: number | string; h: number; mb?: number; r?: number }) {
  return <span className={e.heroLinea} style={{ width: w, height: h, marginBottom: mb, borderRadius: r }} />;
}

function Leyenda({ n }: { n: number }) {
  return (
    <div className={s.leyenda}>
      {Array.from({ length: n }, (_, i) => (
        <span key={i}><Hueso w={12} h={12} r={3} /><Hueso w={56} h={11} /></span>
      ))}
    </div>
  );
}

/**
 * Página del ENCIB 2026 (`cursos/examen/encib`): cabecera con la cuenta atrás,
 * los seis datos, el aviso del banqueo y las dos primeras secciones (peso por
 * área y dificultad). Lo de más abajo no se ve al entrar.
 */
export default function EsqueletoEncib() {
  return (
    <Esqueleto>
      <div className={s.pagina}>
        <Hueso w={92} h={14} mb={14} />

        <header className={s.hero}>
          <div className={s.heroTexto}>
            <LineaHero w={150} h={20} r={999} mb={12} />
            <LineaHero w={200} h={36} mb={8} />
            <LineaHero w={250} h={15} mb={16} />
            <LineaHero w="90%" h={12} mb={6} />
            <LineaHero w="60%" h={12} />
          </div>
          <div className={s.cuenta}>
            <LineaHero w={64} h={50} mb={8} />
            <LineaHero w={110} h={12} />
          </div>
        </header>

        <ul className={s.datos}>
          {Array.from({ length: 6 }, (_, i) => (
            <li key={i}>
              <Hueso w={44} h={19} mb={6} />
              <Hueso w="70%" h={11} />
            </li>
          ))}
        </ul>

        <div className={s.pronto}>
          <Hueso w="95%" h={13} mb={7} />
          <Hueso w="55%" h={13} />
        </div>

        {/* Cuánto pesa cada área */}
        <section className={s.seccion}>
          <Hueso w={230} h={20} mb={10} />
          <Hueso w="min(620px, 100%)" h={13} mb={7} />
          <Hueso w="min(300px, 70%)" h={13} mb={16} />
          <Leyenda n={3} />
          <div className={s.pesos}>
            {PESOS.map((barras, i) => (
              <div key={i} className={s.pesoFila}>
                <span className={s.pesoNombre}>
                  <Hueso w={10} h={10} r="50%" />
                  <Hueso w={i === 7 ? 170 : 96} h={13} />
                </span>
                <span className={s.pesoBarras}>
                  {barras.map((w, j) => (
                    <Hueso key={j} w={`${w}%`} h={7} r="0 4px 4px 0" />
                  ))}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Qué tan difícil es de verdad */}
        <section className={s.seccion}>
          <Hueso w={260} h={20} mb={10} />
          <Hueso w="min(620px, 100%)" h={13} mb={7} />
          <Hueso w="min(420px, 85%)" h={13} mb={16} />
          <Leyenda n={3} />
          {APILADAS.map((tramos, i) => (
            <div key={i} className={s.apilada}>
              <Hueso w={90} h={12} mb={6} />
              <div className={s.apiladaBarra}>
                {tramos.map((g, j) => (
                  <Hueso key={j} h={14} r={4} style={{ flexGrow: g, flexShrink: 1 }} />
                ))}
              </div>
              <div className={s.apiladaCifras}>
                {tramos.map((_, j) => <Hueso key={j} w={80} h={11} />)}
              </div>
            </div>
          ))}
        </section>
      </div>
    </Esqueleto>
  );
}
