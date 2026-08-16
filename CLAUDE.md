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

Acento **teal** derivado del SVG `research-svgrepo-com.svg` (path secundario original: `rgb(44, 169, 188)`):

```
--inv-teal:        #2CA9BC   /* acento principal: dot, badge, icon box */
--inv-teal-dark:   #1a8a9c   /* badge text light mode, gradiente oscuro */
--inv-emerald:     #48C9B0   /* dot color secundario */
--inv-blue:        #5E9CD3   /* dot color terciario */

Icon box:    linear-gradient(135deg, #2CA9BC 0%, #1a8a9c 100%)
             box-shadow: rgba(44, 169, 188, 0.35)
Panel borde: rgba(44, 169, 188, 0.12)
Panel header bg: rgba(44, 169, 188, 0.08)
Badge bg:    rgba(44, 169, 188, 0.15)
Hover glow:  rgba(44, 169, 188, 0.14) light / 0.10 dark
Dark hover border: rgba(44, 169, 188, 0.2)
```

Clases CSS: `.invPanel`, `.invPanelHeader`, `.invIconBox`, `.invBadge` (todas con dark mode incluido).

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
| `src/components/ExamRunner.tsx` | Examen inline (`?examen=1`). Lee del bucket privado `examenes`. Soporta N grupos independientes vía `groupKeys?: string[]` — selector cuadros A/B/C… en esquina superior derecha, carga diferida por grupo, puntuación independiente |
| `src/components/AnatExam.tsx` | Motor compartido de los EVAs de anatomía (EVA 2/3, futuro EVA 1). Examen interactivo A→B; ver sección **Sistema de EVAs** |
| `src/components/PdfFullscreenModal.tsx` | Viewer PDF fullscreen con zoom. Usa signed URLs + sessionStorage cache |
| `src/components/PlanProvider.tsx` | Context con `plan`, `isActive`, `expiresAt`. Consumido con `usePlan()` |
| `src/components/AuthProvider.tsx` | Singleton del cliente Supabase, compartido para evitar múltiples instancias |
| `src/components/LockedContent.tsx` | Paywall reutilizable para contenido premium |
| `src/components/AportesPanel.tsx` | Panel de avance y aportes (`dashboard/aportes`). Lee `src/lib/aportes-stats.ts` y `src/lib/material-plan.ts`; ver sección **Sistema de Avance y Aportes** |

---

## Sistema de planes y paywall

Definido en `src/lib/plans.ts`. Los planes se agrupan en **dos tramos** (`Track`), que se cursan en facultades distintas y **no son niveles de un mismo escalafón**:

| Plan | Precio | Tramo | Desbloquea |
|---|---|---|---|
| `free` | — | — | acceso básico |
| `ufbi` | S/ 20/mes | `basico` | los 6 cursos del ciclo básico (1.er año, UFBI) |
| `interno` | S/ 14/mes | `medicina` | los cursos de la Facultad de Medicina (2.º-7.º año) |
| `residente` | S/ 142.80/año | `medicina` | ídem + extras |

**Regla crítica de acceso**: usar `planUnlocks(plan, required)`, **nunca** comparar `planRank()` a secas. Un plan de un tramo jamás abre cursos del otro; `planRank` solo ordena *dentro* de un mismo tramo (residente ≥ interno). Cada `[id]/page.tsx` de curso declara su tramo vía `requiredPlan` en `<LockedContent>` (`"ufbi"` en los 6 del ciclo básico, `"interno"` en el resto).

El admin lleva `allAccess: true` en `PlanState` (`getUserPlanState`) — sin ese flag su plan `residente` pertenece al tramo `medicina` y le bloquearía los cursos de UFBI.

El plan del usuario vive en `profiles.plan` + `profiles.plan_expires_at` en Supabase (ambas tablas tienen CHECK constraints que hay que ampliar al añadir un plan nuevo). Para verificar plan en servidor usar `getCachedPlanState()` de `src/lib/plans-server.ts`.

**Landing (`Pricing.tsx`)**: switch estilo interruptor día/noche que alterna entre tramos; cada uno muestra solo sus tarjetas, para que el alumno nunca compare S/20 (6 cursos) contra S/14 (11 cursos) lado a lado. El acento (`--acc`, triplete RGB heredado desde `.grid[data-track]`) tiñe tarjetas, checks, botón y el brillo pulsante de la tarjeta destacada: azul `#3b9edd` en UFBI, violeta `#8b5cf6` en Medicina.

**⚠️ Pendiente para que el plan UFBI funcione de verdad**:
1. Crear el plan de **S/ 20/mes** en el panel de Mercado Pago y poner su ID en `MP_PLAN_UFBI_ID` (`.env.local` + Vercel). Sin esa variable `getPlan('ufbi')` devuelve `null` y el checkout responde `invalid plan`.
2. Decidir si `ufbi` lleva el **compromiso mínimo de 3 meses** que hoy solo aplica a `interno` (lock en `api/subscriptions/cancel/route.ts` + aviso en `SubscriptionPanel.tsx`). Ahora mismo UFBI se puede cancelar cuando sea.

---

## Patrones de datos

**Sílabos de cursos**: archivos en `src/lib/data/[curso].ts`. Cada clase tiene `id`, `titulo`, `hasResumen`, `examen?` (con `key` para el bucket, `free?` para bypass paywall, y `groups?: string[]` para grupos adicionales B/C/… del selector N-grupos).

**ExamenRef con N grupos**:
```ts
examen: { key: 'neurologia/snc-histologia', free: true, groups: ['neurologia/snc-histologia-a3', 'neurologia/snc-histologia-c'] }
```
La prop `groupKeys={act.examen.groups}` pasa a `<ExamRunner>`. Cada clave en `groups` referencia un JSON independiente en el bucket `examenes` y debe estar registrada en el whitelist `EXAMENES` de `src/app/api/examen/[...examKey]/route.ts`.

**Imágenes de exámenes**: bucket **público** `examenes-img` (no firmadas). Path `<curso>/<grupo>/<archivo>.webp`. Se embeben con URL completa en el JSON, renderizadas con `next/image` + `sizes="(max-width: 600px) 100vw, 560px"`. Conversión con `sharp` (máx 1200px, q82) antes de subir.

**Imágenes**: `next/image` con formato AVIF, prop `sizes` responsivo. Bucket público `histologia`, `micologia`. Bucket privado `examenes`.

**Signed URLs**: se generan en server con `src/lib/supabase/storage.ts` y se cachean en `sessionStorage` por 1 hora.

---

## Reglas de íconos en la sidebar

Los íconos del array `NAV` en `DashboardSidebar.tsx` usan SVG inline con:
- `width="20" height="20"`
- `fill="currentColor"` para íconos rellenos
- `stroke="currentColor"` + `strokeWidth` explícito en cada `<path>` (no en el `<svg>`) para íconos de trazo — esto evita transparencias acumuladas cuando el color tiene alpha

**Ícono de Cursos**: book-bookmark SVG, `stroke` declarado en cada `<path>` individualmente, `strokeWidth="2.3"`, `strokeLinecap="round"`.

---

## Reglas de CSS de la sidebar (`src/styles/dashboardSidebar.module.css`)

- Estado inactivo: `color: #f0eeff` (sólido) + `opacity: 0.65` en `.navIcon` y `.label`
- Hover: `opacity: 1`
- Activo: `opacity: 1` + `.navIcon { color: #3b9edd }`
- La sidebar siempre es oscura (fondo `#1a2557`), independiente del dark mode del panel

---

## StudyMaterialSection — tarjetas del sílabo

Tres tarjetas en orden, cada una con varias formas posibles de estar "activa":

1. **Video** / **Simulación** (prop `simulacion`, ver sección de labs) — sin ninguna de las dos,
   locked/próximamente. Ícono videoresumen o beaker según corresponda.
2. **Banqueo** — activa con `examen` (link a `?examen=1`, banco de preguntas del bucket
   `examenes`), `solucionario` (paso a paso de Química Orgánica) o `propuestosPdf` (PDF de
   práctica — abre el mismo `PdfFullscreenModal` que Resumen pero con un id de bucket
   independiente, `{claseId}-prop`; no es un banco interactivo). Ese orden es la precedencia: con
   `propuestosPdf` **no** se ve el solucionario, así que no se ponen los dos en la misma actividad.
   `propuestosPdf` se usa hoy para los problemas propuestos de Física y para las PC de años
   anteriores de Química Orgánica (con `opciones`, el clic abre un picker en vez del PDF directo).
   El título de la tarjeta se sobreescribe con `banqueoLabel` («Propuestos» en las clases teóricas
   de Física, ver `banqueoLabelDe` en `material-plan.ts`). `hideBanqueo` la omite del todo cuando
   la actividad nunca va a tenerla (labs de Hematología/Inmunología).
3. **Resumen** — activa con `hasResumen`, abre `PdfFullscreenModal`. Siempre se llama «Resumen»:
   el label «Database» de Química Orgánica se retiró, y su contenido de PC pasó a Banqueo.

Todos los íconos usan `fill="currentColor"` para adaptarse a light/dark.

---

## Sistema de EVAs (exámenes interactivos de anatomía)

Motor compartido en **`src/components/AnatExam.tsx`** (Client Component). Cada EVA es un wrapper delgado; toda la lógica (flujo, shuffle, precarga, overlays, persistencia, matching) es común. Estilos compartidos en `src/styles/eva2.module.css`.

**Flujo por pregunta**: A = nombrar la estructura señalada → al acertar desbloquea B (detalle clínico/funcional evaluado por conceptos clave). Si A falla, se muestra B ya resuelta.

**Props de `<AnatExam>`**: `{ questions, kicker, title, examId }`. `examId` (p. ej. `"eva-3"`) da persistencia automática del progreso en `localStorage` (clave única `medgo-eva-progress-<examId>`, se sobrescribe sin acumular).

**Tipo `Question`** (en AnatExam, re-exportado por cada `questions.ts`): `id`, `region` (badge, **no debe revelar la respuesta**), `image?`, `imageOverlay?` + `overlayTrigger?: 'solved'|'bChecked'` + `overlayHideBase?`, `imageAlt?` (toggle crossfade), `imageDarkBg?`, `imageCaption?`, `imageCaptionList?`, `imageCitation?` (visible solo tras responder A), `promptA`, `answerA`, `promptB`, `conceptsB` (con `accept`/`acceptAll`), `needB?`, `modelB`.

**Imágenes**: bucket público `examenes-img`, path `neurologia/eva<N>/`. Precarga de las próximas 4 preguntas (mismo `sizes` que el render real para compartir caché `/_next/image`). Shuffle pseudoaleatorio que nunca repite `region` consecutiva.

**Para crear un EVA nuevo (p. ej. EVA 1)**: copiar carpeta `eva-3/` (page + ExamN wrapper + questions.ts), setear `examId`, y añadir tarjeta en `LAB_TOPICS` (tema Neurología) de `laboratorio/page.tsx`. No se toca el motor.

---

## Solucionarios paso a paso (tarjeta «Banqueo» de las prácticas dirigidas)

Motor en **`src/components/SolucionarioRunner.tsx`** + `src/styles/solucionario.module.css`.
Contenido data-driven en `src/lib/data/solucionarios/` (`types.ts`, `tema.ts` por práctica,
registro en `index.ts`). Hechos: `qor-pd-1` … `qor-pd-8` — las **8** prácticas dirigidas de
Química Orgánica, completas.

Cada paso lleva `n` (número de pregunta en el PDF) y, opcionalmente, `parte` — un chip extra en la
cabecera para las prácticas divididas en secciones que reinician la numeración (PD08: tres partes,
tres «Pregunta 1»). Sin ese campo esos pasos serían indistinguibles entre sí.

**Por qué existe**: las respuestas de una PD referencian dibujos del enunciado («el lóbulo
blanco que sobresale», «el óvalo central entre los carbonos»). Leídas sueltas no se entienden,
así que el runner **muestra el PDF del enunciado y la explicación en simultáneo**.

**Layout**: capa fija a pantalla completa (portal a `<body>` + clase `pdf-fullscreen-active`,
que oculta la sidebar — mismo mecanismo que `PdfFullscreenModal`). Split de dos columnas:
enunciado en PDF a la izquierda (con su propio zoom, `PdfViewer` reutilizado) y **un solo paso
a la vez** a la derecha. Bajo 900px el split colapsa y aparecen pestañas Enunciado/Solución.

- El paso se centra con **`margin: auto`** dentro de un flex scrollable, no con
  `justify-content: center` — este último recorta el borde superior cuando el paso es más alto
  que el panel.
- Entrada animada: el `<article>` lleva `key={indice}`, así remonta y su animación se repite en
  cada avance; la dirección (`data-dir`) decide si entra desde la derecha o la izquierda. Los
  bloques internos escalonan con `--i` + `animation-delay`. Respeta `prefers-reduced-motion`.
- Navegación: flecha anterior / puntos clicables / flecha siguiente (el último paso la cambia
  por «Terminar»), más `←`/`→` y `Esc` por teclado.

**Vocabulario de bloques** — cada uno tiene forma propia según lo que contiene; antes de añadir
uno nuevo, comprobar si alguno ya calza:

| Bloque | Para qué |
|---|---|
| `parrafo` | razonamiento corrido, prosa real; con `titulo` cuando es un apartado (a, b, c…) cuyos hermanos sí son bloques con forma |
| `mapeo` | «esta marca del dibujo (A, B, C…) ↔ este comentario del enunciado» |
| `datos` | apartados etiquetados (a, b, c…) con su cifra o veredicto |
| `contraste` | repartir elementos en dos grupos opuestos (enlazantes vs. no enlazantes, nucleófilos vs. electrófilos, SN1 vs. SN2) — cada lado toma un tono distinto (`--s-acc` / `--s-tono-b`), nunca dos tarjetas iguales |
| `tabla` | varias especies comparadas sobre los mismos criterios; scrollea dentro de su caja |
| `opciones` | alternativas a)–e) o (i)–(v); `esRespuesta` destaca la pedida y `veredicto` la rotula. El color sale del texto del veredicto: verde si empieza por Cier/Verdad/Correct/Sí, rojo por Fals/No/Incorrect, **gris** en cualquier otro caso (p. ej. «Descartada» — una opción que no es falsa pero tampoco responde). En preguntas del tipo «señale la FALSA», `esRespuesta` marca la que es químicamente incorrecta: eso lo aclara el veredicto |
| `esquema` | un diagrama que el enunciado **no** trae (mecanismo, estado de transición) |
| `clave` | la respuesta final, en degradado y con check |
| `nota` | el porqué que conviene recordar más allá del ejercicio |

**Bloque `esquema`**: los diagramas se dibujan **inline** en `src/components/SolucionarioEsquema.tsx`
(registro `ESQUEMAS`, tipado por `EsquemaId` de `types.ts` — añadir una clave obliga a
implementarla), nunca como archivo `.svg` servido aparte. El motivo es el tema: los colores salen
de variables CSS del módulo (`--e-nu-*`, `--e-c-*`, `--e-lg-*`, `--e-cat-*` en `.esquema`), así el
mismo dibujo funciona en claro y oscuro. Al transcribir un SVG de referencia se conservan
`viewBox`, coordenadas, radios y rótulos tal cual, y solo se sustituyen los `style=` inline con
colores fijos; los ids internos (markers, gradientes) van prefijados (`sol-esq-*`) para no
colisionar. Hecho: `'sn1-sn2'` (estados de transición, usado en PD07).

**Regla de redacción (la que faltó la primera vez)**: si un apartado de una pregunta usa `datos`,
sus apartados hermanos **no pueden caer en `parrafo`** — el que queda en prosa parece un añadido
y rompe el ritmo visual. Se le da forma propia y su `etiqueta` (`'d)'`) para que la serie
a) b) c) d) se lea alineada; `contraste` nació exactamente de ese arreglo en la pregunta 2 de PD01.

**Para añadir un solucionario nuevo**: crear `src/lib/data/solucionarios/<id>.ts` con el mismo
shape, registrarlo en `SOLUCIONARIOS` de `index.ts` y asegurarse de que su `pdfId` esté en
`ALLOWED`/`FILE_ALIAS`. La página del curso ya resuelve `findSolucionario(act.id)` y pasa
`solucionario` a `StudyMaterialSection`, que convierte la tarjeta Banqueo en el acceso
(`?solucionario=1`). No se toca el motor.

---

## Resúmenes en HTML (material muy visual) — skill `/addresumenhtml`

Segundo envase para la tarjeta «Resumen», junto al PDF. Para apuntes propios muy visuales (una
página de Notion con decenas de figuras) el PDF es el peor formato: pesa decenas de MB, el texto
va incrustado y no reflowea en móvil. El mismo contenido como **fragmento HTML** son ~100 KB,
conserva el texto real (seleccionable, buscable, nítido a cualquier zoom) y sirve las figuras en
AVIF desde el CDN público (−92 % frente a PNG).

**Piezas**: `scripts/upload-resumen-html.mjs` (convierte a AVIF, sube y transforma el export de
Notion) · `src/app/api/resumen-html/[claseId]/route.ts` (sirve el fragmento con **ETag**, con su
propio `ALLOWED`/`FILE_ALIAS`, separado del de PDF) · `HtmlFullscreenModal.tsx` (visor) ·
`resumenHtml.module.css` · `DarkModeContext.tsx`.

**Almacenamiento**: el fragmento va al bucket privado `resumenes` (junto a los PDFs, que ahora
acepta `text/html`); las imágenes al bucket **público** `resumenes-img/<curso>/<slug>/`, con
`immutable` — ahí está el peso y no tiene sentido firmar 81 URLs.

**Activación**: `resumen: { tipo: 'pdf', formato: 'html', opciones: [{ id, label, formato: 'html' }] }`
en el sílabo, y la página del curso pasa `resumenFormato` + `resumenTitulo` a
`StudyMaterialSection`. `formato` vive **por opción** además de por tarjeta, para que un picker
pueda mezclar un HTML nuevo con PDFs de clases anteriores.

**Reglas que no son obvias** (todas costaron una iteración; el detalle está en la skill):
- Un export de **pdf2htmlEX no sirve**: es el PDF rasterizado en una sola imagen gigante con
  texto invisible encima — peor que el PDF. Hace falta el original de Notion. El script aborta solo.
- El ancho de cada figura pasa de `width:NNNpx` a `--w`, y el CSS hace
  `width: calc(var(--w) * var(--s))`: si no, el control de tamaño mueve sólo la letra y en un
  documento de figuras **parece que el zoom está roto**.
- El HTML se inyecta con `dangerouslySetInnerHTML`, así que las clases de Notion **no** pasan por
  el hash de CSS Modules: todo selector va `.sheet :global(.x)`, anidado para no escaparse.
- Notion emite `<p><div>…</div></p>` (inválido): el navegador lo parte y deja párrafos vacíos.
  Lo tapa `p:empty { display: none }`.
- **La cáscara del visor es oscura en ambos temas** (igual que el de PDF): en claro la hoja es
  blanca y sobre fondo claro se perdía. Lo único que reacciona al tema es `.sheet` — no añadir
  variantes `body.dark-mode` a la barra.
- El botón de tema del visor usa `useDarkMode()` y comparte el estado de `DashboardWrapper`;
  duplicar ahí el `classList.toggle` desincronizaría el ícono de la sidebar.
- Caché por **ETag, nunca `max-age` largo**: el resumen se reedita sin cambiar de path.
- `cacheControl` sólo se aplica vía `supabase-js`; por REST crudo el header se ignora y el objeto
  queda en `no-cache`.
- Si junto a un `.png` referenciado por el HTML ya existe un `.avif` con el mismo nombre base
  (convertido a mano, p. ej. con imgto.xyz), el script lo sube **tal cual, sin pasar por sharp**:
  recomprimir un AVIF ya lossy sería una segunda pérdida de calidad.

---

## PDF reconstruido en capas — skill `/addresumencapas`

Tercer envase de la tarjeta «Resumen». Son exports que rehacen un PDF como tres capas absolutas
sobre una página de tamaño fijo:
`.image-layer` (z1, `<figure>` con las coordenadas del PDF) · `.text-layer` (z2, un `<span>` por
fragmento) · `.ink-layer` (z3, **una** imagen a página completa con las anotaciones manuscritas),
más un `<script>` que escala la página al contenedor.

**No confundirlo con el HTML de Notion.** Aunque el envase es HTML, esto es un PDF pintado con
`<div>`: el texto va en posición absoluta, así que **no reflowea**; en móvil la página de ~1500 px
se escala a ~0.25× y la letra de 16 px se ve a 4 px. Los botones A−/A+ del visor no hacen nada
(cada span lleva su tamaño inline). Conserva sólo dos ventajas sobre el PDF: texto seleccionable
y ~600 KB en vez de varios MB. Ante uno de estos, **preguntar antes de adaptarlo**: conseguir el
original (→ `/addresumenhtml`) o publicarlo como PDF (→ `/addresume`) suele ser mejor.

**Auditor: `scripts/audit-resumen-capas.mjs`** (`--dir <carpeta> [--fix]`). No sube nada y no toca
el original; con `--fix` deja un `preview.html` corregido al lado. Caza los cuatro fallos que este
formato rompe en silencio:

- **Extensiones sin reescribir** — convertir `assets/*` a AVIF por fuera no toca el HTML, que
  sigue pidiendo `.webp`: el documento carga con **cero imágenes**. El `image-map.txt` que
  acompaña al export arrastra el mismo error y **no se usa** (sus coordenadas ya están inline).
- **Figuras deformadas** — la caja lleva el `width`/`height` del PDF y la `<img>` va con
  `object-fit:fill`; si el AVIF trae otro encuadre, estira sin avisar. **Se corrige por el ancho,
  nunca por el alto**: subir el alto empuja la figura contra el texto de abajo, que está en
  coordenada fija.
- **El resaltador tapa el texto** — se ve como una banda amarilla sin letras y parece texto no
  extraído, pero el texto está ahí: el conversor saca el resaltado como píxeles **opacos**
  (`rgba(255,255,153,255)`) en una capa por encima del texto. **No es culpa del AVIF**, que
  conserva el alpha bien. Se arregla con `mix-blend-mode: multiply` en `.ink-layer` — nunca
  bajándola a `z-index:0`, o las anotaciones sobre las figuras quedarían debajo de ellas.
- **Franjas vacías** — una franja sin texto no es contenido perdido si hay tinta encima: en este
  formato hay **esquemas completos que sólo viven en `ink.avif`**. Recortar esa franja de la capa
  de tinta antes de darla por perdida. Si la tinta lleva contenido, es material de estudio y no se
  puede recomprimir a la ligera.

**Publicación: `scripts/upload-resumen-capas.mjs`** (`--dir --curso --id --slug [--dry] [--force]`).
Existe aparte porque `upload-resumen-html.mjs` busca el `<div class="page-body">` de Notion y
aborta con este formato. Aplica las correcciones del auditor —son idempotentes, así que no depende
de que alguien lo haya corrido antes—, sube `assets/*` **tal cual** a `resumenes-img` (ya son AVIF:
recomprimirlos sería una segunda pérdida) y reduce el documento a un fragmento
`<div class="capas" style="--page-w/--page-h">` con las tres capas, que va a `resumenes`.

Del documento original se descartan dos cosas y **ambas se reemplazan en el proyecto**:
- el `<style>`, con reglas globales (`html, body, *`) que habrían pisado el visor entero → las
  reglas de las tres capas viven en `resumenHtml.module.css` bajo `.sheet :global(…)`, con la
  hoja en **blanco en los dos temas** (las figuras vienen recortadas sobre blanco y `multiply`
  sobre fondo oscuro desaparecería: es papel, no interfaz);
- el `<script>` del `fit()`, que **no se ejecuta** al inyectarse con `dangerouslySetInnerHTML` →
  el escalado lo hace `HtmlFullscreenModal` con un `ResizeObserver`, multiplicando el ajuste al
  contenedor por `SIZES[sizeIndex]`, de modo que **A−/A+ funcionan como zoom real** (este formato
  no reflowea, así que cambiar el cuerpo de letra no haría nada) y el desbordamiento lo absorbe el
  `overflow:auto` de `.page-shell`. El envase se detecta sobre el string (`html.includes('class="capas"')`),
  no con estado: con estado el primer frame se pintaría con los estilos del otro envase. Ojo con
  el bucle `fit → resize → fit`: ajustar la altura del shell vuelve a disparar el observer, y lo
  corta una guarda de «mismo ancho que la última vez».

**Dos variantes del mismo conversor.** Comparten la idea —página de tamaño fijo, capas absolutas,
texto real— pero no el vocabulario, así que el auditor y el uploader detectan cuál es antes de
tocar nada (`VARIANTE`) y sólo cambian de dónde leen las medidas y dónde vive el resaltador:

| | A · «layers» | B · «pdf-page» |
|---|---|---|
| página | `.page` | `.pdf-page` (el uploader le añade `.page`, que es por donde el visor la escala) |
| unidades | px | **pt** |
| figuras | `<figure data-image>` + `<img>` dentro | `<img class="pdf-image">` con la caja inline |
| texto | spans dentro de `.text-layer` | `.pdf-text` sueltos + `.raster-text-rebuilt` (texto que estaba rasterizado *dentro* de una figura, reconstruido encima de ella) |
| tinta | raster AVIF | **SVG** — nítida a cualquier zoom |
| resaltador | quemado dentro de la tinta como píxeles opacos | **SVG aparte** (`marks-bg`) |

B es mejor documento y cambia dos cosas de las reglas de arriba:
- **Regla del resaltado, válida para las dos variantes**: el conversor lo saca siempre como color
  **pleno y opaco** —esté quemado dentro de la tinta raster o en su propio SVG (`marks-bg`)— y
  ningún resaltado de un PDF debería serlo. Ante uno nuevo hay que comprobar que se cumple **uno
  de los dos** finales aceptables: o **el resaltado se transparenta**, o **el texto queda por
  delante de él**. Si no se cumple ninguno, el documento sale con bandas de color tapando frases.
  En B se cumplen los dos —`.vector-bg` es z1 y el texto z3— y **aun así hubo que atenuarlo**: sin
  tapar nada, un plano de amarillo puro debajo de la frase la aplasta visualmente. Lo hace el
  visor con `opacity: .45` **y** `mix-blend-mode: multiply` en `.vector-bg`, y hacen falta las
  dos: `multiply` no atenúa nada sobre papel blanco (amarillo × blanco = el mismo amarillo), y
  `opacity` sola no garantiza que una letra oscura debajo sobreviva, que es lo que `multiply` sí
  asegura. El asset **no se toca**: se sube tal cual y la atenuación vive en el CSS module.
- **La tinta opaca deja de ser un problema**: son trazos de rotulador dibujados *encima* a
  propósito, no un resaltado, así que ahí no va `multiply`.
- Las coordenadas van en **pt** pero el wrapper del fragmento declara `--page-w/--page-h` en **px**
  (×4/3): el visor hace `parseFloat` de esa custom property y la compara con `clientWidth`, que
  está en px — dejar `1245.612pt` ahí daría una escala 4/3 veces menor sin que nada avise. Los
  hijos se quedan en pt, que caen en su sitio dentro de la caja sin reescribir cientos de valores.
- Los SVG son assets como cualquier otro y van al bucket público `resumenes-img`, que hubo que
  **ampliar a `image/svg+xml`** (antes sólo avif/webp/png/jpeg). No abre ninguna vía de subida:
  `storage.objects` no tiene ni una política, así que sólo la service role key escribe ahí.

**Las figuras se comportan como las de un resumen de Notion** (referencia: Anatomía de la región
glútea, Aparato Locomotor): al pasar el cursor se elevan con sombra y vuelven solas al salir, y el
clic las amplía sobre el documento con el mismo lightbox (`lightboxZoom`, scale .96→1).

Dos cosas no son transportables tal cual desde `figure.image`:

- **Los px del hover hay que dividirlos por la escala de la página.** `translateY(-2px)` y la
  sombra se miden en pantalla, pero viven dentro de un `.page` con `transform: scale(~0.5)`: sin
  compensar se ven a la mitad, y ese es exactamente el motivo de que el efecto «no se pareciera»
  al de Locomotor. `HtmlFullscreenModal` publica la escala en cada `fit()` como `--fit` sobre
  `.page`, y el CSS hace `calc(-2px / var(--fit, 1))`. El fallback cubre el primer frame.
- **Ni borde ni `border-radius`**, a diferencia de las de Notion: estas figuras son recortes del
  propio papel y enmarcarlas las convertiría en tarjetas flotando sobre la página.

El bloque `prefers-reduced-motion` de estas figuras va **al final del archivo**: el que ya existía
está antes de la sección "en capas" y, a igualdad de especificidad, gana la última regla — desde
allí no apagaría nada.

**El lightbox es un velo, no una pantalla, y `backdrop-filter` está prohibido en él.** Iba a
`rgba(10,10,24,.9)` + `blur(6px)`, y con eso el documento no sólo dejaba de verse: **al cerrar la
figura se quedaba en blanco**. El filtro obliga al navegador a rasterizar todo lo de detrás en una
capa aparte, y un documento "en capas" es el peor candidato posible —lleva `transform: scale()` en
la página y `mix-blend-mode: multiply` en el resaltador—, así que Chrome no repintaba esa capa al
retirar el overlay: el HTML seguía en el DOM, pero sin volver a pintarse. Ahora es
`rgba(6,8,20,.7)` sin filtro, y el documento se ve atenuado por detrás. Dos refuerzos más contra
lo mismo:

- el efecto de escalado lleva `lightbox` en sus dependencias aunque no lo use: al cerrar vuelve a
  aplicar el transform sobre la página;
- bloquear el scroll y esconder la sidebar vive en un efecto **sin dependencias**, separado del
  listener de `Esc` (que sí depende de `lightbox`). Juntos, cada clic en una figura quitaba y
  reponía `pdf-fullscreen-active` en el `<body>` — un reflow del dashboard entero por imagen.

Para el **clic** conviven dos vías en `onSheetClick` porque cada envase sirve las figuras distinto:
en Notion van envueltas en `<a href="…avif">` y basta con interceptar el enlace; en «capas» son
`<img>` sueltas **con el texto absoluto por encima**, así que mirar `e.target` fallaría en cuanto
el clic cayera sobre una letra — se recorre la pila entera con `document.elementsFromPoint()` y se
toma la primera figura que aparezca. Las capas a página completa (tinta y resaltador) no casan el
selector, de modo que nunca se abren como si fueran una figura, y una selección de texto activa
cancela el clic. El **hover**, en cambio, es CSS puro: en la franja donde el texto tapa la figura
no se dispara.

Publicado con esta vía:
- `bcm-te-8` (Biología Celular, Te8 — Comunicación celular) — variante «layers».
- `bcm-ta-4` (Biología Celular, Ta4 — Estructura de la membrana) — variante «pdf-page».

---

## Actividades sin material propio (invitación a colaborar)

Componente **`src/components/SinMaterialSection.tsx`** — sustituye las 3 tarjetas de
`StudyMaterialSection` (Video/Banqueo/Resumen) cuando una actividad no tiene ni va a tener
material propio en el corto plazo, como los talleres científicos de Química Orgánica
(`qor-taller-1`, `qor-taller-2`). En vez de tres tarjetas apagadas en «Próximamente», invita a
quien sí tenga el material a aportarlo: título con el acento en **CONTÁCTANOS**, la mascota
(`public/assets/contactanos.avif`) en primer plano con una sombra elíptica difusa centrada detrás
(sin panel ni tarjeta que la encuadre), los logos de Gmail e Instagram —transcritos tal cual del
SVG oficial, ids del gradiente de Instagram prefijados `medgo-ig-*`— como único CTA (sin correo ni
usuario escritos, sólo el ícono enlazado a `mailto:` / al perfil), y el texto de invitación al
final, debajo de los logos.

**Para activarlo en una actividad**: añadir `sinMaterial: true` al `Actividad` en el archivo de
datos del curso (campo opcional en la interfaz `Actividad`) y, en el `[id]/page.tsx` del curso,
renderizar `act.sinMaterial ? <SinMaterialSection /> : <StudyMaterialSection ... />` en vez de
`StudyMaterialSection` a secas. Sólo está cableado en Química Orgánica por ahora; para otro curso
hay que repetir ese `if` en su propio `[id]/page.tsx` (no hay un punto único compartido entre
cursos).

---

## Sistema de Avance y Aportes (`dashboard/aportes`, admin + socias)

Panel que mide cuánto material real hay publicado por curso — base de la parte variable del
reparto entre socios y de la prioridad de lanzamiento — leyendo los sílabos en cada carga, no un
conteo mantenido a mano.

**Acceso**: `canVerAportes()` en `src/lib/admin.ts`, más amplio que `isAdminEmail` pero mucho más
estrecho que "todo admin ve todo" — es `isAdminEmail OR` el `Set` de correos declarados en
`COLABORADORES` (`EMAILS_COLABORADORES`, derivado del registro: el correo se escribe una sola vez,
junto al nombre y el color de la persona). Esas socias ven el enlace
«Aportes» en la sidebar y el panel, pero **no** `dashboard/admin` ni `dashboard/modelado`, y no
heredan el `allAccess` de plan del admin. `dashboard/layout.tsx` calcula `verAportes` aparte de
`isAdmin` y pasa ambos flags por separado a `DashboardWrapper`/`DashboardSidebar` — antes un único
`isAdmin` abría los tres enlaces a la vez, ahora `APORTES_ITEM` se inserta con su propio flag.

**Fuente de verdad — `src/lib/material-plan.ts`**: modela qué tiene y qué le falta a *una*
actividad, para no reimplementar en el panel las reglas que cada `[id]/page.tsx` de curso ya
aplica al montar `StudyMaterialSection`. Cada actividad produce un `PlanActividad` con 3 slots
(`apoyo`/`banqueo`/`resumen`), cada uno con un `estado`: `listo` | `falta` | `no-aplica` (la
tarjeta no se muestra, o es material que esa actividad no exige) | `futuro` (Video/Simulación —
nunca cuenta como hueco). El objeto `REGLAS` es el espejo, por `slug` de curso, de qué tipos usan
Simulación en vez de Video, cuáles esconden Banqueo, y el título alternativo de la tarjeta de
Banqueo (`banqueoLabelDe`, también usada directo por la página de curso —
`fisica-medicina/[id]/page.tsx` llama `banqueoLabelDe('fisica-medicina', act.tipo)` para no
duplicar la regla). La tarjeta de material escrito siempre se llama «Resumen»: el label
«Database» de Química Orgánica se eliminó junto con `resumenLabelDe`. El banqueo cuenta como
listo con `examen`, `qbank`, `propuestos` (PDF de práctica: propuestos en Física, PCs de años
anteriores en Química Orgánica) o un solucionario (`findSolucionario` — vive fuera del sílabo).
Al añadir una regla nueva en un curso (un `sinBanqueoEn`, un `simulacionEn`) hay que reflejarla
aquí o el panel muestra un hueco falso.

**El sílabo sólo dice si el material está o no está.** La cobertura no distingue *quién* lo subió
ni *cómo* llegó: eso no se puede deducir de ningún archivo —el mismo PDF puede ser trabajo propio o
una descarga— y deducirlo con heurísticas sale mal (el primer intento marcó como «recolectados» los
13 propuestos de Física, que María Guzmán elaboró a mano). Lo declara cada persona al marcar su
círculo; ver **armado vs. recolectado** en el registro de autoría.

**Evaluaciones: sí exigen banqueo.** `TIPOS_EXAMEN` (EXAMEN, EXAMEN-T/L/P, EXAM-PARC, EXAM-FINAL,
EXAM-ANAT, PC, PASO, PASO-CORTO, SUSTIT) marca lo que el alumno *rinde*: no se le pide material
escrito —un examen no es contenido; si lo trae igual, cuenta como listo— pero su banqueo **sí** es
un hueco cuando falta, porque los exámenes resueltos de años anteriores son justo lo que se busca
antes de un parcial o un final. El
`PlanActividad` expone `esExamen` + `examenLabel` (`etiquetaExamen`: «Examen final», «Práctica
calificada»…). `TIPOS_ENTREGA` (ENTREGABLE, PRODUCTO) es lo contrario: se entrega un trabajo, no
hay nada que banquear ni resumir, ninguna tarjeta aplica. Un tipo de evaluación nuevo en un sílabo
hay que meterlo en uno de los dos sets o quedará contado como si fuera una clase.

**Prioridad de lanzamiento** — `PRIORIDAD_LANZAMIENTO` en `src/lib/data/aportes.ts`: los 7 cursos
que bloquean el lanzamiento, en orden (Física, Química Orgánica, Biología Celular · Hematología,
Aparato Locomotor, Inmunología, Digestivo). El resto de cursos se sigue midiendo pero aparte, sin
bloquear la lectura del panel.

**`src/lib/aportes-stats.ts`**: agrega `PlanActividad` por curso (`statsDeCurso`) y expone tres
funciones — `getTrackStats()` (cobertura por tramo UFBI/Facultad, todos los cursos),
`getLanzamiento()` (sólo los 7 prioritarios, con `pendientes: Pendiente[]` por actividad) y
`getAportes()` (crédito por persona, reparte resúmenes en partes iguales entre `materialDe` de un
curso; `APORTE_OVERRIDE` reasigna actividades sueltas). La cobertura (`SlotStats.cobertura`) se
calcula sólo sobre `listo + falta` — lo `no-aplica` sale del denominador, así una tarjeta que
nunca debió existir no castiga el porcentaje. Además de `resumen` y `banqueo`, cada curso/tramo
lleva `examenes: SlotStats`: el mismo recuento de banqueo pero restringido a las evaluaciones, que
es el que se muestra aparte por ser el material más buscado. `AporteColaborador.banqueosRecolectados`
es la parte de sus banqueos que declaró como conseguida, y sale **sólo** de las marcas.

**Quién arma el banqueo** — `BANQUEO_ARMADO_DE` en `aportes.ts`, por `slug` de curso: el default
es `bust` (monta los bancos del bucket y los solucionarios), y la tabla es la excepción
(`fisica-medicina: 'ufbi-1'`, los propuestos de las clases). No se aplica a las **evaluaciones**
(`plan.esExamen`): la PC de otro año se consigue, no se arma, y quién la consiguió sólo se sabe si
lo marca. Cualquier marca manda sobre este default.

**`AportesPanel.tsx`**: hero «Listo para lanzar» con los 7 cursos prioritarios primero. El
**banqueo es la métrica protagonista** (barra gruesa verde `45, 201, 154` y % grande; el material
escrito va debajo con el acento del tramo, y el video ni se mide). Las barras miden **sólo
completo/incompleto** — ningún color de aquí habla de personas ni de tipos de aporte, que viven en
el registro de abajo. KPIs: exámenes sin banqueo (rojo si hay), clases sin banqueo, sin material
escrito, cursos completos. Cada curso es una
tarjeta `<details>` expandible con dos barras en la cabecera (Banqueo/Escrito) y los pendientes
agrupados en tres grados —«Exámenes sin banqueo» rojo, «Sin material escrito» naranja, «Clases sin
banqueo» ámbar—, nunca una lista plana de huecos idénticos, que en un curso al 0% no informa nada.
En las filas de examen se muestra la categoría (`examenLabel`) en vez de la semana: distingue una
fila de otra mucho mejor que «Semana 14». Debajo, cobertura completa por tramo para el resto de
cursos. Estilos en `src/styles/aportes.module.css`, light+dark.

**Registro de personas** — `src/lib/data/aportes.ts`: `COLABORADORES` (nombre, rol, **color único
por persona**, `email?`, pools) y `CURSOS` (slug, track, `materialDe: Colaborador[]`). El color es
la identidad visual de cada uno en todo el panel; el correo es lo que le permite marcar sus
aportes (`colaboradorDeEmail`) — ya lo tienen las cinco personas, así que nadie depende del admin
para firmar lo suyo. El banqueo y los laboratorios nunca se declaran a mano ahí: son el reparto
*por defecto* (`BANQUEO_ARMADO_DE` o `bust`, y el `autor` del lab) y se cuentan directo de los
sílabos/`LABORATORIOS`.

**Quién subió qué — marcas de autoría** (`src/components/RegistroAportes.tsx`, única parte
interactiva del panel). El resto se deduce del repo; la autoría no está en ningún archivo, así que
cada persona la declara pintando el círculo del material que subió:

- **Sólo se marca lo publicado** (`marcable()` = `estado === 'listo'`). Un círculo sobre material
  que aún no existe no tiene dueño posible: invitaba a reclamar algo que nadie subió y hacía leer
  la fila como si ese material ya estuviera en la web (C9 de Física ofrecía «Resumen» sin que
  hubiera PDF). Los huecos se ven en la cobertura de arriba, no aquí — por eso `SlotRegistro` ya
  no lleva `estado`.
- **Granularidad**: por actividad × slot. Cursos → un círculo por tarjeta publicada de cada
  actividad (Resumen / Banqueo / Simulación); laboratorios e histología → un círculo por pieza
  (`slot: 'material'`). El inventario lo arma `src/lib/aportes-registro.ts` desde las mismas
  fuentes que la cobertura (`SILABOS`, `LABORATORIOS`, `HISTO_CURSOS`) y lo pasa **plano** al
  cliente — `HISTO_CURSOS` trae íconos JSX que no cruzan la frontera servidor→cliente.
- **Selector de curso**: dos columnas, una por facultad (UFBI / Facultad) — los dos tramos se
  cursan en sitios distintos, mezclarlos en una fila de chips obligaba a leerlos todos. Dentro de
  cada columna manda `PRIORIDAD_LANZAMIENTO` (Física, Química, Biología… con su número visible),
  no el alfabeto; el orden lo aplica `getRegistroCursos()` en el servidor y cada curso lleva su
  `prioridad`. La viñeta de cada fila es un anillo `conic-gradient` con el avance de marcado de
  ese curso, verde cuando ya está completo.
- **Armado vs. recolectado** (`OrigenMarca` en `aportes-marcas.ts`, columna `origen` de la tabla):
  en el slot `banqueo` el popover pregunta «¿cómo llegó?» — *Lo armé* (banco de preguntas,
  solucionario, ejercicios propios) o *Lo conseguí* (PC o examen de otro año en PDF, subido tal
  cual). En los demás slots no aplica: un resumen o un lab siempre se produce. El círculo marcado
  como recolectado lleva **aro ámbar** `#c79a3b` en el borde, nunca en el relleno — el relleno es
  la identidad de la persona y taparlo perdería el dato de quién lo subió. Se puede cambiar de
  tipo sin desmarcar: el botón pasa a «Cambiar a esta opción» y el `upsert` del servidor va **sin**
  `ignoreDuplicates`, o la fila existente se ignoraría y el cambio no surtiría efecto.
- **Co-autoría**: varias marcas sobre el mismo slot son válidas; el círculo se parte en sectores
  (`conic-gradient`) y `getAportes()` divide esa unidad entre los firmantes. Cada firmante lleva su
  propio `origen`, así que dos personas pueden declarar cosas distintas sobre el mismo banqueo.
- **Precedencia**: lo marcado manda sobre el reparto declarado en `aportes.ts`, que queda como
  estimación para que el panel no salga vacío antes de que el equipo marque. Histología no declara
  autor en ningún sitio: sólo cuenta lo marcado.
- **Permisos**: cada uno marca y desmarca lo suyo; el admin corrige cualquier marca y es el único
  que puede marcar por alguien sin cuenta. Se comprueba en `/api/aportes/marcas`, no en RLS.
- **Persistencia**: tabla `aportes_marcas` en Supabase (única por
  `ambito+scope_id+item_id+slot+colaborador`, más la columna `origen` con CHECK
  `armado|recolectado`, NULL fuera del banqueo), **RLS activo y sin políticas**: el navegador nunca
  la toca. Todo pasa por `src/lib/aportes-marcas-server.ts` con la service role key. Tipos
  compartidos cliente/servidor en `src/lib/aportes-marcas.ts` (`claveMarca`, `indexarMarcas`,
  `firmantesDe`); el índice mapea clave → `Firma[]` (colaborador + origen), no una lista de
  nombres.
- **UI**: escritura optimista + `router.refresh()` para recalcular «Aportes por persona»,
  resincronización al volver el foco a la pestaña, y **cada acción pasa por un popover de
  confirmación** («Se guarda para todo el equipo») porque una marca ajena no se puede deshacer
  desde el código.

---

## Flujo de autenticación

1. Login en `/auth/login` → Supabase Auth
2. `dashboard/layout.tsx` (RSC) verifica sesión, plan y dispositivo
3. Redirecciones: `/auth/clear-device` (sesión revocada) o `/auth/device-limit` (límite de dispositivos)
4. El plan se inyecta via `PlanProvider` a todo el árbol del dashboard

---

## Sistema de Investigación (juego gamificado de 14 niveles)

Sección `dashboard/investigacion`: mapa serpenteante (estilo Duolingo) donde cada nodo es la plataforma "punto de guardado" (`SavePointNode`). 14 niveles = 14 temas del curso; se desbloquean en orden (un nivel abre al completar el anterior al 100%).

**Motor** en `src/lib/investigacion/`:
- `types.ts` — tipos: `NivelMeta`, `NivelContenido`, `Bloque`, `TarjetaContenido`, `MinijuegoConfig` (unión discriminada por `tipo`), `BossConfig`, `ProgressState`, `FLOW_ORDER`. `intro` acepta opcionales `stats[]` (tarjetas flotantes del hero) y `destacados[]` (franja inferior). `TarjetaContenido` acepta opcionales `ilustracion` (clave de `<Ilustracion/>`) e íconos por ejemplo (`iconoCotidiano/iconoAcademico/iconoAbsurdo/iconoDato`, claves de `<Icono/>`); si faltan usan defaults por sección.
- `progress.ts` — persistencia localStorage clave `medgo-investigacion-progress` (patrón AnatExam: `defaultState`, `loadProgress`, `saveProgress`, `completeLevel`, `addXP`, `markStep`, `awardBadge`). `reconcile()` rellena niveles nuevos en estados guardados antiguos.
- `xp.ts` — XP (BLOQUE=10, MJ_1ER=50, MJ_2DO=25, BOSS=100, NIVEL=200) y `COLOR_BANDA` (fundamentos `#3B82F6`, desarrollo `#10B981`, análisis `#8B5CF6`, síntesis `#F59E0B`).
- `badges.ts` — 6 insignias.
- `niveles/index.ts` — `NIVELES` (14 metas) + `CONTENIDO`; `niveles/tema-NN.ts` = contenido por tema.

**Hooks**: `useInvestigacionProgress` (estado + hidratación), `useDragDrop` (Pointer Events + tap, extraído de `parametro-sangre-orina`).

**UI** en `src/components/investigacion/`: `NivelMap` + `SavePointNode` (mapa); `NivelRunner` (orquesta el flujo `intro → bloque1 → MJ-A → bloque2 → MJ-B → bloqueFinal → boss → completado` + capa decorativa `Destellos` de fondo), `NivelHUD`, `IntroNivel`, `BloqueView`, `TarjetaContenido`, `Ilustracion` (ilustraciones decorativas del header de ficha: `embudo`/`embudoFiltro`/`dados`), `Celebracion`, `XPFloat`, `BadgeUnlock`; `minijuegos/` (dispatcher `Minijuego` + 7 tipos data-driven + `BossChallenge` + `BolaCristal` para el minijuego de orden).

**Diseño visual (tema claro)**: fondo blanco con olas y destellos SVG (`Destellos` en `NivelRunner`, `.runner::before`/`.runnerDeco`). HUD, chips de XP/motivación y tarjetas usan **liquid-glass** (degradados blanco↔azul translúcido + `backdrop-filter`). La **intro** es un hero de dos columnas (contenido + visual de datos). El **bloque de teoría** son 3 cartas glassmorphism **inclinadas en abanico** (se enderezan al hover), conectadas por línea punteada + nodos, con acento por posición (azul/púrpura/verde) y secciones con color fijo por tipo (cotidiano azul / académico púrpura / olvidarlo naranja / dato verde). El grid de fichas (`.fichaGrid`) tiene variantes según cantidad: `.fichaGrid2` (2 fichas centradas, línea conectora solo entre ambas) y `.fichaGrid4` (4 fichas más juntas, hover atenúa/encoge las hermanas para dar espacio a la enfocada); 3 fichas usa el layout base. Todos los minijuegos usados por los niveles son paneles claros **autocontenidos** (no usan el `retoPanel` oscuro): en `NivelRunner`, el Set `AUTOCONTENIDOS` (`'orden'`, `'drag'`, `'vf'`, `'quiz'`, `'caso'`, `'mapa'`) del helper `esAutocontenido(config)` los renderiza directo con `onNext`; solo `'error'` (sin uso actual en ningún tema) sigue en el `retoPanel` oscuro. El botón único **Verificar → Continuar** anima el `min-width` con crossfade del texto (clases `mjOrdenContinuar`/`mjOrdenBtnLabel` compartidas). El drag tiene cabecera con `<OrbitaVerificacion/>`, chips azul intenso arrastrables (banco) y filas `número · slot "Suelta aquí" · conector · tarjeta con ícono+ejemplo`; cada par de `MJDrag` acepta opcionales `icono` (clave de `<Icono/>`) y `color` de acento por fila (fallback cíclico `FILA_ESTILO`). Los tipos `vf`/`quiz`/`caso`/`mapa` comparten las piezas de `minijuegos/MJLiteChrome.tsx` (`MJLiteStars`/`MJLiteHeader`/`MJLiteFooter`, clases `mjLite*`): icon-box degradado (vf=`balanza`, quiz=`idea`, caso=`portapapeles`, mapa=`mapa`), badge contador, aviso y footer con chips XP/motivación; en `quiz` y `caso` la interacción es **seleccionar → Verificar** (no evalúan al primer clic). **Importante**: los elementos arrastrables usan `<div role="button">` (no `<button>` nativo, que interfiere con el gesto de arrastre del `useDragDrop`); y en `useDragDrop`, `onDrop`/`disabled` se guardan en refs (`onDropRef`/`disabledRef`) para que `startDrag`/`onPointerMove`/`onPointerUp` sean estables — si `onDrop` se recreara en cada render del consumidor, el `useEffect` de limpieza correría a mitad del gesto y mataría el arrastre.

**BossChallenge** (panel temático propio, no el `retoPanel` genérico): marco HUD sci-fi dibujado por `<BossMarco/>`, un SVG cuyo `path` es una **copia exacta** de un SVG de referencia dado por el usuario (silueta con pestañas/muescas, no un rectángulo) — el `viewBox` debe recortarse al *bounding box* real del path si el archivo trae márgenes asimétricos, si no el contenido con padding se sale del marco en un lado. El minijefe (`Image` de `/investigacion/minijefe.avif`) se ancla `position: absolute` dentro de `.bossEscenario` con un `bottom` negativo para que las manos "se apoyen" en el borde superior de esa caja. Opciones A/B/C en octógono (`clip-path` de 8 vértices) con borde fino vía capa `::before`. El HUD (`NivelHUD`) acepta prop `boss` que tiñe de rojo la barra de XP y sustituye la estrella por `calavera-roja.webp`. El fondo cambia a una escena volcánica (`fondo-volcan.svg`, `position: fixed` a pantalla completa) con crossfade orgánico de opacidad activado por `step === 'boss'` en `NivelRunner`. Assets bitmap/SVG del boss en `public/investigacion/` (`minijefe.avif`, `calavera.webp`, `calavera-roja.webp`, `fondo-volcan.svg`, `borde-boss.svg`).

**Estilos**: mapa/nodos en `investigacion.module.css`; juego/minijuegos/animaciones en `investigacionGame.module.css`. Animaciones solo CSS; efectos complejos (confetti) como `div.animation-placeholder[data-animation]`.

**Íconos**: sin emojis. Registro de SVG line-art en `src/components/investigacion/Icono.tsx` (`<Icono name="..."/>`, `currentColor`, viewBox 24). El campo `icono` de cada `TarjetaContenido` y el `icono` de cada `Insignia` (`badges.ts`) son **claves** de ese registro (p. ej. `'microscopio'`, `'balanza'`, `'diana'`). Para un ícono nuevo, añadir una entrada al objeto `ICONOS` y usar su clave. **Reutiliza siempre los SVG/assets que el proyecto ya tiene o que el usuario adjunta como referencia exacta** (registro `ICONOS`, estrella dorada del HUD en `NivelHUD`, trofeo world-cup —viewBox 512, `currentColor`— compartido por `OrdenarSecuencia` y `DragConnect`, `<OrbitaVerificacion/>`, `<BossMarco/>`, `BolaCristal`, `<Ilustracion/>`); no inventes SVG decorativos nuevos si ya existe uno equivalente o si el usuario proporcionó un archivo de referencia — en ese caso transcribe su `path`/estructura tal cual, no una aproximación. Los SVG multicolor con degradados/filtros propios (estrella del HUD, órbita de verificación, marco del boss) se inline en su componente con **ids prefijados** para evitar colisiones. Las flechas `→`/`↔` dentro de textos son tipográficas, no íconos.

**Fuente en elementos interactivos**: los `<button>` no heredan `font-family` del `<body>` por defecto (usan la del navegador) — todo botón custom necesita `font-family: inherit` explícito o el texto sale en una tipografía distinta al resto del sitio. Revisar esto primero si un texto "no parece tener la fuente de la web". Relacionado: Outfit se carga con pesos `['400','500','600','700','800','900']` en `layout.tsx` — si se usa `font-weight: 900` en CSS sin ese peso cargado, el navegador simula negrita (faux-bold) y se ve visualmente distinto al resto.

**Para crear un nivel nuevo (tema-NN)**: crear `src/lib/investigacion/niveles/tema-NN.ts` (mismo shape que `tema-01.ts`), registrarlo en `CONTENIDO` y poner `disponible: true` en `NIVELES`. No se toca el motor. Reglas de contenido: por concepto, 3 ejemplos (académico / cotidiano inesperado / absurdo memorable) + un "dato que sorprende".

---

## Simulación del frotis sanguíneo (Hematología · Práctica 1)

Único módulo del proyecto que **no es React**: HTML autocontenido con Three.js (importmap CDN) en `public/simulaciones/frotis-sanguineo.html`. Se embebe en un iframe desde `src/components/FrotisSimFrame.tsx` (client component; `page.tsx` sólo pone la `metadata` y monta `<FrotisSimFrame/>`), estilos en `src/styles/frotisSim.module.css`.

**Modo «flow» (todos los pasos, altura dinámica del iframe).** Ningún paso se encierra ya en una caja de `100dvh` con scroll interno: el documento del iframe crece con su contenido real y el propio iframe se redimensiona a esa altura vía `postMessage`, de modo que es la página del dashboard la que scrollea (sidebar fijo), no una barra dentro del panel.
- Dentro del iframe: `body.flowMode` (siempre activo) + `body.embedded` (si `window.parent !== window`) sueltan `#app`/`.step`/`.panel` a `height:auto;overflow:visible`. Un `ResizeObserver` sobre `#app` llama a `reportSize()` en cualquier cambio (pestañas, `<details>`, imágenes cargando, ejercicio que reemplaza a la teoría) y hace `postMessage({source:'medgo-frotis-sim', type:'size', height})`.
- Las escenas 3D no pueden dimensionarse con `vh`: dentro del iframe esa unidad mide al propio iframe, cuya altura sale del contenido — retroalimentaría el crecimiento. El dashboard manda su `window.innerHeight` real como `postMessage({type:'viewport', height})`, y el iframe lo guarda en la variable CSS `--vpH` (`.stage{height:clamp(340px, calc(var(--vpH,760px) * .58), 600px)}`).
- **Navegación Anterior/Siguiente vive en el dashboard** (`FrotisSimFrame.tsx`, `.navBar` con `position:sticky;bottom:0`), no en el `<footer>` del iframe — un footer al final de un documento más alto que el viewport quedaría fuera de vista. El `<footer>` propio del HTML se oculta con `body.embedded > #app > footer{display:none}` y sigue disponible sólo en «Abrir a pantalla completa». El puente es un protocolo `postMessage` de ida y vuelta: el iframe emite `{type:'nav', cur, total, canPrev, nextLabel, hint, scrollTop}` en cada `go(i)`; el dashboard dibuja los botones y, al pulsarlos, manda `{target:'medgo-frotis-sim', type:'prev'|'next'}` de vuelta.
- **Sincronización de arranque**: el primer `go(0)` puede emitirse antes de que el dashboard monte su listener (carrera de montaje) y perderse — eso dejaba la portada sin botón «Siguiente». `FrotisSimFrame` pide el estado explícitamente con `{type:'sync'}` tanto en `onLoad` del iframe como al montar el componente (cubre Fast Refresh); el iframe responde repitiendo `reportNav()`/`reportSize()`.

7 pasos con barra de progreso: portada (vaso sanguíneo) → extendido (slider de ángulo 0–90°) → zonas cabeza/cuerpo/cola (raycast al hover) → tinción de Wright (5 etapas cronometradas + cuestionario) → morfología eritrocitaria (microfotografías reales, **sin escena 3D**) → plaquetas (10 campos + recuento ×2, ocular circular) → cierre (repaso de puntos clave + mini-quiz, **sin escena 3D**).

**Layout de cada paso — nada de scroll para lo interactivo.** Bajo cada modelo 3D (`.stageCol`) va el material de lectura apilado (fundamento/materiales/«por qué importa», como `<details class="teoria seccion">` plegables); la columna derecha (`.panel`) empieza directamente por lo que el alumno manipula (slider, cronómetro, recuento), sin tener que bajar. Los pasos 3 y 5 llevan además `.stepHead` — título + presentación/datos de referencia en una fila propia a ancho completo *sobre* las dos columnas, para que el panel derecho arranque a la altura del modelo. Preguntas largas (paso 3: defectos de tinción) siguen el patrón «leer primero, responder después» del paso 4: un `.gate` con botón que, al pulsarlo, **reemplaza** la escena por el cuestionario (no lo apila debajo) — mismo helper `abrirPuerta()` o intercambio manual de clases `oculto` según el caso.

**Vocabulario visual — evitar que todo sea la misma tarjeta gris.** Además de `.card`, hay bloques con forma propia según lo que contienen, todos toman su color de `--acc` (variable por `<section style="--acc:#hex">`, distinta por paso): `.destacado` (nota clave, barra de acento lateral, variantes `.warn`/`.ok`/`.acento`), `.fichaDatos` (constantes numéricas en filas etiqueta→valor con cifras tabulares), `.consola` (el único bloque interactivo del paso: mando + sus lecturas, borde y fondo teñidos de `--acc`), `.listaNum` (secuencias donde el orden importa, círculo numerado), `.listaCheck` (criterios que se cumplen, marca ✓), `.leyenda` (identifica por color lo que se ve en la escena), `.metricas` (valores calculados, cifra grande) y `.bloque` (encabezado con filete, sin caja — para cuando ni una tarjeta hace falta). Antes de añadir una tarjeta genérica nueva, comprobar si alguno de estos ya calza con el contenido.

**Cuestionarios — la opción correcta no puede ser sistemáticamente la más larga.** Regla dura: en cada `renderQuiz(...)`, la respuesta correcta debe caer como la más larga de las 4 opciones en **como mucho 1 de cada 10 preguntas** (y por simetría, tampoco la más corta sistemáticamente — invertir el sesgo es el mismo problema). Se corrige dando a los distractores la misma especificidad que a la correcta (rangos numéricos, unidades, detalle clínico) en vez de dejarlos telegráficos. Antes de tocar preguntas, medir el sesgo real con un script que decodifique entidades HTML y quite tags (`&lt;`/`&gt;`→`<`/`>`) — la longitud del *markup* no es la longitud que ve el alumno.

**Cierre (paso 7) — sin 3D, carrusel de 6 puntos clave en CSS puro.** El eritrocito de muestra que orbitaba de fondo (`SCENES.cierre`, malla 12×64 con `MeshPhysicalMaterial`) se eliminó entero: el resumen es información, no un objeto que explorar, y no vale la pena una escena sólo decorativa. En su lugar, `.repaso` es un carrusel de `<article class="pk">` (uno por punto clave: ángulo, zonas, tinción, buena tinción/defectos, tamaño de eritrocitos, plaquetas) que comparten la misma celda de grid (`.repasoViewport{display:grid}`, todas en `grid-area:1/1`) para que cambiar de ficha no mueva el alto del bloque. Transición `fade+slide` por `opacity`/`transform` (compuesta por GPU, sin reflow) y entrada escalonada del contenido interno vía `--i` + `animation-delay`. El botón «Iniciar cuestionario final» empieza oculto (`.ctaZona`, sin tarjeta alrededor) y sólo aparece —con fade + slide-up— cuando se han visto los 6 puntos (`Set` de vistos, no basta con llegar al último); la zona reserva `min-height` desde el inicio para que la aparición no cause CLS. Respeta `prefers-reduced-motion`.

**Un solo `WebGLRenderer` compartido**: el canvas se reubica en el `<div class="stage">` del paso activo (objeto `SCENES`, `mountScene`); sólo se actualiza y dibuja la escena visible. La función `sincronizarEscena()` centraliza el criterio: si el `.stage` del paso actual no está realmente visible (paso 4, paso 3 con el cuestionario abierto, cierre) suelta el canvas y detiene el bucle en vez de dejar una escena corriendo invisible — se llama tanto desde `go()` como desde cualquier intercambio manual escena↔cuestionario dentro de un mismo paso.

**Eritrocito — `makeEritrocito(radius, profileSegments, radialSegments)`**: disco bicóncavo real por `LatheGeometry` (perfil revolucionado), no un toroide; el polinomio de `semiEspesor()` da diámetro:espesor ≈ 3,05:1 y hundimiento central ≈ 32 %, proporciones reales. Cuatro niveles de detalle elegidos por tamaño en pantalla y ángulo de vista — **no subir su resolución** sin recalcular el coste (`verts=(radial+1)*2*(perfil+1)`, `tris=radial*(2*(perfil+1)-1)*2`; a resolución de referencia clínica el paso 2 pediría 48 millones de triángulos/frame):
- `GEO.rbc` 12×28 — vaso (las células voltean, se ven de canto).
- `GEO.rbcField` 4×24 — paso 5 (sólo en planta; presupuesto en segmentos radiales, no en perfil).
- `GEO.rbcLow` 5×10 — zonas del frotis (puntos de pocos píxeles).

**Presupuesto de rendimiento (medido):** pico 253 k triángulos/frame (escena `vaso`), **197 KB de VRAM** en toda la simulación, archivo estático 121 KB (34 KB gzip) — el servidor no interviene, todo el 3D se genera en el navegador al cargar (~3 ms de CPU). Reglas que sostienen esto: las células **se reciclan, nunca se crean/destruyen** (`InstancedMesh` de tamaño fijo); en `vaso`, `Z_OUT` recicla justo detrás de la cámara, no al final del tubo invisible; el endotelio es **una** `InstancedMesh`, no N mallas sueltas.

**Paso 4 — sin 3D, pestañas + ejercicio que sustituye.** El panel (`.p4`) tiene la teoría en un `<details>` plegado y las tres categorías (tamaño/color/forma) como **pestañas** (sólo una rejilla visible a la vez). El ejercicio de clasificación **sustituye** a las fichas en vez de apilarse debajo (`mostrarEjercicio()`, oculta teoría+tabs+fichas y muestra `#wrapMorfo`). Orden de cada ficha: encabezado → microfotografía → texto; las fichas ganan elevación + borde teñido de `--acc` al hover. Imágenes reales en `public/simulaciones/frotis-img/` con nombres fijos (`a1-microcitosis`, `a2-normocitosis`, `a3-macrocitosis`, `b1-hipocromia`, `b2-normocromia`, `b3-hipercromia`, `c1-drepanocitos`); `resolveMicro()` sonda jpg/jpeg/png/webp/avif una vez por id y si no existe ninguna pinta «Imagen pendiente» — añadir una imagen no requiere tocar código (ver `LEEME.txt` de esa carpeta). Las microfotografías se muestran a su relación de aspecto real (`figure.micro img{height:auto}`, sin `max-height`+`object-fit` que recorte y deje franjas de fondo a los lados).

**Paso 5 — ocular circular.** El lienzo se reduce al cuadrado inscrito (`circular:true` en la escena, clase `.sq`) en vez de cubrir todo el panel. La viñeta sólo oscurece del 88 % al 100 % del radio, y las células se siembran **dentro** de ese radio menos su propio tamaño — necesario para que ninguna plaqueta quede oculta y falsee el conteo. La escena no acepta orbitar.

**Modo claro/oscuro propio:** al ser un HTML aparte, no hereda `.dark-mode` del dashboard — lee el mismo `localStorage('medgo-dark')` vía tokens CSS (`:root` claro por defecto, `:root.dark` override) con un script inline síncrono en el `<head>` y un listener de `storage` para resincronizar en vivo. Los colores 3D no cambian por tema (igual que el resto de visores de microscopio del sitio).

**Tarjeta «Simulación»**: `StudyMaterialSection` acepta `simulacion?: { href?: string; desc?: string }`, que sustituye la tarjeta **Video** por una con el ícono beaker. Sólo se activa en las prácticas LAB de Hematología — `hematologia/[id]/page.tsx` pasa `simulacion={isLab ? (act.simulacion ?? {}) : undefined}` y el campo `simulacion` vive en cada actividad de `src/lib/data/hematologia.ts`. Sin `href` la tarjeta queda como «Próximamente». Evento de analítica `simulacion_abierta` (whitelist duplicada en `src/lib/analytics.ts` y `src/app/api/track/route.ts`).

---

## Simulación del microscopio virtual (Hematología · Práctica 2) — ⚠️ INCOMPLETA

**Estado: falta terminar.** La estructura e interacción están construidas, pero **faltan las 2 imágenes panorámicas reales y las coordenadas de las células**, que el usuario debe proveer. Hasta entonces el ocular muestra un placeholder gris ("Coloca aquí: `<archivo>`.jpg").

HTML autocontenido (sin React, mismo criterio que el frotis) en `public/simulaciones/microscopio-hematologia.html`, embebido vía `MicroscopioHematologiaFrame.tsx` (modo flow, altura dinámica por `postMessage`, sin barra de navegación por pasos porque es una sola pantalla continua, no un flujo). Enlazado desde `hematologia.ts` (`lab-2`, con `simulacion.href`) y desde `LAB_TOPICS` de `laboratorio/page.tsx`.

**Mecánica de pan/zoom**: en vez de `transform: translate()/scale()` sobre un `<img>`, usa `background-position`/`background-size` en porcentaje sobre un único `<div class="lens">` — el pan (0–100%) y el punto de imagen bajo el centro del ocular se derivan con fórmulas puramente algebraicas (`kFor`/`panToPoint`/`centerToPan` en el `<script>`), sin necesitar las dimensiones reales en píxeles de la imagen (solo un `aspect` configurable, 1.5 por defecto = 3000×2000). Esto es lo que hace posible construir toda la interacción antes de tener las imágenes.

**Enfoque**: cambiar de objetivo dispara un salto de blur 8px→valor-actual (vía transición CSS en `filter`); a 40X/100X ese valor depende de la perilla manual (`#focusSlider`) contra un `idealTarget` aleatorio por objetivo — hay que afinarla para poder identificar (blur < 0.6px). A 10X siempre está enfocado (sin minijuego), y solo ahí se comprueba la "zona ideal" (`idealZones10x`, glow verde en el ocular).

**Identificación**: clic en el ocular solo activo a 100X + enfocado; convierte el clic a coordenada relativa de imagen y busca la célula más cercana dentro de un radio de tolerancia. El panel lateral («Identificación» / «Teoría», pestañas) muestra nombre/tamaño/características o, en Modo Quiz, una rejilla de 9 opciones fijas (las 6 de sangre periférica + las 3 de médula, a propósito, para que distinguir cuáles no pertenecen a la laminilla actual sea parte del reto) con verificación y feedback citando la característica clave. El botón "Ver imagen de referencia" no usa una imagen aparte por célula: recorta la misma panorámica centrada en las coordenadas de esa célula con un `zoomBgSize` fijo alto.

**Pendiente para completar la práctica**:
- Las 2 imágenes panorámicas reales en `public/simulaciones/microscopio-hematologia-img/` (`lamina-sangre-periferica` y `lamina-medula-osea`, ver su `LEEME.txt`).
- Recalibrar en `LAMINAS` (dentro del HTML) las coordenadas `x`/`y` (0–1) de cada célula y de `idealZones10x` contra las imágenes reales — las actuales son placeholder repartidas a mano.

---

## Editor de Modelado 3D (`dashboard/modelado`, solo admin)

Editor visual 3D sin código, construido con Three.js + React Three Fiber + drei. Visible y accesible **únicamente** para `isAdminEmail` (`src/lib/admin.ts`) — mismo guard que `dashboard/admin`: `page.tsx` (RSC) hace `redirect` a login si no hay sesión y `notFound()` si el email no es admin. En la sidebar, `MODELADO_ITEM` (ícono cubo 3D) se inserta solo con `isAdmin`, justo antes de `ADMIN_ITEM`.

`ModeladoClient.tsx` carga `Editor3D.tsx` con `next/dynamic` y `ssr: false` — el `Canvas` de R3F no soporta SSR. Toda la lógica vive en `Editor3D.tsx` (un solo archivo grande, sin dividir en componentes adicionales) + `src/styles/modelado.module.css` (liquid-glass, light+dark).

**Figuras**: catálogo de 6 primitivas (cubo/esfera/cilindro/cono/toro/cápsula) en una toolbar superior — arrastrables (drag HTML5, raycast a plano `y=0`) o clic para añadir. Cada `Figura` tiene `redondez` (curvatura/suavidad, sube segmentos radiales) y tres deformadores `doblar`/`torcer`/`estrechar` (-1..1) aplicados en `aplicarDeformacion()` sobre los vértices del eje Y local (orden taper → twist → bend; `doblar=1` = anillo completo, ~50% = herradura). Al deformar, la geometría sube su segmentación vertical para curvar suave. Todos los valores tienen slider **y** `input type="number"` editable, y los deformadores también se pueden arrastrar directo sobre la figura en el modo **"Deformar"** de la barra (horizontal dobla, vertical estrecha, Shift+horizontal tuerce).

**Unir/Separar**: selección múltiple (Ctrl/Shift+clic) → "Unir" reparenta las figuras a un grupo nuevo (transform mundial vía `Matrix4.compose/decompose`); "Separar" invierte la operación. `TransformControls` (mover/rotar/escalar) se adjunta al nodo de la unidad activa vía un mapa `id → Object3D` en ref.

**Importar/Exportar**: botón "Importar" carga un `.glb`/`.gltf` propio (`GLTFLoader`, sin soporte Draco), fusiona sus mallas en una geometría editable (registro module-level `GEOS_IMPORTADAS`, fuera del estado React) y la trata como una figura más. "Exportar GLB" limpia la malla (quita UVs sin usar, suelda vértices con `mergeVertices`) antes de generar el archivo — export optimizado por defecto.

**Deshacer/Rehacer**: toda mutación de la escena pasa por `mutar(fn, coalesce?)`, que apila snapshots en un historial (ref, tope 60); ráfagas de la misma interacción (arrastre de un slider) comparten `coalesce` y cuentan como un solo paso. Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y + botones en la barra.

**Persistencia**: localStorage `medgo-modelado-escena`, incluye las geometrías importadas serializadas a base64.

No se toca el motor para casos de uso nuevos de "editar formas" — es autocontenido; solo se extendería si se pide un tipo de deformación o primitiva adicional.
