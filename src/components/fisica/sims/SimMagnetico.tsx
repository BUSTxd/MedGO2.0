'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Segmented, Btn, useAcento, useSimCanvas, rejilla, texto, alfa, vector, type CanvasCtx,
} from './SimShell';
import { LabShell, LabSlider, LabFila } from './LabShell';
import styles from '@/styles/fisicaSim.module.css';

/**
 * C12 · Las dos mitades del tema en una escena conmutable.
 *
 * `lorentz` — una carga entra en un campo perpendicular y describe un círculo.
 * Lo que hay que ver es que la velocidad no cambia de módulo (la fuerza es
 * siempre perpendicular, así que no hace trabajo) y que el PERIODO no depende
 * de la velocidad: una partícula rápida da una vuelta más ancha en el mismo
 * tiempo. De ahí sale la frecuencia de Larmor, que es la que sintoniza una
 * resonancia magnética.
 *
 * `faraday` — una espira gira dentro del campo. La fem no la produce el campo
 * sino su VARIACIÓN de flujo, y por eso la espira de canto —donde el flujo es
 * cero— es justo donde la fem es máxima. Ese desfase de un cuarto de ciclo es
 * lo que la gráfica enseña y ninguna fórmula estática deja ver.
 *
 * El giro de Lorentz se resuelve de forma ANALÍTICA —la órbita es una
 * circunferencia exacta de radio mv/qB recorrida a ω constante— por el mismo
 * motivo que el masa-resorte: la solución cerrada existe, no acumula deriva
 * numérica y es la que el alumno tiene que reconocer. Integrar aquí sólo
 * añadiría error a una curva que ya conocemos.
 */

/** Claves de `preset`: `carga`, `masa`, `velocidad`, `campo`. */

type Modo = 'lorentz' | 'faraday';

const Q_PROTON = 1.602e-19;
const M_PROTON = 1.673e-27;

export default function SimMagnetico({
  acento: acentoBase,
  preset,
}: {
  acento: string;
  preset?: Record<string, number>;
}) {
  const [acento, setAcento] = useAcento(acentoBase);
  const [modo, setModo] = useState<Modo>('lorentz');
  const [vExp, setVExp] = useState(6);     // log10 de v, en m/s
  const [B, setB] = useState(1.5);         // T
  const [areaCm2, setAreaCm2] = useState(50);
  const [espiras, setEspiras] = useState(120);
  const [rpm, setRpm] = useState(300);

  const v = Math.pow(10, vExp);
  const F = Q_PROTON * v * B;
  const radio = (M_PROTON * v) / (Q_PROTON * B);
  const Tc = (2 * Math.PI * M_PROTON) / (Q_PROTON * B);
  const fc = 1 / Tc;
  const Aesp = areaCm2 / 10000;
  const omega = (rpm * 2 * Math.PI) / 60;

  const est = useRef({ modo, radio, Tc, B, Aesp, espiras, omega });
  est.current = { modo, radio, Tc, B, Aesp, espiras, omega };

  const vivo = useRef<Record<string, number>>({});

  const dibujar = (c: CanvasCtx) => {
    const { ctx, w, h, t, paleta } = c;
    const s = est.current;

    rejilla(c, 28);

    /* ─── Campo B: cruces (entrando en la pantalla) ───────────────────── */
    const paso = 46;
    ctx.save();
    ctx.strokeStyle = alfa(paleta.ink, 0.14 + Math.min(Math.abs(s.B) / 4, 1) * 0.22);
    ctx.lineWidth = 1.6;
    for (let x = paso / 2; x < w; x += paso) {
      for (let y = paso / 2; y < h - 70; y += paso) {
        ctx.beginPath();
        ctx.moveTo(x - 4, y - 4); ctx.lineTo(x + 4, y + 4);
        ctx.moveTo(x + 4, y - 4); ctx.lineTo(x - 4, y + 4);
        ctx.stroke();
      }
    }
    ctx.restore();
    texto(c, `B = ${s.B.toFixed(2)} T · entrando en la pantalla`, w - 24, 20, {
      align: 'right', size: 10.5, peso: 700,
    });

    if (s.modo === 'lorentz') {
      /* ─── Giro del protón ───────────────────────────────────────────── */
      const cx = w / 2;
      const cy = (h - 70) / 2;
      // Radio en píxeles, saturado: con v de 10⁴ a 10⁷ m/s el radio real cambia
      // tres órdenes, así que se comprime para que la órbita siga en pantalla.
      const rPx = Math.min(40 + Math.log10(s.radio / 1e-4) * 34, Math.min(cx, cy) - 34);

      // Ángulo de giro: ω = 2π/T con el T real, escalado a un ritmo mirable.
      const ritmo = (2 * Math.PI) / Math.max(s.Tc * 4e6, 0.6);
      const ang = t * ritmo;
      const px = cx + Math.cos(ang) * rPx;
      const py = cy + Math.sin(ang) * rPx;

      // Órbita
      ctx.save();
      ctx.strokeStyle = alfa(paleta.acento, 0.3);
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 6]);
      ctx.beginPath();
      ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Partícula
      ctx.save();
      ctx.fillStyle = '#E85B4A';
      ctx.shadowColor = alfa('#E85B4A', 0.6);
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      texto(c, '+', px, py - 1, { align: 'center', size: 13, peso: 800, color: '#fff' });

      // Velocidad (tangente) y fuerza (hacia el centro): que sean siempre
      // perpendiculares es la razón de que el módulo de v no cambie nunca.
      vector(c, px, py, -Math.sin(ang) * 46, Math.cos(ang) * 46, paleta.acento, 'v');
      vector(c, px, py, (cx - px) * 0.5, (cy - py) * 0.5, '#F5A623', 'F');

      texto(c, `r = ${radio.toExponential(2)} m`, cx, cy + rPx + 26, {
        align: 'center', size: 11, peso: 700,
      });
      texto(c, `f de Larmor = ${(fc / 1e6).toFixed(2)} MHz · el periodo no depende de v`,
        w / 2, h - 22, { align: 'center', size: 11.5, peso: 800, color: paleta.acento });

      // Sin esto, el flujo y la fem del modo Faraday se quedarían congelados en
      // el panel mientras se mira el giro de la carga, que es otra escena.
      vivo.current = {};
    } else {
      /* ─── Espira girando ────────────────────────────────────────────── */
      const cx = w * 0.3;
      const cy = (h - 90) / 2 + 10;
      const ang = t * Math.min(s.omega, 14);
      const semiAncho = 78;
      const semiAlto = 52;
      // La espira se ve en perspectiva: su anchura aparente es el coseno del
      // ángulo, y eso es exactamente el factor del flujo.
      const aparente = Math.cos(ang);

      ctx.save();
      ctx.strokeStyle = paleta.acento;
      ctx.lineWidth = 3.4;
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.abs(semiAncho * aparente) + 2, semiAlto, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Eje de giro
      ctx.save();
      ctx.strokeStyle = alfa(paleta.ink, 0.3);
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      ctx.moveTo(cx, cy - semiAlto - 22);
      ctx.lineTo(cx, cy + semiAlto + 22);
      ctx.stroke();
      ctx.restore();

      const flujoAhora = s.B * s.Aesp * Math.cos(ang);
      const femAhora = s.espiras * s.B * s.Aesp * s.omega * Math.sin(ang);

      texto(c, `${s.espiras} espiras · ${(s.Aesp * 10000).toFixed(0)} cm²`, cx, cy + semiAlto + 42, {
        align: 'center', size: 10.5, peso: 700,
      });

      /* Gráfica: flujo y fem, para ver el desfase de un cuarto de ciclo. */
      const graf = { x: w * 0.56, y: 40, w: w * 0.38, h: h - 130 };
      ctx.save();
      ctx.fillStyle = alfa(paleta.ink, 0.03);
      ctx.beginPath();
      ctx.roundRect(graf.x - 8, graf.y - 8, graf.w + 16, graf.h + 16, 10);
      ctx.fill();
      ctx.strokeStyle = alfa(paleta.ink, 0.18);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(graf.x, graf.y + graf.h / 2);
      ctx.lineTo(graf.x + graf.w, graf.y + graf.h / 2);
      ctx.stroke();
      ctx.restore();

      const curva = (fn: (a: number) => number, color: string) => {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        for (let i = 0; i <= 90; i++) {
          const a = ang - Math.PI * 2 + (i / 90) * Math.PI * 2;
          const x = graf.x + (i / 90) * graf.w;
          const y = graf.y + graf.h / 2 - fn(a) * (graf.h / 2 - 12);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      };
      curva((a) => Math.cos(a), paleta.acento);
      curva((a) => Math.sin(a), '#F5A623');

      texto(c, 'Φ', graf.x + 8, graf.y + 12, { size: 11, peso: 800, color: paleta.acento });
      texto(c, 'ε', graf.x + 28, graf.y + 12, { size: 11, peso: 800, color: '#F5A623' });
      texto(c, 'un cuarto de ciclo de desfase', graf.x + graf.w, graf.y + 12, {
        align: 'right', size: 9.5,
      });

      texto(c, `Φ = ${flujoAhora.toExponential(2)} Wb · ε = ${femAhora.toFixed(3)} V`,
        w / 2, h - 22, { align: 'center', size: 11.5, peso: 800, color: paleta.acento });

      vivo.current = { flujo: flujoAhora, fem: femAhora };
    }
  };

  // Sin `onReiniciar`: las dos escenas son analíticas y no guardan estado
  // propio, así que poner el reloj a cero ya las devuelve al principio.
  const { canvasRef, reloj } = useSimCanvas(dibujar, { alto: 400 });

  useEffect(() => {
    if (!preset) return;
    if (preset.velocidad !== undefined) setVExp(Math.log10(preset.velocidad));
    if (preset.campo     !== undefined) setB(preset.campo);
    reloj.reanudar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  return (
    <LabShell
      titulo="Magnetismo: la carga que gira y la espira que induce"
      acento={acento}
      onAcento={setAcento}
      sim="magnetico"
      reloj={reloj}
      magnitudes={{
        q: Q_PROTON, mp: M_PROTON, v, B, F, r: radio, Tc, fc, fMHz: fc / 1e6,
        Aesp, th: 45, Nesp: espiras, om: omega,
        flujo: B * Aesp * Math.cos(Math.PI / 4),
        fem: espiras * B * Aesp * omega * Math.sin(Math.PI / 4),
      }}
      vivoRef={vivo}
      icono={
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M6 4v9a6 6 0 0 0 12 0V4" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" />
          <path d="M4 4h4M16 4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      }
      mando={
        <>
          <LabSlider label="Campo  B" magnitud="B" valor={B} display={`${B.toFixed(2)} T`}
            min={0.1} max={7} paso={0.05} onChange={setB} />

          {modo === 'lorentz' ? (
            <LabSlider label="Velocidad  v" magnitud="v" valor={vExp}
              display={`${v.toExponential(1)} m/s`}
              min={4} max={7.3} paso={0.05} onChange={setVExp} />
          ) : (
            <>
              <LabSlider label="Área de la espira" magnitud="Aesp" valor={areaCm2}
                display={`${areaCm2} cm²`}
                min={5} max={300} paso={5} onChange={setAreaCm2} />
              <LabSlider label="Número de espiras" magnitud="Nesp" valor={espiras}
                display={`${espiras}`}
                min={1} max={500} paso={1} onChange={setEspiras} />
              <LabSlider label="Velocidad de giro" magnitud="om" valor={rpm} display={`${rpm} rpm`}
                min={30} max={1800} paso={10} onChange={setRpm} />
            </>
          )}

          <LabFila label="Fenómeno">
            <Segmented
              valor={modo}
              onChange={setModo}
              opciones={[
                { id: 'lorentz', label: 'Carga en el campo' },
                { id: 'faraday', label: 'Espira que induce' },
              ]}
            />
            <Btn activo={Math.abs(B - 1.5) < 0.03} onClick={() => setB(1.5)}>
              Resonancia · 1,5 T
            </Btn>
            <Btn activo={Math.abs(B - 3) < 0.03} onClick={() => setB(3)}>
              Resonancia · 3 T
            </Btn>
          </LabFila>
        </>
      }
      nota={
        modo === 'lorentz' ? (
          <>
            Sube la velocidad y mira el periodo en el panel: <strong>no cambia</strong>. La órbita se
            ensancha justo lo necesario para que la vuelta dure lo mismo. Eso es lo que permite
            sintonizar una resonancia con una sola frecuencia.
          </>
        ) : (
          <>
            Fíjate en las dos curvas: donde el flujo es <strong>máximo</strong> la fem es cero, y
            donde el flujo pasa por cero la fem es máxima. Lo que induce no es el campo, es su ritmo
            de cambio.
          </>
        )
      }
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </LabShell>
  );
}
