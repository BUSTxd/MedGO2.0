'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Btn, useAcento, useSimCanvas, rejilla, texto, alfa, type CanvasCtx,
} from './SimShell';
import { LabShell, LabSlider, LabFila } from './LabShell';
import styles from '@/styles/fisicaSim.module.css';

/**
 * C14 · Efecto fotoeléctrico: el experimento que obligó a aceptar el fotón.
 *
 * Toda la escena está montada alrededor del hecho que la física clásica no
 * podía explicar: subir la INTENSIDAD manda más fotones y no cambia ni un
 * electronvoltio la energía de cada electrón, mientras que subir la FRECUENCIA
 * sí. Por eso hay dos perillas separadas y el veredicto se lee en dos sitios
 * distintos —cuántos electrones salen y con cuánta energía—: si estuvieran en
 * un único número, el contraste se perdería.
 *
 * El corte en f₀ es tajante a propósito. Con una onda clásica bastaría esperar
 * a que la energía se acumulase; aquí, por debajo del umbral, no sale ninguno
 * por mucho que se suba la intensidad, y eso es exactamente lo que se ve.
 */

/** Claves de `preset`: `lambda`, `trabajo`, `intensidad`. */

/** h en eV·s: en este tema las energías se manejan en electronvoltios. */
const H_EV = 4.136e-15;
const C_LUZ = 2.998e8;
const M_ELECTRON = 9.109e-31;
const J_POR_EV = 1.602e-19;

/** Funciones de trabajo de tabla, en eV. */
const METALES = [
  { id: 'cesio',    label: 'Cesio',    W0: 2.14 },
  { id: 'sodio',    label: 'Sodio',    W0: 2.28 },
  { id: 'zinc',     label: 'Zinc',     W0: 4.3 },
  { id: 'platino',  label: 'Platino',  W0: 5.65 },
];

export default function SimFotoelectrico({
  acento: acentoBase,
  preset,
}: {
  acento: string;
  preset?: Record<string, number>;
}) {
  const [acento, setAcento] = useAcento(acentoBase);
  const [lamNm, setLamNm] = useState(400);   // nm
  const [W0, setW0] = useState(2.28);        // eV — sodio
  const [intensidad, setIntensidad] = useState(50); // %

  const lam = lamNm * 1e-9;
  const f = C_LUZ / lam;
  // 1240 eV·nm es h·c redondeado: la constante que se usa a mano en clase, y
  // la que el panel muestra en la fórmula «práctica».
  const E = 1240 / lamNm;
  const Kmax = Math.max(E - W0, 0);
  const emite = E > W0;
  const f0 = W0 / H_EV;
  const lam0 = 1240 / W0;
  const V0 = Kmax;
  const ve = Math.sqrt((2 * Kmax * J_POR_EV) / M_ELECTRON);
  const ne = emite ? (intensidad / 100) * 6e14 : 0;

  const est = useRef({ lamNm, emite, Kmax, intensidad, E, W0 });
  est.current = { lamNm, emite, Kmax, intensidad, E, W0 };

  const vivo = useRef<Record<string, number>>({});

  /** Fotones en vuelo y electrones arrancados, en coordenadas del lienzo. */
  const escena = useRef({
    fotones: [] as { x: number; y: number }[],
    electrones: [] as { x: number; y: number; vx: number; vy: number }[],
    tPrev: 0,
    semilla: 1,
  });

  const reiniciarEscena = () => {
    escena.current = { fotones: [], electrones: [], tPrev: 0, semilla: 1 };
  };

  /**
   * Ruido determinista: `Math.random()` daría una escena distinta en cada
   * frame de servidor y cliente, y aquí basta con que los fotones no salgan
   * todos alineados.
   */
  const azar = () => {
    escena.current.semilla = (escena.current.semilla * 1103515245 + 12345) % 2147483648;
    return escena.current.semilla / 2147483648;
  };

  const dibujar = (c: CanvasCtx) => {
    const { ctx, w, h, t, paleta } = c;
    const s = est.current;

    let dt = t - escena.current.tPrev;
    escena.current.tPrev = t;
    dt = dt > 0 ? Math.min(dt, 0.05) : 0;

    rejilla(c, 28);

    const placaX = w * 0.42;
    const colectorX = w - 54;
    const arriba = 42;
    const abajo = h - 96;

    /* ─── Color del haz según λ ───────────────────────────────────────── */
    // Aproximación de longitud de onda a color visible; fuera del visible se
    // rotula, porque pintar el ultravioleta de violeta mentiría.
    const colorLuz =
      s.lamNm < 380 ? '#B07BE8'
      : s.lamNm < 450 ? '#6C63E8'
      : s.lamNm < 495 ? '#3BA7DD'
      : s.lamNm < 570 ? '#3FC46B'
      : s.lamNm < 590 ? '#E8D23B'
      : s.lamNm < 620 ? '#E89A3B'
      : '#E85B4A';

    /* ─── Emisión de fotones ──────────────────────────────────────────── */
    if (dt > 0) {
      const cuantos = Math.round((s.intensidad / 100) * 5);
      for (let i = 0; i < cuantos; i++) {
        escena.current.fotones.push({ x: 12, y: arriba + azar() * (abajo - arriba) });
      }
      escena.current.fotones = escena.current.fotones.filter((p) => {
        p.x += 340 * dt;
        if (p.x < placaX) return true;
        // Al llegar a la placa el fotón desaparece. Si trae bastante energía,
        // arranca un electrón; si no, se absorbe sin más — que es el punto.
        if (s.emite) {
          const rapidez = 60 + Math.min(s.Kmax, 6) * 62;
          escena.current.electrones.push({
            x: placaX + 6,
            y: p.y,
            vx: rapidez,
            vy: (azar() - 0.5) * rapidez * 0.5,
          });
        }
        return false;
      });

      escena.current.electrones = escena.current.electrones.filter((e) => {
        e.x += e.vx * dt;
        e.y += e.vy * dt;
        return e.x < colectorX && e.y > arriba - 20 && e.y < abajo + 20;
      });
    }

    /* ─── Haz ─────────────────────────────────────────────────────────── */
    escena.current.fotones.forEach((p) => {
      ctx.save();
      ctx.strokeStyle = colorLuz;
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x - 16, p.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.restore();
    });

    /* ─── Placa metálica ──────────────────────────────────────────────── */
    ctx.save();
    ctx.fillStyle = alfa(paleta.ink, 0.45);
    ctx.beginPath();
    ctx.roundRect(placaX, arriba - 10, 12, abajo - arriba + 20, 4);
    ctx.fill();
    ctx.restore();
    texto(c, `W₀ = ${s.W0.toFixed(2)} eV`, placaX + 6, abajo + 26, {
      align: 'center', size: 10.5, peso: 700,
    });

    /* ─── Electrones ──────────────────────────────────────────────────── */
    escena.current.electrones.forEach((e) => {
      ctx.save();
      ctx.fillStyle = paleta.acento;
      ctx.shadowColor = alfa(paleta.acento, 0.55);
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(e.x, e.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    /* ─── Colector ────────────────────────────────────────────────────── */
    ctx.save();
    ctx.fillStyle = alfa(paleta.acento, 0.35);
    ctx.beginPath();
    ctx.roundRect(colectorX, arriba - 10, 10, abajo - arriba + 20, 4);
    ctx.fill();
    ctx.restore();

    /* ─── Veredicto ───────────────────────────────────────────────────── */
    ctx.save();
    ctx.fillStyle = alfa(s.emite ? paleta.acento : '#E85B4A', 0.1);
    ctx.beginPath();
    ctx.roundRect(20, h - 62, w - 40, 44, 10);
    ctx.fill();
    ctx.restore();

    texto(
      c,
      s.emite
        ? `salen electrones · K máx = ${s.Kmax.toFixed(2)} eV`
        : `NO sale ni un electrón · el fotón trae ${s.E.toFixed(2)} eV y hacen falta ${s.W0.toFixed(2)}`,
      w / 2, h - 46,
      { align: 'center', size: 12.5, peso: 800, color: s.emite ? paleta.acento : '#E85B4A' },
    );
    texto(
      c,
      s.emite
        ? 'sube la intensidad: salen MÁS electrones, pero cada uno con la misma energía'
        : `por debajo de λ₀ = ${lam0.toFixed(0)} nm no hay emisión, por mucha luz que eches`,
      w / 2, h - 28, { align: 'center', size: 10.5 },
    );

    texto(c, `λ = ${s.lamNm} nm${s.lamNm < 380 ? ' · ultravioleta' : s.lamNm > 700 ? ' · infrarrojo' : ''}`,
      20, 22, { size: 11, peso: 700, color: colorLuz });

    // Sólo el tiempo: cuántos electrones caben en pantalla es una decisión de
    // dibujo, no una magnitud, y publicarlo como «electrones/s» sería inventar
    // un dato que la escena no calcula.
    vivo.current = { t };
  };

  const { canvasRef, reloj } = useSimCanvas(dibujar, { alto: 380, onReiniciar: reiniciarEscena });

  useEffect(() => {
    if (!preset) return;
    if (preset.lambda     !== undefined) setLamNm(preset.lambda * 1e9);
    if (preset.trabajo    !== undefined) setW0(preset.trabajo);
    if (preset.intensidad !== undefined) setIntensidad(preset.intensidad);
    reloj.reanudar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  return (
    <LabShell
      titulo="Efecto fotoeléctrico: por qué la luz tiene que venir en paquetes"
      acento={acento}
      onAcento={setAcento}
      sim="fotoelectrico"
      reloj={reloj}
      magnitudes={{
        f, lam, lamNm, W0, E, Kmax, f0, lam0, V0, ve, inten: intensidad, ne,
      }}
      vivoRef={vivo}
      icono={
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      }
      mando={
        <>
          <LabSlider label="Longitud de onda  λ" magnitud="lamNm" valor={lamNm}
            display={`${lamNm} nm`}
            min={180} max={800} paso={5} onChange={setLamNm} />
          <LabSlider label="Función trabajo  W₀" magnitud="W0" valor={W0}
            display={`${W0.toFixed(2)} eV`}
            min={1.5} max={6} paso={0.01} onChange={setW0} />
          <LabSlider label="Intensidad del haz" magnitud="inten" valor={intensidad}
            display={`${intensidad} %`}
            min={5} max={100} paso={5} onChange={setIntensidad} />

          <LabFila label="Metal">
            {METALES.map((metal) => (
              <Btn
                key={metal.id}
                activo={Math.abs(W0 - metal.W0) < 0.02}
                onClick={() => setW0(metal.W0)}
              >
                {metal.label} · {metal.W0} eV
              </Btn>
            ))}
          </LabFila>
        </>
      }
      nota={
        <>
          Ponte justo por debajo del umbral y sube la <strong>intensidad al máximo</strong>: no sale
          ni un electrón. Ahora baja λ cinco nanómetros y salen de inmediato. Ninguna teoría
          ondulatoria de la luz puede explicar ese corte — de ahí salió el fotón.
        </>
      }
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </LabShell>
  );
}
