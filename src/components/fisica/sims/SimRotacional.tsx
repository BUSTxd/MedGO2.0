'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Segmented, Btn, useAcento, useSimCanvas, rejilla, texto, alfa, vector, type CanvasCtx,
} from './SimShell';
import { LabShell, LabSlider, LabFila } from './LabShell';
import styles from '@/styles/fisicaSim.module.css';

/**
 * C3 · Cuerpo rígido girando por un torque, con el factor de forma a la vista.
 *
 * La forma no es decorado: `c` en I = c·M·R² es lo único que distingue un aro
 * de un disco con la misma masa y el mismo radio, y es lo que hace que uno
 * arranque al doble de aceleración angular que el otro. Por eso la escena
 * dibuja la masa REPARTIDA como corresponde a cada forma —el aro con todo en
 * el borde, la esfera llena— en vez de pintar siempre un círculo y cambiar un
 * número por debajo.
 *
 * El modo «patinadora» sirve para lo otro que se pregunta: al soltar el torque
 * y encoger el radio, L se conserva y ω tiene que subir. Se implementa
 * imponiendo L constante, que es la hipótesis del problema, no integrando un
 * torque interno que no existe.
 */

/** Claves de `preset`: `masa`, `radio`, `fuerza`, `forma` (índice en FORMAS). */

type FormaId = 'aro' | 'disco' | 'esfera' | 'barra';

/**
 * `c` de I = c·M·R². Los cuatro valores de tabla que entran en el examen; la
 * barra es la que gira por un extremo, que es el caso del brazo o la pierna.
 */
const FORMAS: { id: FormaId; label: string; c: number; nota: string }[] = [
  { id: 'aro',    label: 'Aro',    c: 1,     nota: 'toda la masa en el borde' },
  { id: 'disco',  label: 'Disco',  c: 0.5,   nota: 'masa repartida por igual' },
  { id: 'esfera', label: 'Esfera', c: 0.4,   nota: 'maciza, en torno a un diámetro' },
  { id: 'barra',  label: 'Barra',  c: 1 / 3, nota: 'girando por un extremo' },
];

export default function SimRotacional({
  acento: acentoBase,
  preset,
}: {
  acento: string;
  preset?: Record<string, number>;
}) {
  const [acento, setAcento] = useAcento(acentoBase);
  const [forma, setForma] = useState<FormaId>('disco');
  const [masa, setMasa] = useState(3);     // kg
  const [radio, setRadio] = useState(0.4); // m
  const [fuerza, setFuerza] = useState(6); // N, tangencial en el borde
  const [patinadora, setPatinadora] = useState(false);

  const meta = FORMAS.find((f) => f.id === forma) ?? FORMAS[1];
  const inercia = meta.c * masa * radio * radio;
  const torque = patinadora ? 0 : fuerza * radio;
  const alpha = torque / inercia;

  const est = useRef({ inercia, alpha, radio, patinadora, c: meta.c, masa });
  est.current = { inercia, alpha, radio, patinadora, c: meta.c, masa };

  const vivo = useRef<Record<string, number>>({});
  /**
   * `L` se guarda además de `om` porque el modo patinadora lo necesita como
   * invariante: al cambiar el radio, ω se recalcula de L/I en vez de arrastrar
   * el ω anterior, que es exactamente lo que dice la conservación.
   */
  const giro = useRef({ ang: 0, om: 0, L: 0, tPrev: 0 });

  const reiniciarGiro = () => { giro.current = { ang: 0, om: 0, L: 0, tPrev: 0 }; };

  const dibujar = (c: CanvasCtx) => {
    const { ctx, w, h, t, paleta } = c;
    const s = est.current;

    let dt = t - giro.current.tPrev;
    giro.current.tPrev = t;
    if (dt > 0) {
      dt = Math.min(dt, 0.05);
      if (s.patinadora) {
        // Sin torque externo L no cambia; ω sale de dividirlo por la I de AHORA.
        if (giro.current.L === 0) giro.current.L = s.inercia * Math.max(giro.current.om, 4);
        giro.current.om = giro.current.L / s.inercia;
      } else {
        giro.current.om += s.alpha * dt;
        giro.current.L = s.inercia * giro.current.om;
      }
      giro.current.ang += giro.current.om * dt;
    }

    rejilla(c, 28);

    const compacto = w < 620;
    const escena = compacto ? { cx: w / 2, cy: 128, r: 92 } : { cx: w * 0.29, cy: h / 2, r: 108 };
    const rPx = escena.r * (s.radio / 0.6);

    /* ─── El cuerpo ───────────────────────────────────────────────────── */
    ctx.save();
    ctx.translate(escena.cx, escena.cy);
    ctx.rotate(giro.current.ang);

    if (forma === 'aro') {
      ctx.strokeStyle = paleta.acento;
      ctx.lineWidth = 13;
      ctx.beginPath();
      ctx.arc(0, 0, rPx, 0, Math.PI * 2);
      ctx.stroke();
    } else if (forma === 'disco') {
      ctx.fillStyle = alfa(paleta.acento, 0.55);
      ctx.beginPath();
      ctx.arc(0, 0, rPx, 0, Math.PI * 2);
      ctx.fill();
    } else if (forma === 'esfera') {
      // Degradado radial: es lo que distingue de un vistazo la esfera maciza
      // del disco plano, que si no se verían iguales de frente.
      const grad = ctx.createRadialGradient(-rPx * 0.3, -rPx * 0.3, rPx * 0.1, 0, 0, rPx);
      grad.addColorStop(0, alfa(paleta.acento, 0.85));
      grad.addColorStop(1, alfa(paleta.acento, 0.3));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, rPx, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = paleta.acento;
      ctx.beginPath();
      ctx.roundRect(0, -7, rPx, 14, 7);
      ctx.fill();
    }

    // Marca de referencia: sin ella un cuerpo de revolución girando parece
    // quieto, y toda la escena perdería el sentido.
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(rPx * 0.92, 0);
    ctx.stroke();
    ctx.restore();

    // Eje
    ctx.save();
    ctx.fillStyle = paleta.ink;
    ctx.beginPath();
    ctx.arc(escena.cx, escena.cy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Fuerza tangencial aplicada en el borde
    if (!s.patinadora) {
      vector(c, escena.cx + rPx, escena.cy, 0, -Math.min(fuerza * 5, 60), '#F5A623',
        `F = ${fuerza.toFixed(1)} N`);
      texto(c, `brazo R = ${s.radio.toFixed(2)} m`, escena.cx, escena.cy + rPx + 26, {
        align: 'center', size: 10.5, peso: 700,
      });
    } else {
      texto(c, 'sin torque · L constante', escena.cx, escena.cy + rPx + 26, {
        align: 'center', size: 10.5, peso: 800, color: paleta.acento,
      });
    }

    texto(c, `${meta.label} · c = ${s.c.toFixed(3)}`, escena.cx, 22, {
      align: 'center', size: 11.5, peso: 800, color: paleta.acento,
    });
    texto(c, meta.nota, escena.cx, 38, { align: 'center', size: 10 });

    /* ─── Lecturas del giro ───────────────────────────────────────────── */
    const panel = compacto
      ? { x: 22, y: 244, w: w - 44 }
      : { x: w * 0.58, y: 54, w: w * 0.38 };

    const filas = [
      { label: 'I', valor: `${s.inercia.toFixed(3)} kg·m²`, frac: Math.min(s.inercia / 2, 1) },
      { label: 'ω', valor: `${giro.current.om.toFixed(2)} rad/s`, frac: Math.min(giro.current.om / 30, 1) },
      { label: 'L', valor: `${giro.current.L.toFixed(2)} kg·m²/s`, frac: Math.min(giro.current.L / 8, 1) },
      {
        label: 'K',
        valor: `${(0.5 * s.inercia * giro.current.om ** 2).toFixed(1)} J`,
        frac: Math.min((0.5 * s.inercia * giro.current.om ** 2) / 200, 1),
      },
    ];

    filas.forEach((fila, i) => {
      const y = panel.y + i * 42;
      texto(c, fila.label, panel.x, y, { size: 13, peso: 800, color: paleta.acento });
      texto(c, fila.valor, panel.x + panel.w, y, {
        align: 'right', size: 12.5, peso: 700, color: paleta.ink,
      });
      ctx.save();
      ctx.fillStyle = alfa(paleta.ink, 0.07);
      ctx.beginPath();
      ctx.roundRect(panel.x, y + 12, panel.w, 8, 4);
      ctx.fill();
      ctx.fillStyle = paleta.acento;
      ctx.beginPath();
      ctx.roundRect(panel.x, y + 12, Math.max(panel.w * fila.frac, 8), 8, 4);
      ctx.fill();
      ctx.restore();
    });

    vivo.current = {
      t,
      om: giro.current.om,
      L: giro.current.L,
      Krot: 0.5 * s.inercia * giro.current.om ** 2,
    };
  };

  const { canvasRef, reloj } = useSimCanvas(dibujar, { alto: 380, onReiniciar: reiniciarGiro });

  useEffect(() => {
    if (!preset) return;
    if (preset.masa   !== undefined) setMasa(preset.masa);
    if (preset.radio  !== undefined) setRadio(preset.radio);
    if (preset.fuerza !== undefined) setFuerza(preset.fuerza);
    if (preset.forma  !== undefined) setForma(FORMAS[Math.round(preset.forma)]?.id ?? 'disco');
    reiniciarGiro();
    reloj.reanudar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  return (
    <LabShell
      titulo="Rotación: por qué la forma pesa más que la masa"
      acento={acento}
      onAcento={setAcento}
      sim="rotacional"
      reloj={reloj}
      magnitudes={{ M: masa, R: radio, c: meta.c, I: inercia, F: fuerza, tau: torque, alpha }}
      vivoRef={vivo}
      icono={
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
          <path d="M12 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      }
      mando={
        <>
          <LabSlider label="Masa  M" magnitud="M" valor={masa} display={`${masa.toFixed(1)} kg`}
            min={0.5} max={10} paso={0.5} onChange={setMasa} />
          <LabSlider label="Radio  R" magnitud="R" valor={radio} display={`${radio.toFixed(2)} m`}
            min={0.1} max={0.6} paso={0.01} onChange={setRadio} />
          <LabSlider label="Fuerza  F" magnitud="F" valor={fuerza} display={`${fuerza.toFixed(1)} N`}
            min={0} max={20} paso={0.5} onChange={setFuerza} />

          <LabFila label="Forma">
            <Segmented
              valor={forma}
              onChange={(v) => { setForma(v); reiniciarGiro(); }}
              opciones={FORMAS.map((f) => ({ id: f.id, label: f.label }))}
            />
            <Btn activo={patinadora} onClick={() => { setPatinadora((v) => !v); }}>
              Modo patinadora
            </Btn>
          </LabFila>
        </>
      }
      nota={
        <>
          Enciende <strong>Modo patinadora</strong>, deja que gire y baja el radio: el torque es
          cero, así que L no puede cambiar — y como I cae con R², ω se dispara. Es literalmente lo
          que hace la patinadora al pegarse los brazos al cuerpo.
        </>
      }
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </LabShell>
  );
}
