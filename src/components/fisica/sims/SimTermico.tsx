'use client';

import { useEffect, useState } from 'react';
import { useAcento, useSimCanvas, texto, alfa, type CanvasCtx } from './SimShell';
import { LabShell, LabSlider } from './LabShell';
import styles from '@/styles/fisicaSim.module.css';

/**
 * Balance térmico del cuerpo — la sim de las cuatro secciones de C7.
 *
 * MODELO: resistencias en serie, no conducción a secas. Aplicar H = k·A·ΔT/L
 * con el ΔT núcleo↔ambiente da 400 W en reposo a 22 °C, un disparate: falta la
 * resistencia de la capa de aire pegada a la piel, que en una persona vestida
 * pesa tanto como el propio aislamiento. Con las dos en serie salen ~64 W, que
 * es el valor real. El precio es una constante empírica (`H_EXT`), y a cambio
 * cada número que muestra la sim resiste que lo contrasten con una tabla.
 *
 *   R_capa = L / (k·A)      aislamiento (grasa + ropa)
 *   R_ext  = 1 / (h_ext·A)  capa límite de aire
 *   H_seca = ΔT / (R_capa + R_ext)
 *
 * La pérdida seca se reparte en radiación y convección por sus coeficientes
 * (≈59 % / 41 %), que es de dónde sale el «la radiación es la mayor vía de
 * pérdida en reposo» que enseña la sección 4.
 *
 * La evaporación va aparte porque no la gobierna el ΔT: aunque la piel y el
 * aire estén a la misma temperatura, evaporar sudor sigue sacando calor. Ese
 * es el motivo de que sea la única vía que funciona con calor ambiental.
 */

/** Claves de `preset` que acepta esta sim: `ambiente`, `aislamiento`, `sudor`, `metabolismo`. */

const K_TEJIDO = 0.2;    // W/(m·°C) — grasa subcutánea
const AREA     = 1.8;    // m² — superficie corporal de un adulto
const H_EXT    = 8;      // W/(m²·°C) — capa límite (radiación + convección)
const F_RAD    = 0.59;   // reparto de la pérdida seca que se va en radiación
const L_VAP    = 2430;   // kJ/kg — calor latente del sudor a temperatura de piel
const EVAP_BASAL = 10;   // W — perspiración insensible, siempre presente
const T_NUCLEO = 37;     // °C
const MASA     = 70;     // kg
const C_CUERPO = 3470;   // J/(kg·°C)

export default function SimTermico({
  acento: acentoBase,
  preset,
}: {
  acento: string;
  preset?: Record<string, number>;
}) {
  const [acento, setAcento] = useAcento(acentoBase);
  const [ambiente, setAmbiente] = useState(22);
  const [aislamiento, setAislamiento] = useState(60);
  const [sudor, setSudor] = useState(0);
  const [metabolismo, setMetabolismo] = useState(100);

  useEffect(() => {
    if (!preset) return;
    if (preset.ambiente !== undefined) setAmbiente(preset.ambiente);
    if (preset.aislamiento !== undefined) setAislamiento(preset.aislamiento);
    if (preset.sudor !== undefined) setSudor(preset.sudor);
    if (preset.metabolismo !== undefined) setMetabolismo(preset.metabolismo);
  }, [preset]);

  const dT = T_NUCLEO - ambiente;
  const Rcapa = aislamiento / 1000 / (K_TEJIDO * AREA);
  const Rext = 1 / (H_EXT * AREA);
  const Hseca = dT / (Rcapa + Rext);
  const Hrad = Hseca * F_RAD;
  const hConv = Hseca * (1 - F_RAD);
  const Hevap = EVAP_BASAL + (sudor / 3600) * L_VAP * 1000;
  const balance = metabolismo - Hseca - Hevap;
  // °C por hora: dT/dt = P / (m·c), pasado de segundos a horas.
  const deriva = (balance * 3600) / (MASA * C_CUERPO);

  const dibujar = (c: CanvasCtx) => {
    const { ctx, w, h, t, paleta } = c;
    const m = 26;

    // Ambiente: del azul al rojo según la temperatura del aire.
    const frioCalor = Math.min(Math.max((ambiente - 5) / 33, 0), 1);
    const colAmb = mezcla('#5E9CD3', '#E85B4A', frioCalor);
    ctx.save();
    ctx.fillStyle = alfa(colAmb, 0.16);
    ctx.beginPath();
    ctx.roundRect(m, 34, w - m * 2, h - 74, 12);
    ctx.fill();
    ctx.restore();
    texto(c, `AMBIENTE  ${ambiente.toFixed(0)} °C`, m + 12, 22, { size: 10.5, peso: 800 });

    const cx = w * 0.3;
    const cy = h / 2 + 4;

    // Capa de aislamiento, dibujada a escala alrededor del núcleo.
    const rNucleo = 34;
    const grosor = 6 + (aislamiento / 80) * 26;
    ctx.save();
    ctx.fillStyle = alfa(paleta.ink, 0.13);
    ctx.beginPath();
    ctx.arc(cx, cy, rNucleo + grosor, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Núcleo: se tiñe según hacia dónde deriva la temperatura corporal.
    const colNucleo = balance > 12 ? '#E85B4A' : balance < -12 ? '#5E9CD3' : '#2DC99A';
    ctx.save();
    ctx.fillStyle = alfa(colNucleo, 0.85);
    ctx.beginPath();
    ctx.arc(cx, cy, rNucleo, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    texto(c, '37 °C', cx, cy - 6, { align: 'center', size: 13, peso: 800, color: '#fff' });
    texto(c, `${metabolismo.toFixed(0)} W`, cx, cy + 11, {
      align: 'center', size: 10, peso: 700, color: 'rgba(255,255,255,0.85)',
    });
    texto(c, `aislamiento ${aislamiento.toFixed(0)} mm`, cx, cy + rNucleo + grosor + 16, {
      align: 'center', size: 9.5, peso: 700,
    });

    /* Vías de salida: una fila por vía, con el ancho de la flecha proporcional
       a su potencia. Es lo que hace ver de un vistazo cuál domina — que cambia
       por completo entre reposo y ejercicio. */
    const vias = [
      { label: 'Radiación',   val: Hrad,  col: '#F5A623' },
      { label: 'Convección',  val: hConv, col: '#F5D423' },
      { label: 'Evaporación', val: Hevap, col: '#5E9CD3' },
    ];
    const xIni = cx + rNucleo + grosor + 10;
    const xFin = w - m - 92;
    vias.forEach((via, i) => {
      const y = cy - 34 + i * 34;
      const frac = Math.min(via.val / 400, 1);
      const grosorF = 2 + frac * 9;
      const desfase = ((t * 46) % 22) - 11;
      ctx.save();
      ctx.globalAlpha = 0.35 + frac * 0.6;
      flechaAncha(c, xIni + desfase, y, xFin - xIni, via.col, grosorF);
      ctx.restore();
      texto(c, via.label, xFin + 8, y - 6, { size: 9.5, peso: 700 });
      texto(c, `${via.val.toFixed(0)} W`, xFin + 8, y + 8, {
        size: 12, peso: 800, color: via.col,
      });
    });

    // Veredicto: lo único que de verdad importa del balance.
    const veredicto =
      Math.abs(balance) < 12 ? 'en equilibrio térmico'
      : balance > 0 ? `acumula calor · ${deriva > 0 ? '+' : ''}${deriva.toFixed(2)} °C/h`
      : `pierde calor · ${deriva.toFixed(2)} °C/h`;
    texto(c, veredicto, w / 2, h - 18, {
      align: 'center', size: 11.5, peso: 800, color: colNucleo,
    });
  };

  // Sin reloj a propósito: esto no es una escena que evolucione en el tiempo
  // sino un ESTADO ESTABLE — el balance que corresponde a las condiciones que
  // el alumno fija. Un play/pausa aquí no pausaría nada, y una velocidad ×2
  // sugeriría que el dibujo avanza, que es justo lo que no hace.
  const { canvasRef } = useSimCanvas(dibujar, { alto: 320 });

  return (
    <LabShell
      titulo="Balance térmico del cuerpo"
      acento={acento}
      onAcento={setAcento}
      sim="termico"
      magnitudes={{
        Tamb: ambiente,
        dT,
        L: aislamiento,
        Rcapa,
        Rext,
        Hseca,
        Hrad,
        Hevap,
        sudor,
        M: metabolismo,
        bal: balance,
        deriva,
      }}
      icono={
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M10 13.5V5a2 2 0 1 1 4 0v8.5a4.5 4.5 0 1 1-4 0Z" stroke="currentColor"
            strokeWidth="2" strokeLinejoin="round" />
        </svg>
      }
      mando={
        <>
          <LabSlider label="Ambiente" magnitud="Tamb" valor={ambiente} display={`${ambiente.toFixed(0)} °C`}
            min={0} max={40} paso={1} onChange={setAmbiente} />
          <LabSlider label="Aislamiento" magnitud="L" valor={aislamiento} display={`${aislamiento.toFixed(0)} mm`}
            min={5} max={80} paso={1} onChange={setAislamiento} />
          <LabSlider label="Sudoración" magnitud="sudor" valor={sudor} display={`${sudor.toFixed(2)} L/h`}
            min={0} max={1.5} paso={0.05} onChange={setSudor} />
          <LabSlider label="Metabolismo" magnitud="M" valor={metabolismo} display={`${metabolismo.toFixed(0)} W`}
            min={80} max={700} paso={10} onChange={setMetabolismo} />
        </>
      }
      nota={
        <>
          Ponte a <strong>35 °C de ambiente</strong>: la pérdida seca casi desaparece, porque
          depende del ΔT y ya no hay ΔT. A partir de ahí la evaporación es la única vía que
          queda — y por eso una ola de calor con humedad alta, que impide evaporar, mata.
        </>
      }
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </LabShell>
  );
}

/* ─── Utilidades de dibujo propias de esta escena ─────────────────────────── */

/**
 * Interpola dos hex en RGB. Aquí es para teñir el ambiente del azul al rojo
 * según la temperatura del aire: el color es la primera lectura de la escena,
 * antes de que nadie mire una cifra.
 */
function mezcla(a: string, b: string, t: number): string {
  const leer = (hex: string) => {
    const h = hex.replace('#', '');
    const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    return [
      parseInt(n.slice(0, 2), 16),
      parseInt(n.slice(2, 4), 16),
      parseInt(n.slice(4, 6), 16),
    ];
  };
  const [r1, g1, b1] = leer(a);
  const [r2, g2, b2] = leer(b);
  const f = Math.min(Math.max(t, 0), 1);
  const c = (x: number, y: number) => Math.round(x + (y - x) * f).toString(16).padStart(2, '0');
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`;
}

/**
 * Flecha horizontal cuyo GROSOR es el dato: cada vía de pérdida se dibuja tan
 * gruesa como potencia se lleva, de modo que cuál domina se ve sin leer los
 * vatios. La punta se reserva del largo total para que la flecha termine donde
 * se le pide y no se pase de la etiqueta.
 */
function flechaAncha(
  c: CanvasCtx,
  x: number,
  y: number,
  largo: number,
  color: string,
  grosor: number,
) {
  const { ctx } = c;
  const punta = Math.max(grosor * 1.9, 9);
  const cuerpo = Math.max(largo - punta, 2);

  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y - grosor / 2, cuerpo, grosor, grosor / 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x + largo, y);
  ctx.lineTo(x + cuerpo, y - punta * 0.62);
  ctx.lineTo(x + cuerpo, y + punta * 0.62);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
