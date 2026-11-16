# Nefrón interactivo: guion de contenido

Lab `nefron-interactivo` (Excretor), rehecho de cero el 2026-11-15 con el diseño de Polígono de Willis 3D y Médula Espinal 3D, pero en 2D con código. Este documento manda sobre los datos: un cambio de contenido va aquí y en `src/lib/data/nefron/` en el mismo commit.

## Qué hay y dónde

| Archivo | Qué guarda |
|---|---|
| `tipos.ts` | Tipos de todo el lab |
| `sustancias.ts` | 18 sustancias con símbolo y color fijo (burbujas de la animación) |
| `segmentos.ts` | 10 segmentos (glomérulo + 9 tramos del túbulo): qué reabsorben, histología, clínica, `esencial` |
| `celulas.ts` | 12 tipos de célula: forma, organelas, transportadores por membrana, vía paracelular, reacciones |
| `transportadores.ts` | 41 transportadores, canales, bombas, receptores y enzimas por tipo |
| `hormonas.ts` | ADH, aldosterona, angiotensina II, PTH y ANP, con su efecto por nivel (suprimida, basal, alta) |
| `farmacos.ts` | 8 fármacos con sus dianas, consecuencias, usos y adversos |
| `clinico.ts` | 12 tubulopatías y trastornos hormonales |

## Fuentes (solo para compararnos, nada se copia)

- OpenStax, *Anatomy and Physiology 2e*, cap. 25 (CC BY 4.0): anatomía del nefrón, porcentajes de reabsorción por segmento, mecanismo de contracorriente.
- Fisiología renal estándar de pregrado (Costanzo, Boron y Boulpaep, Guyton): contrastado de memoria, sin texto copiado.
- Los resúmenes del curso de Excretor (Cayetano) como control de lo que se pregunta.

## Verificado (consenso de las fuentes)

- Porcentajes de reabsorción de lo filtrado: proximal ≈ 65-70 % de Na⁺ y agua, ≈ 80 % del HCO₃⁻ y del fosfato, casi toda la glucosa y los aminoácidos; rama gruesa ≈ 25 % del Na⁺ y ≈ 60-70 % del Mg²⁺; distal ≈ 5 % del Na⁺; colector ≈ 2-3 %.
- Permeabilidad al agua: proximal y descendente siempre; ascendentes y distal nunca; conector y colector solo con ADH.
- Osmolalidades: 300 en el proximal; hasta ≈ 1200 en la punta del asa yuxtamedular con ADH alta; ≈ 100 al salir de la rama gruesa; ≈ 50-100 en el distal; orina final de ≈ 50 a ≈ 1200.
- Transportadores, su membrana, su estequiometría y su regulación (tabla de `transportadores.ts`).
- Consecuencias de cada fármaco y síndrome (dirección de K⁺, ácido-base, calcio urinario).

## Supuesto (modelo didáctico, marcado así en el lab)

- **El perfil del filtrado** (`engine/flujo.ts`) no es una simulación numérica. Es una cuenta simple de balance de soluto y agua por tramo, ajustada para que en estado basal dé ≈ 1,5 L/día a ≈ 600 mOsm/kg, con ADH alta ≈ 0,7 L a ≈ 1200 y con ADH suprimida ≈ 18 L a ≈ 80. Los fármacos y síndromes mueven ese perfil en la dirección correcta, con magnitudes orientativas.
- **Los factores** de `dianas` y `efectos` (0,1 = bloqueo casi completo, 1,8 = estímulo fuerte) son para la animación, no medidas.
- La glucosa que sale con gliflozinas (≈ 45-50 % de lo filtrado) y la natriuresis de la furosemida (≈ 20 % del Na⁺) salen del modelo y caen en los rangos publicados; las demás cifras son de forma, no de valor.
- El nefrón dibujado es un nefrón yuxtamedular de asa larga; el cortical de asa corta va de fondo, sin interacción.

## Decisiones de contenido

- Se separan proximal contorneado (S1-S2) y recto (S3): S3 es el de SGLT1 y la secreción de fármacos, y el que más sufre en la necrosis tubular aguda.
- La mácula densa es una célula de la rama gruesa, no un segmento.
- La acetazolamida baja NHE3 y NBCe1 además de la anhidrasa: sin anhidrasa no hay H⁺ que intercambiar ni HCO₃⁻ que sacar.
- Liddle y Conn se modelan distinto a propósito: Conn sube la aldosterona; Liddle enciende ENaC y baja la aldosterona.
- El ATR 4 baja la aldosterona y el `rhcg` (la hiperpotasemia frena la amoniogénesis).
