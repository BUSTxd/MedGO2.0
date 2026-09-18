# Instrucciones para Claude

Antes de cualquier respuesta o acción, comienza siempre diciendo el nombre del usuario: **BUST**.

---

## Proyecto: MedGO 2.0

Plataforma de estudio médico para estudiantes de la Universidad Peruana Cayetano Heredia (UPCH). Incluye cursos con sílabo, banco de preguntas, laboratorios virtuales, atlas de histología y micología.

---

## Stack

- **Framework**: Next.js 14 App Router (TypeScript)
- **Base de datos / Auth**: Supabase (client: `src/lib/supabase/client.ts`, server: `src/lib/supabase/server.ts`)
- **Estilos**: CSS Modules por componente en `src/styles/`. Sin Tailwind. Sin styled-components.
- **Pagos**: Mercado Pago (suscripciones API-first, `src/lib/mercadopago.ts`)
- **Fuente**: `var(--font-outfit)` (Outfit, cargada en `src/app/layout.tsx`)
- **Deploy**: Vercel

---

## Variables CSS globales (`src/app/globals.css`)

```css
--bg: #08061a          /* fondo principal */
--bg2: #0d0b28         /* fondo secundario */
--purple: oklch(0.42 0.18 275)
--purple-light: oklch(0.62 0.18 275)
--blue: #3b9edd         /* acento azul */
--orange: #f5a623
--white: #f0eeff        /* texto principal */
--muted: rgba(240, 238, 255, 0.5)
--card-bg: rgba(255, 255, 255, 0.04)
--card-border: rgba(255, 255, 255, 0.08)
```

### Paleta Investigación (`src/styles/investigacion.module.css`)

Acento **teal** (derivado del SVG `research-svgrepo-com.svg`, `rgb(44, 169, 188)`): `--inv-teal #2CA9BC`, `--inv-teal-dark #1a8a9c`, `--inv-emerald #48C9B0`, `--inv-blue #5E9CD3`. Clases `.invPanel`, `.invPanelHeader`, `.invIconBox`, `.invBadge` (con dark mode incluido).

---

**Modo oscuro**: clase `dark-mode` en `<body>`. Toggleado en `DashboardWrapper.tsx` y guardado en `localStorage('medgo-dark')`. Las páginas del dashboard definen sus propias variables dentro de `:global(.dark-mode) .wrapper { ... }`.

**Regla crítica de CSS**: Nunca poner estilos de dark-mode en `globals.css`. Cada página/componente los define en su propio `.module.css`.

---

## Estructura de rutas

```
src/app/
├── page.tsx                          # Landing page pública
├── auth/
│   ├── login/page.tsx
│   └── device-limit/page.tsx
└── dashboard/
    ├── layout.tsx                    # RSC: auth + device check + plan
    ├── home/page.tsx
    ├── cursos/
    │   ├── page.tsx                  # Grid de cursos (título: "Cursos")
    │   ├── microbiologia/
    │   │   ├── page.tsx              # Sílabo del curso
    │   │   └── [id]/page.tsx         # Clase individual
    │   ├── farmacologia/[id]/page.tsx
    │   ├── cardiovascular/[id]/page.tsx
    │   ├── neurologia/[id]/page.tsx
    │   └── excretor/[id]/page.tsx
    ├── histologia/
    │   ├── page.tsx                  # Atlas filtrable (chips clase/tinción/aumento)
    │   └── [curso]/page.tsx
    ├── laboratorio/
    │   ├── page.tsx                  # Grid de labs (tarjetas en LAB_TOPICS)
    │   ├── electrocardiograma/       # Simulador EKG
    │   ├── nefron-interactivo/       # SVG del nefrón con zoom
    │   ├── parametro-sangre-orina/   # Minijuego drag-and-drop
    │   ├── eva-2/                    # Examen anatomía A→B (motor AnatExam)
    │   ├── eva-3/                    # Examen anatomía A→B (motor AnatExam)
    │   ├── atlas-microbiologia/
    │   ├── atlas-parasitologia/
    │   ├── atlas-micologia/          # Selector modo alternativas/escribir
    │   ├── cascada-coagulacion/      # Lienzo de la cascada: explorar + aprender (ver sección propia)
    │   └── microscopio/
    ├── investigacion/
    │   ├── page.tsx                  # Mapa serpenteante de 14 niveles (NivelMap)
    │   └── [nivel]/page.tsx          # Runner gamificado por nivel (ver Sistema de Investigación)
    ├── contacto/page.tsx
    ├── cuenta/page.tsx
    ├── modelado/                     # Editor 3D — SOLO admin (ver sección propia)
    ├── aportes/page.tsx              # Avance y aportes — admin + canVerAportes (ver sección propia)
    └── admin/page.tsx
```

---

## Componentes clave

| Archivo | Qué hace |
|---|---|
| `src/components/DashboardWrapper.tsx` | Shell del dashboard: sidebar + dark mode + providers |
| `src/components/DashboardSidebar.tsx` | Sidebar de navegación. Array `NAV` con label/href/icon. Ícono de Cursos: book-bookmark SVG con `stroke="currentColor"` |
| `src/components/StudyMaterialSection.tsx` | 3 tarjetas de material por clase: Video, Banqueo, Resumen |
| `src/components/ExamRunner.tsx` | Examen inline (`?examen=1`). Lee del bucket privado `examenes`. Soporta N grupos independientes vía `groupKeys?: string[]` — selector cuadros A/B/C… en esquina superior derecha, carga diferida por grupo, puntuación independiente. Cronómetro y animaciones: ver **Cronómetro del ExamRunner** |
| `src/components/ExamenDeCurso.tsx` | Plantilla común del examen de una actividad: plan del tramo, velo, años y aviso de suscripción. Un curso sólo aporta su `ExamenRef` |
| `src/components/AnatExam.tsx` | Motor compartido de los EVAs de anatomía (EVA 2/3, futuro EVA 1). Examen interactivo A→B; ver **Sistema de EVAs** |
| `src/components/PdfFullscreenModal.tsx` | Viewer PDF fullscreen con zoom. Usa signed URLs + sessionStorage cache |
| `src/components/PlanProvider.tsx` | Context con `plan`, `isActive`, `expiresAt`. Consumido con `usePlan()` |
| `src/components/AuthProvider.tsx` | Singleton del cliente Supabase, compartido para evitar múltiples instancias |
| `src/components/LockedContent.tsx` | Paywall reutilizable para contenido premium |
| `src/components/AportesPanel.tsx` | Panel de avance y aportes (`dashboard/aportes`). Lee `src/lib/aportes-stats.ts` y `src/lib/material-plan.ts`; ver **Sistema de Avance y Aportes** |

---

## Sistema de planes y paywall

Definido en `src/lib/plans.ts`. Los planes se agrupan en **dos tramos** (`Track`), que se cursan en facultades distintas y **no son niveles de un mismo escalafón**:

| Plan | Precio | Tramo | Desbloquea |
|---|---|---|---|
| `free` | — | — | acceso básico |
| `ufbi` | S/ 19.70/mes | `basico` | los 6 cursos del ciclo básico (1.er año, UFBI) |
| `ufbi-anual` | S/ 189/año | `basico` | ídem, con precio bloqueado 12 meses |
| `interno` | S/ 14/mes | `medicina` | los cursos de la Facultad de Medicina (2.º-7.º año) |
| `residente` | S/ 142.80/año | `medicina` | ídem + extras |

**Cada tramo tiene un mensual y un anual**, y el anual es el escalón alto de su tramo (`planRank` 2). Los cursos siempre declaran el **mensual** como `requiredPlan` (`"ufbi"` / `"interno"`): el anual los abre por rango, así que no hay que tocar ningún curso al añadir uno.

**Los dos anuales se anuncian mensualizados en la landing** (S/ 11.90 y S/ 15.75 en el precio grande, el total anual en el `priceSub`). El importe que se cobra —y el que va en `PLANS`— es el anual. Los tres números del tramo básico están atados: 12 × 19.70 = 236.40, S/ 189 es su 80 % (badge «20 % de descuento») y 189 / 12 = 15.75 exacto. Tocar un precio obliga a rehacer los otros dos y el badge.

**Nada de decidir la cadencia por el nombre del plan.** Se lee de `PLANS[key].durationDays` (`=== 30` mensual, `>= 365` anual) — así lo hacen `SubscribeModal`, `LockedContent` y `SubscriptionPanel`. El **compromiso de 3 meses es un eje aparte** (`tieneLock`, hoy solo `interno`).

**Regla crítica de acceso**: usar `planUnlocks(plan, required)`, **nunca** comparar `planRank()` a secas. Un plan de un tramo jamás abre cursos del otro; `planRank` solo ordena *dentro* de un mismo tramo (residente ≥ interno, ufbi-anual ≥ ufbi). Cada `[id]/page.tsx` de curso declara su tramo vía `requiredPlan` en `<LockedContent>` (`"ufbi"` en los 6 del ciclo básico, `"interno"` en el resto). Y también en el índice del curso (`cursos/<slug>/page.tsx`): `!!plan.allAccess || (plan.isActive && planUnlocks(plan.plan, '<tramo>'))`, variable `hasAcceso` — al añadir un curso hay que copiar esa línea.

El admin lleva `allAccess: true` en `PlanState` (`getUserPlanState`) — sin ese flag su plan `residente` pertenece al tramo `medicina` y le bloquearía los cursos de UFBI.

El plan del usuario vive en `profiles.plan` + `profiles.plan_expires_at` en Supabase (CHECK constraints que hay que ampliar al añadir un plan nuevo). Para verificar plan en servidor usar `getCachedPlanState()` de `src/lib/plans-server.ts`.

**Landing (`Pricing.tsx`)**: switch día/noche que alterna entre tramos; cada uno muestra solo sus tarjetas (gratuito + mensual + anual). El acento (`--acc`) tiñe tarjetas/checks/botón: azul `#3b9edd` en UFBI, violeta `#8b5cf6` en Medicina. Badges por `BADGE_CLASS` (`popular` naranja, `annual` verde, `discount` verde con `badgePulse` — el pulso es exclusivo del de descuento).

**Los planes de Mercado Pago se crean por API, no en el panel** (`POST /preapproval_plan` con el token de la app *Medgoplus*): un plan creado en el panel web queda bajo otro `client_id` y no aparece en `GET /preapproval_plan/search`. IDs en `MP_PLAN_UFBI_ID` / `MP_PLAN_UFBI_ANUAL_ID` (+ Interno/Residente) — sin ellos `getPlan()` devuelve `null`. **Dos juegos de IDs**, uno por entorno (`.env.local` test user / Vercel producción), no se comparten.

**El compromiso mínimo (`commitmentMonths`) lo llevan los dos MENSUALES** (`interno`, `ufbi`; 3 meses), aparte de la cadencia (`durationDays`) y no deducible del nombre del plan — leerlo de `PLANS` evita desincronizar modal de compra / Mi cuenta / cancelación.

**`unlockDateFor(planKey, createdAt)`** en `plans.ts` calcula la fecha de desbloqueo en meses calendario (`setMonth +N`). La comparten el botón de Mi cuenta y el guard de `api/subscriptions/cancel` **a propósito**: el guard real es la API (responde `423` con `unlockAt`/`months`), el botón es solo la señal visual.

`/terminos` recorre `PLANS` para precios y compromiso — un plan nuevo aparece solo.

**Acceso por sección** — `src/lib/acceso.ts` traduce «¿de qué tramo es este contenido?» a «¿puede entrar?», leyendo `CURSOS`/`LABORATORIOS` de `src/lib/data/aportes.ts`. Expone `requiredPlanDeCurso(slug)`, `requiredPlanDeLab(slug)`, `planDeTrack(track)`, `tieneAccesoA(planState, required)`, `trackDelUsuario(planState)` (decide qué sección va primero). Slug sin registrar cae en `medicina` (bloquear de más es el fallo seguro).

**Laboratorios gratis**: `gratis: true` en `LABORATORIOS` + `labEsGratis(slug)`. Su `layout.tsx` no monta `SeccionGate`; el índice le pone etiqueta «Gratis» solo si sale bloqueado. Hoy sólo `cascada-coagulacion`.

| Sección | UFBI | Facultad | free |
|---|---|---|---|
| Cursos | sus 6, el resto atenuado | sus 11, el resto atenuado | los 17 atenuados, en dos secciones |
| Laboratorio | índice abierto, paneles de Facultad con candado | todo | igual que UFBI |
| Histología · Investigación | candado | todo | candado |

- **Rejillas partidas en dos** (`cursos/page.tsx`, `laboratorio/page.tsx`, RSC): tramo del alumno arriba; sin plan, orden de la carrera. Tarjetas del otro tramo atenuadas pero clicables (el índice del curso invita a pagar).
- **Secciones completas: el gate va en `layout.tsx`**, no en la página — `SeccionGate` (RSC) envuelve en `LockedContent`, cubre índice + rutas hijas sin tocar páginas de cliente grandes. Cada laboratorio lleva el suyo con `requiredPlanDeLab('<slug>')`.
- **`LockedContent` acepta `preview`** (default `true`): en una clase el velo difuminado es aperitivo; en una sección entera (montaría una escena 3D completa) va en `false`.
- **El candado del sidebar es señal, no cerradura** — `accesoFacultad` se calcula en el servidor (`dashboard/layout.tsx`); con `usePlan()` el admin (sin suscripción) vería candados tras un `refreshPlan()`. Quien bloquea de verdad es el layout de la sección.

---

## Patrones de datos

**Sílabos de cursos**: archivos en `src/lib/data/[curso].ts`. Cada clase tiene `id`, `titulo`, `hasResumen`, `examen?` (con `key` para el bucket, `free?` para bypass paywall, `groups?: string[]` para grupos adicionales del selector N-grupos).

**ExamenRef con N grupos**:
```ts
examen: { key: 'neurologia/snc-histologia', free: true, groups: ['neurologia/snc-histologia-a3', 'neurologia/snc-histologia-c'] }
```
`groupKeys={act.examen.groups}` pasa a `<ExamRunner>`. Cada clave en `groups` referencia un JSON independiente en el bucket `examenes` y debe estar en el whitelist `EXAMENES` de `src/lib/data/examenes-acceso.ts` (lo lee la route `api/examen/[...examKey]` y la ficha de actividad del admin) (sin ese paso el cuadro sale en el selector y la route responde 404).

**Banqueos de varios años (`labels`)**: `labels: Record<clave, rótulo>` en el `ExamenRef` (`groupLabels` a la página) rotula cada grupo por año («Banqueo 2024») en vez de «Grupo A». El rótulo va **por clave, no por posición**. Cada banqueo guarda su propia nota e historial de intentos por clave.

**`hints`** (mismo shape que `labels`): nota descriptiva por clave cuando el rótulo (p. ej. sin año) no dice de qué va el banqueo — tooltip en el selector y junto al rótulo en la cabecera (para táctil, sin hover).

**Plantilla común: `ExamenDeCurso` + `ExamenRef` (`src/lib/data/examen.ts`)**. RSC que recibe `curso`, `examen`, `titulo`, `backHref`: lee el plan, saca el requerido del tramo del curso (`requiredPlanDeCurso`), pasa `groups`/`labels`/`dePago` al runner con el aviso cada N preguntas, y pone el velo de `LockedContent` salvo que el curso sea gratis o el banqueo lleve `free`. **Para dar banqueo a un curso nuevo**:
1. JSON fuente en `scripts/examenes/<curso>-<examen>.json` → `node scripts/upload-examen.mjs <archivo> <curso>/<clave>.json`;
2. la clave en `EXAMENES` (`src/lib/data/examenes-acceso.ts`, con `free` o sin él);
3. `examen?: ExamenRef` en el `Actividad` del curso;
4. en su `[id]/page.tsx`: `if (sp?.examen === '1' && act.examen) return <ExamenDeCurso … />` + `examen`/`examenTitle` en `StudyMaterialSection`.
Patología e Inmunología usan la plantilla. Neurología y Excretor montan el runner a mano **a propósito** (pasarlas activaría el aviso de suscripción en exámenes que hoy no lo tienen).

**Variantes de una pregunta (`variante` en el JSON)**: dos versiones de la misma pregunta («Reconstruida»/«Original») con un interruptor (`SelectorVersion`) sobre el enunciado. Comparte número/rastro/nota; la respuesta vale en la versión en que se dio (`esCorrecta` busca el `id` en las alternativas de ambas). Los `id` de la variante llevan prefijo (`va`, `vb`…) y no repiten los de la base. Al cambiar de versión tras responder, la otra sale ya resuelta. Lo no declarado se hereda **salvo `reviewNote`**.

**Alternativas que son imágenes (`image` en la opción)**: la lista pasa a rejilla de fichas (3/fila, 2 móvil) — la foto amplía con el visor de siempre, la barra de abajo (con la letra) marca. Acierto/fallo/atenuado se aplican a la ficha entera.

**Respuesta múltiple (`multiple: true`)**: tocar solo marca/desmarca; se responde con **Comprobar**/Enter. Acierta solo si se marcan **exactamente** las correctas (`acierta`). La correcta no marcada sale hueca («Faltó marcarla»). `picked` es lista de ids.

**`ordenFijo` en la pregunta**: desactiva el barajado — solo para alternativas cuya letra vive dentro de la imagen (no filtra la respuesta).

**Figuras muy verticales**: si miden >1,4× su ancho de alto, el runner limita el alto a 480 px y las centra (`figuraVertical`) en vez de estirarlas a todo el ancho.

**Banqueos de pago dentro de un curso gratis (`dePago` + `suscripcion`)**: un curso `gratis` puede tener algunos banqueos que exigen plan (reclamo) y otros abiertos (muestra). Dos capas, y la que bloquea es el servidor:
- **Route**: la clave va en `EXAMENES` **sin `free`**; se comprueba `tieneAccesoA(getUserPlanState(), meta.plan ?? requiredPlanDeCurso(<curso>))`.
- **Runner**: `dePago: [claves]` en el `ExamenRef` solo pinta el candado y evita pedir el JSON (sería 403). El cuerpo va dentro de `LockedContent` (`PuertaDePago`) — **decide `LockedContent`, no el runner**, porque tras pagar el plan vivo cambia al instante y el runner desmontaría el modal a mitad del recibo.

**Aviso de suscripción cada N preguntas** (`suscripcion.avisoCada`): tarjeta con precio/beneficios + botón que monta `SubscribeModal` (SDK de MP solo entonces). Se cierra con X y se va solo al avanzar; qué tanda se cerró se recuerda por intento. Nunca lo ve quien ya tiene el plan activo del tramo (servidor **o** plan vivo). Con el modal abierto, A–E no contestan la pregunta de detrás.

**`SubscribeModal` va por portal a `<body>`** — montado dentro de `.shell` (z-index propio, contexto de apilamiento), la sidebar fija quedaba por encima del modal de pago.

**Banqueo a medias (`muestra: N` en el whitelist de la route)**: abre las N primeras preguntas a quien no tiene el plan. **El recorte se hace en el servidor**: la route descarga el JSON, lo corta y devuelve `{ payload, muestra }` inline en vez de la URL firmada — ocultarlas en el cliente no serviría de nada, porque el JSON completo (con sus respuestas correctas) ya estaría en la pestaña Red. No se cachea en `sessionStorage` (al cambiar el plan la respuesta tiene que cambiar), y se entrega igual con sesión que sin ella. La clave **no puede estar en `dePago`**: ahí el runner pinta el candado y nunca pide el JSON. El runner rotula la muestra en el mando y, al terminarla, da el informe por temas más la invitación a completar el banqueo. **Con el plan el oro sigue**: la route devuelve `premiumDesde` junto a la URL firmada, el runner marca esas preguntas *antes* de barajar y las pinta en oro (número, filete, etiqueta «Premium», marca pendiente del rastro, total del contador). Como el corte es por las N primeras del JSON, el JSON se ordena para que la mitad gratis cubra todos los temas. Hoy: `inmunologia/final-2023` (34 de 68) y `epidemiologia/parcial-1-pasos` (27 de 54).

---

## Sistema de estudio por temas (informe al terminar un banqueo)

Cada pregunta declara **un** `tema` (string, no array) del vocabulario de su curso; la tabla `src/lib/data/temas/<curso>.ts` dice qué clases lo cubren. Al terminar, la pantalla de resultados pinta el desglose por tema y recomienda la clase concreta; el panel «Repasa esto» del home (`RepasaEsto.tsx`) muestra los temas flojos acumulados.

- **Un solo tema por pregunta**: con varios, una fallada carga el fallo a 2-3 temas y los porcentajes dejan de ser comparables. El tema va en la pregunta base, nunca en su `variante`.
- **La tabla NO importa el sílabo** — `ExamRunner` y el panel del home son cliente, y arrastraría cientos de KB. Duplica `codigo`/`titulo`/`gratis` y `scripts/verificar-temas.mjs` (`npm run verificar:temas`) los compara contra el sílabo real: es lo único que evita la desincronización.
- **Motor en `src/lib/temas-flojos.ts`**: el curso sale de `examKey.split('/')[0]`, así que el runner no conoce ningún curso. Sin taxonomía (patología, neurología) no se pinta nada y la pantalla queda como siempre.
- **Orden: fallos desc → pct asc → label**, para que un 0/1 anecdótico no desplace a un 3/8 real. Flojo = `pct < 60`; en el home se exige además `total >= 3`.
- **Acumulado en `localStorage` (`medgo:temas:v1`)**, sin backend. Tope de 20 preguntas por tema con reescalado proporcional: sin él, un tema ya dominado seguiría flojo para siempre porque los fallos viejos nunca se irían.
- **`?resumen=1`** abre el resumen al entrar (prop `abrirResumen` de `StudyMaterialSection`, estado inicial y no efecto). **Sólo se pasa si la clase está accesible**: el visor va por portal a `<body>`, o sea por delante del velo de `LockedContent`.
- Todo tema debe tener ≥1 clase. Los que no tienen clase propia en el sílabo (`tecnicas`, `hipersensibilidad`, `inmunodeficiencias`) apuntan a la más cercana; cambiar ese mapeo **no exige volver a subir ningún JSON**, que es la razón de la indirección tema→clase.

**Clases liberadas dentro de un curso de pago**: `gratis?: boolean` en el `Actividad` del sílabo. Hoy T2, T5, T9, SGP-3 y H1 de Inmunología. La regla se repite en `[id]/page.tsx` y en el índice del curso (que además pinta la etiqueta «Gratis», sólo a quien no tiene acceso). **Histología ya no es libre por tipo**: H1 lleva el flag y H2 es de pago.

**Lo inverso — clases de pago dentro de un curso gratis**: `premium?: boolean` en el `Actividad` de Epidemiología (hoy T2-T4, las teorías con resumen). Velo en `[id]/page.tsx` y candado en el índice. En la tabla de temas van **sin** `gratis`, para que el carrusel del informe las pinte con candado.

**Resúmenes protegidos — `src/lib/acceso-resumen.ts`**: `/api/resumen` (PDF) y `/api/resumen-html` responden 403 si la clase no es libre y el usuario no tiene el plan del tramo. El velo de la página no protege nada; la cerradura es esto. Recorre `SILABOS` y mapea cada id de resumen (`resumen.opciones`, `propuestos.opciones`/`claseId`, o el id de la clase) a su curso y a si la clase es libre. **`LIBRE` calca la condición de cada `[id]/page.tsx`**: si una página cambia qué clases abre, cambiarla aquí o el resumen dará 403 en una clase libre. `SIEMPRE_DE_PAGO`: prácticas 8-13 de Parasitología (página libre, PDF de pago). Id sin clase en el sílabo → curso por prefijo y de pago (fallo seguro). Al añadir un resumen, comprobar que su id sale del sílabo.

**Contra copia** (los dos visores): Ctrl/Cmd + C/X/A/S/P/U bloqueados, sin clic derecho, sin selección (`user-select: none`) ni arrastre de figuras, y `@media print` oculta el visor. Es disuasión, no DRM: captura de pantalla o herramientas de desarrollador siguen pudiendo.

**El JSON fuente se versiona en `scripts/examenes/`** aunque lo que sirve la web sea la copia del bucket; se publica con `node scripts/upload-examen.mjs <archivo> <curso>/<clave>.json`. Enunciados y alternativas se transcriben **tal cual** del examen real; lo que el original trae roto se transcribe igual con `reviewNote` (pinta el badge «Pendiente a revisión»).

**Imágenes de exámenes**: bucket **público** `examenes-img` (no firmadas), path `<curso>/<grupo>/<archivo>`, URL completa en el JSON, `next/image` + `sizes`. Carpeta entera → `scripts/upload-examen-img-dir.mjs --dir <carpeta> --prefix <ruta>` (imprime `archivo → { url, w, h }`). Varias imágenes por pregunta: primera en `image`, resto en `extraImages`. **Un `.avif`/`.webp` de origen se sube tal cual**; `.png`/`.jpg` pasan por `sharp` a WEBP q82.

**Cronómetro del ExamRunner** — lo enciende `duration_min` del JSON (minutos **recomendados**, no límite): cuenta hacia **arriba** desde 0, azul mientras quepa, rojo + un latido al pasarse. Con `duration_min: null` no aparece. Sale de restar contra el instante de arranque (no de sumar por tick); se reinicia con el intento (`stage`+`runId`); total en `localStorage` (`seconds`, opcional).

**El reloj se PAUSA, y el aro es el botón** (⏸/▶ en el centro, bloque ámbar en pausa). Total = tramos cerrados + tramo en curso, así el rato en pausa no entra en el conteo. Al pausar se retira la pregunta de vista.

**Animaciones del examen**: tarjeta con `key` por pregunta (remonta, repite entrada), alternativas en cascada, acierto late, fallo se sacude 4 px, nota final cuenta hasta su valor. Apagado bajo `prefers-reduced-motion`. Al avanzar se mueve la **ventana** (`window.scrollTo`, nunca `scrollIntoView`: `.microPage` lleva `overflow: hidden`).

**Diseño de la hoja de examen** — sin tarjetas-panel; solo tienen forma propia las piezas que se manipulan:
- **Mando** (contador · rastro · reloj): el **rastro** es una marca por pregunta (verde/roja, actual resalta); por encima de 80 preguntas vuelve a ser barra continua (cada marca mediría <1px).
- La pregunta no es una caja: folio con filete a la izquierda + contenido a la derecha.
- Alternativas como lista (fondo transparente, filete separador, barrido de color al pasar/responder). Responden con **A–E/1–5**, avanzan con **Enter**.
- La explicación va **debajo** de las alternativas, no encima.

**Imágenes ampliables**: la figura es el botón (chip «Ampliar» visible sin hover). Visor por **portal a `<body>`**, oscuro en los dos temas, zoom con rueda/botones/doble clic/arrastre. **Nada de `backdrop-filter`** en overlays de esta app — ya dejó fondos en blanco al cerrar.

**Imágenes**: `next/image` AVIF + `sizes` responsivo. Buckets públicos `histologia`, `micologia`. Bucket privado `examenes`.

**Signed URLs**: se generan en server con `src/lib/supabase/storage.ts`, cacheadas en `sessionStorage` 1 hora.

---

## Reglas de íconos en la sidebar

Array `NAV` en `DashboardSidebar.tsx`: `width="20" height="20"`, `fill="currentColor"` para íconos rellenos, `stroke="currentColor"` + `strokeWidth` explícito **en cada `<path>`** (no en el `<svg>`) para íconos de trazo — evita transparencias acumuladas con color alpha.

## Reglas de CSS de la sidebar (`src/styles/dashboardSidebar.module.css`)

Inactivo: `color: #f0eeff` sólido + `opacity: 0.65`. Hover: `opacity: 1`. Activo: `opacity: 1` + `.navIcon { color: #3b9edd }`. La sidebar siempre es oscura (`#1a2557`), independiente del dark mode del panel.

---

## StudyMaterialSection — tarjetas del sílabo

1. **Video** / **Simulación** (prop `simulacion`) — sin ninguna, locked/próximamente.
2. **Banqueo** — activa con `examen`, `solucionario` o `propuestosPdf` (esa es la precedencia). `banqueoLabel` sobreescribe el título («Propuestos»). `hideBanqueo` la omite del todo.
3. **Resumen** — activa con `hasResumen`, abre `PdfFullscreenModal`.

---

## Sistema de EVAs (exámenes interactivos de anatomía)

Motor compartido en **`src/components/AnatExam.tsx`**. Cada EVA es un wrapper delgado; toda la lógica (flujo, shuffle, precarga, overlays, persistencia, matching) es común. Estilos en `src/styles/eva2.module.css`.

**Flujo por pregunta**: A = nombrar la estructura señalada → al acertar desbloquea B (detalle clínico/funcional). Si A falla, B se muestra ya resuelta.

**Props de `<AnatExam>`**: `{ questions, kicker, title, examId }`. `examId` da persistencia automática en `localStorage` (`medgo-eva-progress-<examId>`).

**Imágenes**: bucket público `examenes-img`, path `neurologia/eva<N>/`. Precarga de las próximas 4 preguntas. Shuffle pseudoaleatorio que nunca repite `region` consecutiva.

**Para crear un EVA nuevo**: copiar carpeta `eva-3/` (page + wrapper + questions.ts), setear `examId`, añadir tarjeta en `LAB_TOPICS`. No se toca el motor.

---

## Solucionarios paso a paso (tarjeta «Banqueo» de las prácticas dirigidas)

Motor en **`src/components/SolucionarioRunner.tsx`** + `src/styles/solucionario.module.css`. Contenido en `src/lib/data/solucionarios/` (`types.ts`, `tema.ts` por práctica, registro en `index.ts`). Hechas las 8 prácticas dirigidas de Química Orgánica.

**Por qué existe**: las respuestas referencian dibujos del enunciado — el runner **muestra el PDF del enunciado y la explicación en simultáneo** (split de dos columnas; bajo 900px, pestañas).

**Vocabulario de bloques** — cada uno tiene forma propia; comprobar si alguno ya calza antes de crear uno nuevo:

| Bloque | Para qué |
|---|---|
| `parrafo` | razonamiento corrido |
| `mapeo` | marca del dibujo ↔ comentario del enunciado |
| `datos` | apartados etiquetados con su cifra/veredicto |
| `contraste` | repartir en dos grupos opuestos |
| `tabla` | varias especies comparadas sobre los mismos criterios |
| `opciones` | alternativas con `esRespuesta`/`veredicto` (verde/rojo/gris) |
| `esquema` | diagrama que el enunciado no trae (dibujado inline en `SolucionarioEsquema.tsx`, registro `ESQUEMAS`, colores por variables CSS para light/dark) |
| `clave` | respuesta final |
| `nota` | el porqué a recordar |

**Regla de redacción**: si un apartado usa `datos`, sus hermanos no pueden caer en `parrafo` (se les da forma propia con su `etiqueta`).

**Para añadir uno nuevo**: `src/lib/data/solucionarios/<id>.ts` mismo shape, registrar en `SOLUCIONARIOS`, `pdfId` en `ALLOWED`/`FILE_ALIAS`. No se toca el motor.

---

## Resúmenes en HTML (material muy visual) — skill `/addresumenhtml`

Segundo envase de la tarjeta «Resumen», para apuntes propios muy visuales donde el PDF pesa demasiado. El fragmento HTML conserva texto real seleccionable y sirve figuras en AVIF desde CDN público.

**Piezas**: `scripts/upload-resumen-html.mjs` (convierte a AVIF, sube, transforma export de Notion) · `src/app/api/resumen-html/[claseId]/route.ts` (sirve con ETag) · `HtmlFullscreenModal.tsx` · `resumenHtml.module.css`.

**Almacenamiento**: fragmento en bucket privado `resumenes`; imágenes en bucket público `resumenes-img/<curso>/<slug>/`.

**Activación**: `resumen: { tipo: 'pdf', formato: 'html', opciones: [...] }` en el sílabo; `formato` vive por opción para mezclar HTML nuevo con PDFs viejos.

**Reglas no obvias**: un export de pdf2htmlEX **no sirve** (PDF rasterizado); el HTML se inyecta con `dangerouslySetInnerHTML` así que las clases de Notion van `.sheet :global(.x)`; caché por **ETag, nunca max-age largo**; un `.avif`/`.webp` ya convertido se sube tal cual, sin pasar por sharp; la cáscara del visor es oscura en ambos temas (solo `.sheet` reacciona al tema); `cacheControl` solo se aplica vía `supabase-js`, no por REST crudo.

---

## PDF reconstruido en capas — skill `/addresumencapas`

Tercer envase de «Resumen»: exports que rehacen un PDF como capas absolutas (`.image-layer`, `.text-layer`, `.ink-layer`) sobre una página de tamaño fijo. **No reflowea** (texto en posición absoluta) — conserva solo texto seleccionable + peso bajo. Ante uno de estos, preguntar antes de adaptarlo.

**Auditor**: `scripts/audit-resumen-capas.mjs --dir <carpeta> [--fix]`. Caza 4 fallos silenciosos del formato: extensiones sin reescribir tras convertir a AVIF, figuras deformadas (corregir por ancho, nunca por alto), resaltador opaco tapando texto (`mix-blend-mode: multiply` en `.ink-layer`, nunca bajar z-index), franjas vacías que en realidad tienen tinta encima (esquemas que solo viven en la capa de tinta).

**Publicación**: `scripts/upload-resumen-doc.mjs --dir --curso --id --slug [--dry] [--force]` — detecta y publica **5 variantes/envases** del mismo conversor, todas verificables por el `<style>`/estructura del documento, nunca por el nombre de las clases:

1. **«layers»** — página `.page`, px, `<figure>`+`<img>`, tinta raster AVIF con resaltado quemado dentro.
2. **«pdf-page»** — página `.pdf-page`, unidad variable (pt o px, hay que leerla del documento), tinta en **SVG** (nítida a cualquier zoom), resaltador aparte o mezclado en un SVG único — siempre color pleno opaco, se atenúa con `opacity: .45` + `mix-blend-mode: multiply`.
3. **«documento de flujo»** (`.doc-flujo`) — HTML real con texto en flujo, reflowea, el mejor de los tres clásicos; su propio `<style>` se descarta y sanea.
4. **«páginas auto-escaladas»** (`.doc-paginas`) — todo en `%`/`cqw`, se escala solo sin JS de runtime; su `<script>` original (`fitTypography`, ajusta cada palabra al ancho que tenía en el PDF) **sí hay que portarlo** a `HtmlFullscreenModal` (mide en un solo pase, espera `document.fonts.ready` y su evento `loadingdone`).
5. **«hojas de tamaño fijo»** (`.doc-hojas`) — N páginas con sus propias medidas inline; la frontera con «capas» es **cuántas páginas hay** (≥2 contenedores de página), no solo la altura fija. Su script hace `fit()` por hoja + `fitLines()` (ajusta cada línea, no cada palabra).

**Reglas transversales que ya costaron una iteración**:
- El objeto de `dangerouslySetInnerHTML` va **memoizado** (`useMemo`): sin él, React compara por referencia y rehace el documento entero en cada render, perdiendo el `transform` de escalado y saltando el scroll a 0.
- `.text-layer` necesita `pointer-events: none` en la variante «layers» o se come el `:hover` de las figuras (en «pdf-page» no hace falta: cada `.pdf-text` es una caja suelta).
- Las tres/cuatro familias comparten un único espacio de nombres de clases en el CSS module: el vocabulario de «capas» va acotado a `:where(.capas)` para no pisar «documento de flujo» (un `.figure` de otra variante volvía las imágenes `position:absolute` en un documento que no lo pedía).
- `overflow: hidden` en la caja de una figura se come la sombra del hover — no hace falta, ya está `object-fit: contain`.
- `backdrop-filter` está prohibido en el lightbox de estas figuras: con `transform`+`mix-blend-mode` de fondo, Chrome no repinta esa capa al cerrar el overlay y el documento queda en blanco.

Publicado (referencia rápida, sin el detalle de cada caso — ver memoria `project_resumen_capas.md`): Biología Celular (`bcm-ta-1/2/3/4/5/7/10/12/13`, `bcm-te-2/4/6/8/11`, `bcm-pl-6`, `bcm-afa-1`), varias con picker junto a su PDF original.

---

## Diapositivas en PDF → «páginas auto-escaladas» (`scripts/diapositivas-pdf-a-html.py`)

Para un PowerPoint exportado a PDF: se reconstruye **desde el PDF** con PyMuPDF (vectores en `<svg>`, texto real en `.word` con `--target-w`, orden de dibujo del PDF) y sale en el envase `.doc-paginas`. Los recortes "desde la diapositiva" no sirven como figuras (llevan las etiquetas quemadas): se extraen limpias del PDF. Publicado en Inmunología H1/H2.

---

## Antes de tocar el visor de resúmenes — 4 cosas que se rompen en silencio

1. Un cambio en `HtmlFullscreenModal.tsx`/`resumenHtml.module.css` toca **todos** los envases a la vez (Notion, «layers», «pdf-page», flujo, páginas, hojas) — pensarlo contra cada uno.
2. La tinta se audita **sin navegador**: parseando cajas del fragmento (bucket `resumenes`) contra bbox del SVG (bucket público `resumenes-img`) se ve qué tinta cae sobre qué figura y con qué opacidad.
3. Cualquier `useState` nuevo en el modal multiplica re-renders del HTML inyectado — comprobar que `dangerouslySetInnerHTML` sigue recibiendo la misma referencia.
4. El vocabulario de clases es compartido entre envases y está lleno de nombres genéricos (`.figure`, `.page`, `.callout`) — acotar siempre con `:where(...)` o el selector del envase, nunca dejarlo colgado de `.sheet` a secas.

---

## Actividades sin material propio (invitación a colaborar)

Componente **`src/components/SinMaterialSection.tsx`** — sustituye las 3 tarjetas de `StudyMaterialSection` cuando una actividad no tendrá material propio en el corto plazo (talleres científicos de Química Orgánica). Invita a colaborar: mascota + logos Gmail/Instagram como único CTA, sin panel ni tarjeta.

**Para activarlo**: `sinMaterial: true` en el `Actividad` del curso, y en su `[id]/page.tsx` renderizar `act.sinMaterial ? <SinMaterialSection /> : <StudyMaterialSection ... />`. No hay punto único compartido entre cursos — hay que repetir el `if` en cada uno.

---

## Sistema de Avance y Aportes (`dashboard/aportes`, admin + socias)

Panel que mide cuánto material real hay publicado por curso, **leyendo los sílabos en cada carga**, no un conteo mantenido a mano — base del reparto entre socios y de la prioridad de lanzamiento.

**Acceso**: `canVerAportes()` en `src/lib/admin.ts` = `isAdminEmail OR` el `Set` `EMAILS_COLABORADORES` (derivado de `COLABORADORES`). Esas socias ven «Aportes» en la sidebar y el panel, pero **no** `dashboard/admin` ni `dashboard/modelado`, y no heredan el `allAccess` del admin. `dashboard/layout.tsx` calcula `verAportes` aparte de `isAdmin`.

**Fuente de verdad — `src/lib/material-plan.ts`**: modela qué tiene y qué le falta a una actividad sin reimplementar en el panel las reglas que cada `[id]/page.tsx` ya aplica. Cada actividad produce un `PlanActividad` con 3 slots (`apoyo`/`banqueo`/`resumen`), cada uno con `estado`: `listo` | `falta` | `no-aplica` | `futuro`. El objeto `REGLAS` (por `slug` de curso) es el espejo de qué tipos usan Simulación en vez de Video, cuáles esconden Banqueo, y el `banqueoLabelDe`. Al añadir una regla nueva en un curso hay que reflejarla aquí o el panel muestra un hueco falso.

**El sílabo solo dice si el material está o no está** — la cobertura no distingue quién lo subió ni cómo llegó; eso lo declara cada persona marcando su círculo (ver «Quién subió qué»).

**Evaluaciones sí exigen banqueo** (`TIPOS_EXAMEN`: EXAMEN, EXAM-PARC, EXAM-FINAL, EXAM-ANAT, PC, PASO…): no piden material escrito, pero su banqueo cuenta como hueco si falta. `TIPOS_ENTREGA` (ENTREGABLE, PRODUCTO) es lo contrario: ninguna tarjeta aplica. Un tipo nuevo hay que meterlo en uno de los dos sets.

**Prioridad de lanzamiento** — `PRIORIDAD_LANZAMIENTO` en `src/lib/data/aportes.ts`: los 7 cursos que bloquean el lanzamiento (Física, Química Orgánica, Biología Celular, Hematología, Aparato Locomotor, Inmunología, Digestivo), en orden.

**`src/lib/aportes-stats.ts`**: `getTrackStats()` (cobertura por tramo, todos los cursos), `getLanzamiento()` (los 7 prioritarios, con `pendientes`), `getAportes()` (crédito por persona). `SlotStats.cobertura` se calcula solo sobre `listo + falta` (lo `no-aplica` sale del denominador). Además de `resumen`/`banqueo`, cada curso/tramo lleva `examenes: SlotStats` (solo evaluaciones).

**Quién arma el banqueo** — `BANQUEO_ARMADO_DE` en `aportes.ts`, por `slug`: default `bust`, excepción `fisica-medicina: 'ufbi-1'`. No aplica a evaluaciones (se sabe solo si se marca). Cualquier marca manda sobre este default.

**`AportesPanel.tsx`**: hero con los 7 prioritarios primero. **El banqueo es la métrica protagonista** (barra verde + % grande; escrito debajo con acento del tramo; video no se mide). KPIs: exámenes sin banqueo, clases sin banqueo, sin material escrito, cursos completos. Cada curso es `<details>` con pendientes agrupados en 3 grados (rojo exámenes / naranja escrito / ámbar clases). Debajo, cobertura completa del resto de cursos.

**Registro de personas** — `src/lib/data/aportes.ts`: `COLABORADORES` (nombre, rol, color único, `email?`) y `CURSOS` (slug, track, `materialDe`). El color es identidad visual; el correo permite marcar aportes propios (`colaboradorDeEmail`). El banqueo y los labs nunca se declaran a mano ahí: se cuentan directo de los sílabos/`LABORATORIOS`.

**Quién subió qué — marcas de autoría** (`src/components/RegistroAportes.tsx`): cada persona pinta el círculo del material que subió, **solo lo publicado** (`estado === 'listo'`). Granularidad por actividad × slot (cursos) o por pieza (labs/histología, `slot: 'material'`). Selector en dos columnas (UFBI/Facultad), orden por `PRIORIDAD_LANZAMIENTO`.

**Armado vs. recolectado** (`OrigenMarca`, columna `origen`): en el slot `banqueo` el popover pregunta *Lo armé* / *Lo conseguí*; círculo con aro ámbar si es recolectado (nunca en el relleno, que es la identidad de la persona). **Co-autoría**: varias marcas sobre el mismo slot se reparten en sectores (`conic-gradient`); cada firmante lleva su propio `origen`. **Precedencia**: lo marcado manda sobre el reparto declarado en `aportes.ts`.

**Permisos**: cada uno marca/desmarca lo suyo; el admin corrige cualquier marca. Se comprueba en `/api/aportes/marcas`, no en RLS. **Persistencia**: tabla `aportes_marcas` (única por `ambito+scope_id+item_id+slot+colaborador`, columna `origen` con CHECK), **RLS activo y sin políticas** — todo pasa por `src/lib/aportes-marcas-server.ts` con service role key.

---

## Flujo de autenticación

1. Login en `/auth/login` → Supabase Auth
2. `dashboard/layout.tsx` (RSC) verifica sesión, plan y dispositivo
3. Redirecciones: `/auth/clear-device` (sesión revocada) o `/auth/device-limit` (límite de dispositivos)
4. El plan se inyecta via `PlanProvider` a todo el árbol del dashboard

---

## Sistema de Investigación (juego gamificado de 14 niveles)

Sección `dashboard/investigacion`: mapa serpenteante (estilo Duolingo) donde cada nodo es la plataforma "punto de guardado" (`SavePointNode`). 14 niveles = 14 temas del curso; se desbloquean en orden.

**Motor** en `src/lib/investigacion/`: `types.ts` (tipos, unión discriminada `MinijuegoConfig`), `progress.ts` (localStorage `medgo-investigacion-progress`, `reconcile()` rellena niveles nuevos en estados viejos), `xp.ts` (XP por evento + `COLOR_BANDA`), `badges.ts` (6 insignias), `niveles/index.ts` (`NIVELES` + `CONTENIDO`, un `tema-NN.ts` por tema).

**Hooks**: `useInvestigacionProgress`, `useDragDrop` (Pointer Events + tap). **UI** en `src/components/investigacion/`: `NivelMap`+`SavePointNode`, `NivelRunner` (orquesta `intro → bloque1 → MJ-A → bloque2 → MJ-B → bloqueFinal → boss → completado`), `minijuegos/` (7 tipos data-driven + `BossChallenge`).

**Diseño**: liquid-glass (degradados + `backdrop-filter`) en HUD/chips/tarjetas. Minijuegos autocontenidos (`AUTOCONTENIDOS`: `orden`/`drag`/`vf`/`quiz`/`caso`/`mapa`) se renderizan directo con `onNext`, sin el `retoPanel` oscuro. Los arrastrables usan `<div role="button">` (no `<button>`, interfiere con el gesto); en `useDragDrop`, `onDrop`/`disabled` van en refs para que el hook sea estable entre renders.

**BossChallenge**: marco HUD sci-fi (`<BossMarco/>`, SVG con viewBox recortado al bounding box real), opciones en octógono, HUD teñido de rojo, fondo volcánico con crossfade.

**Íconos**: sin emojis, registro SVG en `Icono.tsx` (`ICONOS`). Reutilizar siempre SVG/assets ya existentes o referencias exactas del usuario, nunca aproximaciones.

**Fuente en botones custom**: no heredan `font-family` del body por defecto — todo `<button>` necesita `font-family: inherit` explícito.

**Para crear un nivel nuevo**: `src/lib/investigacion/niveles/tema-NN.ts` (mismo shape que `tema-01.ts`), registrar en `CONTENIDO`, `disponible: true` en `NIVELES`. No se toca el motor.

---

## Laboratorio virtual de Física (las 14 clases de `fisica-medicina`)

Tarjeta «Simulación» → `/cursos/fisica-medicina/modulo/{id}`. El sílabo solo declara `modulo: true`; **qué se abre lo decide `src/lib/data/fisica-modulos/index.ts`**: si la clase tiene `ModuloTeoria` manda ése (recorrido guiado, no se puede saltar a la simulación); si solo tiene `LaboratorioClase` se abre el menú de temas (`LabRunner`, sin orden).

**`LabShell`**: escena a la izquierda, panel de fórmulas a la derecha, mando (play/pausa/reinicio/velocidad/perillas) abajo. El reloj vive en `useSimCanvas` (compartido por las 18 sims); escenas de estado estable (térmico, palanca, Coulomb, lente) no llevan reloj. El panel mezcla `magnitudes` (estado React) con `vivoRef` (instantáneas por frame, leídas a ~11 Hz para no re-renderizar el árbol). El resaltado ata el mando con la fórmula (2,6 s de vida).

**Catálogo de fórmulas** (`sims/formulas.ts` + `formulas-clases.ts`): cada sim tiene `CatalogoLab` con plantillas de hueco (`'T = 2π · √( {m} / {k} )'`), pintadas con símbolos y con números desde la misma fuente. Dos reglas duras: **cada plantilla es exactamente la que la escena resuelve** (constantes incluidas — un desajuste se delata solo), y **todo en SI dentro de la plantilla** aunque el mando muestre cm/mm/mmHg.

**18 escenas**: `resorte`/`pendulo`/`ondas`/`sonido` (C6), `termico` (C7), `plano` (C1), `colision` (C2), `torque`/`rotacional` (C3), `palanca` (C4), `fluidos` (C5), `gas` (C8), `coulomb` (C9), `capacitor` (C10), `circuito` (C11), `magnetico` (C12), `lente` (C13), `fotoelectrico` (C14). `CATALOGO` y `REGISTRO` (`sims/index.tsx`) son dos `Record<SimId,…>`: falta uno y no compila.

**Encuadre automático + arrastre** (patrón usado en `lente` y `torque`): la escala fija se rompe en casos límite (imagen al infinito, barra que se inclina) — el encuadre se resuelve horizontal→vertical, lo que no cabe se **rotula, no se encoge**, y **el arrastre mapea puntero→magnitud con la escala CONGELADA al empezar el gesto** (nunca con la del frame en curso, o se realimenta solo). El mando se acota por lo físicamente posible, no por lo que la fórmula admite (rangos declarados por escena, compartidos por arrastre y presets). Se verifica **sin navegador**: barrido en Node del espacio de perillas contra varias comprobaciones geométricas — detalle específico de C3/lente en memoria (`project_fisica_sim_torque.md`, `project_fisica_sim_encuadre.md`).

**Una excepción en `draw` dejaba el canvas en blanco para siempre** — ahora va en `try/catch` (repone la transformación del DPR, se detiene tras 60 frames fallando seguidos).

**El panel de Aportes cuenta Física por `moduloEn`**, no por `simulacion.href` — es el único curso cuyo material interactivo es un runner con ruta propia derivada del id.

---

## Simulación del frotis sanguíneo (Hematología · Práctica 1)

Único módulo del proyecto que **no es React**: HTML autocontenido con Three.js (importmap CDN) en `public/simulaciones/frotis-sanguineo.html`, embebido vía `FrotisSimFrame.tsx` (client component), estilos en `frotisSim.module.css`.

**Modo «flow»**: el documento del iframe crece con su contenido real; un `ResizeObserver` reporta altura por `postMessage` y el dashboard redimensiona el iframe (scroll en la página, no dentro del panel). Navegación Anterior/Siguiente vive en el dashboard (`.navBar` sticky), no en el `<footer>` del iframe — protocolo `postMessage` bidireccional (`nav`/`sync`/`prev`/`next`).

7 pasos: portada → extendido (ángulo) → zonas (raycast) → tinción de Wright (cuestionario) → morfología eritrocitaria (microfotografías reales, sin 3D) → plaquetas (recuento) → cierre (repaso + mini-quiz, sin 3D).

**Un solo `WebGLRenderer` compartido**: el canvas se reubica en el `.stage` del paso activo; `sincronizarEscena()` detiene el bucle si el paso actual no está realmente visible.

**Cuestionarios — regla dura**: la correcta no puede caer como la más larga en más de 1 de cada 10 preguntas (ni la más corta sistemáticamente) — medir con un script que decodifique HTML, no el markup crudo.

**Modo claro/oscuro propio**: no hereda `.dark-mode` del dashboard, lee el mismo `localStorage('medgo-dark')` con script inline + listener de `storage`.

**Tarjeta «Simulación»**: `StudyMaterialSection` acepta `simulacion?: { href?, desc? }`, sustituye la tarjeta Video por ícono beaker — solo en las prácticas LAB de Hematología (`hematologia.ts`).

---

## Vías de la coagulación (Hematología · `laboratorio/cascada-coagulacion`)

Lámina de la Clase 9 hecha lienzo. **Gratis para cualquier cuenta** (`gratis` en `LABORATORIOS`). Sin cabecera ni título a propósito.

**Datos — `src/lib/data/coagulacion.ts`**: `NODOS`, `HILOS`, `ZONAS`, `AVISOS`, `VIAS` (modo aprender). Un hilo puede llegar a otra flecha (`a: 'hilo:c-x'`), cayendo en su punto medio.

**Reparto React/bucle**: React pinta *qué* hay; un rAF escribe *dónde* (transform de cada nodo, `d` de cada `<path>`) directo en el DOM — los `<path>` no reciben `d` por props. `NodoFactor` va con `memo`; callbacks estables vía refs.

**Hilos elásticos** (`hilos.ts`): bézier cuadrática con masa-resorte en el punto de control; se comba con holgura y vibra al soltar. `prefers-reduced-motion` va directo al objetivo.

**Cámara** (`useCamara.ts`): estado en ref, aplicado como `transform` + custom properties. Sin `will-change: transform` (por precaución, sin verificar en este lienzo).

**Explorar**: arrastrar estira hilos; hover resalta la cadena aguas abajo; balizas «i» laten hasta abrirse una vez. **Aprender**: selector de 6 vías, dificultad Fichas o Escribir (`normalizar` pasa arábigos a romanos). Al tercer fallo se revela resuelto.

**Para añadir una vía**: entrada en `VIAS` con `semilla` y `pasos` (cada uno con `pista`). Comprobar en Node que cada paso tiene 3 distractores válidos y el sesgo de longitud de la ficha correcta.

---

## Simulación del microscopio virtual (Hematología · Práctica 2) — ⚠️ INCOMPLETA

**Falta terminar**: estructura e interacción construidas, pero **faltan las 2 imágenes panorámicas reales y las coordenadas de las células** que debe proveer BUST. El ocular muestra un placeholder gris mientras tanto.

HTML autocontenido en `public/simulaciones/microscopio-hematologia.html` (mismo criterio que el frotis), vía `MicroscopioHematologiaFrame.tsx`. Pan/zoom con `background-position`/`background-size` en porcentaje (no necesita las dimensiones reales en px de la imagen). Enfoque simulado a 40X/100X vía perilla manual contra un target aleatorio; a 10X siempre enfocado. Identificación: clic en ocular a 100X enfocado → coordenada relativa → célula más cercana dentro de tolerancia; panel con pestañas Identificación/Teoría o Modo Quiz (9 opciones fijas).

**Pendiente**: las 2 imágenes panorámicas reales en `public/simulaciones/microscopio-hematologia-img/` y recalibrar coordenadas `x`/`y` (0–1) de cada célula y de `idealZones10x` contra las imágenes reales.

---

## Editor de Modelado 3D (`dashboard/modelado`, solo admin)

Editor visual 3D sin código con Three.js + React Three Fiber + drei. Visible **únicamente** para `isAdminEmail` (`src/lib/admin.ts`), mismo guard que `dashboard/admin`. `ModeladoClient.tsx` carga `Editor3D.tsx` con `next/dynamic` + `ssr: false`.

**Figuras**: 6 primitivas arrastrables/clicables. Cada `Figura` tiene `redondez` + deformadores `doblar`/`torcer`/`estrechar` (orden taper→twist→bend) editables por slider, número o arrastre directo en modo "Deformar".

**Unir/Separar**: selección múltiple → reparenta a un grupo nuevo (transform vía `Matrix4.compose/decompose`). **Importar/Exportar**: `.glb`/`.gltf` propio fusionado en geometría editable; export GLB limpia UVs sin usar y suelda vértices.

**Deshacer/Rehacer**: toda mutación pasa por `mutar(fn, coalesce?)`, historial en ref (tope 60), ráfagas de la misma interacción comparten `coalesce`.

**Persistencia**: localStorage `medgo-modelado-escena`, incluye geometrías importadas en base64.

No se toca el motor para casos de uso nuevos — solo se extiende si se pide un tipo de deformación o primitiva adicional.
