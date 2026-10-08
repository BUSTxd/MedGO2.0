# Examen práctico 3D de Miembro Superior: plan

## Contexto
BUST quiere un examen práctico de anatomía del miembro superior que se haga sobre el modelo 3D del atlas (`laboratorio/atlas-3d`). Debe calcar los exámenes reales de Cayetano:
- Ítems A→B.
- Versiones A y B paralelas.
- Respuestas escritas.

El banco sale de dos fuentes:
- Los resúmenes de anatomía del MS, extraídos por subagentes Sonnet 5.5.
- Los exámenes 2025-A, 2025-B y 2024.

La interfaz reutiliza la tarjeta con volteo, la pantalla de resultados del final de Inmunología y el enlace al resumen.

**Decisiones de BUST:**
- Los accidentes óseos se señalan con un **marcador sobre el hueso**.
- El banco va **fuera de git y en el bucket privado**: el repo es público.
- El trabajo sin commitear del atlas va como **primer commit de la rama**.

**Fases y revisiones:** al aprobar este plan queda cerrada la Fase 0. Hay que parar a mostrar el resultado al terminar el catálogo (F1), el análisis (F2), el banco (F3) y `sinonimos.md` (F3.5). La interfaz (F4) se implementa solo después de eso.

## Hallazgos que condicionan el diseño

**Modelo 3D:** `miembro-superior-derecho` v17, 554 piezas.
- La unidad del visor es la «Estructura»: clave `nombre|lado`, `ids[]` (`Visor.tsx:41-49,137-160`).
- La copia local del manifiesto con todos los ids/nombres está en `scripts/atlas-3d/salida/miembro-superior-derecho/manifiesto.json` (gitignored).
- Ya existen como piezas: arcos palmares, cabezas del tríceps y del bíceps, cada carpo e interóseo, y v. cefálica y basílica.
- **No existen como piezas** el tubérculo mayor ni la apófisis coracoides: son parte del hueso.

**Visor:**
- `OrbitControls` sin props de bloqueo (`Escena.tsx:255`).
- Vuelo de cámara a una caja con `PeticionCamara` (`Escena.tsx:18-24,211-256`), pero hoy no encuadra una pieza sola (`Visor.tsx:264-280`).
- La selección resalta con emissive `#3b9edd` (`Escena.tsx:142-152`).
- Ya hay un modo «prueba» de opción múltiple en `PanelRepaso.tsx` + `Visor.tsx:283-349`, que ya bloquea `seleccionar` y `aislar`.

**Fichas** (`src/lib/data/atlas-3d/fichas/`): 554/554, con clave `nombreEn`, sin commitear. **No son fuente**, porque no salen de los resúmenes. Se usan solo para cruzar datos y marcar conflictos.

**Resúmenes de anatomía del MS:** 5 fragmentos en el bucket `resumenes/aparato-locomotor/`:

| Id | Contenido |
|---|---|
| `loc-clase-2` | Hombro y axila |
| `loc-clase-2-osteo` | Osteología del MS |
| `loc-clase-3` | Brazo, codo y antebrazo |
| `loc-clase-5` | Muñeca y mano |
| `loc-sgp-2` | Solo las preguntas 4-5, sobre el hombro |

- Se excluyen Histología, Fisiología, glúteo, MI y Embriología.
- Las prácticas `anat-1..3` heredan esos mismos resúmenes.

**Enlace al resumen:** la página de Locomotor `cursos/aparato-locomotor/[id]/page.tsx` **no** conecta `?resumen=1`. Inmunología sí (`inmunologia/[id]/page.tsx:27,168`). Además `clase-2` tiene 2 opciones y no hay parámetro para abrir una concreta.

**Utilidades reutilizables:**
- Corrección de texto: `normalizar` + `levenshtein` + desambiguación en `src/lib/data/morfologia-gr.ts:408-496` (privado, para extraer a `src/lib/`).
- Resultados: `ExamRunner.tsx:1911-2079` (`NotaFinal` l.1071, `CarruselResumenes` l.396), `examRunner.module.css`.
- Volteo: `tarjetas/Tarjeta.tsx` + `tarjetas.module.css:221-328` (3 capas).
- Ruta de exámenes: `api/examen/[...examKey]` + whitelist `EXAMENES` (`examenes-acceso.ts`) + `fetchExam` (`lib/examen/payload.ts:193`).

**Exámenes leídos:**
- 2025-A y 2025-B: 10 ítems A→B cada uno.
- 2024: 20 ítems de solo A, de los cuales 8 son de MS: n. cubital, n. radial, coracoides, n. musculocutáneo, redondo menor, aductor del pulgar, a. circunfleja humeral posterior, flexor radial del carpo, trapezoide, extensor radial corto del carpo. Son 10 si se cuentan bien; se transcriben en F2.
- Tipos B que no están en la lista de BUST: territorio sensitivo (n. mediano), desembocadura (v. cefálica), «se articula lateral/distalmente», «inserción humeral».

## Rama y protección de datos
1. Crear la rama `examen-ms`. Primer commit: el trabajo del atlas sin commitear (fichas, repasos, `PanelRepaso`, `FichaDetalle`, `verificar-fichas.mjs`, más `CLAUDE.md`, los scripts y `regiones.ts` modificados). El cambio de `locomotor.ts` de la Evaluación 1 va en un commit aparte.
2. `.gitignore`:
   - `data/examen-ms/`: `banco.json`.
   - `docs/examen-ms/extraccion/`, `catalogo_estructuras.json`, `matriz_combinaciones.json` y `sinonimos.md`: llevan citas de resúmenes de pago y respuestas.
   - Se versionan solo `docs/examen-ms/PLAN.md` y `ANALISIS_PATRONES.md`, este sin claves completas.
3. Nada a producción. Push de la rama para que Vercel genere el preview y comprobar su estado con `gh api .../statuses`.

## FASE 0: PLAN.md
Copiar este plan a `docs/examen-ms/PLAN.md`. Con este plan aprobado no hace falta otra parada.

## FASE 1: Extracción (subagentes Sonnet 5.5 en paralelo)
1. `scripts/examen-ms/bajar-resumenes.mjs`, de solo lectura:
   - Usa `scripts/load-env.mjs` y el cliente con service role de `upload-resumen-html.mjs:102-107`.
   - Baja los 5 fragmentos del bucket (la versión publicada manda sobre los exports de Notion en Downloads) a `docs/examen-ms/fuentes/` (gitignored).
   - Los pasa a texto plano conservando los encabezados.
2. Lanzar **6 subagentes** con `Agent`, `model: "sonnet"`, todos en un mismo mensaje: clase-2, clase-2-osteo, clase-3 brazo + codo, clase-3 antebrazo, clase-5 y sgp-2 (solo las preguntas 4-5). Cada uno recibe:
   - El esquema JSON de BUST, ampliado en `datos_B` con `territorio_sensitivo`, `desemboca` y `accidentes` (los del hueso, con sus inserciones).
   - La regla «solo lo que dice el resumen; si falta, vacío».
   - Otra regla: anotar el **encabezado** donde aparece cada estructura, para luego enlazar con `?seccion=`.
   - La salida: `docs/examen-ms/extraccion/<id>.json`.
3. Consolidación (Opus):
   - Unir duplicados y sinónimos.
   - Mapear cada estructura a su `nombreEn`/`ids` del manifiesto local, o a «accidente → hueso padre», o a «sin modelo».
   - Marcar como `conflicto` lo que no cuadre entre resúmenes **o con las fichas**.
   - Salida: `catalogo_estructuras.json` y la lista `estructuras_sin_modelo.md`.
   - **Parada: mostrar el catálogo.**

## FASE 2: Análisis de patrones (Opus)
1. Transcribir los tres exámenes (del 2024 solo el MS, sin B).
2. Para cada ítem: estructura A, categoría, región y tipo B.
3. Emparejar 2025-A con 2025-B ítem por ítem. Lo que ya se ve:
   - n. axilar ↔ cabeza larga del tríceps: no es paralelo exacto.
   - tubérculo mayor ↔ escafoides.
   - flexor radial del carpo ↔ extensor radial largo del carpo: músculo de antebrazo → inervación.
   - n. mediano ↔ n. mediano.
   - v. basílica ↔ v. cefálica: vena superficial, formantes ↔ desembocadura.
   - …
4. Confirmar o ampliar con el 2024 qué estructuras A se repiten.
5. Cruzar con el catálogo y armar la matriz de estructuras × tipos B aplicables. Cada combinación con estado `salió` / `muy probable` / `posible`, según categoría + región + tipo B ya visto.
6. Salida: `ANALISIS_PATRONES.md` y `matriz_combinaciones.json`. **Parada.**

## FASE 3: Banco (Opus)
- Incluir las preguntas oficiales, marcadas `oficial [2025-A|2025-B|2024]`. Las del 2024 traen solo A, así que se les genera la B según el patrón y se marcan aparte.
- Generar preguntas nuevas hasta cubrir **todas** las combinaciones de la matriz.
- Agrupar en Huesos / Músculos / Arterias / Nervios / Venas.
- **Esquema por pregunta:** `id`, `categoria`, `region`, `objetivo`, `preguntaA {enunciado, respuesta, aceptadas[]}`, `preguntaB {enunciado, tipoB, pide (n.º de elementos que exige: "indique 2"), respuestas: [{texto, aceptadas[]}], criterio}`, `origen`, `resumenRelacionado {claseId, opcion, seccion}`.
  - `objetivo` es una de dos: `{tipo:'pieza', en: nombreEn}` o `{tipo:'marcador', hueso: nombreEn, punto:[x,y,z], radio}`.
- **Marcadores** con `scripts/examen-ms/marcadores.mjs`:
  - Calcula el punto de cada accidente sobre la malla del hueso con heurísticas geométricas por accidente (p. ej. tubérculo mayor = zona lateral-anterior más prominente del extremo proximal del húmero). Cada heurística queda escrita junto a su resultado.
  - BUST los revisa en localhost dentro del propio examen; sin visor aparte.
- `aceptadas[]` según las reglas de BUST: TA en español y latín, abreviaturas n./a./v./m./lig., raíces C5-C6, epónimos y nomenclatura clásica (cubital/ulnar, troquíter, palmar mayor, 1.er radial…). Sin formas coloquiales.
- Lo que sea dudoso o contradictorio va con `revision: "<motivo>"` y no se resuelve por cuenta propia.
- Salida: `data/examen-ms/banco.json` (gitignored). **Parada: mostrar resumen del banco** (conteos por categoría, combinaciones cubiertas, dudas).

## FASE 3.5: Motor de corrección
- **Nuevo** `src/lib/texto/corregir.ts`, con `normalizar` + `levenshtein` extraídos de `morfologia-gr.ts`, que pasa a importarlos de ahí. Hace lo siguiente:
  - Normaliza: minúsculas, sin tildes, sin puntos ni espacios extra.
  - Expande `n.→nervio`, `a.→arteria`, `v.→vena`, `m.→músculo`, `lig.→ligamento`.
  - Hace opcional el prefijo de categoría («músculo bíceps braquial» = «bíceps braquial»), pero **no** la porción («cabeza larga del bíceps» ≠ «bíceps»).
  - Errata: 1 letra en palabras de 8 o más letras, que se acepta con aviso «revisa la ortografía». Antes se comprueba que esa forma no esté a la misma distancia o más cerca de la forma aceptada de **otra** estructura del banco (radial/radio, cubital/cúbito): en ese caso se marca mal.
  - `corregirA(texto, aceptadas)` → `bien | casi | mal`.
  - `corregirB(texto, pregunta)`: parte por coma, «y» o salto de línea; empareja cada elemento con su `aceptadas`; devuelve acertados, faltantes y sobrantes/incorrectos.
  - Puntaje B = `min(aciertos, pide)/pide`, y **0 si A estuvo mal**.
- Test con casos de la tabla, en un script de Node (`scripts/examen-ms/probar-corrector.mjs`) que recorre `banco.json`. Comprueba que cada forma aceptada pasa y que no hay choques entre estructuras.
- `docs/examen-ms/sinonimos.md`: tabla estructura → formas aceptadas. **Parada: BUST la revisa antes de implementar.**

## FASE 4: Interfaz

**Publicación del banco:**
- `node scripts/upload-examen.mjs data/examen-ms/banco.json aparato-locomotor/practico-ms.json`.
- La clave `aparato-locomotor/practico-ms` va en `EXAMENES`: plan Interno por `requiredPlanDeCurso`, sin `free`.
- El cliente lo pide con `fetchExam`, así que en el bundle no viaja ninguna respuesta.

**Archivos nuevos** en `src/app/dashboard/laboratorio/atlas-3d/examen/`:
- `ExamenMS.tsx`: orquestador con estados `carga → bienvenida → pregunta(A|B) → resultados`.
- `TarjetaExamen.tsx`: volteo con las 3 capas de `Tarjeta.tsx`, modo esquina y modo expandida.
- `ResultadosExamen.tsx`.
- `src/styles/examenMS.module.css`, en claro y oscuro y con `prefers-reduced-motion`.

**Cambios en el visor:**
- Botón «Iniciar examen» en `accionesEscena`, solo con la región superior cargada.
- `Visor.tsx`: estado `examen` que en modo examen:
  - oculta el `aside` del panel;
  - anula `seleccionar`, `aislar`, el rótulo y el Ctrl+Z;
  - le pasa a `camara` un encuadre de la pieza objetivo o de una caja alrededor del marcador, con el `useMemo` dependiendo de la pregunta actual;
  - resalta la pieza con `idsSeleccion` o pinta el marcador.
- `Escena.tsx`:
  - prop `bloqueada` → `OrbitControls enabled={false}` y sin handlers en `Pieza`;
  - prop `marcador` → esfera o anillo que late en el punto, con `depthTest` apagado para que se vea a través del hueso.

**Flujo:**
1. Animación de carga y recuadro con el texto de BUST, más «Comenzar».
2. La tarjeta se voltea con tensión (anticipación + rebote) y muestra la A.
3. La cámara vuela a la estructura.
4. La tarjeta se encoge a una esquina con un pulso azul y una sacudida cada ~7 s.
5. El alumno puede rotar y hacer zoom, sin rótulos. Al tocar la tarjeta se expande y responde la A.
6. Se desbloquea la B (siempre, pero puntúa 0 si A estuvo mal) y el escenario se desenfoca con `filter: blur` en `.escenario`, nunca `backdrop-filter`, y bloqueo total.
7. Corrección visible con la respuesta oficial completa y las demás formas aceptadas.
8. Siguiente ítem.

**Sesión:**
- 10 ítems, como el real, con la mezcla de categorías de 2025: 3-4 músculos, 2 nervios, 2 huesos, 1 arteria, 1 vena.
- Se eligen primero los no vistos. El avance del banco va en localStorage `medgo:examen-ms:v1` («has visto X/Y» en la bienvenida), y así «completarlo todo» se logra a lo largo de varias sesiones.

**Resultados:**
- Diseño de `ExamRunner` (aro `NotaFinal` + filas por categoría con `.temaRow` + carrusel de resúmenes). `NotaFinal` y `CarruselResumenes` se extraen a `src/components/examen/` para compartirlos sin tocar su comportamiento.
- Puntaje total y por categoría, más la categoría y el tipo B con más fallos.
- Cada fallo enlaza a `/dashboard/cursos/aparato-locomotor/<claseId>?resumen=1&opcion=<id>&seccion=<encabezado>`.

**Locomotor `[id]/page.tsx`:**
- Recibir `searchParams` y pasar `abrirResumen`/`resumenSeccion` como Inmunología, solo si la clase es accesible.
- Nuevo prop `resumenOpcion` en `StudyMaterialSection` para abrir directamente `loc-clase-2-osteo`.

**Esqueleto:** el atlas no tiene `loading.tsx` propio, así que no hay conteos que tocar.

**Documentación:** sección «Examen 3D de miembro superior» en `CLAUDE.md` y memoria nueva `project_examen_ms.md`.

## Verificación
- F1-F3: los scripts de Node validan que:
  - todo `objetivo.en` existe en el manifiesto local;
  - cada combinación de la matriz tiene al menos 1 pregunta;
  - no hay estructura sin `resumenRelacionado`;
  - el corrector acepta todas las `aceptadas` y no confunde estructuras distintas.
- `npx tsc --noEmit`. Sin `next build` mientras su `npm run dev` esté encendido.
- Prueba en `localhost:3000/dashboard/laboratorio/atlas-3d?region=miembro-superior-derecho`:
  - el flujo completo de un ítem de pieza y uno de marcador;
  - el bloqueo de la B y el blur;
  - los resultados y el enlace al resumen;
  - móvil a 390 px y modo oscuro.

  Luego se le pide a BUST que lo revise visualmente.
- Push de `examen-ms` y deploy preview de Vercel en `success`. Se le pasa la URL del preview. **Sin merge a `main`** hasta que BUST lo diga.
