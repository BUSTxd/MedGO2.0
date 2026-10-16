import Image from 'next/image';
import { IMG_HUB, MATERIAS, TARJETAS_EXAMEN } from '@/lib/data/encib/hub';
import Hueso, { Esqueleto } from './Hueso';
import e from '@/styles/esqueletos.module.css';
import s from '@/styles/cursosHubEscena.module.css';

/** Un píxel de la referencia (lo define `.escenario`). */
const u = (n: number) => `calc(${n} * var(--u))`;

/** Anchos de los textos de las ventajas, en píxeles de la referencia. */
const VENTAJAS = [190, 250, 220, 200];

/** Una tarjeta del carrusel: el dibujo en gris con título, texto y botón dentro. */
function Tarjeta() {
  const { ancho, alto } = TARJETAS_EXAMEN[0];
  return (
    <Hueso w="100%" r={u(19)} className={e.escTarjeta} style={{ aspectRatio: `${ancho} / ${alto}` }}>
      <span className={e.linea} style={{ width: '62%', height: u(28) }} />
      <span className={e.linea} style={{ width: '86%', height: u(13) }} />
      <span className={e.linea} style={{ width: '70%', height: u(13), marginBottom: u(10) }} />
      <span className={e.linea} style={{ width: '100%', height: u(50), borderRadius: 999 }} />
    </Hueso>
  );
}

/**
 * El escenario de exámenes (`cursos/examen`, cuentas de Cayetano): las cajas son
 * las del escenario real, así que se mide en `--u` igual que él y cabe en la
 * misma pantalla sin scroll. El fondo es la imagen de verdad (va `immutable`,
 * así que sale de caché): lo que se espera son tarjetas, materias y textos.
 */
export default function EsqueletoEscenario() {
  return (
    <Esqueleto>
      <div className={s.escenario}>
        <div className={s.fondo} aria-hidden>
          <Image src={IMG_HUB.fondo} alt="" fill unoptimized sizes="100vw" className={s.fondoImg} />
          <span className={s.fondoZonas} />
        </div>

        <div className={s.cayetanoCuadro}>
          <Hueso w="56%" h="56%" r={u(6)} />
        </div>

        <header className={s.cabecera}>
          <Hueso w={u(56)} h={u(56)} r={u(16)} />
          <div>
            <Hueso w={u(170)} h={u(38)} mb={6} />
            <Hueso w={u(340)} h={u(17)} />
          </div>
        </header>

        <div className={s.lienzo}>
          <div className={s.carrusel}>
            <div className={s.podio}>
              <Hueso w={u(726)} h={u(58)} r="50%" />
            </div>

            <div className={s.escena}>
              {[-1, 0, 1].map((pos) => (
                <div key={pos} className={s.tarjeta} data-pos={pos}>
                  <Tarjeta />
                </div>
              ))}
            </div>

            <Hueso r="50%" className={`${e.escFlecha} ${s.flechaGrandeIzq}`} />
            <Hueso r="50%" className={`${e.escFlecha} ${s.flechaGrandeDer}`} />

            <div className={s.puntos}>
              {[13, 18, 13].map((d, i) => (
                <Hueso key={i} w={u(d)} h={u(d)} r="50%" />
              ))}
            </div>
          </div>

          <div className={s.franja}>
            <div className={s.franjaCabecera}>
              <span className={s.franjaTitulo}>
                <Hueso w={u(32)} h={u(32)} r="50%" />
                <Hueso w={u(330)} h={u(20)} />
              </span>
              <Hueso w={u(270)} h={u(15)} className={s.franjaExplora} />
            </div>
            <div className={s.franjaCuerpo}>
              <div className={s.franjaPista}>
                {MATERIAS.map((m) => (
                  <div key={m.slug} className={s.materia}>
                    <Hueso w={u(92)} h={u(92)} r={u(22)} />
                    <Hueso w={u(Math.max(56, m.nombre.length * 7.2))} h={u(13)} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ul className={s.ventajas}>
            {VENTAJAS.map((w, i) => (
              <li key={i}>
                <Hueso w={u(27)} h={u(27)} r="50%" />
                <Hueso w={u(w)} h={u(15)} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Esqueleto>
  );
}
