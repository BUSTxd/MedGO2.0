'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Btn, useAcento, useSimCanvas, rejilla, texto, alfa, vector, type CanvasCtx,
} from './SimShell';
import { LabShell, LabSlider, LabFila } from './LabShell';
import styles from '@/styles/fisicaSim.module.css';

/**
 * C1 · Bloque en plano inclinado, con su diagrama de cuerpo libre encima.
 *
 * El movimiento se integra con el modelo REAL de fricción, no con una fórmula
 * cerrada, porque el fenómeno que hay que ver es precisamente el cambio de
 * régimen: mientras W∥ no supere a la fricción estática el bloque no se mueve
 * —por mucho que el plano esté inclinado— y en cuanto lo supera pasa a fricción
 * cinética, que es menor, y arranca de golpe. Una a = g(sen θ − μ cos θ)
 * aplicada siempre daría al bloque una aceleración negativa absurda en reposo:
 * se deslizaría hacia arriba.
 *
 * μ_e = 1,2 · μ_c es la relación típica de las tablas; se declara aquí y no
 * como perilla porque el alumno ya maneja tres variables y el salto estático →
 * cinético se entiende igual sin poder tocarlo.
 */

/** Claves de `preset` que acepta esta sim: `masa`, `angulo`, `mu`. */

const RATIO_ESTATICO = 1.2;
const G = 9.81;

export default function SimPlano({
  acento: acentoBase,
  preset,
}: {
  acento: string;
  preset?: Record<string, number>;
}) {
  const [acento, setAcento] = useAcento(acentoBase);
  const [masa, setMasa] = useState(2);      // kg
  const [angulo, setAngulo] = useState(25); // grados
  const [mu, setMu] = useState(0.3);        // coeficiente cinético
  const [verDcl, setVerDcl] = useState(true);

  const th = (angulo * Math.PI) / 180;
  const peso = masa * G;
  const normal = peso * Math.cos(th);
  const paralela = peso * Math.sin(th);
  const friccionMax = mu * RATIO_ESTATICO * normal;
  const desliza = paralela > friccionMax;
  // En reposo la fricción no vale μN: vale justo lo que hace falta para empatar
  // a W∥. Confundir las dos cosas es el error clásico de este tema.
  const friccion = desliza ? mu * normal : paralela;
  const neta = desliza ? paralela - friccion : 0;
  const acel = neta / masa;
  const anguloCritico = (Math.atan(mu * RATIO_ESTATICO) * 180) / Math.PI;

  const est = useRef({ th, acel, desliza, mu, angulo });
  est.current = { th, acel, desliza, mu, angulo };

  const vivo = useRef<Record<string, number>>({});
  /** Estado cinemático del bloque a lo largo del plano, en metros. */
  const cuerpo = useRef({ d: 0, v: 0, tPrev: 0 });

  const reiniciarBloque = () => { cuerpo.current = { d: 0, v: 0, tPrev: 0 }; };

  const dibujar = (c: CanvasCtx) => {
    const { ctx, w, h, t, paleta } = c;
    const { th: ang, acel: a, desliza: mueve } = est.current;

    // dt del tiempo simulado: en pausa vale 0 y el bloque se congela donde va.
    let dt = t - cuerpo.current.tPrev;
    cuerpo.current.tPrev = t;
    if (dt > 0) {
      dt = Math.min(dt, 0.05);
      if (mueve) {
        cuerpo.current.v += a * dt;
        cuerpo.current.d += cuerpo.current.v * dt;
      } else {
        cuerpo.current.v = 0;
      }
    }

    rejilla(c, 28);

    const margen = 30;
    const baseY = h - 62;
    const largoPlano = Math.min(w - margen * 2 - 40, 470);
    const x0 = margen + 14;                       // vértice del ángulo
    const cimaX = x0 + largoPlano * Math.cos(ang);
    const cimaY = baseY - largoPlano * Math.sin(ang);

    /* ─── El plano ────────────────────────────────────────────────────── */
    ctx.save();
    ctx.fillStyle = alfa(paleta.ink, 0.07);
    ctx.beginPath();
    ctx.moveTo(x0, baseY);
    ctx.lineTo(cimaX, cimaY);
    ctx.lineTo(cimaX, baseY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = alfa(paleta.ink, 0.3);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Arco del ángulo, en el vértice
    ctx.save();
    ctx.strokeStyle = paleta.acento;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x0, baseY, 42, -ang, 0);
    ctx.stroke();
    ctx.restore();
    texto(c, `${est.current.angulo}°`, x0 + 54, baseY - 15, {
      size: 12, peso: 800, color: paleta.acento,
    });

    /* ─── El bloque ───────────────────────────────────────────────────── */
    // Recorrido útil: desde arriba del plano hasta el vértice.
    const pxPorM = 76;
    const recorridoMax = (largoPlano - 96) / pxPorM;
    if (cuerpo.current.d > recorridoMax) {
      cuerpo.current.d = recorridoMax;
      cuerpo.current.v = 0;
    }
    const s = largoPlano - 60 - cuerpo.current.d * pxPorM;
    const bx = x0 + s * Math.cos(ang);
    const by = baseY - s * Math.sin(ang);
    const lado = 40;

    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(-ang);
    ctx.fillStyle = paleta.acento;
    ctx.shadowColor = alfa(paleta.acento, 0.4);
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 3;
    ctx.beginPath();
    ctx.roundRect(-lado / 2, -lado, lado, lado, 8);
    ctx.fill();
    ctx.restore();

    // El centro geométrico del bloque, ya en coordenadas del lienzo: es de
    // donde salen todos los vectores del diagrama.
    const cxB = bx + (lado / 2) * Math.sin(ang);
    const cyB = by - (lado / 2) * Math.cos(ang);
    texto(c, `${masa.toFixed(1)} kg`, cxB, cyB, {
      align: 'center', size: 12, peso: 800, color: '#fff',
    });

    /* ─── Diagrama de cuerpo libre ────────────────────────────────────── */
    if (verDcl) {
      // Escala común a todas las fuerzas: comparar longitudes sólo significa
      // algo si las cuatro se miden con la misma regla.
      const escala = 58 / Math.max(peso, 1);

      // Peso: siempre vertical, gire como gire el plano.
      vector(c, cxB, cyB, 0, peso * escala, '#E85B4A', 'W');

      // Normal: perpendicular a la superficie.
      vector(c, cxB, cyB, Math.sin(ang) * normal * escala, -Math.cos(ang) * normal * escala,
        '#5E9CD3', 'N');

      // Fricción: a lo largo del plano, hacia arriba (se opone a la bajada).
      vector(c, cxB, cyB, Math.cos(ang) * friccion * escala, -Math.sin(ang) * friccion * escala,
        '#F5A623', 'f');

      // Descomposición del peso sobre el plano, punteada: es una ayuda de
      // cálculo, no una fuerza más, y dibujarla igual que las otras haría
      // pensar que sobre el bloque actúan cinco fuerzas.
      vector(c, cxB, cyB, -Math.cos(ang) * paralela * escala, Math.sin(ang) * paralela * escala,
        alfa(paleta.ink, 0.5), 'W∥', { discontinuo: true, grosor: 1.8 });
    }

    /* ─── Veredicto ───────────────────────────────────────────────────── */
    const etiqueta = mueve
      ? `desliza · a = ${a.toFixed(2)} m/s²`
      : `en reposo · f estática = ${friccion.toFixed(1)} N de los ${friccionMax.toFixed(1)} N disponibles`;
    ctx.save();
    ctx.fillStyle = alfa(mueve ? paleta.acento : paleta.ink, 0.1);
    ctx.beginPath();
    ctx.roundRect(margen, h - 34, w - margen * 2, 26, 8);
    ctx.fill();
    ctx.restore();
    texto(c, etiqueta, w / 2, h - 21, {
      align: 'center', size: 11.5, peso: 800,
      color: mueve ? paleta.acento : paleta.muted,
    });

    // Aviso del ángulo crítico, arriba a la derecha: es el número que se
    // pregunta, y verlo cruzarse mientras se gira el plano es toda la lección.
    texto(c, `empieza a deslizar a ${anguloCritico.toFixed(1)}°`, w - margen, 22, {
      align: 'right', size: 11, peso: 700,
      color: mueve ? paleta.acento : paleta.muted,
    });

    vivo.current = { t, v: cuerpo.current.v, d: cuerpo.current.d };
  };

  const { canvasRef, reloj } = useSimCanvas(dibujar, { alto: 360, onReiniciar: reiniciarBloque });

  useEffect(() => {
    if (!preset) return;
    if (preset.masa   !== undefined) setMasa(preset.masa);
    if (preset.angulo !== undefined) setAngulo(preset.angulo);
    if (preset.mu     !== undefined) setMu(preset.mu);
    reiniciarBloque();
    reloj.reanudar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  return (
    <LabShell
      titulo="Plano inclinado: el diagrama de cuerpo libre en movimiento"
      acento={acento}
      onAcento={setAcento}
      sim="plano"
      reloj={reloj}
      magnitudes={{
        m: masa, th: angulo, mu, g: G,
        W: peso, N: normal, Wpar: paralela,
        fr: friccion, frCin: mu * normal, frMax: friccionMax,
        Fneta: neta, a: acel, thc: anguloCritico,
      }}
      vivoRef={vivo}
      icono={
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M3 19h18L3 7v12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      }
      mando={
        <>
          <LabSlider label="Masa  m" magnitud="m" valor={masa} display={`${masa.toFixed(1)} kg`}
            min={0.5} max={20} paso={0.5} onChange={(v) => { setMasa(v); reiniciarBloque(); }} />
          <LabSlider label="Inclinación  θ" magnitud="th" valor={angulo} display={`${angulo}°`}
            min={0} max={60} paso={1} onChange={(v) => { setAngulo(v); reiniciarBloque(); }} />
          <LabSlider label="Rozamiento  μ" magnitud="mu" valor={mu} display={mu.toFixed(2)}
            min={0} max={0.9} paso={0.01} onChange={(v) => { setMu(v); reiniciarBloque(); }} />

          <LabFila>
            <Btn activo={verDcl} onClick={() => setVerDcl((v) => !v)}>
              Diagrama de cuerpo libre
            </Btn>
          </LabFila>
        </>
      }
      nota={
        <>
          Sube la masa al triple y mira la aceleración: <strong>no cambia</strong>. Peso y fricción
          crecen los dos con m, y al dividir entre m se cancela. Por eso el ángulo al que empieza a
          deslizar sólo depende de μ.
        </>
      }
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </LabShell>
  );
}
