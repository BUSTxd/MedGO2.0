# Evaluación heurística de Nielsen — MedGO · Lab Médula Espinal 3D

**Fecha:** 2026-11-12 · **Evaluador:** Claude (un solo evaluador) · **Dispositivos:** escritorio (≥ 860 px) y teléfono (< 860 px, una columna)
**Fuentes de evidencia:** código del repositorio (`src/app/dashboard/laboratorio/medula-espinal/*`, `src/styles/medulaEspinal.module.css`) y las vistas sin navegador de `npm run vista:medula`. No se abrió el lab en el navegador (regla de BUST): lo que solo se ve en vivo va marcado ❔.

## 1. Alcance

- **Qué se evaluó:** la interfaz del lab: lienzo 3D, panel de controles y sus cinco vistas (Médula, Corte, Tractos, Meninges, Clínico).
- **Usuario:** estudiante de Neurología (2.º-3.º año de Facultad), en escritorio y en teléfono.
- **Tareas:**
  1. Ver la médula completa y pasar al corte de la región lumbar.
  2. Ubicar la lámina IX en el corte cervical y leer su función.
  3. Encontrar el espinotalámico lateral y ver su somatotopía en C5 y en L3.
  4. Ver qué estructuras daña un Brown-Séquard y de qué lado.
  5. Ocultar la duramadre en Meninges.
- **Fuera del alcance:** la forma anatómica del corte (ya comparada con Gray 666 y Polarlys), el catálogo de laboratorios y el candado de acceso.

## 2. Resumen

El lab se entiende y sus listas son completas, pero obliga a **recordar colores**: cinco tractos rojos casi iguales en el lienzo sin ningún rótulo, y la ficha de lo elegido aparece al final de una lista de 13 elementos, lejos del modelo (en el teléfono, fuera de la pantalla). No hay «Restablecer vista», ni indicador de carga del 3D, ni salida si el equipo no tiene WebGL. El rojo significa a la vez «descendente», «lateral» y «zona lesionada». Bien resuelto: niveles y vistas recordados, tractos ausentes atenuados, modo oscuro completo y avisos de cada vista.

| # | Heurística | Veredicto | Ítems ✅ / total aplicables | Hallazgos |
| --- | --- | --- | --- | --- |
| H1 | Visibilidad del estado del sistema | ❌ | 1/5 | H-01, H-02, H-03 |
| H2 | Correspondencia con el mundo real | ⚠️ | 4/6 | H-04, H-05 |
| H3 | Control y libertad del usuario | ⚠️ | 1/3 | H-06, H-07 |
| H4 | Consistencia y estándares | ⚠️ | 3/6 | H-08, H-09 |
| H5 | Prevención de errores | ⚠️ | 2/3 | H-10 |
| H6 | Reconocer antes que recordar | ❌ | 1/4 | H-11, H-12, H-13 |
| H7 | Flexibilidad y eficiencia de uso | ⚠️ | 2/4 | H-14 |
| H8 | Diseño estético y minimalista | ⚠️ | 3/6 | H-15, H-16, H-17 |
| H9 | Reconocer y recuperarse de errores | ⚠️ | 1/3 | H-18, H-19 |
| H10 | Ayuda y documentación | ⚠️ | 3/4 | H-20 |

Severidades: 0 catástrofes (4) · 4 mayores (3) · 11 menores (2) · 5 cosméticos (1).

**¿Distingue el usuario lo que viene de su material verificado de lo que genera el asistente?** No aplica: el lab no tiene asistente de IA. Sí avisa de que es un modelo didáctico.

## 3. Revisión regla por regla

### H1 — Visibilidad del estado del sistema

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H1.1 Reacción visible en < 1 s | ⚠️ | Los botones cambian al instante (`segActive`, `structureActive`), pero el corte no reacciona al pasar el puntero: solo `FullCord.tsx:117` pone `cursor: pointer`; láminas y tractos (`CrossSection.tsx:100-140`) no tienen `onPointerOver` |
| H1.2 Saber qué está seleccionado | ❌ | La ficha de lo elegido va **después** de toda la lista (`ControlsPanel.tsx:229`, tras 13 tractos en 6 grupos). En el lienzo no hay rótulo: la clase `.structureTag` existe en el CSS (`medulaEspinal.module.css:75`) pero ningún componente la usa |
| H1.3 Carga del modelo 3D con indicador | ❌ | `dynamic(() => import('./SpinalCordScene'), { ssr: false })` sin `loading` (`SpinalCordSimulator.tsx:11`): el lienzo queda vacío mientras baja three.js |
| H1.4 Estado de guardado | ➖ | No hay nada que guardar (solo preferencias) |
| H1.6 Cambios anunciados a lectores de pantalla | ❌ | Ningún `aria-live`/`role="status"`; los interruptores no dicen si están activos (sin `role="switch"` ni `aria-checked`, `ControlsPanel.tsx:111-126, 263-267`) |

**Bien resuelto:** vista y nivel activos bien marcados en azul; los tractos ausentes en el nivel se atenúan y muestran «—».
**Veredicto:** el alumno elige algo y no ve qué eligió sin bajar hasta el final del panel.

### H2 — Correspondencia entre el sistema y el mundo real

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H2.2 Sin jerga técnica visible | ⚠️ | `aria-label="Toggle saco dural"`, `"Toggle raíces"`, `` `Toggle ${m.name}` `` en inglés (los lee el lector de pantalla) |
| H2.3 Íconos con texto | ✅ | «↑/↓» siempre junto al nombre; la leyenda explica rojo/azul |
| H2.4 Terminología correcta y coherente | ✅ | Nombres de tractos y láminas en español de la cátedra |
| H2.5 Orden lógico | ✅ | Niveles de craneal a caudal; láminas de I-II a X; tractos por sistema |
| H2.6 Formato local | ➖ | Sin fechas ni cifras |
| H2.7 Orientación anatómica | ⚠️ | Rótulos «Dorsal», «Ventral» y dos «Lateral». En Clínico, Brown-Séquard sombrea la mitad derecha de la pantalla (`CrossSection.tsx:149`) sin decir que es el **lado de la lesión**: el síndrome se explica con ipsilateral/contralateral y no hay forma de saber cuál lado es cuál |

**Bien resuelto:** el vocabulario es el de la clase.

### H3 — Control y libertad del usuario

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H3.3 Atrás del navegador | ⚠️ | Vista y nivel solo viven en `localStorage` (`SpinalCordSimulator.tsx:13-29`); Atrás saca del lab. Se mitiga porque al volver se recuperan |
| H3.6 «Restablecer vista» | ❌ | No existe. `CameraRig` solo reencuadra al cambiar entre Médula y corte (`SpinalCordScene.tsx:73-90`): tras girar el corte no hay forma de enderezarlo |
| Deseleccionar | ⚠️ | Se deselecciona volviendo a pulsar, pero un clic en el vacío del lienzo no hace nada (sin `onPointerMissed`) |

### H4 — Consistencia y estándares

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H4.2 Un significado por color | ❌ | Rojo = tracto descendente (leyenda de Tractos), = rótulo «Lateral» (`SpinalCordScene.tsx:66-67`) y = zona lesionada en Clínico (`#E85B4A`, `CrossSection.tsx:152`); azul = ascendente y = rótulo «Dorsal/Ventral» |
| H4.3 Mismo control para la misma función | ⚠️ | «Mostrar todas las láminas» es un botón segmentado que hace de interruptor (`ControlsPanel.tsx:153-159`), mientras saco dural, raíces y meninges usan interruptores |
| H4.4 Labs con la misma estructura | ✅ | Usa la barra superior y el bloque de introducción de los demás labs |
| H4.5 Convenciones del visor 3D | ✅ | `OrbitControls`: arrastrar rota, rueda acerca |
| H4.6 Tokens y componentes compartidos | ⚠️ | Colores literales repetidos en CSS y JSX (`#3b9edd`, `#1a1a2e`, `rgba(...)`); deuda general del proyecto |
| H4.1 Un nombre por concepto | ✅ | «Corte», «Tractos», «Láminas» constantes |

### H5 — Prevención de errores

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H5.2 Lo reversible no pide confirmación | ✅ | Todo se deshace con otro clic |
| H5.3 Controles separados | ✅ | No hay acciones destructivas |
| Opciones no válidas bloqueadas | ⚠️ | Un tracto ausente se bloquea solo con `pointerEvents: 'none'` (`ControlsPanel.tsx:213`): con teclado (Tab + Enter) se puede elegir y la ficha describe un tracto que el modelo no muestra |

### H6 — Reconocer antes que recordar

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H6.3 Leyenda y nombres a la vista | ❌ | En el lienzo no hay ningún nombre. Cinco tractos descendentes con rojos casi iguales (`#E0322E`, `#C0392B`, `#D9534F`, `#E8746A`, `#F1948A`, `anatomy.ts`) y siete láminas que solo se distinguen por color: hay que memorizar la lista y compararla con el dibujo |
| Somatotopía visible | ❌ | La ficha dice «Capas en Cervical: S · L · T · C», pero el modelo no rotula qué capa es cuál; solo cambia el tono |
| Clínico: qué daña cada síndrome | ⚠️ | La ficha da causa y mecanismo, pero no nombra los tractos y láminas resaltados (`ControlsPanel.tsx:301-311`): el alumno tiene que adivinar qué es cada mancha |
| H6.1 Recordar dónde se quedó | ✅ | Vista y nivel guardados en `localStorage` |

### H7 — Flexibilidad y eficiencia de uso

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H7.1 Atajos para lo frecuente | ⚠️ | Ninguno (cambiar de nivel o de vista siempre con el ratón); es menor en un lab |
| Lista ↔ modelo | ⚠️ | Pasar el puntero por la lista no señala la estructura en el modelo, ni al revés |
| H7.6 Alternativa al gesto | ✅ | Todo lo que se toca en 3D tiene botón en el panel |
| H7.3 Tema | ✅ | Respeta el modo oscuro de la plataforma |

### H8 — Diseño estético y minimalista

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H8.1 Acción principal evidente | ⚠️ | Panel muy largo en Tractos: vista + nivel + descripción del nivel + aviso + 6 títulos + 13 botones + ficha. La descripción del nivel se repite dos veces en Médula (`ControlsPanel.tsx:95` y `:131`) |
| H8.2 Texto de lectura cómodo | ⚠️ | Fichas médicas a 13 px (`.infoDesc`), nombres a 12,5 px, títulos de grupo a 10,5 px |
| H8.3 Contraste | ❌ | Texto con poca opacidad: `.listTitle` 45 % (≈ 2,7:1), `.levelSeg` y `.structureDir` 50 % (≈ 3,2:1), `.disclaimer` 45 %, `.zoomHint` 50 % sobre fondo translúcido |
| H8.4 Resaltados con significado fijo | ✅ | Un solo azul de selección |
| H8.7 Movimiento reducido | ⚠️ | `fadeUp` sin `prefers-reduced-motion` (corto, 0,25 s) |
| Síndromes legibles | ⚠️ | Rejilla de 2 columnas en 330 px con nombres largos («Indemnidad sacra (sacral sparing)») |

### H9 — Reconocer, diagnosticar y recuperarse de errores

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H9.4 Sin pantalla en blanco | ⚠️ | Si el equipo no tiene WebGL, el `Canvas` falla sin mensaje: no hay comprobación de `getContext('webgl')` |
| Hidratación | ⚠️ | `loadPrefs()` lee `localStorage` en el primer render (`SpinalCordSimulator.tsx:32`): el servidor pinta «Médula» y el navegador puede pintar otra vista, lo que provoca un aviso de hidratación y un salto ❔ |
| H9.1 Mensajes sin jerga | ➖ | No hay mensajes de error |

### H10 — Ayuda y documentación

| Ítem | Veredicto | Evidencia |
| --- | --- | --- |
| H10.1 Se entiende sin ayuda | ✅ | Cada vista explica en una línea qué hacer (Tractos, Meninges, Clínico) |
| H10.3 Ayuda en contexto | ⚠️ | Corte no dice que se puede tocar el modelo; el aviso de controles dice «Scroll · zoom | Drag · rotar», que no sirve en el teléfono (pellizcar) |
| H10.6 Instrucciones del visor | ✅ | Aviso de controles en el lienzo y descargo «modelo didáctico» |
| H10.4 Contacto | ➖ | Lo da la plataforma |

## 4. Hallazgos

| ID | Heurística(s) | Problema | Ubicación | Severidad | Esfuerzo | Prioridad |
| --- | --- | --- | --- | --- | --- | --- |
| H-01 | H1, H6 | La ficha de lo elegido queda al final de la lista, lejos del modelo; en el teléfono, fuera de la pantalla | `ControlsPanel.tsx:174, 229, 301` | 3 · frecuente (cada selección), persistente | Bajo | Arreglar ya |
| H-02 | H1 | Lienzo vacío mientras carga el 3D | `SpinalCordSimulator.tsx:11` | 2 · en cada visita, breve | Bajo | Arreglar ya |
| H-03 | H1 | Interruptores sin estado accesible; sin anuncios de selección | `ControlsPanel.tsx:111, 263` | 2 · impide usarlo con lector | Bajo | Arreglar ya |
| H-04 | H2 | `aria-label` en inglés («Toggle…») | `ControlsPanel.tsx:114, 125, 266` | 1 | Bajo | Siguiente |
| H-05 | H2, H6 | Brown-Séquard sombrea un lado sin decir que es el lado de la lesión | `CrossSection.tsx:149` | 3 · el alumno puede aprender ipsi/contra al revés | Bajo | Arreglar ya |
| H-06 | H3 | No hay «Restablecer vista» | `SpinalCordScene.tsx:73` | 2 · frecuente tras rotar | Bajo | Arreglar ya |
| H-07 | H3 | Clic en el vacío no deselecciona | `SpinalCordScene.tsx:145` | 1 | Bajo | Siguiente |
| H-08 | H4 | El rojo tiene tres significados (descendente, lateral, lesión) | `SpinalCordScene.tsx:66`, `CrossSection.tsx:152` | 2 · confunde la leyenda | Bajo | Arreglar ya |
| H-09 | H4 | «Mostrar todas las láminas» no es un interruptor como los demás | `ControlsPanel.tsx:153` | 1 | Bajo | Siguiente |
| H-10 | H5 | Tracto ausente elegible con teclado | `ControlsPanel.tsx:213` | 2 | Bajo | Arreglar ya |
| H-11 | H6 | Ningún nombre en el lienzo; tractos rojos indistinguibles | `CrossSection.tsx` | 3 · tarea 3 imposible sin probar uno por uno | Medio | Arreglar ya |
| H-12 | H6 | Las capas somatotópicas no se rotulan en el modelo | `CrossSection.tsx` | 2 | Medio | Siguiente |
| H-13 | H6 | Clínico no nombra lo afectado | `ControlsPanel.tsx:301` | 3 · es el objetivo de la vista | Bajo | Arreglar ya |
| H-14 | H7 | La lista no señala en el modelo (y al revés) | `ControlsPanel.tsx`, `CrossSection.tsx` | 2 | Medio | Siguiente |
| H-15 | H8 | Panel largo y descripción del nivel repetida | `ControlsPanel.tsx:95, 131` | 2 | Bajo | Arreglar ya |
| H-16 | H8 | Letra pequeña en fichas y listas | `medulaEspinal.module.css` | 2 | Bajo | Arreglar ya |
| H-17 | H8 | Contraste insuficiente en títulos, segmentos y avisos | `medulaEspinal.module.css:37, 120, 226, 240, 297` | 2 | Bajo | Arreglar ya |
| H-18 | H9 | Sin mensaje si no hay WebGL | `SpinalCordScene.tsx:145` | 2 · raro pero deja la pantalla en blanco | Bajo | Arreglar ya |
| H-19 | H9 | Lectura de `localStorage` en el primer render (hidratación) | `SpinalCordSimulator.tsx:32` | 1 ❔ | Bajo | Siguiente |
| H-20 | H10 | Aviso de controles solo para ratón; Corte no dice que el modelo se toca | `SpinalCordSimulator.tsx:117`, `ControlsPanel.tsx:151` | 1 | Bajo | Siguiente |

**Violaciones justificadas:** que Atrás saque del lab (H3.3) es aceptable porque vista y nivel se recuperan al volver.

**Observaciones de contenido:** el selector dice T5, L4 y S3, y la forma del corte está calcada de Gray 666 en Th8, L3 y S2. Son niveles vecinos y la forma no cambia de verdad, pero conviene alinear el rótulo con la lámina o decir «nivel representativo».

## 5. Mejoras propuestas

### Arreglar ya

#### M-1 · Rótulo de lo seleccionado y de lo señalado sobre el lienzo — resuelve H-01, H-11, H-05
- **Qué:** etiqueta en la esquina del lienzo con el nombre, el color y la dirección de lo que está bajo el puntero o elegido (o el síndrome y «lado de la lesión»). Las láminas y los tractos del corte reaccionan al pasar el puntero (cursor de mano y rótulo).
- **Dónde:** `SpinalCordSimulator.tsx` (estado `hover`), `SpinalCordScene.tsx`, `CrossSection.tsx` (`onPointerOver/Out`), clase `.structureTag` ya existente.
- **Cómo comprobarlo:** en Tractos, pasar el puntero por cada rojo y leer su nombre sin tocar el panel.

#### M-2 · Ficha arriba, junto a lo que se elige, con estado vacío que enseña — resuelve H-01, H-15, H-20
- **Qué:** la ficha va antes de la lista; sin selección dice «Toca una lámina en el modelo o en la lista». La descripción del nivel aparece una sola vez.
- **Dónde:** `ControlsPanel.tsx`.

#### M-3 · Clínico nombra lo afectado y el lado — resuelve H-13, H-05, H-08
- **Qué:** la ficha lista los tractos y láminas afectados con su color; el sombreado de la hemisección es violeta (no rojo) y lleva el rótulo «Lado de la lesión».
- **Dónde:** `ControlsPanel.tsx`, `CrossSection.tsx`.

#### M-4 · Restablecer vista y deseleccionar en el vacío — resuelve H-06, H-07
- **Qué:** botón «Restablecer vista» en el lienzo (reencuadra la cámara) y `onPointerMissed` que limpia la selección.
- **Dónde:** `SpinalCordScene.tsx` (`CameraRig` con `reinicio`), `SpinalCordSimulator.tsx`.

#### M-5 · Colores con un solo significado — resuelve H-08
- **Qué:** rótulos de orientación neutros (oscuros), rojo y azul reservados a descendente y ascendente, violeta para lo clínico; leyenda con muestras de color.
- **Dónde:** `SpinalCordScene.tsx`, `ControlsPanel.tsx`.

#### M-6 · Carga y falta de WebGL — resuelve H-02, H-18
- **Qué:** `loading` del `dynamic` con «Cargando modelo 3D…» y aviso claro si el navegador no tiene WebGL.
- **Dónde:** `SpinalCordSimulator.tsx`.

#### M-7 · Accesibilidad y bloqueo real — resuelve H-03, H-04, H-10, H-09
- **Qué:** interruptores con `role="switch"`, `aria-checked` y nombre en español; `aria-pressed` en vistas, niveles y estructuras; `disabled` en tractos ausentes; región `aria-live` que anuncia la selección; «Colorear todas las láminas» como interruptor.
- **Dónde:** `ControlsPanel.tsx`, `SpinalCordSimulator.tsx`.

#### M-8 · Tipografía y contraste — resuelve H-16, H-17
- **Qué:** fichas a 14,5 px con interlineado 1,6, nombres a 13,5 px, textos secundarios con opacidad ≥ 70 %, síndromes en una columna, `prefers-reduced-motion`.
- **Dónde:** `medulaEspinal.module.css`.

### Siguiente

- **M-9 · Rótulos de capas somatotópicas** en el modelo (S, L, T, C) al elegir un tracto con capas — H-12.
- **M-10 · Señalar desde la lista:** pasar el puntero por un elemento de la lista lo resalta en el modelo — H-14.
- **M-11 · Preferencias leídas tras montar** (`useEffect`) para evitar el aviso de hidratación — H-19.
- **M-12 · Aviso de controles según el dispositivo** («Arrastra para girar · pellizca o usa la rueda para acercar») — H-20.

### Si sobra tiempo

- Atajos: `1-4` para el nivel y `←/→` para la vista.
- Vista y nivel en la URL (`?vista=tractos&nivel=lumbar`) para compartir y para que Atrás funcione dentro del lab.

## 6. Límites de esta evaluación

- Un solo evaluador encuentra en promedio ~35 % de los problemas (Nielsen); con 3 evaluadores ~71 %, con 5 ~87 %.
- No se usó el navegador: los tiempos de carga, el contraste real sobre el lienzo y el comportamiento táctil quedan ❔ hasta verlo en vivo.
- **Siguiente paso recomendado:** que 2-4 alumnos de Neurología hagan las cinco tareas y validar con ellos los hallazgos de severidad 3.

## 7. Aplicado (2026-11-12)

Aplicadas M-1 a M-12 en `SpinalCordSimulator.tsx`, `SpinalCordScene.tsx`, `CrossSection.tsx`, `FullCord.tsx`, `ControlsPanel.tsx` y `medulaEspinal.module.css`:

- Rótulo de lo señalado o elegido en la esquina del lienzo; láminas, tractos y regiones reaccionan al puntero; la lista también señala en el modelo.
- Ficha antes de la lista, con estado vacío que enseña; la descripción del nivel aparece una vez.
- Clínico: chips con lo que daña cada síndrome, sombreado violeta con el rótulo «Lado de la lesión».
- «Restablecer vista» y clic en el vacío para deseleccionar.
- Rótulos de orientación neutros; rojo y azul solo para los tractos; leyenda con muestras.
- «Cargando modelo 3D…» y aviso si no hay WebGL.
- Interruptores con `role="switch"`, `aria-checked` y nombre en español; `aria-pressed`; tractos ausentes con `disabled`; región `aria-live`.
- Numerales de las láminas y letras S/L/T/C de las capas en el modelo.
- Preferencias leídas tras montar; ayuda de gestos según el dispositivo.
- Letra y contraste subidos; foco visible; `prefers-reduced-motion`.

Pendiente: atajos de teclado y vista/nivel en la URL («Si sobra tiempo»). Sin verificar en el navegador.

## 8. Segunda ronda (2026-11-12, tras las capturas de BUST)

BUST mostró dos capturas: panel más alto que el lienzo (hueco enorme bajo el modelo en «Médula»), vista y nivel apretados dentro del panel, demasiado texto y la ayuda de gestos tapando «Cauda equina · filum terminale».

| Hallazgo | Heurística | Arreglo |
| --- | --- | --- |
| Panel más alto que el lienzo: la página queda descuadrada | H8 | Lienzo y panel con la misma altura (`--alto`); el panel es una tarjeta con ficha fija arriba y lista con scroll propio |
| Vista y nivel mezclados con el contenido; 5 vistas sin espacio | H4, H8 | Barra de herramientas sobre el lienzo con Vista y Nivel (afectan a todo el lab) |
| Texto repetido o accesorio | H8 | Fuera «Corte de forma…», las líneas de ayuda que repetía el estado vacío, el subtítulo y la nota de la ficha de región, y la causa en Clínico; meninges con una línea (`corto`) |
| Tractos ausentes ocupando la lista | H8 | Se ocultan y se resumen en una línea al pie |
| Filas con recuadro propio: lista recargada | H8 | Filas limpias; solo la elegida lleva fondo |
| Ayuda de gestos sobre los rótulos; médula completa cortada abajo | H8 | Ayuda en la esquina inferior derecha; cámara de la médula completa más lejos |

Comprobado sin navegador (`react-dom/server` + Edge sin ventana): escritorio 1440 px y teléfono 390 px, claro y oscuro, con el lienzo como recuadro vacío (el 3D no se pinta así). Lo flotante global de la plataforma (GRIMI y el indicador de Next en desarrollo) puede tapar la esquina inferior del panel; es ajeno a este lab.

## 9. Tarjeta de la práctica (2026-11-13)

BUST: «no se entiende muy bien». Hallazgos y arreglo en `practica/TarjetaPractica.tsx`:

| Hallazgo | Heurística | Arreglo |
| --- | --- | --- |
| «3/10» suelto y chips sin contexto | H2, H1 | «Pregunta 3 de 10» con barra de avance, chip del corte con ícono y la tarea en palabras («Señala en el corte» / «Elige una alternativa») |
| No dice que la respuesta está marcada en el modelo | H1, H6 | «Mírala en el corte: en verde (y lo que tocaste en rojo)» |
| Veredicto, respuesta y explicación en un solo bloque | H8 | Veredicto con check estilizado, filas «Tocaste / Respuesta» con los colores del modelo, y «¿Por qué?» aparte |
| «Siguiente» sin atajo visible | H7 | Tecla «Enter» dentro del botón |

También: la fuente del menú ☰ (el contenedor no fijaba Outfit), checks y ícono de «Restablecer vista» en SVG, etiquetas apagadas al entrar, carga con el mazo del examen 3D y «Salir» como el del atlas.
