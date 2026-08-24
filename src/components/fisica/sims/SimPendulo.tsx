'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Segmented, useAcento, useSimCanvas, rejilla, texto, alfa, type CanvasCtx,
} from './SimShell';
import { LabShell, LabSlider, LabFila } from './LabShell';
import styles from '@/styles/fisicaSim.module.css';

type Modo = 'masa' | 'longitud';

/**
 * Periodo EXACTO del péndulo simple, sin la aproximación de ángulo pequeño:
 *   T = 4·√(L/g)·K(m),  con m = sen²(θ₀/2)
 * K es la integral elíptica completa de primera especie, que se evalúa por la
 * media aritmético-geométrica (converge en ~4 iteraciones y es exacta a
 * precisión de máquina). Hace falta de verdad: la gracia de la sección es
 * poder comparar este número contra el que da 2π√(L/g), y una serie truncada
 * metería su propio error justo donde el alumno está midiendo el error de la
 * aproximación.
 */
function periodoExacto(L: number, g: number, theta0: number) {
  const m = Math.sin(theta0 / 2) ** 2;
  let a = 1;
  let b = Math.sqrt(1 - m);
  for (let i = 0; i < 6; i++) {
    const an = (a + b) / 2;
    b = Math.sqrt(a * b);
    a = an;
  }
  const K = Math.PI / (2 * a);
  return 4 * Math.sqrt(L / g) * K;
}

interface EstadoPendulo { th: number; om: number; }

/** Integrador RK4 de θ'' = −(g/L)·sen θ — el péndulo REAL, sin linealizar. */
function pasoRK4(s: EstadoPendulo, L: number, g: number, dt: number): EstadoPendulo {
  const acc = (th: number) => -(g / L) * Math.sin(th);
  const k1v = acc(s.th),               k1x = s.om;
  const k2v = acc(s.th + k1x * dt / 2), k2x = s.om + k1v * dt / 2;
  const k3v = acc(s.th + k2x * dt / 2), k3x = s.om + k2v * dt / 2;
  const k4v = acc(s.th + k3x * dt),     k4x = s.om + k3v * dt;
  return {
    th: s.th + (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x),
    om: s.om + (dt / 6) * (k1v + 2 * k2v + 2 * k3v + k4v),
  };
}

/** Claves de `preset` que acepta esta sim: `longitud`, `angulo`, `g`. */
export default function SimPendulo({
  acento: acentoBase,
  preset,
}: {
  acento: string;
  preset?: Record<string, number>;
}) {
  const [acento, setAcento] = useAcento(acentoBase);
  const [longitud, setLongitud] = useState(1);     // m
  const [angulo, setAngulo] = useState(15);        // grados
  const [g, setG] = useState(9.81);                // m/s²
  const [modo, setModo] = useState<Modo>('masa');

  const th0 = (angulo * Math.PI) / 180;
  const tExacto = periodoExacto(longitud, g, th0);
  const tFormula = 2 * Math.PI * Math.sqrt(longitud / g);
  const errorPct = ((tExacto - tFormula) / tFormula) * 100;
  // v en el punto más bajo, con la aproximación de ángulo pequeño: es la que el
  // panel enseña, y la misma que se deduce de igualar potencial y cinética.
  const vMax = th0 * Math.sqrt(g * longitud);

  const vivo = useRef<Record<string, number>>({});

  // El segundo péndulo cambia lo que el modo esté comparando.
  const longitudB = modo === 'longitud' ? longitud * 1.6 : longitud;

  const est = useRef({ longitud, longitudB, g, th0 });
  est.current = { longitud, longitudB, g, th0 };

  // Estado físico de los dos péndulos + el t del frame anterior, para derivar dt.
  const sim = useRef<{ a: EstadoPendulo; b: EstadoPendulo; tPrev: number; semilla: number }>({
    a: { th: th0, om: 0 },
    b: { th: th0, om: 0 },
    tPrev: 0,
    semilla: th0,
  });

  // Cambiar θ₀ o reiniciar debe recolocar los péndulos, no dejarlos donde iban.
  if (sim.current.semilla !== th0) {
    sim.current = { a: { th: th0, om: 0 }, b: { th: th0, om: 0 }, tPrev: sim.current.tPrev, semilla: th0 };
  }

  const resetear = () => {
    sim.current = { a: { th: th0, om: 0 }, b: { th: th0, om: 0 }, tPrev: 0, semilla: th0 };
  };

  const dibujar = (c: CanvasCtx) => {
    const { ctx, w, h, t, paleta } = c;
    const { longitud: L, longitudB: LB, g: gg } = est.current;

    // dt derivado del tiempo simulado: en pausa vale 0 y la escena se congela.
    let dt = t - sim.current.tPrev;
    sim.current.tPrev = t;
    if (dt > 0) {
      dt = Math.min(dt, 0.05);
      const sub = 0.002;
      let restante = dt;
      while (restante > 0) {
        const paso = Math.min(sub, restante);
        sim.current.a = pasoRK4(sim.current.a, L, gg, paso);
        sim.current.b = pasoRK4(sim.current.b, LB, gg, paso);
        restante -= paso;
      }
    }

    rejilla(c, 28);

    const cy = 46;
    const escala = Math.min((h - 110) / Math.max(L, LB), 190); // px por metro
    const pivA = { x: w * 0.33, y: cy };
    const pivB = { x: w * 0.67, y: cy };

    // Techo
    ctx.save();
    ctx.strokeStyle = alfa(paleta.ink, 0.3);
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(w * 0.14, cy);
    ctx.lineTo(w * 0.86, cy);
    ctx.stroke();
    ctx.restore();

    const pintar = (
      piv: { x: number; y: number },
      s: EstadoPendulo,
      largo: number,
      radio: number,
      color: string,
      etiqueta: string,
    ) => {
      const bx = piv.x + Math.sin(s.th) * largo * escala;
      const by = piv.y + Math.cos(s.th) * largo * escala;

      // Arco de la trayectoria
      ctx.save();
      ctx.strokeStyle = alfa(paleta.ink, 0.13);
      ctx.setLineDash([3, 5]);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(piv.x, piv.y, largo * escala, Math.PI / 2 - est.current.th0, Math.PI / 2 + est.current.th0);
      ctx.stroke();
      ctx.restore();

      // Vertical de referencia
      ctx.save();
      ctx.strokeStyle = alfa(paleta.ink, 0.2);
      ctx.setLineDash([3, 4]);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(piv.x, piv.y);
      ctx.lineTo(piv.x, piv.y + largo * escala + 14);
      ctx.stroke();
      ctx.restore();

      // Hilo
      ctx.save();
      ctx.strokeStyle = alfa(paleta.ink, 0.55);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(piv.x, piv.y);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.restore();

      // Pivote
      ctx.save();
      ctx.fillStyle = alfa(paleta.ink, 0.5);
      ctx.beginPath();
      ctx.arc(piv.x, piv.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Bola
      ctx.save();
      ctx.fillStyle = color;
      ctx.shadowColor = alfa(color, 0.5);
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 4;
      ctx.beginPath();
      ctx.arc(bx, by, radio, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      texto(c, etiqueta, bx, by + radio + 15, { align: 'center', size: 11, peso: 700, color: alfa(paleta.ink, 0.65) });
      return { bx, by };
    };

    const colorB = alfa(paleta.ink, 0.42);
    const radioA = 15;
    const radioB = modo === 'masa' ? 23 : 15;

    pintar(pivA, sim.current.a, L, radioA,
      paleta.acento,
      modo === 'masa' ? '1 kg' : `L = ${L.toFixed(2)} m`);
    pintar(pivB, sim.current.b, LB, radioB,
      colorB,
      modo === 'masa' ? '4 kg' : `L = ${LB.toFixed(2)} m`);

    // Ángulo actual del péndulo A
    const gradA = (sim.current.a.th * 180) / Math.PI;
    vivo.current = { t, th: gradA };
    ctx.save();
    ctx.strokeStyle = paleta.acento;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pivA.x, pivA.y, 32, Math.PI / 2, Math.PI / 2 + sim.current.a.th, sim.current.a.th < 0);
    ctx.stroke();
    ctx.restore();
    texto(c, `${Math.abs(gradA).toFixed(0)}°`, pivA.x + (gradA > 0 ? 42 : -42), pivA.y + 30, {
      align: 'center', size: 11, peso: 800, color: paleta.acento,
    });

    // Veredicto: ¿siguen en fase?
    const desfase = Math.abs(sim.current.a.th - sim.current.b.th);
    const enFase = modo === 'masa';
    texto(
      c,
      enFase ? '⟷  Van sincronizados: la masa no entra en la fórmula'
             : `⟷  Se separan: L sí cambia el periodo  (desfase ${((desfase * 180) / Math.PI).toFixed(0)}°)`,
      w / 2,
      h - 16,
      { align: 'center', size: 11.5, peso: 700, color: enFase ? paleta.acento : alfa(paleta.ink, 0.6) },
    );
  };

  // `onReiniciar` resiembra los dos péndulos: aquí la escena se INTEGRA, así
  // que poner el reloj a cero sin recolocarlos los dejaría donde iban.
  const { canvasRef, reloj } = useSimCanvas(dibujar, { alto: 380, onReiniciar: resetear });

  useEffect(() => {
    if (!preset) return;
    if (preset.longitud !== undefined) setLongitud(preset.longitud);
    if (preset.angulo   !== undefined) setAngulo(preset.angulo);
    if (preset.g        !== undefined) setG(preset.g);
    reloj.reanudar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  const gravedades: { id: string; label: string; v: number }[] = [
    { id: 'tierra', label: 'Tierra', v: 9.81 },
    { id: 'luna',   label: 'Luna',   v: 1.62 },
    { id: 'marte',  label: 'Marte',  v: 3.72 },
  ];

  return (
    <LabShell
      titulo="Péndulo simple: periodo real contra el de la fórmula"
      acento={acento}
      onAcento={setAcento}
      sim="pendulo"
      reloj={reloj}
      magnitudes={{
        L: longitud, g, th0: angulo, th0r: th0,
        Tf: tFormula, T: tExacto, err: errorPct, f: 1 / tExacto, vmax: vMax,
      }}
      vivoRef={vivo}
      icono={
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M12 3v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16" r="4" stroke="currentColor" strokeWidth="2" />
        </svg>
      }
      mando={
        <>
          <LabSlider label="Longitud  L" magnitud="L" valor={longitud} display={`${longitud.toFixed(2)} m`}
            min={0.2} max={2.5} paso={0.05} onChange={setLongitud} />
          <LabSlider label="Ángulo inicial  θ₀" magnitud="th0" valor={angulo} display={`${angulo}°`}
            min={5} max={90} paso={1} onChange={setAngulo} />

          <LabFila label="Gravedad">
            {gravedades.map((gr) => (
              <button
                key={gr.id}
                type="button"
                className={`${styles.btn} ${Math.abs(g - gr.v) < 0.01 ? styles.btnActivo : ''}`}
                onClick={() => { setG(gr.v); resetear(); }}
              >
                {gr.label} · {gr.v.toFixed(2)}
              </button>
            ))}
          </LabFila>

          <LabFila label="Comparar">
            <Segmented
              valor={modo}
              onChange={(v) => { setModo(v); resetear(); }}
              opciones={[
                { id: 'masa',     label: 'Dos masas distintas' },
                { id: 'longitud', label: 'Dos longitudes distintas' },
              ]}
            />
          </LabFila>
        </>
      }
      nota={
        <>
          A 5° el error de usar T = 2π√(L/g) es de milésimas; a 60° ya pasa del 7 %. Ahí es donde
          deja de valer decir que el péndulo es un oscilador armónico simple.
        </>
      }
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </LabShell>
  );
}
